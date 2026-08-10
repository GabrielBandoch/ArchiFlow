export enum StatusProjeto {
  Planejamento = 0,
  EmDesenvolvimento = 1,
  EmRevisao = 2,
  Aprovado = 3,
  Suspenso = 4,
  Cancelado = 5
}

export enum TipoProjeto {
  Residencial = 0,
  Comercial = 1,
  Corporativo = 2,
  Interiores = 3,
  Outros = 4
}

export enum StatusEtapa {
  NaoIniciada = 0,
  EmAndamento = 1,
  PendenteRevisao = 2,
  Concluida = 3,
  Impedimento = 4
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
  criadoEm: string;
  atualizadoEm?: string;
  etapas: EtapaProjeto[];
  progressoPercentual: number;
}
