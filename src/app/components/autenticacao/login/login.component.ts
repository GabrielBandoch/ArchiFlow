import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCommand } from '../../../commands/autenticacao.commands';
import { LoginForm } from './login.form';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  sessionExpired = false;
  returnUrl = '/';

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
}
