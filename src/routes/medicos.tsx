import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMedicos } from "@/lib/mock-data";
import { Stethoscope, Calendar } from "lucide-react";

export const Route = createFileRoute("/medicos")({
  component: MedicosPage,
});

function MedicosPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Corpo clínico</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conheça os médicos disponíveis e suas especialidades.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockMedicos.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{m.nome}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{m.especialidade}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-muted-foreground">{m.crm}</div>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{m.disponibilidade}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
