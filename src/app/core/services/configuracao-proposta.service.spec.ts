import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ConfiguracaoPropostaService } from './configuracao-proposta.service';
import { CONFIGURACAO_PROPOSTA_PADRAO } from '../models/configuracao-proposta.model';

describe('ConfiguracaoPropostaService', () => {
  let service: ConfiguracaoPropostaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ConfiguracaoPropostaService,
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

  it('deve resetar configurações para os valores de fábrica', () => {
    service.salvarConfiguracao({
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      nomeEscritorio: 'Modificado'
    }).subscribe();
    const req1 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req1.flush({});

    const resetado = service.resetarPadroes();
    const req2 = httpMock.expectOne((r) => r.url.includes('/propostas/configuracao') && r.method === 'PUT');
    req2.flush(CONFIGURACAO_PROPOSTA_PADRAO);

    expect(resetado.nomeEscritorio).toBe(CONFIGURACAO_PROPOSTA_PADRAO.nomeEscritorio);
    expect(service.getConfiguracao().nomeEscritorio).toBe(CONFIGURACAO_PROPOSTA_PADRAO.nomeEscritorio);
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
});
