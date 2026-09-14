import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalSuporteComponent } from './portal-suporte.component';

describe('PortalSuporteComponent', () => {
  let component: PortalSuporteComponent;
  let fixture: ComponentFixture<PortalSuporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalSuporteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalSuporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir evento de abrir chat', () => {
    spyOn(component.abrirChat, 'emit');
    component.onAbrirChat();
    expect(component.abrirChat.emit).toHaveBeenCalled();
  });
});
