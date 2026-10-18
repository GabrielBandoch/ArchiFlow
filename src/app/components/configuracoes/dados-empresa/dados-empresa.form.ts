import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MaskUtils } from '../../../core/utils/mask-utils';

export function cpfCnpjValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || !value.toString().trim()) {
    return null;
  }
  return MaskUtils.isValidCpfCnpj(value.toString()) ? null : { cpfCnpjInvalido: true };
}

export function websiteValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || !value.toString().trim()) {
    return null;
  }
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  return urlPattern.test(value.toString().trim()) ? null : { websiteInvalido: true };
}

export class DadosEmpresaForm {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      nomeEmpresa: ['', [Validators.required, Validators.maxLength(200)]],
      razaoSocial: ['', [Validators.maxLength(200)]],
      cnpj: ['', [cpfCnpjValidator, Validators.maxLength(30)]],
      registroProfissional: ['', [Validators.maxLength(150)]],
      slogan: ['', [Validators.maxLength(300)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.maxLength(50)]],
      endereco: ['', [Validators.minLength(3), Validators.maxLength(300)]],
      cidade: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      estado: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      cep: ['', [Validators.maxLength(20)]],
      website: ['', [websiteValidator, Validators.maxLength(200)]],
      corPrimaria: ['#765538', [Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]]
    });
  }
}
