import { FormBuilder } from '@angular/forms';
import { DadosEmpresaForm } from './dados-empresa.form';

describe('DadosEmpresaForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should initialize with invalid status when nomeEmpresa is empty', () => {
    const form = DadosEmpresaForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get('nomeEmpresa')?.hasError('required')).toBeTrue();
  });

  it('should validate valid CNPJ format', () => {
    const form = DadosEmpresaForm.create(fb);
    form.patchValue({
      nomeEmpresa: 'Estúdio Cotu',
      cnpj: '12.345.678/0001-95'
    });
    expect(form.get('cnpj')?.hasError('cpfCnpjInvalido')).toBeFalse();
  });

  it('should invalidate incorrect CPF/CNPJ', () => {
    const form = DadosEmpresaForm.create(fb);
    form.patchValue({
      nomeEmpresa: 'Estúdio Cotu',
      cnpj: '123'
    });
    expect(form.get('cnpj')?.hasError('cpfCnpjInvalido')).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should validate website URL format', () => {
    const form = DadosEmpresaForm.create(fb);
    form.patchValue({
      nomeEmpresa: 'Estúdio Cotu',
      website: 'https://cotu.com.br'
    });
    expect(form.get('website')?.hasError('websiteInvalido')).toBeFalse();
  });

  it('should invalidate incorrect website format', () => {
    const form = DadosEmpresaForm.create(fb);
    form.patchValue({
      nomeEmpresa: 'Estúdio Cotu',
      website: 'not a website url!'
    });
    expect(form.get('website')?.hasError('websiteInvalido')).toBeTrue();
  });

  it('should be valid with default color and required company name', () => {
    const form = DadosEmpresaForm.create(fb);
    form.patchValue({ nomeEmpresa: 'Arquitetura Cotu' });
    expect(form.valid).toBeTrue();
    expect(form.get('corPrimaria')?.value).toBe('#765538');
  });
});
