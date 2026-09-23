export type TipoProjeto = 'Residencial' | 'Comercial' | 'Corporativo' | 'Interiores' | number;
export type PadraoImovel = 'Economico' | 'Medio' | 'AltoPadrao' | 'Luxo' | number;
export type StatusProposta = 'Rascunho' | 'Enviada' | 'Aprovada' | 'Recusada' | number;

export interface ItemEtapaSimulacao {
  nome: string;
  descricao?: string;
  incluso: boolean;
  percentual: number;
  valor: number;
  horasEstimadas: number;
  ordem: number;
}

export interface MemoriaCalculo {
  metragemQuadrada: number;
  valorMetroQuadradoBase: number;
  valorBase: number;
  fatorPadraoDescricao: string;
  fatorPadraoMultiplicador: number;
  valorFatorPadrao: number;
  fatorTipologiaDescricao: string;
  fatorTipologiaMultiplicador: number;
  valorFatorTipologia: number;
  percentualEscopoIncluso: number;
  valorEscopo: number;
  horasEstimadasTotal: number;
  valorHoraEstimado: number;
  custosDiretos?: number;
  custoFixoRateado?: number;
  custoOperacionalTotal?: number;
  percentualImposto?: number;
  valorImposto?: number;
}

export interface SimulacaoParametros {
  metragemQuadrada: number;
  tipoProjeto: number;
  padraoImovel: number;
  etapasInclusas?: string[];
  valorHoraBase?: number;
  valorMetroQuadradoBase?: number;
}

export interface SimulacaoResultado {
  metragemQuadrada: number;
  tipoProjeto: number;
  tipoProjetoNome: string;
  padraoImovel: number;
  padraoImovelNome: string;
  valorTotalSugerido: number;
  valorMetroQuadrado: number;
  horasEstimadasTotal: number;
  etapas: ItemEtapaSimulacao[];
  memoriaCalculo: MemoriaCalculo;
}

export interface ItemPropostaEtapa {
  id: string;
  propostaId: string;
  nomeEtapa: string;
  descricao?: string;
  incluso: boolean;
  percentual: number;
  valor: number;
  horasEstimadas: number;
  ordem: number;
}

export interface PropostaHonorario {
  id: string;
  titulo: string;
  codigo: string;
  clienteId?: string;
  clienteNome?: string;
  leadId?: string;
  leadNome?: string;
  tipoProjeto: number;
  tipoProjetoNome: string;
  padraoImovel: number;
  padraoImovelNome: string;
  metragemQuadrada: number;
  valorHoraBase: number;
  valorMetroQuadradoBase: number;
  horasEstimadasTotal: number;
  valorBase: number;
  valorFatorPadrao: number;
  valorFatorTipologia: number;
  valorEscopo: number;
  valorTotalSugerido: number;
  valorFinalAjustado: number;
  status: number;
  statusNome: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm?: string;
  itensEtapa: ItemPropostaEtapa[];
}

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
