import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { DespesaProjeto, ParcelaFinanceira } from "../../../../core/models/financeiro.model";

@Component({
  selector: "app-dashboard-financeiro-semana",
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: "./dashboard-financeiro-semana.component.html",
  styleUrls: ["./dashboard-financeiro-semana.component.scss"],
})
export class DashboardFinanceiroSemanaComponent {
  @Input() contasPagar: DespesaProjeto[] = [];
  @Input() totalPagar = 0;
  @Input() recebiveis: ParcelaFinanceira[] = [];
  @Input() totalReceber = 0;
  @Input() parcelasAtrasadas: ParcelaFinanceira[] = [];

  @Output() marcarDespesaPaga = new EventEmitter<DespesaProjeto>();

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return "R$ 0,00";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return "-";
    try {
      const parts = dataStr.split("T")[0].split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
      return dataStr;
    } catch {
      return dataStr;
    }
  }
}
