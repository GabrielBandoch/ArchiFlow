import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fornecedor, CriarFornecedorCommand, AtualizarFornecedorCommand } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FornecedorForm } from '../../../components/fornecedores/fornecedor.form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select/select.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-fornecedor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    ButtonComponent,
    SelectComponent,
    InputComponent
  ],
  templateUrl: './fornecedor-modal.component.html',
  styleUrls: ['./fornecedor-modal.component.scss']
})
export class FornecedorModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() fornecedor?: Fornecedor;
  @Output() close = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<Fornecedor>();

  form!: FormGroup;
  salvando = false;
  submitted = false;

  get f() {
    return this.form.controls;
  }

  readonly especialidadeOptions: SelectOption[] = [
    { value: 'Iluminação', label: 'Iluminação & Luminotécnica' },
    { value: 'Pisos', label: 'Pisos & Revestimentos' },
    { value: 'Estrutural', label: 'Estruturas & Aço' },
    { value: 'Marcenaria', label: 'Marcenaria & Mobiliário' },
    { value: 'Vidraçaria', label: 'Vidraçaria & Esquadrias' },
    { value: 'Marmoraria', label: 'Marmoraria & Pedras' },
    { value: 'Paisagismo', label: 'Paisagismo & Áreas Verdes' },
    { value: 'Gesso', label: 'Gesso & Drywall' },
    { value: 'Outro', label: 'Outra Especialidade' }
  ];

  ngOnInit(): void {
    this.form = FornecedorForm.createFornecedor(this.fb);

    if (this.fornecedor) {
      this.form.patchValue({
        nome: this.fornecedor.nome,
        especialidade: this.fornecedor.especialidade,
        email: this.fornecedor.email,
        telefone: this.fornecedor.telefone || '',
        cidade: this.fornecedor.cidade || '',
        estado: this.fornecedor.estado || 'SC',
        descricao: this.fornecedor.descricao || ''
      });
    }
  }

  fechar(): void {
    this.close.emit();
  }

  salvar(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning('Preencha os campos obrigatórios corretamente.');
      return;
    }

    this.salvando = true;
    const formVal = this.form.value;

    if (this.fornecedor) {
      const command: AtualizarFornecedorCommand = {
        id: this.fornecedor.id,
        ativo: this.fornecedor.ativo,
        ...formVal
      };

      this.fornecedorService.atualizar(this.fornecedor.id, command).subscribe({
        next: (res) => {
          this.salvando = false;
          this.notificationService.success('Parceiro atualizado com sucesso!');
          this.salvo.emit(res);
          this.fechar();
        },
        error: () => {
          this.salvando = false;
          this.notificationService.error('Erro ao atualizar parceiro.');
        }
      });
    } else {
      const command: CriarFornecedorCommand = { ...formVal };

      this.fornecedorService.criar(command).subscribe({
        next: (res) => {
          this.salvando = false;
          this.notificationService.success('Novo parceiro cadastrado com sucesso!');
          this.salvo.emit(res);
          this.fechar();
        },
        error: () => {
          this.salvando = false;
          this.notificationService.error('Erro ao cadastrar parceiro.');
        }
      });
    }
  }
}
