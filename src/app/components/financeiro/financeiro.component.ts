import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../shared';
import { FinanceiroService } from '../../core/api/financeiro/financeiro.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  AlertaFinanceiro,
  DespesaProjeto,
  PainelFinanceiro,
  ParcelaFinanceira,
  ReceitaMes
} from '../../models/financeiro.model';
import { FinanceiroKpisComponent } from './components/financeiro-kpis/financeiro-kpis.component';
import { FinanceiroGraficoComponent } from './components/financeiro-grafico/financeiro-grafico.component';
import { FinanceiroAlertasComponent } from './components/financeiro-alertas/financeiro-alertas.component';
import { FinanceiroTabelaParcelasComponent } from './components/financeiro-tabela-parcelas/financeiro-tabela-parcelas.component';
import { FinanceiroTabelaDespesasComponent } from './components/financeiro-tabela-despesas/financeiro-tabela-despesas.component';
import { DarBaixaParcelaModalComponent } from '../../dialogs/financeiro/dar-baixa-parcela-modal/dar-baixa-parcela-modal.component';
import { CriarParcelaModalComponent } from '../../dialogs/financeiro/criar-parcela-modal/criar-parcela-modal.component';
import { CriarDespesaModalComponent } from '../../dialogs/financeiro/criar-despesa-modal/criar-despesa-modal.component';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CORE_IMPORTS,
    DESIGN_SYSTEM,
    FinanceiroKpisComponent,
    FinanceiroGraficoComponent,
    FinanceiroAlertasComponent,
    FinanceiroTabelaParcelasComponent,
    FinanceiroTabelaDespesasComponent,
    DarBaixaParcelaModalComponent,
    CriarParcelaModalComponent,
    CriarDespesaModalComponent
  ],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent implements OnInit {
  private financeiroService = inject(FinanceiroService);
  private notificationService = inject(NotificationService);

  loading = true;
  abaAtiva: 'geral' | 'despesas' = 'geral';

  painel: PainelFinanceiro | null = null;
  parcelas: ParcelaFinanceira[] = [];
  despesas: DespesaProjeto[] = [];
  alertas: AlertaFinanceiro[] = [];
  receitasPorMes: ReceitaMes[] = [];

  showBaixaModal = false;
  selectedParcelaParaBaixa: ParcelaFinanceira | null = null;

  showNovaParcelaModal = false;
  showNovaDespesaModal = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;

    forkJoin({
      painel: this.financeiroService.obterPainel(),
      parcelas: this.financeiroService.obterParcelas(),
      despesas: this.financeiroService.obterDespesas()
    }).subscribe({
      next: ({ painel, parcelas, despesas }) => {
        this.painel = painel;
        this.alertas = painel?.alertas || [];
        this.receitasPorMes = painel?.receitasPorMes || [];
        this.parcelas = parcelas || [];
        this.despesas = despesas || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar dados financeiros', err);
        this.notificationService.error('Erro ao carregar dados financeiros.');
      }
    });
  }

  setAba(aba: 'geral' | 'despesas'): void {
    this.abaAtiva = aba;
  }

  abrirModalBaixa(parcela: ParcelaFinanceira): void {
    this.selectedParcelaParaBaixa = parcela;
    this.showBaixaModal = true;
  }

  abrirModalBaixaPorId(parcelaId: string): void {
    const p = this.parcelas.find(item => item.id === parcelaId);
    if (p) {
      this.abrirModalBaixa(p);
    } else {
      this.financeiroService.obterParcelaPorId(parcelaId).subscribe({
        next: (parc) => this.abrirModalBaixa(parc),
        error: () => this.notificationService.error('Parcela não encontrada.')
      });
    }
  }

  abrirModalNovaParcela(): void {
    this.showNovaParcelaModal = true;
  }

  abrirModalNovaDespesa(): void {
    this.showNovaDespesaModal = true;
  }

  onParcelaBaixada(): void {
    this.carregarDados();
  }

  onDadosAtualizados(): void {
    this.carregarDados();
  }

  excluirParcela(id: string): void {
    if (!confirm('Deseja realmente excluir este registro de parcela?')) return;

    this.financeiroService.excluirParcela(id).subscribe({
      next: () => {
        this.notificationService.success('Parcela excluída com sucesso!');
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao excluir parcela', err);
        this.notificationService.error('Erro ao excluir parcela.');
      }
    });
  }

  excluirDespesa(id: string): void {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;

    this.financeiroService.excluirDespesa(id).subscribe({
      next: () => {
        this.notificationService.success('Despesa excluída com sucesso!');
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao excluir despesa', err);
        this.notificationService.error('Erro ao excluir despesa.');
      }
    });
  }
}
