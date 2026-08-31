import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProjectTemplate, TemplateEtapaItem } from '../../../models/project-template.model';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule, FormsModule],
  templateUrl: './template-modal.component.html',
  styleUrl: './template-modal.component.scss'
})
export class TemplateModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private templateService = inject(ProjectTemplateService);
  private notificationService = inject(NotificationService);

  @Input() show = true;
  @Input() templateParaEdicao?: ProjectTemplate;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ProjectTemplate>();

  form!: FormGroup;
  isEditing = false;
  saving = false;
  submitted = false;

  etapas: TemplateEtapaItem[] = [];
  novaTarefaInputs: { [key: number]: string } = {};

  readonly availableIcons = [
    { name: 'home', label: 'Residencial' },
    { name: 'chair', label: 'Interiores' },
    { name: 'storefront', label: 'Comercial' },
    { name: 'apartment', label: 'Edifícios' },
    { name: 'yard', label: 'Paisagismo' },
    { name: 'analytics', label: 'Consultoria' },
    { name: 'architecture', label: 'Arquitetura' },
    { name: 'tune', label: 'Geral' }
  ];

  ngOnInit(): void {
    this.isEditing = !!this.templateParaEdicao;

    this.form = this.fb.group({
      nome: [this.templateParaEdicao?.nome || '', [Validators.required, Validators.maxLength(200)]],
      codigo: [
        this.templateParaEdicao?.codigo || this.templateParaEdicao?.id || '',
        [Validators.required, Validators.maxLength(100)]
      ],
      descricao: [this.templateParaEdicao?.descricao || ''],
      icone: [this.templateParaEdicao?.icone || 'home', Validators.required]
    });

    if (this.templateParaEdicao && this.templateParaEdicao.etapas) {
      this.etapas = JSON.parse(JSON.stringify(this.templateParaEdicao.etapas));
    } else {
      this.etapas = [
        {
          ordem: 1,
          nome: 'Briefing e Estudo Preliminar',
          descricao: 'Levantamento de dados e programa de necessidades',
          tarefas: ['Briefing inicial com cliente', 'Levantamento métrico no local']
        }
      ];
    }
  }

  get f() {
    return this.form.controls;
  }

  selectIcon(iconName: string): void {
    this.form.patchValue({ icone: iconName });
  }

  adicionarEtapa(): void {
    const novaOrdem = this.etapas.length + 1;
    this.etapas.push({
      ordem: novaOrdem,
      nome: `Etapa ${novaOrdem}`,
      descricao: '',
      tarefas: []
    });
  }

  removerEtapa(index: number): void {
    this.etapas.splice(index, 1);
    this.reordenarEtapas();
  }

  moverEtapa(index: number, direcao: number): void {
    const novoIndex = index + direcao;
    if (novoIndex < 0 || novoIndex >= this.etapas.length) return;

    const temp = this.etapas[index];
    this.etapas[index] = this.etapas[novoIndex];
    this.etapas[novoIndex] = temp;
    this.reordenarEtapas();
  }

  private reordenarEtapas(): void {
    this.etapas.forEach((e, idx) => {
      e.ordem = idx + 1;
    });
  }

  adicionarTarefa(etapaIndex: number): void {
    const texto = (this.novaTarefaInputs[etapaIndex] || '').trim();
    if (!texto) return;

    if (!this.etapas[etapaIndex].tarefas) {
      this.etapas[etapaIndex].tarefas = [];
    }

    this.etapas[etapaIndex].tarefas.push(texto);
    this.novaTarefaInputs[etapaIndex] = '';
  }

  removerTarefa(etapaIndex: number, tarefaIndex: number): void {
    this.etapas[etapaIndex].tarefas.splice(tarefaIndex, 1);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    if (this.etapas.length === 0) {
      this.notificationService.error('O modelo precisa ter pelo menos uma etapa.');
      return;
    }

    const payload = {
      nome: this.form.value.nome,
      codigo: this.form.value.codigo,
      descricao: this.form.value.descricao,
      icone: this.form.value.icone,
      etapas: this.etapas.map(e => ({
        nome: e.nome,
        descricao: e.descricao,
        ordem: e.ordem,
        tarefas: e.tarefas || []
      }))
    };

    this.saving = true;

    if (this.isEditing && this.templateParaEdicao) {
      this.templateService.atualizarTemplate(this.templateParaEdicao.id, payload).subscribe({
        next: (res) => {
          this.saving = false;
          this.notificationService.success('Modelo de workflow atualizado com sucesso.');
          this.saved.emit(res);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          console.error('Erro ao atualizar template', err);
          this.notificationService.error('Erro ao atualizar o modelo de projeto.');
        }
      });
    } else {
      this.templateService.criarTemplate(payload).subscribe({
        next: (res) => {
          this.saving = false;
          this.notificationService.success('Modelo de workflow criado com sucesso.');
          this.saved.emit(res);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          console.error('Erro ao criar template', err);
          this.notificationService.error('Erro ao criar o modelo de projeto.');
        }
      });
    }
  }

  onClose(): void {
    this.show = false;
    this.close.emit();
  }
}
