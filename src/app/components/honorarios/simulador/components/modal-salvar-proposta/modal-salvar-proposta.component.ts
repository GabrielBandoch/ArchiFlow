import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DESIGN_SYSTEM } from '../../../../../shared';
import { Cliente } from '../../../../../models/cliente.model';
import { Lead } from '../../../../../models/lead.model';
import { SimulacaoResultado } from '../../../../../models/honorario.model';

@Component({
  selector: 'app-modal-salvar-proposta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DESIGN_SYSTEM],
  templateUrl: './modal-salvar-proposta.component.html',
  styleUrl: './modal-salvar-proposta.component.scss'
})
export class ModalSalvarPropostaComponent {
  @Input() show = false;
  @Input({ required: true }) form!: FormGroup;
  @Input() simulacao?: SimulacaoResultado;
  @Input() leads: Lead[] = [];
  @Input() clientes: Cliente[] = [];
  @Input() salvando = false;

  @Output() close = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
