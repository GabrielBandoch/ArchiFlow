export interface TemplateTarefaItem {
  id?: string;
  titulo: string;
}

export interface TemplateEtapaItem {
  ordem: number;
  nome: string;
  descricao: string;
  tarefas: string[];
}

export interface ProjectTemplate {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  etapas: TemplateEtapaItem[];
}
