import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectTemplateService } from './project-template.service';

describe('ProjectTemplateService', () => {
  let service: ProjectTemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProjectTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar lista de templates padrão do estúdio com fallback de erro', (done) => {
    service.obterTemplates().subscribe((templates) => {
      expect(templates.length).toBeGreaterThanOrEqual(4);
      expect(templates.some(t => t.id === 'residencial-completo')).toBeTrue();
      expect(templates.some(t => t.id === 'interiores-reforma')).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto'));
    req.error(new ProgressEvent('error'));
  });

  it('deve retornar templates recebidos da API do backend', (done) => {
    const mockTemplates = [
      {
        id: '123',
        codigo: 'custom-template',
        nome: 'Template Personalizado',
        descricao: 'Desc',
        icone: 'brush',
        ativo: true,
        etapas: [
          { ordem: 1, nome: 'Fase 1', descricao: 'Desc 1', tarefas: ['Tarefa A', 'Tarefa B'] }
        ]
      }
    ];

    service.obterTemplates().subscribe((templates) => {
      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('custom-template');
      expect(templates[0].nome).toBe('Template Personalizado');
      expect(templates[0].etapas[0].tarefas.length).toBe(2);
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto'));
    req.flush(mockTemplates);
  });

  it('deve obter template por ID específico', (done) => {
    service.obterPorId('residencial-completo').subscribe((template) => {
      expect(template).toBeDefined();
      expect(template?.nome).toContain('Residencial');
      expect(template?.etapas.length).toBe(4);
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto/residencial-completo'));
    req.flush({
      id: '1',
      codigo: 'residencial-completo',
      nome: 'Projeto Arquitetônico Residencial',
      etapas: [
        { ordem: 1, nome: 'Briefing', descricao: 'Desc', tarefas: [] },
        { ordem: 2, nome: '3D', descricao: 'Desc', tarefas: [] },
        { ordem: 3, nome: 'Executivo', descricao: 'Desc', tarefas: [] },
        { ordem: 4, nome: 'Entrega', descricao: 'Desc', tarefas: [] }
      ]
    });
  });

  it('deve gerar entregáveis para etapa existente no template', () => {
    const tarefas = service.gerarTarefasParaEtapa('etapa-123', 'residencial-completo', 1);
    expect(tarefas.length).toBe(4);
    expect(tarefas[0].etapaId).toBe('etapa-123');
    expect(tarefas[0].titulo.toLowerCase()).toContain('briefing');
  });

  it('deve criar novo template com sucesso', (done) => {
    const payload = {
      codigo: 'paisagismo',
      nome: 'Paisagismo',
      descricao: 'Desc',
      icone: 'yard',
      etapas: []
    };

    service.criarTemplate(payload).subscribe((res) => {
      expect(res.id).toBe('paisagismo');
      expect(res.codigo).toBe('paisagismo');
      expect(res.nome).toBe('Paisagismo');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto') && r.method === 'POST');
    req.flush({ id: '1', ...payload });
  });

  it('deve atualizar template com sucesso', (done) => {
    const payload = {
      id: '1',
      codigo: 'paisagismo',
      nome: 'Paisagismo Atualizado',
      descricao: 'Nova desc',
      icone: 'park',
      etapas: []
    };

    service.atualizarTemplate('1', payload).subscribe((res) => {
      expect(res.nome).toBe('Paisagismo Atualizado');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto/1') && r.method === 'PUT');
    req.flush(payload);
  });

  it('deve excluir template com sucesso', (done) => {
    service.excluirTemplate('1').subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('templates-projeto/1') && r.method === 'DELETE');
    req.flush(null);
  });
});
