import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgendaService } from './agenda.service';
import { environment } from '../../../../environments/environment';
import { Compromisso } from '../../../models/agenda.model';

describe('AgendaService', () => {
  let service: AgendaService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/agenda`;

  const mockCompromisso: Compromisso = {
    id: 'cmp-1',
    escritorioId: 'esc-1',
    titulo: 'Reunião Inicial',
    tipo: 'ReuniaoCliente',
    status: 'Agendado',
    dataHoraInicio: '2026-10-15T14:00:00Z',
    dataHoraFim: '2026-10-15T15:00:00Z',
    linkGoogleCalendarWeb: 'https://calendar.google.com/test',
    criadoEm: '2026-10-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AgendaService]
    });
    service = TestBed.inject(AgendaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve obter compromissos por período', () => {
    service.obterPorPeriodo('2026-10-01', '2026-10-31').subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].titulo).toBe('Reunião Inicial');
    });

    const req = httpMock.expectOne(`${baseUrl}?inicio=2026-10-01&fim=2026-10-31`);
    expect(req.request.method).toBe('GET');
    req.flush([mockCompromisso]);
  });

  it('deve criar novo compromisso', () => {
    const cmd = {
      titulo: 'Novo Evento',
      dataHoraInicio: '2026-10-20T10:00:00Z',
      dataHoraFim: '2026-10-20T11:00:00Z'
    };

    service.criar(cmd).subscribe(res => {
      expect(res.id).toBe('cmp-1');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockCompromisso);
  });

  it('deve alterar status do compromisso', () => {
    service.alterarStatus('cmp-1', { status: 'Concluido' }).subscribe(res => {
      expect(res.status).toBe('Concluido');
    });

    const req = httpMock.expectOne(`${baseUrl}/cmp-1/status`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...mockCompromisso, status: 'Concluido' });
  });

  it('deve excluir compromisso', () => {
    service.excluir('cmp-1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/cmp-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  // --- FASE 1 RED: ESPECIFICAÇÃO DE TESTES PARA AGENDA DA EMPRESA (GOOGLE CALENDAR) ---
  it('[RED] deve obter configuração da agenda corporativa do escritório', () => {
    service.obterConfiguracaoAgendaEmpresa().subscribe(config => {
      expect(config.emailAgendaEmpresa).toBe('agenda@estudio.com');
      expect(config.sincronizacaoAutomaticaAtiva).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/configuracao`);
    expect(req.request.method).toBe('GET');
    req.flush({
      emailAgendaEmpresa: 'agenda@estudio.com',
      googleCalendarId: 'estudio_calendar_id@group.calendar.google.com',
      nomeAgenda: 'Agenda do Estúdio',
      sincronizacaoAutomaticaAtiva: true
    });
  });

  it('[RED] deve salvar configuração da agenda corporativa do escritório', () => {
    const payload = {
      emailAgendaEmpresa: 'agenda@estudio.com',
      googleCalendarId: 'estudio_calendar_id@group.calendar.google.com',
      nomeAgenda: 'Agenda Principal ArchiFlow',
      sincronizacaoAutomaticaAtiva: true
    };

    service.salvarConfiguracaoAgendaEmpresa(payload).subscribe(res => {
      expect(res.sucesso).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/configuracao`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ sucesso: true });
  });

  it('[RED] deve obter link de visualização compartilhada da agenda do Google', () => {
    service.obterLinkCompartilhadoGoogleAgenda().subscribe(res => {
      expect(res.linkEmbed).toContain('calendar.google.com/calendar/embed');
    });

    const req = httpMock.expectOne(`${baseUrl}/google/link-compartilhado`);
    expect(req.request.method).toBe('GET');
    req.flush({ linkEmbed: 'https://calendar.google.com/calendar/embed?src=agenda@estudio.com' });
  });
});
