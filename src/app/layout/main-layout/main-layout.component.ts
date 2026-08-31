import { Component, inject, ViewContainerRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { LoadingService } from '../../core/services/loading.service';

import { DESIGN_SYSTEM } from '../../shared';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DESIGN_SYSTEM],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  loadingService = inject(LoadingService);

  private viewContainerRef = inject(ViewContainerRef);
  private dialogService = inject(DialogService);

  configuracoesAberto = false;

  constructor() {
    this.dialogService.registerContainerRef(this.viewContainerRef);
  }

  ngOnInit(): void {
    this.checkConfiguracoesActive();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkConfiguracoesActive();
    });
  }

  private checkConfiguracoesActive(): void {
    if (this.router.url.includes('/configuracoes')) {
      this.configuracoesAberto = true;
    }
  }

  toggleConfiguracoes(): void {
    this.configuracoesAberto = !this.configuracoesAberto;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
