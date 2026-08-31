import { StatusProjeto, TipoProjeto, StatusEtapa } from '../models/projeto.model';

export interface CriarProjetoCommand {
  nome: string;
  descricao: string;
  tipo: TipoProjeto;
  dataInicio: string;
  dataPrevistaEntrega?: string;
  metragemTotal: number;
  clienteId: string;
}

export interface AtualizarProjetoCommand {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoProjeto;
  status: StatusProjeto;
  dataInicio: string;
  dataPrevistaEntrega?: string;
  metragemTotal: number;
}

export interface AtualizarStatusProjetoCommand {
  id: string;
  status: StatusProjeto;
}

export interface CriarEtapaCommand {
  projetoId: string;
  nome: string;
  descricao: string;
  ordem: number;
}

export interface AtualizarStatusEtapaCommand {
  etapaId: string;
  status: StatusEtapa;
}
