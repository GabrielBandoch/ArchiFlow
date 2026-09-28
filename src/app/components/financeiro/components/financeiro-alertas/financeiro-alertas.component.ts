import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../../shared';
import { AlertaFinanceiro } from '../../../../models/financeiro.model';

@Component({
  selector: 'app-financeiro-alertas',
  standalone: true,
  imports: [CommonModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './financeiro-alertas.component.html',
  styleUrl: './financeiro-alertas.component.scss'
})
export class FinanceiroAlertasComponent {
  @Input() alertas: AlertaFinanceiro[] = [];
  @Output() darBaixa = new EventEmitter<string>();

  onDarBaixa(parcelaId: string): void {
    this.darBaixa.emit(parcelaId);
  }
}
