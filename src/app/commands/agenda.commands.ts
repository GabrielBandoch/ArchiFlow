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

export interface SalvarConfiguracaoAgendaCommand {
  emailAgendaEmpresa?: string;
  googleCalendarId?: string;
  chaveGoogleServiceAccountJson?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  tipoIntegracao?: "OAuth" | "ServiceAccount" | "Nenhum";
  nomeAgenda: string;
  sincronizacaoAutomaticaAtiva: boolean;
}

export interface ConectarGoogleOAuthCommand {
  code: string;
  redirectUri: string;
  state: string;
  clientId?: string;
  clientSecret?: string;
}
