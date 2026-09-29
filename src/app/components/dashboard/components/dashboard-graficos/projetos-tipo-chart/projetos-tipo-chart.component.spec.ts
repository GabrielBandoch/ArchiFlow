import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjetosTipoChartComponent } from './projetos-tipo-chart.component';

describe('ProjetosTipoChartComponent', () => {
  let component: ProjetosTipoChartComponent;
  let fixture: ComponentFixture<ProjetosTipoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetosTipoChartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetosTipoChartComponent);
    component = fixture.componentInstance;
    component.dados = [
      { tipo: 'Residencial', nomeTipo: 'Residencial', quantidade: 5, percentual: 62.5 },
      { tipo: 'Comercial', nomeTipo: 'Comercial', quantidade: 3, percentual: 37.5 }
    ];
    fixture.detectChanges();
  });

  it('should create and render bars for each typology', () => {
    expect(component).toBeTruthy();
    const rows = fixture.nativeElement.querySelectorAll('.bar-row');
    expect(rows.length).toBe(2);

    const firstFill = fixture.nativeElement.querySelector('.bar-fill') as HTMLElement;
    expect(firstFill.style.width).toBe('62.5%');
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.bar-row');
    expect(rows.length).toBe(0);
  });
});
