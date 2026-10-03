import { CategoriaDespesa, FormaPagamento, StatusParcela } from '../models/financeiro.model';

export interface CriarContratoCommand {
  projetoId: string;
  valorTotal: number;
  numeroParcelas: number;
  dataPrimeiroVencimento: string;
  intervaloDias: number;
  condicoesPagamento?: string;
  observacoes?: string;
}

export interface CriarParcelaCommand {
  projetoId: string;
  contratoFinanceiroId?: string;
  numeroParcela: number;
  totalParcelas: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  observacoes?: string;
}

export interface AtualizarParcelaCommand {
  descricao: string;
  valor: number;
  dataVencimento: string;
  status: StatusParcela | string;
  dataPagamento?: string;
  formaPagamento?: FormaPagamento | string;
  observacoes?: string;
  comprovanteUrl?: string;
}

export interface DarBaixaParcelaCommand {
  dataPagamento: string;
  formaPagamento: FormaPagamento | string;
  observacoes?: string;
  comprovanteUrl?: string;
}

export interface CriarDespesaCommand {
  projetoId?: string;
  fornecedorId?: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
  categoria: CategoriaDespesa | string;
  observacoes?: string;
  comprovanteUrl?: string;
}

export interface AtualizarDespesaCommand {
  descricao: string;
  valor: number;
  dataDespesa: string;
  categoria: CategoriaDespesa | string;
  observacoes?: string;
  comprovanteUrl?: string;
}
