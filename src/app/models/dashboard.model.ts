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

export const WIDGETS_DEFAULT: DashboardWidgetConfig[] = [
  { id: 'kpi_resumo', titulo: 'Indicadores Chave (KPIs)', icone: 'insights', visivel: true, ordem: 1, largura: 'full' },
  { id: 'atalhos_rapidos', titulo: 'Ações Rápidas', icone: 'bolt', visivel: true, ordem: 2, largura: 'full' },
  { id: 'grafico_projetos_status', titulo: 'Projetos por Fase', icone: 'pie_chart', visivel: true, ordem: 3, largura: 'half' },
  { id: 'grafico_projetos_tipo', titulo: 'Tipologias de Projetos', icone: 'bar_chart', visivel: true, ordem: 4, largura: 'half' },
  { id: 'grafico_funil_leads', titulo: 'Funil Comercial de Leads', icone: 'filter_alt', visivel: true, ordem: 5, largura: 'half' },
  { id: 'grafico_origens_lead', titulo: 'Origem dos Contatos', icone: 'hub', visivel: true, ordem: 6, largura: 'half' },
  { id: 'grafico_propostas_mensal', titulo: 'Evolução de Propostas (6 meses)', icone: 'query_stats', visivel: true, ordem: 7, largura: 'full' },
  { id: 'tabela_projetos_recentes', titulo: 'Projetos Recentes', icone: 'folder_open', visivel: true, ordem: 8, largura: 'full' },
  { id: 'lista_leads_recentes', titulo: 'Leads Recentes', icone: 'person_search', visivel: true, ordem: 9, largura: 'half' },
  { id: 'lista_propostas_recentes', titulo: 'Propostas de Honorários Recentes', icone: 'request_quote', visivel: true, ordem: 10, largura: 'half' }
];
