import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class DetalhesClienteForm {
  static createConviteRepForm(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ["", [Validators.required, Validators.maxLength(150)]],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(256)],
      ],
      cargo: ["", [Validators.maxLength(100)]],
      telefone: ["", [Validators.maxLength(50)]],
      enviarEmailAgora: [false],
    });
  }
}
