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
      { status: 'Briefing', nomeStatus: 'Briefing', quantidade: 2, percentual: 50 },
      { status: 'Concluido', nomeStatus: 'Concluído', quantidade: 2, percentual: 50 }
    ];
    component.totalProjetos = 4;
    fixture.detectChanges();
  });

  it('should create and render segments and legend', () => {
    expect(component).toBeTruthy();

    const segments = fixture.nativeElement.querySelectorAll('.donut-segment');
    expect(segments.length).toBe(2);

    const legendRows = fixture.nativeElement.querySelectorAll('.legend-row');
    expect(legendRows.length).toBe(2);

    const totalEl = fixture.nativeElement.querySelector('.donut-total');
    expect(totalEl.textContent.trim()).toBe('4');
  });

  it('should calculate dash array and dash offset correctly', () => {
    const dashArray = component.obterDashArray(50);
    expect(dashArray).toContain('219.91');

    const offset0 = component.obterDashOffset(0);
    expect(offset0).toBe(-0);

    const offset1 = component.obterDashOffset(1);
    expect(offset1).toBeCloseTo(-219.91, 1);
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    component.totalProjetos = 0;
    fixture.detectChanges();

    const segments = fixture.nativeElement.querySelectorAll('.donut-segment');
    expect(segments.length).toBe(0);

    const totalEl = fixture.nativeElement.querySelector('.donut-total');
    expect(totalEl.textContent.trim()).toBe('0');
  });
});
