import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { Compromisso, TipoCompromisso, TiposCompromisso } from "../../../../core/models/agenda.model";

export interface DiaCalendario {
  data: Date;
  diaNumero: number;
  mesmoMes: boolean;
  isHoje: boolean;
  compromissos: Compromisso[];
}

@Component({
  selector: "app-agenda-calendario-view",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: "./agenda-calendario-view.component.html",
  styleUrls: ["./agenda-calendario-view.component.scss"],
})
export class AgendaCalendarioViewComponent {
  @Input() diasSemana: string[] = [];
  @Input() diasMes: DiaCalendario[] = [];

  @Output() diaClick = new EventEmitter<Date>();
  @Output() quickAddClick = new EventEmitter<Date>();
  @Output() compromissoClick = new EventEmitter<Compromisso>();

  obterBadgeClasseTipo(tipo: TipoCompromisso | string): string {
    switch (tipo) {
      case TiposCompromisso.ReuniaoCliente:
        return "badge-tipo-reuniao";
      case TiposCompromisso.VisitaObra:
        return "badge-tipo-obra";
      case TiposCompromisso.MedicaoTecnica:
        return "badge-tipo-medicao";
      case TiposCompromisso.ApresentacaoProjeto:
        return "badge-tipo-apresentacao";
      case TiposCompromisso.EntregaEtapa:
        return "badge-tipo-entrega";
      default:
        return "badge-tipo-geral";
    }
  }

  formatarHora(dataIso: string): string {
    const d = new Date(dataIso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}
