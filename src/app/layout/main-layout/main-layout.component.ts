import { CotuLogoComponent } from '../../shared/components/cotu-logo/cotu-logo.component';
import { Component, inject, ViewContainerRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, query, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { LoadingService } from '../../core/services/loading.service';
import { EmpresaService } from '../../core/api/empresa/empresa.service';

import { DESIGN_SYSTEM } from '../../shared';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CotuLogoComponent, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DESIGN_SYSTEM],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  animations: [
    trigger('routeTransition', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('260ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  empresaService = inject(EmpresaService);

  private viewContainerRef = inject(ViewContainerRef);
  private dialogService = inject(DialogService);

  configuracoesAberto = false;
  sidebarAberta = false;

  constructor() {
    this.dialogService.registerContainerRef(this.viewContainerRef);
  }

  ngOnInit(): void {
    this.empresaService.obterDadosEmpresa().subscribe({
      next: () => {},
      error: () => {}
    });
    this.checkConfiguracoesActive();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkConfiguracoesActive();
      this.fecharSidebar();
    });
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.isActivated ? this.router.url : '';
  }

  private checkConfiguracoesActive(): void {
    if (this.router.url.includes('/configuracoes')) {
      this.configuracoesAberto = true;
    }
  }

  toggleConfiguracoes(): void {
    this.configuracoesAberto = !this.configuracoesAberto;
  }

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar(): void {
    this.sidebarAberta = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
