import type { Role } from "./mock-data";

// Tipos para a integração WhatsApp Business
export interface WhatsAppContact {
  id: string;
  nome: string;
  telefone: string;
  avatar?: string;
  tipo: "paciente" | "medico" | "geral";
  ultimaMensagem?: string;
  ultimaHora?: string;
  naoLidas?: number;
  status?: "online" | "offline";
}

export interface WhatsAppMessage {
  id: string;
  contatoId: string;
  conteudo: string;
  timestamp: string;
  tipo: "enviada" | "recebida" | "sistema" | "bot";
  status?: "enviando" | "enviada" | "entregue" | "lida";
  templateId?: string;
}

export interface WhatsAppTemplate {
  id: string;
  nome: string;
  categoria: "lembrete" | "confirmacao" | "pos_consulta" | "atraso" | "geral";
  conteudo: string;
  variaveis: string[];
  aprovado: boolean;
  criadoEm: string;
}

export interface WhatsAppMetrics {
  mensagensEnviadas: number;
  mensagensRecebidas: number;
  tempoMedioResposta: number; // em minutos
  taxaConfirmacao: number;
  taxaResposta: number;
  mensagensPorDia: { dia: string; enviadas: number; recebidas: number }[];
}

// Templates aprovados pela Meta
export const mockTemplates: WhatsAppTemplate[] = [
  {
    id: "t1",
    nome: "Lembrete de Consulta (24h)",
    categoria: "lembrete",
    conteudo: "Olá {{nome}}! Lembramos que sua consulta com {{medico}} está agendada para amanhã, {{data}} às {{hora}}. Para confirmar, responda SIM. Para reagendar, responda REAGENDAR.",
    variaveis: ["nome", "medico", "data", "hora"],
    aprovado: true,
    criadoEm: "2026-01-15",
  },
  {
    id: "t2",
    nome: "Confirmação de Agendamento",
    categoria: "confirmacao",
    conteudo: "Olá {{nome}}! Sua consulta foi confirmada: {{especialidade}} com {{medico}} em {{data}} às {{hora}}. Local: {{endereco}}. Responda OK para confirmar recebimento.",
    variaveis: ["nome", "especialidade", "medico", "data", "hora", "endereco"],
    aprovado: true,
    criadoEm: "2026-01-15",
  },
  {
    id: "t3",
    nome: "Pós-Consulta",
    categoria: "pos_consulta",
    conteudo: "Olá {{nome}}! Esperamos que sua consulta tenha sido satisfatória. Caso tenha dúvidas sobre sua prescrição ou precise de suporte, estamos à disposição. Avalie nosso atendimento: {{link_avaliacao}}",
    variaveis: ["nome", "link_avaliacao"],
    aprovado: true,
    criadoEm: "2026-02-10",
  },
  {
    id: "t4",
    nome: "Aviso de Atraso",
    categoria: "atraso",
    conteudo: "Olá {{nome}}! Informamos que {{medico}} está com aproximadamente {{tempo}} minutos de atraso. Pedimos desculpas pelo inconveniente. Sua consulta será realizada assim que possível.",
    variaveis: ["nome", "medico", "tempo"],
    aprovado: true,
    criadoEm: "2026-02-20",
  },
  {
    id: "t5",
    nome: "Lembrete de Retorno",
    categoria: "lembrete",
    conteudo: "Olá {{nome}}! Conforme orientação médica, está na hora de agendar seu retorno de {{especialidade}}. Entre em contato para agendar: {{telefone_clinica}}",
    variaveis: ["nome", "especialidade", "telefone_clinica"],
    aprovado: true,
    criadoEm: "2026-03-05",
  },
  {
    id: "t6",
    nome: "Fora de Expediente",
    categoria: "geral",
    conteudo: "Olá! No momento estamos fora do horário de atendimento (Seg-Sex 7h-19h). Deixe sua mensagem que retornaremos assim que possível. Para emergências, procure o pronto-socorro mais próximo.",
    variaveis: [],
    aprovado: true,
    criadoEm: "2026-01-10",
  },
];

