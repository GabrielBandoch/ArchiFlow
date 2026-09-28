import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardMetricas } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-graficos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-graficos.component.html',
  styleUrl: './dashboard-graficos.component.scss'
})
export class DashboardGraficosComponent {
  @Input({ required: true }) widgetId!: string;
  @Input({ required: true }) metricas!: DashboardMetricas;
  @Input({ required: true }) formatarMoeda!: (v: number) => string;
  @Input({ required: true }) formatarMoedaInteiro!: (v: number) => string;

  obterCorFase(status: string): string {
    const cores: Record<string, string> = {
      'estudopreliminar': '#3b82f6',
      'anteprojeto': '#8b5cf6',
      'projetolegal': '#f59e0b',
      'projetoexecutivo': '#765538',
      'concluido': '#10b981',
      'cancelado': '#ef4444'
    };
    const key = status?.toLowerCase().replace(/[^a-z]/g, '') || '';
    return cores[key] || '#94a3b8';
  }

  obterDashArray(percentual: number): string {
    const p = Math.max(0, Math.min(100, percentual || 0));
    const circumference = 2 * Math.PI * 70;
    const strokeLength = (p / 100) * circumference;
    return `${strokeLength} ${circumference}`;
  }

  obterDashOffset(index: number): number {
    const lista = this.metricas?.projetosPorStatus || [];
    let percentualAcumulado = 0;
    for (let i = 0; i < index; i++) {
      percentualAcumulado += lista[i].percentual;
    }
    const circumference = 2 * Math.PI * 70;
    return -(percentualAcumulado / 100) * circumference;
  }

  obterCorTipologia(index: number): string {
    const cores = ['#765538', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    return cores[index % cores.length];
  }

  obterCorOrigem(index: number): string {
    const cores = ['#e11d48', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#64748b'];
    return cores[index % cores.length];
  }

  obterMaxPropostasMensal(): number {
    const lista = this.metricas?.propostasMensais || [];
    if (!lista.length) return 1;
    return Math.max(...lista.map(p => p.valorTotal), 1);
  }
}
