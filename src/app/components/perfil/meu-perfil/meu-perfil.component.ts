import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilUsuarioDto } from '../../../commands/usuario.commands';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { MeuPerfilForm } from './meu-perfil.form';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './meu-perfil.component.html',
  styleUrl: './meu-perfil.component.scss'
})
export class MeuPerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  perfil: PerfilUsuarioDto | null = null;
  carregando = true;
  salvandoPerfil = false;
  salvandoSenha = false;
  enviandoFoto = false;

  perfilForm: FormGroup = MeuPerfilForm.createPerfilForm(this.fb);
  senhaForm: FormGroup = MeuPerfilForm.createSenhaForm(this.fb);

  perfilSucesso = '';
  perfilErro = '';
  senhaSucesso = '';
  senhaErro = '';

  get pf() {
    return this.perfilForm.controls;
  }

  get sf() {
    return this.senhaForm.controls;
  }

  get userInitials(): string {
    if (!this.perfil?.nome) return 'U';
    const parts = this.perfil.nome.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.carregando = true;
    this.usuarioService.obterMeuPerfil().subscribe({
      next: (dados) => {
        this.perfil = dados;
        this.perfilForm.patchValue({
          nome: dados.nome,
          email: dados.email,
          cargo: dados.cargo || '',
          telefone: dados.telefone || ''
        });
        this.carregando = false;
      },
      error: () => {
        this.perfilErro = 'Erro ao carregar dados do perfil.';
        this.carregando = false;
      }
    });
  }

  salvarDadosPerfil(): void {
    if (this.perfilForm.invalid) return;

    this.salvandoPerfil = true;
    this.perfilSucesso = '';
    this.perfilErro = '';

    const command = {
      nome: this.pf['nome'].value,
      cargo: this.pf['cargo'].value || null,
      telefone: this.pf['telefone'].value || null
    };

    this.usuarioService.atualizarMeuPerfil(command).subscribe({
      next: (atualizado) => {
        this.perfil = atualizado;
        this.authService.updateCurrentUser({
          nome: atualizado.nome
        });
        this.salvandoPerfil = false;
        this.perfilSucesso = 'Perfil atualizado com sucesso!';
        setTimeout(() => this.perfilSucesso = '', 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.salvandoPerfil = false;
        this.perfilErro = err.error?.message || 'Erro ao atualizar perfil.';
      }
    });
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.perfilErro = 'A imagem deve ter no máximo 5MB.';
      return;
    }

    this.enviandoFoto = true;
    this.perfilErro = '';

    this.usuarioService.uploadFotoPerfil(file).subscribe({
      next: (res) => {
        if (this.perfil) {
          this.perfil.fotoUrl = res.fotoUrl;
        }
        this.authService.updateCurrentUser({ fotoUrl: res.fotoUrl });
        this.enviandoFoto = false;
        this.perfilSucesso = 'Foto de perfil atualizada!';
        setTimeout(() => this.perfilSucesso = '', 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.enviandoFoto = false;
        this.perfilErro = err.error?.message || 'Erro ao enviar foto de perfil.';
      }
    });
  }

  removerFoto(): void {
    this.enviandoFoto = true;
    this.usuarioService.removerFotoPerfil().subscribe({
      next: () => {
        if (this.perfil) {
          this.perfil.fotoUrl = null;
        }
        this.authService.updateCurrentUser({ fotoUrl: null });
        this.enviandoFoto = false;
        this.perfilSucesso = 'Foto de perfil removida!';
        setTimeout(() => this.perfilSucesso = '', 4000);
      },
      error: () => {
        this.enviandoFoto = false;
        this.perfilErro = 'Erro ao remover foto de perfil.';
      }
    });
  }

  salvarNovaSenha(): void {
    if (this.senhaForm.invalid) return;

    this.salvandoSenha = true;
    this.senhaSucesso = '';
    this.senhaErro = '';

    const command = {
      senhaAtual: this.sf['senhaAtual'].value,
      novaSenha: this.sf['novaSenha'].value,
      confirmacaoNovaSenha: this.sf['confirmacaoNovaSenha'].value
    };

    this.usuarioService.alterarSenha(command).subscribe({
      next: (res) => {
        this.salvandoSenha = false;
        this.senhaSucesso = res.message || 'Senha alterada com sucesso!';
        this.senhaForm.reset();
        setTimeout(() => this.senhaSucesso = '', 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.salvandoSenha = false;
        this.senhaErro = err.error?.message || 'Erro ao alterar senha. Verifique sua senha atual.';
      }
    });
  }
}
