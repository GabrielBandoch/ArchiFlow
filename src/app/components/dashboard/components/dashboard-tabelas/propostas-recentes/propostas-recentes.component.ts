import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropostaResumoDashboard } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';
import { formatarMoeda } from '../../../dashboard.utils';

@Component({
  selector: 'app-propostas-recentes',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardWidgetHeaderComponent],
  templateUrl: './propostas-recentes.component.html',
  styleUrl: './propostas-recentes.component.scss'
})
export class PropostasRecentesComponent {
  @Input() propostas: PropostaResumoDashboard[] = [];

  formatarMoeda = formatarMoeda;

  obterBadgeStatus(status: string): string {
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