// Contatos mock
export const mockContatos: WhatsAppContact[] = [
  { id: "c1", nome: "João da Silva", telefone: "(11) 98888-1111", tipo: "paciente", ultimaMensagem: "Ok, confirmado!", ultimaHora: "10:32", naoLidas: 0, status: "online" },
  { id: "c2", nome: "Maria Oliveira", telefone: "(11) 97777-2222", tipo: "paciente", ultimaMensagem: "Posso reagendar para quinta?", ultimaHora: "09:45", naoLidas: 1, status: "offline" },
  { id: "c3", nome: "Pedro Santos", telefone: "(11) 96666-3333", tipo: "paciente", ultimaMensagem: "Qual o valor da consulta?", ultimaHora: "Ontem", naoLidas: 2, status: "offline" },
  { id: "c4", nome: "Lucia Ferreira", telefone: "(11) 95555-4444", tipo: "paciente", ultimaMensagem: "Recebi a confirmação, obrigada!", ultimaHora: "Ontem", naoLidas: 0, status: "offline" },
  { id: "c5", nome: "Rafael Mendes", telefone: "(11) 94444-5555", tipo: "paciente", ultimaMensagem: "SIM", ultimaHora: "25/04", naoLidas: 0, status: "offline" },
  { id: "c6", nome: "Dr. Carlos Souza", telefone: "(11) 99999-0001", tipo: "medico", ultimaMensagem: "Avise o paciente do atraso", ultimaHora: "08:15", naoLidas: 0, status: "online" },
  { id: "c7", nome: "Dra. Mariana Lima", telefone: "(11) 99999-0002", tipo: "medico", ultimaMensagem: "Consulta finalizada", ultimaHora: "Ontem", naoLidas: 0, status: "offline" },
];

// Mensagens mock
export const mockMensagens: WhatsAppMessage[] = [
  // Conversa com João da Silva
  { id: "m1", contatoId: "c1", conteudo: "Olá João! Lembramos que sua consulta com Dr. Carlos Souza está agendada para amanhã, 30/04 às 08:30. Para confirmar, responda SIM. Para reagendar, responda REAGENDAR.", timestamp: "2026-04-29T14:00:00", tipo: "enviada", status: "lida", templateId: "t1" },
  { id: "m2", contatoId: "c1", conteudo: "SIM", timestamp: "2026-04-29T14:15:00", tipo: "recebida" },
  { id: "m3", contatoId: "c1", conteudo: "Perfeito! Sua presença está confirmada. Até amanhã!", timestamp: "2026-04-29T14:15:30", tipo: "enviada", status: "lida" },
  { id: "m4", contatoId: "c1", conteudo: "Ok, confirmado!", timestamp: "2026-04-30T10:32:00", tipo: "recebida" },

  // Conversa com Maria Oliveira
  { id: "m5", contatoId: "c2", conteudo: "Olá Maria! Sua consulta foi confirmada: Pediatria com Dra. Mariana Lima em 30/04 às 09:00. Local: Sala 02. Responda OK para confirmar recebimento.", timestamp: "2026-04-28T10:00:00", tipo: "enviada", status: "lida", templateId: "t2" },
  { id: "m6", contatoId: "c2", conteudo: "OK", timestamp: "2026-04-28T10:30:00", tipo: "recebida" },
  { id: "m7", contatoId: "c2", conteudo: "Posso reagendar para quinta?", timestamp: "2026-04-30T09:45:00", tipo: "recebida" },

  // Conversa com Pedro Santos
  { id: "m8", contatoId: "c3", conteudo: "Olá Pedro! Lembramos que sua consulta com Dr. Felipe Rocha está agendada para 02/05 às 15:00. Para confirmar, responda SIM.", timestamp: "2026-04-29T08:00:00", tipo: "enviada", status: "entregue", templateId: "t1" },
  { id: "m9", contatoId: "c3", conteudo: "Qual o valor da consulta?", timestamp: "2026-04-29T16:00:00", tipo: "recebida" },
  { id: "m10", contatoId: "c3", conteudo: "Vou verificar, um momento", timestamp: "2026-04-29T17:00:00", tipo: "recebida" },

  // Mensagem do chatbot fora de expediente
  { id: "m11", contatoId: "c5", conteudo: "Oi, preciso agendar consulta", timestamp: "2026-04-25T22:30:00", tipo: "recebida" },
  { id: "m12", contatoId: "c5", conteudo: "Olá! No momento estamos fora do horário de atendimento (Seg-Sex 7h-19h). Deixe sua mensagem que retornaremos assim que possível. Para emergências, procure o pronto-socorro mais próximo.", timestamp: "2026-04-25T22:30:05", tipo: "bot", templateId: "t6" },
  { id: "m13", contatoId: "c5", conteudo: "Olá Rafael! Recebemos sua mensagem. Como podemos ajudar?", timestamp: "2026-04-26T07:05:00", tipo: "enviada", status: "lida" },
  { id: "m14", contatoId: "c5", conteudo: "Quero agendar cardiologia", timestamp: "2026-04-26T08:00:00", tipo: "recebida" },
  { id: "m15", contatoId: "c5", conteudo: "Temos disponibilidade para 30/04 às 10:30 com Dr. Carlos Souza. Confirma?", timestamp: "2026-04-26T08:05:00", tipo: "enviada", status: "lida" },
  { id: "m16", contatoId: "c5", conteudo: "SIM", timestamp: "2026-04-26T08:10:00", tipo: "recebida" },
];

