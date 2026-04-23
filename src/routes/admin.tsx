import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAgendamentos, mockMedicos, mockPacientes } from "@/lib/mock-data";
import { Users, Stethoscope, CalendarDays, DollarSign, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const especialidades = mockMedicos.reduce<Record<string, number>>((acc, m) => {
    acc[m.especialidade] = (acc[m.especialidade] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Indicadores administrativos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral da operação da clínica.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Pacientes cadastrados" value={mockPacientes.length} icon={Users} />
          <Stat label="Médicos ativos" value={mockMedicos.length} icon={Stethoscope} />
          <Stat label="Consultas no mês" value={mockAgendamentos.length * 7} icon={CalendarDays} />
          <Stat label="Faturamento estimado" value="R$ 48.500" icon={DollarSign} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por especialidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(especialidades).map(([esp, qtd]) => {
                const pct = (qtd / mockMedicos.length) * 100;
                return (
                  <div key={esp}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{esp}</span>
                      <span className="text-muted-foreground">{qtd} médico(s)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "var(--gradient-hero)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row label="Taxa de comparecimento" value="92%" />
              <Row label="Tempo médio de consulta" value="28 min" />
              <Row label="Satisfação dos pacientes" value="4.8 / 5" />
              <Row label="Cancelamentos no mês" value="6" />
              <div className="flex items-center gap-2 text-sm text-accent-foreground bg-accent/30 rounded-lg p-3 mt-4">
                <TrendingUp className="h-4 w-4" />
                <span>Crescimento de 12% em novos pacientes este mês.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
        </div>
        <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
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
