export enum StatusParcela {
  Pendente = 'Pendente',
  Pago = 'Pago',
  Atrasado = 'Atrasado',
  Cancelado = 'Cancelado'
}

export enum FormaPagamento {
  Pix = 'Pix',
  Transferencia = 'Transferencia',
  Boleto = 'Boleto',
  CartaoCredito = 'CartaoCredito',
  CartaoDebito = 'CartaoDebito',
  Dinheiro = 'Dinheiro',
  Outro = 'Outro'
}

export enum CategoriaDespesa {
  PlotagemImpressao = 'PlotagemImpressao',
  DeslocamentoVisita = 'DeslocamentoVisita',
  SoftwareLicencas = 'SoftwareLicencas',
  Subcontratacao = 'Subcontratacao',
  TaxasPrefeitura = 'TaxasPrefeitura',
  Maquetes3D = 'Maquetes3D',
  Outros = 'Outros'
}

export interface ParcelaFinanceira {
  id: string;
  projetoId: string;
  projetoNome: string;
  clienteId?: string;
  clienteNome?: string;
  contratoFinanceiroId?: string;
  numeroParcela: number;
  totalParcelas: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusParcela | string;
  statusNome: string;
  formaPagamento?: FormaPagamento | string;
  formaPagamentoNome?: string;
  observacoes?: string;
  comprovanteUrl?: string;
  criadoEm: string;
}

export interface ContratoFinanceiro {
  id: string;
  projetoId: string;
  projetoNome: string;
  valorTotal: number;
  condicoesPagamento?: string;
  observacoes?: string;
  criadoEm: string;
  parcelas: ParcelaFinanceira[];
}

export interface DespesaProjeto {
  id: string;
  projetoId: string;
  projetoNome: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
  categoria: CategoriaDespesa | string;
  categoriaNome: string;
  observacoes?: string;
  comprovanteUrl?: string;
  criadoEm: string;
}

export interface ReceitaMes {
  mes: string;
  mesNumero: number;
  ano: number;
  valorRecebido: number;
  valorPrevisto: number;
  valorDespesas: number;
}

export interface AlertaFinanceiro {
  parcelaId: string;
  projetoId: string;
  titulo: string;
  subtitulo: string;
  valor: number;
  dataVencimento: string;
  status: StatusParcela | string;
  diasDiferenca: number;
  emAtraso: boolean;
}

export interface PainelFinanceiro {
  totalPrevisto: number;
  totalRecebido: number;
  totalPendente: number;
  totalAtrasado: number;
  totalDespesas: number;
  saldoLiquido: number;
  variacaoPercentualMesAnterior: number;
  receitasPorMes: ReceitaMes[];
  alertas: AlertaFinanceiro[];
  parcelasRecentes: ParcelaFinanceira[];
}
