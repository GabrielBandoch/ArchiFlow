import { FormBuilder } from '@angular/forms';
import { ProjetoForm } from './projeto.form';
import { TipoProjeto, StatusProjeto } from '../../models/projeto.model';

describe('ProjetoForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('create', () => {
    it('should create an invalid form when empty', () => {
      const form = ProjetoForm.create(fb);
      expect(form.valid).toBeFalse();
    });

    it('should be valid when required fields are filled', () => {
      const form = ProjetoForm.create(fb);
      form.patchValue({
        nome: 'Projeto Teste',
        clienteId: 'c1',
        tipo: TipoProjeto.Residencial,
        dataInicio: '2026-08-01',
        metragemTotal: 200
      });
      expect(form.valid).toBeTrue();
    });
  });

  describe('edit', () => {
    it('should create an edit form with valid initial structure', () => {
      const form = ProjetoForm.edit(fb);
      expect(form.get('status')).toBeTruthy();
      expect(form.get('tipo')).toBeTruthy();
    });
  });

  describe('createEtapa', () => {
    it('should create stage form with default order', () => {
      const form = ProjetoForm.createEtapa(fb, 3);
      expect(form.get('ordem')?.value).toBe(3);
      form.patchValue({ nome: 'Etapa 3' });
      expect(form.valid).toBeTrue();
    });
  });
});
