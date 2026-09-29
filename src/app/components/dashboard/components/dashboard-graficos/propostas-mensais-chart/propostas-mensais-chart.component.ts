import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropostasMensal } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { formatarMoeda, formatarMoedaInteiro } from '../../../dashboard.utils';

@Component({
  selector: 'app-propostas-mensais-chart',
  standalone: true,
  imports: [CommonModule, DashboardWidgetHeaderComponent],
  templateUrl: './propostas-mensais-chart.component.html',
  styleUrl: './propostas-mensais-chart.component.scss'
})
export class PropostasMensaisChartComponent {
  @Input() dados: PropostasMensal[] = [];
  @Input() pipelineTotal = 0;

  formatarMoeda = formatarMoeda;
  formatarMoedaInteiro = formatarMoedaInteiro;

  obterMaxValor(): number {
    if (!this.dados || this.dados.length === 0) return 0;
    return Math.max(...this.dados.map(m => m.valorTotal || 0));
  }

  obterAlturaPercentual(valor: number): number {
    const max = this.obterMaxValor();
    if (max <= 0) return 5;
    return Math.min(95, Math.max(5, (valor / max) * 90 + 5));
  }
}
