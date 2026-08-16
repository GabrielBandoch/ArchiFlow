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
