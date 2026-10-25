import { Component, Input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguracaoProposta } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";
import { ConfiguracaoPropostaService } from "../../../../../core/services/configuracao-proposta.service";

@Component({
  selector: "app-proposta-pdf-etapas",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./proposta-pdf-etapas.component.html",
  styleUrls: ["./proposta-pdf-etapas.component.scss"],
})
export class PropostaPdfEtapasComponent {
  private configService = inject(ConfiguracaoPropostaService);

  @Input({ required: true }) config!: ConfiguracaoProposta;
  @Input({ required: true }) proposta!: PropostaVisualizacaoData;

  formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }
}
