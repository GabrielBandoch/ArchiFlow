import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormaPagamento, ParcelaFinanceira } from '../../../models/financeiro.model';
import { DarBaixaParcelaCommand } from '../../../commands/financeiro.commands';
import { SelectOption } from '../../../shared/components/select/select.component';

@Component({
  selector: 'app-dar-baixa-parcela-modal',
  standalone: true,
  imports: [
    CommonModule,
    CORE_IMPORTS,
    FORM_IMPORTS,
    DESIGN_SYSTEM,
    ReactiveFormsModule
  ],
  templateUrl: './dar-baixa-parcela-modal.component.html',
  styleUrl: './dar-baixa-parcela-modal.component.scss'
})
export class DarBaixaParcelaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeiroService = inject(FinanceiroService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() parcela: ParcelaFinanceira | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() baixada = new EventEmitter<ParcelaFinanceira>();

  form!: FormGroup;
  saving = false;
  uploadingFile = false;
  submitted = false;
  arquivoSelecionado: File | null = null;

  formaPagamentoOptions: SelectOption[] = [
    { value: FormaPagamento.Pix, label: 'Pix' },
    { value: FormaPagamento.Transferencia, label: 'Transferência Bancária (TED/DOC)' },
    { value: FormaPagamento.Boleto, label: 'Boleto Bancário' },
    { value: FormaPagamento.CartaoCredito, label: 'Cartão de Crédito' },
    { value: FormaPagamento.CartaoDebito, label: 'Cartão de Débito' },
    { value: FormaPagamento.Dinheiro, label: 'Dinheiro / Espécie' },
    { value: FormaPagamento.Outro, label: 'Outro' }
  ];

  ngOnInit(): void {
    const hoje = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      dataPagamento: [hoje, [Validators.required]],
      formaPagamento: [FormaPagamento.Pix, [Validators.required]],
      observacoes: [''],
      comprovanteUrl: ['']
    });
  }

  onClose(): void {
    this.submitted = false;
    this.arquivoSelecionado = null;
    this.close.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 20 * 1024 * 1024) {
        this.notificationService.error('O arquivo excede o limite máximo de 20 MB.');
        input.value = '';
        return;
      }
      this.arquivoSelecionado = file;
    }
  }

  removerArquivo(fileInput?: HTMLInputElement): void {
    this.arquivoSelecionado = null;
    this.form.patchValue({ comprovanteUrl: '' });
    if (fileInput) fileInput.value = '';
  }

  getFileIcon(nome?: string): string {
    if (!nome) return 'description';
    const ext = nome.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'picture_as_pdf';
    return 'description';
  }

  formatarTamanho(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this.parcela) {
      this.notificationService.warning('Preencha os campos obrigatórios para confirmar o pagamento.');
      return;
    }

    if (this.arquivoSelecionado) {
      this.saving = true;
      this.uploadingFile = true;
      this.financeiroService.uploadComprovante(this.arquivoSelecionado).subscribe({
        next: (uploadRes) => {
          this.uploadingFile = false;
          this.form.patchValue({ comprovanteUrl: uploadRes.url });
          this.executarBaixa(uploadRes.url);
        },
        error: (err) => {
          this.saving = false;
          this.uploadingFile = false;
          console.error('Erro ao enviar comprovante', err);
          this.notificationService.error('Erro ao enviar arquivo para o servidor.');
        }
      });
    } else {
      this.saving = true;
      this.executarBaixa(this.form.value.comprovanteUrl);
    }
  }

  private executarBaixa(comprovanteUrl?: string): void {
    if (!this.parcela) return;
    const val = this.form.value;

    const command: DarBaixaParcelaCommand = {
      dataPagamento: new Date(val.dataPagamento).toISOString(),
      formaPagamento: val.formaPagamento,
      observacoes: val.observacoes || undefined,
      comprovanteUrl: comprovanteUrl || undefined
    };

    this.financeiroService.darBaixaParcela(this.parcela.id, command).subscribe({
      next: (res) => {
        this.saving = false;
        this.notificationService.success(`Pagamento da parcela "${this.parcela?.descricao}" confirmado com sucesso!`);
        this.baixada.emit(res);
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.mensagem || err.error?.message || 'Erro ao confirmar pagamento da parcela.';
        this.notificationService.error(msg);
      }
    });
  }
}

