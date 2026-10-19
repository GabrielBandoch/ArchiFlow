import { FormBuilder } from '@angular/forms';
import { MeuPerfilForm } from './meu-perfil.form';

describe('MeuPerfilForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('createPerfilForm', () => {
    it('should initialize with invalid status when nome is empty', () => {
      const form = MeuPerfilForm.createPerfilForm(fb);
      expect(form.valid).toBeFalse();
      expect(form.get('nome')?.hasError('required')).toBeTrue();
    });

    it('should have email disabled by default', () => {
      const form = MeuPerfilForm.createPerfilForm(fb);
      expect(form.get('email')?.disabled).toBeTrue();
    });

    it('should be valid when valid name is provided', () => {
      const form = MeuPerfilForm.createPerfilForm(fb);
      form.patchValue({ nome: 'Ana Arquiteta' });
      expect(form.valid).toBeTrue();
    });
  });

  describe('createSenhaForm', () => {
    it('should initialize with invalid status when fields are empty', () => {
      const form = MeuPerfilForm.createSenhaForm(fb);
      expect(form.valid).toBeFalse();
      expect(form.get('senhaAtual')?.hasError('required')).toBeTrue();
      expect(form.get('novaSenha')?.hasError('required')).toBeTrue();
    });

    it('should fail when passwords do not match', () => {
      const form = MeuPerfilForm.createSenhaForm(fb);
      form.patchValue({
        senhaAtual: 'atual123',
        novaSenha: 'novaSenha123',
        confirmacaoNovaSenha: 'outraSenha123'
      });
      expect(form.hasError('senhasDiferentes')).toBeTrue();
      expect(form.valid).toBeFalse();
    });

    it('should be valid when passwords match and length >= 6', () => {
      const form = MeuPerfilForm.createSenhaForm(fb);
      form.patchValue({
        senhaAtual: 'atual123',
        novaSenha: 'novaSenha123',
        confirmacaoNovaSenha: 'novaSenha123'
      });
      expect(form.hasError('senhasDiferentes')).toBeFalse();
      expect(form.valid).toBeTrue();
    });
  });
});
