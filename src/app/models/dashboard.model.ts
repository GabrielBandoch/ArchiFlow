export interface DashboardKpis {
  totalProjetosAtivos: number;
  totalProjetosConcluidos: number;
  totalLeadsAtivos: number;
  totalLeadsConvertidos: number;
  taxaConversaoLeads: number;
  totalClientes: number;
  totalPropostas: number;
  valorTotalPropostas: number;
  valorMedioProposta: number;
}

export interface ProjetosPorStatus {
  status: string;
  nomeStatus: string;
  quantidade: number;
  percentual: number;
}

export interface ProjetosPorTipo {
  tipo: string;
  nomeTipo: string;
  quantidade: number;
  percentual: number;
}

export interface LeadsPorStatus {
  status: string;
  nomeStatus: string;
  quantidade: number;
  percentual: number;
}

export interface LeadsPorOrigem {
  origem: string;
  quantidade: number;
  percentual: number;
}

export interface PropostasMensal {
  mesAno: string;
  rotuloMes: string;
  quantidade: number;
  valorTotal: number;
}

export interface ProjetoResumoDashboard {
  id: string;
  nome: string;
  clienteNome?: string;
  status: string;
  tipo: string;
  metragemTotal?: number;
  totalEtapas: number;
  etapasConcluidas: number;
  progressoPercentual: number;
  dataInicio?: string;
  dataPrevistaEntrega?: string;
}

export interface LeadResumoDashboard {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  status: string;
  origemNome?: string;
  criadoEm: string;
}

export interface PropostaResumoDashboard {
  id: string;
  titulo: string;
  codigo: string;
  clienteOuLeadNome?: string;
  metragemQuadrada: number;
  valorFinal: number;
  status: string;
  criadoEm: string;
}

export interface DashboardMetricas {
  kpis: DashboardKpis;
  projetosPorStatus: ProjetosPorStatus[];
  projetosPorTipo: ProjetosPorTipo[];
  leadsPorStatus: LeadsPorStatus[];
  leadsPorOrigem: LeadsPorOrigem[];
  propostasMensais: PropostasMensal[];
  projetosRecentes: ProjetoResumoDashboard[];
  leadsRecentes: LeadResumoDashboard[];
  propostasRecentes: PropostaResumoDashboard[];
}

export interface PreferenciaDashboard {
  usuarioId: string;
  layoutJson: string;
  atualizadoEm: string;
}

export interface DashboardWidgetConfig {
  id: string;
  titulo: string;
  icone: string;
  visivel: boolean;
  ordem: number;
  largura: 'full' | 'half';
}
