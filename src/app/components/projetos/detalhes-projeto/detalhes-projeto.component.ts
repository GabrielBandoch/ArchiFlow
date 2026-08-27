import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { ArquivoService } from '../../../core/api/projetos/arquivo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { Projeto, EtapaProjeto, StatusProjeto, StatusEtapa, TipoProjeto, TarefaEtapa } from '../../../models/projeto.model';
import { Arquivo } from '../../../models/arquivo.model';
import { SelectOption } from '../../../shared/components/select/select.component';
import { EditarProjetoModalComponent } from '../../../dialogs/projetos/editar-projeto-modal/editar-projeto-modal.component';
import { NovaEtapaModalComponent } from '../../../dialogs/projetos/nova-etapa-modal/nova-etapa-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalhes-projeto',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './detalhes-projeto.component.html',
  styleUrl: './detalhes-projeto.component.scss'
})
export class DetalhesProjetoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projetoService = inject(ProjetoService);
  private clienteService = inject(ClienteService);
  private arquivoService = inject(ArquivoService);
  private projectTemplateService = inject(ProjectTemplateService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  projetoId = '';
  projeto: Projeto | null = null;
  arquivos: Arquivo[] = [];
  loading = true;
  activeTab: 'etapas' | 'arquivos' = 'etapas';

  uploadingArquivo = false;
  novoArquivoVisivelCliente = true;

  StatusProjeto = StatusProjeto;
  StatusEtapa = StatusEtapa;
  TipoProjeto = TipoProjeto;

  tipoOptions: SelectOption[] = [
    { value: TipoProjeto.Residencial, label: 'Residencial' },
    { value: TipoProjeto.Comercial, label: 'Comercial' },
    { value: TipoProjeto.Corporativo, label: 'Corporativo' },
    { value: TipoProjeto.Interiores, label: 'Design de Interiores' }
  ];

  statusProjetoOptions: SelectOption[] = [
    { value: StatusProjeto.Briefing, label: 'Briefing' },
    { value: StatusProjeto.Desenvolvimento, label: 'Desenvolvimento' },
    { value: StatusProjeto.Revisao, label: 'Revisão' },
    { value: StatusProjeto.Aprovacao, label: 'Aprovação' },
    { value: StatusProjeto.Execucao, label: 'Execução' },
    { value: StatusProjeto.Concluido, label: 'Concluído' },
    { value: StatusProjeto.Cancelado, label: 'Cancelado' }
  ];

  get etapaAtiva(): EtapaProjeto | undefined {
    return this.projeto?.etapas.find(e => e.status === StatusEtapa.EmAndamento) || 
           this.projeto?.etapas.find(e => e.status === StatusEtapa.Pendente);
  }

  get totalConcluidas(): number {
    return this.projeto?.etapas.filter(e => e.status === StatusEtapa.Concluida).length || 0;
  }

  ngOnInit(): void {
    this.projetoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projetoId) {
      this.carregarProjeto();
      this.carregarArquivos();
    } else {
      this.router.navigate(['/projetos']);
    }
  }

  normalizarStatus(status: any): StatusProjeto {
    if (typeof status === 'string') {
      const idx = ['Briefing', 'Desenvolvimento', 'Revisao', 'Aprovacao', 'Execucao', 'Concluido', 'Cancelado'].indexOf(status);
      if (idx >= 0) return idx as StatusProjeto;
    }
    return Number(status) as StatusProjeto;
  }

  normalizarStatusEtapa(status: any): StatusEtapa {
    if (typeof status === 'string') {
      const lower = status.toLowerCase();
      if (lower.includes('andamento')) return StatusEtapa.EmAndamento;
      if (lower.includes('conclui')) return StatusEtapa.Concluida;
      return StatusEtapa.Pendente;
    }
    return Number(status) as StatusEtapa;
  }

  carregarProjeto(): void {
    this.loading = true;
    this.projetoService.obterPorId(this.projetoId).subscribe({
      next: (data) => {
        this.projeto = {
          ...data,
          status: this.normalizarStatus(data.status),
          tipo: typeof data.tipo === 'string' ? ['Residencial', 'Comercial', 'Corporativo', 'Interiores'].indexOf(data.tipo) : Number(data.tipo),
          etapas: (data.etapas || []).map(e => ({
            ...e,
            status: this.normalizarStatusEtapa(e.status),
            tarefas: e.tarefas || []
          }))
        };
        this.loading = false;
        if (data && data.clienteId && !data.clienteNome) {
          this.clienteService.obterPorId(data.clienteId).subscribe({
            next: (c) => {
              if (this.projeto) {
                this.projeto.clienteNome = c.nome;
              }
            }
          });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar projeto', err);
        this.notificationService.error('Projeto não encontrado.');
        this.router.navigate(['/projetos']);
      }
    });
  }

  carregarArquivos(): void {
    this.arquivoService.obterPorProjeto(this.projetoId).subscribe({
      next: (data) => {
        this.arquivos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar arquivos do projeto', err);
      }
    });
  }

  setTab(tab: 'etapas' | 'arquivos'): void {
    this.activeTab = tab;
  }

  alterarStatusProjeto(novoStatus: any): void {
    if (!this.projeto) return;
    const numStatus = this.normalizarStatus(novoStatus);
    this.projetoService.atualizarStatus(this.projeto.id, numStatus).subscribe({
      next: (updated) => {
        this.projeto!.status = this.normalizarStatus(updated.status);
        this.projeto!.statusLabel = updated.statusLabel;
        this.notificationService.success(`Status alterado para "${updated.statusLabel}".`);
      },
      error: (err) => {
        console.error('Erro ao alterar status', err);
        this.notificationService.error('Não foi possível alterar o status.');
      }
    });
  }

  abrirModalNovaEtapa(): void {
    if (!this.projeto) return;
    const nextOrder = (this.projeto.etapas?.length || 0) + 1;
    const ref = this.dialogService.open(NovaEtapaModalComponent, {
      data: {
        projetoId: this.projeto.id,
        ordem: nextOrder
      }
    });
    ref.instance.saved.subscribe(() => {
      this.carregarProjeto();
    });
  }

  alterarStatusEtapa(etapa: EtapaProjeto, novoStatus: StatusEtapa): void {
    this.projetoService.atualizarStatusEtapa(etapa.id, novoStatus).subscribe({
      next: (updated) => {
        etapa.status = updated.status;
        etapa.statusLabel = updated.statusLabel;
        etapa.dataConclusao = updated.dataConclusao;
        this.notificationService.success(`Etapa "${etapa.nome}" atualizada para ${updated.statusLabel}!`);

        if (novoStatus === StatusEtapa.Concluida && this.projeto) {
          const proximas = this.projeto.etapas
            .filter(e => e.ordem > etapa.ordem && e.status === StatusEtapa.Pendente)
            .sort((a, b) => a.ordem - b.ordem);

          if (proximas.length > 0) {
            const proxima = proximas[0];
            this.projetoService.atualizarStatusEtapa(proxima.id, StatusEtapa.EmAndamento).subscribe({
              next: (proxUpdated) => {
                proxima.status = proxUpdated.status;
                proxima.statusLabel = proxUpdated.statusLabel;
                this.notificationService.info(`Próxima etapa "${proxima.nome}" iniciada automaticamente.`);
                this.carregarProjeto();
              },
              error: () => this.carregarProjeto()
            });
            return;
          }
        }

        this.carregarProjeto();
      },
      error: (err) => {
        console.error('Erro ao atualizar etapa', err);
        this.notificationService.error('Não foi possível alterar a etapa.');
      }
    });
  }

  toggleEtapaStatus(etapa: EtapaProjeto): void {
    if (etapa.status === StatusEtapa.Pendente) {
      this.alterarStatusEtapa(etapa, StatusEtapa.EmAndamento);
    } else if (etapa.status === StatusEtapa.EmAndamento) {
      this.alterarStatusEtapa(etapa, StatusEtapa.Concluida);
    } else if (etapa.status === StatusEtapa.Concluida) {
      this.alterarStatusEtapa(etapa, StatusEtapa.EmAndamento);
    }
  }

  obterTarefas(etapa: EtapaProjeto): TarefaEtapa[] {
    return etapa.tarefas || [];
  }

  toggleTarefa(etapa: EtapaProjeto, tarefa: TarefaEtapa): void {
    const estadoAnterior = tarefa.concluida;
    tarefa.concluida = !tarefa.concluida;
    this.projetoService.alternarTarefa(tarefa.id).subscribe({
      next: (atualizada) => {
        tarefa.concluida = atualizada.concluida;
      },
      error: (err) => {
        tarefa.concluida = estadoAnterior;
        console.error('Erro ao alternar status da tarefa', err);
        this.notificationService.error('Não foi possível atualizar o entregável.');
      }
    });
  }

  adicionarTarefa(etapa: EtapaProjeto, inputEl: HTMLInputElement): void {
    const titulo = inputEl.value.trim();
    if (!titulo) return;

    this.projetoService.adicionarTarefa(etapa.id, titulo).subscribe({
      next: (novaTarefa) => {
        if (!etapa.tarefas) etapa.tarefas = [];
        etapa.tarefas.push(novaTarefa);
        inputEl.value = '';
        this.notificationService.success('Entregável adicionado!');
      },
      error: (err) => {
        console.error('Erro ao adicionar entregável', err);
        this.notificationService.error('Erro ao adicionar entregável.');
      }
    });
  }

  removerTarefa(etapa: EtapaProjeto, tarefaId: string): void {
    this.projetoService.removerTarefa(tarefaId).subscribe({
      next: () => {
        if (etapa.tarefas) {
          etapa.tarefas = etapa.tarefas.filter(t => t.id !== tarefaId);
        }
        this.notificationService.info('Entregável removido.');
      },
      error: (err) => {
        console.error('Erro ao remover entregável', err);
        this.notificationService.error('Erro ao remover entregável.');
      }
    });
  }

  getTarefasConcluidasCount(etapa: EtapaProjeto): number {
    const tarefas = this.obterTarefas(etapa);
    return tarefas.filter(t => t.concluida).length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.projeto) {
      const file = input.files[0];
      if (file.size > 20 * 1024 * 1024) {
        this.notificationService.error('O arquivo excede o limite máximo permitido de 20 MB.');
        input.value = '';
        return;
      }

      this.uploadingArquivo = true;
      this.arquivoService.upload(file, this.projeto.id, this.novoArquivoVisivelCliente).subscribe({
        next: (uploaded) => {
          this.uploadingArquivo = false;
          this.notificationService.success(`Arquivo "${uploaded.nome}" enviado!`);
          this.arquivos.unshift(uploaded);
          input.value = '';
        },
        error: (err) => {
          this.uploadingArquivo = false;
          console.error('Erro ao enviar arquivo', err);
          this.notificationService.error('Erro ao realizar upload.');
          input.value = '';
        }
      });
    }
  }

  excluirArquivo(arquivo: Arquivo): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Arquivo',
        message: `Tem certeza de que deseja excluir o arquivo "${arquivo.nome}"?`
      }
    });
    ref.instance.confirm.subscribe(() => {
      this.arquivoService.excluir(arquivo.id).subscribe({
        next: () => {
          this.arquivos = this.arquivos.filter(a => a.id !== arquivo.id);
          this.notificationService.success('Arquivo removido com sucesso.');
        },
        error: (err) => {
          console.error('Erro ao excluir arquivo', err);
          this.notificationService.error('Não foi possível excluir o arquivo.');
        }
      });
    });
  }

  getFileIcon(nome: string): string {
    const ext = nome.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }

  abrirModalEdicao(): void {
    if (!this.projeto) return;
    const ref = this.dialogService.open(EditarProjetoModalComponent, {
      data: { projeto: this.projeto }
    });
    ref.instance.saved.subscribe((updated: Projeto) => {
      this.projeto = updated;
      this.carregarProjeto();
    });
  }

  voltar(): void {
    this.router.navigate(['/projetos']);
  }
}
