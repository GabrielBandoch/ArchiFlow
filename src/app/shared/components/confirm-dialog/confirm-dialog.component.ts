import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DialogComponent],
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
