import { FormBuilder } from '@angular/forms';
import { FinanceiroForm } from './financeiro.form';
import { CategoriaDespesa } from '../../models/financeiro.model';

describe('FinanceiroForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('createParcelaAvulsa', () => {
    it('deve criar formulario invalido por padrao e exigir campos obrigatorios', () => {
      const form = FinanceiroForm.createParcelaAvulsa(fb);
      expect(form.valid).toBeFalse();
      expect(form.get('projetoId')?.hasError('required')).toBeTrue();
      expect(form.get('descricao')?.hasError('required')).toBeTrue();
      expect(form.get('valor')?.hasError('required')).toBeTrue();
      expect(form.get('dataVencimento')?.value).toBeTruthy();
    });

    it('deve validar valor minimo maior que zero', () => {
      const form = FinanceiroForm.createParcelaAvulsa(fb, 'proj-123');
      form.patchValue({
        descricao: 'Entrada de Projeto',
        valor: 0,
        numeroParcela: 1,
        totalParcelas: 1
      });
      expect(form.get('valor')?.hasError('min')).toBeTrue();

      form.patchValue({ valor: 1500 });
      expect(form.valid).toBeTrue();
    });
  });

  describe('createParcelaContrato', () => {
    it('deve criar contrato com configuracao padrao de 3 parcelas e intervalo de 30 dias', () => {
      const form = FinanceiroForm.createParcelaContrato(fb, 'proj-456');
      expect(form.get('projetoId')?.value).toBe('proj-456');
      expect(form.get('numeroParcelas')?.value).toBe(3);
      expect(form.get('intervaloDias')?.value).toBe(30);
      expect(form.valid).toBeFalse(); // falta valorTotal

      form.patchValue({ valorTotal: 12000 });
      expect(form.valid).toBeTrue();
    });
  });

  describe('createDespesa', () => {
    it('deve exigir projetoId, descricao, valor e inicializar com categoria padrao', () => {
      const form = FinanceiroForm.createDespesa(fb, 'proj-789');
      expect(form.get('categoria')?.value).toBe(CategoriaDespesa.PlotagemImpressao);
      expect(form.valid).toBeFalse();

      form.patchValue({
        descricao: 'Plotagem de Pranchas A1',
        valor: 180.50
      });
      expect(form.valid).toBeTrue();
    });
  });
});
