/**
 * Serviço centralizado para integração com WhatsApp Business API
 * 
 * Este módulo centraliza toda a lógica de comunicação com a API do WhatsApp,
 * facilitando manutenção futura caso a API do fornecedor mude.
 * 
 * IMPORTANTE: Dados clínicos sensíveis (diagnósticos, exames) NÃO devem ser 
 * enviados pelo WhatsApp. Use apenas para notificações e suporte logístico.
 */

import type { WhatsAppMessage, WhatsAppTemplate, WhatsAppContact } from "./whatsapp-data";
import { mockMensagens, mockTemplates, chatbotConfig } from "./whatsapp-data";

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Verifica se está dentro do horário de expediente
export function isDentroExpediente(): boolean {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const dia = agora.getDay(); // 0 = domingo, 6 = sábado

  // Fora do expediente nos finais de semana
  if (dia === 0 || dia === 6) return false;

  const horaAtual = hora * 60 + minuto;
  const [inicioH, inicioM] = chatbotConfig.horarioInicio.split(":").map(Number);
  const [fimH, fimM] = chatbotConfig.horarioFim.split(":").map(Number);

  const inicio = inicioH * 60 + inicioM;
  const fim = fimH * 60 + fimM;

  return horaAtual >= inicio && horaAtual <= fim;
}

// Formata timestamp para exibição
export function formatTimestamp(timestamp: string): string {
  const data = new Date(timestamp);
  const agora = new Date();
  const diff = agora.getTime() - data.getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dias === 0) {
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } else if (dias === 1) {
    return "Ontem";
  } else if (dias < 7) {
    return data.toLocaleDateString("pt-BR", { weekday: "short" });
  } else {
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }
}

// Aplica variáveis em um template
export function aplicarTemplate(template: WhatsAppTemplate, variaveis: Record<string, string>): string {
  let conteudo = template.conteudo;
  for (const [chave, valor] of Object.entries(variaveis)) {
    conteudo = conteudo.replace(new RegExp(`{{${chave}}}`, "g"), valor);
  }
  return conteudo;
}

// Serviço WhatsApp (simulado)
export const whatsappService = {
  /**
   * Envia uma mensagem de texto simples
   */
  async enviarMensagem(
    contatoId: string,
    conteudo: string
  ): Promise<WhatsAppMessage> {
    await delay(300);

    const novaMensagem: WhatsAppMessage = {
      id: `m${Date.now()}`,
      contatoId,
      conteudo,
      timestamp: new Date().toISOString(),
      tipo: "enviada",
      status: "enviando",
    };

    // Simula mudança de status
    setTimeout(() => {
      novaMensagem.status = "enviada";
    }, 500);

    setTimeout(() => {
      novaMensagem.status = "entregue";
    }, 1500);

    return novaMensagem;
  },

  /**
   * Envia uma mensagem usando template aprovado
   */
  async enviarTemplate(
    contatoId: string,
    templateId: string,
    variaveis: Record<string, string>
  ): Promise<WhatsAppMessage> {
    await delay(400);

    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error("Template não encontrado");
    }

    if (!template.aprovado) {
      throw new Error("Template não aprovado pela Meta");
    }

    const conteudo = aplicarTemplate(template, variaveis);

    const novaMensagem: WhatsAppMessage = {
      id: `m${Date.now()}`,
      contatoId,
      conteudo,
      timestamp: new Date().toISOString(),
      tipo: "enviada",
      status: "enviada",
      templateId,
    };

    return novaMensagem;
  },

  /**
   * Envia lembrete de consulta em massa
   */
  async enviarLembretesConsultas(
    consultas: Array<{ contatoId: string; paciente: string; medico: string; data: string; hora: string }>
  ): Promise<{ enviados: number; falhas: number }> {
    await delay(1000);

    let enviados = 0;
    let falhas = 0;

    for (const consulta of consultas) {
      try {
        await this.enviarTemplate(consulta.contatoId, "t1", {
          nome: consulta.paciente,
          medico: consulta.medico,
          data: consulta.data,
          hora: consulta.hora,
        });
        enviados++;
      } catch {
        falhas++;
      }
    }

    return { enviados, falhas };
  },

  /**
   * Envia aviso de atraso (apenas médicos)
   */
  async enviarAvisoAtraso(
    contatoId: string,
    paciente: string,
    medico: string,
    tempoMinutos: number
  ): Promise<WhatsAppMessage> {
    return this.enviarTemplate(contatoId, "t4", {
      nome: paciente,
      medico,
      tempo: String(tempoMinutos),
    });
  },

  /**
   * Envia mensagem pós-consulta (apenas médicos)
   */
  async enviarPosConsulta(
    contatoId: string,
    paciente: string
  ): Promise<WhatsAppMessage> {
    return this.enviarTemplate(contatoId, "t3", {
      nome: paciente,
      link_avaliacao: "https://saudeclin.com/avaliacao",
    });
  },

  /**
   * Busca mensagens de um contato
   */
  async buscarMensagens(contatoId: string): Promise<WhatsAppMessage[]> {
    await delay(200);
    return mockMensagens.filter(m => m.contatoId === contatoId);
  },

  /**
   * Busca todos os templates
   */
  async buscarTemplates(): Promise<WhatsAppTemplate[]> {
    await delay(200);
    return mockTemplates;
  },

  /**
   * Resposta automática do chatbot fora de expediente
   */
  async respostaAutomatica(contatoId: string): Promise<WhatsAppMessage | null> {
    if (isDentroExpediente() || !chatbotConfig.ativo) {
      return null;
    }

    return this.enviarTemplate(contatoId, chatbotConfig.templateForaExpediente, {});
  },

  /**
   * Marca mensagens como lidas
   */
  async marcarComoLida(mensagemIds: string[]): Promise<void> {
    await delay(100);
    // Em produção, isso chamaria a API do WhatsApp
  },
};

// Helpers para sanitização (LGPD)
export const lgpdHelpers = {
  /**
   * Remove dados sensíveis de uma mensagem antes de enviar
   */
  sanitizarMensagem(texto: string): string {
    // Remove possíveis CPFs
    let sanitizado = texto.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, "[CPF REMOVIDO]");
    
    // Remove possíveis números de cartão
    sanitizado = sanitizado.replace(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, "[DADOS REMOVIDOS]");
    
    return sanitizado;
  },

  /**
   * Verifica se mensagem contém termos médicos sensíveis
   */
  contemDadosSensiveis(texto: string): boolean {
    const termosSensiveis = [
      "diagnóstico", "diagnostico", "exame", "resultado",
      "hiv", "câncer", "cancer", "positivo", "negativo",
      "gravidez", "gestação", "gestacao", "dsst",
    ];

    const textoLower = texto.toLowerCase();
    return termosSensiveis.some(termo => textoLower.includes(termo));
  },

  /**
   * Aviso sobre dados sensíveis
   */
  avisoLGPD: "ATENÇÃO: Não envie dados clínicos sensíveis (diagnósticos, resultados de exames) por WhatsApp. Use este canal apenas para notificações e suporte logístico.",
};
