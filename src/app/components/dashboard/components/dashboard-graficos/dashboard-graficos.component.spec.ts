import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardGraficosComponent } from './dashboard-graficos.component';
import { DashboardMetricas } from '../../../../models/dashboard.model';

describe('DashboardGraficosComponent', () => {
  let component: DashboardGraficosComponent;
  let fixture: ComponentFixture<DashboardGraficosComponent>;

  const mockMetricas: DashboardMetricas = {
    kpis: {
      totalProjetosAtivos: 10,
      totalProjetosConcluidos: 5,
      totalLeadsAtivos: 8,
      totalLeadsConvertidos: 4,
      taxaConversaoLeads: 50,
      totalClientes: 12,
      totalPropostas: 6,
      valorTotalPropostas: 90000,
      valorMedioProposta: 15000
    },
    projetosPorStatus: [
      { status: 'EstudoPreliminar', nomeStatus: 'Estudo Preliminar', quantidade: 4, percentual: 40 },
      { status: 'Concluido', nomeStatus: 'Concluído', quantidade: 6, percentual: 60 }
    ],
    projetosPorTipo: [
      { tipo: 'Residencial', nomeTipo: 'Residencial', quantidade: 7, percentual: 70 },
      { tipo: 'Comercial', nomeTipo: 'Comercial', quantidade: 3, percentual: 30 }
    ],
    leadsPorStatus: [
      { status: 'Novo', nomeStatus: 'Novo', quantidade: 4, percentual: 50 },
      { status: 'Qualificado', nomeStatus: 'Qualificado', quantidade: 4, percentual: 50 }
    ],
    leadsPorOrigem: [
      { origem: 'Instagram', quantidade: 5, percentual: 50 },
      { origem: 'Indicação', quantidade: 5, percentual: 50 }
    ],
    propostasMensais: [
      { mesAno: '2026-01', rotuloMes: 'Jan/26', quantidade: 2, valorTotal: 30000 },
      { mesAno: '2026-02', rotuloMes: 'Fev/26', quantidade: 4, valorTotal: 60000 }
    ],
    projetosRecentes: [],
    leadsRecentes: [],
    propostasRecentes: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGraficosComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardGraficosComponent);
    component = fixture.componentInstance;
    component.widgetId = 'grafico_projetos_status';
    component.metricas = mockMetricas;
    component.formatarMoeda = (val: number) => `R$ ${val}`;
    component.formatarMoedaInteiro = (val: number) => `R$ ${val}`;
    fixture.detectChanges();
  });

  it('should create graphic component', () => {
    expect(component).toBeTruthy();
  });

  it('should return appropriate phase colors', () => {
    expect(component.obterCorFase('EstudoPreliminar')).toBe('#3b82f6');
    expect(component.obterCorFase('Anteprojeto')).toBe('#8b5cf6');
    expect(component.obterCorFase('Concluido')).toBe('#10b981');
    expect(component.obterCorFase('Desconhecido')).toBe('#94a3b8');
  });

  it('should calculate SVG dasharray and dashoffset', () => {
    const dashArray = component.obterDashArray(40);
    expect(dashArray).toContain('439.82');

    const offset0 = component.obterDashOffset(0);
    expect(offset0).toBe(-0);

    const offset1 = component.obterDashOffset(1);
    expect(offset1).toBeLessThan(0);
  });

  it('should compute max monthly proposals', () => {
    expect(component.obterMaxPropostasMensal()).toBe(60000);
  });
});
