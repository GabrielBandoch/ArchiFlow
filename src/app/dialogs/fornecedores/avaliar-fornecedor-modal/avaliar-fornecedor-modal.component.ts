import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fornecedor, AvaliacaoFornecedor, AdicionarAvaliacaoCommand } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FornecedorForm } from '../../../components/fornecedores/fornecedor.form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-avaliar-fornecedor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    ButtonComponent,
    InputComponent
  ],
  templateUrl: './avaliar-fornecedor-modal.component.html',
  styleUrls: ['./avaliar-fornecedor-modal.component.scss']
})
export class AvaliarFornecedorModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() fornecedor?: Fornecedor;
  @Output() close = new EventEmitter<void>();
  @Output() avaliado = new EventEmitter<AvaliacaoFornecedor>();

  form!: FormGroup;
  salvando = false;
  submitted = false;
  notaSelecionada = 5;

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = FornecedorForm.createAvaliacao(this.fb, this.fornecedor?.id || '');
  }

  selecionarNota(n: number): void {
    this.notaSelecionada = n;
    this.form.patchValue({ nota: n });
  }

  fechar(): void {
    this.close.emit();
  }

  salvar(): void {
    this.submitted = true;
    if (!this.fornecedor || this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning('Informe a nota e o comentário da avaliação.');
      return;
    }

    this.salvando = true;
    const command: AdicionarAvaliacaoCommand = {
      fornecedorId: this.fornecedor.id,
      nota: this.notaSelecionada,
      comentario: this.form.value.comentario,
      autorNome: this.form.value.autorNome || 'Arquiteto Titular'
    };

    this.fornecedorService.adicionarAvaliacao(this.fornecedor.id, command).subscribe({
      next: (res) => {
        this.salvando = false;
        this.notificationService.success('Avaliação registrada com sucesso!');
        this.avaliado.emit(res);
        this.fechar();
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro ao registrar avaliação.');
      }
    });
  }
}
