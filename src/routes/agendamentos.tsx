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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAgendamentos, mockMedicos, mockPacientes } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/agendamentos")({
  component: AgendamentosPage,
});

function AgendamentosPage() {
  const [lista, setLista] = useState(mockAgendamentos);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ paciente: "", medico: "", data: "", hora: "" });

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
      },
    ]);
    toast.success("Agendamento criado!");
    setForm({ paciente: "", medico: "", data: "", hora: "" });
    setOpen(false);
  };

  return (
    <AppLayout>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Agendamentos</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize e crie consultas para os pacientes.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
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
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead className="hidden md:table-cell">Médico</TableHead>
                  <TableHead className="hidden lg:table-cell">Especialidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.paciente}</TableCell>
                    <TableCell className="hidden md:table-cell">{a.medico}</TableCell>
                    <TableCell className="hidden lg:table-cell">{a.especialidade}</TableCell>
                    <TableCell>{new Date(a.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{a.hora}</TableCell>
                    <TableCell>
                      <Badge variant={a.status === "Confirmado" ? "default" : "secondary"}>
                        {a.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
