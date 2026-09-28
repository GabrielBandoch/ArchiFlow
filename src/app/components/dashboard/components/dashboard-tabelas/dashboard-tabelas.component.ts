import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardMetricas } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-tabelas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-tabelas.component.html',
  styleUrl: './dashboard-tabelas.component.scss'
})
export class DashboardTabelasComponent {
  @Input({ required: true }) widgetId!: string;
  @Input({ required: true }) metricas!: DashboardMetricas;
  @Input({ required: true }) formatarMoeda!: (v: number) => string;

  obterBadgeStatusProjeto(status: string): string {
    const mapa: Record<string, string> = {
      'estudopreliminar': 'status-blue',
      'anteprojeto': 'status-purple',
      'projetolegal': 'status-amber',
      'projetoexecutivo': 'status-primary',
      'concluido': 'status-green'
    };
    const key = status?.toLowerCase().replace(/[^a-z]/g, '') || '';
    return mapa[key] || 'status-neutral';
  }

  obterBadgeStatusProposta(status: string): string {
    const mapa: Record<string, string> = {
      'aprovada': 'status-green',
      'aceita': 'status-green',
      'enviada': 'status-blue',
      'rascunho': 'status-neutral',
      'rejeitada': 'status-red'
    };
    const key = status?.toLowerCase().replace(/[^a-z]/g, '') || '';
    return mapa[key] || 'status-neutral';
  }
}
