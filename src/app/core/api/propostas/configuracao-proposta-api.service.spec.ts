import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfiguracaoPropostaApiService } from './configuracao-proposta-api.service';
import { environment } from '../../../../environments/environment';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../../models/configuracao-proposta.model';

describe('ConfiguracaoPropostaApiService', () => {
  let service: ConfiguracaoPropostaApiService;
  let httpMock: HttpTestingController;
  const expectedUrl = `${environment.apiUrl}/propostas/configuracao`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfiguracaoPropostaApiService]
    });
    service = TestBed.inject(ConfiguracaoPropostaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve obter configuração via GET', () => {
    const mockConfig: ConfiguracaoProposta = {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Estúdio Linha & Forma'
    };

    service.obterConfiguracao().subscribe((res) => {
      expect(res.nomeEscritorio).toBe('Estúdio Linha & Forma');
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);
  });

  it('deve salvar configuração via PUT', () => {
    const configParaSalvar: ConfiguracaoProposta = {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Estúdio Linha & Forma Atualizado'
    };

    service.salvarConfiguracao(configParaSalvar).subscribe((res) => {
      expect(res.nomeEscritorio).toBe('Estúdio Linha & Forma Atualizado');
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(configParaSalvar);
    req.flush(configParaSalvar);
  });
});
