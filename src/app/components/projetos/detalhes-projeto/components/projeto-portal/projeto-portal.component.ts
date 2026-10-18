import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProjetoPortalForm } from './projeto-portal.form';
import { RepresentanteCliente } from '../../../../../models/cliente.model';
import { ProjetoService } from '../../../../../core/api/projetos/projeto.service';
import { ClienteService } from '../../../../../core/api/clientes/cliente.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-projeto-portal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    DialogComponent,
    EmptyStateComponent,
    BadgeComponent
  ],
  templateUrl: './projeto-portal.component.html',
  styleUrls: ['./projeto-portal.component.scss']
})
export class ProjetoPortalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projetoService = inject(ProjetoService);
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);

  @Input() projetoId = '';
  @Input() projetoNome = '';
  @Input() clienteId?: string;
  @Input() clienteNome?: string;
  @Input() representantes: RepresentanteCliente[] = [];

  @Output() representantesAlterados = new EventEmitter<void>();

  modalConvidarAberto = false;
  salvando = false;
  form!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = ProjetoPortalForm.create(this.fb);
  }

  abrirModalConvidar(): void {
    if (!this.clienteId) {
      this.notificationService.warning('Vincule um cliente ao projeto antes de cadastrar representantes.');
      return;
    }
    this.submitted = false;
    this.form.reset({
      nome: '',
      email: '',
      cargo: '',
      telefone: '',
      enviarEmailAgora: false
    });
    this.modalConvidarAberto = true;
  }

  fecharModalConvidar(): void {
    this.modalConvidarAberto = false;
  }

  salvarRepresentante(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.notificationService.warning('Preencha os campos obrigatórios corretamente.');
      return;
    }

    this.salvando = true;
    const val = this.form.value;

    const command = {
      nome: val.nome.trim(),
      email: val.email.trim(),
      cargo: val.cargo?.trim() || null,
      telefone: val.telefone?.trim() || null,
      enviarEmailConvite: !!val.enviarEmailAgora
    };

    this.projetoService.convidarRepresentante(this.projetoId, command).subscribe({
      next: () => {
        this.salvando = false;
        this.modalConvidarAberto = false;
        const msg = command.enviarEmailConvite
          ? 'Representante cadastrado e convite de acesso enviado por e-mail!'
          : 'Representante cadastrado com sucesso. Você pode enviar o convite de acesso a qualquer momento.';
        this.notificationService.success(msg);
        this.representantesAlterados.emit();
      },
      error: (err) => {
        this.salvando = false;
        console.error('Erro ao cadastrar representante no projeto', err);
        const msg = err.error?.message || err.error || 'Erro ao cadastrar representante.';
        this.notificationService.error(msg);
      }
    });
  }

  reenviarConvite(rep: RepresentanteCliente): void {
    this.clienteService.reenviarConvite(rep.id).subscribe({
      next: () => {
        rep.statusConvite = 'Convite Enviado';
        this.notificationService.success(`Convite de acesso ao portal enviado para ${rep.email}!`);
      },
      error: (err) => {
        console.error('Erro ao reenviar convite', err);
        this.notificationService.error(err.error?.message || 'Erro ao enviar convite.');
      }
    });
  }

  alternarStatus(rep: RepresentanteCliente): void {
    const novoStatus = !rep.ativo;
    this.clienteService.alterarStatusRepresentante(rep.id, novoStatus).subscribe({
      next: (atualizado) => {
        rep.ativo = atualizado.ativo;
        this.notificationService.success(`Acesso de ${rep.nome} alterado para ${rep.ativo ? 'Ativo' : 'Inativo'}.`);
      },
      error: (err) => {
        console.error('Erro ao alternar status do representante', err);
        this.notificationService.error('Erro ao atualizar status do representante.');
      }
    });
  }

  removerRepresentante(rep: RepresentanteCliente): void {
    if (!confirm(`Deseja remover o representante ${rep.nome} do portal?`)) return;

    this.clienteService.removerRepresentante(rep.id).subscribe({
      next: () => {
        this.notificationService.success(`Representante ${rep.nome} removido.`);
        this.representantesAlterados.emit();
      },
      error: (err) => {
        console.error('Erro ao remover representante', err);
        this.notificationService.error('Erro ao remover representante.');
      }
    });
  }
}
