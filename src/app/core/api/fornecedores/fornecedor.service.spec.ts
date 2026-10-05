import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FornecedorService } from './fornecedor.service';
import { environment } from '../../../../environments/environment';
import { 
  Fornecedor, 
  CriarFornecedorCommand, 
  AtualizarFornecedorCommand, 
  AvaliacaoFornecedor, 
  AdicionarAvaliacaoCommand, 
  ProjetoFornecedor, 
  VincularProjetoCommand 
} from '../../../models/fornecedor.model';

describe('FornecedorService', () => {
  let service: FornecedorService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/fornecedores`;

  const mockFornecedor: Fornecedor = {
    id: 'forn-1',
    nome: 'Marcenaria Joinville',
    especialidade: 'Marcenaria',
    email: 'contato@marcenaria.com',
    telefone: '47999999999',
    cidade: 'Joinville',
    estado: 'SC',
    descricao: 'Móveis sob medida',
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 5,
    ativo: true,
    dataCriacao: '2026-10-01T00:00:00Z',
    totalProjetosAtivos: 2,
    avaliacoes: [],
    projetosVinculados: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FornecedorService]
    });
    service = TestBed.inject(FornecedorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve obter todos os fornecedores sem filtro', () => {
    service.obterTodos().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].nome).toBe('Marcenaria Joinville');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockFornecedor]);
  });

  it('deve obter todos os fornecedores filtrando por especialidade', () => {
    service.obterTodos('Marcenaria').subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}?especialidade=Marcenaria`);
    expect(req.request.method).toBe('GET');
    req.flush([mockFornecedor]);
  });

  it('deve obter fornecedor por id', () => {
    service.obterPorId('forn-1').subscribe(res => {
      expect(res.id).toBe('forn-1');
      expect(res.nome).toBe('Marcenaria Joinville');
    });

    const req = httpMock.expectOne(`${baseUrl}/forn-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFornecedor);
  });

  it('deve criar novo fornecedor', () => {
    const cmd: CriarFornecedorCommand = {
      nome: 'Novo Fornecedor',
      especialidade: 'Vidraçaria',
      email: 'contato@vidracaria.com'
    };

    service.criar(cmd).subscribe(res => {
      expect(res.id).toBe('forn-1');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cmd);
    req.flush(mockFornecedor);
  });

  it('deve atualizar fornecedor existente', () => {
    const cmd: AtualizarFornecedorCommand = {
      id: 'forn-1',
      nome: 'Nome Atualizado',
      especialidade: 'Marcenaria',
      ativo: true
    };

    service.atualizar('forn-1', cmd).subscribe(res => {
      expect(res.id).toBe('forn-1');
    });

    const req = httpMock.expectOne(`${baseUrl}/forn-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cmd);
    req.flush(mockFornecedor);
  });

  it('deve excluir fornecedor', () => {
    service.excluir('forn-1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/forn-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve adicionar avaliação para fornecedor', () => {
    const cmd: AdicionarAvaliacaoCommand = {
      fornecedorId: 'forn-1',
      nota: 5,
      comentario: 'Serviço excelente',
      autorNome: 'Arquiteto'
    };
    const mockAvaliacao: AvaliacaoFornecedor = {
      id: 'av-1',
      fornecedorId: 'forn-1',
      nota: 5,
      comentario: 'Serviço excelente',
      autorNome: 'Arquiteto',
      dataAvaliacao: '2026-10-05T00:00:00Z'
    };

    service.adicionarAvaliacao('forn-1', cmd).subscribe(res => {
      expect(res.id).toBe('av-1');
      expect(res.nota).toBe(5);
    });

    const req = httpMock.expectOne(`${baseUrl}/forn-1/avaliacoes`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAvaliacao);
  });

  it('deve vincular fornecedor a projeto', () => {
    const cmd: VincularProjetoCommand = {
      fornecedorId: 'forn-1',
      projetoId: 'proj-1',
      funcaoNoProjeto: 'Mobiliário'
    };
    const mockVinculo: ProjetoFornecedor = {
      id: 'vinc-1',
      fornecedorId: 'forn-1',
      projetoId: 'proj-1',
      funcaoNoProjeto: 'Mobiliário',
      dataVinculo: '2026-10-05T00:00:00Z'
    };

    service.vincularProjeto('forn-1', cmd).subscribe(res => {
      expect(res.id).toBe('vinc-1');
      expect(res.funcaoNoProjeto).toBe('Mobiliário');
    });

    const req = httpMock.expectOne(`${baseUrl}/forn-1/projetos`);
    expect(req.request.method).toBe('POST');
    req.flush(mockVinculo);
  });

  it('deve desvincular fornecedor do projeto', () => {
    service.desvincularProjeto('vinc-1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/projetos/vinc-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve obter fornecedores de um projeto', () => {
    service.obterFornecedoresDoProjeto('proj-1').subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/projeto/proj-1`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'vinc-1', fornecedorId: 'forn-1', projetoId: 'proj-1', funcaoNoProjeto: 'Marcenaria', dataVinculo: '2026-10-05T00:00:00Z' }]);
  });
});
