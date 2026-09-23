import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HonorarioService } from './honorario.service';
import { environment } from '../../../environments/environment';
import { SimulacaoParametros, SimulacaoResultado, CriarPropostaCommand, PropostaHonorario } from '../../models/honorario.model';

describe('HonorarioService', () => {
  let service: HonorarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HonorarioService]
    });
    service = TestBed.inject(HonorarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /honorarios/simular', () => {
    const params: SimulacaoParametros = {
      metragemQuadrada: 150,
      tipoProjeto: 0,
      padraoImovel: 1
    };

    const mockResult = { metragemQuadrada: 150, valorTotalSugerido: 18450 } as SimulacaoResultado;

    service.simular(params).subscribe(res => {
      expect(res).toEqual(mockResult);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/honorarios/simular`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params);
    req.flush(mockResult);
  });

  it('should call GET /propostas', () => {
    const mockPropostas = [{ id: '1', titulo: 'Proposta 1' }] as PropostaHonorario[];

    service.obterPropostas().subscribe(res => {
      expect(res).toEqual(mockPropostas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPropostas);
  });

  it('should call POST /propostas', () => {
    const cmd: CriarPropostaCommand = {
      titulo: 'Proposta Nova',
      tipoProjeto: 0,
      padraoImovel: 1,
      metragemQuadrada: 150
    };

    const mockCreated = { id: 'prop-1', titulo: 'Proposta Nova' } as PropostaHonorario;

    service.criarProposta(cmd).subscribe(res => {
      expect(res).toEqual(mockCreated);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cmd);
    req.flush(mockCreated);
  });

  it('should call PUT /propostas/:id/status', () => {
    const mockUpdated = { id: 'prop-1', status: 2, statusNome: 'Aprovada' } as PropostaHonorario;

    service.atualizarStatus('prop-1', { status: 2 }).subscribe(res => {
      expect(res).toEqual(mockUpdated);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas/prop-1/status`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUpdated);
  });

  it('should call DELETE /propostas/:id', () => {
    service.excluirProposta('prop-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas/prop-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
