import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaComponent } from './agenda.component';
import { AgendaService } from '../../core/api/agenda/agenda.service';
import { of } from 'rxjs';
import { Compromisso, TiposCompromisso } from '../../models/agenda.model';

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;
  let agendaServiceSpy: jasmine.SpyObj<AgendaService>;

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
      'exportarIcsUrl'
    ]);

    agendaServiceSpy.listar.and.returnValue(of(mockCompromissos));
    agendaServiceSpy.alterarStatus.and.returnValue(of(mockCompromissos[0]));
    agendaServiceSpy.excluir.and.returnValue(of(void 0));
    agendaServiceSpy.exportarIcsUrl.and.returnValue('http://localhost:5000/api/agenda/exportar-ics');

    await TestBed.configureTestingModule({
      imports: [AgendaComponent],
      providers: [
        { provide: AgendaService, useValue: agendaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
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
    expect(component.modalCompromissoAberto).toBeTrue();
    expect(component.compromissoSelecionado).toBeNull();
    expect(component.dataSelecionadaParaNovo).toBe('2026-10-20');
  });

  it('deve abrir modal para editar compromisso existente', () => {
    const comp = mockCompromissos[0];
    component.abrirModalEditar(comp);
    expect(component.modalCompromissoAberto).toBeTrue();
    expect(component.compromissoSelecionado).toBe(comp);
  });

  it('deve alternar status do compromisso (marcar como concluído / reabrir)', () => {
    const comp = { ...mockCompromissos[0], status: 'Agendado' as const };
    component.marcarComoConcluido(comp);
    expect(agendaServiceSpy.alterarStatus).toHaveBeenCalledWith('comp-1', { status: 'Concluido' });
  });

  it('deve abrir e confirmar modal de exclusão', () => {
    const comp = mockCompromissos[0];
    component.abrirModalExcluir(comp);
    expect(component.modalExcluirAberto).toBeTrue();
    expect(component.compromissoExcluir).toBe(comp);

    component.confirmarExcluir();
    expect(agendaServiceSpy.excluir).toHaveBeenCalledWith('comp-1');
    expect(component.modalExcluirAberto).toBeFalse();
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
});
