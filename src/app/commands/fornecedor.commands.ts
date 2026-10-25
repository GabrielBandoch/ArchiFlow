export interface CriarFornecedorCommand {
  nome: string;
  especialidade: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  descricao?: string;
}

export interface AtualizarFornecedorCommand extends CriarFornecedorCommand {
  id: string;
  ativo: boolean;
}

export interface AdicionarAvaliacaoCommand {
  fornecedorId: string;
  projetoId?: string;
  nota: number;
  comentario: string;
  autorNome?: string;
}

export interface VincularProjetoCommand {
  fornecedorId: string;
  projetoId: string;
  funcaoNoProjeto?: string;
}
