import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ClienteService } from '../../../core/api/cliente.service';
import { LeadService } from '../../../core/api/lead.service';
import { ProjetoService } from '../../../core/api/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cliente } from '../../../models/cliente.model';
import { Lead, HistoricoContatoLead } from '../../../models/lead.model';
import { Projeto } from '../../../models/projeto.model';
import { DialogService } from '../../../core/services/dialog.service';
import { EditarClienteModalComponent } from '../editar-cliente-modal/editar-cliente-modal.component';

@Component({
  selector: 'app-detalhes-cliente',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './detalhes-cliente.component.html',
  styleUrl: './detalhes-cliente.component.scss'
})
export class DetalhesClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private leadService = inject(LeadService);
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  cliente?: Cliente;
  lead?: Lead;
  projetos: Projeto[] = [];
  historico: HistoricoContatoLead[] = [];
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDadosCliente(id);
    } else {
      this.notificationService.error('ID do cliente não fornecido.');
      this.router.navigate(['/clientes']);
    }
  }

  carregarDadosCliente(id: string): void {
    this.loading = true;
    this.clienteService.obterPorId(id).subscribe({
      next: (clienteData) => {
        this.cliente = clienteData;
        this.carregarProjetosCliente(id);

        if (clienteData.leadId) {
          this.carregarHistoricoLead(clienteData.leadId);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do cliente', err);
        this.notificationService.error('Erro ao obter dados do cliente.');
        this.router.navigate(['/clientes']);
        this.loading = false;
      }
    });
  }

  carregarProjetosCliente(clienteId: string): void {
    this.projetoService.obterTodos().subscribe({
      next: (projetosData) => {
        this.projetos = projetosData.filter(p => p.clienteId === clienteId);
      },
      error: (err) => {
        console.error('Erro ao carregar projetos do cliente', err);
      }
    });
  }

  carregarHistoricoLead(leadId: string): void {
    this.leadService.obterPorId(leadId).subscribe({
      next: (leadData) => {
        this.lead = leadData;
        this.historico = leadData.historicoContatos || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico do lead', err);
        this.loading = false;
      }
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.cliente) return;

    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notificationService.error('A imagem deve ter no máximo 2MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      this.clienteService.atualizar({
        id: this.cliente!.id,
        nome: this.cliente!.nome,
        email: this.cliente!.email,
        telefone: this.cliente!.telefone,
        cpfCnpj: this.cliente!.cpfCnpj,
        endereco: this.cliente!.endereco,
        fotoUrl: base64Url
      }).subscribe({
        next: (cliAtualizado) => {
          this.cliente = cliAtualizado;
          this.notificationService.success('Foto de perfil atualizada com sucesso!');
        },
        error: () => {
          this.notificationService.error('Erro ao atualizar foto de perfil.');
        }
      });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removerFoto(): void {
    if (!this.cliente || !this.cliente.fotoUrl) return;
    this.clienteService.atualizar({
      id: this.cliente.id,
      nome: this.cliente.nome,
      email: this.cliente.email,
      telefone: this.cliente.telefone,
      cpfCnpj: this.cliente.cpfCnpj,
      endereco: this.cliente.endereco,
      fotoUrl: 'DELETE'
    }).subscribe({
      next: (cliAtualizado) => {
        this.cliente = cliAtualizado;
        this.notificationService.success('Foto de perfil removida.');
      },
      error: () => {
        this.notificationService.error('Erro ao remover foto.');
      }
    });
  }

  toggleAcessoPortal(): void {
    if (!this.cliente) return;
    const novoStatus = !this.cliente.ativo;
    this.clienteService.atualizarAcessoPortal({ id: this.cliente.id, ativo: novoStatus }).subscribe({
      next: (data) => {
        this.cliente!.ativo = data.ativo;
        this.notificationService.success(
          `Acesso ao portal de "${this.cliente!.nome}" foi ${this.cliente!.ativo ? 'ativado' : 'desativado'}.`
        );
      },
      error: (err) => {
        console.error('Erro ao atualizar acesso ao portal', err);
        this.notificationService.error('Não foi possível alterar o acesso ao portal.');
      }
    });
  }

  abrirModalEdicao(): void {
    if (!this.cliente) return;
    const ref = this.dialogService.open(EditarClienteModalComponent, {
      data: { cliente: this.cliente }
    });
    ref.instance.saved.subscribe((clienteAtualizado: Cliente) => {
      this.cliente = clienteAtualizado;
    });
  }

  copiarTexto(texto: string, label: string): void {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    this.notificationService.success(`${label} copiado para a área de transferência!`);
  }

  abrirWhatsApp(): void {
    if (!this.cliente?.telefone) return;
    const numLimpo = this.cliente.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numLimpo}`, '_blank');
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }
}
