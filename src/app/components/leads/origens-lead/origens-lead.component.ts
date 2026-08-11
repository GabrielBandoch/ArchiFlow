import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { OrigemLeadService } from '../../../core/api/origem-lead.service';
import { NotificationService } from '../../../core/services/notification.service';
import { OrigemLead } from '../../../models/origem-lead.model';

@Component({
  selector: 'app-origens-lead',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './origens-lead.component.html',
  styleUrl: './origens-lead.component.scss'
})
export class OrigensLeadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private origemService = inject(OrigemLeadService);
  private notificationService = inject(NotificationService);

  origens: OrigemLead[] = [];
  form: FormGroup;
  editForm: FormGroup;
  submitted = false;
  editSubmitted = false;
  
  editingOrigemId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.editForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.carregarOrigens();
  }

  carregarOrigens(): void {
    this.origemService.obterTodos().subscribe({
      next: (data) => this.origens = data,
      error: (err) => {
        console.error('Erro ao carregar origens', err);
        this.notificationService.error('Erro ao carregar as origens.');
      }
    });
  }

  get f() { return this.form.controls; }
  get ef() { return this.editForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const desc = this.form.value.descricao;
    this.origemService.criar(desc).subscribe({
      next: () => {
        this.notificationService.success('Origem cadastrada com sucesso!');
        this.form.reset();
        this.submitted = false;
        this.carregarOrigens();
      },
      error: (err) => {
        console.error('Erro ao criar origem', err);
        const errorMsg = err.error?.error || 'Erro ao cadastrar origem.';
        this.notificationService.error(errorMsg);
      }
    });
  }

  iniciarEdicao(origem: OrigemLead): void {
    this.editingOrigemId = origem.id;
    this.editForm.setValue({
      descricao: origem.descricao
    });
    this.editSubmitted = false;
  }

  cancelarEdicao(): void {
    this.editingOrigemId = null;
  }

  onEditSubmit(): void {
    this.editSubmitted = true;
    if (this.editForm.invalid || !this.editingOrigemId) {
      return;
    }

    const desc = this.editForm.value.descricao;
    this.origemService.atualizar(this.editingOrigemId, desc).subscribe({
      next: () => {
        this.notificationService.success('Origem atualizada com sucesso!');
        this.editingOrigemId = null;
        this.carregarOrigens();
      },
      error: (err) => {
        console.error('Erro ao atualizar origem', err);
        const errorMsg = err.error?.error || 'Erro ao atualizar origem.';
        this.notificationService.error(errorMsg);
      }
    });
  }

  desativarOrigem(origem: OrigemLead): void {
    this.origemService.desativar(origem.id).subscribe({
      next: () => {
        this.notificationService.success(`Origem "${origem.descricao}" desativada com sucesso.`);
        this.carregarOrigens();
      },
      error: (err) => {
        console.error('Erro ao desativar origem', err);
        this.notificationService.error('Erro ao desativar origem.');
      }
    });
  }

  reativarOrigem(origem: OrigemLead): void {
    this.origemService.reativar(origem.id).subscribe({
      next: () => {
        this.notificationService.success(`Origem "${origem.descricao}" reativada com sucesso.`);
        this.carregarOrigens();
      },
      error: (err) => {
        console.error('Erro ao reativar origem', err);
        this.notificationService.error('Erro ao reativar origem.');
      }
    });
  }
}
