import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../../shared';
import { ReceitaMes } from '../../../../models/financeiro.model';

@Component({
  selector: 'app-financeiro-grafico',
  standalone: true,
  imports: [CommonModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './financeiro-grafico.component.html',
  styleUrl: './financeiro-grafico.component.scss'
})
export class FinanceiroGraficoComponent {
  @Input() receitasPorMes: ReceitaMes[] = [];
  @Input() selectedYear = new Date().getFullYear();
  @Output() anoChange = new EventEmitter<number>();
  anoOptions = [2026, 2025, 2024];

  get maxValor(): number {
    if (!this.receitasPorMes || this.receitasPorMes.length === 0) return 10000;
    const maxRec = Math.max(...this.receitasPorMes.map(r => Math.max(r.valorRecebido, r.valorPrevisto, r.valorDespesas)));
    return maxRec > 0 ? maxRec * 1.15 : 10000;
  }

  getBarHeight(valor: number): number {
    if (!valor || valor <= 0) return 4;
    return Math.max(4, Math.round((valor / this.maxValor) * 170));
  }

  getBarY(valor: number): number {
    return 205 - this.getBarHeight(valor);
  }

  getBarX(index: number, tipo: 'recebido' | 'previsto' | 'despesa'): number {
    const totalCols = Math.max(this.receitasPorMes.length, 12);
    const colWidth = 620 / totalCols;
    const xCenter = 60 + index * colWidth + (colWidth / 2);
    if (tipo === 'recebido') return xCenter - 14;
    if (tipo === 'previsto') return xCenter - 4;
    return xCenter + 6;
  }

  getMonthX(index: number): number {
    const totalCols = Math.max(this.receitasPorMes.length, 12);
    const colWidth = 620 / totalCols;
    return 60 + index * colWidth + (colWidth / 2);
  }

  selectAno(ano: number): void {
    this.selectedYear = ano;
    this.anoChange.emit(ano);
  }
}

