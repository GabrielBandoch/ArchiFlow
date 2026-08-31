import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoProjeto, StatusProjeto } from '../../models/projeto.model';

export class ProjetoForm {
  static create(fb: FormBuilder): FormGroup {
    const hoje = new Date().toISOString().substring(0, 10);
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      descricao: ['', [Validators.maxLength(500)]],
      clienteId: ['', [Validators.required]],
      tipo: [TipoProjeto.Residencial, [Validators.required]],
      dataInicio: [hoje, [Validators.required]],
      dataPrevistaEntrega: [''],
      metragemTotal: [0, [Validators.required, Validators.min(0)]]
    });
  }

  static edit(fb: FormBuilder): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      descricao: ['', [Validators.maxLength(500)]],
      tipo: [TipoProjeto.Residencial, [Validators.required]],
      status: [StatusProjeto.Briefing, [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataPrevistaEntrega: [''],
      metragemTotal: [0, [Validators.required, Validators.min(0)]]
    });
  }

  static createEtapa(fb: FormBuilder, nextOrder: number = 1): FormGroup {
    return fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(300)]],
      ordem: [nextOrder, [Validators.required, Validators.min(1)]]
    });
  }
}
