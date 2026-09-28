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
    component.formatarMoeda = (val: number) => `R$ ${val.toLocaleString('pt-BR')}`;
    fixture.detectChanges();
  });

  it('should create kpi component', () => {
    expect(component).toBeTruthy();
    expect(component.kpis.totalProjetosAtivos).toBe(5);
  });
});
