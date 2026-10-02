import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompromissoModalComponent } from './compromisso-modal.component';
import { AgendaService } from '../../../core/api/agenda/agenda.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { LeadService } from '../../../core/api/leads/lead.service';
import { NotificationService } from '../../../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { Compromisso, TiposCompromisso } from '../../../models/agenda.model';

describe('CompromissoModalComponent', () => {
  let component: CompromissoModalComponent;
  let fixture: ComponentFixture<CompromissoModalComponent>;
  let agendaServiceSpy: jasmine.SpyObj<AgendaService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let leadServiceSpy: jasmine.SpyObj<LeadService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockCompromisso: Compromisso = {
    id: 'comp-1',
    escritorioId: 'esc-1',
    titulo: 'Reunião Inicial',
    tipo: TiposCompromisso.ReuniaoCliente,
    status: 'Agendado',
    dataHoraInicio: '2026-10-05T09:00:00',
    dataHoraFim: '2026-10-05T10:00:00',
    local: 'Escritório',
    linkGoogleMeet: 'https://meet.google.com/abc-defg-hij',
    linkGoogleCalendarWeb: 'https://calendar.google.com/calendar/render?action=TEMPLATE',
    criadoEm: '2026-10-01T00:00:00'
  };

  beforeEach(async () => {
    agendaServiceSpy = jasmine.createSpyObj('AgendaService', ['criar', 'atualizar']);
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['obterTodos']);
    leadServiceSpy = jasmine.createSpyObj('LeadService', ['obterTodos']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    projetoServiceSpy.obterTodos.and.returnValue(of([{ id: 'proj-1', nome: 'Residência Vista Verde' } as any]));
    clienteServiceSpy.obterTodos.and.returnValue(of([{ id: 'cli-1', nome: 'Roberto Carlos' } as any]));
    leadServiceSpy.obterTodos.and.returnValue(of([{ id: 'lead-1', nome: 'Mariana Silva' } as any]));

    await TestBed.configureTestingModule({
      imports: [CompromissoModalComponent],
      providers: [
        { provide: AgendaService, useValue: agendaServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompromissoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
    expect(component.projetosOptions.length).toBe(2);
    expect(component.clientesOptions.length).toBe(2);
  });

  it('deve validar campos obrigatórios no submit', () => {
    component.form.patchValue({
      titulo: '',
      data: '',
      horaInicio: '',
      horaFim: ''
    });

    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(agendaServiceSpy.criar).not.toHaveBeenCalled();
  });

  it('deve impedir cadastro se hora final for menor ou igual à hora inicial', () => {
    component.form.patchValue({
      titulo: 'Visita Técnica',
      data: '2026-10-05',
      horaInicio: '10:00',
      horaFim: '09:00'
    });

    component.onSubmit();

    expect(component.errorMessage).toContain('O horário de término deve ser posterior');
    expect(agendaServiceSpy.criar).not.toHaveBeenCalled();
  });

  it('deve chamar agendaService.criar ao submeter formulário válido de novo compromisso', () => {
    agendaServiceSpy.criar.and.returnValue(of(mockCompromisso));
    spyOn(component.saved, 'emit');
    spyOn(component.close, 'emit');

    component.form.patchValue({
      titulo: 'Reunião de Briefing',
      tipo: TiposCompromisso.ReuniaoCliente,
      data: '2026-10-05',
      horaInicio: '09:00',
      horaFim: '10:00',
      local: 'Sala de Reuniões',
      descricao: 'Alinhar escopo',
      gerarGoogleMeet: true
    });

    component.onSubmit();

    expect(agendaServiceSpy.criar).toHaveBeenCalled();
    expect(component.saved.emit).toHaveBeenCalledWith(mockCompromisso);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve preencher o formulário para edição ao receber compromissoParaEdicao', () => {
    component.compromissoParaEdicao = mockCompromisso;
    component.ngOnChanges({
      compromissoParaEdicao: {
        currentValue: mockCompromisso,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.isEditing).toBeTrue();
    expect(component.form.get('titulo')?.value).toBe('Reunião Inicial');
    expect(component.form.get('local')?.value).toBe('Escritório');
  });

  it('deve chamar agendaService.atualizar ao salvar edição', () => {
    component.compromissoParaEdicao = mockCompromisso;
    agendaServiceSpy.atualizar.and.returnValue(of({ ...mockCompromisso, titulo: 'Reunião Atualizada' }));
    spyOn(component.saved, 'emit');

    component.form.patchValue({
      titulo: 'Reunião Atualizada',
      tipo: TiposCompromisso.ReuniaoCliente,
      data: '2026-10-05',
      horaInicio: '09:00',
      horaFim: '10:00'
    });

    component.onSubmit();

    expect(agendaServiceSpy.atualizar).toHaveBeenCalledWith('comp-1', jasmine.objectContaining({
      titulo: 'Reunião Atualizada'
    }));
    expect(component.saved.emit).toHaveBeenCalled();
  });

  it('deve exibir mensagem de erro se a API retornar erro', () => {
    agendaServiceSpy.criar.and.returnValue(throwError(() => ({ error: { message: 'Erro na API' } })));

    component.form.patchValue({
      titulo: 'Visita',
      tipo: TiposCompromisso.VisitaObra,
      data: '2026-10-05',
      horaInicio: '09:00',
      horaFim: '10:00'
    });

    component.onSubmit();

    expect(component.saving).toBeFalse();
    expect(component.errorMessage).toBe('Erro na API');
  });

  it('deve abrir link do Google Agenda', () => {
    spyOn(window, 'open');
    component.compromissoParaEdicao = mockCompromisso;
    component.abrirGoogleAgenda();
    expect(window.open).toHaveBeenCalledWith(mockCompromisso.linkGoogleCalendarWeb, '_blank');
  });

  it('deve abrir link do Google Meet', () => {
    spyOn(window, 'open');
    component.compromissoParaEdicao = mockCompromisso;
    component.abrirGoogleMeet();
    expect(window.open).toHaveBeenCalledWith(mockCompromisso.linkGoogleMeet, '_blank');
  });
});
