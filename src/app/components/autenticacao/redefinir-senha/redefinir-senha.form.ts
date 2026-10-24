import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

export class RedefinirSenhaForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group(
      {
        novaSenha: ["", [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ["", [Validators.required]],
      },
      { validators: RedefinirSenhaForm.senhasIguaisValidator },
    );
  }

  static senhasIguaisValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const nova = control.get("novaSenha")?.value;
    const confirm = control.get("confirmarSenha")?.value;
    return nova === confirm ? null : { senhasDiferentes: true };
  }
}
