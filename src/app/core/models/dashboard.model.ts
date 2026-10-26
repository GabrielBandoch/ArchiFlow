export interface DashboardKpis {
  totalProjetosAtivos: number;
  totalProjetosConcluidos: number;
  totalLeadsAtivos: number;
  totalLeadsConvertidos: number;
  taxaConversaoLeads: number;
  totalClientes: number;
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

export interface DashboardMetricas {
  kpis: DashboardKpis;
  projetosPorStatus: ProjetosPorStatus[];
  projetosPorTipo: ProjetosPorTipo[];
  leadsPorStatus: LeadsPorStatus[];
  leadsPorOrigem: LeadsPorOrigem[];
  projetosRecentes: ProjetoResumoDashboard[];
  leadsRecentes: LeadResumoDashboard[];
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
  largura: "full" | "half";
}

export const WIDGETS_DEFAULT: DashboardWidgetConfig[] = [
  {
    id: "pendencias_hoje",
    titulo: "O Que Fazer Hoje (Pendências & Agenda)",
    icone: "today",
    visivel: true,
    ordem: 1,
    largura: "full",
  },
  {
    id: "financeiro_semana",
    titulo: "Financeiro da Semana (A Pagar & Recebíveis)",
    icone: "account_balance_wallet",
    visivel: true,
    ordem: 2,
    largura: "full",
  },
  {
    id: "projetos_por_fase",
    titulo: "Projetos por Fase",
    icone: "assignment",
    visivel: true,
    ordem: 3,
    largura: "half",
  },
  {
    id: "crm_leads",
    titulo: "CRM & Contatos Recentes",
    icone: "contacts",
    visivel: true,
    ordem: 4,
    largura: "half",
  },
];
