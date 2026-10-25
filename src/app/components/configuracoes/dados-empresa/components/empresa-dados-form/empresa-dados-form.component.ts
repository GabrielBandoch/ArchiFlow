import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";

@Component({
  selector: "app-empresa-dados-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: "./empresa-dados-form.component.html",
  styleUrls: ["./empresa-dados-form.component.scss"],
})
export class EmpresaDadosFormComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() salvando = false;
  @Input() buscandoCep = false;

  @Output() salvar = new EventEmitter<void>();
  @Output() cnpjInput = new EventEmitter<Event>();
  @Output() telefoneInput = new EventEmitter<Event>();
  @Output() cepInput = new EventEmitter<Event>();
  @Output() cepChange = new EventEmitter<string>();

  get f() {
    return this.formGroup.controls;
  }
}
