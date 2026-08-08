export type PerfilUsuario = 'Administrador' | 'Arquiteto' | 'ClienteFinal';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  token?: string;
  perfil: PerfilUsuario;
  projetoId?: string | null;
}
