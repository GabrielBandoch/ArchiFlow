export interface Arquivo {
  id: string;
  projetoId: string;
  nome: string;
  urlStorage: string;
  tipo?: string;
  visivelCliente: boolean;
  criadoEm: string;
}
