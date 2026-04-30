import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { laboratorioService } from "@/lib/laboratorio-service";
import { 
  catalogoExames, 
  laboratoriosParceiros,
  statusLabels, 
  statusColors,
  prioridadeLabels,
  type Exame,
  type CatalogoExame
} from "@/lib/laboratorio-data";
import { mockPacientes, mockMedicos } from "@/lib/mock-data";
import { 
  FlaskConical, 
  Search, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  QrCode,
  User,
  Calendar,
  Stethoscope,
  ClipboardList,
  Activity,
  TestTube,
  ImageIcon,
  ArrowRight,
  RefreshCw,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/laboratorio")({
  component: LaboratorioPage,
});

function LaboratorioPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AppLayout>
      {user.role === "medico" && <VisaoMedico />}
      {user.role === "recepcionista" && <VisaoRecepcionista />}
      {user.role === "paciente" && <VisaoPaciente />}
      {user.role === "administrador" && <VisaoAdministrador />}
    </AppLayout>
  );
}

// ============================================================
// VISÃO DO MÉDICO - Solicitar exames e ver resultados
// ============================================================
function VisaoMedico() {
  const [busca, setBusca] = useState("");
  const [modalSolicitar, setModalSolicitar] = useState(false);
  const [modalResultado, setModalResultado] = useState<Exame | null>(null);
  const [exames, setExames] = useState(laboratorioService.getExames());
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  // Form state
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [exameSelecionado, setExameSelecionado] = useState("");
  const [prioridade, setPrioridade] = useState<"normal" | "urgente">("normal");
  const [observacoes, setObservacoes] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("todas");

  const categorias = laboratorioService.getCategorias();
  const catalogoFiltrado = categoriaSelecionada === "todas" 
    ? catalogoExames 
    : catalogoExames.filter(c => c.categoria === categoriaSelecionada);

  const examesFiltrados = exames.filter(e => {
    const matchBusca = e.pacienteNome.toLowerCase().includes(busca.toLowerCase()) ||
                       e.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       e.codigo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || e.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const handleSolicitar = () => {
    if (!pacienteSelecionado || !exameSelecionado) return;

    const paciente = mockPacientes.find(p => p.id === pacienteSelecionado);
    if (!paciente) return;

    laboratorioService.solicitarExame({
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      medicoId: "m1",
      medicoNome: "Dr. Carlos Souza",
      catalogoExameId: exameSelecionado,
      prioridade,
      observacoes: observacoes || undefined
    });

    setExames(laboratorioService.getExames());
    setModalSolicitar(false);
    setPacienteSelecionado("");
    setExameSelecionado("");
    setPrioridade("normal");
    setObservacoes("");
  };

  const stats = laboratorioService.getEstatisticas();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Exames Laboratoriais
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Solicite exames e acompanhe os resultados dos seus pacientes.
          </p>
        </div>
        <Button onClick={() => setModalSolicitar(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Exame
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pendentes}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.concluidos}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.urgentes}</p>
                <p className="text-xs text-muted-foreground">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por paciente, exame ou código..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="solicitado">Solicitado</SelectItem>
            <SelectItem value="coletado">Coletado</SelectItem>
            <SelectItem value="em_analise">Em Análise</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Exames */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exames Solicitados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {examesFiltrados.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum exame encontrado.</p>
            ) : (
              examesFiltrados.map((exame) => (
                <div 
                  key={exame.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      exame.tipo === "imagem" ? "bg-purple-500/15" : "bg-blue-500/15"
                    )}>
                      {exame.tipo === "imagem" 
                        ? <ImageIcon className="h-5 w-5 text-purple-600" />
                        : <TestTube className="h-5 w-5 text-blue-600" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{exame.nome}</span>
                        {exame.prioridade === "urgente" && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">URGENTE</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {exame.pacienteNome} · {exame.codigo}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Badge className={cn("border text-xs", statusColors[exame.status])}>
                      {statusLabels[exame.status]}
                    </Badge>
                    {exame.status === "concluido" && (
                      <Button size="sm" variant="outline" onClick={() => setModalResultado(exame)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Resultado
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Solicitar Exame */}
      <Dialog open={modalSolicitar} onOpenChange={setModalSolicitar}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Exame</DialogTitle>
            <DialogDescription>
              Preencha os dados para solicitar um novo exame.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select value={pacienteSelecionado} onValueChange={setPacienteSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={prioridade} onValueChange={(v) => setPrioridade(v as "normal" | "urgente")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exame</Label>
              <ScrollArea className="h-[200px] border rounded-lg p-2">
                <div className="space-y-2">
                  {catalogoFiltrado.map((exame) => (
                    <div
                      key={exame.id}
                      onClick={() => setExameSelecionado(exame.id)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        exameSelecionado === exame.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {exame.tipo === "imagem" 
                          ? <ImageIcon className="h-4 w-4 text-purple-600" />
                          : <TestTube className="h-4 w-4 text-blue-600" />
                        }
                        <span className="font-medium text-foreground text-sm">{exame.nome}</span>
                        <Badge variant="outline" className="text-[10px] ml-auto">{exame.prazoResultado}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{exame.descricao}</p>
                      {exame.preparacao && (
                        <p className="text-xs text-amber-600 mt-1">Preparo: {exame.preparacao}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label>Observações clínicas (opcional)</Label>
              <Textarea 
                placeholder="Hipótese diagnóstica, indicação clínica, etc."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalSolicitar(false)}>Cancelar</Button>
            <Button onClick={handleSolicitar} disabled={!pacienteSelecionado || !exameSelecionado}>
              Solicitar Exame
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Resultado */}
      <ModalResultado exame={modalResultado} onClose={() => setModalResultado(null)} />
    </div>
  );
}

// ============================================================
// VISÃO DA RECEPCIONISTA - Gerenciar coletas e fluxo
// ============================================================
function VisaoRecepcionista() {
  const [exames, setExames] = useState(laboratorioService.getExames());
  const [busca, setBusca] = useState("");
  const [tabAtiva, setTabAtiva] = useState("pendentes");
  const [modalColeta, setModalColeta] = useState<Exame | null>(null);
  const [laboratorioSelecionado, setLaboratorioSelecionado] = useState("");
  const [modalResultado, setModalResultado] = useState<Exame | null>(null);

  const refresh = () => setExames(laboratorioService.getExames());

  const examesPendentes = exames.filter(e => 
    ["solicitado", "coletado", "em_analise"].includes(e.status) &&
    (e.pacienteNome.toLowerCase().includes(busca.toLowerCase()) || 
     e.codigo.toLowerCase().includes(busca.toLowerCase()))
  );

  const examesConcluidos = exames.filter(e => 
    e.status === "concluido" &&
    (e.pacienteNome.toLowerCase().includes(busca.toLowerCase()) || 
     e.codigo.toLowerCase().includes(busca.toLowerCase()))
  );

  const handleRegistrarColeta = () => {
    if (!modalColeta || !laboratorioSelecionado) return;
    laboratorioService.registrarColeta(modalColeta.id, laboratorioSelecionado);
    refresh();
    setModalColeta(null);
    setLaboratorioSelecionado("");
  };

  const handleSimularResultado = (exameId: string) => {
    laboratorioService.simularResultado(exameId);
    refresh();
  };

  const stats = laboratorioService.getEstatisticas();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Central de Exames
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie coletas, acompanhe status e receba resultados.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.solicitados}</p>
            <p className="text-xs text-muted-foreground">Aguardando Coleta</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.coletados}</p>
            <p className="text-xs text-muted-foreground">Coletados</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.emAnalise}</p>
            <p className="text-xs text-muted-foreground">Em Análise</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.concluidos}</p>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.urgentes}</p>
            <p className="text-xs text-muted-foreground">Urgentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por paciente ou código de requisição..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
        <TabsList>
          <TabsTrigger value="pendentes">
            Pendentes ({examesPendentes.length})
          </TabsTrigger>
          <TabsTrigger value="concluidos">
            Concluídos ({examesConcluidos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {examesPendentes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum exame pendente.</p>
                ) : (
                  examesPendentes.map((exame) => (
                    <div key={exame.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-foreground">{exame.pacienteNome}</span>
                            {exame.prioridade === "urgente" && (
                              <Badge variant="destructive" className="text-[10px]">URGENTE</Badge>
                            )}
                            <Badge className={cn("border text-xs", statusColors[exame.status])}>
                              {statusLabels[exame.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{exame.nome} · {exame.codigo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Solicitado em {new Date(exame.dataSolicitacao).toLocaleDateString("pt-BR")} por {exame.medicoSolicitanteNome}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {exame.status === "solicitado" && (
                            <Button size="sm" onClick={() => setModalColeta(exame)}>
                              Registrar Coleta
                            </Button>
                          )}
                          {exame.status === "coletado" && (
                            <Button size="sm" variant="outline" onClick={() => {
                              laboratorioService.marcarEmAnalise(exame.id);
                              refresh();
                            }}>
                              Enviar para Análise
                            </Button>
                          )}
                          {exame.status === "em_analise" && (
                            <Button size="sm" variant="secondary" onClick={() => handleSimularResultado(exame.id)}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Simular Resultado
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concluidos" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {examesConcluidos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum exame concluído.</p>
                ) : (
                  examesConcluidos.map((exame) => (
                    <div key={exame.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{exame.pacienteNome}</p>
                          <p className="text-sm text-muted-foreground">{exame.nome} · {exame.codigo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Resultado em {exame.dataResultado && new Date(exame.dataResultado).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setModalResultado(exame)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Resultado
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Registrar Coleta */}
      <Dialog open={!!modalColeta} onOpenChange={() => setModalColeta(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Coleta</DialogTitle>
            <DialogDescription>
              Confirme a coleta do material para o exame.
            </DialogDescription>
          </DialogHeader>
          {modalColeta && (
            <div className="py-4 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{modalColeta.pacienteNome}</p>
                <p className="text-sm text-muted-foreground">{modalColeta.nome}</p>
                <p className="text-xs text-muted-foreground mt-1">{modalColeta.codigo}</p>
              </div>
              <div className="space-y-2">
                <Label>Laboratório de destino</Label>
                <Select value={laboratorioSelecionado} onValueChange={setLaboratorioSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o laboratório" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratoriosParceiros
                      .filter(l => l.tipos.includes(modalColeta.tipo))
                      .map((lab) => (
                        <SelectItem key={lab.id} value={lab.nome}>{lab.nome}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalColeta(null)}>Cancelar</Button>
            <Button onClick={handleRegistrarColeta} disabled={!laboratorioSelecionado}>
              Confirmar Coleta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ModalResultado exame={modalResultado} onClose={() => setModalResultado(null)} />
    </div>
  );
}

// ============================================================
// VISÃO DO PACIENTE - Visualizar seus exames
// ============================================================
function VisaoPaciente() {
  const exames = laboratorioService.getExamesPorPaciente("p1"); // Simula paciente logado
  const [modalResultado, setModalResultado] = useState<Exame | null>(null);

  const examesPendentes = exames.filter(e => ["solicitado", "coletado", "em_analise"].includes(e.status));
  const examesConcluidos = exames.filter(e => e.status === "concluido");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Meus Exames
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe seus exames solicitados e acesse os resultados.
        </p>
      </div>

      {/* Exames Pendentes */}
      {examesPendentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {examesPendentes.map((exame) => (
              <div key={exame.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{exame.nome}</p>
                    <p className="text-sm text-muted-foreground">{exame.categoria}</p>
                  </div>
                  <Badge className={cn("border text-xs", statusColors[exame.status])}>
                    {statusLabels[exame.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(exame.dataSolicitacao).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    {exame.medicoSolicitanteNome}
                  </span>
                </div>

                {/* Status tracker */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", exame.status !== "cancelado" ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-0.5 flex-1", exame.status !== "solicitado" && exame.status !== "cancelado" ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-2 w-2 rounded-full", ["coletado", "em_analise", "concluido"].includes(exame.status) ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-0.5 flex-1", ["em_analise", "concluido"].includes(exame.status) ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-2 w-2 rounded-full", exame.status === "em_analise" || exame.status === "concluido" ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-0.5 flex-1", exame.status === "concluido" ? "bg-emerald-500" : "bg-muted")} />
                  <div className={cn("h-2 w-2 rounded-full", exame.status === "concluido" ? "bg-emerald-500" : "bg-muted")} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>Solicitado</span>
                  <span>Coletado</span>
                  <span>Em Análise</span>
                  <span>Pronto</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Exames Concluídos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Resultados Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {examesConcluidos.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Nenhum resultado disponível ainda.</p>
          ) : (
            <div className="space-y-3">
              {examesConcluidos.map((exame) => (
                <div 
                  key={exame.id} 
                  className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setModalResultado(exame)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{exame.nome}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resultado em {exame.dataResultado && new Date(exame.dataResultado).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ModalResultado exame={modalResultado} onClose={() => setModalResultado(null)} />
    </div>
  );
}

// ============================================================
// VISÃO DO ADMINISTRADOR - Dashboard completo
// ============================================================
function VisaoAdministrador() {
  const [exames, setExames] = useState(laboratorioService.getExames());
  const [modalResultado, setModalResultado] = useState<Exame | null>(null);
  const stats = laboratorioService.getEstatisticas();

  const handleSimularTodos = () => {
    exames.filter(e => e.status === "em_analise").forEach(e => {
      laboratorioService.simularResultado(e.id);
    });
    setExames(laboratorioService.getExames());
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Gestão de Exames
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visão completa do fluxo laboratorial.
          </p>
        </div>
        <Button variant="outline" onClick={handleSimularTodos}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Simular Resultados
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{stats.solicitados}</p>
            <p className="text-xs text-muted-foreground">Solicitados</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.coletados}</p>
            <p className="text-xs text-muted-foreground">Coletados</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.emAnalise}</p>
            <p className="text-xs text-muted-foreground">Em Análise</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats.concluidos}</p>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{stats.urgentes}</p>
            <p className="text-xs text-muted-foreground">Urgentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Laboratórios Parceiros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laboratórios Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {laboratoriosParceiros.map((lab) => (
              <div key={lab.id} className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground">{lab.nome}</p>
                <p className="text-sm text-muted-foreground mt-1">{lab.endereco}</p>
                <p className="text-sm text-muted-foreground">{lab.telefone}</p>
                <div className="flex gap-1 mt-2">
                  {lab.tipos.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t === "laboratorial" ? "Lab" : "Imagem"}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista Completa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os Exames</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {exames.map((exame) => (
              <div key={exame.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{exame.pacienteNome}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{exame.nome}</span>
                      {exame.prioridade === "urgente" && (
                        <Badge variant="destructive" className="text-[10px]">URGENTE</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exame.codigo} · {exame.medicoSolicitanteNome} · {new Date(exame.dataSolicitacao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("border text-xs", statusColors[exame.status])}>
                      {statusLabels[exame.status]}
                    </Badge>
                    {exame.status === "concluido" && (
                      <Button size="sm" variant="ghost" onClick={() => setModalResultado(exame)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ModalResultado exame={modalResultado} onClose={() => setModalResultado(null)} />
    </div>
  );
}

// ============================================================
// COMPONENTE COMPARTILHADO - Modal de Resultado
// ============================================================
function ModalResultado({ exame, onClose }: { exame: Exame | null; onClose: () => void }) {
  if (!exame || !exame.resultado) return null;

  return (
    <Dialog open={!!exame} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resultado do Exame
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Info do Exame */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Paciente</span>
              <span className="text-sm font-medium">{exame.pacienteNome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Exame</span>
              <span className="text-sm font-medium">{exame.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Requisição</span>
              <span className="text-sm font-medium">{exame.codigo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data do Resultado</span>
              <span className="text-sm font-medium">
                {exame.dataResultado && new Date(exame.dataResultado).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Laboratório</span>
              <span className="text-sm font-medium">{exame.laboratorio}</span>
            </div>
          </div>

          {/* Valores */}
          {exame.resultado.valores.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Valores</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Parâmetro</th>
                      <th className="text-left p-3 font-medium">Resultado</th>
                      <th className="text-left p-3 font-medium">Referência</th>
                      <th className="text-center p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exame.resultado.valores.map((v, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-3">{v.parametro}</td>
                        <td className="p-3 font-medium">
                          {v.valor} {v.unidade}
                        </td>
                        <td className="p-3 text-muted-foreground">{v.referencia}</td>
                        <td className="p-3 text-center">
                          <Badge className={cn(
                            "text-xs",
                            v.status === "normal" && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
                            v.status === "alterado" && "bg-amber-500/15 text-amber-600 border-amber-500/30",
                            v.status === "critico" && "bg-red-500/15 text-red-600 border-red-500/30"
                          )}>
                            {v.status === "normal" ? "Normal" : v.status === "alterado" ? "Alterado" : "Crítico"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Laudo */}
          {exame.resultado.laudo && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Laudo</h4>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-sm text-foreground leading-relaxed">{exame.resultado.laudo}</p>
              </div>
            </div>
          )}

          {/* Responsável Técnico */}
          {exame.resultado.responsavelTecnico && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Responsável Técnico: {exame.resultado.responsavelTecnico}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
