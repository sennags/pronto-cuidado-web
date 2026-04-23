import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockAgendamentos,
  mockFilaEspera,
  mockMedicos,
  mockPacientes,
  mockIndicadores,
  mockFaturamento,
} from "@/lib/mock-data";
import {
  CalendarDays,
  Users,
  Stethoscope,
  Activity,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  CalendarPlus,
  FileText,
  DoorOpen,
  HeartPulse,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const hoje = new Date().toISOString().slice(0, 10);
  const consultasHoje = mockAgendamentos.filter((a) => a.data === hoje);
  const emAtendimento = consultasHoje.filter((a) => a.status === "Em atendimento").length;
  const concluidas = consultasHoje.filter((a) => a.status === "Concluído").length;
  const aguardando = mockFilaEspera.length;
  const ocupacao = Math.round((consultasHoje.length / 16) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <HeroBanner role={user.role} nome={user.nome} ocupacao={ocupacao} />

        {user.role === "paciente" ? (
          <PacienteDashboard nome={user.nome} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Consultas hoje"
                value={consultasHoje.length}
                hint={`${concluidas} concluídas`}
                icon={CalendarDays}
                tone="primary"
              />
              <StatCard
                label="Pacientes aguardando"
                value={aguardando}
                hint="Tempo médio: 8 min"
                icon={Clock}
                tone="warning"
              />
              <StatCard
                label="Médicos em atendimento"
                value={emAtendimento || mockMedicos.filter((m) => m.status === "Em atendimento").length}
                hint={`${mockMedicos.length} ativos`}
                icon={Stethoscope}
                tone="info"
              />
              <StatCard
                label="Taxa de ocupação"
                value={`${ocupacao}%`}
                hint="Meta: 85%"
                icon={Activity}
                tone="success"
              />
            </div>

            {user.role === "recepcionista" && <RecepcaoView />}
            {user.role === "medico" && <MedicoView nomeMedico={user.nome} />}
            {user.role === "administrador" && <AdminView />}
          </>
        )}
      </div>
    </AppLayout>
  );
}

