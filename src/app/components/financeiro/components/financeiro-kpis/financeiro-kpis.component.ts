import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../../shared';

@Component({
  selector: 'app-financeiro-kpis',
  standalone: true,
  imports: [CommonModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './financeiro-kpis.component.html',
  styleUrl: './financeiro-kpis.component.scss'
})
export class FinanceiroKpisComponent {
  @Input() totalPrevisto = 0;
  @Input() totalRecebido = 0;
  @Input() totalPendente = 0;
  @Input() totalAtrasado = 0;
  @Input() totalDespesas = 0;
  @Input() saldoLiquido = 0;
  @Input() variacaoMensal = 0;
}
