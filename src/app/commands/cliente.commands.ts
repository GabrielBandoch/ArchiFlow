export interface ConvertLeadToClienteCommand {
  leadId: string;
  cpfCnpj?: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
}

export interface AtualizarClienteCommand {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpfCnpj?: string;
  endereco?: string;
  fotoUrl?: string;
}

export interface AtualizarPortalAccessCommand {
  id: string;
  ativo: boolean;
}

export interface ConvidarRepresentanteCommand {
  nome: string;
  email: string;
  cargo?: string | null;
  telefone?: string | null;
  enviarEmailConvite?: boolean;
}
