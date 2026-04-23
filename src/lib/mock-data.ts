export type Role = "paciente" | "recepcionista" | "medico" | "administrador";

export interface MockUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export const mockUsers: MockUser[] = [
  { id: "1", nome: "Ana Beatriz Moraes", email: "paciente@clinica.com", role: "paciente" },
  { id: "2", nome: "Beatriz Recepção", email: "recepcao@clinica.com", role: "recepcionista" },
  { id: "3", nome: "Dr. Carlos Souza", email: "medico@clinica.com", role: "medico" },
  { id: "4", nome: "Diana Albuquerque", email: "admin@clinica.com", role: "administrador" },
];

export const mockPacientes = [
  { id: "p1", nome: "João da Silva", cpf: "123.456.789-00", nascimento: "1985-03-12", telefone: "(11) 98888-1111", convenio: "Unimed", ultimaConsulta: "2026-03-10" },
  { id: "p2", nome: "Maria Oliveira", cpf: "987.654.321-00", nascimento: "1992-07-22", telefone: "(11) 97777-2222", convenio: "Bradesco Saúde", ultimaConsulta: "2026-02-15" },
  { id: "p3", nome: "Pedro Santos", cpf: "456.123.789-00", nascimento: "1978-11-05", telefone: "(11) 96666-3333", convenio: "Particular", ultimaConsulta: "2026-04-02" },
  { id: "p4", nome: "Lucia Ferreira", cpf: "321.654.987-00", nascimento: "2001-01-30", telefone: "(11) 95555-4444", convenio: "SulAmérica", ultimaConsulta: "2026-04-18" },
  { id: "p5", nome: "Rafael Mendes", cpf: "147.258.369-00", nascimento: "1990-09-14", telefone: "(11) 94444-5555", convenio: "Amil", ultimaConsulta: "2026-04-20" },
  { id: "p6", nome: "Camila Rocha", cpf: "258.369.147-00", nascimento: "1995-05-08", telefone: "(11) 93333-6666", convenio: "Unimed", ultimaConsulta: "2026-03-28" },
  { id: "p7", nome: "Eduardo Lima", cpf: "369.147.258-00", nascimento: "1972-12-19", telefone: "(11) 92222-7777", convenio: "Particular", ultimaConsulta: "2026-04-15" },
  { id: "p8", nome: "Fernanda Castro", cpf: "741.852.963-00", nascimento: "1988-06-25", telefone: "(11) 91111-8888", convenio: "Bradesco Saúde", ultimaConsulta: "2026-04-21" },
];

export const mockMedicos = [
  { id: "m1", nome: "Dr. Carlos Souza", especialidade: "Cardiologia", crm: "CRM/SP 12345", disponibilidade: "Seg, Qua, Sex", status: "Em atendimento", sala: "Sala 04" },
  { id: "m2", nome: "Dra. Mariana Lima", especialidade: "Pediatria", crm: "CRM/SP 23456", disponibilidade: "Ter, Qui", status: "Em atendimento", sala: "Sala 02" },
  { id: "m3", nome: "Dr. Felipe Rocha", especialidade: "Ortopedia", crm: "CRM/SP 34567", disponibilidade: "Seg a Sex", status: "Disponível", sala: "Sala 06" },
  { id: "m4", nome: "Dra. Helena Castro", especialidade: "Dermatologia", crm: "CRM/SP 45678", disponibilidade: "Qua, Sex", status: "Em atendimento", sala: "Sala 03" },
  { id: "m5", nome: "Dr. Bruno Tavares", especialidade: "Clínica Geral", crm: "CRM/SP 56789", disponibilidade: "Seg a Sex", status: "Disponível", sala: "Sala 01" },
  { id: "m6", nome: "Dra. Patrícia Nunes", especialidade: "Ginecologia", crm: "CRM/SP 67890", disponibilidade: "Ter, Qui, Sex", status: "Pausa", sala: "Sala 05" },
];

const hoje = new Date().toISOString().slice(0, 10);
const amanha = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const depois = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

