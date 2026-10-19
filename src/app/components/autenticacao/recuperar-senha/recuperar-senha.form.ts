import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class RecuperarSenhaForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
