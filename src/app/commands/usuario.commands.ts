export interface ConvidarMembroEquipeCommand {
  nome: string;
  email: string;
  role: string;
  cargo?: string | null;
  telefone?: string | null;
  senhaTemporaria?: string | null;
  modulosPermitidos?: string[];
}

export interface AtualizarMembroEquipeCommand {
  nome: string;
  email?: string | null;
  role: string;
  cargo?: string | null;
  telefone?: string | null;
  modulosPermitidos?: string[];
}

export interface AlterarStatusMembroCommand {
  ativo: boolean;
}

export interface RedefinirSenhaMembroCommand {
  novaSenha?: string | null;
}

export interface AtualizarPerfilCommand {
  nome: string;
  telefone?: string | null;
  cargo?: string | null;
}

export interface AlterarSenhaCommand {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}

export interface PerfilUsuarioDto {
  id: string;
  nome: string;
  email: string;
  role: string;
  cargo?: string | null;
  telefone?: string | null;
  fotoUrl?: string | null;
  modulosPermitidos: string[];
}
