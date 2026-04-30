import { 
  mockExames, 
  catalogoExames, 
  gerarCodigoRequisicao,
  type Exame, 
  type StatusExame,
  type CatalogoExame,
  type ResultadoExame
} from "./laboratorio-data";

// Simula um banco de dados em memória
let exames = [...mockExames];

export const laboratorioService = {
  // Buscar todos os exames
  getExames(): Exame[] {
    return exames;
  },

  // Buscar exame por ID
  getExameById(id: string): Exame | undefined {
    return exames.find(e => e.id === id);
  },

  // Buscar exames por paciente
  getExamesPorPaciente(pacienteId: string): Exame[] {
    return exames.filter(e => e.pacienteId === pacienteId);
  },

  // Buscar exames por médico solicitante
  getExamesPorMedico(medicoId: string): Exame[] {
    return exames.filter(e => e.medicoSolicitanteId === medicoId);
  },

  // Buscar exames pendentes (para recepção/laboratório)
  getExamesPendentes(): Exame[] {
    return exames.filter(e => ["solicitado", "coletado", "em_analise"].includes(e.status));
  },

  // Buscar exames por status
  getExamesPorStatus(status: StatusExame): Exame[] {
    return exames.filter(e => e.status === status);
  },

  // Solicitar novo exame (médico)
  solicitarExame(dados: {
    pacienteId: string;
    pacienteNome: string;
    medicoId: string;
    medicoNome: string;
    catalogoExameId: string;
    prioridade: "normal" | "urgente";
    observacoes?: string;
  }): Exame {
    const catalogoItem = catalogoExames.find(c => c.id === dados.catalogoExameId);
    if (!catalogoItem) throw new Error("Exame não encontrado no catálogo");

    const novoExame: Exame = {
      id: `ex${Date.now()}`,
      codigo: gerarCodigoRequisicao(),
      pacienteId: dados.pacienteId,
      pacienteNome: dados.pacienteNome,
      medicoSolicitanteId: dados.medicoId,
      medicoSolicitanteNome: dados.medicoNome,
      tipo: catalogoItem.tipo,
      categoria: catalogoItem.categoria,
      nome: catalogoItem.nome,
      descricao: catalogoItem.descricao,
      status: "solicitado",
      prioridade: dados.prioridade,
      dataSolicitacao: new Date().toISOString().slice(0, 10),
      observacoes: dados.observacoes
    };

    exames = [novoExame, ...exames];
    return novoExame;
  },

  // Registrar coleta (recepcionista/técnico)
  registrarColeta(exameId: string, laboratorio: string): Exame | null {
    const index = exames.findIndex(e => e.id === exameId);
    if (index === -1) return null;

    exames[index] = {
      ...exames[index],
      status: "coletado",
      dataColeta: new Date().toISOString().slice(0, 10),
      laboratorio
    };

    return exames[index];
  },

  // Marcar em análise
  marcarEmAnalise(exameId: string): Exame | null {
    const index = exames.findIndex(e => e.id === exameId);
    if (index === -1) return null;

    exames[index] = {
      ...exames[index],
      status: "em_analise"
    };

    return exames[index];
  },

  // Registrar resultado (simula recebimento do laboratório)
  registrarResultado(exameId: string, resultado: ResultadoExame): Exame | null {
    const index = exames.findIndex(e => e.id === exameId);
    if (index === -1) return null;

    exames[index] = {
      ...exames[index],
      status: "concluido",
      dataResultado: new Date().toISOString().slice(0, 10),
      resultado
    };

    return exames[index];
  },

  // Cancelar exame
  cancelarExame(exameId: string, motivo: string): Exame | null {
    const index = exames.findIndex(e => e.id === exameId);
    if (index === -1) return null;

    exames[index] = {
      ...exames[index],
      status: "cancelado",
      observacoes: motivo
    };

    return exames[index];
  },

  // Buscar catálogo de exames
  getCatalogo(): CatalogoExame[] {
    return catalogoExames;
  },

  // Buscar catálogo por categoria
  getCatalogoPorCategoria(categoria: string): CatalogoExame[] {
    return catalogoExames.filter(c => c.categoria === categoria);
  },

  // Listar categorias disponíveis
  getCategorias(): string[] {
    return [...new Set(catalogoExames.map(c => c.categoria))];
  },

  // Estatísticas para dashboard
  getEstatisticas() {
    const total = exames.length;
    const solicitados = exames.filter(e => e.status === "solicitado").length;
    const coletados = exames.filter(e => e.status === "coletado").length;
    const emAnalise = exames.filter(e => e.status === "em_analise").length;
    const concluidos = exames.filter(e => e.status === "concluido").length;
    const urgentes = exames.filter(e => e.prioridade === "urgente" && e.status !== "concluido" && e.status !== "cancelado").length;

    return {
      total,
      solicitados,
      coletados,
      emAnalise,
      concluidos,
      urgentes,
      pendentes: solicitados + coletados + emAnalise
    };
  },

  // Simular recebimento de resultado (para demo)
  simularResultado(exameId: string): Exame | null {
    const exame = exames.find(e => e.id === exameId);
    if (!exame || exame.status === "concluido") return null;

    // Gera resultado mock baseado no tipo de exame
    const resultadoMock: ResultadoExame = exame.tipo === "imagem" 
      ? {
          valores: [],
          laudo: "Exame dentro dos padrões de normalidade. Sem alterações significativas identificadas.",
          responsavelTecnico: "Dr. Responsável Técnico - CRM 00000"
        }
      : {
          valores: [
            { parametro: exame.nome, valor: "Normal", unidade: "", referencia: "Normal", status: "normal" }
          ],
          responsavelTecnico: "Dra. Responsável Técnica - CRF 00000"
        };

    return this.registrarResultado(exameId, resultadoMock);
  }
};
