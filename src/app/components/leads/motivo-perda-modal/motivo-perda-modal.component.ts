import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { LeadForm } from '../lead.form';

@Component({
  selector: 'app-motivo-perda-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './motivo-perda-modal.component.html'
})
export class MotivoPerdaModalComponent {
  private fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  form: FormGroup;
  submitted = false;

  constructor() {
    this.form = LeadForm.createMotivoPerda(this.fb);
  }

  get f() { return this.form.controls; }

  onCancel(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.confirm.emit(this.form.value.motivoPerda.trim());
    this.close.emit();
  }
}
