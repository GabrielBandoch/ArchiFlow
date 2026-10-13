export interface ConvidarMembroEquipeCommand {
  nome: string;
  email: string;
  role: string;
  cargo?: string | null;
  telefone?: string | null;
  senhaTemporaria?: string | null;
}

export interface AtualizarMembroEquipeCommand {
  nome: string;
  email?: string | null;
  role: string;
  cargo?: string | null;
  telefone?: string | null;
}

export interface AlterarStatusMembroCommand {
  ativo: boolean;
}

export interface RedefinirSenhaMembroCommand {
  novaSenha?: string | null;
}

export interface AlterarMinhaSenhaCommand {
  senhaAtual: string;
  novaSenha: string;
}

export interface AtualizarMeuPerfilCommand {
  nome: string;
  telefone?: string | null;
  cargo?: string | null;
}
