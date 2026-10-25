export interface CriarPropostaCommand {
  titulo: string;
  clienteId?: string;
  clienteNome?: string;
  leadId?: string;
  leadNome?: string;
  tipoProjeto: number;
  padraoImovel: number;
  metragemQuadrada: number;
  valorHoraBase?: number;
  valorMetroQuadradoBase?: number;
  valorFinalAjustado?: number;
  etapasInclusas?: string[];
  observacoes?: string;
}

export interface AtualizarStatusPropostaCommand {
  status: number;
}

export interface AjustarValorPropostaCommand {
  valorFinalAjustado: number;
  observacoes?: string;
}
