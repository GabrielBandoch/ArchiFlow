import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtapaProjeto, StatusEtapa } from '../../../models/projeto.model';

@Component({
  selector: 'app-portal-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-timeline.component.html',
  styleUrl: './portal-timeline.component.scss'
})
export class PortalTimelineComponent {
  @Input() etapaAtual?: EtapaProjeto;
  @Input() etapas: EtapaProjeto[] = [];

  StatusEtapa = StatusEtapa;

  formatarData(data: any): string {
    if (!data) return 'Não definida';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}
