import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjetoService } from './projeto.service';
import { environment } from '../../../../environments/environment';
import { Projeto, StatusProjeto, TipoProjeto, EtapaProjeto, StatusEtapa } from '../../../models/projeto.model';
import { CriarProjetoCommand, AtualizarProjetoCommand, CriarEtapaCommand } from '../../../commands/projeto.commands';

describe('ProjetoService', () => {
  let service: ProjetoService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/projetos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjetoService]
    });

    service = TestBed.inject(ProjetoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all projects (obterTodos)', () => {
    const mockProjetos: Projeto[] = [
      {
        id: '1',
        nome: 'Residência Vale',
        descricao: 'Projeto residencial',
        status: StatusProjeto.Desenvolvimento,
        statusLabel: 'Desenvolvimento',
        tipo: TipoProjeto.Residencial,
        tipoLabel: 'Residencial',
        dataInicio: '2026-08-01',
        metragemTotal: 250,
        clienteId: 'c1',
        criadoEm: '2026-08-01',
        etapas: [],
        progressoPercentual: 25
      }
    ];

    service.obterTodos().subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].nome).toBe('Residência Vale');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjetos);
  });

  it('should fetch project by ID (obterPorId)', () => {
    const mockProjeto: Projeto = {
      id: '1',
      nome: 'Residência Vale',
      descricao: 'Projeto residencial',
      status: StatusProjeto.Desenvolvimento,
      statusLabel: 'Desenvolvimento',
      tipo: TipoProjeto.Residencial,
      tipoLabel: 'Residencial',
      dataInicio: '2026-08-01',
      metragemTotal: 250,
      clienteId: 'c1',
      criadoEm: '2026-08-01',
      etapas: [],
      progressoPercentual: 25
    };

    service.obterPorId('1').subscribe((res) => {
      expect(res.id).toBe('1');
      expect(res.nome).toBe('Residência Vale');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjeto);
  });

  it('should create project (criar)', () => {
    const command: CriarProjetoCommand = {
      nome: 'Novo Projeto',
      descricao: 'Desc',
      tipo: TipoProjeto.Residencial,
      dataInicio: '2026-08-01',
      metragemTotal: 150,
      clienteId: 'c1'
    };

    const mockResponse: Projeto = {
      id: '10',
      nome: 'Novo Projeto',
      descricao: 'Desc',
      status: StatusProjeto.Briefing,
      statusLabel: 'Briefing',
      tipo: TipoProjeto.Residencial,
      tipoLabel: 'Residencial',
      dataInicio: '2026-08-01',
      metragemTotal: 150,
      clienteId: 'c1',
      criadoEm: '2026-08-01',
      etapas: [],
      progressoPercentual: 0
    };

    service.criar(command).subscribe((res) => {
      expect(res.id).toBe('10');
      expect(res.nome).toBe('Novo Projeto');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it('should update project (atualizar)', () => {
    const command: AtualizarProjetoCommand = {
      id: '1',
      nome: 'Nome Atualizado',
      descricao: 'Desc',
      tipo: TipoProjeto.Comercial,
      status: StatusProjeto.Execucao,
      dataInicio: '2026-08-01',
      metragemTotal: 300
    };

    service.atualizar('1', command).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should update project status (atualizarStatus)', () => {
    service.atualizarStatus('1', StatusProjeto.Concluido).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ id: '1', status: StatusProjeto.Concluido });
    req.flush({});
  });

  it('should create etapa (criarEtapa)', () => {
    const command: CriarEtapaCommand = {
      projetoId: '1',
      nome: 'Nova Etapa',
      descricao: 'Desc',
      ordem: 5
    };

    const mockEtapa: EtapaProjeto = {
      id: 'e1',
      projetoId: '1',
      nome: 'Nova Etapa',
      descricao: 'Desc',
      status: StatusEtapa.Pendente,
      statusLabel: 'Pendente',
      ordem: 5
    };

    service.criarEtapa('1', command).subscribe((res) => {
      expect(res.id).toBe('e1');
    });

    const req = httpMock.expectOne(`${baseUrl}/1/etapas`);
    expect(req.request.method).toBe('POST');
    req.flush(mockEtapa);
  });

  it('should update etapa status (atualizarStatusEtapa)', () => {
    service.atualizarStatusEtapa('e1', StatusEtapa.Concluida).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/etapas/e1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ etapaId: 'e1', status: StatusEtapa.Concluida });
    req.flush({});
  });

  it('should delete project (excluir)', () => {
    service.excluir('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
