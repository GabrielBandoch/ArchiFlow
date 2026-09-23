import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoriaCalculo } from '../../../../../models/honorario.model';

@Component({
  selector: 'app-memoria-calculo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memoria-calculo.component.html',
  styleUrl: './memoria-calculo.component.scss'
})
export class MemoriaCalculoCardComponent {
  @Input() memoria?: MemoriaCalculo;

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
