import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguracaoProposta } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";

@Component({
  selector: "app-proposta-pdf-condicoes",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./proposta-pdf-condicoes.component.html",
  styleUrls: ["./proposta-pdf-condicoes.component.scss"],
})
export class PropostaPdfCondicoesComponent {
  @Input({ required: true }) config!: ConfiguracaoProposta;
  @Input({ required: true }) proposta!: PropostaVisualizacaoData;
}
