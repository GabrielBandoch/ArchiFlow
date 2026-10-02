import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaComponent } from './agenda.component';
import { AgendaService } from '../../core/api/agenda/agenda.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { Compromisso, TiposCompromisso } from '../../models/agenda.model';

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;
  let agendaServiceSpy: jasmine.SpyObj<AgendaService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockCompromissos: Compromisso[] = [
    {
      id: 'comp-1',
      escritorioId: 'esc-1',
      titulo: 'Reunião com Roberto',
      tipo: TiposCompromisso.ReuniaoCliente,
      status: 'Agendado',
      dataHoraInicio: new Date().toISOString(),
      dataHoraFim: new Date(Date.now() + 3600000).toISOString(),
      local: 'Escritório',
      linkGoogleMeet: 'https://meet.google.com/test-meet',
      linkGoogleCalendarWeb: 'https://calendar.google.com/calendar/render',
      criadoEm: new Date().toISOString()
    },
    {
      id: 'comp-2',
      escritorioId: 'esc-1',
      titulo: 'Visita Obra Condomínio',
      tipo: TiposCompromisso.VisitaObra,
      status: 'Concluido',
      dataHoraInicio: new Date().toISOString(),
      dataHoraFim: new Date(Date.now() + 7200000).toISOString(),
      local: 'Obra Lote 12',
      linkGoogleCalendarWeb: 'https://calendar.google.com/calendar/render',
      criadoEm: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    agendaServiceSpy = jasmine.createSpyObj('AgendaService', [
      'listar',
      'alterarStatus',
      'excluir',
      'exportarIcsUrl',
      'obterConfiguracaoAgendaEmpresa'
    ]);

    agendaServiceSpy.listar.and.returnValue(of(mockCompromissos));
    agendaServiceSpy.alterarStatus.and.returnValue(of(mockCompromissos[0]));
    agendaServiceSpy.excluir.and.returnValue(of(void 0));
    agendaServiceSpy.exportarIcsUrl.and.returnValue('http://localhost:5000/api/agenda/exportar-ics');
    agendaServiceSpy.obterConfiguracaoAgendaEmpresa.and.returnValue(of({
      emailAgendaEmpresa: 'agenda@estudio.com',
      googleCalendarId: 'estudio_id',
      nomeAgenda: 'Agenda do Estúdio',
      sincronizacaoAutomaticaAtiva: true,
      linkEmbedGoogleCalendar: 'https://calendar.google.com/test-embed'
    } as any));

    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: { id: 'usr-1', nome: 'Marina', email: 'marina@duna.com', perfil: 'Administrador' }
    });

    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    dialogServiceSpy.open.and.returnValue({
      instance: {
        saved: new EventEmitter<any>(),
        confirm: new EventEmitter<any>(),
        close: new EventEmitter<any>()
      }
    } as any);

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [AgendaComponent],
      providers: [
        { provide: AgendaService, useValue: agendaServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
    expect(component.podeConfigurarAgenda).toBeTrue();
  });

  it('deve carregar os compromissos ao iniciar e preencher a grade de dias', () => {
    expect(agendaServiceSpy.listar).toHaveBeenCalled();
    expect(component.compromissos.length).toBe(2);
    expect(component.diasMes.length).toBeGreaterThan(27);
    expect(component.diasMes.length % 7).toBe(0);
  });

  it('deve calcular as métricas do mês corretamente', () => {
    expect(component.totalCompromissosMes).toBe(2);
    expect(component.totalReunioes).toBe(1);
    expect(component.totalVisitasObras).toBe(1);
    expect(component.totalConcluidos).toBe(1);
  });

  it('deve alternar os modos de visualização', () => {
    expect(component.modoVisualizacao).toBe('calendario');
    component.modoVisualizacao = 'lista';
    expect(component.modoVisualizacao).toBe('lista');
  });

  it('deve navegar entre meses', () => {
    const mesInicial = component.dataReferencia.getMonth();
    component.proximoMes();
    expect(component.dataReferencia.getMonth()).toBe((mesInicial + 1) % 12);

    component.mesAnterior();
    expect(component.dataReferencia.getMonth()).toBe(mesInicial);

    component.irParaHoje();
    expect(component.dataReferencia.toDateString()).toBe(new Date().toDateString());
  });

  it('deve filtrar compromissos por busca, tipo e status', () => {
    component.termoBusca = 'Roberto';
    expect(component.compromissosFiltrados.length).toBe(1);
    expect(component.compromissosFiltrados[0].id).toBe('comp-1');

    component.termoBusca = '';
    component.filtroTipo = TiposCompromisso.VisitaObra;
    expect(component.compromissosFiltrados.length).toBe(1);
    expect(component.compromissosFiltrados[0].id).toBe('comp-2');

    component.filtroTipo = 'todos';
    component.filtroStatus = 'Concluido';
    expect(component.compromissosFiltrados.length).toBe(1);
    expect(component.compromissosFiltrados[0].id).toBe('comp-2');
  });

  it('deve abrir modal para novo compromisso com data específica', () => {
    const dataAlvo = new Date(2026, 9, 20);
    component.abrirModalNovo(dataAlvo);
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });

  it('deve abrir modal para editar compromisso existente', () => {
    const comp = mockCompromissos[0];
    component.abrirModalEditar(comp);
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });

  it('deve alternar status do compromisso (marcar como concluído / reabrir)', () => {
    const comp = { ...mockCompromissos[0], status: 'Agendado' as const };
    component.marcarComoConcluido(comp);
    expect(agendaServiceSpy.alterarStatus).toHaveBeenCalledWith('comp-1', { status: 'Concluido' });
  });

  it('deve abrir e confirmar modal de exclusão', () => {
    const confirmEmitter = new EventEmitter<any>();
    dialogServiceSpy.open.and.returnValue({
      instance: {
        confirm: confirmEmitter,
        saved: new EventEmitter<any>(),
        close: new EventEmitter<any>()
      }
    } as any);

    const comp = mockCompromissos[0];
    component.abrirModalExcluir(comp);
    expect(dialogServiceSpy.open).toHaveBeenCalled();

    confirmEmitter.emit();
    expect(agendaServiceSpy.excluir).toHaveBeenCalledWith('comp-1');
  });

  it('deve abrir link do Google Agenda', () => {
    spyOn(window, 'open');
    component.abrirGoogleAgenda(mockCompromissos[0]);
    expect(window.open).toHaveBeenCalledWith(mockCompromissos[0].linkGoogleCalendarWeb, '_blank');
  });

  it('deve abrir link do Google Meet', () => {
    spyOn(window, 'open');
    component.abrirMeet(mockCompromissos[0]);
    expect(window.open).toHaveBeenCalledWith(mockCompromissos[0].linkGoogleMeet!, '_blank');
  });

  it('deve baixar o arquivo de calendário .ics', () => {
    spyOn(window, 'open');
    component.baixarIcs();
    expect(agendaServiceSpy.exportarIcsUrl).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('http://localhost:5000/api/agenda/exportar-ics', '_blank');
  });

  it('deve carregar configuracao da agenda da empresa e abrir modal de configuracao', () => {
    expect(component.configuracaoEmpresa).toBeTruthy();
    expect(component.configuracaoEmpresa?.emailAgendaEmpresa).toBe('agenda@estudio.com');

    component.abrirModalConfiguracao();
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });

  it('deve abrir link compartilhado do Google Calendar da empresa', () => {
    spyOn(window, 'open');
    component.abrirGoogleAgendaEmpresa();
    expect(window.open).toHaveBeenCalledWith('https://calendar.google.com/test-embed', '_blank');
  });
});
