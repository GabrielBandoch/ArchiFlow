import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lead } from '../../../models/lead.model';
import { LeadService } from '../../../core/api/leads/lead.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-selecionar-lead-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, ButtonComponent],
  templateUrl: './selecionar-lead-modal.component.html',
  styleUrl: './selecionar-lead-modal.component.scss'
})
export class SelecionarLeadModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() leads: Lead[] = [];
  @Input() initialSearchText = '';

  @Output() close = new EventEmitter<void>();
  @Output() leadSelected = new EventEmitter<Lead>();

  private leadService = inject(LeadService, { optional: true });

  modalSearchText = '';
  modalLeadsFiltrados: Lead[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;

  get totalPaginas(): number {
    return Math.ceil(this.modalLeadsFiltrados.length / this.itensPorPagina) || 1;
  }

  get leadsPaginados(): Lead[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.modalLeadsFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  ngOnInit(): void {
    this.modalSearchText = this.initialSearchText || '';
    if ((!this.leads || this.leads.length === 0) && this.leadService) {
      this.leadService.obterTodos().subscribe({
        next: (data) => {
          this.leads = data;
          this.filtrarModal();
        },
        error: (err) => console.error('Erro ao buscar leads no modal', err)
      });
    } else {
      this.filtrarModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.modalSearchText = this.initialSearchText || '';
      this.filtrarModal();
    }
    if (changes['leads']) {
      this.filtrarModal();
    }
  }

  filtrarModal(): void {
    let result = this.leads || [];
    if (this.modalSearchText.trim()) {
      const q = this.modalSearchText.toLowerCase();
      result = result.filter(l => 
        l.nome.toLowerCase().includes(q) || 
        (l.email && l.email.toLowerCase().includes(q)) || 
        (l.telefone && l.telefone.toLowerCase().includes(q)) ||
        (l.statusLabel && l.statusLabel.toLowerCase().includes(q)) ||
        (l.origem && l.origem.toLowerCase().includes(q))
      );
    }
    this.modalLeadsFiltrados = result;
    this.paginaAtual = 1;
  }

  selecionarViaModal(lead: Lead): void {
    this.leadSelected.emit(lead);
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
