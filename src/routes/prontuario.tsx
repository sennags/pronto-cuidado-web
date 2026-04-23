import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProntuarios } from "@/lib/mock-data";
import { FileText, User, Calendar, Pill } from "lucide-react";

export const Route = createFileRoute("/prontuario")({
  component: ProntuarioPage,
});

function ProntuarioPage() {
  const [selecionado, setSelecionado] = useState(mockProntuarios[0].pacienteId);
  const prontuario = mockProntuarios.find((p) => p.pacienteId === selecionado);

  return (
    <AppLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Selecionar paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selecionado} onValueChange={setSelecionado}>
              <SelectTrigger className="max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockProntuarios.map((p) => (
                  <SelectItem key={p.pacienteId} value={p.pacienteId}>
                    {p.paciente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {prontuario && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{prontuario.paciente}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Histórico clínico — {prontuario.historico.length} registro(s)
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {prontuario.historico.map((h, i) => (
                <div key={i} className="border-l-2 border-primary pl-4 py-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(h.data).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="text-muted-foreground">{h.medico}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{h.descricao}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Pill className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Prescrição: </span>
                      {h.prescricao}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
