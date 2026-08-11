import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../index';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirmar Ação';
  @Input() message = 'Tem certeza de que deseja realizar esta ação?';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.close.emit();
  }
}
