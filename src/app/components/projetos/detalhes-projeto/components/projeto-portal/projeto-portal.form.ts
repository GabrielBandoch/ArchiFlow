import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ProjetoPortalForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cargo: [''],
      telefone: [''],
      enviarEmailAgora: [false]
    });
  }
}
