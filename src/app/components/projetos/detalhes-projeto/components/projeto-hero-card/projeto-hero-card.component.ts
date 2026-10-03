import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../../../../models/projeto.model';
import { SelectOption } from '../../../../../shared/components/select/select.component';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-projeto-hero-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SelectComponent, ButtonComponent],
  templateUrl: './projeto-hero-card.component.html',
  styleUrl: './projeto-hero-card.component.scss'
})
export class ProjetoHeroCardComponent {
  @Input({ required: true }) projeto!: Projeto;
  @Input() statusProjetoOptions: SelectOption[] = [];

  @Output() statusAlterado = new EventEmitter<any>();
  @Output() editarSolicitado = new EventEmitter<void>();

  onStatusChange(novoStatus: any): void {
    this.statusAlterado.emit(novoStatus);
  }

  onEditar(): void {
    this.editarSolicitado.emit();
  }
}
