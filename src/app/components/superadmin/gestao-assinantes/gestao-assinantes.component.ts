import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { SuperAdminService } from '../../../core/services/superadmin.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  TenantAssinatura,
  SuperAdminDashboardKpis,
  StatusFinanceiroAssinatura,
  CriarTenantAssinaturaRequest,
  AtualizarStatusFinanceiroRequest,
  BloquearTenantRequest
} from '../../../models/superadmin-tenant.model';

@Component({
  selector: 'app-gestao-assinantes',
  standalone: true,
  imports: [CommonModule, CORE_IMPORTS, DESIGN_SYSTEM, FormsModule],
  templateUrl: './gestao-assinantes.component.html',
  styleUrl: './gestao-assinantes.component.scss'
})
export class GestaoAssinantesComponent implements OnInit {
  private superAdminService = inject(SuperAdminService);
  private notificationService = inject(NotificationService);

  loading = false;
  kpis: SuperAdminDashboardKpis = {
    totalEscritorios: 0,
    totalAdimplentes: 0,
    totalEmDebito: 0,
    totalSuspensos: 0,
    totalTrial: 0,
    mrrTotal: 0,
    totalEmAtrasoReais: 0,
    taxaAdimplenciaPercentual: 100
  };

  escritorios: TenantAssinatura[] = [];
  termoBusca = '';
  filtroStatus: string = 'Todos';

  // Modal Novo Escritório
  modalNovoAberto = false;
  salvandoNovo = false;
  novoForm: CriarTenantAssinaturaRequest = {
    subdominio: '',
    nomeEscritorio: '',
    razaoSocial: '',
    cnpjCpf: '',
    nomeResponsavel: '',
    emailResponsavel: '',
    telefoneResponsavel: '',
    plano: 'Professional',
    cicloFaturamento: 'Mensal',
    valorMensalidade: 349.00,
    statusFinanceiro: 'Adimplente',
    notasInternas: ''
  };

  // Modal Status Financeiro
  modalStatusAberto = false;
  salvandoStatus = false;
  escritorioSelecionado?: TenantAssinatura;
  statusForm: AtualizarStatusFinanceiroRequest = {
    statusFinanceiro: 'Adimplente',
    novaDataVencimento: '',
    registrarPagamentoHoje: false,
    notasInternas: ''
  };

  // Modal Anotações
  modalNotasAberto = false;
  salvandoNotas = false;
  notasTexto = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.superAdminService.getKpis().subscribe({
      next: (kpis) => {
        this.kpis = kpis;
      },
      error: (err) => {
        console.error('Erro ao carregar KPIs', err);
      }
    });

