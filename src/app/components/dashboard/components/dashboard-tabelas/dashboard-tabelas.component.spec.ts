import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardTabelasComponent } from './dashboard-tabelas.component';
import { DashboardMetricas } from '../../../../models/dashboard.model';

describe('DashboardTabelasComponent', () => {
  let component: DashboardTabelasComponent;
  let fixture: ComponentFixture<DashboardTabelasComponent>;

  const mockMetricas: DashboardMetricas = {
    kpis: {
      totalProjetosAtivos: 1,
      totalProjetosConcluidos: 0,
      totalLeadsAtivos: 1,
      totalLeadsConvertidos: 0,
      taxaConversaoLeads: 0,
      totalClientes: 1,
      totalPropostas: 1,
      valorTotalPropostas: 25000,
      valorMedioProposta: 25000
    },
    projetosPorStatus: [],
    projetosPorTipo: [],
    leadsPorStatus: [],
    leadsPorOrigem: [],
    propostasMensais: [],
    projetosRecentes: [
      {
        id: '1',
        nome: 'Residência Alpha',
        clienteNome: 'João Silva',
        tipo: 'Residencial',
        status: 'EstudoPreliminar',
        metragemTotal: 250,
        totalEtapas: 4,
        etapasConcluidas: 1,
        progressoPercentual: 25,
        dataInicio: '2026-09-01'
      }
    ],
    leadsRecentes: [
      {
        id: '1',
        nome: 'Carlos Souza',
        email: 'carlos@email.com',
        telefone: '1199999999',
        status: 'Novo',
        origemNome: 'Site',
        criadoEm: '2026-09-20'
      }
    ],
    propostasRecentes: [
      {
        id: '1',
        titulo: 'Proposta Reforma',
        codigo: 'PROP-001',
        clienteOuLeadNome: 'Maria Santos',
        metragemQuadrada: 120,
        valorFinal: 25000,
        status: 'Enviada',
        criadoEm: '2026-09-25'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTabelasComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTabelasComponent);
    component = fixture.componentInstance;
    component.widgetId = 'tabela_projetos_recentes';
    component.metricas = mockMetricas;
    component.formatarMoeda = (val: number) => `R$ ${val}`;
    fixture.detectChanges();
  });

  it('should create tables component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct badge classes for project status', () => {
    expect(component.obterBadgeStatusProjeto('EstudoPreliminar')).toBe('status-blue');
    expect(component.obterBadgeStatusProjeto('Anteprojeto')).toBe('status-purple');
    expect(component.obterBadgeStatusProjeto('Concluido')).toBe('status-green');
    expect(component.obterBadgeStatusProjeto('Desconhecido')).toBe('status-neutral');
  });

  it('should return correct badge classes for proposal status', () => {
    expect(component.obterBadgeStatusProposta('Aprovada')).toBe('status-green');
    expect(component.obterBadgeStatusProposta('Enviada')).toBe('status-blue');
    expect(component.obterBadgeStatusProposta('Rejeitada')).toBe('status-red');
    expect(component.obterBadgeStatusProposta('Outro')).toBe('status-neutral');
  });
});
