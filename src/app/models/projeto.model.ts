export enum StatusProjeto {
  Briefing = 0,
  Desenvolvimento = 1,
  Revisao = 2,
  Aprovacao = 3,
  Execucao = 4,
  Concluido = 5,
  Cancelado = 6
}

export enum TipoProjeto {
  Residencial = 0,
  Comercial = 1,
  Corporativo = 2,
  Interiores = 3
}

export enum StatusEtapa {
  Pendente = 0,
  EmAndamento = 1,
  Concluida = 2
}

export interface TarefaEtapa {
  id: string;
  etapaId: string;
  titulo: string;
  concluida: boolean;
}

export interface EtapaProjeto {
  id: string;
  projetoId: string;
  nome: string;
  descricao: string;
  status: StatusEtapa;
  statusLabel: string;
  ordem: number;
  dataConclusao?: string;
  tarefas?: TarefaEtapa[];
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: StatusProjeto;
  statusLabel: string;
  tipo: TipoProjeto;
  tipoLabel: string;
  dataInicio: string;
  dataPrevistaEntrega?: string;
  metragemTotal: number;
  clienteId: string;
  clienteNome?: string;
  criadoEm: string;
  atualizadoEm?: string;
  etapas: EtapaProjeto[];
  progressoPercentual: number;
}
