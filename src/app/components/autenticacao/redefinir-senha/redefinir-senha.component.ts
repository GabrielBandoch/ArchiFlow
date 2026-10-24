import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { AutenticacaoService } from "../../../core/api/auth/autenticacao.service";
import { CotuLogoComponent } from "../../../shared/components/cotu-logo/cotu-logo.component";
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from "../../../shared";
import { RedefinirSenhaForm } from "./redefinir-senha.form";

@Component({
  selector: "app-redefinir-senha",
  standalone: true,
  imports: [CotuLogoComponent, CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM],
  templateUrl: "./redefinir-senha.component.html",
  styleUrl: "./redefinir-senha.component.scss",
})
export class RedefinirSenhaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AutenticacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = "";
  validandoToken = true;
  tokenValido = false;
  emailUsuario = "";
  mensagemTokenInvalido = "";

  redefinirForm: FormGroup = RedefinirSenhaForm.create(this.fb);

  loading = false;
  submitted = false;
  sucesso = false;
  errorMessage = "";

  get f() {
    return this.redefinirForm.controls;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams["token"] || "";
    if (!this.token) {
      this.validandoToken = false;
      this.tokenValido = false;
      this.mensagemTokenInvalido =
        "Token de recuperação não fornecido ou link inválido.";
      return;
    }

    this.authApi.validarTokenRecuperacao({ token: this.token }).subscribe({
      next: (res) => {
        this.validandoToken = false;
        this.tokenValido = res.valido;
        this.emailUsuario = res.email || "";
        if (!res.valido) {
          this.mensagemTokenInvalido =
            res.mensagem || "Link de recuperação expirado ou inválido.";
        }
      },
      error: () => {
        this.validandoToken = false;
        this.tokenValido = false;
        this.mensagemTokenInvalido =
          "Não foi possível validar seu link de recuperação. Tente novamente.";
      },
    });
  }

  onSubmit(): void {
    if (this.loading || !this.tokenValido) {
      return;
    }
    this.submitted = true;
    this.errorMessage = "";

    if (this.redefinirForm.invalid) {
      return;
    }

    this.loading = true;
    const novaSenha = this.f["novaSenha"].value;

    this.authApi.redefinirSenha({ token: this.token, novaSenha }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = true;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          err.error?.mensagem ||
          err.error?.message ||
          "Erro ao redefinir senha. O link pode ter expirado.";
      },
    });
  }

  irParaLogin(): void {
    this.router.navigate(["/login"]);
  }

  solicitarNovoLink(): void {
    this.router.navigate(["/recuperar-senha"]);
  }
}
