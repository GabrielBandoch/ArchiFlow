import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetosPorStatus } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { DASHBOARD_COLORS } from '../../../dashboard-colors';

@Component({
  selector: 'app-projetos-status-chart',
  standalone: true,
  imports: [CommonModule, DashboardWidgetHeaderComponent],
  templateUrl: './projetos-status-chart.component.html',
  styleUrl: './projetos-status-chart.component.scss'
})
export class ProjetosStatusChartComponent {
  @Input() dados: ProjetosPorStatus[] = [];
  @Input() totalProjetos?: number;

  private readonly circ = 439.82;

  get totalExibido(): number {
    if (this.totalProjetos !== undefined && this.totalProjetos !== null) {
      return this.totalProjetos;
    }
    return this.dados?.reduce((acc, item) => acc + (item.quantidade || 0), 0) ?? 0;
  }

  obterCor(status: string): string {
    return DASHBOARD_COLORS.fasesProjeto[status] || DASHBOARD_COLORS.defaultColor;
  }

  obterDashArray(percentual: number): string {
    const p = Math.max(0, Math.min(100, percentual || 0));
    const val = (p / 100) * this.circ;
    return `${val} ${this.circ}`;
  }

  obterDashOffset(index: number): number {
    let acc = 0;
    for (let i = 0; i < index; i++) {
      acc += this.dados[i]?.percentual || 0;
    }
    return -(acc / 100) * this.circ;
  }
}
