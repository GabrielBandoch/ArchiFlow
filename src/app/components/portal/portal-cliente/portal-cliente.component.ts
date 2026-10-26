import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ProjetoService } from "../../../core/api/projetos/projeto.service";
import { ArquivoService } from "../../../core/api/projetos/arquivo.service";
import { ClienteService } from "../../../core/api/clientes/cliente.service";
import { NotificationService } from "../../../core/services/notification.service";
import {
  Projeto,
  EtapaProjeto,
  StatusProjeto,
  StatusEtapa,
  TipoProjeto,
  TarefaEtapa,
} from "../../../core/models/projeto.model";
import { Arquivo } from "../../../core/models/arquivo.model";
import { DESIGN_SYSTEM, ChatWidgetComponent } from "../../../shared";
import { PortalHeroComponent } from "../portal-hero/portal-hero.component";
import { PortalTimelineComponent } from "../portal-timeline/portal-timeline.component";
import { PortalDocumentosComponent } from "../portal-documentos/portal-documentos.component";
import { PortalSuporteComponent } from "../portal-suporte/portal-suporte.component";
import { DialogService } from "../../../core/services/dialog.service";

@Component({
  selector: "app-portal-cliente",
  standalone: true,
  imports: [
    CommonModule,
    DESIGN_SYSTEM,
    PortalHeroComponent,
    PortalTimelineComponent,
    PortalDocumentosComponent,
    PortalSuporteComponent,
  ],
  templateUrl: "./portal-cliente.component.html",
  styleUrl: "./portal-cliente.component.scss",
})
export class PortalClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private projetoService = inject(ProjetoService);
  private arquivoService = inject(ArquivoService);
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService, { optional: true });
  private dialogService = inject(DialogService, { optional: true });

  projetoId = "";
  projeto: Projeto | null = null;
  listaProjetosCliente: Projeto[] = [];
  modoSelecaoProjeto = false;
  arquivos: Arquivo[] = [];

  loading = true;
  filtroArquivo: "todos" | "plantas" | "documentos" | "imagens" = "todos";

  @ViewChild(ChatWidgetComponent) chatWidget?: ChatWidgetComponent;

  StatusProjeto = StatusProjeto;
  StatusEtapa = StatusEtapa;
  TipoProjeto = TipoProjeto;

  abrirChat(): void {
    if (this.chatWidget && !this.chatWidget.isOpen) {
      this.chatWidget.toggleChat();
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get("id");
      if (paramId) {
        this.projetoId = paramId;
        this.modoSelecaoProjeto = false;
        this.carregarDados();
      } else {
        this.carregarMeusProjetos();
      }
    });
  }

  carregarMeusProjetos(): void {
    this.loading = true;
    this.projetoService.obterMeusProjetos().subscribe({
      next: (projetos) => {
        this.listaProjetosCliente = projetos || [];
        if (this.listaProjetosCliente.length === 1) {
          this.projetoId = this.listaProjetosCliente[0].id;
          this.modoSelecaoProjeto = false;
          this.carregarDados();
        } else if (this.listaProjetosCliente.length > 1) {
          this.modoSelecaoProjeto = true;
          this.projeto = null;
          this.loading = false;
        } else {
          this.modoSelecaoProjeto = false;
          this.projeto = null;
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.projeto = null;
      },
    });
  }

  selecionarProjeto(p: Projeto): void {
    this.router.navigate(["/portal", p.id]);
  }

  voltarParaSelecao(): void {
    this.router.navigate(["/portal"]);
  }

  carregarDados(): void {
    this.loading = true;
    this.projetoService.obterPorId(this.projetoId).subscribe({
      next: (data) => {
        this.projeto = {
          ...data,
          status: this.normalizarStatus(data.status),
          tipo:
            typeof data.tipo === "string"
              ? [
                  "Residencial",
                  "Comercial",
                  "Corporativo",
                  "Interiores",
                ].indexOf(data.tipo)
              : Number(data.tipo),
          etapas: (data.etapas || [])
            .map((e) => ({
              ...e,
              status: this.normalizarStatusEtapa(e.status),
              tarefas: e.tarefas || [],
            }))
            .sort((a, b) => a.ordem - b.ordem),
        };

        if (data.clienteId && !data.clienteNome) {
          this.clienteService.obterPorId(data.clienteId).subscribe({
            next: (c) => {
              if (this.projeto) this.projeto.clienteNome = c.nome;
            },
          });
        }

        this.carregarArquivos();
      },
      error: (err) => {
        console.error("Erro ao carregar projeto no portal", err);
        this.loading = false;
        this.notificationService?.error("Erro ao carregar dados do projeto.");
      },
    });
  }

  carregarArquivos(): void {
    this.arquivoService.obterPorProjeto(this.projetoId).subscribe({
      next: (files) => {
        this.arquivos = files;
        this.loading = false;
      },
      error: (err) => {
        console.error("Erro ao carregar arquivos no portal", err);
        this.loading = false;
        this.notificationService?.error(
          "Erro ao carregar arquivos do projeto.",
        );
      },
    });
  }

  normalizarStatus(status: any): StatusProjeto {
    if (typeof status === "string") {
      const idx = [
        "Briefing",
        "Desenvolvimento",
        "Revisao",
        "Aprovacao",
        "Execucao",
        "Concluido",
        "Cancelado",
      ].indexOf(status);
      if (idx >= 0) return idx as StatusProjeto;
    }
    return Number(status) as StatusProjeto;
  }

  normalizarStatusEtapa(status: any): StatusEtapa {
    if (typeof status === "string") {
      const lower = status.toLowerCase();
      if (lower.includes("andamento")) return StatusEtapa.EmAndamento;
      if (lower.includes("conclui")) return StatusEtapa.Concluida;
      return StatusEtapa.Pendente;
    }
    return Number(status) as StatusEtapa;
  }

  get totalEtapas(): number {
    return this.projeto?.etapas?.length || 0;
  }

  get etapasConcluidas(): EtapaProjeto[] {
    return (this.projeto?.etapas || []).filter(
      (e) => e.status === StatusEtapa.Concluida,
    );
  }

  get totalConcluidas(): number {
    return this.etapasConcluidas.length;
  }

  get percentualProgresso(): number {
    if (this.totalEtapas === 0) return 0;
    return Math.round((this.totalConcluidas / this.totalEtapas) * 100);
  }

  get etapaAtual(): EtapaProjeto | undefined {
    return (
      (this.projeto?.etapas || []).find(
        (e) => e.status === StatusEtapa.EmAndamento,
      ) ||
      (this.projeto?.etapas || []).find(
        (e) => e.status === StatusEtapa.Pendente,
      )
    );
  }

  get proximosPassos(): EtapaProjeto[] {
    if (!this.etapaAtual) return [];
    return (this.projeto?.etapas || []).filter(
      (e) =>
        e.ordem > this.etapaAtual!.ordem && e.status === StatusEtapa.Pendente,
    );
  }

  get tipoProjetoFormatado(): string {
    const tipos = [
      "Residencial",
      "Comercial",
      "Corporativo",
      "Design de Interiores",
    ];
    if (
      this.projeto &&
      this.projeto.tipo !== undefined &&
      this.projeto.tipo !== null
    ) {
      return tipos[this.projeto.tipo] || "Geral";
    }
    return "Geral";
  }

  obterStatusProjetoLabel(status?: number | StatusProjeto): string {
    const labels = [
      "Briefing",
      "Desenvolvimento",
      "Revisão",
      "Aprovação",
      "Execução",
      "Concluído",
      "Cancelado",
    ];
    if (status !== undefined && status !== null) {
      return labels[Number(status)] || "Em Andamento";
    }
    return "Em Andamento";
  }

  get statusProjetoLabel(): string {
    return this.obterStatusProjetoLabel(this.projeto?.status);
  }

  get arquivosFiltrados(): Arquivo[] {
    if (this.filtroArquivo === "todos") return this.arquivos;
    if (this.filtroArquivo === "plantas") {
      return this.arquivos.filter((a) => {
        const ext = a.nome.split(".").pop()?.toLowerCase();
        return (
          ["dwg", "dxf", "rvt", "skp", "ifc"].includes(ext || "") ||
          (a.tipo?.toLowerCase().includes("cad") ?? false)
        );
      });
    }
    if (this.filtroArquivo === "documentos") {
      return this.arquivos.filter((a) => {
        const ext = a.nome.split(".").pop()?.toLowerCase();
        return (
          ["pdf", "doc", "docx", "xls", "xlsx"].includes(ext || "") ||
          (a.tipo?.toLowerCase().includes("pdf") ?? false)
        );
      });
    }
    if (this.filtroArquivo === "imagens") {
      return this.arquivos.filter((a) => {
        const ext = a.nome.split(".").pop()?.toLowerCase();
        return (
          ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(ext || "") ||
          (a.tipo?.toLowerCase().includes("image") ?? false)
        );
      });
    }
    return this.arquivos;
  }

  setFiltroArquivo(
    filtro: "todos" | "plantas" | "documentos" | "imagens",
  ): void {
    this.filtroArquivo = filtro;
  }

  baixarArquivo(arquivo: Arquivo): void {
    if (arquivo.urlStorage) {
      window.open(arquivo.urlStorage, "_blank");
    }
  }

  formatarData(data: any): string {
    if (!data) return "Não definida";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  }

  formatarMoeda(valor?: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  }
}
