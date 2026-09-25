import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../shared';
import { DashboardService } from '../../core/api/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  DashboardMetricas,
  DashboardWidgetConfig,
  ProjetosPorStatus,
  ProjetosPorTipo,
  LeadsPorStatus,
  LeadsPorOrigem,
  PropostasMensal,
  ProjetoResumoDashboard,
  LeadResumoDashboard,
  PropostaResumoDashboard
} from '../../models/dashboard.model';

export const WIDGETS_DEFAULT: DashboardWidgetConfig[] = [
  { id: 'kpi_resumo', titulo: 'Indicadores Chave (KPIs)', icone: 'insights', visivel: true, ordem: 1, largura: 'full' },
  { id: 'atalhos_rapidos', titulo: 'Ações Rápidas', icone: 'bolt', visivel: true, ordem: 2, largura: 'full' },
  { id: 'grafico_projetos_status', titulo: 'Projetos por Fase', icone: 'pie_chart', visivel: true, ordem: 3, largura: 'half' },
  { id: 'grafico_projetos_tipo', titulo: 'Tipologias de Projetos', icone: 'bar_chart', visivel: true, ordem: 4, largura: 'half' },
  { id: 'grafico_funil_leads', titulo: 'Funil Comercial de Leads', icone: 'filter_alt', visivel: true, ordem: 5, largura: 'half' },
  { id: 'grafico_origens_lead', titulo: 'Origem dos Contatos', icone: 'hub', visivel: true, ordem: 6, largura: 'half' },
  { id: 'grafico_propostas_mensal', titulo: 'Evolução de Propostas (6 meses)', icone: 'query_stats', visivel: true, ordem: 7, largura: 'full' },
  { id: 'tabela_projetos_recentes', titulo: 'Projetos Recentes', icone: 'folder_open', visivel: true, ordem: 8, largura: 'full' },
  { id: 'lista_leads_recentes', titulo: 'Leads Recentes', icone: 'person_search', visivel: true, ordem: 9, largura: 'half' },
  { id: 'lista_propostas_recentes', titulo: 'Propostas de Honorários Recentes', icone: 'request_quote', visivel: true, ordem: 10, largura: 'half' }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  loading = true;
  salvandoPreferencias = false;
  modalPersonalizarAberto = false;

  metricas: DashboardMetricas | null = null;
  widgets: DashboardWidgetConfig[] = [...WIDGETS_DEFAULT];

  currentUser$ = this.authService.currentUser$;
  dataHoje = new Date();

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;

    this.dashboardService.obterPreferencias().subscribe({
      next: (pref) => {
        if (pref && pref.layoutJson) {
          try {
            const savedWidgets: DashboardWidgetConfig[] = JSON.parse(pref.layoutJson);
            if (Array.isArray(savedWidgets) && savedWidgets.length > 0) {
              this.mesclarWidgetsSalvos(savedWidgets);
            }
          } catch {
            this.widgets = [...WIDGETS_DEFAULT];
          }
        }
        this.carregarMetricas();
      },
      error: () => {
        this.carregarMetricas();
      }
    });
  }

  carregarMetricas(): void {
    this.dashboardService.obterMetricas().subscribe({
      next: (data) => {
        this.metricas = data;
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error('Erro ao carregar os dados do Dashboard.');
        this.loading = false;
      }
    });
  }

  private mesclarWidgetsSalvos(savedWidgets: DashboardWidgetConfig[]): void {
    const map = new Map(savedWidgets.map(w => [w.id, w]));
    const merged: DashboardWidgetConfig[] = [];

    for (const saved of savedWidgets) {
      const defaultW = WIDGETS_DEFAULT.find(d => d.id === saved.id);
      if (defaultW) {
        merged.push({
          ...defaultW,
          visivel: saved.visivel,
          ordem: saved.ordem,
          largura: saved.largura || defaultW.largura
        });
      }
    }

    for (const def of WIDGETS_DEFAULT) {
      if (!map.has(def.id)) {
        merged.push({ ...def, ordem: merged.length + 1 });
      }
    }

    this.widgets = merged.sort((a, b) => a.ordem - b.ordem);
  }

  get widgetsVisiveis(): DashboardWidgetConfig[] {
    return this.widgets.filter(w => w.visivel).sort((a, b) => a.ordem - b.ordem);
  }

  abrirModalPersonalizar(): void {
    this.modalPersonalizarAberto = true;
  }

  fecharModalPersonalizar(): void {
    this.modalPersonalizarAberto = false;
  }

  moverWidget(index: number, direcao: 'up' | 'down'): void {
    const targetIndex = direcao === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.widgets.length) return;

    const temp = this.widgets[index];
    this.widgets[index] = this.widgets[targetIndex];
    this.widgets[targetIndex] = temp;

    this.widgets.forEach((w, i) => w.ordem = i + 1);
  }

  toggleVisibilidade(widget: DashboardWidgetConfig): void {
    widget.visivel = !widget.visivel;
  }

  restaurarPadrao(): void {
    this.widgets = WIDGETS_DEFAULT.map(w => ({ ...w }));
    this.salvarPreferenciasNoBanco(true);
  }

  salvarPreferencias(): void {
    this.salvarPreferenciasNoBanco(false);
  }

  private salvarPreferenciasNoBanco(isReset: boolean): void {
    this.salvandoPreferencias = true;
    const json = JSON.stringify(this.widgets);

    this.dashboardService.salvarPreferencias(json).subscribe({
      next: () => {
        this.salvandoPreferencias = false;
        this.modalPersonalizarAberto = false;
        this.notificationService.success(
          isReset 
            ? 'Layout padrão restaurado e salvo no banco de dados!' 
            : 'Personalização do painel salva com sucesso no banco de dados!'
        );
      },
      error: () => {
        this.salvandoPreferencias = false;
        this.notificationService.error('Não foi possível salvar as preferências no banco.');
      }
    });
  }

  // Cores Temáticas para Gráficos
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'briefing': return '#a38267';
      case 'desenvolvimento': return '#765538';
      case 'revisao': return '#916d4e';
      case 'aprovacao': return '#d4a373';
      case 'execucao': return '#588157';
      case 'concluido': return '#3a5a40';
      case 'cancelado': return '#ba1a1a';
      default: return '#81756b';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'residencial': return '#765538';
      case 'comercial': return '#916d4e';
      case 'corporativo': return '#685c51';
      case 'interiores': return '#b08968';
      default: return '#81756b';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'residencial': return 'home';
      case 'comercial': return 'storefront';
      case 'corporativo': return 'domain';
      case 'interiores': return 'chair';
      default: return 'architecture';
    }
  }

  getLeadStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'novo lead':
      case 'novo': return 'badge-info';
      case 'em contato':
      case 'emcontato': return 'badge-primary';
      case 'proposta enviada':
      case 'propostaenviada': return 'badge-warning';
      case 'em negociação':
      case 'negociando': return 'badge-accent';
      case 'convertido em cliente':
      case 'convertido': return 'badge-success';
      case 'oportunidade perdida':
      case 'perdido': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getPropostaStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'aprovada': return 'badge-success';
      case 'enviada': return 'badge-info';
      case 'recusada': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarMoedaInteiro(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  calcularMaxValorPropostas(propostas: PropostasMensal[]): number {
    if (!propostas || propostas.length === 0) return 1;
    const max = Math.max(...propostas.map(p => p.valorTotal));
    return max > 0 ? max : 1;
  }

  calcularSvgDonutSegments(itens: ProjetosPorStatus[]): { path: string; color: string; item: ProjetosPorStatus }[] {
    if (!itens || itens.length === 0) return [];
    const total = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
    if (total === 0) return [];

    let currentAngle = 0;
    const radius = 70;
    const cx = 90;
    const cy = 90;

    return itens
      .filter(i => i.quantidade > 0)
      .map(item => {
        const sliceAngle = (item.quantidade / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const isFullCircle = sliceAngle >= 359.99;
        const largeArc = sliceAngle > 180 ? 1 : 0;

        if (isFullCircle) {
          const path = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.001} ${cy - radius}`;
          return { path, color: this.getStatusColor(item.status), item };
        }

        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
        return { path, color: this.getStatusColor(item.status), item };
      });
  }
}
