export type PerfilUsuario = 'Administrador' | 'Arquiteto' | 'Gerente' | 'Colaborador' | 'Cliente' | 'ClienteFinal';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  token?: string;
  perfil: PerfilUsuario | string;
  projetoId?: string | null;
}