export const mockAgendamentos = [
  { id: "a1", paciente: "João da Silva", medico: "Dr. Carlos Souza", especialidade: "Cardiologia", data: hoje, hora: "08:30", status: "Concluído", sala: "Sala 04" },
  { id: "a2", paciente: "Maria Oliveira", medico: "Dra. Mariana Lima", especialidade: "Pediatria", data: hoje, hora: "09:00", status: "Em atendimento", sala: "Sala 02" },
  { id: "a3", paciente: "Pedro Santos", medico: "Dr. Felipe Rocha", especialidade: "Ortopedia", data: hoje, hora: "09:30", status: "Aguardando", sala: "Sala 06" },
  { id: "a4", paciente: "Lucia Ferreira", medico: "Dra. Helena Castro", especialidade: "Dermatologia", data: hoje, hora: "10:00", status: "Aguardando", sala: "Sala 03" },
  { id: "a5", paciente: "Rafael Mendes", medico: "Dr. Carlos Souza", especialidade: "Cardiologia", data: hoje, hora: "10:30", status: "Confirmado", sala: "Sala 04" },
  { id: "a6", paciente: "Camila Rocha", medico: "Dra. Patrícia Nunes", especialidade: "Ginecologia", data: hoje, hora: "11:00", status: "Confirmado", sala: "Sala 05" },
  { id: "a7", paciente: "Eduardo Lima", medico: "Dr. Bruno Tavares", especialidade: "Clínica Geral", data: hoje, hora: "11:30", status: "Confirmado", sala: "Sala 01" },
  { id: "a8", paciente: "Fernanda Castro", medico: "Dra. Mariana Lima", especialidade: "Pediatria", data: hoje, hora: "14:00", status: "Confirmado", sala: "Sala 02" },
  { id: "a9", paciente: "João da Silva", medico: "Dr. Felipe Rocha", especialidade: "Ortopedia", data: amanha, hora: "08:00", status: "Confirmado", sala: "Sala 06" },
  { id: "a10", paciente: "Maria Oliveira", medico: "Dr. Carlos Souza", especialidade: "Cardiologia", data: amanha, hora: "10:30", status: "Confirmado", sala: "Sala 04" },
  { id: "a11", paciente: "Pedro Santos", medico: "Dra. Helena Castro", especialidade: "Dermatologia", data: depois, hora: "15:00", status: "Pendente", sala: "Sala 03" },
  { id: "a12", paciente: "Camila Rocha", medico: "Dr. Bruno Tavares", especialidade: "Clínica Geral", data: depois, hora: "16:00", status: "Pendente", sala: "Sala 01" },
];

export const mockFilaEspera = [
  { id: "f1", paciente: "Pedro Santos", medico: "Dr. Felipe Rocha", chegada: "09:18", aguardando: 12, prioridade: "Normal" },
  { id: "f2", paciente: "Lucia Ferreira", medico: "Dra. Helena Castro", chegada: "09:42", aguardando: 8, prioridade: "Normal" },
  { id: "f3", paciente: "Eduardo Lima", medico: "Dr. Bruno Tavares", chegada: "11:05", aguardando: 4, prioridade: "Preferencial" },
];

export const mockProntuarios = [
  {
    pacienteId: "p1",
    paciente: "João da Silva",
    nascimento: "1985-03-12",
    convenio: "Unimed",
    alergias: ["Dipirona"],
    historico: [
      { data: "2026-03-10", medico: "Dr. Carlos Souza", descricao: "Consulta cardiológica de rotina. PA 130/85, FC 72bpm. Paciente refere boa adesão à medicação.", prescricao: "Losartana 50mg - 1x/dia, manter hábitos." },
      { data: "2025-11-22", medico: "Dr. Carlos Souza", descricao: "Avaliação inicial. Histórico familiar de hipertensão. Sobrepeso leve.", prescricao: "Solicitado ECG, perfil lipídico e glicemia em jejum." },
      { data: "2025-08-05", medico: "Dr. Bruno Tavares", descricao: "Check-up anual. Sem queixas. Encaminhado para cardiologia.", prescricao: "—" },
    ],
  },
  {
    pacienteId: "p2",
    paciente: "Maria Oliveira",
    nascimento: "1992-07-22",
    convenio: "Bradesco Saúde",
    alergias: [],
    historico: [
      { data: "2026-02-15", medico: "Dra. Mariana Lima", descricao: "Acompanhamento pediátrico do filho de 4 anos. Desenvolvimento dentro da curva esperada.", prescricao: "Vitamina D - 5 gotas/dia." },
    ],
  },
  {
    pacienteId: "p3",
    paciente: "Pedro Santos",
    nascimento: "1978-11-05",
    convenio: "Particular",
    alergias: ["Penicilina"],
    historico: [
      { data: "2026-04-02", medico: "Dr. Felipe Rocha", descricao: "Dor lombar há 3 semanas. Sem irradiação. Solicitado RX de coluna lombossacra.", prescricao: "Ciclobenzaprina 10mg - 1x à noite por 7 dias." },
    ],
  },
];

export const mockIndicadores = {
  consultasMes: 412,
  novosPacientes: 38,
  faturamentoMes: 184500,
  taxaComparecimento: 92,
  ticketMedio: 448,
  satisfacao: 4.8,
};

export const mockFaturamento = [
  { mes: "Nov", valor: 142000 },
  { mes: "Dez", valor: 158000 },
  { mes: "Jan", valor: 151000 },
  { mes: "Fev", valor: 169000 },
  { mes: "Mar", valor: 176000 },
  { mes: "Abr", valor: 184500 },
];
