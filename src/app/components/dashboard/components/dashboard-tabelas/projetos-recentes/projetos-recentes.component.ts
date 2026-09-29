import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjetoResumoDashboard } from '../../../../../models/dashboard.model';
import { DashboardWidgetHeaderComponent } from '../../dashboard-widget-header/dashboard-widget-header.component';

@Component({
  selector: 'app-projetos-recentes',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardWidgetHeaderComponent],
  templateUrl: './projetos-recentes.component.html',
  styleUrl: './projetos-recentes.component.scss'
})
export class ProjetosRecentesComponent {
  @Input() projetos: ProjetoResumoDashboard[] = [];

  obterBadgeStatus(status: string): string {
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
}
