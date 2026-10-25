import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguracaoProposta } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";

@Component({
  selector: "app-proposta-pdf-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./proposta-pdf-header.component.html",
  styleUrls: ["./proposta-pdf-header.component.scss"],
})
export class PropostaPdfHeaderComponent {
  @Input({ required: true }) config!: ConfiguracaoProposta;
  @Input({ required: true }) proposta!: PropostaVisualizacaoData;
}
