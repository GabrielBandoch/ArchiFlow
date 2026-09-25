import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DESIGN_SYSTEM } from '../../../../../shared';

@Component({
  selector: 'app-modal-ajuste-manual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DESIGN_SYSTEM],
  templateUrl: './modal-ajuste-manual.component.html',
  styleUrl: './modal-ajuste-manual.component.scss'
})
export class ModalAjusteManualComponent {
  @Input() show = false;
  @Input({ required: true }) form!: FormGroup;

  @Output() close = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();
}
