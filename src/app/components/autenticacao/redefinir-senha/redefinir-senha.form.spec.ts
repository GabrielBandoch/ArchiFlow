import { FormBuilder } from '@angular/forms';
import { RedefinirSenhaForm } from './redefinir-senha.form';

describe('RedefinirSenhaForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when fields are empty', () => {
    const form = RedefinirSenhaForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('novaSenha')?.hasError('required')).toBeTrue();
    expect(form.get('confirmarSenha')?.hasError('required')).toBeTrue();
  });

  it('should fail when password has less than 6 characters', () => {
    const form = RedefinirSenhaForm.create(fb);
    form.patchValue({
      novaSenha: '12345',
      confirmarSenha: '12345'
    });
    expect(form.get('novaSenha')?.hasError('minlength')).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should fail when passwords do not match', () => {
    const form = RedefinirSenhaForm.create(fb);
    form.patchValue({
      novaSenha: 'NovaSenha@2026',
      confirmarSenha: 'OutraSenha@2026'
    });
    expect(form.hasError('senhasDiferentes')).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should be valid when passwords match and satisfy length', () => {
    const form = RedefinirSenhaForm.create(fb);
    form.patchValue({
      novaSenha: 'NovaSenha@2026',
      confirmarSenha: 'NovaSenha@2026'
    });
    expect(form.hasError('senhasDiferentes')).toBeFalse();
    expect(form.valid).toBeTrue();
  });
});