    this.carregarEscritorios();
  }

  carregarEscritorios(): void {
    this.loading = true;
    this.superAdminService.getEscritorios(this.termoBusca, this.filtroStatus).subscribe({
      next: (dados) => {
        this.escritorios = dados;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar escritórios', err);
        this.notificationService.error('Falha ao carregar a lista de escritórios.');
        this.loading = false;
      }
    });
  }

  filtrarPorStatus(status: string): void {
    this.filtroStatus = status;
    this.carregarEscritorios();
  }

  onBuscaChange(): void {
    this.carregarEscritorios();
  }

  // Ação rápida: Registrar Pagamento
  confirmarPagamento(escritorio: TenantAssinatura): void {
    if (!confirm(`Confirmar o recebimento da mensalidade de R$ ${escritorio.valorMensalidade.toFixed(2)} do escritório "${escritorio.nomeEscritorio}"?`)) {
      return;
    }

    this.loading = true;
    this.superAdminService.registrarPagamento(escritorio.id).subscribe({
      next: (atualizado) => {
        this.notificationService.success(`Pagamento confirmado com sucesso para ${atualizado.nomeEscritorio}! Próximo vencimento atualizado.`);
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao confirmar pagamento', err);
        this.notificationService.error('Não foi possível registrar o pagamento.');
        this.loading = false;
      }
    });
  }

  // Alternar Bloqueio de Acesso
  alternarBloqueio(escritorio: TenantAssinatura): void {
    const acao = escritorio.bloqueadoPorInadimplencia ? 'desbloquear' : 'bloquear por inadimplência';
    if (!confirm(`Deseja realmente ${acao} o acesso do escritório "${escritorio.nomeEscritorio}"?`)) {
      return;
    }

    const request: BloquearTenantRequest = {
      bloquear: !escritorio.bloqueadoPorInadimplencia,
      motivo: !escritorio.bloqueadoPorInadimplencia
        ? 'Acesso suspenso por inadimplência na assinatura COTU.'
        : undefined
    };

    this.loading = true;
    this.superAdminService.alternarBloqueio(escritorio.id, request).subscribe({
      next: (atualizado) => {
        const msg = atualizado.bloqueadoPorInadimplencia
          ? `Acesso do escritório ${atualizado.nomeEscritorio} foi SUSPENSO.`
          : `Acesso do escritório ${atualizado.nomeEscritorio} foi LIBERADO com sucesso!`;
        this.notificationService.success(msg);
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao alternar bloqueio', err);
        this.notificationService.error('Erro ao alterar o status de acesso do escritório.');
        this.loading = false;
      }
    });
  }

  // Abrir Modal Novo
  abrirModalNovo(): void {
    this.novoForm = {
      subdominio: '',
      nomeEscritorio: '',
      razaoSocial: '',
      cnpjCpf: '',
      nomeResponsavel: '',
      emailResponsavel: '',
      telefoneResponsavel: '',
      plano: 'Professional',
      cicloFaturamento: 'Mensal',
      valorMensalidade: 349.00,
      statusFinanceiro: 'Adimplente',
      notasInternas: ''
    };
    this.modalNovoAberto = true;
  }

  fecharModalNovo(): void {
    this.modalNovoAberto = false;
  }

  onPlanoChange(): void {
    switch (this.novoForm.plano) {
      case 'Starter':
        this.novoForm.valorMensalidade = 189.90;
        break;
      case 'Professional':
        this.novoForm.valorMensalidade = 349.00;
        break;
      case 'Studio Scale':
        this.novoForm.valorMensalidade = 599.00;
        break;
      case 'Enterprise':
        this.novoForm.valorMensalidade = 999.00;
        break;
    }
  }

  salvarNovoEscritorio(): void {
    if (!this.novoForm.subdominio || !this.novoForm.nomeEscritorio || !this.novoForm.nomeResponsavel || !this.novoForm.emailResponsavel) {
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.salvandoNovo = true;
    this.superAdminService.criarEscritorio(this.novoForm).subscribe({
      next: (criado) => {
        this.notificationService.success(`Escritório ${criado.nomeEscritorio} provisionado com sucesso na URL: ${criado.linkAcesso}!`);
        this.fecharModalNovo();
        this.salvandoNovo = false;
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao criar escritório', err);
        const msg = err.error?.message || 'Falha ao cadastrar e provisionar o escritório.';
        this.notificationService.error(msg);
        this.salvandoNovo = false;
      }
    });
  }

  // Modal Status Financeiro
  abrirModalStatus(escritorio: TenantAssinatura): void {
    this.escritorioSelecionado = escritorio;
    this.statusForm = {
      statusFinanceiro: escritorio.statusFinanceiro,
      novaDataVencimento: escritorio.dataVencimento ? escritorio.dataVencimento.split('T')[0] : '',
      registrarPagamentoHoje: false,
      notasInternas: escritorio.notasInternas || ''
    };
    this.modalStatusAberto = true;
  }

  fecharModalStatus(): void {
    this.modalStatusAberto = false;
    this.escritorioSelecionado = undefined;
  }

  salvarStatusFinanceiro(): void {
    if (!this.escritorioSelecionado) return;

    this.salvandoStatus = true;
    this.superAdminService.atualizarStatusFinanceiro(this.escritorioSelecionado.id, this.statusForm).subscribe({
      next: (atualizado) => {
        this.notificationService.success(`Status financeiro de ${atualizado.nomeEscritorio} atualizado com sucesso!`);
        this.fecharModalStatus();
        this.salvandoStatus = false;
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao atualizar status', err);
        this.notificationService.error('Erro ao atualizar status financeiro.');
        this.salvandoStatus = false;
      }
    });
  }

  // Modal Anotações
  abrirModalNotas(escritorio: TenantAssinatura): void {
    this.escritorioSelecionado = escritorio;
    this.notasTexto = escritorio.notasInternas || '';
    this.modalNotasAberto = true;
  }

  fecharModalNotas(): void {
    this.modalNotasAberto = false;
    this.escritorioSelecionado = undefined;
  }

  salvarNotas(): void {
    if (!this.escritorioSelecionado) return;

    this.salvandoNotas = true;
    this.superAdminService.atualizarNotas(this.escritorioSelecionado.id, { notasInternas: this.notasTexto }).subscribe({
      next: (atualizado) => {
        this.notificationService.success(`Anotações de ${atualizado.nomeEscritorio} salvas com sucesso!`);
        this.fecharModalNotas();
        this.salvandoNotas = false;
        this.carregarDados();
      },
      error: (err) => {
        console.error('Erro ao salvar notas', err);
        this.notificationService.error('Erro ao salvar anotações.');
        this.salvandoNotas = false;
      }
    });
  }

  copiarLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      this.notificationService.success('Link de acesso copiado para a área de transferência!');
    });
  }

  abrirWhatsApp(linkWhatsApp?: string): void {
    if (!linkWhatsApp) {
      this.notificationService.warning('Telefone do responsável não configurado.');
      return;
    }
    window.open(linkWhatsApp, '_blank');
  }
}
