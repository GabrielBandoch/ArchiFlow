import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsPorOrigem } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { DASHBOARD_COLORS } from '../../../dashboard-colors';

@Component({
  selector: 'app-leads-origem-chart',
  standalone: true,
  imports: [CommonModule, DashboardWidgetHeaderComponent],
  templateUrl: './leads-origem-chart.component.html',
  styleUrl: './leads-origem-chart.component.scss'
})
export class LeadsOrigemChartComponent {
  @Input() dados: LeadsPorOrigem[] = [];

  obterCor(index: number): string {
    return DASHBOARD_COLORS.origens[index % DASHBOARD_COLORS.origens.length];
  }
}
