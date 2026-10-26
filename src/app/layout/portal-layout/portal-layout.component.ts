import { CotuLogoComponent } from "../../shared/components/cotu-logo/cotu-logo.component";
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { EmpresaService } from "../../core/api/empresa/empresa.service";
import { DESIGN_SYSTEM } from "../../shared";

@Component({
  selector: "app-portal-layout",
  standalone: true,
  imports: [CotuLogoComponent, CommonModule, RouterOutlet, DESIGN_SYSTEM],
  templateUrl: "./portal-layout.component.html",
  styleUrl: "./portal-layout.component.scss",
})
export class PortalLayoutComponent implements OnInit {
  authService = inject(AuthService);
  empresaService = inject(EmpresaService, { optional: true });
  router = inject(Router);

  nomeEscritorio = "Escritório de Arquitetura";

  ngOnInit(): void {
    this.empresaService?.obterDadosEmpresa().subscribe({
      next: (dados) => {
        if (dados?.nomeEmpresa) {
          this.nomeEscritorio = dados.nomeEmpresa;
        }
      },
      error: () => {},
    });
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  get userInitials(): string {
    const nome = this.currentUser?.nome || "C";
    const parts = nome.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
