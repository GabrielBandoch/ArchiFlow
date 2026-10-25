import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguracaoProposta } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";

@Component({
  selector: "app-proposta-pdf-resumo",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./proposta-pdf-resumo.component.html",
  styleUrls: ["./proposta-pdf-resumo.component.scss"],
})
export class PropostaPdfResumoComponent {
  @Input({ required: true }) config!: ConfiguracaoProposta;
  @Input({ required: true }) proposta!: PropostaVisualizacaoData;
}
