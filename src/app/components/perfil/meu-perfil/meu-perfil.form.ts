import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

export class MeuPerfilForm {
  static createPerfilForm(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      email: [{ value: '', disabled: true }],
      cargo: ['', [Validators.maxLength(100)]],
      telefone: ['', [Validators.maxLength(50)]]
    });
  }

  static createSenhaForm(fb: FormBuilder): FormGroup {
    return fb.group(
      {
        senhaAtual: ['', [Validators.required]],
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoNovaSenha: ['', [Validators.required]]
      },
      { validators: MeuPerfilForm.senhasIguaisValidator }
    );
  }

  static senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const n = control.get('novaSenha')?.value;
    const c = control.get('confirmacaoNovaSenha')?.value;
    return n === c ? null : { senhasDiferentes: true };
  }
}
