import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  MoreVertical,
  Clock,
  CheckCheck,
  Check,
  Bot,
  FileText,
  BarChart3,
  AlertTriangle,
  Settings,
  Users,
  Calendar,
  Timer,
  TrendingUp,
  MessageSquare,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";

import {
  mockContatos,
  mockMensagens,
  mockTemplates,
  mockMetrics,
  whatsappPermissions,
  type WhatsAppContact,
  type WhatsAppMessage,
  type WhatsAppTemplate,
} from "@/lib/whatsapp-data";
import {
  whatsappService,
  formatTimestamp,
  lgpdHelpers,
  isDentroExpediente,
} from "@/lib/whatsapp-service";
import { mockAgendamentos } from "@/lib/mock-data";

export const Route = createFileRoute("/whatsapp")({
  component: WhatsAppPage,
});

function WhatsAppPage() {
  const { user } = useAuth();
  const role = user?.role ?? "paciente";
  const permissoes = whatsappPermissions[role];

  // Estados
  const [contatos, setContatos] = useState<WhatsAppContact[]>(mockContatos);
  const [mensagens, setMensagens] = useState<WhatsAppMessage[]>(mockMensagens);
  const [contatoSelecionado, setContatoSelecionado] = useState<WhatsAppContact | null>(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [busca, setBusca] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateSelecionado, setTemplateSelecionado] = useState<WhatsAppTemplate | null>(null);
  const [variaveis, setVariaveis] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<string>(role === "administrador" ? "metricas" : "conversas");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtra contatos baseado na busca e role
  const contatosFiltrados = useMemo(() => {
    let lista = contatos;
    
    // Médicos só veem pacientes
    if (role === "medico") {
      lista = lista.filter(c => c.tipo === "paciente");
    }
    
    if (busca) {
      lista = lista.filter(c => 
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.telefone.includes(busca)
      );
    }
    
    return lista;
  }, [contatos, busca, role]);

  // Mensagens do contato selecionado
  const mensagensContato = useMemo(() => {
    if (!contatoSelecionado) return [];
    return mensagens
      .filter(m => m.contatoId === contatoSelecionado.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [mensagens, contatoSelecionado]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagensContato]);

  // Envia mensagem
  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !contatoSelecionado || !permissoes.podeEnviarMensagem) return;

    // Verifica dados sensíveis
    if (lgpdHelpers.contemDadosSensiveis(novaMensagem)) {
      toast.error("A mensagem contém termos sensíveis. Evite enviar dados clínicos pelo WhatsApp.");
      return;
    }

    setEnviando(true);
    try {
      const msg = await whatsappService.enviarMensagem(contatoSelecionado.id, novaMensagem);
      setMensagens(prev => [...prev, msg]);
      setNovaMensagem("");
      toast.success("Mensagem enviada!");
    } catch {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  // Envia template
  const handleEnviarTemplate = async () => {
    if (!templateSelecionado || !contatoSelecionado) return;

    setEnviando(true);
    try {
      const msg = await whatsappService.enviarTemplate(
        contatoSelecionado.id,
        templateSelecionado.id,
        variaveis
      );
      setMensagens(prev => [...prev, msg]);
      setTemplateDialogOpen(false);
      setTemplateSelecionado(null);
      setVariaveis({});
      toast.success("Template enviado!");
    } catch {
      toast.error("Erro ao enviar template");
    } finally {
      setEnviando(false);
    }
  };

  // Envia aviso de atraso (médicos)
  const handleEnviarAtraso = async (tempo: number) => {
    if (!contatoSelecionado || role !== "medico") return;

    try {
      const msg = await whatsappService.enviarAvisoAtraso(
        contatoSelecionado.id,
        contatoSelecionado.nome,
        user?.nome ?? "Médico",
        tempo
      );
      setMensagens(prev => [...prev, msg]);
      toast.success("Aviso de atraso enviado!");
    } catch {
      toast.error("Erro ao enviar aviso");
    }
  };

  // Envia pós-consulta (médicos)
  const handleEnviarPosConsulta = async () => {
    if (!contatoSelecionado || role !== "medico") return;

    try {
      const msg = await whatsappService.enviarPosConsulta(
        contatoSelecionado.id,
        contatoSelecionado.nome
      );
      setMensagens(prev => [...prev, msg]);
      toast.success("Mensagem pós-consulta enviada!");
    } catch {
      toast.error("Erro ao enviar mensagem");
    }
  };

  // Renderiza badge de status da mensagem
  const renderStatusMensagem = (msg: WhatsAppMessage) => {
    if (msg.tipo !== "enviada") return null;
    switch (msg.status) {
      case "enviando":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "enviada":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "entregue":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "lida":
        return <CheckCheck className="h-3 w-3 text-info" />;
      default:
        return null;
    }
  };

  // Renderiza visualização para pacientes (somente leitura)
  if (role === "paciente") {
    return (
      <AppLayout>
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Minhas Notificações
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Histórico de mensagens recebidas da clínica
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Mensagens Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mensagens
                  .filter(m => m.tipo === "enviada" || m.tipo === "bot")
                  .slice(-10)
                  .reverse()
                  .map(msg => (
                    <div key={msg.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {msg.tipo === "bot" ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{msg.conteudo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.timestamp).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Confirmar Consulta</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Reagendar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Central WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {role === "administrador" 
                ? "Gerencie conversas, templates e métricas de comunicação"
                : role === "medico"
                  ? "Envie avisos e mensagens pós-consulta aos seus pacientes"
                  : "Confirme consultas e gerencie comunicação com pacientes"
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isDentroExpediente() ? "default" : "secondary"} className="gap-1">
              <div className={cn(
                "h-2 w-2 rounded-full",
                isDentroExpediente() ? "bg-success" : "bg-muted-foreground"
              )} />
              {isDentroExpediente() ? "Expediente ativo" : "Fora do expediente"}
            </Badge>
            {!isDentroExpediente() && (
              <Badge variant="outline" className="gap-1">
                <Bot className="h-3 w-3" />
                Chatbot ativo
              </Badge>
            )}
          </div>
        </div>

        {/* Alerta LGPD */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {lgpdHelpers.avisoLGPD}
          </AlertDescription>
        </Alert>

        {/* Tabs para diferentes visões */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList>
            <TabsTrigger value="conversas" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            {permissoes.podeUsarTemplates && (
              <TabsTrigger value="templates" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
            )}
            {permissoes.podeVerMetricas && (
              <TabsTrigger value="metricas" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Métricas
              </TabsTrigger>
            )}
            {permissoes.podeGerirTemplates && (
              <TabsTrigger value="config" className="gap-1.5">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            )}
          </TabsList>

          {/* Aba de Conversas */}
          <TabsContent value="conversas" className="mt-4">
            <Card className="overflow-hidden">
              <div className="flex h-[600px]">
                {/* Lista de contatos */}
                <div className="w-80 border-r border-border flex flex-col">
                  <div className="p-3 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar contato..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    {contatosFiltrados.map((contato) => (
                      <button
                        key={contato.id}
                        onClick={() => setContatoSelecionado(contato)}
                        className={cn(
                          "w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                          contatoSelecionado?.id === contato.id && "bg-muted"
                        )}
                      >
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {contato.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          {contato.status === "online" && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm text-foreground truncate">
                              {contato.nome}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {contato.ultimaHora}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground truncate">
                              {contato.ultimaMensagem}
                            </span>
                            {contato.naoLidas ? (
                              <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[10px]">
                                {contato.naoLidas}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>

                {/* Área de conversa */}
                <div className="flex-1 flex flex-col">
                  {contatoSelecionado ? (
                    <>
                      {/* Header do chat */}
                      <div className="p-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {contatoSelecionado.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {contatoSelecionado.nome}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contatoSelecionado.telefone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Ações rápidas para médicos */}
                          {role === "medico" && permissoes.podeEnviarAtraso && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Timer className="h-4 w-4 mr-1" />
                                  Atraso
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEnviarAtraso(10)}>
                                  10 minutos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEnviarAtraso(15)}>
                                  15 minutos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEnviarAtraso(20)}>
                                  20 minutos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEnviarAtraso(30)}>
                                  30 minutos
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}

                          {role === "medico" && permissoes.podeEnviarPosConsulta && (
                            <Button variant="outline" size="sm" onClick={handleEnviarPosConsulta}>
                              <CheckCheck className="h-4 w-4 mr-1" />
                              Pós-consulta
                            </Button>
                          )}

                          {permissoes.podeUsarTemplates && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTemplateDialogOpen(true)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Template
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver perfil do paciente</DropdownMenuItem>
                              <DropdownMenuItem>Ver agendamentos</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Arquivar conversa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Mensagens */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                          {mensagensContato.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex",
                                msg.tipo === "enviada" && "justify-end",
                                msg.tipo === "recebida" && "justify-start",
                                msg.tipo === "bot" && "justify-end",
                                msg.tipo === "sistema" && "justify-center"
                              )}
                            >
                              {msg.tipo === "sistema" ? (
                                <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                  {msg.conteudo}
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "max-w-[70%] rounded-2xl px-4 py-2.5 relative",
                                    msg.tipo === "enviada" && "bg-primary text-primary-foreground rounded-br-md",
                                    msg.tipo === "recebida" && "bg-muted text-foreground rounded-bl-md",
                                    msg.tipo === "bot" && "bg-accent/50 text-foreground rounded-br-md"
                                  )}
                                >
                                  {msg.tipo === "bot" && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                                      <Bot className="h-3 w-3" />
                                      Resposta automática
                                    </div>
                                  )}
                                  <p className="text-sm leading-relaxed">{msg.conteudo}</p>
                                  <div className={cn(
                                    "flex items-center gap-1 mt-1",
                                    msg.tipo === "enviada" || msg.tipo === "bot" ? "justify-end" : "justify-start"
                                  )}>
                                    <span className={cn(
                                      "text-[10px]",
                                      msg.tipo === "enviada" ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                      {formatTimestamp(msg.timestamp)}
                                    </span>
                                    {renderStatusMensagem(msg)}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Input de mensagem */}
                      {permissoes.podeEnviarMensagem && (
                        <div className="p-3 border-t border-border">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEnviarMensagem();
                            }}
                            className="flex items-end gap-2"
                          >
                            <Textarea
                              placeholder="Digite sua mensagem..."
                              value={novaMensagem}
                              onChange={(e) => setNovaMensagem(e.target.value)}
                              className="min-h-[44px] max-h-32 resize-none"
                              rows={1}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleEnviarMensagem();
                                }
                              }}
                            />
                            <Button type="submit" disabled={!novaMensagem.trim() || enviando}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Selecione uma conversa para começar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aba de Templates */}
          {permissoes.podeUsarTemplates && (
            <TabsContent value="templates" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{template.nome}</CardTitle>
                        <Badge variant={template.aprovado ? "default" : "secondary"}>
                          {template.aprovado ? "Aprovado" : "Pendente"}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {template.categoria.replace("_", " ")}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {template.conteudo}
                      </p>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Variáveis: {template.variaveis.length}</span>
                        <span>Criado em {new Date(template.criadoEm).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Aba de Métricas (Admin) */}
          {permissoes.podeVerMetricas && (
            <TabsContent value="metricas" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Mensagens Enviadas"
                  value={mockMetrics.mensagensEnviadas.toLocaleString("pt-BR")}
                  icon={Send}
                  trend="+12%"
                />
                <MetricCard
                  title="Mensagens Recebidas"
                  value={mockMetrics.mensagensRecebidas.toLocaleString("pt-BR")}
                  icon={MessageSquare}
                  trend="+8%"
                />
                <MetricCard
                  title="Tempo Médio Resposta"
                  value={`${mockMetrics.tempoMedioResposta} min`}
                  icon={Timer}
                  trend="-15%"
                  positive
                />
                <MetricCard
                  title="Taxa de Confirmação"
                  value={`${mockMetrics.taxaConfirmacao}%`}
                  icon={CheckCheck}
                  trend="+5%"
                />
              </div>

              <div className="grid gap-4 mt-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Volume por Dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockMetrics.mensagensPorDia.map((dia) => (
                        <div key={dia.dia} className="flex items-center gap-3">
                          <span className="w-10 text-sm text-muted-foreground">{dia.dia}</span>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(dia.enviadas / 350) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{dia.enviadas}</span>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${(dia.recebidas / 350) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{dia.recebidas}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Enviadas
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        Recebidas
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Consultas Pendentes de Confirmação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockAgendamentos
                        .filter(a => a.status === "Pendente" || a.status === "Confirmado")
                        .slice(0, 5)
                        .map(a => (
                          <div key={a.id} className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                            <div>
                              <div className="font-medium text-sm">{a.paciente}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(a.data).toLocaleDateString("pt-BR")} às {a.hora}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Enviar lembrete
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Aba de Configurações (Admin) */}
          {permissoes.podeGerirTemplates && (
            <TabsContent value="config" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Chatbot Fora de Expediente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Horário de atendimento</span>
                      <span className="text-sm text-muted-foreground">07:00 - 19:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dias ativos</span>
                      <span className="text-sm text-muted-foreground">Seg - Sex</span>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar chatbot
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Segurança e LGPD
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Filtro de dados sensíveis</span>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Criptografia</span>
                      <Badge variant="default">End-to-end</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retenção de mensagens</span>
                      <span className="text-sm text-muted-foreground">90 dias</span>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar relatório LGPD
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Dialog para enviar template */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enviar Template</DialogTitle>
              <DialogDescription>
                Selecione um template aprovado e preencha as variáveis.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select
                  value={templateSelecionado?.id ?? ""}
                  onValueChange={(v) => {
                    const t = mockTemplates.find(t => t.id === v);
                    setTemplateSelecionado(t ?? null);
                    setVariaveis({});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.filter(t => t.aprovado).map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {templateSelecionado && (
                <>
                  <div className="p-3 rounded-lg bg-muted text-sm">
                    {templateSelecionado.conteudo}
                  </div>

                  {templateSelecionado.variaveis.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Preencha as variáveis</label>
                      {templateSelecionado.variaveis.map((v) => (
                        <div key={v} className="space-y-1">
                          <label className="text-xs text-muted-foreground capitalize">{v}</label>
                          <Input
                            placeholder={`Digite ${v}...`}
                            value={variaveis[v] ?? ""}
                            onChange={(e) => setVariaveis(prev => ({ ...prev, [v]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleEnviarTemplate}
                disabled={
                  !templateSelecionado ||
                  enviando ||
                  templateSelecionado.variaveis.some(v => !variaveis[v])
                }
              >
                {enviando ? "Enviando..." : "Enviar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

// Componente de card de métrica
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  positive,
}: {
  title: string;
  value: string;
  icon: typeof Send;
  trend: string;
  positive?: boolean;
}) {
  const isPositive = positive || trend.startsWith("+");
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            <TrendingUp className={cn("h-3 w-3", !isPositive && "rotate-180")} />
            {trend}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
