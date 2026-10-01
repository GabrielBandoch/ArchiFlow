import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPropostaPdfComponent } from './modal-proposta-pdf.component';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CONFIGURACAO_PROPOSTA_PADRAO } from '../../../core/models/configuracao-proposta.model';

describe('ModalPropostaPdfComponent', () => {
  let component: ModalPropostaPdfComponent;
  let fixture: ComponentFixture<ModalPropostaPdfComponent>;
  let configService: jasmine.SpyObj<ConfiguracaoPropostaService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const configSpy = jasmine.createSpyObj('ConfiguracaoPropostaService', [
      'getConfiguracao',
      'isConfigurado',
      'gerarMensagemWhatsapp',
      'gerarLinkWhatsapp',
      'formatarMoeda'
    ]);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning']);

    configSpy.getConfiguracao.and.returnValue(CONFIGURACAO_PROPOSTA_PADRAO);
    configSpy.isConfigurado.and.returnValue(true);
    configSpy.gerarMensagemWhatsapp.and.returnValue('Mensagem teste');
    configSpy.gerarLinkWhatsapp.and.returnValue('https://api.whatsapp.com/send?text=Mensagem');
    configSpy.formatarMoeda.and.callFake((val: number) => `R$ ${val.toFixed(2)}`);

    await TestBed.configureTestingModule({
      imports: [ModalPropostaPdfComponent],
      providers: [
        { provide: ConfiguracaoPropostaService, useValue: configSpy },
        { provide: NotificationService, useValue: notifSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPropostaPdfComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfiguracaoPropostaService) as jasmine.SpyObj<ConfiguracaoPropostaService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    component.show = true;
    component.proposta = {
      codigo: 'PROP-001',
      titulo: 'Casa Modelo',
      clienteNome: 'Maria Silva',
      clienteTelefone: '47999999999',
      clienteEmail: 'maria@teste.com',
      metragemQuadrada: 180,
      valorFinalAjustado: 25000,
      criadoEm: new Date().toISOString(),
      etapas: [
        { nome: 'Estudo Preliminar', percentual: 40, valor: 10000, prazo: '15 dias' },
        { nome: 'Executivo', percentual: 60, valor: 15000, prazo: '25 dias' }
      ]
    };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir evento de fechar ao clicar no botão fechar', () => {
    spyOn(component.close, 'emit');
    component.fechar();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve chamar window.print ao clicar em imprimir', () => {
    spyOn(window, 'print');
    component.imprimir();
    expect(window.print).toHaveBeenCalled();
  });

  it('deve abrir link do WhatsApp e notificar sucesso ao compartilhar', () => {
    spyOn(window, 'open');
    component.compartilharWhatsapp();
    expect(window.open).toHaveBeenCalledWith('https://api.whatsapp.com/send?text=Mensagem', '_blank');
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('deve abrir cliente de email via mailto', () => {
    spyOn(window, 'open');
    component.enviarEmail();
    expect(window.open).toHaveBeenCalled();
  });
});
