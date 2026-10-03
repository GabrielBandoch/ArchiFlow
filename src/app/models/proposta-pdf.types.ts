export interface PropostaVisualizacaoData {
  id?: string;
  codigo: string;
  titulo: string;
  clienteNome?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  leadNome?: string;
  metragemQuadrada: number;
  padraoImovelNome?: string;
  tipoProjetoNome?: string;
  valorTotalSugerido?: number;
  valorFinalAjustado: number;
  criadoEm?: string | Date;
  statusNome?: string;
  etapas: Array<{
    nome: string;
    percentual?: number;
    valor?: number;
    prazo?: string;
    incluso?: boolean;
    descricao?: string;
  }>;
  memoriaCalculo?: {
    horasEstimadasTotal?: number;
    valorHoraBase?: number;
    valorM2Base?: number;
    valorBase?: number;
    fatorPadrao?: number;
    fatorTipologia?: number;
  };
}
