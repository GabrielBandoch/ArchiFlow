import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Compromisso } from "../../../../core/models/agenda.model";

@Component({
  selector: "app-dashboard-pendencias-hoje",
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  templateUrl: "./dashboard-pendencias-hoje.component.html",
  styleUrls: ["./dashboard-pendencias-hoje.component.scss"],
})
export class DashboardPendenciasHojeComponent {
  @Input() compromissos: Compromisso[] = [];
  @Output() agendarTarefa = new EventEmitter<void>();

  formatarHora(dataHoraStr?: string): string {
    if (!dataHoraStr) return "";
    try {
      const d = new Date(dataHoraStr);
      return d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }
}
