import { Component, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, OnInit, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show = false;
  @Input() dialogTitle = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overflowVisible = false;
  @Input() zIndex?: number;
  
  @Output() close = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private isMovedToBody = false;

  ngOnInit(): void {
    if (this.show) {
      this.teleportToBody();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      if (this.show) {
        this.teleportToBody();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isMovedToBody && this.elementRef.nativeElement?.parentNode) {
      this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.elementRef.nativeElement);
    }
  }

  private teleportToBody(): void {
    if (!this.isMovedToBody && typeof document !== 'undefined' && document.body) {
      this.renderer.appendChild(document.body, this.elementRef.nativeElement);
      this.isMovedToBody = true;
    }
  }

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
