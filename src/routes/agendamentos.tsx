import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAgendamentos, mockMedicos, mockPacientes } from "@/lib/mock-data";
import { Plus, CalendarDays, Filter, MapPin } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./dashboard";

export const Route = createFileRoute("/agendamentos")({
  component: AgendamentosPage,
});

type Item = (typeof mockAgendamentos)[number];

function AgendamentosPage() {
  const [lista, setLista] = useState<Item[]>(mockAgendamentos);
  const [open, setOpen] = useState(false);
  const [filtroEsp, setFiltroEsp] = useState<string>("todas");
  const [aba, setAba] = useState<string>("hoje");
  const [form, setForm] = useState({ paciente: "", medico: "", data: "", hora: "" });

  const hoje = new Date().toISOString().slice(0, 10);

  const filtrados = useMemo(() => {
    return lista
      .filter((a) => {
        if (aba === "hoje") return a.data === hoje;
        if (aba === "futuros") return a.data > hoje;
        return true;
      })
      .filter((a) => filtroEsp === "todas" || a.especialidade === filtroEsp)
      .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  }, [lista, filtroEsp, aba, hoje]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const med = mockMedicos.find((m) => m.nome === form.medico);
    setLista([
      ...lista,
      {
        id: `a${Date.now()}`,
        paciente: form.paciente,
        medico: form.medico,
        especialidade: med?.especialidade ?? "",
        data: form.data,
        hora: form.hora,
        status: "Confirmado",
        sala: med?.sala ?? "Sala 01",
      },
    ]);
    toast.success("Agendamento criado com sucesso!");
    setForm({ paciente: "", medico: "", data: "", hora: "" });
    setOpen(false);
  };

  const especialidades = Array.from(new Set(mockMedicos.map((m) => m.especialidade)));

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Agenda da clínica
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize, filtre e crie consultas em poucos cliques.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" /> Novo agendamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar consulta</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select value={form.paciente} onValueChange={(v) => setForm({ ...form, paciente: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {mockPacientes.map((p) => (
                        <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Médico</Label>
                  <Select value={form.medico} onValueChange={(v) => setForm({ ...form, medico: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {mockMedicos.map((m) => (
                        <SelectItem key={m.id} value={m.nome}>
                          {m.nome} — {m.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input type="date" required value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input type="time" required value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Confirmar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
            <Tabs value={aba} onValueChange={setAba}>
              <TabsList>
                <TabsTrigger value="hoje">Hoje</TabsTrigger>
                <TabsTrigger value="futuros">Próximos</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroEsp} onValueChange={setFiltroEsp}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as especialidades</SelectItem>
                  {especialidades.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filtrados.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                Nenhum agendamento encontrado para este filtro.
              </div>
            ) : (
              <div className="space-y-2">
                {filtrados.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:w-44 shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                          {new Date(a.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-sm font-bold text-foreground -mt-0.5">{a.hora}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {a.sala}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{a.paciente}</div>
                      <div className="text-sm text-muted-foreground">
                        {a.medico} · {a.especialidade}
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Resumo label="Total" value={lista.length} />
            <Resumo label="Hoje" value={lista.filter((a) => a.data === hoje).length} />
            <Resumo label="Confirmados" value={lista.filter((a) => a.status === "Confirmado").length} tone="info" />
            <Resumo label="Pendentes" value={lista.filter((a) => a.status === "Pendente").length} tone="warning" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function Resumo({ label, value, tone }: { label: string; value: number; tone?: "info" | "warning" }) {
  const cls = tone === "info" ? "text-info" : tone === "warning" ? "text-warning-foreground" : "text-foreground";
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold ${cls}`}>{value}</div>
    </div>
  );
}
