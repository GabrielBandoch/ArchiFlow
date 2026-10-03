import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjetoFornecedor, Fornecedor, VincularProjetoCommand } from '../../../../../models/fornecedor.model';
import { FornecedorService } from '../../../../../core/api/fornecedores/fornecedor.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';
import { SelectComponent, SelectOption } from '../../../../../shared/components/select/select.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { WhatsAppButtonComponent } from '../../../../../shared/components/whatsapp-button/whatsapp-button.component';
import { PhoneMaskPipe } from '../../../../../core/pipes/phone-mask.pipe';

@Component({
  selector: 'app-projeto-fornecedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    EmptyStateComponent,
    DialogComponent,
    SelectComponent,
    InputComponent,
    WhatsAppButtonComponent,
    PhoneMaskPipe
  ],
  templateUrl: './projeto-fornecedores.component.html',
  styleUrls: ['./projeto-fornecedores.component.scss']
})
export class ProjetoFornecedoresComponent implements OnInit {
  private fornecedorService = inject(FornecedorService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  @Input() projetoId = '';
  @Input() projetoNome = '';
  @Input() fornecedoresVinculados: ProjetoFornecedor[] = [];
  @Output() vinculoAlterado = new EventEmitter<void>();

  todosFornecedores: Fornecedor[] = [];
  modalVincularAberto = false;
  salvando = false;
  form!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      fornecedorId: ['', Validators.required],
      funcaoNoProjeto: ['', [Validators.required, Validators.maxLength(150)]]
    });
    this.carregarTodosFornecedores();
  }

  get f() {
    return this.form.controls;
  }

  carregarTodosFornecedores(): void {
    this.fornecedorService.obterTodos().subscribe({
      next: (dados) => {
        this.todosFornecedores = dados;
      },
      error: () => {
        this.notificationService.warning('Não foi possível carregar a lista de parceiros cadastrados.');
      }
    });
  }

  get fornecedoresOptions(): SelectOption[] {
    const vinculadosIds = new Set(this.fornecedoresVinculados.map(v => v.fornecedorId));
    return this.todosFornecedores
      .filter(f => !vinculadosIds.has(f.id))
      .map(f => ({
        value: f.id,
        label: `${f.nome} (${f.especialidade})`
      }));
  }

  abrirModalVincular(): void {
    this.submitted = false;
    this.form.reset({
      fornecedorId: '',
      funcaoNoProjeto: ''
    });
    this.modalVincularAberto = true;
  }

  fecharModalVincular(): void {
    this.modalVincularAberto = false;
  }

  salvarVinculo(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.notificationService.warning('Preencha o parceiro e sua função na obra.');
      return;
    }

    this.salvando = true;
    const { fornecedorId, funcaoNoProjeto } = this.form.value;

    const command: VincularProjetoCommand = {
      fornecedorId,
      projetoId: this.projetoId,
      funcaoNoProjeto
    };

    this.fornecedorService.vincularProjeto(fornecedorId, command).subscribe({
      next: () => {
        this.salvando = false;
        this.notificationService.success('Parceiro vinculado com sucesso a esta obra!');
        this.fecharModalVincular();
        this.vinculoAlterado.emit();
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro ao vincular parceiro ao projeto.');
      }
    });
  }

  desvincular(vinculo: ProjetoFornecedor): void {
    this.dialogService.confirm({
      title: 'Desvincular Parceiro da Obra',
      message: `Deseja remover o vínculo de ${vinculo.fornecedorNome || 'este parceiro'} com o projeto?`,
      confirmLabel: 'Sim, desvincular',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    }).subscribe(confirmou => {
      if (!confirmou) return;

      this.fornecedorService.desvincularProjeto(vinculo.id).subscribe({
        next: () => {
          this.notificationService.success('Vínculo do parceiro removido.');
          this.vinculoAlterado.emit();
        },
        error: () => {
          this.notificationService.error('Erro ao desvincular parceiro.');
        }
      });
    });
  }
}
