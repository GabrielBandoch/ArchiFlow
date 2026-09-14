import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../../models/projeto.model';

@Component({
  selector: 'app-portal-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-hero.component.html',
  styleUrl: './portal-hero.component.scss'
})
export class PortalHeroComponent {
  @Input() projeto!: Projeto;
  @Input() statusLabel = '';
  @Input() tipoFormatado = '';
  @Input() percentualProgresso = 0;
  @Input() totalConcluidas = 0;
  @Input() totalEtapas = 0;

  formatarData(data: any): string {
    if (!data) return 'Não definida';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}
