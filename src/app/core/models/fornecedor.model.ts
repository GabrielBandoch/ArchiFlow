export * from "../../commands/fornecedor.commands";

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
