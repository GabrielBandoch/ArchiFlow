export type StatusFinanceiroAssinatura = 'Adimplente' | 'EmDebito' | 'Suspenso' | 'Trial';

export interface TenantAssinatura {
  id: string;
  subdominio: string;
  nomeEscritorio: string;
  razaoSocial?: string;
  cnpjCpf?: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel?: string;
  plano: string;
  cicloFaturamento: string;
  valorMensalidade: number;
  statusFinanceiro: StatusFinanceiroAssinatura;
  dataVencimento: string;
  ultimoPagamento?: string;
  bloqueadoPorInadimplencia: boolean;
  motivoBloqueio?: string;
  notasInternas?: string;
  diasEmAtraso: number;
  linkAcesso: string;
  linkWhatsAppCobranca?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface SuperAdminDashboardKpis {
  totalEscritorios: number;
  totalAdimplentes: number;
  totalEmDebito: number;
  totalSuspensos: number;
  totalTrial: number;
  mrrTotal: number;
  totalEmAtrasoReais: number;
  taxaAdimplenciaPercentual: number;
}

export interface CriarTenantAssinaturaRequest {
  subdominio: string;
  nomeEscritorio: string;
  razaoSocial?: string;
  cnpjCpf?: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel?: string;
  plano: string;
  cicloFaturamento: string;
  valorMensalidade: number;
  statusFinanceiro: StatusFinanceiroAssinatura;
  dataVencimento?: string;
  notasInternas?: string;
}

export interface AtualizarStatusFinanceiroRequest {
  statusFinanceiro: StatusFinanceiroAssinatura;
  novaDataVencimento?: string;
  registrarPagamentoHoje?: boolean;
  notasInternas?: string;
}

export interface BloquearTenantRequest {
  bloquear: boolean;
  motivo?: string;
}

export interface AtualizarNotasRequest {
  notasInternas: string;
}
