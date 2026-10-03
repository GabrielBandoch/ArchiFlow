import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposCompromisso } from '../../models/agenda.model';

export class AgendaForm {
  static createCompromisso(fb: FormBuilder): FormGroup {
    return fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      tipo: [TiposCompromisso.ReuniaoCliente, [Validators.required]],
      status: ['Agendado', [Validators.required]],
      data: ['', [Validators.required]],
      horaInicio: ['09:00', [Validators.required]],
      horaFim: ['10:00', [Validators.required]],
      local: ['', [Validators.maxLength(300)]],
      descricao: ['', [Validators.maxLength(2000)]],
      projetoId: [''],
      clienteId: [''],
      leadId: [''],
      usuarioId: [''],
      gerarGoogleMeet: [true],
      linkGoogleMeet: ['']
    });
  }

  static createConfiguracao(fb: FormBuilder): FormGroup {
    return fb.group({
      googleCalendarId: ['', [Validators.required]],
      chaveGoogleServiceAccountJson: [''],
      nomeAgenda: ['Agenda Oficial do Escritório', [Validators.maxLength(200)]],
      sincronizarAutomaticamente: [true]
    });
  }
}
