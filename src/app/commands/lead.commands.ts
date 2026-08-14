import { StatusLead } from '../models/lead.model';

export interface CriarLeadCommand {
  nome: string;
  email: string;
  telefone?: string;
  origemId?: string;
}

export interface AtualizarLeadCommand {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  origemId?: string;
}

export interface AtualizarStatusLeadCommand {
  id: string;
  status: StatusLead;
  motivoPerda?: string;
}

export interface RegistrarContatoLeadCommand {
  leadId: string;
  canal: string;
  resumo: string;
}
