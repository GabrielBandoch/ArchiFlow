export interface Cliente {
  id: string;
  leadId?: string;
  nome: string;
  email: string;
  telefone?: string;
  cpfCnpj?: string;
  endereco?: string;
  ativo: boolean;
  projetosAtivosCount: number;
  fotoUrl?: string;
}

export interface ConversaoClienteResponse {
  cliente: Cliente;
  senhaTemporaria: string;
}

export interface RepresentanteCliente {
  id: string;
  clienteId: string;
  nome: string;
  email: string;
  cargo?: string | null;
  telefone?: string | null;
  ativo: boolean;
  conviteAceito: boolean;
  statusConvite?: string;
  conviteEnviadoEm?: string | null;
  ultimoAcessoEm?: string | null;
  criadoEm: string;
}
