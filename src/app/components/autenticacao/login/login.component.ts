import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AutenticacaoService } from '../../../core/api/auth/autenticacao.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginCommand } from '../../../commands/autenticacao.commands';
import { LoginForm } from './login.form';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private apiAuthService = inject(AutenticacaoService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  sessionExpired = false;
  returnUrl = '/';

  // Modal de Recuperação de Senha
  showEsqueciSenhaModal = false;
  etapaRecuperacao: 1 | 2 = 1;
  emailRecuperacao = '';
  codigoRecuperacao = '';
  novaSenha = '';
  confirmarNovaSenha = '';
  loadingRecuperacao = false;
  recuperacaoErro = '';
  recuperacaoSucesso = '';

  constructor() {
    this.loginForm = LoginForm.create(this.formBuilder);

    if (this.route.snapshot.queryParams['sessionExpired'] === 'true') {
      this.sessionExpired = true;
    }

    if (this.authService.isAuthenticated) {
      if (this.authService.isCliente) {
        this.router.navigate(['/portal']);
      } else {
        this.router.navigate(['/projetos']);
      }
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/projetos';
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams;
    if (q['recuperar'] === '1' || q['token']) {
      this.showEsqueciSenhaModal = true;
      this.emailRecuperacao = q['email'] || '';
      this.codigoRecuperacao = q['token'] || '';
      if (this.emailRecuperacao && this.codigoRecuperacao) {
        this.etapaRecuperacao = 2;
      }
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const command: LoginCommand = {
      email: this.f['email'].value,
      senha: this.f['senha'].value
    };

    this.authService.login(command).subscribe({
      next: (user) => {
        if (this.authService.isCliente) {
          const target = user.projetoId ? `/portal/${user.projetoId}` : '/portal';
          this.router.navigate([target]);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'E-mail ou senha incorretos.';
        this.loading = false;
      }
    });
  }

  abrirModalRecuperacao(): void {
    this.recuperacaoErro = '';
    this.recuperacaoSucesso = '';
    this.emailRecuperacao = this.f['email'].value || '';
    this.codigoRecuperacao = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
    this.etapaRecuperacao = 1;
    this.showEsqueciSenhaModal = true;
  }

  fecharModalRecuperacao(): void {
    this.showEsqueciSenhaModal = false;
    this.recuperacaoErro = '';
    this.recuperacaoSucesso = '';
  }

  avancarParaEtapa2(): void {
    this.recuperacaoErro = '';
    this.etapaRecuperacao = 2;
  }

  voltarParaEtapa1(): void {
    this.recuperacaoErro = '';
    this.etapaRecuperacao = 1;
  }

  solicitarCodigoRecuperacao(): void {
    this.recuperacaoErro = '';
    this.recuperacaoSucesso = '';

    const email = (this.emailRecuperacao || '').trim();
    if (!email || !email.includes('@')) {
      this.recuperacaoErro = 'Por favor, informe um e-mail válido.';
      return;
    }

    this.loadingRecuperacao = true;
    this.apiAuthService.esqueciSenha(email).subscribe({
      next: (res) => {
        this.loadingRecuperacao = false;
        this.recuperacaoSucesso = res.message || 'Código enviado com sucesso para seu e-mail!';
        this.notificationService.success('Instruções de recuperação enviadas para seu e-mail.');
        this.etapaRecuperacao = 2;
      },
      error: (err) => {
        this.loadingRecuperacao = false;
        this.recuperacaoErro = err.error?.message || 'Não foi possível enviar o código. Tente novamente.';
      }
    });
  }

  concluirRedefinicaoSenha(): void {
    this.recuperacaoErro = '';
    this.recuperacaoSucesso = '';

    const email = (this.emailRecuperacao || '').trim();
    const token = (this.codigoRecuperacao || '').trim();
    const nova = this.novaSenha;
    const confirma = this.confirmarNovaSenha;

    if (!email) {
      this.recuperacaoErro = 'Informe o e-mail.';
      return;
    }

    if (!token) {
      this.recuperacaoErro = 'Informe o código de segurança de 6 dígitos.';
      return;
    }

    if (!nova || nova.length < 6) {
      this.recuperacaoErro = 'A nova senha deve possuir no mínimo 6 caracteres.';
      return;
    }

    if (nova !== confirma) {
      this.recuperacaoErro = 'As senhas informadas não coincidem.';
      return;
    }

    this.loadingRecuperacao = true;
    this.apiAuthService.redefinirSenha({ email, token, novaSenha: nova }).subscribe({
      next: (res) => {
        this.loadingRecuperacao = false;
        this.notificationService.success(res.message || 'Senha redefinida com sucesso!');
        this.loginForm.patchValue({ email, senha: '' });
        this.showEsqueciSenhaModal = false;
      },
      error: (err) => {
        this.loadingRecuperacao = false;
        this.recuperacaoErro = err.error?.message || 'Código inválido ou expirado. Verifique e tente novamente.';
      }
    });
  }
}