// Métricas mock
export const mockMetrics: WhatsAppMetrics = {
  mensagensEnviadas: 1247,
  mensagensRecebidas: 892,
  tempoMedioResposta: 8,
  taxaConfirmacao: 87,
  taxaResposta: 76,
  mensagensPorDia: [
    { dia: "Seg", enviadas: 245, recebidas: 189 },
    { dia: "Ter", enviadas: 278, recebidas: 201 },
    { dia: "Qua", enviadas: 312, recebidas: 234 },
    { dia: "Qui", enviadas: 198, recebidas: 145 },
    { dia: "Sex", enviadas: 214, recebidas: 123 },
  ],
};

// Permissões por role
export const whatsappPermissions: Record<Role, {
  podeEnviarMensagem: boolean;
  podeUsarTemplates: boolean;
  podeVerMetricas: boolean;
  podeGerirTemplates: boolean;
  podeEnviarAtraso: boolean;
  podeEnviarPosConsulta: boolean;
  acessoChat: "completo" | "limitado" | "somente_leitura" | "nenhum";
}> = {
  recepcionista: {
    podeEnviarMensagem: true,
    podeUsarTemplates: true,
    podeVerMetricas: false,
    podeGerirTemplates: false,
    podeEnviarAtraso: false,
    podeEnviarPosConsulta: false,
    acessoChat: "completo",
  },
  paciente: {
    podeEnviarMensagem: false,
    podeUsarTemplates: false,
    podeVerMetricas: false,
    podeGerirTemplates: false,
    podeEnviarAtraso: false,
    podeEnviarPosConsulta: false,
    acessoChat: "somente_leitura",
  },
  medico: {
    podeEnviarMensagem: true,
    podeUsarTemplates: true,
    podeVerMetricas: false,
    podeGerirTemplates: false,
    podeEnviarAtraso: true,
    podeEnviarPosConsulta: true,
    acessoChat: "limitado",
  },
  administrador: {
    podeEnviarMensagem: true,
    podeUsarTemplates: true,
    podeVerMetricas: true,
    podeGerirTemplates: true,
    podeEnviarAtraso: true,
    podeEnviarPosConsulta: true,
    acessoChat: "completo",
  },
};

// Configuração do chatbot fora de expediente
export const chatbotConfig = {
  ativo: true,
  horarioInicio: "07:00",
  horarioFim: "19:00",
  diasAtivos: ["seg", "ter", "qua", "qui", "sex"],
  templateForaExpediente: "t6",
  mensagemBoasVindas: "Olá! Bem-vindo à SaúdeClin. Como posso ajudar?",
  opcoesRapidas: [
    { id: "1", texto: "Agendar consulta", acao: "agendar" },
    { id: "2", texto: "Confirmar consulta", acao: "confirmar" },
    { id: "3", texto: "Reagendar consulta", acao: "reagendar" },
    { id: "4", texto: "Falar com atendente", acao: "atendente" },
  ],
};

// Rotas principais da API WhatsApp Business (documentação)
export const whatsappApiRoutes = {
  enviarMensagem: "POST /v17.0/{phone-number-id}/messages",
  enviarTemplate: "POST /v17.0/{phone-number-id}/messages (type: template)",
  receberWebhook: "POST /webhook",
  verificarWebhook: "GET /webhook",
  obterMidia: "GET /v17.0/{media-id}",
  uploadMidia: "POST /v17.0/{phone-number-id}/media",
  obterTemplates: "GET /v17.0/{waba-id}/message_templates",
  criarTemplate: "POST /v17.0/{waba-id}/message_templates",
};
