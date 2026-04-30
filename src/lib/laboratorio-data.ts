import { mockPacientes, mockMedicos } from "./mock-data";

// Tipos
export type StatusExame = "solicitado" | "coletado" | "em_analise" | "concluido" | "cancelado";
export type TipoExame = "laboratorial" | "imagem";
export type PrioridadeExame = "normal" | "urgente";

export interface Exame {
  id: string;
  codigo: string; // Código de barras / requisição
  pacienteId: string;
  pacienteNome: string;
  medicoSolicitanteId: string;
  medicoSolicitanteNome: string;
  tipo: TipoExame;
  categoria: string;
  nome: string;
  descricao: string;
  status: StatusExame;
  prioridade: PrioridadeExame;
  dataSolicitacao: string;
  dataColeta?: string;
  dataResultado?: string;
  laboratorio?: string;
  resultado?: ResultadoExame;
  observacoes?: string;
}

export interface ResultadoExame {
  valores: ValorExame[];
  laudo?: string;
  arquivoUrl?: string;
  responsavelTecnico?: string;
}

export interface ValorExame {
  parametro: string;
  valor: string;
  unidade: string;
  referencia: string;
  status: "normal" | "alterado" | "critico";
}

export interface CatalogoExame {
  id: string;
  nome: string;
  categoria: string;
  tipo: TipoExame;
  descricao: string;
  prazoResultado: string; // Ex: "24h", "48h", "7 dias"
  preparacao?: string;
}

