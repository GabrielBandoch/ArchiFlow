import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../../shared';
import { ParcelaFinanceira, StatusParcela } from '../../../../models/financeiro.model';

@Component({
  selector: 'app-financeiro-tabela-parcelas',
  standalone: true,
  imports: [CommonModule, FormsModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './financeiro-tabela-parcelas.component.html',
  styleUrl: './financeiro-tabela-parcelas.component.scss'
})
export class FinanceiroTabelaParcelasComponent implements OnInit {
  protected readonly Math = Math;
  @Input() parcelas: ParcelaFinanceira[] = [];
  @Output() darBaixa = new EventEmitter<ParcelaFinanceira>();
  @Output() excluir = new EventEmitter<string>();
  @Output() novaParcela = new EventEmitter<void>();

  busca = '';
  filtroStatus: 'todos' | 'Pendente' | 'Pago' | 'Atrasado' = 'todos';
  paginaAtual = 1;
  itensPorPagina = 8;

  ngOnInit(): void {}

  get parcelasFiltradas(): ParcelaFinanceira[] {
    let lista = this.parcelas || [];

    if (this.filtroStatus !== 'todos') {
      lista = lista.filter(p => p.status === this.filtroStatus);
    }

    if (this.busca.trim()) {
      const termo = this.busca.toLowerCase().trim();
      lista = lista.filter(p =>
        (p.projetoNome && p.projetoNome.toLowerCase().includes(termo)) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
        (p.clienteNome && p.clienteNome.toLowerCase().includes(termo))
      );
    }

    return lista;
  }

  get parcelasPaginadas(): ParcelaFinanceira[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.parcelasFiltradas.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.parcelasFiltradas.length / this.itensPorPagina) || 1;
  }

  setFiltro(status: 'todos' | 'Pendente' | 'Pago' | 'Atrasado'): void {
    this.filtroStatus = status;
    this.paginaAtual = 1;
  }

  mudarPagina(delta: number): void {
    const nova = this.paginaAtual + delta;
    if (nova >= 1 && nova <= this.totalPaginas) {
      this.paginaAtual = nova;
    }
  }

  onDarBaixa(parcela: ParcelaFinanceira): void {
    this.darBaixa.emit(parcela);
  }

  onExcluir(id: string): void {
    this.excluir.emit(id);
  }

  onNovaParcela(): void {
    this.novaParcela.emit();
  }
}
