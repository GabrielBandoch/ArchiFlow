import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() overlay = false;
  @Input() fullPage = false;
}
