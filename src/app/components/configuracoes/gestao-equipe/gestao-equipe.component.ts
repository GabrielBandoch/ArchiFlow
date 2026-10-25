import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CORE_IMPORTS, DESIGN_SYSTEM } from "../../../shared";
import { UsuarioService } from "../../../core/api/usuarios/usuario.service";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { DialogService } from "../../../core/services/dialog.service";
import { MembroEquipe } from "../../../core/models/usuario.model";
import { MembroEquipeModalComponent } from "../../../dialogs/configuracoes/membro-equipe-modal/membro-equipe-modal.component";
import { RedefinirSenhaModalComponent } from "../../../dialogs/configuracoes/redefinir-senha-modal/redefinir-senha-modal.component";

@Component({
  selector: "app-gestao-equipe",
  standalone: true,
  imports: [
    CORE_IMPORTS,
    DESIGN_SYSTEM,
    FormsModule,
  ],
  templateUrl: "./gestao-equipe.component.html",
  styleUrl: "./gestao-equipe.component.scss",
})
export class GestaoEquipeComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  membros: MembroEquipe[] = [];
  loading = false;

  termoBusca = "";
  filtroRole = "todos";
  filtroStatus = "todos";

  readonly filtroRoleOptions = [
    { value: "todos", label: "Todos os Papéis" },
    { value: "ArquitetoAdmin", label: "Arquiteto Titular" },
    { value: "ArquitetoColaborador", label: "Arquiteto Colaborador" },
    { value: "Estagiario", label: "Estagiário" },
    { value: "Financeiro", label: "Financeiro" },
    { value: "Gerente", label: "Gerente de Projetos" },
    { value: "Colaborador", label: "Colaborador" },
  ];

  readonly filtroStatusOptions = [
    { value: "todos", label: "Todos os Status" },
    { value: "ativos", label: "Apenas Ativos" },
    { value: "inativos", label: "Apenas Inativos" },
  ];

  ngOnInit(): void {
    this.carregarEquipe();
  }

  carregarEquipe(): void {
    this.loading = true;
    this.usuarioService.obterEquipe().subscribe({
      next: (dados) => {
        this.membros = dados;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error("Erro ao carregar equipe", err);
        this.notificationService.error(
          "Não foi possível carregar os colaboradores da equipe.",
        );
      },
    });
  }

  get membrosFiltrados(): MembroEquipe[] {
    return this.membros.filter((m) => {
      const matchBusca =
        !this.termoBusca ||
        m.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        m.email.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (m.cargo &&
          m.cargo.toLowerCase().includes(this.termoBusca.toLowerCase()));

      const matchRole =
        this.filtroRole === "todos" || m.role === this.filtroRole;

      const matchStatus =
        this.filtroStatus === "todos" ||
        (this.filtroStatus === "ativos" && m.ativo) ||
        (this.filtroStatus === "inativos" && !m.ativo);

      return matchBusca && matchRole && matchStatus;
    });
  }

  get totalMembros(): number {
    return this.membros.length;
  }

  get totalAtivos(): number {
    return this.membros.filter((m) => m.ativo).length;
  }

  get totalArquitetos(): number {
    return this.membros.filter(
      (m) =>
        m.role === "ArquitetoAdmin" ||
        m.role === "ArquitetoColaborador" ||
        m.role === "Administrador",
    ).length;
  }

  get totalApoio(): number {
    return this.membros.filter(
      (m) =>
        m.role === "Estagiario" ||
        m.role === "Financeiro" ||
        m.role === "Colaborador",
    ).length;
  }

  podeGerenciar(): boolean {
    const perfil = this.authService.currentUserValue?.perfil;
    return (
      perfil === "Administrador" ||
      perfil === "Gerente" ||
      perfil === "ArquitetoAdmin"
    );
  }

  isCurrentUser(membro: MembroEquipe): boolean {
    return membro.id === this.authService.currentUserValue?.id;
  }

  abrirModalConvidar(): void {
    const ref = this.dialogService.open(MembroEquipeModalComponent);
    ref.instance.saved.subscribe(() => {
      this.carregarEquipe();
    });
  }

  abrirModalEditar(membro: MembroEquipe): void {
    const ref = this.dialogService.open(MembroEquipeModalComponent, {
      data: { membroParaEdicao: membro },
    });
    ref.instance.saved.subscribe(() => {
      this.carregarEquipe();
    });
  }

  alternarStatus(membro: MembroEquipe): void {
    if (this.isCurrentUser(membro) && membro.ativo) {
      this.notificationService.warning(
        "Você não pode desativar o seu próprio usuário.",
      );
      return;
    }

    const novoStatus = !membro.ativo;
    this.usuarioService.alterarStatus(membro.id, novoStatus).subscribe({
      next: (atualizado) => {
        membro.ativo = atualizado.ativo;
        this.notificationService.success(
          `Colaborador ${membro.nome} ${novoStatus ? "ativado" : "inativado"} com sucesso.`,
        );
      },
      error: (err) => {
        console.error("Erro ao alterar status", err);
        this.notificationService.error(
          "Erro ao alterar o status do colaborador.",
        );
      },
    });
  }

  abrirModalRedefinir(membro: MembroEquipe): void {
    this.dialogService.open(RedefinirSenhaModalComponent, {
      data: { membro },
    });
  }

  abrirModalExcluir(membro: MembroEquipe): void {
    if (this.isCurrentUser(membro)) {
      this.notificationService.warning(
        "Você não pode excluir sua própria conta.",
      );
      return;
    }

    this.dialogService
      .confirm({
        title: "Remover Colaborador da Equipe",
        message: `Tem certeza que deseja remover ${membro.nome || "este colaborador"} da equipe? Esta ação não pode ser desfeita.`,
        confirmText: "Remover",
      })
      .subscribe((confirmou) => {
        if (confirmou) {
          this.usuarioService.excluirMembro(membro.id).subscribe({
            next: () => {
              this.notificationService.success(
                `Colaborador ${membro.nome} removido da equipe.`,
              );
              this.carregarEquipe();
            },
            error: (err) => {
              console.error("Erro ao excluir membro", err);
              this.notificationService.error(
                "Não foi possível remover o colaborador.",
              );
            },
          });
        }
      });
  }

  obterIniciais(nome: string): string {
    if (!nome) return "AF";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  obterBadgeRole(role: string): { label: string; variant: string } {
    switch (role) {
      case "ArquitetoAdmin":
        return { label: "Arquiteto Titular", variant: "primary" };
      case "Administrador":
        return { label: "Administrador", variant: "primary" };
      case "ArquitetoColaborador":
        return { label: "Arquiteto", variant: "secondary" };
      case "Gerente":
        return { label: "Gerente", variant: "info" };
      case "Financeiro":
        return { label: "Financeiro", variant: "warning" };
      case "Estagiario":
        return { label: "Estagiário", variant: "neutral" };
      default:
        return { label: role || "Colaborador", variant: "neutral" };
    }
  }

  obterRoleBadgeVariant(role: string): any {
    return this.obterBadgeRole(role).variant;
  }

  obterLabelRole(role: string): string {
    return this.obterBadgeRole(role).label;
  }
}
