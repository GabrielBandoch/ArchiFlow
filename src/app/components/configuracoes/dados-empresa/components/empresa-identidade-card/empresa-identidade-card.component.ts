import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { BadgeComponent } from "../../../../../shared/components/badge/badge.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";

@Component({
  selector: "app-empresa-identidade-card",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: "./empresa-identidade-card.component.html",
  styleUrls: ["./empresa-identidade-card.component.scss"],
})
export class EmpresaIdentidadeCardComponent {
  @Input() corPrimaria = "#765538";
  @Input() paletaCores: string[] = [];
  @Input() salvandoCor = false;

  @Output() corPrimariaChange = new EventEmitter<string>();
  @Output() selecionarCorPredefinida = new EventEmitter<string>();
  @Output() salvarIdentidadeVisual = new EventEmitter<void>();

  selecionarCor(cor: string): void {
    this.selecionarCorPredefinida.emit(cor);
  }

  onColorPickerInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.corPrimaria = val;
    this.corPrimariaChange.emit(val);
  }

  onHexChange(val: string): void {
    this.corPrimaria = val;
    this.corPrimariaChange.emit(val);
  }
}
