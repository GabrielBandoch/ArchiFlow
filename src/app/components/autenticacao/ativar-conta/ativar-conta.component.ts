import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacaoService } from '../../../core/api/auth/autenticacao.service';
import { CotuLogoComponent } from '../../../shared/components/cotu-logo/cotu-logo.component';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-ativar-conta',
  standalone: true,
  imports: [CotuLogoComponent, CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './ativar-conta.component.html',
  styleUrl: './ativar-conta.component.scss'
})
export class AtivarContaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AutenticacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  validandoConvite = true;
  conviteValido = false;
  mensagemConviteInvalido = '';

  ativarForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    email: [{ value: '', disabled: true }],
    telefone: [''],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  }, { validators: this.senhasIguaisValidator });

  loading = false;
  submitted = false;
  sucesso = false;
  errorMessage = '';

  senhasIguaisValidator(group: FormGroup) {
    const s = group.get('senha')?.value;
    const c = group.get('confirmarSenha')?.value;
    return s === c ? null : { senhasDiferentes: true };
  }

  get f() {
    return this.ativarForm.controls;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.validandoConvite = false;
      this.conviteValido = false;
      this.mensagemConviteInvalido = 'Token de convite não fornecido ou link incompleto.';
      return;
    }

    this.authApi.validarTokenConvite(this.token).subscribe({
      next: (res) => {
        this.validandoConvite = false;
        this.conviteValido = res.valido;
        if (res.valido) {
          this.ativarForm.patchValue({
            nome: res.nome || '',
            email: res.email || ''
          });
        } else {
          this.mensagemConviteInvalido = res.mensagem || 'Convite expirado ou já utilizado.';
        }
      },
      error: () => {
        this.validandoConvite = false;
        this.conviteValido = false;
        this.mensagemConviteInvalido = 'Não foi possível validar seu convite. Entre em contato com seu arquiteto.';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.ativarForm.invalid) {
      return;
    }

    this.loading = true;
    const command = {
      token: this.token,
      senha: this.f['senha'].value,
      nome: this.f['nome'].value,
      telefone: this.f['telefone'].value || undefined
    };

    this.authApi.ativarConta(command).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = true;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erro ao ativar conta. Tente novamente.';
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
