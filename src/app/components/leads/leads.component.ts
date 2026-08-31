import { Component, OnInit, inject } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../shared';
import { LeadService } from '../../core/api';
import { NotificationService } from '../../core/services/notification.service';
import { DialogService } from '../../core/services/dialog.service';
import { Lead, StatusLead, KanbanColumn } from '../../models/lead.model';
import { AtualizarStatusLeadCommand } from '../../commands/lead.commands';
import { NovoLeadModalComponent } from '../../dialogs/leads/novo-lead-modal/novo-lead-modal.component';
import { DetalhesLeadModalComponent } from '../../dialogs/leads/detalhes-lead-modal/detalhes-lead-modal.component';
import { MotivoPerdaModalComponent } from '../../dialogs/leads/motivo-perda-modal/motivo-perda-modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConversaoLeadModalComponent } from '../../dialogs/leads/conversao-lead-modal/conversao-lead-modal.component';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent implements OnInit {
  private leadService = inject(LeadService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  leads: Lead[] = [];
  columns: KanbanColumn[] = [];
  
  StatusLeadEnum = StatusLead;

  ngOnInit(): void {
    this.carregarLeads();
  }

  carregarLeads(): void {
    this.leadService.obterTodos().subscribe({
      next: (data) => {
        this.leads = data;
        this.organizarColunas();
      },
      error: (err) => {
        console.error('Erro ao carregar leads', err);
        this.notificationService.error('Erro ao carregar a lista de leads.');
      }
    });
  }

  private organizarColunas(): void {
    this.columns = [
      { status: StatusLead.Novo, title: 'Novos', class: 'status-novo', leads: this.leads.filter(l => l.status === StatusLead.Novo) },
      { status: StatusLead.EmContato, title: 'Em Contato', class: 'status-contato', leads: this.leads.filter(l => l.status === StatusLead.EmContato) },
      { status: StatusLead.PropostaEnviada, title: 'Proposta Enviada', class: 'status-proposta', leads: this.leads.filter(l => l.status === StatusLead.PropostaEnviada) },
      { status: StatusLead.Negociando, title: 'Negociando', class: 'status-negociando', leads: this.leads.filter(l => l.status === StatusLead.Negociando) },
      { status: StatusLead.Convertido, title: 'Convertidos', class: 'status-convertido', leads: this.leads.filter(l => l.status === StatusLead.Convertido) },
      { status: StatusLead.Perdido, title: 'Perdidos', class: 'status-perdido', leads: this.leads.filter(l => l.status === StatusLead.Perdido) }
    ];
  }

  onDragStart(event: DragEvent, leadId: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', leadId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetStatus: StatusLead): void {
    event.preventDefault();
    if (event.dataTransfer) {
      const leadId = event.dataTransfer.getData('text/plain');
      if (leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (lead && lead.status === StatusLead.Convertido) {
          this.notificationService.warning('Leads convertidos em clientes não podem ser movidos de volta no funil.');
          return;
        }
        if (lead && lead.status === targetStatus) {
          return;
        }
        if (targetStatus === StatusLead.Perdido) {
          const ref = this.dialogService.open(MotivoPerdaModalComponent);
          ref.instance.confirm.subscribe((motivoPerda: string) => {
            this.atualizarStatusLead(leadId, targetStatus, motivoPerda);
          });
          ref.instance.close.subscribe(() => {
            this.carregarLeads();
          });
        } else {
          this.atualizarStatusLead(leadId, targetStatus);
        }
      }
    }
  }

  private atualizarStatusLead(id: string, status: StatusLead, motivoPerda?: string): void {
    const command: AtualizarStatusLeadCommand = { id, status, motivoPerda };
    this.leadService.atualizarStatus(command).subscribe({
      next: () => {
        this.notificationService.success('Status do lead atualizado com sucesso!');
        this.carregarLeads();
      },
      error: (err) => {
        console.error('Erro ao atualizar status do lead', err);
        this.notificationService.error('Não foi possível alterar o status do lead.');
        this.carregarLeads();
      }
    });
  }

  isDraggingBoard = false;
  startX = 0;
  boardScrollLeft = 0;

  onBoardWheel(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;
    if (container) {
      container.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  onBoardMouseDown(event: MouseEvent): void {
    if (event.button !== 0) 
      return;

    const target = event.target as HTMLElement;
    if (
      target.closest('.lead-card') || 
      target.closest('button') || 
      target.closest('app-button') || 
      target.closest('a')
    ) {
      return;
    }

    const board = event.currentTarget as HTMLElement;
    if (board) {
      this.isDraggingBoard = true;
      board.classList.add('grabbing');
      this.startX = event.pageX - board.offsetLeft;
      this.boardScrollLeft = board.scrollLeft;
    }
  }

  onBoardMouseMove(event: MouseEvent): void {
    if (!this.isDraggingBoard) return;
    event.preventDefault();

    const board = event.currentTarget as HTMLElement;
    if (board) {
      const x = event.pageX - board.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      board.scrollLeft = this.boardScrollLeft - walk;
    }
  }

  onBoardMouseUpOrLeave(event: MouseEvent): void {
    if (this.isDraggingBoard) {
      this.isDraggingBoard = false;
      const board = event.currentTarget as HTMLElement;
      if (board) {
        board.classList.remove('grabbing');
      }
    }
  }

  openCreateModal(): void {
    const ref = this.dialogService.open(NovoLeadModalComponent);
    ref.instance.saved.subscribe(() => {
      this.carregarLeads();
    });
  }

  verDetalhes(lead: Lead): void {
    const ref = this.dialogService.open(DetalhesLeadModalComponent, {
      data: { lead }
    });
    ref.instance.saved.subscribe(() => {
      this.carregarLeads();
    });
  }

  converterParaCliente(lead: Lead, event: MouseEvent): void {
    event.stopPropagation();
    if (!lead.nome || !lead.email || !lead.origemId) {
      this.notificationService.error('Não é possível converter o lead. É obrigatório que Nome, E-mail e Origem estejam preenchidos.');
      return;
    }
    const ref = this.dialogService.open(ConversaoLeadModalComponent, {
      data: { lead }
    });
    ref.instance.convertedSuccess.subscribe(() => {
      this.carregarLeads();
    });
  }

  excluirLead(lead: Lead, event: MouseEvent): void {
    event.stopPropagation();
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Lead',
        message: `Tem certeza de que deseja excluir o lead "${lead.nome}"?`
      }
    });
    ref.instance.confirm.subscribe(() => {
      this.leadService.excluir(lead.id).subscribe({
        next: () => {
          this.notificationService.success('Lead excluído com sucesso.');
          this.carregarLeads();
        },
        error: (err) => {
          console.error('Erro ao excluir lead', err);
          this.notificationService.error('Não foi possível excluir o lead.');
        }
      });
    });
  }
}
