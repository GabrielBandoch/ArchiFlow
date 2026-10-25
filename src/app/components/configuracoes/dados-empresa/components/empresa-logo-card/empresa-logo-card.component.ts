import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: "app-empresa-logo-card",
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  templateUrl: "./empresa-logo-card.component.html",
  styleUrls: ["./empresa-logo-card.component.scss"],
})
export class EmpresaLogoCardComponent {
  @Input() logoUrl?: string | null = null;
  @Input() enviandoLogo = false;

  @Output() logoSelecionado = new EventEmitter<Event>();
  @Output() removerLogo = new EventEmitter<void>();

  onFileChange(event: Event): void {
    this.logoSelecionado.emit(event);
  }
}
