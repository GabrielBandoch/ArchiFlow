import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PerfilUsuarioDetalhado } from '../../../models/usuario.model';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent implements OnInit {
  public formPerfil!: FormGroup;
  public formSenha!: FormGroup;
  public perfilUsuario?: PerfilUsuarioDetalhado;
  public carregando = false;
  public salvandoPerfil = false;
  public salvandoSenha = false;

  public mostrarSenhaAtual = false;
  public mostrarNovaSenha = false;
  public mostrarConfirmacao = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.iniciarForms();
    this.carregarPerfil();
  }

  private iniciarForms(): void {
    this.formPerfil = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      email: [{ value: '', disabled: true }],
      telefone: ['', [Validators.maxLength(30)]],
      cargo: ['', [Validators.maxLength(100)]],
      role: [{ value: '', disabled: true }]
    });

    this.formSenha = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmacaoSenha: ['', [Validators.required]]
    });
  }

  private carregarPerfil(): void {
    this.carregando = true;
    this.usuarioService.obterMeuPerfil().subscribe({
      next: (perfil) => {
        this.carregando = false;
        this.perfilUsuario = perfil;
        this.formPerfil.patchValue({
          nome: perfil.nome,
          email: perfil.email,
          telefone: perfil.telefone || '',
          cargo: perfil.cargo || '',
          role: perfil.role
        });
      },
      error: () => {
        this.carregando = false;
        // Fallback para os dados da sessão atual
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.formPerfil.patchValue({
            nome: currentUser.nome,
            email: currentUser.email,
            role: currentUser.perfil
          });
        }
      }
    });
  }

  public salvarPerfil(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      this.notificationService.warning('Preencha os campos obrigatórios do perfil.');
      return;
    }

    this.salvandoPerfil = true;
    const { nome, telefone, cargo } = this.formPerfil.value;

    this.usuarioService.atualizarMeuPerfil({ nome, telefone, cargo }).subscribe({
      next: (atualizado) => {
        this.salvandoPerfil = false;
        this.perfilUsuario = atualizado;
        // Atualiza a sessão no localStorage
        const user = this.authService.currentUserValue;
        if (user) {
          const atualizadoUser = { ...user, nome: atualizado.nome };
          localStorage.setItem('currentUser', JSON.stringify(atualizadoUser));
        }
        this.notificationService.success('Perfil atualizado com sucesso!');
      },
      error: () => {
        this.salvandoPerfil = false;
        this.notificationService.error('Erro ao atualizar informações do perfil.');
      }
    });
  }

  public alterarSenha(): void {
    if (this.formSenha.invalid) {
      this.formSenha.markAllAsTouched();
      this.notificationService.warning('Preencha os campos de senha corretamente.');
      return;
    }

    const { senhaAtual, novaSenha, confirmacaoSenha } = this.formSenha.value;

    if (novaSenha !== confirmacaoSenha) {
      this.notificationService.warning('A nova senha e a confirmação não conferem.');
      return;
    }

    this.salvandoSenha = true;
    this.usuarioService.alterarMinhaSenha({ senhaAtual, novaSenha }).subscribe({
      next: () => {
        this.salvandoSenha = false;
        this.formSenha.reset();
        this.notificationService.success('Senha alterada com sucesso! Utilize sua nova senha nos próximos acessos.');
      },
      error: (err) => {
        this.salvandoSenha = false;
        const msg = err?.error?.message || 'Erro ao alterar senha. Verifique se a senha atual está correta.';
        this.notificationService.error(msg);
      }
    });
  }
}
