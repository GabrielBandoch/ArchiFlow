import { Component, OnInit, ComponentRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CORE_IMPORTS, DESIGN_SYSTEM } from "../../shared";
import { DashboardService } from "../../core/api/dashboard/dashboard.service";
import { AuthService } from "../../core/services/auth.service";
import { DialogService } from "../../core/services/dialog.service";
import { NotificationService } from "../../core/services/notification.service";
import {
  DashboardMetricas,
  DashboardWidgetConfig,
  WIDGETS_DEFAULT,
} from "../../core/models/dashboard.model";
import { Compromisso } from "../../core/models/agenda.model";
import { AgendaService } from "../../core/api/agenda/agenda.service";
import {
  DespesaProjeto,
  ParcelaFinanceira,
} from "../../core/models/financeiro.model";
import { FinanceiroService } from "../../core/api/financeiro/financeiro.service";
import { PersonalizarDashboardModalComponent } from "../../dialogs/dashboard/personalizar-dashboard-modal/personalizar-dashboard-modal.component";
import { CriarProjetoModalComponent } from "../../dialogs/projetos/criar-projeto-modal/criar-projeto-modal.component";
import { NovoLeadModalComponent } from "../../dialogs/leads/novo-lead-modal/novo-lead-modal.component";
import { CompromissoModalComponent } from "../../dialogs/agenda/compromisso-modal/compromisso-modal.component";
import { DashboardPendenciasHojeComponent } from "./components/dashboard-pendencias-hoje/dashboard-pendencias-hoje.component";
import { DashboardFinanceiroSemanaComponent } from "./components/dashboard-financeiro-semana/dashboard-financeiro-semana.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CORE_IMPORTS,
    DESIGN_SYSTEM,
    DashboardPendenciasHojeComponent,
    DashboardFinanceiroSemanaComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);
  private agendaService = inject(AgendaService);
  private financeiroService = inject(FinanceiroService);

  loading = true;
  salvandoPreferencias = false;
  metricas: DashboardMetricas | null = null;
  widgets: DashboardWidgetConfig[] = [...WIDGETS_DEFAULT];

  currentUser$ = this.authService.currentUser$;

  compromissosHoje: Compromisso[] = [];
  carregandoAgenda = false;

  contasPagarSemana: DespesaProjeto[] = [];
  totalPagarSemana = 0;

  recebiveisSemana: ParcelaFinanceira[] = [];
  totalReceberSemana = 0;
  parcelasAtrasadas: ParcelaFinanceira[] = [];
  carregandoFinanceiro = false;

  get widgetsOrdenados(): DashboardWidgetConfig[] {
    return [...this.widgets].sort((a, b) => a.ordem - b.ordem);
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.carregandoAgenda = true;
    this.carregandoFinanceiro = true;

    this.dashboardService.obterMetricas().subscribe({
      next: (dados) => {
        this.metricas = dados;
        this.loading = false;
        this.carregarPreferencias();
      },
      error: () => {
        this.loading = false;
        this.notificationService.error(
          "Não foi possível carregar as métricas do dashboard.",
        );
      },
    });

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth();
    const dia = agora.getDate();
    const inicioHoje = new Date(ano, mes, dia, 0, 0, 0).toISOString();
    const fimHoje = new Date(ano, mes, dia, 23, 59, 59, 999).toISOString();

    const agendaReq$ = this.agendaService.obterPorPeriodo
      ? this.agendaService.obterPorPeriodo(inicioHoje, fimHoje)
      : this.agendaService.obterProximos(15);

    agendaReq$.subscribe({
      next: (itens) => {
        this.carregandoAgenda = false;
        this.compromissosHoje = (itens || []).filter((c) => {
          if (c.status === "Cancelado") return false;
          const dt = new Date(c.dataHoraInicio);
          return (
            dt.getFullYear() === ano &&
            dt.getMonth() === mes &&
            dt.getDate() === dia
          );
        });
      },
      error: () => {
        this.carregandoAgenda = false;
        this.compromissosHoje = [];
      },
    });

    this.carregarDadosFinanceiros();
  }

  carregarDadosFinanceiros(): void {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diffSegunda = hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1);
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(diffSegunda);
    const ultimoDia = new Date(primeiroDia);
    ultimoDia.setDate(primeiroDia.getDate() + 6);

    const inicioSemana = primeiroDia.toISOString().split("T")[0];
    const fimSemana = ultimoDia.toISOString().split("T")[0];
    const hojeStr = hoje.toISOString().split("T")[0];

    this.financeiroService
      .obterDespesas({ inicio: inicioSemana, fim: fimSemana })
      .subscribe({
        next: (despesas) => {
          this.contasPagarSemana = (despesas || []).filter((d) => !d.pago);
          this.totalPagarSemana = this.contasPagarSemana.reduce(
            (acc, d) => acc + (d.valor || 0),
            0,
          );
        },
        error: () => {},
      });

    this.financeiroService.obterParcelas().subscribe({
      next: (parcelas) => {
        this.carregandoFinanceiro = false;
        this.recebiveisSemana = parcelas.filter(
          (p) =>
            p.status === "Pendente" &&
            p.dataVencimento >= inicioSemana &&
            p.dataVencimento <= fimSemana,
        );
        this.totalReceberSemana = this.recebiveisSemana.reduce(
          (acc, p) => acc + (p.valor || 0),
          0,
        );

        this.parcelasAtrasadas = parcelas.filter(
          (p) =>
            p.status === "Atrasado" ||
            (p.status === "Pendente" && p.dataVencimento < hojeStr),
        );
      },
      error: () => {
        this.carregandoFinanceiro = false;
      },
    });
  }

  marcarDespesaPaga(desp: DespesaProjeto): void {
    this.financeiroService.alternarPagamentoDespesa(desp.id, true).subscribe({
      next: () => {
        this.notificationService.success("Despesa marcada como paga!");
        this.carregarDadosFinanceiros();
      },
      error: (err) => {
        console.error("Erro ao marcar despesa como paga", err);
        this.notificationService.error("Erro ao marcar despesa como paga.");
      },
    });
  }

  private carregarPreferencias(): void {
    this.dashboardService.obterPreferencias().subscribe({
      next: (pref) => {
        if (pref && pref.layoutJson) {
          try {
            const configuracoesSalvas = JSON.parse(
              pref.layoutJson,
            ) as DashboardWidgetConfig[];
            if (
              Array.isArray(configuracoesSalvas) &&
              configuracoesSalvas.length > 0
            ) {
              this.mesclarPreferencias(configuracoesSalvas);
            }
          } catch {
            this.widgets = [...WIDGETS_DEFAULT];
          }
        }
      },
      error: () => {
        this.widgets = [...WIDGETS_DEFAULT];
      },
    });
  }

  private mesclarPreferencias(salvas: DashboardWidgetConfig[]): void {
    const mapaSalvas = new Map(salvas.map((s) => [s.id, s]));
    this.widgets = WIDGETS_DEFAULT.map((padrao, index) => {
      const salva = mapaSalvas.get(padrao.id);
      if (salva) {
        return {
          ...padrao,
          visivel: salva.visivel ?? padrao.visivel,
          ordem: salva.ordem ?? index + 1,
        };
      }
      return { ...padrao, ordem: index + 1 };
    }).sort((a, b) => a.ordem - b.ordem);
  }

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return "R$ 0,00";
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return "-";
    try {
      const parts = dataStr.split("T")[0].split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
      return dataStr;
    } catch {
      return dataStr;
    }
  }

  get saudacao(): string {
    const user = this.authService.currentUserValue;
    if (
      !user?.nome ||
      user.nome.trim().toLowerCase() === "usuário" ||
      user.nome.trim().toLowerCase() === "usuario"
    ) {
      return "Bom dia!";
    }
    const primeiroNome = user.nome.trim().split(" ")[0];
    return `Olá, ${primeiroNome}`;
  }

  formatarHora(dataHoraStr?: string): string {
    if (!dataHoraStr) return "";
    try {
      const d = new Date(dataHoraStr);
      return d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  dataHojeExtenso(): string {
    const hoje = new Date();
    const diaSemana = hoje.toLocaleDateString("pt-BR", { weekday: "long" });
    const diaSemanaCap = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    const dia = hoje.getDate();
    const mes = hoje.toLocaleDateString("pt-BR", { month: "long" });
    return `${diaSemanaCap}, ${dia} de ${mes}`;
  }

  abrirModalPersonalizar(): void {
    const ref: ComponentRef<PersonalizarDashboardModalComponent> =
      this.dialogService.open(PersonalizarDashboardModalComponent, {
        data: {
          show: true,
          widgets: this.widgets,
          salvando: this.salvandoPreferencias,
        },
      });

    ref.instance.salvar.subscribe((novosWidgets: DashboardWidgetConfig[]) => {
      this.salvarPreferencias(novosWidgets, ref);
    });

    ref.instance.restaurar.subscribe(() => {
      this.restaurarPadrao(ref);
    });
  }

  private salvarPreferencias(
    novosWidgets: DashboardWidgetConfig[],
    modalRef: ComponentRef<PersonalizarDashboardModalComponent>,
  ): void {
    this.salvandoPreferencias = true;
    modalRef.instance.salvando = true;

    const payload = JSON.stringify(novosWidgets);
    this.dashboardService.salvarPreferencias(payload).subscribe({
      next: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.widgets = [...novosWidgets].sort((a, b) => a.ordem - b.ordem);
        this.notificationService.success(
          "Layout do painel personalizado com sucesso!",
        );
        modalRef.instance.onClose();
      },
      error: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.notificationService.error(
          "Erro ao salvar preferências do painel.",
        );
      },
    });
  }

  private restaurarPadrao(
    modalRef: ComponentRef<PersonalizarDashboardModalComponent>,
  ): void {
    this.salvandoPreferencias = true;
    modalRef.instance.salvando = true;

    const padrao = WIDGETS_DEFAULT.map((w, idx) => ({ ...w, ordem: idx + 1 }));
    const payload = JSON.stringify(padrao);

    this.dashboardService.salvarPreferencias(payload).subscribe({
      next: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.widgets = [...padrao];
        modalRef.instance.tempWidgets = padrao.map((w) => ({ ...w }));
        this.notificationService.success(
          "Layout padrão restaurado com sucesso!",
        );
        modalRef.instance.onClose();
      },
      error: () => {
        this.salvandoPreferencias = false;
        modalRef.instance.salvando = false;
        this.notificationService.error("Erro ao restaurar layout padrão.");
      },
    });
  }

  abrirModalCompromisso(): void {
    const ref = this.dialogService.open(CompromissoModalComponent, {
      data: {
        show: true,
        dataInicial: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
      },
    });
    ref.instance.saved.subscribe(() => {
      this.carregarDados();
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
