export interface LoginCommand {
  email: string;
  senha: string;
}

export interface SolicitarRecuperacaoCommand {
  email: string;
}

export interface ValidarTokenRecuperacaoCommand {
  token: string;
}

export interface RedefinirSenhaCommand {
  token: string;
  novaSenha: string;
}

export interface ResultadoValidacaoTokenDto {
  valido: boolean;
  email?: string;
  mensagem?: string;
}

export interface AtivarContaCommand {
  token: string;
  senha: string;
  nome?: string;
  telefone?: string;
}

export interface ResultadoValidacaoConviteDto {
  valido: boolean;
  nome?: string;
  email?: string;
  mensagem?: string;
}
