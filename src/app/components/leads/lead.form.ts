import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LeadForm {
  static createLead(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      telefone: ['', [Validators.maxLength(20)]],
      origemId: ['']
    });
  }

  static createHistory(fb: FormBuilder): FormGroup {
    return fb.group({
      canal: ['', [Validators.required, Validators.maxLength(100)]],
      resumo: ['', [Validators.required]]
    });
  }
}
