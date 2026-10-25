import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";

@Component({
  selector: "app-proposta-pdf-toolbar",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: "./proposta-pdf-toolbar.component.html",
  styleUrls: ["./proposta-pdf-toolbar.component.scss"],
})
export class PropostaPdfToolbarComponent {
  @Input() proposta: PropostaVisualizacaoData | null = null;
  @Input() isConfigurado = true;

  @Output() whatsapp = new EventEmitter<void>();
  @Output() email = new EventEmitter<void>();
  @Output() imprimir = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();
  @Output() configurar = new EventEmitter<void>();
}
