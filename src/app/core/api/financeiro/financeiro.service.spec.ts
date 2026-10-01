import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinanceiroService } from './financeiro.service';
import { environment } from '../../../../environments/environment';
import { FormaPagamento, PainelFinanceiro, StatusParcela } from '../../../models/financeiro.model';
import { CriarContratoCommand, CriarParcelaCommand, DarBaixaParcelaCommand } from '../../../commands/financeiro.commands';

describe('FinanceiroService', () => {
  let service: FinanceiroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinanceiroService]
    });

    service = TestBed.inject(FinanceiroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obterPainel should send GET to /api/financeiro/painel', () => {
    const mockPainel: Partial<PainelFinanceiro> = {
      totalPrevisto: 100000,
      totalRecebido: 60000,
      totalPendente: 40000
    };

    service.obterPainel().subscribe(res => {
      expect(res.totalPrevisto).toBe(100000);
      expect(res.totalRecebido).toBe(60000);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/painel`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPainel);
  });

  it('obterParcelas with params should build query string correctly', () => {
    service.obterParcelas({ projetoId: 'p1', status: 'Pendente' }).subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/parcelas?projetoId=p1&status=Pendente`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'parc1', valor: 5000 }]);
  });

  it('criarContrato should send POST with command', () => {
    const command: CriarContratoCommand = {
      projetoId: 'p1',
      valorTotal: 15000,
      numeroParcelas: 3,
      dataPrimeiroVencimento: '2026-10-01',
      intervaloDias: 30
    };

    service.criarContrato(command).subscribe(res => {
      expect(res.valorTotal).toBe(15000);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/contratos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(command);
    req.flush({ id: 'ctf1', valorTotal: 15000, parcelas: [] });
  });

  it('darBaixaParcela should send PATCH to /api/financeiro/parcelas/:id/baixa', () => {
    const command: DarBaixaParcelaCommand = {
      dataPagamento: '2026-10-01',
      formaPagamento: FormaPagamento.Pix,
      observacoes: 'Pago'
    };

    service.darBaixaParcela('parc1', command).subscribe(res => {
      expect(res.status).toBe(StatusParcela.Pago);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/parcelas/parc1/baixa`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 'parc1', status: StatusParcela.Pago });
  });

  it('excluirParcela should send DELETE request', () => {
    service.excluirParcela('parc1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/parcelas/parc1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('uploadComprovante should send POST with FormData', () => {
    const file = new File(['dummy content'], 'recibo.pdf', { type: 'application/pdf' });
    service.uploadComprovante(file).subscribe(res => {
      expect(res.url).toBe('https://s3.amazonaws.com/recibo.pdf');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/financeiro/upload-comprovante`);
    expect(req.request.method).toBe('POST');
    req.flush({ url: 'https://s3.amazonaws.com/recibo.pdf', nome: 'recibo.pdf' });
  });
});

