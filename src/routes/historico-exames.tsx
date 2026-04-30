import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  mockExames,
  statusLabels,
  statusColors,
  type Exame,
  type StatusExame,
} from "@/lib/laboratorio-data";
import { mockPacientes } from "@/lib/mock-data";
import {
  History,
  Search,
  TestTube,
  ImageIcon,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/historico-exames")({
  component: HistoricoExamesPage,
});

function formatDate(d?: string) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function HistoricoExamesPage() {
  const { user } = useAuth();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPaciente, setFiltroPaciente] = useState<string>("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("todos");
  const [detalhe, setDetalhe] = useState<Exame | null>(null);

  // Paciente vê apenas seus exames (mock: usa primeiro paciente)
  const exameBase = useMemo(() => {
    if (user?.role === "paciente") {
      return mockExames.filter((e) => e.pacienteId === "p1");
    }
    return mockExames;
  }, [user]);

  const examesFiltrados = useMemo(() => {
    const hoje = new Date();
    return exameBase
      .filter((e) => {
        const txt = busca.toLowerCase();
        const matchBusca =
          !txt ||
          e.pacienteNome.toLowerCase().includes(txt) ||
          e.nome.toLowerCase().includes(txt) ||
          e.codigo.toLowerCase().includes(txt) ||
          e.medicoSolicitanteNome.toLowerCase().includes(txt);
        const matchStatus = filtroStatus === "todos" || e.status === filtroStatus;
        const matchTipo = filtroTipo === "todos" || e.tipo === filtroTipo;
        const matchPac = filtroPaciente === "todos" || e.pacienteId === filtroPaciente;

        let matchPeriodo = true;
        if (filtroPeriodo !== "todos") {
          const data = new Date(e.dataResultado || e.dataColeta || e.dataSolicitacao);
          const diffDias = (hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24);
          if (filtroPeriodo === "30") matchPeriodo = diffDias <= 30;
          if (filtroPeriodo === "90") matchPeriodo = diffDias <= 90;
          if (filtroPeriodo === "365") matchPeriodo = diffDias <= 365;
        }

        return matchBusca && matchStatus && matchTipo && matchPac && matchPeriodo;
      })
      .sort((a, b) => {
        const da = a.dataResultado || a.dataColeta || a.dataSolicitacao;
        const db = b.dataResultado || b.dataColeta || b.dataSolicitacao;
        return db.localeCompare(da);
      });
  }, [exameBase, busca, filtroStatus, filtroTipo, filtroPaciente, filtroPeriodo]);

  const stats = useMemo(() => {
    const concluidos = exameBase.filter((e) => e.status === "concluido");
    const alterados = concluidos.filter((e) =>
      e.resultado?.valores.some((v) => v.status !== "normal"),
    ).length;
    const ultimoMes = exameBase.filter((e) => {
      const d = new Date(e.dataSolicitacao);
      const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    }).length;
    return {
      total: exameBase.length,
      concluidos: concluidos.length,
      alterados,
      ultimoMes,
    };
  }, [exameBase]);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico de Exames
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.role === "paciente"
              ? "Acompanhe seus exames realizados e resultados anteriores."
              : "Consulte o histórico completo de exames realizados na clínica."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={FileText}
            label="Total de exames"
            value={stats.total}
            tone="bg-primary/10 text-primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Concluídos"
            value={stats.concluidos}
            tone="bg-emerald-500/15 text-emerald-600"
          />
          <StatCard
            icon={AlertCircle}
            label="Com alteração"
            value={stats.alterados}
            tone="bg-amber-500/15 text-amber-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Últimos 30 dias"
            value={stats.ultimoMes}
            tone="bg-blue-500/15 text-blue-600"
          />
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por exame, código, paciente ou médico..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="em_analise">Em análise</SelectItem>
                  <SelectItem value="coletado">Coletado</SelectItem>
                  <SelectItem value="solicitado">Solicitado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="laboratorial">Laboratorial</SelectItem>
                  <SelectItem value="imagem">Imagem</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Qualquer período</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 3 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              {user?.role !== "paciente" && (
                <Select value={filtroPaciente} onValueChange={setFiltroPaciente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os pacientes</SelectItem>
                    {mockPacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {examesFiltrados.length}{" "}
              {examesFiltrados.length === 1 ? "exame encontrado" : "exames encontrados"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {examesFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Nenhum exame encontrado com os filtros aplicados.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {examesFiltrados.map((exame) => {
                  const temAlteracao = exame.resultado?.valores.some(
                    (v) => v.status !== "normal",
                  );
                  return (
                    <div
                      key={exame.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 hover:border-primary/30 transition-all"
                    >
                      <div
                        className={cn(
                          "h-11 w-11 rounded-lg flex items-center justify-center shrink-0",
                          exame.tipo === "imagem" ? "bg-purple-500/15" : "bg-blue-500/15",
                        )}
                      >
                        {exame.tipo === "imagem" ? (
                          <ImageIcon className="h-5 w-5 text-purple-600" />
                        ) : (
                          <TestTube className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{exame.nome}</span>
                          {exame.prioridade === "urgente" && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              URGENTE
                            </Badge>
                          )}
                          {temAlteracao && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-700 border border-amber-500/30">
                              Resultado alterado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span className="font-mono">{exame.codigo}</span>
                          {user?.role !== "paciente" && (
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {exame.pacienteNome}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exame.dataResultado || exame.dataColeta || exame.dataSolicitacao)}
                          </span>
                          {exame.laboratorio && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {exame.laboratorio}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("border text-xs", statusColors[exame.status as StatusExame])}>
                          {statusLabels[exame.status as StatusExame]}
                        </Badge>
                        {exame.status === "concluido" && (
                          <Button size="sm" variant="outline" onClick={() => setDetalhe(exame)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de detalhes */}
      <Dialog open={!!detalhe} onOpenChange={(o) => !o && setDetalhe(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {detalhe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {detalhe.tipo === "imagem" ? (
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                  ) : (
                    <TestTube className="h-5 w-5 text-blue-600" />
                  )}
                  {detalhe.nome}
                </DialogTitle>
                <DialogDescription>
                  {detalhe.codigo} · Solicitado em {formatDate(detalhe.dataSolicitacao)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoLine label="Paciente" value={detalhe.pacienteNome} />
                  <InfoLine label="Médico solicitante" value={detalhe.medicoSolicitanteNome} />
                  <InfoLine label="Data da coleta" value={formatDate(detalhe.dataColeta)} />
                  <InfoLine label="Data do resultado" value={formatDate(detalhe.dataResultado)} />
                  <InfoLine label="Laboratório" value={detalhe.laboratorio || "—"} />
                  <InfoLine label="Categoria" value={detalhe.categoria} />
                </div>

                {detalhe.resultado?.valores && detalhe.resultado.valores.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Resultados</h4>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr className="text-left text-xs text-muted-foreground">
                            <th className="p-2 font-medium">Parâmetro</th>
                            <th className="p-2 font-medium">Resultado</th>
                            <th className="p-2 font-medium">Referência</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalhe.resultado.valores.map((v, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="p-2 text-foreground">{v.parametro}</td>
                              <td className="p-2">
                                <span
                                  className={cn(
                                    "font-medium",
                                    v.status === "normal" && "text-emerald-600",
                                    v.status === "alterado" && "text-amber-600",
                                    v.status === "critico" && "text-red-600",
                                  )}
                                >
                                  {v.valor} {v.unidade}
                                </span>
                              </td>
                              <td className="p-2 text-muted-foreground">{v.referencia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {detalhe.resultado?.laudo && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Laudo</h4>
                    <p className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-lg leading-relaxed">
                      {detalhe.resultado.laudo}
                    </p>
                  </div>
                )}

                {detalhe.resultado?.responsavelTecnico && (
                  <p className="text-xs text-muted-foreground border-t border-border pt-3">
                    Responsável técnico: {detalhe.resultado.responsavelTecnico}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof History;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground font-medium">{value}</div>
    </div>
  );
}
