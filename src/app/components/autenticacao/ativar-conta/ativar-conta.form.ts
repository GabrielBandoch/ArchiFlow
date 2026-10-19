import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

export class AtivarContaForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group(
      {
        nome: ['', [Validators.required, Validators.maxLength(150)]],
        email: [{ value: '', disabled: true }],
        telefone: [''],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]]
      },
      { validators: AtivarContaForm.senhasIguaisValidator }
    );
  }

  static senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const s = control.get('senha')?.value;
    const c = control.get('confirmarSenha')?.value;
    return s === c ? null : { senhasDiferentes: true };
  }
}
