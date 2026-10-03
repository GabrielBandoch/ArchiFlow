export interface Fornecedor {
  id: string;
  nome: string;
  especialidade: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  descricao?: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  ativo: boolean;
  dataCriacao: string;
  totalProjetosAtivos: number;
  avaliacoes?: AvaliacaoFornecedor[];
  projetosVinculados?: ProjetoFornecedor[];
}

export interface AvaliacaoFornecedor {
  id: string;
  fornecedorId: string;
  projetoId?: string;
  nota: number;
  comentario: string;
  autorNome: string;
  dataAvaliacao: string;
}

export interface ProjetoFornecedor {
  id: string;
  projetoId: string;
  projetoNome?: string;
  fornecedorId: string;
  fornecedorNome?: string;
  funcaoNoProjeto: string;
  dataVinculo: string;
}

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
