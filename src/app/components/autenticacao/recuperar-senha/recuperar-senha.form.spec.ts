import { FormBuilder } from '@angular/forms';
import { RecuperarSenhaForm } from './recuperar-senha.form';

describe('RecuperarSenhaForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when email is empty', () => {
    const form = RecuperarSenhaForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('email')?.hasError('required')).toBeTrue();
  });

  it('should fail validation on invalid email format', () => {
    const form = RecuperarSenhaForm.create(fb);
    form.patchValue({ email: 'invalid-email' });
    expect(form.valid).toBeFalse();
    expect(form.get('email')?.hasError('email')).toBeTrue();
  });

  it('should be valid when valid email is provided', () => {
    const form = RecuperarSenhaForm.create(fb);
    form.patchValue({ email: 'arquiteto@estudio.com.br' });
    expect(form.valid).toBeTrue();
  });
});
