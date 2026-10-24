export interface DadosEmpresa {
  id?: string;
  escritorioId?: string | null;
  nomeEmpresa: string;
  razaoSocial?: string | null;
  cnpj?: string | null;
  registroProfissional?: string | null;
  slogan?: string | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  corPrimaria?: string;
  atualizadoEm?: string;
}

export interface SalvarDadosEmpresaCommand {
  nomeEmpresa: string;
  razaoSocial?: string | null;
  cnpj?: string | null;
  registroProfissional?: string | null;
  slogan?: string | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  corPrimaria?: string | null;
}
