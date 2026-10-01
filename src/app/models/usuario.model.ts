export type PerfilUsuario =
  | 'Administrador'
  | 'Arquiteto'
  | 'Gerente'
  | 'Colaborador'
  | 'Cliente'
  | 'ClienteFinal'
  | 'ArquitetoAdmin'
  | 'ArquitetoColaborador'
  | 'Estagiario'
  | 'Financeiro';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  token?: string;
  perfil: PerfilUsuario | string;
  projetoId?: string | null;
}

export interface MembroEquipe {
  id: string;
  escritorioId?: string | null;
  nome: string;
  email: string;
  role: PerfilUsuario | string;
  cargo?: string | null;
  telefone?: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string | null;
}

