import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ConfiguracaoPropostaService } from './configuracao-proposta.service';
import { ConfiguracaoPropostaApiService } from '../api/propostas/configuracao-proposta-api.service';
import { CONFIGURACAO_PROPOSTA_PADRAO } from '../models/configuracao-proposta.model';

describe('ConfiguracaoPropostaService', () => {
  let service: ConfiguracaoPropostaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ConfiguracaoPropostaService,
        ConfiguracaoPropostaApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ConfiguracaoPropostaService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao'));
    req.flush(null);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('deve ser instanciado com as configurações padrão', () => {
    expect(service).toBeTruthy();
    const config = service.getConfiguracao();
    expect(config.nomeEscritorio).toBe(CONFIGURACAO_PROPOSTA_PADRAO.nomeEscritorio);
    expect(config.validadeDias).toBe(15);
  });

  it('deve salvar e carregar novas configurações no localStorage', () => {
    const custom = {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Studio Alpha Arquitetura',
      email: 'contato@alpha.com',
      telefone: '4799999999',
      validadeDias: 30,
      configurado: true
    };

    service.salvarConfiguracao(custom).subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req.flush(custom);

    const atual = service.getConfiguracao();
    expect(atual.nomeEscritorio).toBe('Studio Alpha Arquitetura');
    expect(atual.validadeDias).toBe(30);
  });

  it('deve resetar configurações para os valores de fábrica somente após sucesso da API', () => {
    service.salvarConfiguracao({
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Modificado'
    }).subscribe();
    const req1 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req1.flush({});

    let resetado: any = null;
    service.resetarPadroes().subscribe((res) => {
      resetado = res;
    });

    const req2 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req2.flush(CONFIGURACAO_PROPOSTA_PADRAO);

    expect(resetado.nomeEscritorio).toBe(CONFIGURACAO_PROPOSTA_PADRAO.nomeEscritorio);
    expect(service.getConfiguracao().nomeEscritorio).toBe(CONFIGURACAO_PROPOSTA_PADRAO.nomeEscritorio);
  });

  it('não deve resetar configurações no estado local se o backend falhar em resetarPadroes', () => {
    service.salvarConfiguracao({
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Escritório Personalizado Mantido'
    }).subscribe();
    const req1 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req1.flush({
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Escritório Personalizado Mantido'
    });

    let erroRecebido: any = null;
    service.resetarPadroes().subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (err) => {
        erroRecebido = err;
      }
    });

    const req2 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req2.flush({ message: 'Erro ao resetar no servidor' }, { status: 500, statusText: 'Internal Server Error' });

    expect(erroRecebido).toBeTruthy();
    expect(service.getConfiguracao().nomeEscritorio).toBe('Escritório Personalizado Mantido');
  });

  it('deve gerar mensagem de WhatsApp formatada substituindo placeholders', () => {
    const msg = service.gerarMensagemWhatsapp({
      clienteNome: 'João Silva',
      projetoTitulo: 'Residência Alphaville',
      metragem: 250,
      valorFinal: 45000
    });

    expect(msg).toContain('João Silva');
    expect(msg).toContain('Residência Alphaville');
    expect(msg).toContain('250 m²');
    expect(msg).toContain('R$');
  });

  it('deve gerar link de WhatsApp correto com ou sem DDI', () => {
    const link = service.gerarLinkWhatsapp('47999466073', 'Olá!');
    expect(link).toContain('phone=5547999466073');
    expect(link).toContain('text=Ol%C3%A1!');

    const linkSemTel = service.gerarLinkWhatsapp('', 'Teste');
    expect(linkSemTel).toContain('api.whatsapp.com/send?text=Teste');
  });

  it('não deve salvar no localStorage nem atualizar estado se o backend falhar ao salvar', () => {
    const estadoOriginal = service.getConfiguracao();
    const configInvalida = {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Tentativa Que Falhou'
    };

    let erroRecebido: any = null;
    service.salvarConfiguracao(configInvalida).subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (err) => {
        erroRecebido = err;
      }
    });

    const req = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req.flush({ message: 'Erro interno' }, { status: 500, statusText: 'Internal Server Error' });

    expect(erroRecebido).toBeTruthy();
    expect(service.getConfiguracao().nomeEscritorio).toBe(estadoOriginal.nomeEscritorio);
    const storageItem = localStorage.getItem('archiflow_config_proposta_v2');
    if (storageItem) {
      const parsed = JSON.parse(storageItem);
      expect(parsed.nomeEscritorio).not.toBe('Tentativa Que Falhou');
    }
  });

  it('deve compartilhar a mesma requisição HTTP quando carregarDoServidor for chamado em paralelo', () => {
    let res1: any = null;
    let res2: any = null;

    service.carregarDoServidor().subscribe((r) => (res1 = r));
    service.carregarDoServidor().subscribe((r) => (res2 = r));

    // Apenas UMA requisição deve ser emitida
    const reqs = httpMock.match((r) => r.url.includes('/propostas/configuracao') && r.method === 'GET');
    expect(reqs.length).toBe(1);

    const mockResponse = {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Escritório Dedup Teste',
      configurado: true
    };
    reqs[0].flush(mockResponse);

    expect(res1?.nomeEscritorio).toBe('Escritório Dedup Teste');
    expect(res2?.nomeEscritorio).toBe('Escritório Dedup Teste');
  });
});
