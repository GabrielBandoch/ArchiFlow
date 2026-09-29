import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetosPorTipo } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { DASHBOARD_COLORS } from '../../../dashboard-colors';

@Component({
  selector: 'app-projetos-tipo-chart',
  standalone: true,
  imports: [CommonModule, DashboardWidgetHeaderComponent],
  templateUrl: './projetos-tipo-chart.component.html',
  styleUrl: './projetos-tipo-chart.component.scss'
})
export class ProjetosTipoChartComponent {
  @Input() dados: ProjetosPorTipo[] = [];

  obterCor(tipo: string): string {
    return DASHBOARD_COLORS.tiposProjeto[tipo] || DASHBOARD_COLORS.defaultColor;
  }
}
