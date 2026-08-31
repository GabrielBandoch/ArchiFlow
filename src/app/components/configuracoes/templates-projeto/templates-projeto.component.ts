import { Component, OnInit, inject } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProjectTemplate } from '../../../models/project-template.model';
import { TemplateModalComponent } from '../../../dialogs/configuracoes/template-modal/template-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-templates-projeto',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './templates-projeto.component.html',
  styleUrl: './templates-projeto.component.scss'
})
export class TemplatesProjetoComponent implements OnInit {
  private templateService = inject(ProjectTemplateService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  templates: ProjectTemplate[] = [];
  loading = true;

  ngOnInit(): void {
    this.carregarTemplates();
  }

  carregarTemplates(): void {
    this.loading = true;
    this.templateService.obterTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar templates', err);
        this.notificationService.error('Erro ao carregar os modelos de projeto.');
        this.loading = false;
      }
    });
  }

  obterTotalTarefas(template: ProjectTemplate): number {
    if (!template.etapas) return 0;
    return template.etapas.reduce((acc, curr) => acc + (curr.tarefas?.length || 0), 0);
  }

  abrirModalCriacao(): void {
    const ref = this.dialogService.open(TemplateModalComponent);
    ref.instance.saved.subscribe(() => {
      this.carregarTemplates();
    });
  }

  editarTemplate(template: ProjectTemplate): void {
    const ref = this.dialogService.open(TemplateModalComponent, {
      data: { templateParaEdicao: template }
    });
    ref.instance.saved.subscribe(() => {
      this.carregarTemplates();
    });
  }

  excluirTemplate(template: ProjectTemplate): void {
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Modelo de Workflow',
        message: `Tem certeza de que deseja excluir o modelo "${template.nome}"? Esta ação não afetará os projetos já criados.`
      }
    });

    ref.instance.confirm.subscribe(() => {
      this.templateService.excluirTemplate(template.id).subscribe({
        next: () => {
          this.notificationService.success('Modelo excluído com sucesso.');
          this.carregarTemplates();
        },
        error: (err) => {
          console.error('Erro ao excluir template', err);
          this.notificationService.error('Não foi possível excluir o modelo de projeto.');
        }
      });
    });
  }
}
