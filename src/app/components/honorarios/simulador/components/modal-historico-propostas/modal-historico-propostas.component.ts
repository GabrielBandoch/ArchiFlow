import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DESIGN_SYSTEM } from '../../../../../shared';
import { PropostaHonorario } from '../../../../../models/honorario.model';

@Component({
  selector: 'app-modal-historico-propostas',
  standalone: true,
  imports: [CommonModule, DESIGN_SYSTEM],
  templateUrl: './modal-historico-propostas.component.html',
  styleUrl: './modal-historico-propostas.component.scss'
})
export class ModalHistoricoPropostasComponent {
  @Input() show = false;
  @Input() propostas: PropostaHonorario[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() atualizarStatus = new EventEmitter<{ proposta: PropostaHonorario; status: number }>();
  @Output() excluir = new EventEmitter<PropostaHonorario>();

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return '-';
    try {
      const d = new Date(dataStr);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return dataStr;
    }
  }
}
