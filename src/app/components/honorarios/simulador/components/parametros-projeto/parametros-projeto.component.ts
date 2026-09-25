import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-parametros-projeto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parametros-projeto.component.html',
  styleUrl: './parametros-projeto.component.scss'
})
export class ParametrosProjetoComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() padroesImovel: Array<{ valor: number; nome: string; fator: string }> = [];
  @Input() tiposProjeto: Array<{ valor: number; nome: string }> = [];
  @Output() padraoSelecionado = new EventEmitter<number>();

  onSelectPadrao(valor: number): void {
    this.padraoSelecionado.emit(valor);
  }
}
