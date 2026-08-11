export enum StatusLead {
  Novo = 'Novo',
  EmContato = 'EmContato',
  PropostaEnviada = 'PropostaEnviada',
  Negociando = 'Negociando',
  Convertido = 'Convertido',
  Perdido = 'Perdido'
}

export interface HistoricoContatoLead {
  id: string;
  leadId: string;
  dataContato: string;
  canal: string;
  resumo: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  origemId?: string;
  origem?: string;
  motivoPerda?: string;
  status: StatusLead;
  statusLabel: string;
  criadoEm: string;
  atualizadoEm?: string;
  historicoContatos: HistoricoContatoLead[];
}

export interface KanbanColumn {
  status: StatusLead;
  title: string;
  class: string;
  leads: Lead[];
}
