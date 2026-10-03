export const TiposCompromisso = {
  ReuniaoCliente: 'ReuniaoCliente',
  VisitaObra: 'VisitaObra',
  MedicaoTecnica: 'MedicaoTecnica',
  ApresentacaoProjeto: 'ApresentacaoProjeto',
  EntregaEtapa: 'EntregaEtapa',
  Geral: 'Geral'
} as const;

export type TipoCompromisso = (typeof TiposCompromisso)[keyof typeof TiposCompromisso];

export const StatusCompromisso = {
  Agendado: 'Agendado',
  Concluido: 'Concluido',
  Cancelado: 'Cancelado'
} as const;

export type StatusCompromissoType = (typeof StatusCompromisso)[keyof typeof StatusCompromisso];

export interface Compromisso {
  id: string;
  escritorioId: string;
  usuarioId?: string;
  nomeUsuario?: string;
  projetoId?: string;
  nomeProjeto?: string;
  clienteId?: string;
  nomeCliente?: string;
  leadId?: string;
  nomeLead?: string;
  titulo: string;
  descricao?: string;
  tipo: TipoCompromisso;
  status: StatusCompromissoType;
  dataHoraInicio: string;
  dataHoraFim: string;
  local?: string;
  linkGoogleMeet?: string;
  googleEventId?: string;
  linkGoogleCalendarWeb: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface CriarCompromissoCommand {
  titulo: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  tipo?: string;
  descricao?: string;
  local?: string;
  projetoId?: string;
  clienteId?: string;
  leadId?: string;
  usuarioId?: string;
  gerarGoogleMeet?: boolean;
}

export interface AtualizarCompromissoCommand {
  titulo: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  tipo?: string;
  status?: string;
  descricao?: string;
  local?: string;
  linkGoogleMeet?: string;
  projetoId?: string;
  clienteId?: string;
  leadId?: string;
  usuarioId?: string;
}

export interface AlterarStatusCompromissoCommand {
  status: string;
}

export interface ConfiguracaoAgendaEmpresa {
  emailAgendaEmpresa?: string;
  googleCalendarId?: string;
  chaveGoogleServiceAccountJson?: string;
  possuiChaveServiceAccount?: boolean;
  googleOAuthEmail?: string;
  possuiOAuthConectado?: boolean;
  googleClientId?: string;
  tipoIntegracao?: string; // 'OAuth' | 'ServiceAccount' | 'Nenhum'
  nomeAgenda: string;
  sincronizacaoAutomaticaAtiva: boolean;
  linkEmbedGoogleCalendar?: string;
}

export interface SalvarConfiguracaoAgendaCommand {
  emailAgendaEmpresa?: string;
  googleCalendarId?: string;
  chaveGoogleServiceAccountJson?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  tipoIntegracao?: string;
  nomeAgenda: string;
  sincronizacaoAutomaticaAtiva: boolean;
}
