export * from "../../commands/agenda.commands";

export const TiposCompromisso = {
  ReuniaoCliente: "ReuniaoCliente",
  VisitaObra: "VisitaObra",
  MedicaoTecnica: "MedicaoTecnica",
  ApresentacaoProjeto: "ApresentacaoProjeto",
  EntregaEtapa: "EntregaEtapa",
  Geral: "Geral",
} as const;

export type TipoCompromisso =
  (typeof TiposCompromisso)[keyof typeof TiposCompromisso];

export const StatusCompromisso = {
  Agendado: "Agendado",
  Concluido: "Concluido",
  Cancelado: "Cancelado",
} as const;

export type StatusCompromissoType =
  (typeof StatusCompromisso)[keyof typeof StatusCompromisso];

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

export interface ConfiguracaoAgendaEmpresa {
  emailAgendaEmpresa?: string;
  googleCalendarId?: string;
  possuiChaveServiceAccount?: boolean;
  googleOAuthEmail?: string;
  possuiOAuthConectado?: boolean;
  googleClientId?: string;
  tipoIntegracao?: "OAuth" | "ServiceAccount" | "Nenhum";
  nomeAgenda: string;
  sincronizacaoAutomaticaAtiva: boolean;
  linkEmbedGoogleCalendar?: string;
}

export interface OAuthUrlResponse {
  url: string;
  state: string;
}
