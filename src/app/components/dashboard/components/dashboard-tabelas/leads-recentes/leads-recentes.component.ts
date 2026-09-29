import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeadResumoDashboard } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';

@Component({
  selector: 'app-leads-recentes',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardWidgetHeaderComponent],
  templateUrl: './leads-recentes.component.html',
  styleUrl: './leads-recentes.component.scss'
})
export class LeadsRecentesComponent {
  @Input() leads: LeadResumoDashboard[] = [];
}
