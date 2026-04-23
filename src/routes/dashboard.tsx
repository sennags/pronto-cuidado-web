import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAgendamentos, mockPacientes, mockMedicos } from "@/lib/mock-data";
import { CalendarDays, Users, Stethoscope, Activity, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div
          className="rounded-2xl p-6 lg:p-8 text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="text-sm opacity-90">Bem-vindo(a),</div>
          <h2 className="text-2xl lg:text-3xl font-bold mt-1">{user?.nome}</h2>
          <p className="opacity-90 mt-2 max-w-2xl">
            Aqui está um resumo da clínica hoje. Use o menu lateral para acessar as áreas disponíveis para seu perfil.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Agendamentos hoje" value={mockAgendamentos.length} icon={CalendarDays} />
          <StatCard label="Pacientes ativos" value={mockPacientes.length} icon={Users} />
          <StatCard label="Médicos disponíveis" value={mockMedicos.length} icon={Stethoscope} />
          <StatCard label="Taxa de ocupação" value="87%" icon={Activity} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Próximas consultas</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/agendamentos">
                  Ver todas <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAgendamentos.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-foreground">{a.paciente}</div>
                    <div className="text-sm text-muted-foreground">
                      {a.medico} · {a.especialidade}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(a.data).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-sm text-muted-foreground">{a.hora}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acesso rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickLink to="/pacientes" label="Cadastrar paciente" />
              <QuickLink to="/agendamentos" label="Novo agendamento" />
              <QuickLink to="/medicos" label="Lista de médicos" />
              <QuickLink to="/prontuario" label="Abrir prontuário" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof CalendarDays;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
          </div>
          <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="outline" className="w-full justify-between">
      <Link to={to}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
