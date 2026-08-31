import { FormBuilder } from '@angular/forms';
import { ClienteForm } from './cliente.form';

describe('ClienteForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when required fields are empty', () => {
    const form = ClienteForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('nome')?.hasError('required')).toBeTrue();
    expect(form.get('email')?.hasError('required')).toBeTrue();
  });

  it('should be valid when valid name and email are provided', () => {
    const form = ClienteForm.create(fb);
    form.patchValue({
      nome: 'Gabriel Felipe Alves',
      email: 'gabriel@email.com'
    });
    expect(form.valid).toBeTrue();
  });

  it('should fail validation on invalid email format', () => {
    const form = ClienteForm.create(fb);
    form.patchValue({
      nome: 'Gabriel Felipe',
      email: 'not-an-email'
    });
    expect(form.valid).toBeFalse();
    expect(form.get('email')?.hasError('email')).toBeTrue();
  });
});
