import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ViaCepService } from './via-cep.service';
import { ViaCepResponse } from '../../models/via-cep.model';

describe('ViaCepService', () => {
  let service: ViaCepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ViaCepService]
    });

    service = TestBed.inject(ViaCepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when cep is empty or invalid length', (done) => {
    service.buscarCep('123').subscribe((res) => {
      expect(res).toBeNull();
      done();
    });
  });

  it('should fetch and map valid CEP', (done) => {
    const mockViaCepResponse: ViaCepResponse = {
      cep: '89010-000',
      logradouro: 'Rua XV de Novembro',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Blumenau',
      uf: 'SC',
      ibge: '4202404',
      gia: '',
      ddd: '47',
      siafi: '8047'
    };

    service.buscarCep('89010000').subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res?.logradouro).toBe('Rua XV de Novembro');
      expect(res?.localidade).toBe('Blumenau');
      expect(res?.uf).toBe('SC');
      done();
    });

    const req = httpMock.expectOne('https://viacep.com.br/ws/89010000/json');
    expect(req.request.method).toBe('GET');
    req.flush(mockViaCepResponse);
  });
});
