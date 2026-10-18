import { FormBuilder } from '@angular/forms';
import { AtivarContaForm } from './ativar-conta.form';

describe('AtivarContaForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when required fields are empty', () => {
    const form = AtivarContaForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('nome')?.hasError('required')).toBeTrue();
    expect(form.get('senha')?.hasError('required')).toBeTrue();
    expect(form.get('confirmarSenha')?.hasError('required')).toBeTrue();
  });

  it('should be disabled for email field by default', () => {
    const form = AtivarContaForm.create(fb);
    expect(form.get('email')?.disabled).toBeTrue();
  });

  it('should fail when passwords do not match', () => {
    const form = AtivarContaForm.create(fb);
    form.patchValue({
      nome: 'Carlos Representante',
      senha: 'password123',
      confirmarSenha: 'differentPassword'
    });
    expect(form.hasError('senhasDiferentes')).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should be valid when passwords match and required fields are filled', () => {
    const form = AtivarContaForm.create(fb);
    form.patchValue({
      nome: 'Carlos Representante',
      senha: 'password123',
      confirmarSenha: 'password123'
    });
    expect(form.hasError('senhasDiferentes')).toBeFalse();
    expect(form.valid).toBeTrue();
  });
});
