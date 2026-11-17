import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-portal-suporte",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./portal-suporte.component.html",
  styleUrl: "./portal-suporte.component.scss",
})
export class PortalSuporteComponent {
  @Input() nomeEscritorio = "Escritório de Arquitetura";
  @Output() abrirChat = new EventEmitter<void>();

  onAbrirChat(): void {
    this.abrirChat.emit();
  }
}
