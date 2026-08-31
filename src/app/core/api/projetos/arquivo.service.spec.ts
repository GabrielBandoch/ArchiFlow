import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArquivoService } from './arquivo.service';
import { environment } from '../../../../environments/environment';
import { Arquivo } from '../../../models/arquivo.model';

describe('ArquivoService', () => {
  let service: ArquivoService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/arquivos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArquivoService]
    });

    service = TestBed.inject(ArquivoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch files by project (obterPorProjeto)', () => {
    const mockArquivos: Arquivo[] = [
      {
        id: 'a1',
        projetoId: 'p1',
        nome: 'planta_baixa.pdf',
        urlStorage: 'http://storage/planta.pdf',
        visivelCliente: true,
        criadoEm: '2026-08-01'
      }
    ];

    service.obterPorProjeto('p1').subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].nome).toBe('planta_baixa.pdf');
    });

    const req = httpMock.expectOne(`${baseUrl}/projeto/p1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArquivos);
  });

  it('should upload file (upload)', () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const mockArquivo: Arquivo = {
      id: 'a2',
      projetoId: 'p1',
      nome: 'test.pdf',
      urlStorage: 'http://storage/test.pdf',
      visivelCliente: true,
      criadoEm: '2026-08-01'
    };

    service.upload(file, 'p1', true).subscribe((res) => {
      expect(res.id).toBe('a2');
    });

    const req = httpMock.expectOne(`${baseUrl}/upload`);
    expect(req.request.method).toBe('POST');
    req.flush(mockArquivo);
  });

  it('should delete file (excluir)', () => {
    service.excluir('a1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/a1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
