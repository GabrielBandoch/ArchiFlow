import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardKpisComponent } from './dashboard-kpis.component';
import { DashboardKpis } from '../../../../models/dashboard.model';

describe('DashboardKpisComponent', () => {
  let component: DashboardKpisComponent;
  let fixture: ComponentFixture<DashboardKpisComponent>;

  const mockKpis: DashboardKpis = {
    totalProjetosAtivos: 5,
    totalProjetosConcluidos: 10,
    totalLeadsAtivos: 12,
    totalLeadsConvertidos: 8,
    taxaConversaoLeads: 65,
    totalClientes: 15,
    totalPropostas: 20,
    valorTotalPropostas: 150000,
    valorMedioProposta: 7500
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardKpisComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardKpisComponent);
    component = fixture.componentInstance;
    component.kpis = mockKpis;
    fixture.detectChanges();
  });

  it('should create kpi component and render values', () => {
    expect(component).toBeTruthy();
    expect(component.kpis.totalProjetosAtivos).toBe(5);

    const values = fixture.nativeElement.querySelectorAll('.kpi-value');
    expect(values.length).toBe(4);
    expect(values[0].textContent.trim()).toBe('5');
    expect(values[1].textContent.trim()).toBe('65%');
  });

  it('should render semantically correct "leads ativos" label instead of "em negociação"', () => {
    const pill = fixture.nativeElement.querySelector('.pill-amber');
    expect(pill).toBeTruthy();
    expect(pill.textContent).toContain('12 leads ativos');
    expect(pill.textContent).not.toContain('em negociação');
  });

  it('should render formatted currency values using dashboard.utils', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('150.000,00');
    expect(text).toContain('7.500,00');
  });
});
