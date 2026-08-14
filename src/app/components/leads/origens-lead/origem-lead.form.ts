import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class OrigemLeadForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
}
