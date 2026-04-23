import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProntuarios } from "@/lib/mock-data";
import { FileText, User, Calendar, Pill, AlertTriangle, ShieldCheck, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/prontuario")({
  component: ProntuarioPage,
});

function ProntuarioPage() {
  const [selecionado, setSelecionado] = useState(mockProntuarios[0].pacienteId);
  const prontuario = mockProntuarios.find((p) => p.pacienteId === selecionado);

  const idade = (nasc: string) => {
    const d = new Date(nasc);
    return Math.floor((Date.now() - d.getTime()) / (365.25 * 86400000));
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Prontuário eletrônico
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Histórico clínico completo do paciente.
            </p>
          </div>
          <Select value={selecionado} onValueChange={setSelecionado}>
            <SelectTrigger className="w-full sm:w-[260px]">
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
        </div>

        {prontuario && (
          <>
            <Card className="overflow-hidden">
              <div className="h-1.5" style={{ background: "var(--gradient-hero)" }} />
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shrink-0">
                    <User className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-bold text-foreground">{prontuario.paciente}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {idade(prontuario.nascimento)} anos · {prontuario.convenio}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prontuario.alergias.length > 0 ? (
                      prontuario.alergias.map((a) => (
                        <Badge key={a} className="bg-destructive/15 text-destructive border border-destructive/30">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alergia: {a}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="bg-success/15 text-success border border-success/30">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Sem alergias
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Histórico clínico — {prontuario.historico.length} registro(s)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prontuario.historico.map((h, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-primary pl-4 py-3 space-y-2 relative"
                  >
                    <div className="absolute -left-[7px] top-4 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(h.data).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{h.medico}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{h.descricao}</p>
                    </div>
                    <div className="flex items-start gap-2 bg-muted/40 rounded-lg p-3">
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
