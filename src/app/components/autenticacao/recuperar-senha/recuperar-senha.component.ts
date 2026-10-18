import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../core/api/auth/autenticacao.service';
import { CotuLogoComponent } from '../../../shared/components/cotu-logo/cotu-logo.component';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CotuLogoComponent, CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {
  private fb = inject(FormBuilder);
  private authApi = inject(AutenticacaoService);
  private router = inject(Router);

  recuperarForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading = false;
  submitted = false;
  sucesso = false;
  errorMessage = '';

  get f() {
    return this.recuperarForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.recuperarForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.f['email'].value;

    this.authApi.solicitarRecuperacao({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = true;
      },
      error: () => {
        this.loading = false;
        this.sucesso = true;
      }
    });
  }

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }
}
