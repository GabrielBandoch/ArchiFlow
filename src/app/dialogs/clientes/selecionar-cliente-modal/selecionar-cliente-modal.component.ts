import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-selecionar-cliente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, ButtonComponent],
  templateUrl: './selecionar-cliente-modal.component.html',
  styleUrl: './selecionar-cliente-modal.component.scss'
})
export class SelecionarClienteModalComponent implements OnInit {
  @Input() show = false;
  @Input() clientes: Cliente[] = [];
  @Input() initialSearchText = '';

  @Output() close = new EventEmitter<void>();
  @Output() clientSelected = new EventEmitter<Cliente>();

  private clienteService = inject(ClienteService, { optional: true });

  modalSearchText = '';
  modalClientesFiltrados: Cliente[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;

  get totalPaginas(): number {
    return Math.ceil(this.modalClientesFiltrados.length / this.itensPorPagina) || 1;
  }

  get clientesPaginados(): Cliente[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.modalClientesFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  ngOnInit(): void {
    this.modalSearchText = this.initialSearchText || '';
    if ((!this.clientes || this.clientes.length === 0) && this.clienteService) {
      this.clienteService.obterTodos().subscribe({
        next: (data) => {
          this.clientes = data;
          this.filtrarModal();
        },
        error: (err) => console.error('Erro ao buscar clientes no modal', err)
      });
    } else {
      this.filtrarModal();
    }
  }

  filtrarModal(): void {
    let result = this.clientes || [];
    if (this.modalSearchText.trim()) {
      const q = this.modalSearchText.toLowerCase();
      result = result.filter(c => 
        c.nome.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.cpfCnpj && c.cpfCnpj.toLowerCase().includes(q)) || 
        (c.telefone && c.telefone.toLowerCase().includes(q))
      );
    }
    this.modalClientesFiltrados = result;
    this.paginaAtual = 1;
  }

  selecionarViaModal(cliente: Cliente): void {
    this.clientSelected.emit(cliente);
    this.onClose();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
