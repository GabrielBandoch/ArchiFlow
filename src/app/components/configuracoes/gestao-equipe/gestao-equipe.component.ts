import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { MembroEquipe } from '../../../models/usuario.model';
import { MembroEquipeModalComponent } from '../../../dialogs/configuracoes/membro-equipe-modal/membro-equipe-modal.component';

@Component({
  selector: 'app-gestao-equipe',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM, FormsModule, MembroEquipeModalComponent],
  templateUrl: './gestao-equipe.component.html',
  styleUrl: './gestao-equipe.component.scss'
})
export class GestaoEquipeComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  membros: MembroEquipe[] = [];
  loading = false;

  termoBusca = '';
  filtroRole = 'todos';
  filtroStatus = 'todos';

  readonly filtroRoleOptions = [
    { value: 'todos', label: 'Todos os Papéis' },
    { value: 'ArquitetoAdmin', label: 'Arquiteto Titular' },
    { value: 'ArquitetoColaborador', label: 'Arquiteto Colaborador' },
    { value: 'Estagiario', label: 'Estagiário' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Gerente', label: 'Gerente de Projetos' },
    { value: 'Colaborador', label: 'Colaborador' }
  ];

  readonly filtroStatusOptions = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'ativos', label: 'Apenas Ativos' },
    { value: 'inativos', label: 'Apenas Inativos' }
  ];

  modalAberto = false;
  membroSelecionado?: MembroEquipe;

  modalRedefinirAberto = false;
  membroRedefinir?: MembroEquipe;
  novaSenhaManual = '';
  salvandoSenha = false;

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
        console.error('Erro ao carregar equipe', err);
        this.notificationService.error('Não foi possível carregar os colaboradores da equipe.');
      }
    });
  }

  get membrosFiltrados(): MembroEquipe[] {
    return this.membros.filter((m) => {
      const matchBusca =
        !this.termoBusca ||
        m.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        m.email.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (m.cargo && m.cargo.toLowerCase().includes(this.termoBusca.toLowerCase()));

      const matchRole =
        this.filtroRole === 'todos' ||
        m.role === this.filtroRole;

      const matchStatus =
        this.filtroStatus === 'todos' ||
        (this.filtroStatus === 'ativos' && m.ativo) ||
        (this.filtroStatus === 'inativos' && !m.ativo);

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
    return this.membros.filter((m) =>
      m.role === 'ArquitetoAdmin' || m.role === 'ArquitetoColaborador' || m.role === 'Administrador'
    ).length;
  }

  get totalApoio(): number {
    return this.membros.filter((m) =>
      m.role === 'Estagiario' || m.role === 'Financeiro' || m.role === 'Colaborador'
    ).length;
  }

  podeGerenciar(): boolean {
    const perfil = this.authService.currentUserValue?.perfil;
    return perfil === 'Administrador' || perfil === 'Gerente' || perfil === 'ArquitetoAdmin';
  }

  isCurrentUser(membro: MembroEquipe): boolean {
    return membro.id === this.authService.currentUserValue?.id;
  }

  abrirModalConvidar(): void {
    this.membroSelecionado = undefined;
    this.modalAberto = true;
  }

  abrirModalEditar(membro: MembroEquipe): void {
    this.membroSelecionado = membro;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.membroSelecionado = undefined;
  }

  onMembroSalvo(_: MembroEquipe): void {
    this.carregarEquipe();
  }

  alternarStatus(membro: MembroEquipe): void {
    if (this.isCurrentUser(membro) && membro.ativo) {
      this.notificationService.warning('Você não pode desativar o seu próprio usuário.');
      return;
    }

    const novoStatus = !membro.ativo;
    this.usuarioService.alterarStatus(membro.id, novoStatus).subscribe({
      next: (atualizado) => {
        membro.ativo = atualizado.ativo;
        this.notificationService.success(
          `Colaborador ${membro.nome} ${novoStatus ? 'ativado' : 'inativado'} com sucesso.`
        );
      },
      error: (err) => {
        console.error('Erro ao alterar status', err);
        this.notificationService.error('Erro ao alterar o status do colaborador.');
      }
    });
  }

  abrirModalRedefinir(membro: MembroEquipe): void {
    this.membroRedefinir = membro;
    this.novaSenhaManual = '';
    this.modalRedefinirAberto = true;
  }

  fecharModalRedefinir(): void {
    this.modalRedefinirAberto = false;
    this.membroRedefinir = undefined;
    this.novaSenhaManual = '';
  }

  confirmarRedefinirSenha(): void {
    if (!this.membroRedefinir) return;

    this.salvandoSenha = true;
    const senha = this.novaSenhaManual.trim() || undefined;

    this.usuarioService.redefinirSenha(this.membroRedefinir.id, senha).subscribe({
      next: () => {
        this.salvandoSenha = false;
        this.notificationService.success(
          `Senha do colaborador ${this.membroRedefinir?.nome} redefinida! Notificação enviada por e-mail.`
        );
        this.fecharModalRedefinir();
      },
      error: (err) => {
        this.salvandoSenha = false;
        console.error('Erro ao redefinir senha', err);
        this.notificationService.error('Erro ao redefinir a senha do colaborador.');
      }
    });
  }

  abrirModalExcluir(membro: MembroEquipe): void {
    if (this.isCurrentUser(membro)) {
      this.notificationService.warning('Você não pode excluir sua própria conta.');
      return;
    }

    this.dialogService.confirm({
      title: 'Remover Colaborador da Equipe',
      message: `Tem certeza que deseja remover ${membro.nome || 'este colaborador'} da equipe? Esta ação não pode ser desfeita.`,
      confirmText: 'Remover'
    }).subscribe((confirmou) => {
      if (confirmou) {
        this.usuarioService.excluirMembro(membro.id).subscribe({
          next: () => {
            this.notificationService.success(`Colaborador ${membro.nome} removido da equipe.`);
            this.carregarEquipe();
          },
          error: (err) => {
            console.error('Erro ao excluir membro', err);
            this.notificationService.error('Não foi possível remover o colaborador.');
          }
        });
      }
    });
  }

  obterBadgeRoleClass(role: string): string {
    switch (role) {
      case 'Administrador':
      case 'ArquitetoAdmin':
        return 'badge-admin';
      case 'ArquitetoColaborador':
      case 'Gerente':
        return 'badge-arquiteto';
      case 'Financeiro':
        return 'badge-financeiro';
      case 'Estagiario':
        return 'badge-estagiario';
      default:
        return 'badge-colab';
    }
  }

  obterRoleBadgeVariant(role: string): 'primary' | 'info' | 'warning' | 'neutral' {
    switch (role) {
      case 'Administrador':
      case 'ArquitetoAdmin':
        return 'primary';
      case 'ArquitetoColaborador':
      case 'Gerente':
        return 'info';
      case 'Financeiro':
        return 'warning';
      case 'Estagiario':
      default:
        return 'neutral';
    }
  }

  obterLabelRole(role: string): string {
    switch (role) {
      case 'Administrador':
        return 'Administrador';
      case 'ArquitetoAdmin':
        return 'Arquiteto Titular';
      case 'ArquitetoColaborador':
        return 'Arquiteto Colaborador';
      case 'Gerente':
        return 'Gerente de Projetos';
      case 'Financeiro':
        return 'Financeiro';
      case 'Estagiario':
        return 'Estagiário';
      case 'Colaborador':
        return 'Colaborador';
      default:
        return role;
    }
  }

  obterIniciais(nome: string): string {
    if (!nome) return 'AF';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
}
