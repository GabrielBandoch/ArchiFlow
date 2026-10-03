import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaDespesa } from '../../models/financeiro.model';

export class FinanceiroForm {
  static createParcelaAvulsa(fb: FormBuilder, preselectedProjectId = '', defaultDate?: string): FormGroup {
    const hoje = defaultDate || new Date().toISOString().substring(0, 10);
    return fb.group({
      projetoId: [preselectedProjectId, [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      dataVencimento: [hoje, [Validators.required]],
      numeroParcela: [1, [Validators.required, Validators.min(1)]],
      totalParcelas: [1, [Validators.required, Validators.min(1)]],
      observacoes: ['']
    });
  }

  static createParcelaContrato(fb: FormBuilder, preselectedProjectId = '', defaultDate?: string): FormGroup {
    const hoje = defaultDate || new Date().toISOString().substring(0, 10);
    return fb.group({
      projetoId: [preselectedProjectId, [Validators.required]],
      valorTotal: [null, [Validators.required, Validators.min(0.01)]],
      numeroParcelas: [3, [Validators.required, Validators.min(1), Validators.max(48)]],
      dataPrimeiroVencimento: [hoje, [Validators.required]],
      intervaloDias: [30, [Validators.required, Validators.min(1)]],
      condicoesPagamento: ['Entrada + parcelas mensais'],
      observacoes: ['']
    });
  }

  static createDespesa(fb: FormBuilder, preselectedProjectId = '', defaultDate?: string): FormGroup {
    const hoje = defaultDate || new Date().toISOString().substring(0, 10);
    return fb.group({
      projetoId: [preselectedProjectId, [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      dataDespesa: [hoje, [Validators.required]],
      categoria: [CategoriaDespesa.PlotagemImpressao, [Validators.required]],
      observacoes: [''],
      comprovanteUrl: ['']
    });
  }
}
