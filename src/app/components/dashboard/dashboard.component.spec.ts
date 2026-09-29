import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { EventEmitter } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/api/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardMetricas, DashboardWidgetConfig, WIDGETS_DEFAULT } from '../../models/dashboard.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
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
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
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
        { provide: DialogService, useValue: dialogServiceSpy },
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

  it('should handle error when metricas request fails', () => {
    dashboardServiceSpy.obterMetricas.and.returnValue(throwError(() => new Error('Network error')));
    component.carregarDados();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Não foi possível carregar as métricas do dashboard.');
  });

  it('should order widgets correctly according to ordem property', () => {
    component.widgets = [
      { id: 'b', titulo: 'B', icone: 'icon-b', largura: 'half', visivel: true, ordem: 2 },
      { id: 'a', titulo: 'A', icone: 'icon-a', largura: 'full', visivel: true, ordem: 1 },
      { id: 'c', titulo: 'C', icone: 'icon-c', largura: 'half', visivel: true, ordem: 3 }
    ];

    const ordenados = component.widgetsOrdenados;
    expect(ordenados[0].id).toBe('a');
    expect(ordenados[1].id).toBe('b');
    expect(ordenados[2].id).toBe('c');
  });

  it('should merge saved preferences when preferences request succeeds with valid json', () => {
    const savedConfig: DashboardWidgetConfig[] = [
      { id: 'atalhos_rapidos', titulo: 'Atalhos', icone: 'bolt', largura: 'full', visivel: false, ordem: 1 }
    ];
    dashboardServiceSpy.obterPreferencias.and.returnValue(of({
      usuarioId: 'u1',
      layoutJson: JSON.stringify(savedConfig),
      atualizadoEm: '2026-09-22T00:00:00Z'
    }));

    component.carregarDados();

    const atalhos = component.widgets.find(w => w.id === 'atalhos_rapidos');
    expect(atalhos?.visivel).toBeFalse();
  });

  it('should fallback to default widgets when layoutJson is malformed', () => {
    dashboardServiceSpy.obterPreferencias.and.returnValue(of({
      usuarioId: 'u1',
      layoutJson: 'invalid-json-string',
      atualizadoEm: '2026-09-22T00:00:00Z'
    }));

    component.carregarDados();

    expect(component.widgets.length).toBe(WIDGETS_DEFAULT.length);
    expect(component.loading).toBeFalse();
  });

  it('should fallback to default widgets when preferences request fails', () => {
    dashboardServiceSpy.obterPreferencias.and.returnValue(throwError(() => new Error('Failed to load prefs')));

    component.carregarDados();

    expect(component.widgets.length).toBe(WIDGETS_DEFAULT.length);
    expect(component.loading).toBeFalse();
  });

  it('should open personalization modal and handle salvar event successfully', () => {
    const salvarEmitter = new EventEmitter<DashboardWidgetConfig[]>();
    const restaurarEmitter = new EventEmitter<void>();
    const onCloseSpy = jasmine.createSpy('onClose');

    const mockRef: any = {
      instance: {
        salvar: salvarEmitter,
        restaurar: restaurarEmitter,
        onClose: onCloseSpy,
        salvando: false
      }
    };
    dialogServiceSpy.open.and.returnValue(mockRef);

    component.abrirModalPersonalizar();
    expect(dialogServiceSpy.open).toHaveBeenCalled();

    const novosWidgets = [...WIDGETS_DEFAULT].reverse();
    salvarEmitter.emit(novosWidgets);

    expect(dashboardServiceSpy.salvarPreferencias).toHaveBeenCalledWith(JSON.stringify(novosWidgets));
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Layout do painel personalizado com sucesso!');
    expect(onCloseSpy).toHaveBeenCalled();
    expect(component.salvandoPreferencias).toBeFalse();
  });

  it('should handle error when salvarPreferencias fails', () => {
    const salvarEmitter = new EventEmitter<DashboardWidgetConfig[]>();
    const mockRef: any = {
      instance: {
        salvar: salvarEmitter,
        restaurar: new EventEmitter<void>(),
        onClose: jasmine.createSpy('onClose'),
        salvando: false
      }
    };
    dialogServiceSpy.open.and.returnValue(mockRef);
    dashboardServiceSpy.salvarPreferencias.and.returnValue(throwError(() => new Error('Save error')));

    component.abrirModalPersonalizar();
    salvarEmitter.emit(WIDGETS_DEFAULT);

    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Erro ao salvar preferências do painel.');
    expect(component.salvandoPreferencias).toBeFalse();
    expect(mockRef.instance.salvando).toBeFalse();
  });

  it('should handle restaurarPadrao event successfully in modal', () => {
    const restaurarEmitter = new EventEmitter<void>();
    const onCloseSpy = jasmine.createSpy('onClose');
    const mockRef: any = {
      instance: {
        salvar: new EventEmitter<any>(),
        restaurar: restaurarEmitter,
        onClose: onCloseSpy,
        salvando: false,
        tempWidgets: []
      }
    };
    dialogServiceSpy.open.and.returnValue(mockRef);

    component.abrirModalPersonalizar();
    restaurarEmitter.emit();

    expect(dashboardServiceSpy.salvarPreferencias).toHaveBeenCalled();
    expect(mockRef.instance.tempWidgets.length).toBe(WIDGETS_DEFAULT.length);
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Layout padrão restaurado com sucesso!');
    expect(onCloseSpy).toHaveBeenCalled();
  });

  it('should handle error when restaurarPadrao fails in modal', () => {
    const restaurarEmitter = new EventEmitter<void>();
    const mockRef: any = {
      instance: {
        salvar: new EventEmitter<any>(),
        restaurar: restaurarEmitter,
        onClose: jasmine.createSpy('onClose'),
        salvando: false,
        tempWidgets: []
      }
    };
    dialogServiceSpy.open.and.returnValue(mockRef);
    dashboardServiceSpy.salvarPreferencias.and.returnValue(throwError(() => new Error('Restore error')));

    component.abrirModalPersonalizar();
    restaurarEmitter.emit();

    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Erro ao restaurar layout padrão.');
    expect(component.salvandoPreferencias).toBeFalse();
    expect(mockRef.instance.salvando).toBeFalse();
  });

  it('should open create project modal and reload data on creation', () => {
    const projectCreatedEmitter = new EventEmitter<any>();
    const mockProjRef: any = {
      instance: {
        projectCreated: projectCreatedEmitter
      }
    };
    dialogServiceSpy.open.and.returnValue(mockProjRef);
    spyOn(component, 'carregarDados');

    component.abrirModalCriarProjeto();
    expect(dialogServiceSpy.open).toHaveBeenCalled();

    projectCreatedEmitter.emit({ id: 'new-p' });
    expect(component.carregarDados).toHaveBeenCalled();
  });

  it('should open create lead modal and reload data on save', () => {
    const savedEmitter = new EventEmitter<any>();
    const mockLeadRef: any = {
      instance: {
        saved: savedEmitter
      }
    };
    dialogServiceSpy.open.and.returnValue(mockLeadRef);
    spyOn(component, 'carregarDados');

    component.abrirModalCriarLead();
    expect(dialogServiceSpy.open).toHaveBeenCalled();

    savedEmitter.emit({ id: 'new-l' });
    expect(component.carregarDados).toHaveBeenCalled();
  });
});
