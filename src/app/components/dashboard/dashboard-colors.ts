export const DASHBOARD_COLORS = {
  fasesProjeto: {
    Briefing: '#916d4e',
    Desenvolvimento: '#765538',
    Revisao: '#b45309',
    Aprovacao: '#2e7d32',
    Execucao: '#685c51',
    Concluido: '#1b5e20',
    Cancelado: '#ba1a1a'
  } as Record<string, string>,
  tiposProjeto: {
    Residencial: '#765538',
    Comercial: '#916d4e',
    Corporativo: '#685c51',
    Interiores: '#b45309'
  } as Record<string, string>,
  funilLeads: {
    Novo: '#685c51',
    EmContato: '#916d4e',
    PropostaEnviada: '#b45309',
    Negociando: '#765538',
    Convertido: '#2e7d32',
    Perdido: '#81756b'
  } as Record<string, string>,
  origens: [
    '#765538', '#916d4e', '#685c51', '#b45309', '#2e7d32', '#81756b', '#d3c4b9'
  ],
  defaultColor: '#81756b'
};
