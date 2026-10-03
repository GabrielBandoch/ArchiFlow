import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MembroEquipe } from '../../../models/usuario.model';

export class MembroEquipeForm {
  static create(fb: FormBuilder, membro?: MembroEquipe): FormGroup {
    return fb.group({
      nome: [membro?.nome || '', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      email: [membro?.email || '', [Validators.required, Validators.email, Validators.maxLength(256)]],
      role: [membro?.role || 'ArquitetoColaborador', Validators.required],
      cargo: [membro?.cargo || '', [Validators.maxLength(100)]],
      telefone: [membro?.telefone || '', [Validators.maxLength(30)]],
      senhaTemporaria: ['']
    });
  }
}
