import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Projeto } from '../../../models/projeto.model';
import { SelectOption } from '../../../shared/components/select/select.component';
import { CriarContratoCommand, CriarParcelaCommand } from '../../../commands/financeiro.commands';
import { FinanceiroForm } from '../../../components/financeiro/financeiro.form';

@Component({
  selector: 'app-criar-parcela-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CORE_IMPORTS,
    FORM_IMPORTS,
    DESIGN_SYSTEM
  ],
  templateUrl: './criar-parcela-modal.component.html',
  styleUrl: './criar-parcela-modal.component.scss'
})
export class CriarParcelaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeiroService = inject(FinanceiroService);
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() preselectedProjectId?: string;
  @Output() close = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  modo: 'avulsa' | 'contrato' = 'avulsa';
  formAvulsa!: FormGroup;
  formContrato!: FormGroup;
  projetos: Projeto[] = [];
  projetoOptions: SelectOption[] = [];
  saving = false;

  ngOnInit(): void {
    this.formAvulsa = FinanceiroForm.createParcelaAvulsa(this.fb, this.preselectedProjectId || '');
    this.formContrato = FinanceiroForm.createParcelaContrato(this.fb, this.preselectedProjectId || '');

    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projetoService.obterTodos().subscribe({
      next: (data) => {
        this.projetos = data;
        this.projetoOptions = data.map(p => ({
          value: p.id,
          label: p.nome
        }));
        if (this.preselectedProjectId) {
          this.formAvulsa.patchValue({ projetoId: this.preselectedProjectId });
          this.formContrato.patchValue({ projetoId: this.preselectedProjectId });
        }
      },
      error: (err) => console.error('Erro ao carregar projetos', err)
    });
  }

  setModo(modo: 'avulsa' | 'contrato'): void {
    this.modo = modo;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.modo === 'avulsa') {
      this.salvarAvulsa();
    } else {
      this.salvarContrato();
    }
  }

  private salvarAvulsa(): void {
    if (this.formAvulsa.invalid) {
      this.notificationService.warning('Preencha os campos obrigatórios da parcela.');
      return;
    }

    this.saving = true;
    const val = this.formAvulsa.value;

    const command: CriarParcelaCommand = {
      projetoId: val.projetoId,
      numeroParcela: Number(val.numeroParcela),
      totalParcelas: Number(val.totalParcelas),
      descricao: val.descricao,
      valor: Number(val.valor),
      dataVencimento: new Date(val.dataVencimento).toISOString(),
      observacoes: val.observacoes || undefined
    };

    this.financeiroService.registrarParcela(command).subscribe({
      next: () => {
        this.saving = false;
        this.notificationService.success('Parcela registrada com sucesso!');
        this.salvo.emit();
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.mensagem || err.error?.message || 'Erro ao registrar parcela.';
        this.notificationService.error(msg);
      }
    });
  }

  private salvarContrato(): void {
    if (this.formContrato.invalid) {
      this.notificationService.warning('Preencha todos os campos obrigatórios do contrato.');
      return;
    }

    this.saving = true;
    const val = this.formContrato.value;

    const command: CriarContratoCommand = {
      projetoId: val.projetoId,
      valorTotal: Number(val.valorTotal),
      numeroParcelas: Number(val.numeroParcelas),
      dataPrimeiroVencimento: new Date(val.dataPrimeiroVencimento).toISOString(),
      intervaloDias: Number(val.intervaloDias),
      condicoesPagamento: val.condicoesPagamento || undefined,
      observacoes: val.observacoes || undefined
    };

    this.financeiroService.criarContrato(command).subscribe({
      next: () => {
        this.saving = false;
        this.notificationService.success('Contrato e parcelamento gerados com sucesso!');
        this.salvo.emit();
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.mensagem || err.error?.message || 'Erro ao criar contrato parcelado.';
        this.notificationService.error(msg);
      }
    });
  }
}
