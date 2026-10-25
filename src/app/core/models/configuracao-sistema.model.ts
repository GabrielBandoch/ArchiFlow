export interface OpcaoConfiguracao {
  id: string;
  categoria: string;
  chave: string;
  rotulo: string;
  subRotulo?: string;
  icone?: string;
  cor?: string;
  corFundo?: string;
  ordem: number;
  ativo: boolean;
  dadosExtrasJson?: string;
}
