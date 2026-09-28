import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulacaoResultado } from '../../../../../models/honorario.model';

@Component({
  selector: 'app-estimativa-destaque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estimativa-destaque.component.html',
  styleUrl: './estimativa-destaque.component.scss'
})
export class EstimativaDestaqueComponent {
  @Input() simulacao?: SimulacaoResultado;
  @Input() carregando = false;

  @Output() salvarPropostaClick = new EventEmitter<void>();
  @Output() vincularLeadClick = new EventEmitter<void>();
  @Output() ajusteManualClick = new EventEmitter<void>();
  @Output() pdfClick = new EventEmitter<void>();
  @Output() whatsappClick = new EventEmitter<void>();

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
