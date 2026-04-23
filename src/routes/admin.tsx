import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockAgendamentos,
  mockMedicos,
  mockPacientes,
  mockIndicadores,
  mockFaturamento,
} from "@/lib/mock-data";
import {
  Users,
  Stethoscope,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const especialidades = mockMedicos.reduce<Record<string, number>>((acc, m) => {
    acc[m.especialidade] = (acc[m.especialidade] ?? 0) + 1;
    return acc;
  }, {});

  const max = Math.max(...mockFaturamento.map((m) => m.valor));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Painel administrativo
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visão consolidada da operação e desempenho da clínica.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Pacientes ativos"
            value={mockPacientes.length * 38}
            hint={`+${mockIndicadores.novosPacientes} este mês`}
            icon={Users}
            tone="primary"
          />
          <Stat
            label="Consultas no mês"
            value={mockIndicadores.consultasMes}
            hint={`${mockAgendamentos.length} agendadas`}
            icon={CalendarDays}
            tone="info"
          />
          <Stat
            label="Faturamento"
            value={`R$ ${(mockIndicadores.faturamentoMes / 1000).toFixed(1)}k`}
            hint={`Ticket: R$ ${mockIndicadores.ticketMedio}`}
            icon={DollarSign}
            tone="success"
          />
          <Stat
            label="Satisfação NPS"
            value={`${mockIndicadores.satisfacao}/5`}
            hint="312 avaliações"
            icon={Star}
            tone="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Faturamento mensal</CardTitle>
                <Badge className="bg-success/15 text-success border border-success/30">
                  <TrendingUp className="h-3 w-3 mr-1" /> +30% em 6 meses
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3 h-52 pt-4">
                {mockFaturamento.map((m) => {
                  const h = (m.valor / max) * 100;
                  return (
                    <div key={m.mes} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-[10px] text-muted-foreground font-medium">
                        {(m.valor / 1000).toFixed(0)}k
                      </div>
                      <div className="w-full flex items-end justify-center flex-1">
                        <div
                          className="w-full max-w-[48px] rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${h}%`, background: "var(--gradient-hero)" }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{m.mes}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por especialidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(especialidades).map(([esp, qtd]) => {
                const pct = (qtd / mockMedicos.length) * 100;
                return (
                  <div key={esp}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-foreground font-medium">{esp}</span>
                      <span className="text-muted-foreground text-xs">{qtd} méd.</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: "var(--gradient-hero)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumo operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Row icon={CheckCircle2} label="Taxa de comparecimento" value={`${mockIndicadores.taxaComparecimento}%`} accent="success" />
              <Row icon={Clock} label="Tempo médio de consulta" value="28 min" accent="info" />
              <Row icon={Star} label="Satisfação dos pacientes" value={`${mockIndicadores.satisfacao} / 5`} accent="warning" />
              <Row icon={Users} label="Cancelamentos no mês" value="6" accent="muted" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destaques do período</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Highlight
                title="Crescimento de novos pacientes"
                value="+12%"
                desc="Comparado ao mês anterior, com origem em campanhas digitais."
                tone="success"
              />
              <Highlight
                title="Cardiologia em alta"
                value="32%"
                desc="Especialidade com maior demanda em abril."
                tone="info"
              />
              <Highlight
                title="Reagendamentos reduzidos"
                value="-18%"
                desc="Lembretes automáticos ajudaram a reduzir ausências."
                tone="primary"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Users;
  tone: "primary" | "info" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
  };
  return (
    <Card>
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl lg:text-3xl font-bold text-foreground mt-1 tracking-tight">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
  accent: "success" | "info" | "warning" | "muted";
}) {
  const tones = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning-foreground",
    muted: "text-muted-foreground",
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="flex items-center gap-2 text-sm text-foreground">
        <Icon className={`h-4 w-4 ${tones[accent]}`} />
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Highlight({
  title,
  value,
  desc,
  tone,
}: {
  title: string;
  value: string;
  desc: string;
  tone: "success" | "info" | "primary";
}) {
  const tones = {
    success: "bg-success/10 text-success border-success/20",
    info: "bg-info/10 text-info border-info/20",
    primary: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-semibold text-foreground text-sm">{title}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
