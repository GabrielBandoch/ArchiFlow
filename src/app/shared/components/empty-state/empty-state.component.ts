import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nenhum registro encontrado';
  @Input() description?: string;
  @Input() actionText?: string;
  @Input() set actionLabel(val: string | undefined) {
    this.actionText = val;
  }
  get actionLabel(): string | undefined {
    return this.actionText;
  }
  @Input() actionIcon?: string;

  @Output() action = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.action.emit();
    this.actionClick.emit();
  }
}
