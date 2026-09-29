import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-widget-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-widget-header.component.html',
  styleUrl: './dashboard-widget-header.component.scss'
})
export class DashboardWidgetHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input({ required: true }) icon!: string;
  @Input() iconVariant: 'blue' | 'terracotta' | 'amber' | 'purple' | 'green' = 'blue';
  @Input() actionText?: string;
  @Input() actionLink?: string;
}
