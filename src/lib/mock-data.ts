export type Role = "paciente" | "recepcionista" | "medico" | "administrador";

export interface MockUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export const mockUsers: MockUser[] = [
  { id: "1", nome: "Ana Paciente", email: "paciente@clinica.com", role: "paciente" },
  { id: "2", nome: "Beatriz Recepção", email: "recepcao@clinica.com", role: "recepcionista" },
  { id: "3", nome: "Dr. Carlos Souza", email: "medico@clinica.com", role: "medico" },
  { id: "4", nome: "Diana Admin", email: "admin@clinica.com", role: "administrador" },
];

export const mockPacientes = [
  { id: "p1", nome: "João da Silva", cpf: "123.456.789-00", nascimento: "1985-03-12", telefone: "(11) 98888-1111", convenio: "Unimed" },
  { id: "p2", nome: "Maria Oliveira", cpf: "987.654.321-00", nascimento: "1992-07-22", telefone: "(11) 97777-2222", convenio: "Bradesco Saúde" },
  { id: "p3", nome: "Pedro Santos", cpf: "456.123.789-00", nascimento: "1978-11-05", telefone: "(11) 96666-3333", convenio: "Particular" },
  { id: "p4", nome: "Lucia Ferreira", cpf: "321.654.987-00", nascimento: "2001-01-30", telefone: "(11) 95555-4444", convenio: "SulAmérica" },
];

export const mockMedicos = [
  { id: "m1", nome: "Dr. Carlos Souza", especialidade: "Cardiologia", crm: "CRM/SP 12345", disponibilidade: "Seg, Qua, Sex" },
  { id: "m2", nome: "Dra. Mariana Lima", especialidade: "Pediatria", crm: "CRM/SP 23456", disponibilidade: "Ter, Qui" },
  { id: "m3", nome: "Dr. Felipe Rocha", especialidade: "Ortopedia", crm: "CRM/SP 34567", disponibilidade: "Seg a Sex" },
  { id: "m4", nome: "Dra. Helena Castro", especialidade: "Dermatologia", crm: "CRM/SP 45678", disponibilidade: "Qua, Sex" },
];

export const mockAgendamentos = [
  { id: "a1", paciente: "João da Silva", medico: "Dr. Carlos Souza", especialidade: "Cardiologia", data: "2026-04-25", hora: "09:00", status: "Confirmado" },
  { id: "a2", paciente: "Maria Oliveira", medico: "Dra. Mariana Lima", especialidade: "Pediatria", data: "2026-04-25", hora: "10:30", status: "Confirmado" },
  { id: "a3", paciente: "Pedro Santos", medico: "Dr. Felipe Rocha", especialidade: "Ortopedia", data: "2026-04-26", hora: "14:00", status: "Pendente" },
  { id: "a4", paciente: "Lucia Ferreira", medico: "Dra. Helena Castro", especialidade: "Dermatologia", data: "2026-04-27", hora: "11:00", status: "Confirmado" },
];

export const mockProntuarios = [
  {
    pacienteId: "p1",
    paciente: "João da Silva",
    historico: [
      { data: "2026-03-10", medico: "Dr. Carlos Souza", descricao: "Consulta cardiológica de rotina. Pressão arterial controlada.", prescricao: "Losartana 50mg - 1x/dia" },
      { data: "2025-11-22", medico: "Dr. Carlos Souza", descricao: "Avaliação inicial. Histórico familiar de hipertensão.", prescricao: "Solicitado ECG e exames laboratoriais" },
    ],
  },
  {
    pacienteId: "p2",
    paciente: "Maria Oliveira",
    historico: [
      { data: "2026-02-15", medico: "Dra. Mariana Lima", descricao: "Acompanhamento pediátrico do filho. Desenvolvimento normal.", prescricao: "Vitamina D - 5 gotas/dia" },
    ],
  },
];
