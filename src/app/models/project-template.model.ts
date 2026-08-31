export interface TemplateTarefaItem {
  id?: string;
  titulo: string;
}

export interface TemplateEtapaItem {
  id?: string;
  ordem: number;
  nome: string;
  descricao: string;
  tarefas: string[];
}

export interface ProjectTemplate {
  id: string;
  codigo?: string;
  nome: string;
  descricao: string;
  icone: string;
  ativo?: boolean;
  etapas: TemplateEtapaItem[];
}
