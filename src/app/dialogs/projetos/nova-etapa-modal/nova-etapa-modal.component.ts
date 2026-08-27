import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EtapaProjeto } from '../../../models/projeto.model';
import { CriarEtapaCommand } from '../../../commands/projeto.commands';
import { ProjetoForm } from '../../../components/projetos/projeto.form';

@Component({
  selector: 'app-nova-etapa-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './nova-etapa-modal.component.html',
  styleUrl: './nova-etapa-modal.component.scss'
})
export class NovaEtapaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() projetoId = '';
  @Input() ordem = 1;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<EtapaProjeto>();

  form!: FormGroup;
  saving = false;
  submitted = false;

  get f() {
    return this.form.controls;
  }

  constructor() {
    this.form = ProjetoForm.createEtapa(this.fb, 1);
  }

  ngOnInit(): void {
    this.form.patchValue({ ordem: this.ordem });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this.projetoId) {
      this.notificationService.warning('Por favor, preencha o nome da etapa.');
      return;
    }

    this.saving = true;
    const val = this.form.value;
    const command: CriarEtapaCommand = {
      projetoId: this.projetoId,
      nome: val.nome,
      descricao: val.descricao || '',
      ordem: Number(val.ordem || 1)
    };

    this.projetoService.criarEtapa(this.projetoId, command).subscribe({
      next: (etapa) => {
        this.saving = false;
        this.notificationService.success(`Etapa "${etapa.nome}" adicionada com sucesso!`);
        this.saved.emit(etapa);
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        console.error('Erro ao criar etapa', err);
        this.notificationService.error('Erro ao criar etapa.');
      }
    });
  }
}
