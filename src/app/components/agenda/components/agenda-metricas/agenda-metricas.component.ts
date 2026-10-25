import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-agenda-metricas",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./agenda-metricas.component.html",
  styleUrls: ["./agenda-metricas.component.scss"],
})
export class AgendaMetricasComponent {
  @Input() totalCompromissosMes = 0;
  @Input() totalReunioes = 0;
  @Input() totalVisitasObras = 0;
  @Input() totalConcluidos = 0;
}
