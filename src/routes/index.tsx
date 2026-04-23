import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

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

  const handleRoleChange = (r: Role) => {
    setRole(r);
    const map: Record<Role, string> = {
      paciente: "paciente@clinica.com",
      recepcionista: "recepcao@clinica.com",
      medico: "medico@clinica.com",
      administrador: "admin@clinica.com",
    };
    setEmail(map[r]);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-xl">SaúdeClin</div>
            <div className="text-sm opacity-90">Cuidado organizado</div>
          </div>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Gestão clínica simples, segura e acolhedora.
          </h1>
          <p className="opacity-90 text-lg">
            Centralize agendamentos, pacientes e prontuários em uma única plataforma pensada para sua equipe.
          </p>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5" />
              <span>Atendimento ágil e organizado</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Dados protegidos e acessíveis</span>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-75">© 2026 SaúdeClin. Todos os direitos reservados.</p>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SaúdeClin</span>
            </div>
            <CardTitle className="text-2xl">Acessar plataforma</CardTitle>
            <CardDescription>
              Escolha seu perfil para entrar (protótipo de demonstração).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de acesso</Label>
                <Select value={role} onValueChange={(v) => handleRoleChange(v as Role)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
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
                Entrar
              </Button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Protótipo navegável — autenticação simulada.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
