import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ClienteForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cpfCnpj: [''],
      cep: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: ['']
    });
  }
}
