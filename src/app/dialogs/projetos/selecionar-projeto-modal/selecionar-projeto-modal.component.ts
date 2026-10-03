import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Projeto } from '../../../models/projeto.model';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-selecionar-projeto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, ButtonComponent],
  templateUrl: './selecionar-projeto-modal.component.html',
  styleUrl: './selecionar-projeto-modal.component.scss'
})
export class SelecionarProjetoModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() projetos: Projeto[] = [];
  @Input() initialSearchText = '';

  @Output() close = new EventEmitter<void>();
  @Output() projectSelected = new EventEmitter<Projeto>();

  private projetoService = inject(ProjetoService, { optional: true });

  modalSearchText = '';
  modalProjetosFiltrados: Projeto[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;

  get totalPaginas(): number {
    return Math.ceil(this.modalProjetosFiltrados.length / this.itensPorPagina) || 1;
  }

  get projetosPaginados(): Projeto[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.modalProjetosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  ngOnInit(): void {
    this.modalSearchText = this.initialSearchText || '';
    if ((!this.projetos || this.projetos.length === 0) && this.projetoService) {
      this.projetoService.obterTodos().subscribe({
        next: (data) => {
          this.projetos = data;
          this.filtrarModal();
        },
        error: (err) => console.error('Erro ao buscar projetos no modal', err)
      });
    } else {
      this.filtrarModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.modalSearchText = this.initialSearchText || '';
      if ((!this.projetos || this.projetos.length === 0) && this.projetoService) {
        this.projetoService.obterTodos().subscribe({
          next: (data) => {
            this.projetos = data;
            this.filtrarModal();
          },
          error: (err) => console.error('Erro ao buscar projetos no modal', err)
        });
      } else {
        this.filtrarModal();
      }
    }
    if (changes['projetos']) {
      this.filtrarModal();
    }
  }

  filtrarModal(): void {
    let result = this.projetos || [];
    if (this.modalSearchText.trim()) {
      const q = this.modalSearchText.toLowerCase();
      result = result.filter(p => 
        p.nome.toLowerCase().includes(q) || 
        (p.clienteNome && p.clienteNome.toLowerCase().includes(q)) || 
        (p.tipoLabel && p.tipoLabel.toLowerCase().includes(q)) ||
        (p.statusLabel && p.statusLabel.toLowerCase().includes(q))
      );
    }
    this.modalProjetosFiltrados = result;
    this.paginaAtual = 1;
  }

  selecionarViaModal(projeto: Projeto): void {
    this.projectSelected.emit(projeto);
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
