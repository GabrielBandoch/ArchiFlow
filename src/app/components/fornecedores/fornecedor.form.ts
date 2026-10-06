import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class FornecedorForm {
  static createFornecedor(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(200)]],
      especialidade: ['Iluminação', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      telefone: ['', [Validators.maxLength(50)]],
      cidade: ['', [Validators.maxLength(100)]],
      estado: ['SC', [Validators.maxLength(50)]],
      descricao: ['', [Validators.maxLength(1000)]]
    });
  }

  static createAvaliacao(fb: FormBuilder, fornecedorId = ''): FormGroup {
    return fb.group({
      fornecedorId: [fornecedorId, [Validators.required]],
      projetoId: [''],
      nota: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.maxLength(1000)]],
      autorNome: ['Arquiteto Titular', [Validators.maxLength(150)]]
    });
  }

  static createVinculoProjeto(fb: FormBuilder, fornecedorId = '', projetoId = ''): FormGroup {
    return fb.group({
      fornecedorId: [fornecedorId, [Validators.required]],
      projetoId: [projetoId, [Validators.required]],
      funcaoNoProjeto: ['Fornecedor / Parceiro Especializado', [Validators.maxLength(150)]]
    });
  }
}
