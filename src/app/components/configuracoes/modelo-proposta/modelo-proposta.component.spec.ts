import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModeloPropostaComponent } from './modelo-proposta.component';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ModeloPropostaComponent', () => {
  let component: ModeloPropostaComponent;
  let fixture: ComponentFixture<ModeloPropostaComponent>;
  let configService: jasmine.SpyObj<ConfiguracaoPropostaService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockConfig = {
    nomeEscritorio: 'Studio Teste Arquitetura',
    slogan: 'Arquitetura com propósito',
    registroProfissional: 'CAU A12345',
    email: 'contato@studioteste.com',
    telefone: '47999466073',
    endereco: 'Centro',
    corPrimaria: '#b5603c',
    exibirCabecalho: true,
    exibirResumo: true,
    exibirTabelaEtapas: true,
    exibirMemoriaCalculo: false,
    exibirCondicoesPagamento: true,
    exibirTermosGerais: true,
    exibirAssinaturas: true,
    textoApresentacao: 'Apresentamos nossa proposta...',
    validadeDias: 15,
    condicoesPagamentoPadrao: '30% entrada...',
    chavePix: '123456',
    dadosBancarios: 'Banco 001',
    termosGerais: 'Regras...',
    templateMensagemWhatsapp: 'Olá {cliente}...',
    configurado: true
  };

  beforeEach(async () => {
    const configSpy = jasmine.createSpyObj('ConfiguracaoPropostaService', [
      'getConfiguracao',
      'carregarDoServidor',
      'salvarConfiguracao',
      'resetarPadroes',
      'formatarMoeda',
      'gerarMensagemWhatsapp'
    ]);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'info']);

    configSpy.getConfiguracao.and.returnValue(mockConfig);
    configSpy.carregarDoServidor.and.returnValue(of(mockConfig));
    configSpy.salvarConfiguracao.and.returnValue(of(mockConfig));
    configSpy.formatarMoeda.and.callFake((val: number) => `R$ ${val.toFixed(2)}`);
    configSpy.gerarMensagemWhatsapp.and.returnValue('Mensagem gerada');

    await TestBed.configureTestingModule({
      imports: [ModeloPropostaComponent, ReactiveFormsModule],
      providers: [
        { provide: ConfiguracaoPropostaService, useValue: configSpy },
        { provide: NotificationService, useValue: notifSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModeloPropostaComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfiguracaoPropostaService) as jasmine.SpyObj<ConfiguracaoPropostaService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  it('deve criar o componente e inicializar o formulário com as configurações', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.nomeEscritorio).toBe('Studio Teste Arquitetura');
    expect(component.form.value.validadeDias).toBe(15);
  });

  it('deve alternar as abas de configuração corretamente', () => {
    component.setAba('secoes');
    expect(component.abaAtiva).toBe('secoes');

    component.setAba('textos');
    expect(component.abaAtiva).toBe('textos');

    component.setAba('whatsapp');
    expect(component.abaAtiva).toBe('whatsapp');
  });

  it('deve salvar configurações válidas e notificar sucesso', () => {
    component.form.patchValue({
      nomeEscritorio: 'Novo Nome Studio'
    });

    component.salvar();

    expect(configService.salvarConfiguracao).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalledWith('Configurações do modelo de proposta salvas com sucesso!');
  });

  it('deve alertar erro se o formulário for inválido ao salvar', () => {
    component.form.patchValue({
      email: 'invalido-sem-arroba'
    });

    component.salvar();

    expect(notificationService.warning).toHaveBeenCalled();
  });

  it('deve restaurar configurações para os valores de fábrica quando confirmado', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    configService.resetarPadroes.and.returnValue({
      ...mockConfig,
      nomeEscritorio: 'Studio Exemplo Arquitetura'
    });

    component.restaurarPadrao();

    expect(configService.resetarPadroes).toHaveBeenCalled();
    expect(notificationService.info).toHaveBeenCalled();
  });

  it('deve remover logotipo com sucesso', () => {
    component.form.patchValue({ logoUrl: 'data:image/png;base64,123' });
    component.removerLogotipo();
    expect(component.form.value.logoUrl).toBe('');
    expect(notificationService.info).toHaveBeenCalledWith('Logotipo removido.');
  });

  it('deve validar tipo de arquivo na seleção de logotipo', () => {
    const fakeEvent = {
      target: {
        files: [
          new File(['content'], 'test.pdf', { type: 'application/pdf' })
        ]
      }
    } as any;

    component.onFileSelected(fakeEvent);
    expect(notificationService.warning).toHaveBeenCalledWith(jasmine.stringMatching(/PNG, SVG ou JPG/));
  });
});
