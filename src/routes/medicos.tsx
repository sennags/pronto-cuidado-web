import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMedicos } from "@/lib/mock-data";
import { Stethoscope, Calendar, MapPin, Activity } from "lucide-react";

export const Route = createFileRoute("/medicos")({
  component: MedicosPage,
});

const statusTone: Record<string, string> = {
  "Em atendimento": "bg-success/15 text-success border-success/30",
  Disponível: "bg-info/15 text-info border-info/30",
  Pausa: "bg-warning/20 text-warning-foreground border-warning/40",
};

function MedicosPage() {
  const especialidades = Array.from(new Set(mockMedicos.map((m) => m.especialidade)));

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Corpo clínico
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mockMedicos.length} médicos · {especialidades.length} especialidades
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mockMedicos.map((m) => (
            <Card key={m.id} className="hover:shadow-md hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0 border border-border">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base leading-tight">{m.nome}</CardTitle>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant="secondary">{m.especialidade}</Badge>
                      <Badge className={`${statusTone[m.status] ?? ""} border text-[10px]`}>
                        <Activity className="h-2.5 w-2.5 mr-0.5" />
                        {m.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pt-0">
                <div className="text-xs text-muted-foreground font-mono">{m.crm}</div>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{m.disponibilidade}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{m.sala}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
