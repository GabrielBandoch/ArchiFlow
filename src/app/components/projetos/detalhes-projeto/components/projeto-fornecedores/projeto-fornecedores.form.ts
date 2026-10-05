import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ProjetoFornecedoresForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      fornecedorId: ['', [Validators.required]],
      funcaoNoProjeto: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }
}
