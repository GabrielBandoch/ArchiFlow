import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsPorStatus } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { DASHBOARD_COLORS } from '../../../dashboard-colors';

@Component({
  selector: 'app-leads-funil-chart',
  standalone: true,
  imports: [CommonModule, DashboardWidgetHeaderComponent],
  templateUrl: './leads-funil-chart.component.html',
  styleUrl: './leads-funil-chart.component.scss'
})
export class LeadsFunilChartComponent {
  @Input() dados: LeadsPorStatus[] = [];

  obterCor(status: string): string {
    return DASHBOARD_COLORS.funilLeads[status] || DASHBOARD_COLORS.defaultColor;
  }
}
