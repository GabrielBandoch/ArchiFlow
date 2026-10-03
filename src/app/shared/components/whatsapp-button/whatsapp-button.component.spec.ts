import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhatsAppButtonComponent } from './whatsapp-button.component';
import { WhatsAppUtils } from '../../../core/utils/whatsapp-utils';

describe('WhatsAppButtonComponent', () => {
  let component: WhatsAppButtonComponent;
  let fixture: ComponentFixture<WhatsAppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsAppButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsAppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar WhatsAppUtils.abrirWhatsApp ao clicar', () => {
    spyOn(WhatsAppUtils, 'abrirWhatsApp');
    component.telefone = '47999466073';
    component.mensagem = 'Teste';
    const fakeEvent = new MouseEvent('click');

    component.onClick(fakeEvent);
    expect(WhatsAppUtils.abrirWhatsApp).toHaveBeenCalledWith('47999466073', 'Teste', fakeEvent);
  });
});
