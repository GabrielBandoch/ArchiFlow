import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Projeto, TipoProjeto, StatusProjeto } from '../../../models/projeto.model';
import { AtualizarProjetoCommand } from '../../../commands/projeto.commands';
import { ProjetoForm } from '../../../components/projetos/projeto.form';
import { SelectOption } from '../../../shared/components/select/select.component';

@Component({
  selector: 'app-editar-projeto-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './editar-projeto-modal.component.html',
  styleUrl: './editar-projeto-modal.component.scss'
})
export class EditarProjetoModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  
  private _projeto: Projeto | null = null;
  @Input()
  get projeto(): Projeto | null {
    return this._projeto;
  }
  set projeto(val: Projeto | null) {
    this._projeto = val;
    if (val && this.form) {
      this.carregarDados(val);
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Projeto>();

  form!: FormGroup;
  saving = false;
  submitted = false;

  tipoOptions: SelectOption[] = [
    { value: TipoProjeto.Residencial, label: 'Residencial' },
    { value: TipoProjeto.Comercial, label: 'Comercial' },
    { value: TipoProjeto.Corporativo, label: 'Corporativo' },
    { value: TipoProjeto.Interiores, label: 'Design de Interiores' }
  ];

  statusOptions: SelectOption[] = [
    { value: StatusProjeto.Briefing, label: 'Briefing' },
    { value: StatusProjeto.Desenvolvimento, label: 'Desenvolvimento' },
    { value: StatusProjeto.Revisao, label: 'Revisão' },
    { value: StatusProjeto.Aprovacao, label: 'Aprovação' },
    { value: StatusProjeto.Execucao, label: 'Execução' },
    { value: StatusProjeto.Concluido, label: 'Concluído' },
    { value: StatusProjeto.Cancelado, label: 'Cancelado' }
  ];

  get f() {
    return this.form.controls;
  }

  constructor() {
    this.form = ProjetoForm.edit(this.fb);
  }

  ngOnInit(): void {
    if (this._projeto) {
      this.carregarDados(this._projeto);
    }
  }

  private carregarDados(proj: Projeto): void {
    this.form.patchValue({
      nome: proj.nome,
      descricao: proj.descricao,
      tipo: proj.tipo,
      status: proj.status,
      dataInicio: proj.dataInicio ? proj.dataInicio.substring(0, 10) : '',
      dataPrevistaEntrega: proj.dataPrevistaEntrega ? proj.dataPrevistaEntrega.substring(0, 10) : '',
      metragemTotal: proj.metragemTotal
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this._projeto) {
      this.notificationService.warning('Por favor, preencha os campos obrigatórios.');
      return;
    }

    this.saving = true;
    const val = this.form.value;
    const command: AtualizarProjetoCommand = {
      id: this._projeto.id,
      nome: val.nome,
      descricao: val.descricao || '',
      tipo: Number(val.tipo),
      status: Number(val.status),
      dataInicio: val.dataInicio ? new Date(val.dataInicio).toISOString() : new Date().toISOString(),
      dataPrevistaEntrega: val.dataPrevistaEntrega ? new Date(val.dataPrevistaEntrega).toISOString() : undefined,
      metragemTotal: Number(val.metragemTotal || 0)
    };

    this.projetoService.atualizar(this._projeto.id, command).subscribe({
      next: (updated) => {
        this.saving = false;
        this.notificationService.success('Dados do projeto atualizados com sucesso!');
        this.saved.emit(updated);
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        console.error('Erro ao atualizar projeto', err);
        this.notificationService.error('Erro ao salvar alterações.');
      }
    });
  }
}
