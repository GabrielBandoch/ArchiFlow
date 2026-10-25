import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguracaoProposta } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";
import { ConfiguracaoPropostaService } from "../../../../../core/services/configuracao-proposta.service";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: "app-proposta-preview-card",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: "./proposta-preview-card.component.html",
  styleUrls: ["./proposta-preview-card.component.scss"],
})
export class PropostaPreviewCardComponent {
  private configService = inject(ConfiguracaoPropostaService);

  @Input({ required: true }) configAtual!: ConfiguracaoProposta;
  @Input({ required: true }) previewData!: PropostaVisualizacaoData;
  @Output() expandir = new EventEmitter<void>();

  formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }
}
