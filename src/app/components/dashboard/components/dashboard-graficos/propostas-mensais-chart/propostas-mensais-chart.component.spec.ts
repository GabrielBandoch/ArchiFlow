import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PropostasMensaisChartComponent } from './propostas-mensais-chart.component';

describe('PropostasMensaisChartComponent', () => {
  let component: PropostasMensaisChartComponent;
  let fixture: ComponentFixture<PropostasMensaisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropostasMensaisChartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PropostasMensaisChartComponent);
    component = fixture.componentInstance;
    component.dados = [
      { mesAno: '2026-05', rotuloMes: 'Mai/26', quantidade: 2, valorTotal: 20000 },
      { mesAno: '2026-06', rotuloMes: 'Jun/26', quantidade: 3, valorTotal: 40000 }
    ];
    component.pipelineTotal = 60000;
    fixture.detectChanges();
  });

  it('should create and render columns and pipeline badge', () => {
    expect(component).toBeTruthy();
    const cols = fixture.nativeElement.querySelectorAll('.timeline-column');
    expect(cols.length).toBe(2);

    const badge = fixture.nativeElement.querySelector('.badge-kpi');
    expect(badge.textContent).toContain('60.000,00');
  });

  it('should calculate max valor and bar height accurately', () => {
    expect(component.obterMaxValor()).toBe(40000);

    const heightMax = component.obterAlturaPercentual(40000);
    expect(heightMax).toBe(95);

    const heightHalf = component.obterAlturaPercentual(20000);
    expect(heightHalf).toBe(50);
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    component.pipelineTotal = 0;
    fixture.detectChanges();

    expect(component.obterMaxValor()).toBe(0);
    expect(component.obterAlturaPercentual(0)).toBe(5);

    const cols = fixture.nativeElement.querySelectorAll('.timeline-column');
    expect(cols.length).toBe(0);
  });
});
