import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() cardTitle?: string;
  @Input() cardSubtitle?: string;
  @Input() variant: 'elevated' | 'outlined' | 'flat' = 'outlined';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;
  @Input() hasFooter = false;
  @Input() customClass = '';
}
