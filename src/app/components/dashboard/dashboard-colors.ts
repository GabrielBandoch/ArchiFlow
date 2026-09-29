export const DASHBOARD_COLORS = {
  fasesProjeto: {
    Briefing: '#3B82F6',
    Desenvolvimento: '#F59E0B',
    Revisao: '#8B5CF6',
    Aprovacao: '#10B981',
    Execucao: '#06B6D4',
    Concluido: '#22C55E',
    Cancelado: '#EF4444'
  } as Record<string, string>,
  tiposProjeto: {
    Residencial: '#765538',
    Comercial: '#1E40AF',
    Corporativo: '#4F46E5',
    Interiores: '#D97706'
  } as Record<string, string>,
  funilLeads: {
    Novo: '#3B82F6',
    EmContato: '#0EA5E9',
    PropostaEnviada: '#F59E0B',
    Negociando: '#D97706',
    Convertido: '#10B981',
    Perdido: '#94A3B8'
  } as Record<string, string>,
  origens: [
    '#765538', '#1E40AF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'
  ],
  defaultColor: '#94A3B8'
};
