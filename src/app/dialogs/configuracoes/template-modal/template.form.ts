import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectTemplate } from '../../../models/project-template.model';

export class TemplateForm {
  static create(fb: FormBuilder, template?: ProjectTemplate): FormGroup {
    return fb.group({
      nome: [template?.nome || '', [Validators.required, Validators.maxLength(200)]],
      codigo: [
        template?.codigo || template?.id || '',
        [Validators.required, Validators.maxLength(100)]
      ],
      descricao: [template?.descricao || ''],
      icone: [template?.icone || 'home', Validators.required]
    });
  }
}
