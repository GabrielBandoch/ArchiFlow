import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProjectTemplate } from '../../models/project-template.model';
import { TarefaEtapa } from '../../models/projeto.model';
import { UrlBuilder } from '../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class ProjectTemplateService {
  private http = inject(HttpClient);

  private readonly defaultTemplates: ProjectTemplate[] = [
    {
      id: 'residencial-completo',
      nome: 'Projeto Arquitetônico Residencial',
      descricao: 'Fluxo completo para casas e edifícios: do levantamento ao caderno executivo final.',
      icone: 'home',
      etapas: [
        {
          ordem: 1,
          nome: 'Briefing e Estudo Preliminar',
          descricao: 'Levantamento de necessidades, programa de necessidades e zoneamento espacial.',
          tarefas: [
            'Entrevista de briefing com o cliente e alinhamento de expectativas',
            'Levantamento métrico e fotográfico no terreno/local',
            'Estudo de insolação, ventilação e plano diretor municipal',
            'Esboço preliminar de zoneamento e volumetria'
          ]
        },
        {
          ordem: 2,
          nome: 'Anteprojeto e Modelagem 3D',
          descricao: 'Definição arquitetônica, plantas baixas cotadas e maquete eletrônica.',
          tarefas: [
            'Plantas baixas cotadas com layout humanizado',
            'Cortes esquemáticos longitudinais e transversais',
            'Fachadas e volumetria externa',
            'Modelagem 3D e renderizações fotorealistas'
          ]
        },
        {
          ordem: 3,
          nome: 'Projeto Executivo e Detalhamento',
          descricao: 'Detalhamento construtivo para obra, ampliações e paginações técnicas.',
          tarefas: [
            'Plantas executivas de alvenaria e cotas de obra',
            'Paginação de pisos, revestimentos e forro de gesso',
            'Projeto luminotécnico e pontos elétricos/hidráulicos',
            'Detalhamento de esquadrias, guarda-corpos e bancadas',
            'Memorial descritivo de materiais e acabamentos'
          ]
        },
        {
          ordem: 4,
          nome: 'Compatibilização e Entrega Técnica',
          descricao: 'Compatibilização com projetos complementares e caderno de pranchas final.',
          tarefas: [
            'Compatibilização com projetos estrutural e hidrossanitário',
            'Reunião de entrega técnica e validação final',
            'Emissão do caderno final de pranchas em PDF para o cliente'
          ]
        }
      ]
    },
    {
      id: 'interiores-reforma',
      nome: 'Design de Interiores & Reforma',
      descricao: 'Foco em estética, marcenaria sob medida, iluminação e produção de ambientes.',
      icone: 'chair',
      etapas: [
        {
          ordem: 1,
          nome: 'Conceito e Moodboard',
          descricao: 'Alinhamento de estilo, paleta de cores e layout funcional.',
          tarefas: [
            'Entrevista de estilo e levantamento de necessidades dos ambientes',
            'Moodboard de referências visuais e paleta de materiais',
            'Planta de layout preliminar com disposição de mobiliário'
          ]
        },
        {
          ordem: 2,
          nome: 'Modelagem 3D e Especificação',
          descricao: 'Renders fotorrealistas e seleção de mobiliário solto.',
          tarefas: [
            'Modelagem tridimensional dos ambientes decorados',
            'Renderizações foto-realistas com iluminação de cena',
            'Catálogo preliminar de mobiliário solto e tapeçaria'
          ]
        },
        {
          ordem: 3,
          nome: 'Detalhamento de Marcenaria',
          descricao: 'Desenhos técnicos de marcenaria, pedras e paginação de acabamentos.',
          tarefas: [
            'Desenhos técnicos executivos de marcenaria sob medida',
            'Detalhamento de bancadas, cubas e marmoraria',
            'Planta luminotécnica com circuitos e especificações de lâmpadas',
            'Memorial descritivo de tecidos, papéis de parede e tintas'
          ]
        },
        {
          ordem: 4,
          nome: 'Acompanhamento e Produção',
          descricao: 'Orçamentos de fornecedores, guia de compras e vistoria de montagem.',
          tarefas: [
            'Planilha consolidada de orçamentos e fornecedores parceiros',
            'Guia de compras de objetos de decoração e arte',
            'Vistoria de produção e entrega dos ambientes'
          ]
        }
      ]
    },
    {
      id: 'comercial-corporativo',
      nome: 'Projeto Comercial & Corporativo',
      descricao: 'Projetos de escritórios, lojas e restaurantes com fluxo de clientes e normas técnicas.',
      icone: 'storefront',
      etapas: [
        {
          ordem: 1,
          nome: 'Identidade e Estudo de Fluxo',
          descricao: 'Branding do espaço, ergonomia e circulação de clientes.',
          tarefas: [
            'Alinhamento de identidade visual e experiência da marca no espaço',
            'Estudo de fluxo de clientes, colaboradores e acessibilidade NBR 9050',
            'Zoneamento de áreas de atendimento, estoque e trabalho'
          ]
        },
        {
          ordem: 2,
          nome: 'Layout Técnico e 3D',
          descricao: 'Modulação de estações de trabalho e ambientação comercial.',
          tarefas: [
            'Planta de layout de estações de trabalho e modulação técnica',
            'Modelagem 3D com iluminação comercial e display de produtos',
            'Especificação de materiais de alto tráfego e conforto acústico'
          ]
        },
        {
          ordem: 3,
          nome: 'Executivo e Aprovações',
          descricao: 'Pranchas para execução rápida e conformidade normativa.',
          tarefas: [
            'Projeto de comunicação visual e fachada comercial',
            'Detalhamento de expositores, balcões e marcenaria técnica',
            'Compatibilização de ar-condicionado, dados e combate a incêndio'
          ]
        }
      ]
    },
    {
      id: 'consultoria-viabilidade',
      nome: 'Consultoria & Estudo de Viabilidade',
      descricao: 'Diagnóstico rápido de potencial construtivo e viabilidade para clientes e investidores.',
      icone: 'analytics',
      etapas: [
        {
          ordem: 1,
          nome: 'Diagnóstico e Legislação',
          descricao: 'Análise de zoneamento municipal e parâmetros urbanísticos.',
          tarefas: [
            'Levantamento das diretrizes urbanísticas e recuos municipais',
            'Vistoria técnica do imóvel ou loteamento',
            'Cálculo de taxa de ocupação e potencial construtivo'
          ]
        },
        {
          ordem: 2,
          nome: 'Relatório Conceitual',
          descricao: 'Emissão do parecer técnico e croquis conceituais.',
          tarefas: [
            'Elaboração de croquis conceituais de implantação',
            'Estimativa preliminar de custos e prazos de obra',
            'Apresentação e emissão do laudo de viabilidade em PDF'
          ]
        }
      ]
    },
    {
      id: 'personalizado',
      nome: 'Personalizado (Em Branco)',
      descricao: 'Comece sem etapas pré-definidas para montar um fluxo sob medida.',
      icone: 'tune',
      etapas: []
    }
  ];

  obterTemplates(): Observable<ProjectTemplate[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('templates-projeto')
      .build();

    return this.http.get<any[]>(url).pipe(
      map(items => {
        if (!items || items.length === 0) return this.defaultTemplates;
        return items.map(item => ({
          id: item.codigo || item.id,
          nome: item.nome,
          descricao: item.descricao,
          icone: item.icone || 'home',
          etapas: (item.etapas || []).map((e: any) => ({
            ordem: e.ordem,
            nome: e.nome,
            descricao: e.descricao,
            tarefas: e.tarefas || []
          }))
        }));
      }),
      catchError(() => of(this.defaultTemplates))
    );
  }

  obterPorId(id: string): Observable<ProjectTemplate | undefined> {
    const template = this.defaultTemplates.find(t => t.id === id);
    return of(template);
  }

  gerarTarefasParaEtapa(etapaId: string, templateId?: string, etapaOrdem?: number): TarefaEtapa[] {
    const template = this.defaultTemplates.find(t => t.id === templateId) || this.defaultTemplates[0];
    const etapaTemplate = template.etapas.find(e => e.ordem === etapaOrdem);

    if (etapaTemplate && etapaTemplate.tarefas.length > 0) {
      return etapaTemplate.tarefas.map((titulo, idx) => ({
        id: `t_${etapaId}_${idx + 1}`,
        etapaId,
        titulo,
        concluida: false
      }));
    }

    return [
      {
        id: `t_${etapaId}_1`,
        etapaId,
        titulo: 'Definição do escopo e entregáveis da fase',
        concluida: false
      }
    ];
  }
}
