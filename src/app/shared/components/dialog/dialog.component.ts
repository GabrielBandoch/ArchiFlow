import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() show = false;
  @Input() dialogTitle = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overflowVisible = false;
  
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeHandler(event: KeyboardEvent): void {
    if (this.show) {
      this.close.emit();
    }
  }
}
