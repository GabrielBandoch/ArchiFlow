import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cliente } from '../../../models/cliente.model';
import { Projeto, TipoProjeto } from '../../../models/projeto.model';
import { ProjectTemplate } from '../../../models/project-template.model';
import { CriarProjetoCommand } from '../../../commands/projeto.commands';
import { ProjetoForm } from '../../../components/projetos/projeto.form';
import { SelectOption } from '../../../shared/components/select/select.component';
import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-criar-projeto-modal',
  standalone: true,
  imports: [
    CORE_IMPORTS, 
    FORM_IMPORTS, 
    DESIGN_SYSTEM, 
    ReactiveFormsModule, 
    FormsModule
  ],
  templateUrl: './criar-projeto-modal.component.html',
  styleUrl: './criar-projeto-modal.component.scss'
})
export class CriarProjetoModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projetoService = inject(ProjetoService);
  private clienteService = inject(ClienteService);
  private projectTemplateService = inject(ProjectTemplateService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() preselectedClienteId?: string;
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<Projeto>();
  @Output() saved = new EventEmitter<Projeto>();

  form!: FormGroup;
  submitted = false;
  saving = false;
  clientes: Cliente[] = [];
  templates: ProjectTemplate[] = [];
  selectedTemplateId = 'residencial-completo';

  tipoOptions: SelectOption[] = [
    { value: TipoProjeto.Residencial, label: 'Residencial' },
    { value: TipoProjeto.Comercial, label: 'Comercial' },
    { value: TipoProjeto.Corporativo, label: 'Corporativo' },
    { value: TipoProjeto.Interiores, label: 'Design de Interiores' }
  ];

  templateOptions: SelectOption[] = [];

  get selectedTemplate(): ProjectTemplate | undefined {
    return this.templates.find(t => t.id === this.selectedTemplateId);
  }

  get f() {
    return this.form.controls;
  }

  constructor() {
    this.form = ProjetoForm.create(this.fb);
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarTemplates();
  }

  carregarClientes(): void {
    this.clienteService.obterTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        if (this.preselectedClienteId) {
          this.form.patchValue({ clienteId: this.preselectedClienteId });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
      }
    });
  }

  carregarTemplates(): void {
    this.projectTemplateService.obterTemplates().subscribe({
      next: (list) => {
        this.templates = list;
        this.templateOptions = list.map(t => ({
          value: t.id,
          label: t.nome,
          subLabel: `${t.etapas.length} etapas inclusas`,
          icon: t.icone
        }));
      }
    });
  }

  onTipoChange(tipo: any): void {
    const numTipo = Number(tipo);
    if (numTipo === TipoProjeto.Interiores) {
      this.selectedTemplateId = 'interiores-reforma';
    } else if (numTipo === TipoProjeto.Comercial || numTipo === TipoProjeto.Corporativo) {
      this.selectedTemplateId = 'comercial-corporativo';
    } else {
      this.selectedTemplateId = 'residencial-completo';
    }
  }

  onClose(): void {
    this.submitted = false;
    this.form.reset({
      tipo: TipoProjeto.Residencial,
      dataInicio: new Date().toISOString().substring(0, 10),
      metragemTotal: 0
    });
    this.selectedTemplateId = 'residencial-completo';
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.saving = true;
    const val = this.form.value;

    const command: CriarProjetoCommand = {
      nome: val.nome,
      descricao: val.descricao || '',
      tipo: Number(val.tipo),
      dataInicio: val.dataInicio ? new Date(val.dataInicio).toISOString() : new Date().toISOString(),
      dataPrevistaEntrega: val.dataPrevistaEntrega ? new Date(val.dataPrevistaEntrega).toISOString() : undefined,
      metragemTotal: Number(val.metragemTotal || 0),
      clienteId: val.clienteId
    };

    this.projetoService.criar(command).subscribe({
      next: (proj) => {
        this.salvarEtapasDoTemplate(proj);
      },
      error: (err) => {
        this.saving = false;
        console.error('Erro ao criar projeto', err);
        const msg = err.error?.error || err.error?.message || 'Erro ao criar projeto.';
        this.notificationService.error(msg);
      }
    });
  }

  private salvarEtapasDoTemplate(proj: Projeto): void {
    const template = this.selectedTemplate;
    if (!template || template.etapas.length === 0) {
      this.finalizarCriacao(proj);
      return;
    }

    const criacoes = template.etapas.map(etapa => 
      this.projetoService.criarEtapa(proj.id, {
        projetoId: proj.id,
        nome: etapa.nome,
        descricao: etapa.descricao,
        ordem: etapa.ordem
      })
    );

    forkJoin(criacoes).subscribe({
      next: (etapasCriadas) => {
        const tarefasCriacoes: Observable<any>[] = [];
        etapasCriadas.forEach((etapaCriada, index) => {
          const etapaTemplate = template.etapas[index];
          if (etapaTemplate && etapaTemplate.tarefas) {
            etapaTemplate.tarefas.forEach(titulo => {
              tarefasCriacoes.push(this.projetoService.adicionarTarefa(etapaCriada.id, titulo));
            });
          }
        });

        if (tarefasCriacoes.length > 0) {
          forkJoin(tarefasCriacoes).subscribe({
            next: () => this.finalizarCriacao(proj),
            error: () => this.finalizarCriacao(proj)
          });
        } else {
          this.finalizarCriacao(proj);
        }
      },
      error: () => {
        this.finalizarCriacao(proj);
      }
    });
  }

  private finalizarCriacao(proj: Projeto): void {
    this.saving = false;
    this.notificationService.success(`Projeto "${proj.nome}" criado com sucesso!`);
    this.projectCreated.emit(proj);
    this.saved.emit(proj);
    this.onClose();
  }
}