/* ---------- Hero ---------- */
function HeroBanner({ role, nome, ocupacao }: { role: string; nome: string; ocupacao: number }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div
      className="relative rounded-2xl p-6 lg:p-8 text-primary-foreground overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Sparkles className="h-4 w-4" />
            <span className="capitalize">{hoje}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mt-2">
            {greeting}, {nome.split(" ")[0]}.
          </h2>
          <p className="opacity-90 mt-2 max-w-xl text-sm lg:text-base">
            {role === "recepcionista" &&
              "Sua agenda está pronta. Veja a fila de espera e os próximos pacientes do dia."}
            {role === "medico" &&
              "Acesse rapidamente seus próximos atendimentos e os prontuários dos pacientes."}
            {role === "administrador" &&
              "Acompanhe os indicadores operacionais e financeiros da clínica em tempo real."}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/15">
          <HeartPulse className="h-9 w-9" />
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Ocupação atual</div>
            <div className="text-2xl font-bold">{ocupacao}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Recepção ---------- */
function RecepcaoView() {
  const hoje = new Date().toISOString().slice(0, 10);
  const proximos = mockAgendamentos
    .filter((a) => a.data === hoje && a.status !== "Concluído")
    .slice(0, 6);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Fila de espera</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Pacientes presentes na clínica</p>
          </div>
          <Badge variant="secondary" className="bg-warning/15 text-warning-foreground border border-warning/30">
            {mockFilaEspera.length} aguardando
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockFilaEspera.map((f, idx) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-gradient-to-r from-card to-muted/30"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{f.paciente}</div>
                <div className="text-xs text-muted-foreground">
                  {f.medico} · chegou às {f.chegada}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{f.aguardando} min</div>
                {f.prioridade === "Preferencial" ? (
                  <Badge className="bg-warning text-warning-foreground border-0 text-[10px]">
                    Preferencial
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Normal</span>
                )}
              </div>
              <Button size="sm" variant="outline">
                Chamar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <QuickAction to="/pacientes" icon={UserPlus} label="Cadastrar paciente" />
          <QuickAction to="/agendamentos" icon={CalendarPlus} label="Novo agendamento" />
          <QuickAction to="/medicos" icon={Stethoscope} label="Disponibilidade médica" />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Próximos atendimentos de hoje</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/agendamentos">
              Ver agenda completa <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {proximos.map((a) => (
              <AgendaItem key={a.id} item={a} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Médico ---------- */
function MedicoView({ nomeMedico }: { nomeMedico: string }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const meusAtendimentos = mockAgendamentos.filter(
    (a) => a.data === hoje && a.medico === nomeMedico
  );
  const atual = meusAtendimentos.find((a) => a.status === "Em atendimento");
  const proximos = meusAtendimentos.filter((a) => a.status !== "Concluído" && a.status !== "Em atendimento");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {atual && (
        <Card className="lg:col-span-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-success text-success-foreground border-0">
                <Activity className="h-3 w-3 mr-1" /> Em atendimento agora
              </Badge>
              <span className="text-sm text-muted-foreground">{atual.sala}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{atual.paciente}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {atual.especialidade} · iniciado às {atual.hora}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/prontuario">
                  <FileText className="h-4 w-4 mr-2" /> Abrir prontuário
                </Link>
              </Button>
              <Button variant="outline">Finalizar consulta</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={atual ? "" : "lg:col-span-2"}>
        <CardHeader>
          <CardTitle>Resumo do dia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Atendimentos agendados" value={String(meusAtendimentos.length)} />
          <Row label="Concluídos" value={String(meusAtendimentos.filter((a) => a.status === "Concluído").length)} />
          <Row label="Tempo médio por consulta" value="28 min" />
          <Row label="Próximo paciente" value={proximos[0]?.paciente ?? "—"} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Seus próximos pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {proximos.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center md:col-span-2">
                Nenhum atendimento pendente para hoje.
              </div>
            ) : (
              proximos.map((a) => <AgendaItem key={a.id} item={a} showAction />)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Admin ---------- */
function AdminView() {
  const max = Math.max(...mockFaturamento.map((m) => m.valor));
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Faturamento dos últimos 6 meses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              R$ {mockIndicadores.faturamentoMes.toLocaleString("pt-BR")} no mês atual
            </p>
          </div>
          <Badge className="bg-success/15 text-success border border-success/30">
            <TrendingUp className="h-3 w-3 mr-1" /> +4,8%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3 h-44 pt-4">
            {mockFaturamento.map((m) => {
              const h = (m.valor / max) * 100;
              return (
                <div key={m.mes} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full max-w-[42px] rounded-t-lg transition-all"
                      style={{
                        height: `${h}%`,
                        background: "var(--gradient-hero)",
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{m.mes}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores chave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Consultas no mês" value={String(mockIndicadores.consultasMes)} />
          <Row label="Novos pacientes" value={`+${mockIndicadores.novosPacientes}`} />
          <Row label="Ticket médio" value={`R$ ${mockIndicadores.ticketMedio}`} />
          <Row label="Comparecimento" value={`${mockIndicadores.taxaComparecimento}%`} />
          <Row label="Satisfação" value={`${mockIndicadores.satisfacao} / 5`} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Visão rápida</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">
              Painel completo <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <InfoTile icon={Users} label="Pacientes ativos" value={String(mockPacientes.length * 38)} accent="primary" />
          <InfoTile icon={Stethoscope} label="Médicos cadastrados" value={String(mockMedicos.length)} accent="info" />
          <InfoTile icon={DoorOpen} label="Salas em uso" value={`${mockMedicos.filter((m) => m.status === "Em atendimento").length} / 6`} accent="success" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Paciente ---------- */
function PacienteDashboard({ nome }: { nome: string }) {
  const proximas = mockAgendamentos.filter((a) => a.paciente.includes(nome.split(" ")[0])).slice(0, 3);
  const fallback = mockAgendamentos.slice(0, 3);
  const lista = proximas.length ? proximas : fallback;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Suas próximas consultas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lista.map((a) => (
            <AgendaItem key={a.id} item={a} />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
            <span>Mantenha seus dados de contato atualizados.</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <span>Chegue com 15 minutos de antecedência.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
            <span>Traga documento e carteira do convênio.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Pieces ---------- */
function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof CalendarDays;
  tone: "primary" | "success" | "warning" | "info";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    info: "bg-info/15 text-info",
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl lg:text-3xl font-bold text-foreground mt-1 tracking-tight">
              {value}
            </div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgendaItem({
  item,
  showAction,
}: {
  item: { paciente: string; medico: string; especialidade: string; hora: string; status: string; sala?: string };
  showAction?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/40 transition-all">
      <div className="h-12 w-12 rounded-lg bg-secondary flex flex-col items-center justify-center shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase">hoje</span>
        <span className="text-sm font-bold text-foreground -mt-0.5">{item.hora}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground truncate">{item.paciente}</div>
        <div className="text-xs text-muted-foreground truncate">
          {item.medico} · {item.especialidade}
          {item.sala ? ` · ${item.sala}` : ""}
        </div>
      </div>
      <StatusBadge status={item.status} />
      {showAction && (
        <Button asChild size="sm" variant="ghost">
          <Link to="/prontuario">Abrir</Link>
        </Button>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmado: "bg-info/15 text-info border border-info/30",
    Pendente: "bg-warning/20 text-warning-foreground border border-warning/40",
    Aguardando: "bg-warning/20 text-warning-foreground border border-warning/40",
    "Em atendimento": "bg-success/15 text-success border border-success/30",
    Concluído: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <Badge className={`${map[status] ?? "bg-muted text-muted-foreground"} font-medium`}>
      {status}
    </Badge>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof CalendarDays;
  label: string;
}) {
  return (
    <Button asChild variant="outline" className="w-full justify-between h-auto py-3">
      <Link to={to}>
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent: "primary" | "info" | "success";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
  };
  return (
    <div className="rounded-xl border border-border p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tones[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}
