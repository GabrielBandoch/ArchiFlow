import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { SelectOption } from '../../../shared/components/select/select.component';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MembroEquipe, PerfilUsuario } from '../../../models/usuario.model';
import { ConvidarMembroEquipeCommand, AtualizarMembroEquipeCommand } from '../../../commands/usuario.commands';
import { MembroEquipeForm } from './membro-equipe.form';

@Component({
  selector: 'app-membro-equipe-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule, FormsModule],
  templateUrl: './membro-equipe-modal.component.html',
  styleUrl: './membro-equipe-modal.component.scss'
})
export class MembroEquipeModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notificationService = inject(NotificationService);

  @Input() show = true;
  @Input() membroParaEdicao?: MembroEquipe;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<MembroEquipe>();

  form!: FormGroup;
  isEditing = false;
  saving = false;
  submitted = false;

  readonly rolesOptions: SelectOption[] = [
    { value: 'ArquitetoAdmin', label: 'Arquiteto Sócio / Administrador', subLabel: 'Acesso total a todos os módulos, financeiro e membros' },
    { value: 'ArquitetoColaborador', label: 'Arquiteto Colaborador', subLabel: 'Acesso a projetos, etapas e cronograma do estúdio' },
    { value: 'Estagiario', label: 'Estagiário', subLabel: 'Acesso às tarefas e projetos com supervisão' },
    { value: 'Financeiro', label: 'Administrativo / Financeiro', subLabel: 'Acesso ao controle de receitas, despesas e contratos' },
    { value: 'Gerente', label: 'Gerente de Projetos', subLabel: 'Acesso a gestão de equipes, clientes e projetos' },
    { value: 'Colaborador', label: 'Colaborador Técnico', subLabel: 'Acesso geral de produção' }
  ];

  ngOnInit(): void {
    this.isEditing = !!this.membroParaEdicao;
    this.form = MembroEquipeForm.create(this.fb, this.membroParaEdicao);
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.saving = true;

    if (this.isEditing && this.membroParaEdicao) {
      const command: AtualizarMembroEquipeCommand = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        role: this.form.value.role,
        cargo: this.form.value.cargo || null,
        telefone: this.form.value.telefone || null
      };

      this.usuarioService.atualizarMembro(this.membroParaEdicao.id, command).subscribe({
        next: (res) => {
          this.saving = false;
          this.notificationService.success('Membro da equipe atualizado com sucesso.');
          this.saved.emit(res);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          console.error('Erro ao atualizar membro', err);
          const msg = err.error?.message || 'Erro ao atualizar dados do membro da equipe.';
          this.notificationService.error(msg);
        }
      });
    } else {
      const command: ConvidarMembroEquipeCommand = {
        nome: this.form.value.nome,
        email: this.form.get('email')?.value,
        role: this.form.value.role,
        cargo: this.form.value.cargo || null,
        telefone: this.form.value.telefone || null,
        senhaTemporaria: this.form.value.senhaTemporaria || null
      };

      this.usuarioService.convidarMembro(command).subscribe({
        next: (res) => {
          this.saving = false;
          this.notificationService.success('Membro cadastrado com sucesso! Convite enviado por e-mail.');
          this.saved.emit(res);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          console.error('Erro ao convidar membro', err);
          const msg = err.error?.message || 'Erro ao convidar novo membro para a equipe.';
          this.notificationService.error(msg);
        }
      });
    }
  }

  onClose(): void {
    this.show = false;
    this.close.emit();
  }
}
