import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  CalendarDays,
  FileText,
  BarChart3,
  User,
  ArrowRight,
} from "lucide-react";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

const profiles: {
  role: Role;
  label: string;
  email: string;
  icon: typeof User;
  desc: string;
}[] = [
  { role: "recepcionista", label: "Recepção", email: "recepcao@clinica.com", icon: CalendarDays, desc: "Agenda e fila de espera" },
  { role: "medico", label: "Médico", email: "medico@clinica.com", icon: Stethoscope, desc: "Atendimentos e prontuário" },
  { role: "administrador", label: "Administração", email: "admin@clinica.com", icon: BarChart3, desc: "Indicadores e gestão" },
  { role: "paciente", label: "Paciente", email: "paciente@clinica.com", icon: User, desc: "Suas consultas" },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("recepcionista");
  const [email, setEmail] = useState("recepcao@clinica.com");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate({ to: "/dashboard" });
  };

  const handleProfile = (r: Role, e: string) => {
    setRole(r);
    setEmail(e);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5 bg-background">
      {/* Brand panel */}
      <div
        className="hidden lg:flex lg:col-span-3 flex-col justify-between p-12 text-primary-foreground relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-xl">SaúdeClin</div>
            <div className="text-sm opacity-90">Plataforma de gestão clínica</div>
          </div>
        </div>

        <div className="relative space-y-8 max-w-lg">
          <div>
            <div className="text-sm uppercase tracking-widest opacity-75 mb-3">
              Cuidado conectado
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Toda a sua clínica em uma única plataforma.
            </h1>
            <p className="opacity-90 text-lg mt-4 leading-relaxed">
              Centralize agendamentos, prontuários e indicadores. Mais agilidade para sua equipe, mais cuidado para seus pacientes.
            </p>
          </div>

          <div className="grid gap-3">
            <Feature icon={CalendarDays} text="Agenda inteligente com fila de espera em tempo real" />
            <Feature icon={FileText} text="Prontuário eletrônico com histórico completo" />
            <Feature icon={BarChart3} text="Indicadores financeiros e operacionais consolidados" />
            <Feature icon={ShieldCheck} text="Dados protegidos conforme LGPD" />
          </div>
        </div>

        <p className="relative text-sm opacity-75">
          © 2026 SaúdeClin · Plataforma demonstrativa
        </p>
      </div>

      {/* Login form */}
      <div className="lg:col-span-2 flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-md shadow-lg border-border/60">
          <CardHeader className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
                <HeartPulse className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SaúdeClin</span>
            </div>
            <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>
              Selecione um perfil de demonstração para explorar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Perfil de acesso
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {profiles.map((p) => {
                    const Icon = p.icon;
                    const active = role === p.role;
                    return (
                      <button
                        key={p.role}
                        type="button"
                        onClick={() => handleProfile(p.role, p.email)}
                        className={cn(
                          "text-left p-3 rounded-lg border transition-all",
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                          <span className="text-sm font-semibold text-foreground">{p.label}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 leading-tight">
                          {p.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" defaultValue="demo1234" />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Entrar como {profiles.find((p) => p.role === role)?.label}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Protótipo navegável · autenticação simulada
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center shrink-0 border border-white/15">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
