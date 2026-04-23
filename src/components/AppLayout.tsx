import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  FileText,
  BarChart3,
  LogOut,
  HeartPulse,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/mock-data";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["paciente", "recepcionista", "medico", "administrador"] },
  { to: "/pacientes", label: "Pacientes", icon: Users, roles: ["recepcionista", "medico", "administrador"] },
  { to: "/agendamentos", label: "Agendamentos", icon: CalendarDays, roles: ["paciente", "recepcionista", "medico", "administrador"] },
  { to: "/medicos", label: "Médicos", icon: Stethoscope, roles: ["paciente", "recepcionista", "administrador"] },
  { to: "/prontuario", label: "Prontuário", icon: FileText, roles: ["medico", "administrador"] },
  { to: "/admin", label: "Administração", icon: BarChart3, roles: ["administrador"] },
];

const roleLabel: Record<Role, string> = {
  paciente: "Paciente",
  recepcionista: "Recepcionista",
  medico: "Médico",
  administrador: "Administrador",
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/" });
    return null;
  }

  const items = navItems.filter((i) => i.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <HeartPulse className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-foreground leading-tight">SaúdeClin</div>
            <div className="text-xs text-muted-foreground">Gestão clínica</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <div className="text-sm font-medium text-foreground truncate">{user.nome}</div>
            <div className="text-xs text-muted-foreground">{roleLabel[user.role]}</div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {items.find((i) => i.to === pathname)?.label ?? "SaúdeClin"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
