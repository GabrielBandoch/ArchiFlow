import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurarAgendaModalComponent } from './configurar-agenda-modal.component';
import { AgendaService } from '../../../core/api/agenda/agenda.service';
import { NotificationService } from '../../../core/services/notification.service';
import { of, throwError } from 'rxjs';

describe('ConfigurarAgendaModalComponent', () => {
  let component: ConfigurarAgendaModalComponent;
  let fixture: ComponentFixture<ConfigurarAgendaModalComponent>;
  let agendaServiceSpy: jasmine.SpyObj<AgendaService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockConfig = {
    emailAgendaEmpresa: 'agenda@estudio.com',
    googleCalendarId: 'estudio_id@group.calendar.google.com',
    nomeAgenda: 'Agenda do Estúdio',
    sincronizacaoAutomaticaAtiva: true,
    linkEmbedGoogleCalendar: 'https://calendar.google.com/calendar/embed?src=agenda@estudio.com'
  };

  beforeEach(async () => {
    agendaServiceSpy = jasmine.createSpyObj('AgendaService', [
      'obterConfiguracaoAgendaEmpresa',
      'salvarConfiguracaoAgendaEmpresa',
      'obterUrlOAuth',
      'conectarOAuth',
      'desconectarOAuth'
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'error', 'info']);

    agendaServiceSpy.obterConfiguracaoAgendaEmpresa.and.returnValue(of(mockConfig as any));
    agendaServiceSpy.salvarConfiguracaoAgendaEmpresa.and.returnValue(of(mockConfig as any));

    await TestBed.configureTestingModule({
      imports: [ConfigurarAgendaModalComponent],
      providers: [
        { provide: AgendaService, useValue: agendaServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurarAgendaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e carregar configuracao existente', () => {
    expect(component).toBeTruthy();
    expect(agendaServiceSpy.obterConfiguracaoAgendaEmpresa).toHaveBeenCalled();
    expect(component.form.get('googleCalendarId')?.value).toBe('estudio_id@group.calendar.google.com');
  });

  it('deve salvar a configuracao ao submeter form valido e emitir notificacao de sucesso', () => {
    spyOn(component.saved, 'emit');
    spyOn(component, 'onClose');

    component.form.patchValue({
      googleCalendarId: 'novo-id',
      nomeAgenda: 'Agenda Atualizada',
      sincronizacaoAutomaticaAtiva: true
    });

    component.onSubmit();

    expect(agendaServiceSpy.salvarConfiguracaoAgendaEmpresa).toHaveBeenCalledWith(jasmine.objectContaining({
      googleCalendarId: 'novo-id'
    }));
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Configurações da agenda corporativa salvas com sucesso!');
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('deve exibir warning se tentar submeter form invalido', () => {
    component.form.patchValue({ googleCalendarId: '' });

    component.onSubmit();

    expect(agendaServiceSpy.salvarConfiguracaoAgendaEmpresa).not.toHaveBeenCalled();
    expect(notificationServiceSpy.warning).toHaveBeenCalledWith('Informe o ID ou e-mail da Agenda do Google.');
  });

  it('deve disparar notificationService.warning em caso de erro da API', () => {
    agendaServiceSpy.salvarConfiguracaoAgendaEmpresa.and.returnValue(
      throwError(() => ({ error: { message: 'Erro ao salvar configurações. Verifique suas permissões.' } }))
    );

    component.form.patchValue({
      googleCalendarId: 'novo-id'
    });

    component.onSubmit();

    expect(notificationServiceSpy.warning).toHaveBeenCalledWith('Erro ao salvar configurações. Verifique suas permissões.');
    expect(component.salvando).toBeFalse();
  });

  it('deve emitir close ao fechar', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
