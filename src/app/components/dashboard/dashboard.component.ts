import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../shared';
import { DashboardService } from '../../core/api/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardMetricas, DashboardWidgetConfig, WIDGETS_DEFAULT } from '../../models/dashboard.model';
import { DashboardKpisComponent } from './components/dashboard-kpis/dashboard-kpis.component';
import { DashboardAcoesRapidasComponent } from './components/dashboard-acoes-rapidas/dashboard-acoes-rapidas.component';
import { DashboardGraficosComponent } from './components/dashboard-graficos/dashboard-graficos.component';
import { DashboardTabelasComponent } from './components/dashboard-tabelas/dashboard-tabelas.component';
import { PersonalizarDashboardModalComponent } from '../../dialogs/dashboard/personalizar-dashboard-modal/personalizar-dashboard-modal.component';
import { CriarProjetoModalComponent } from '../../dialogs/projetos/criar-projeto-modal/criar-projeto-modal.component';
import { NovoLeadModalComponent } from '../../dialogs/leads/novo-lead-modal/novo-lead-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CORE_IMPORTS,
    DESIGN_SYSTEM,
    DashboardKpisComponent,
    DashboardAcoesRapidasComponent,
    DashboardGraficosComponent,
    DashboardTabelasComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  loading = true;
  salvandoPreferencias = false;
  metricas: DashboardMetricas | null = null;
  widgets: DashboardWidgetConfig[] = [...WIDGETS_DEFAULT];

  currentUser$ = this.authService.currentUser$;

  get widgetsOrdenados(): DashboardWidgetConfig[] {
    return [...this.widgets].sort((a, b) => a.ordem - b.ordem);
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.dashboardService.obterMetricas().subscribe({
      next: (dados) => {
        this.metricas = dados;
        this.carregarPreferencias();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar métricas do dashboard', err);
        this.notificationService.error('Não foi possível carregar as métricas do dashboard.');
      }
    });
  }

  private carregarPreferencias(): void {
    this.dashboardService.obterPreferencias().subscribe({
      next: (pref) => {
        this.loading = false;
        if (pref && pref.layoutJson) {
          try {
            const configuracoesSalvas = JSON.parse(pref.layoutJson) as DashboardWidgetConfig[];
            if (Array.isArray(configuracoesSalvas) && configuracoesSalvas.length > 0) {
              this.mesclarPreferencias(configuracoesSalvas);
            }
          } catch (e) {
            console.warn('Erro ao processar JSON de preferências do dashboard', e);
          }
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private mesclarPreferencias(salvas: DashboardWidgetConfig[]): void {
    const mapaSalvas = new Map(salvas.map(s => [s.id, s]));
    this.widgets = WIDGETS_DEFAULT.map((padrao, index) => {
      const salva = mapaSalvas.get(padrao.id);
      if (salva) {
        return {
          ...padrao,
          visivel: salva.visivel ?? padrao.visivel,
          ordem: salva.ordem ?? (index + 1)
        };
      }
      return { ...padrao, ordem: index + 1 };
    }).sort((a, b) => a.ordem - b.ordem);
  }

  isWidgetGrafico(id: string): boolean {
    return id.startsWith('grafico_');
  }

  isWidgetTabela(id: string): boolean {
    return id.startsWith('tabela_') || id.startsWith('lista_');
  }

  formatarMoeda(valor: number): string {
    const v = valor || 0;
    return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatarMoedaInteiro(valor: number): string {
    const v = valor || 0;
    return `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  }

  abrirModalPersonalizar(): void {
    const ref = this.dialogService.open(PersonalizarDashboardModalComponent, {
      data: {
        show: true,
        widgets: this.widgets,
        salvando: this.salvandoPreferencias
      }
    });

    ref.instance.salvar.subscribe((novosWidgets: DashboardWidgetConfig[]) => {
      this.salvarPreferencias(novosWidgets, ref);
    });

    ref.instance.restaurar.subscribe(() => {
      this.restaurarPadrao(ref);
    });
  }

  private salvarPreferencias(novosWidgets: DashboardWidgetConfig[], modalRef: any): void {
    this.salvandoPreferencias = true;
    modalRef.instance.salvando = true;

    const payload = JSON.stringify(novosWidgets);
    this.dashboardService.salvarPreferencias(payload).subscribe({
      next: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.widgets = [...novosWidgets].sort((a, b) => a.ordem - b.ordem);
        this.notificationService.success('Layout do painel personalizado com sucesso!');
        modalRef.instance.onClose();
      },
      error: (err) => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        console.error('Erro ao salvar preferências no banco', err);
        this.notificationService.error('Erro ao salvar preferências do painel.');
      }
    });
  }

  private restaurarPadrao(modalRef: any): void {
    this.salvandoPreferencias = true;
    modalRef.instance.salvando = true;

    const padrao = WIDGETS_DEFAULT.map((w, idx) => ({ ...w, ordem: idx + 1 }));
    const payload = JSON.stringify(padrao);

    this.dashboardService.salvarPreferencias(payload).subscribe({
      next: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.widgets = [...padrao];
        this.notificationService.success('Layout padrão restaurado com sucesso!');
        modalRef.instance.onClose();
      },
      error: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.notificationService.error('Erro ao restaurar layout padrão.');
      }
    });
  }

  abrirModalCriarProjeto(): void {
    const ref = this.dialogService.open(CriarProjetoModalComponent);
    ref.instance.projectCreated.subscribe(() => {
      this.carregarDados();
    });
  }

  abrirModalCriarLead(): void {
    const ref = this.dialogService.open(NovoLeadModalComponent);
    ref.instance.saved.subscribe(() => {
      this.carregarDados();
    });
  }
}
