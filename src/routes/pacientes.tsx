import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockPacientes } from "@/lib/mock-data";
import { Plus, Search, Phone, CalendarCheck, IdCard, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pacientes")({
  component: PacientesPage,
});

type Paciente = (typeof mockPacientes)[number];

function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>(mockPacientes);
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", cpf: "", nascimento: "", telefone: "", convenio: "" });

  const filtrados = pacientes.filter(
    (p) => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cpf.includes(busca)
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPacientes([
      ...pacientes,
      { id: `p${Date.now()}`, ...form, ultimaConsulta: new Date().toISOString().slice(0, 10) },
    ]);
    toast.success("Paciente cadastrado com sucesso!");
    setForm({ nome: "", cpf: "", nascimento: "", telefone: "", convenio: "" });
    setOpen(false);
  };

  const idade = (nasc: string) => {
    const d = new Date(nasc);
    return Math.floor((Date.now() - d.getTime()) / (365.25 * 86400000));
  };

  const iniciais = (nome: string) =>
    nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Pacientes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {pacientes.length} pacientes cadastrados na clínica.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" /> Novo paciente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar paciente</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nascimento</Label>
                    <Input type="date" required value={form.nascimento} onChange={(e) => setForm({ ...form, nascimento: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Convênio</Label>
                    <Input value={form.convenio} onChange={(e) => setForm({ ...form, convenio: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9 h-11"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((p) => (
            <Card key={p.id} className="hover:shadow-md hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                    {iniciais(p.nome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{p.nome}</div>
                    <div className="text-xs text-muted-foreground">
                      {idade(p.nascimento)} anos · {p.convenio}
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <IdCard className="h-3.5 w-3.5" />
                        {p.cpf}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {p.telefone}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Última: {new Date(p.ultimaConsulta).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtrados.length === 0 && (
            <Card className="sm:col-span-2 xl:col-span-3">
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhum paciente encontrado.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
