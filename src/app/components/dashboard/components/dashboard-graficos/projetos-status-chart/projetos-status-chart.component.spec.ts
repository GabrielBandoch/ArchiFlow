import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjetosStatusChartComponent } from './projetos-status-chart.component';

describe('ProjetosStatusChartComponent', () => {
  let component: ProjetosStatusChartComponent;
  let fixture: ComponentFixture<ProjetosStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetosStatusChartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetosStatusChartComponent);
    component = fixture.componentInstance;
    component.dados = [
      { status: 'Briefing', nomeStatus: 'Briefing', quantidade: 2, percentual: 40 },
      { status: 'Concluido', nomeStatus: 'Concluído', quantidade: 2, percentual: 40 },
      { status: 'Cancelado', nomeStatus: 'Cancelado', quantidade: 1, percentual: 20 }
    ];
    fixture.detectChanges();
  });

  it('should create and render segments and legend, calculating total from dados (including cancelados)', () => {
    expect(component).toBeTruthy();

    const segments = fixture.nativeElement.querySelectorAll('.donut-segment');
    expect(segments.length).toBe(3);

    const legendRows = fixture.nativeElement.querySelectorAll('.legend-row');
    expect(legendRows.length).toBe(3);

    const totalEl = fixture.nativeElement.querySelector('.donut-total');
    expect(totalEl.textContent.trim()).toBe('5');
    expect(component.totalExibido).toBe(5);
  });

  it('should use totalProjetos override when explicitly provided', () => {
    component.totalProjetos = 10;
    fixture.detectChanges();

    const totalEl = fixture.nativeElement.querySelector('.donut-total');
    expect(totalEl.textContent.trim()).toBe('10');
    expect(component.totalExibido).toBe(10);
  });

  it('should calculate dash array and dash offset correctly', () => {
    const dashArray = component.obterDashArray(40);
    expect(dashArray).toContain('175.92');

    const offset0 = component.obterDashOffset(0);
    expect(offset0).toBe(-0);

    const offset1 = component.obterDashOffset(1);
    expect(offset1).toBeCloseTo(-175.92, 1);
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    component.totalProjetos = undefined;
    fixture.detectChanges();

    const segments = fixture.nativeElement.querySelectorAll('.donut-segment');
    expect(segments.length).toBe(0);

    const totalEl = fixture.nativeElement.querySelector('.donut-total');
    expect(totalEl.textContent.trim()).toBe('0');
    expect(component.totalExibido).toBe(0);
  });
});