// Catálogo de exames disponíveis
export const catalogoExames: CatalogoExame[] = [
  // Laboratoriais - Sangue
  { id: "cat1", nome: "Hemograma Completo", categoria: "Hematologia", tipo: "laboratorial", descricao: "Análise completa das células sanguíneas", prazoResultado: "24h", preparacao: "Jejum de 4 horas" },
  { id: "cat2", nome: "Glicemia em Jejum", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Dosagem de glicose no sangue", prazoResultado: "24h", preparacao: "Jejum de 8-12 horas" },
  { id: "cat3", nome: "Colesterol Total e Frações", categoria: "Bioquímica", tipo: "laboratorial", descricao: "HDL, LDL, VLDL e triglicerídeos", prazoResultado: "24h", preparacao: "Jejum de 12 horas" },
  { id: "cat4", nome: "TSH", categoria: "Hormônios", tipo: "laboratorial", descricao: "Hormônio estimulante da tireoide", prazoResultado: "48h" },
  { id: "cat5", nome: "T4 Livre", categoria: "Hormônios", tipo: "laboratorial", descricao: "Tiroxina livre", prazoResultado: "48h" },
  { id: "cat6", nome: "Ureia", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Avaliação da função renal", prazoResultado: "24h" },
  { id: "cat7", nome: "Creatinina", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Avaliação da função renal", prazoResultado: "24h" },
  { id: "cat8", nome: "TGO (AST)", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Enzima hepática", prazoResultado: "24h" },
  { id: "cat9", nome: "TGP (ALT)", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Enzima hepática", prazoResultado: "24h" },
  { id: "cat10", nome: "Ácido Úrico", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Dosagem de ácido úrico sérico", prazoResultado: "24h" },
  { id: "cat11", nome: "PSA Total", categoria: "Marcadores Tumorais", tipo: "laboratorial", descricao: "Antígeno prostático específico", prazoResultado: "48h" },
  { id: "cat12", nome: "Vitamina D", categoria: "Vitaminas", tipo: "laboratorial", descricao: "25-hidroxivitamina D", prazoResultado: "72h" },
  { id: "cat13", nome: "Vitamina B12", categoria: "Vitaminas", tipo: "laboratorial", descricao: "Cobalamina sérica", prazoResultado: "72h" },
  { id: "cat14", nome: "Ferro Sérico", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Dosagem de ferro no sangue", prazoResultado: "24h" },
  { id: "cat15", nome: "Ferritina", categoria: "Bioquímica", tipo: "laboratorial", descricao: "Reserva de ferro no organismo", prazoResultado: "48h" },
  
  // Laboratoriais - Urina
  { id: "cat16", nome: "Urina Tipo I (EAS)", categoria: "Urinálise", tipo: "laboratorial", descricao: "Análise física, química e microscópica", prazoResultado: "24h", preparacao: "Primeira urina da manhã" },
  { id: "cat17", nome: "Urocultura", categoria: "Microbiologia", tipo: "laboratorial", descricao: "Cultura bacteriana de urina", prazoResultado: "5 dias", preparacao: "Jato médio, primeira urina" },
  
  // Imagem
  { id: "cat18", nome: "Raio-X de Tórax", categoria: "Radiologia", tipo: "imagem", descricao: "Radiografia torácica PA e perfil", prazoResultado: "24h" },
  { id: "cat19", nome: "Raio-X de Coluna Lombar", categoria: "Radiologia", tipo: "imagem", descricao: "Radiografia da coluna lombossacra", prazoResultado: "24h" },
  { id: "cat20", nome: "Ultrassom Abdominal Total", categoria: "Ultrassonografia", tipo: "imagem", descricao: "Avaliação de órgãos abdominais", prazoResultado: "48h", preparacao: "Jejum de 6 horas" },
  { id: "cat21", nome: "Ecocardiograma", categoria: "Cardiologia", tipo: "imagem", descricao: "Ultrassom do coração", prazoResultado: "48h" },
  { id: "cat22", nome: "Eletrocardiograma (ECG)", categoria: "Cardiologia", tipo: "imagem", descricao: "Registro da atividade elétrica cardíaca", prazoResultado: "24h" },
  { id: "cat23", nome: "Tomografia de Crânio", categoria: "Tomografia", tipo: "imagem", descricao: "TC de crânio sem contraste", prazoResultado: "48h" },
  { id: "cat24", nome: "Ressonância Magnética de Joelho", categoria: "Ressonância", tipo: "imagem", descricao: "RM de joelho bilateral", prazoResultado: "7 dias" },
];

// Gera data relativa
const diasAtras = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
};

const hoje = new Date().toISOString().slice(0, 10);

// Dados mock de exames
export const mockExames: Exame[] = [
  // Exames concluídos
  {
    id: "ex1",
    codigo: "REQ-2026-001234",
    pacienteId: "p1",
    pacienteNome: "João da Silva",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "laboratorial",
    categoria: "Bioquímica",
    nome: "Glicemia em Jejum",
    descricao: "Dosagem de glicose no sangue",
    status: "concluido",
    prioridade: "normal",
    dataSolicitacao: diasAtras(10),
    dataColeta: diasAtras(9),
    dataResultado: diasAtras(8),
    laboratorio: "LabPlus Diagnósticos",
    resultado: {
      valores: [
        { parametro: "Glicemia", valor: "98", unidade: "mg/dL", referencia: "70 - 99", status: "normal" }
      ],
      responsavelTecnico: "Dra. Ana Paula Ferreira - CRF 12345"
    }
  },
  {
    id: "ex2",
    codigo: "REQ-2026-001235",
    pacienteId: "p1",
    pacienteNome: "João da Silva",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "laboratorial",
    categoria: "Bioquímica",
    nome: "Colesterol Total e Frações",
    descricao: "HDL, LDL, VLDL e triglicerídeos",
    status: "concluido",
    prioridade: "normal",
    dataSolicitacao: diasAtras(10),
    dataColeta: diasAtras(9),
    dataResultado: diasAtras(8),
    laboratorio: "LabPlus Diagnósticos",
    resultado: {
      valores: [
        { parametro: "Colesterol Total", valor: "215", unidade: "mg/dL", referencia: "< 200", status: "alterado" },
        { parametro: "HDL", valor: "45", unidade: "mg/dL", referencia: "> 40", status: "normal" },
        { parametro: "LDL", valor: "142", unidade: "mg/dL", referencia: "< 130", status: "alterado" },
        { parametro: "VLDL", valor: "28", unidade: "mg/dL", referencia: "< 30", status: "normal" },
        { parametro: "Triglicerídeos", valor: "140", unidade: "mg/dL", referencia: "< 150", status: "normal" }
      ],
      responsavelTecnico: "Dra. Ana Paula Ferreira - CRF 12345"
    }
  },
  {
    id: "ex3",
    codigo: "REQ-2026-001240",
    pacienteId: "p1",
    pacienteNome: "João da Silva",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "imagem",
    categoria: "Cardiologia",
    nome: "Eletrocardiograma (ECG)",
    descricao: "Registro da atividade elétrica cardíaca",
    status: "concluido",
    prioridade: "normal",
    dataSolicitacao: diasAtras(15),
    dataColeta: diasAtras(14),
    dataResultado: diasAtras(13),
    laboratorio: "CardioImagem",
    resultado: {
      valores: [
        { parametro: "Frequência Cardíaca", valor: "72", unidade: "bpm", referencia: "60 - 100", status: "normal" },
        { parametro: "Ritmo", valor: "Sinusal", unidade: "", referencia: "Sinusal", status: "normal" }
      ],
      laudo: "ECG dentro dos padrões de normalidade. Ritmo sinusal regular, sem alterações de repolarização.",
      responsavelTecnico: "Dr. Roberto Cardoso - CRM/SP 98765"
    }
  },
  {
    id: "ex4",
    codigo: "REQ-2026-001301",
    pacienteId: "p3",
    pacienteNome: "Pedro Santos",
    medicoSolicitanteId: "m3",
    medicoSolicitanteNome: "Dr. Felipe Rocha",
    tipo: "imagem",
    categoria: "Radiologia",
    nome: "Raio-X de Coluna Lombar",
    descricao: "Radiografia da coluna lombossacra",
    status: "concluido",
    prioridade: "normal",
    dataSolicitacao: diasAtras(5),
    dataColeta: diasAtras(4),
    dataResultado: diasAtras(3),
    laboratorio: "DiagImagem Centro",
    resultado: {
      valores: [],
      laudo: "Redução do espaço discal L4-L5 com discreta osteofitose marginal. Alinhamento vertebral preservado. Sem sinais de fraturas ou lesões líticas.",
      responsavelTecnico: "Dra. Camila Martins - CRM/SP 54321"
    }
  },

  // Exames em andamento
  {
    id: "ex5",
    codigo: "REQ-2026-001450",
    pacienteId: "p2",
    pacienteNome: "Maria Oliveira",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "laboratorial",
    categoria: "Hematologia",
    nome: "Hemograma Completo",
    descricao: "Análise completa das células sanguíneas",
    status: "em_analise",
    prioridade: "normal",
    dataSolicitacao: diasAtras(2),
    dataColeta: diasAtras(1),
    laboratorio: "LabPlus Diagnósticos"
  },
  {
    id: "ex6",
    codigo: "REQ-2026-001451",
    pacienteId: "p2",
    pacienteNome: "Maria Oliveira",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "laboratorial",
    categoria: "Hormônios",
    nome: "TSH",
    descricao: "Hormônio estimulante da tireoide",
    status: "coletado",
    prioridade: "normal",
    dataSolicitacao: diasAtras(2),
    dataColeta: hoje,
    laboratorio: "LabPlus Diagnósticos"
  },
  {
    id: "ex7",
    codigo: "REQ-2026-001500",
    pacienteId: "p4",
    pacienteNome: "Lucia Ferreira",
    medicoSolicitanteId: "m4",
    medicoSolicitanteNome: "Dra. Helena Castro",
    tipo: "laboratorial",
    categoria: "Bioquímica",
    nome: "Vitamina D",
    descricao: "25-hidroxivitamina D",
    status: "solicitado",
    prioridade: "normal",
    dataSolicitacao: hoje,
    observacoes: "Paciente com suspeita de deficiência vitamínica"
  },
  {
    id: "ex8",
    codigo: "REQ-2026-001501",
    pacienteId: "p5",
    pacienteNome: "Rafael Mendes",
    medicoSolicitanteId: "m1",
    medicoSolicitanteNome: "Dr. Carlos Souza",
    tipo: "imagem",
    categoria: "Cardiologia",
    nome: "Ecocardiograma",
    descricao: "Ultrassom do coração",
    status: "solicitado",
    prioridade: "urgente",
    dataSolicitacao: hoje,
    observacoes: "Paciente com sopro cardíaco identificado na ausculta"
  },
  {
    id: "ex9",
    codigo: "REQ-2026-001502",
    pacienteId: "p6",
    pacienteNome: "Camila Rocha",
    medicoSolicitanteId: "m5",
    medicoSolicitanteNome: "Dr. Bruno Tavares",
    tipo: "laboratorial",
    categoria: "Urinálise",
    nome: "Urina Tipo I (EAS)",
    descricao: "Análise física, química e microscópica",
    status: "coletado",
    prioridade: "normal",
    dataSolicitacao: diasAtras(1),
    dataColeta: hoje,
    laboratorio: "LabPlus Diagnósticos"
  },

  // Exame cancelado
  {
    id: "ex10",
    codigo: "REQ-2026-001100",
    pacienteId: "p7",
    pacienteNome: "Eduardo Lima",
    medicoSolicitanteId: "m5",
    medicoSolicitanteNome: "Dr. Bruno Tavares",
    tipo: "imagem",
    categoria: "Tomografia",
    nome: "Tomografia de Crânio",
    descricao: "TC de crânio sem contraste",
    status: "cancelado",
    prioridade: "normal",
    dataSolicitacao: diasAtras(7),
    observacoes: "Cancelado a pedido do paciente - realizará em outra instituição"
  }
];

// Laboratórios parceiros
export const laboratoriosParceiros = [
  { id: "lab1", nome: "LabPlus Diagnósticos", tipos: ["laboratorial"], endereco: "Av. Paulista, 1000 - São Paulo", telefone: "(11) 3333-1111" },
  { id: "lab2", nome: "DiagImagem Centro", tipos: ["imagem"], endereco: "Rua Augusta, 500 - São Paulo", telefone: "(11) 3333-2222" },
  { id: "lab3", nome: "CardioImagem", tipos: ["imagem"], endereco: "Av. Brasil, 2000 - São Paulo", telefone: "(11) 3333-3333" },
];

// Helpers
export const statusLabels: Record<StatusExame, string> = {
  solicitado: "Solicitado",
  coletado: "Coletado",
  em_analise: "Em Análise",
  concluido: "Concluído",
  cancelado: "Cancelado"
};

export const statusColors: Record<StatusExame, string> = {
  solicitado: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  coletado: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  em_analise: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  concluido: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  cancelado: "bg-muted text-muted-foreground border-border"
};

export const prioridadeLabels: Record<PrioridadeExame, string> = {
  normal: "Normal",
  urgente: "Urgente"
};

export function gerarCodigoRequisicao(): string {
  const ano = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 900000) + 100000;
  return `REQ-${ano}-${numero}`;
}

export function getExamesPorPaciente(pacienteId: string): Exame[] {
  return mockExames.filter(e => e.pacienteId === pacienteId);
}

export function getExamesPorMedico(medicoId: string): Exame[] {
  return mockExames.filter(e => e.medicoSolicitanteId === medicoId);
}

export function getExamesPendentes(): Exame[] {
  return mockExames.filter(e => ["solicitado", "coletado", "em_analise"].includes(e.status));
}

export function getExamesConcluidos(): Exame[] {
  return mockExames.filter(e => e.status === "concluido");
}
