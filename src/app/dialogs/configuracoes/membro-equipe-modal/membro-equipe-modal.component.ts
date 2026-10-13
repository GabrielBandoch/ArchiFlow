import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { SelectOption } from '../../../shared/components/select/select.component';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MembroEquipe, PerfilUsuario } from '../../../models/usuario.model';
import { ConvidarMembroEquipeCommand, AtualizarMembroEquipeCommand } from '../../../commands/usuario.commands';
import { MembroEquipeForm } from './membro-equipe.form';

export interface PermissaoModulo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  selecionado: boolean;
}

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
    { value: 'ArquitetoAdmin', label: 'Arquiteto Sócio / Titular (Acesso Total)', subLabel: 'Todos os módulos, financeiro, configurações e membros' },
    { value: 'ArquitetoColaborador', label: 'Arquiteto Colaborador', subLabel: 'Acesso a projetos, agenda, clientes e fornecedores' },
    { value: 'Gerente', label: 'Gerente de Projetos', subLabel: 'Acesso a projetos, agenda, clientes e membros da equipe' },
    { value: 'Financeiro', label: 'Administrativo / Financeiro', subLabel: 'Acesso a honorários, financeiro, clientes e agenda' },
    { value: 'Estagiario', label: 'Estagiário', subLabel: 'Acesso a projetos e agenda sob supervisão' },
    { value: 'Colaborador', label: 'Colaborador Técnico', subLabel: 'Acesso de produção e fornecedores' },
    { value: 'Personalizado', label: 'Permissões Personalizadas', subLabel: 'Selecionar manualmente os módulos de acesso' }
  ];

  permissoesModulos: PermissaoModulo[] = [
    { id: 'projetos', nome: 'Projetos & Obras', descricao: 'Acompanhar cronograma, etapas e arquivos', icone: 'folder', selecionado: true },
    { id: 'agenda', nome: 'Agenda & Visitas', descricao: 'Criar reuniões e visitas com Google Calendar', icone: 'calendar_month', selecionado: true },
    { id: 'clientes', nome: 'Clientes & Leads', descricao: 'Acessar funil comercial e contatos', icone: 'group', selecionado: true },
    { id: 'financeiro', nome: 'Financeiro & Honorários', descricao: 'Simulador de propostas, contratos e parcelas', icone: 'payments', selecionado: false },
    { id: 'fornecedores', nome: 'Fornecedores & Parceiros', descricao: 'Catálogo de materiais, serviços e cotações', icone: 'handshake', selecionado: true },
    { id: 'equipe', nome: 'Gestão da Equipe', descricao: 'Convidar colaboradores e gerenciar permissões', icone: 'badge', selecionado: false },
    { id: 'configuracoes', nome: 'Configurações do Estúdio', descricao: 'Modelos de projetos, proposta PDF e dados', icone: 'settings', selecionado: false }
  ];

  ngOnInit(): void {
    this.isEditing = !!this.membroParaEdicao;
    this.form = MembroEquipeForm.create(this.fb, this.membroParaEdicao);

    const initialRole = this.membroParaEdicao?.role || 'ArquitetoColaborador';
    this.aplicarPerfilPredefinido(initialRole);

    this.form.get('role')?.valueChanges.subscribe(novoRole => {
      if (novoRole && novoRole !== 'Personalizado') {
        this.aplicarPerfilPredefinido(novoRole);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  aplicarPerfilPredefinido(role: string): void {
    const p = this.permissoesModulos;
    switch (role) {
      case 'ArquitetoAdmin':
      case 'Administrador':
        p.forEach(m => m.selecionado = true);
        break;
      case 'ArquitetoColaborador':
        p.forEach(m => {
          m.selecionado = (m.id === 'projetos' || m.id === 'agenda' || m.id === 'clientes' || m.id === 'fornecedores');
        });
        break;
      case 'Gerente':
        p.forEach(m => {
          m.selecionado = (m.id === 'projetos' || m.id === 'agenda' || m.id === 'clientes' || m.id === 'fornecedores' || m.id === 'equipe');
        });
        break;
      case 'Financeiro':
        p.forEach(m => {
          m.selecionado = (m.id === 'financeiro' || m.id === 'agenda' || m.id === 'clientes');
        });
        break;
      case 'Estagiario':
        p.forEach(m => {
          m.selecionado = (m.id === 'projetos' || m.id === 'agenda');
        });
        break;
      case 'Colaborador':
        p.forEach(m => {
          m.selecionado = (m.id === 'projetos' || m.id === 'fornecedores');
        });
        break;
    }
  }

  alternarPermissao(modulo: PermissaoModulo): void {
    modulo.selecionado = !modulo.selecionado;
    // Quando usuário clica em permissão individual, o perfil se torna "Personalizado" se não bater com o preset
    const roleAtual = this.form.get('role')?.value;
    if (roleAtual !== 'Personalizado') {
      this.form.patchValue({ role: 'Personalizado' }, { emitEvent: false });
    }
  }

  marcarTodasPermissoes(marcar: boolean): void {
    this.permissoesModulos.forEach(m => m.selecionado = marcar);
    if (marcar) {
      this.form.patchValue({ role: 'ArquitetoAdmin' });
    } else {
      this.form.patchValue({ role: 'Personalizado' }, { emitEvent: false });
    }
  }

  obterRoleFinal(): string {
    const roleSelecionada = this.form.get('role')?.value;
    if (roleSelecionada && roleSelecionada !== 'Personalizado') {
      return roleSelecionada;
    }

    // Se personalizado, mapear para o papel do backend com as permissões equivalentes
    const temProjetos = this.permissoesModulos.find(m => m.id === 'projetos')?.selecionado;
    const temFinanceiro = this.permissoesModulos.find(m => m.id === 'financeiro')?.selecionado;
    const temEquipe = this.permissoesModulos.find(m => m.id === 'equipe')?.selecionado;

    if (temFinanceiro && temEquipe) return 'ArquitetoAdmin';
    if (temEquipe) return 'Gerente';
    if (temFinanceiro && !temProjetos) return 'Financeiro';
    if (temProjetos) return 'ArquitetoColaborador';
    return 'Colaborador';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.saving = true;
    const roleFinal = this.obterRoleFinal();

    if (this.isEditing && this.membroParaEdicao) {
      const command: AtualizarMembroEquipeCommand = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        role: roleFinal,
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
        role: roleFinal,
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
