import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../../shared';
import { CategoriaDespesa, DespesaProjeto } from '../../../../models/financeiro.model';

@Component({
  selector: 'app-financeiro-tabela-despesas',
  standalone: true,
  imports: [CommonModule, FormsModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './financeiro-tabela-despesas.component.html',
  styleUrl: './financeiro-tabela-despesas.component.scss'
})
export class FinanceiroTabelaDespesasComponent {
  protected readonly Math = Math;
  @Input() despesas: DespesaProjeto[] = [];
  @Output() excluir = new EventEmitter<string>();
  @Output() novaDespesa = new EventEmitter<void>();

  busca = '';
  filtroCategoria: string = 'todas';
  paginaAtual = 1;
  itensPorPagina = 8;

  categoriaLabels: { [key: string]: string } = {
    'PlotagemImpressao': 'Plotagem & Impressão',
    'DeslocamentoVisita': 'Deslocamento / Visitas',
    'SoftwareLicencas': 'Softwares & Licenças',
    'Subcontratacao': 'Subcontratação',
    'TaxasPrefeitura': 'Taxas Prefeitura',
    'Maquetes3D': 'Maquetes 3D',
    'Outros': 'Outros'
  };

  get despesasFiltradas(): DespesaProjeto[] {
    let lista = this.despesas || [];

    if (this.filtroCategoria !== 'todas') {
      lista = lista.filter(d => d.categoria === this.filtroCategoria || d.categoriaNome === this.filtroCategoria);
    }

    if (this.busca.trim()) {
      const termo = this.busca.toLowerCase().trim();
      lista = lista.filter(d =>
        (d.projetoNome && d.projetoNome.toLowerCase().includes(termo)) ||
        (d.descricao && d.descricao.toLowerCase().includes(termo))
      );
    }

    return lista;
  }

  get despesasPaginadas(): DespesaProjeto[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.despesasFiltradas.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.despesasFiltradas.length / this.itensPorPagina) || 1;
  }

  get totalValorDespesas(): number {
    return this.despesasFiltradas.reduce((sum, d) => sum + d.valor, 0);
  }

  setCategoria(cat: string): void {
    this.filtroCategoria = cat;
    this.paginaAtual = 1;
  }

  mudarPagina(delta: number): void {
    const nova = this.paginaAtual + delta;
    if (nova >= 1 && nova <= this.totalPaginas) {
      this.paginaAtual = nova;
    }
  }

  getCategoriaLabel(cat: string): string {
    return this.categoriaLabels[cat] || cat;
  }

  onExcluir(id: string): void {
    this.excluir.emit(id);
  }

  onNovaDespesa(): void {
    this.novaDespesa.emit();
  }
}
