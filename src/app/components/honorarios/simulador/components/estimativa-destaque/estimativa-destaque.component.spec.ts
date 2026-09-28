import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstimativaDestaqueComponent } from './estimativa-destaque.component';

describe('EstimativaDestaqueComponent', () => {
  let component: EstimativaDestaqueComponent;
  let fixture: ComponentFixture<EstimativaDestaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimativaDestaqueComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EstimativaDestaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve formatar valor monetário corretamente', () => {
    expect(component.formatarMoeda(1500)).toContain('1.500');
    expect(component.formatarMoeda(undefined)).toBe('R$ 0,00');
  });

  it('deve emitir eventos de clique corretamente', () => {
    spyOn(component.salvarPropostaClick, 'emit');
    spyOn(component.vincularLeadClick, 'emit');
    spyOn(component.ajusteManualClick, 'emit');
    spyOn(component.pdfClick, 'emit');
    spyOn(component.whatsappClick, 'emit');

    component.salvarPropostaClick.emit();
    component.vincularLeadClick.emit();
    component.ajusteManualClick.emit();
    component.pdfClick.emit();
    component.whatsappClick.emit();

    expect(component.salvarPropostaClick.emit).toHaveBeenCalled();
    expect(component.vincularLeadClick.emit).toHaveBeenCalled();
    expect(component.ajusteManualClick.emit).toHaveBeenCalled();
    expect(component.pdfClick.emit).toHaveBeenCalled();
    expect(component.whatsappClick.emit).toHaveBeenCalled();
  });
});
