import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EtapaConfig {
  nome: string;
  descricao: string;
  percentual: number;
  checked: boolean;
}

@Component({
  selector: 'app-etapas-escopo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etapas-escopo.component.html',
  styleUrl: './etapas-escopo.component.scss'
})
export class EtapasEscopoComponent {
  @Input({ required: true }) etapas: EtapaConfig[] = [];
  @Output() etapaToggled = new EventEmitter<number>();

  toggle(index: number): void {
    this.etapaToggled.emit(index);
  }
}
