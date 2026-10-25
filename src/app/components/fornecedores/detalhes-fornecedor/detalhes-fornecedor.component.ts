import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  Fornecedor,
  AvaliacaoFornecedor,
  ProjetoFornecedor,
} from "../../../core/models/fornecedor.model";
import { FornecedorService } from "../../../core/api/fornecedores/fornecedor.service";
import { ProjetoService } from "../../../core/api/projetos/projeto.service";
import { Projeto } from "../../../core/models/projeto.model";
import { DialogService } from "../../../core/services/dialog.service";
import { NotificationService } from "../../../core/services/notification.service";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { WhatsAppButtonComponent } from "../../../shared/components/whatsapp-button/whatsapp-button.component";
import { PhoneMaskPipe } from "../../../core/pipes/phone-mask.pipe";
import { FornecedorModalComponent } from "../../../dialogs/fornecedores/fornecedor-modal/fornecedor-modal.component";
import { AvaliarFornecedorModalComponent } from "../../../dialogs/fornecedores/avaliar-fornecedor-modal/avaliar-fornecedor-modal.component";
import { VincularProjetoModalComponent } from "../../../dialogs/fornecedores/vincular-projeto-modal/vincular-projeto-modal.component";

@Component({
  selector: "app-detalhes-fornecedor",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    EmptyStateComponent,
    WhatsAppButtonComponent,
    PhoneMaskPipe,
  ],
  templateUrl: "./detalhes-fornecedor.component.html",
  styleUrls: ["./detalhes-fornecedor.component.scss"],
})
export class DetalhesFornecedorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fornecedorService = inject(FornecedorService);
  private projetoService = inject(ProjetoService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  fornecedorId = "";
  fornecedor?: Fornecedor;
  carregando = true;
  todosProjetos: Projeto[] = [];

  get avaliacoes(): AvaliacaoFornecedor[] {
    return this.fornecedor?.avaliacoes || [];
  }

  get projetosVinculados(): any[] {
    return this.fornecedor?.projetosVinculados || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.voltar();
      return;
    }
    this.fornecedorId = id;
    this.carregarProjetos();
    this.carregarFornecedor();
  }

  carregarProjetos(): void {
    this.projetoService.obterTodos().subscribe({
      next: (projetos) => {
        this.todosProjetos = projetos;
      },
    });
  }

  obterNomeProjeto(projetoId: string): string {
    const proj = this.todosProjetos.find((p) => p.id === projetoId);
    return proj ? proj.nome : `Projeto #${projetoId.substring(0, 8)}`;
  }

  carregarFornecedor(): void {
    this.carregando = true;
    this.fornecedorService.obterPorId(this.fornecedorId).subscribe({
      next: (f) => {
        this.fornecedor = f;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error("Fornecedor não encontrado.");
        this.voltar();
      },
    });
  }

  voltar(): void {
    this.router.navigate(["/fornecedores"]);
  }

  abrirModalEditar(): void {
    if (!this.fornecedor) return;
    const ref = this.dialogService.open(FornecedorModalComponent, {
      data: { fornecedor: this.fornecedor },
    });
    ref.instance.salvo.subscribe((f: Fornecedor) => {
      this.fornecedor = f;
      this.carregarFornecedor();
    });
  }

  abrirModalAvaliar(): void {
    if (!this.fornecedor) return;
    const ref = this.dialogService.open(AvaliarFornecedorModalComponent, {
      data: { fornecedor: this.fornecedor },
    });
    ref.instance.avaliado.subscribe(() => {
      this.carregarFornecedor();
    });
  }

  abrirModalVincular(): void {
    if (!this.fornecedor) return;
    const ref = this.dialogService.open(VincularProjetoModalComponent, {
      data: { fornecedor: this.fornecedor },
    });
    ref.instance.vinculado.subscribe(() => {
      this.carregarFornecedor();
    });
  }

  desvincular(vinculo: ProjetoFornecedor): void {
    const nomeProj = this.obterNomeProjeto(vinculo.projetoId);
    this.dialogService
      .confirm({
        title: "Desvincular Parceiro",
        message: `Deseja desvincular ${this.fornecedor?.nome} da obra "${nomeProj}"?`,
        confirmLabel: "Sim, desvincular",
        cancelLabel: "Cancelar",
        variant: "danger",
      })
      .subscribe((confirmou) => {
        if (!confirmou) return;

        this.fornecedorService.desvincularProjeto(vinculo.id).subscribe({
          next: () => {
            this.notificationService.success(
              "Parceiro desvinculado da obra com sucesso.",
            );
            this.carregarFornecedor();
          },
          error: () => {
            this.notificationService.error("Erro ao desvincular parceiro.");
          },
        });
      });
  }

  excluir(): void {
    if (!this.fornecedor) return;

    this.dialogService
      .confirm({
        title: "Remover Fornecedor",
        message: `Tem certeza que deseja remover o cadastro de ${this.fornecedor.nome}? Esta ação é irreversível.`,
        confirmLabel: "Sim, remover",
        cancelLabel: "Cancelar",
        variant: "danger",
      })
      .subscribe((confirmou) => {
        if (!confirmou) return;

        this.fornecedorService.excluir(this.fornecedor!.id).subscribe({
          next: () => {
            this.notificationService.success(
              `Fornecedor ${this.fornecedor!.nome} removido.`,
            );
            this.voltar();
          },
          error: () => {
            this.notificationService.error(
              "Não foi possível remover o fornecedor.",
            );
          },
        });
      });
  }

  copiarTexto(texto?: string, label: string = "Texto"): void {
    if (!texto) return;
    navigator.clipboard?.writeText(texto);
    this.notificationService.success(
      `${label} copiado para a área de transferência!`,
    );
  }

  gerarEstrelas(notaMedia: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  obterStatusEstrela(posicao: number, notaMedia: number): "full" | "empty" {
    return posicao <= Math.round(notaMedia) ? "full" : "empty";
  }
}
