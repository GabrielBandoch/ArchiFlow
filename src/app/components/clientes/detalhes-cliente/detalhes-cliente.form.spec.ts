import { FormBuilder } from '@angular/forms';
import { DetalhesClienteForm } from './detalhes-cliente.form';

describe('DetalhesClienteForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when nome and email are empty', () => {
    const form = DetalhesClienteForm.createConviteRepForm(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('nome')?.hasError('required')).toBeTrue();
    expect(form.get('email')?.hasError('required')).toBeTrue();
  });

  it('should validate email format', () => {
    const form = DetalhesClienteForm.createConviteRepForm(fb);
    form.patchValue({
      nome: 'Beatriz Representante',
      email: 'invalid-email'
    });
    expect(form.get('email')?.hasError('email')).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should be valid when valid name and email are provided', () => {
    const form = DetalhesClienteForm.createConviteRepForm(fb);
    form.patchValue({
      nome: 'Beatriz Representante',
      email: 'beatriz@empresa.com.br'
    });
    expect(form.valid).toBeTrue();
  });
});
