import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SaúdeClin — Gestão para clínicas" },
      { name: "description", content: "Sistema de gestão clínica: agendamento, pacientes, prontuário e administração." },
      { property: "og:title", content: "SaúdeClin — Gestão para clínicas" },
      { name: "twitter:title", content: "SaúdeClin — Gestão para clínicas" },
      { property: "og:description", content: "Sistema de gestão clínica: agendamento, pacientes, prontuário e administração." },
      { name: "twitter:description", content: "Sistema de gestão clínica: agendamento, pacientes, prontuário e administração." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4bbd200f-1a85-4ea9-a22b-4f8d50465f49/id-preview-6f3230ee--429691f3-17ff-41ee-8129-25c21d2ecd7d.lovable.app-1776945508609.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4bbd200f-1a85-4ea9-a22b-4f8d50465f49/id-preview-6f3230ee--429691f3-17ff-41ee-8129-25c21d2ecd7d.lovable.app-1776945508609.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
