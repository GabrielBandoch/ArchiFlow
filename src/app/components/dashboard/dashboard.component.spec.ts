import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent, WIDGETS_DEFAULT } from './dashboard.component';
import { DashboardService } from '../../core/api/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardMetricas, PreferenciaDashboard } from '../../models/dashboard.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockMetricas: DashboardMetricas = {
    kpis: {
      totalProjetosAtivos: 3,
      totalProjetosConcluidos: 2,
      totalLeadsAtivos: 5,
      totalLeadsConvertidos: 3,
      taxaConversaoLeads: 37.5,
      totalClientes: 4,
      totalPropostas: 6,
      valorTotalPropostas: 45000,
      valorMedioProposta: 7500
    },
    projetosPorStatus: [
      { status: 'Briefing', nomeStatus: 'Briefing', quantidade: 1, percentual: 20 },
      { status: 'Desenvolvimento', nomeStatus: 'Desenvolvimento', quantidade: 2, percentual: 40 },
      { status: 'Concluido', nomeStatus: 'Concluído', quantidade: 2, percentual: 40 }
    ],
    projetosPorTipo: [
      { tipo: 'Residencial', nomeTipo: 'Residencial', quantidade: 3, percentual: 60 },
      { tipo: 'Comercial', nomeTipo: 'Comercial', quantidade: 2, percentual: 40 }
    ],
    leadsPorStatus: [
      { status: 'Novo', nomeStatus: 'Novo Lead', quantidade: 2, percentual: 25 },
      { status: 'Convertido', nomeStatus: 'Convertido em Cliente', quantidade: 3, percentual: 37.5 }
    ],
    leadsPorOrigem: [
      { origem: 'Instagram', quantidade: 4, percentual: 50 },
      { origem: 'Indicação', quantidade: 4, percentual: 50 }
    ],
    propostasMensais: [
      { mesAno: '2026-04', rotuloMes: 'Abr/26', quantidade: 1, valorTotal: 7000 },
      { mesAno: '2026-05', rotuloMes: 'Mai/26', quantidade: 2, valorTotal: 15000 }
    ],
    projetosRecentes: [
      {
        id: 'p1',
        nome: 'Casa Modelo',
        clienteNome: 'Cliente X',
        status: 'Desenvolvimento',
        tipo: 'Residencial',
        metragemTotal: 200,
        totalEtapas: 4,
        etapasConcluidas: 2,
        progressoPercentual: 50
      }
    ],
    leadsRecentes: [
      {
        id: 'l1',
        nome: 'Lead Y',
        email: 'lead@y.com',
        status: 'Novo Lead',
        origemNome: 'Instagram',
        criadoEm: '2026-09-22T00:00:00Z'
      }
    ],
    propostasRecentes: [
      {
        id: 'pr1',
        titulo: 'Proposta Residencial',
        codigo: 'PROP-01',
        clienteOuLeadNome: 'Cliente X',
        metragemQuadrada: 200,
        valorFinal: 12000,
        status: 'Enviada',
        criadoEm: '2026-09-22T00:00:00Z'
      }
    ]
  };

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'obterMetricas',
      'obterPreferencias',
      'salvarPreferencias'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of({ id: 'u1', nome: 'Gabriel', email: 'gabriel@teste.com', role: 'Arquiteto' })
    });
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info']);

    dashboardServiceSpy.obterMetricas.and.returnValue(of(mockMetricas));
    dashboardServiceSpy.obterPreferencias.and.returnValue(of(null));
    dashboardServiceSpy.salvarPreferencias.and.returnValue(
      of({ usuarioId: 'u1', layoutJson: '[]', atualizadoEm: '2026-09-22T00:00:00Z' })
    );

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard component and load data', () => {
    expect(component).toBeTruthy();
    expect(component.metricas).toEqual(mockMetricas);
    expect(component.loading).toBeFalse();
    expect(dashboardServiceSpy.obterMetricas).toHaveBeenCalled();
  });

  it('should open and close personalization modal', () => {
    expect(component.modalPersonalizarAberto).toBeFalse();
    component.abrirModalPersonalizar();
    expect(component.modalPersonalizarAberto).toBeTrue();
    component.fecharModalPersonalizar();
    expect(component.modalPersonalizarAberto).toBeFalse();
  });

  it('should reorder widgets when moverWidget is called', () => {
    const firstWidgetId = component.widgets[0].id;
    const secondWidgetId = component.widgets[1].id;

    component.moverWidget(0, 'down');

    expect(component.widgets[0].id).toBe(secondWidgetId);
    expect(component.widgets[1].id).toBe(firstWidgetId);
  });

  it('should toggle widget visibility', () => {
    const widget = component.widgets[0];
    const initialVisibility = widget.visivel;

    component.toggleVisibilidade(widget);
    expect(widget.visivel).toBe(!initialVisibility);
  });

  it('should save customized preferences to database', () => {
    component.salvarPreferencias();

    expect(dashboardServiceSpy.salvarPreferencias).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      jasmine.stringMatching(/Personalização do painel salva com sucesso/)
    );
  });

  it('should restore default layout and save to database', () => {
    component.restaurarPadrao();

    expect(component.widgets.length).toBe(WIDGETS_DEFAULT.length);
    expect(dashboardServiceSpy.salvarPreferencias).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      jasmine.stringMatching(/Layout padrão restaurado/)
    );
  });

  it('should compute SVG donut segments correctly', () => {
    const segments = component.calcularSvgDonutSegments(mockMetricas.projetosPorStatus);
    expect(segments.length).toBeGreaterThan(0);
    expect(segments[0].path).toContain('M');
  });
});
