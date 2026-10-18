import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacaoService } from '../../../core/api/auth/autenticacao.service';
import { CotuLogoComponent } from '../../../shared/components/cotu-logo/cotu-logo.component';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CotuLogoComponent, CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.scss'
})
export class RedefinirSenhaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AutenticacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  validandoToken = true;
  tokenValido = false;
  emailUsuario = '';
  mensagemTokenInvalido = '';

  redefinirForm: FormGroup = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  }, { validators: this.senhasIguaisValidator });

  loading = false;
  submitted = false;
  sucesso = false;
  errorMessage = '';

  senhasIguaisValidator(group: FormGroup) {
    const nova = group.get('novaSenha')?.value;
    const confirm = group.get('confirmarSenha')?.value;
    return nova === confirm ? null : { senhasDiferentes: true };
  }

  get f() {
    return this.redefinirForm.controls;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.validandoToken = false;
      this.tokenValido = false;
      this.mensagemTokenInvalido = 'Token de recuperação não fornecido ou link inválido.';
      return;
    }

    this.authApi.validarTokenRecuperacao({ token: this.token }).subscribe({
      next: (res) => {
        this.validandoToken = false;
        this.tokenValido = res.valido;
        this.emailUsuario = res.email || '';
        if (!res.valido) {
          this.mensagemTokenInvalido = res.mensagem || 'Link de recuperação expirado ou inválido.';
        }
      },
      error: () => {
        this.validandoToken = false;
        this.tokenValido = false;
        this.mensagemTokenInvalido = 'Não foi possível validar seu link de recuperação. Tente novamente.';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.redefinirForm.invalid) {
      return;
    }

    this.loading = true;
    const novaSenha = this.f['novaSenha'].value;

    this.authApi.redefinirSenha({ token: this.token, novaSenha }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = true;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erro ao redefinir senha. O link pode ter expirado.';
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
