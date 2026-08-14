import { Component, inject, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  loadingService = inject(LoadingService);

  private viewContainerRef = inject(ViewContainerRef);
  private dialogService = inject(DialogService);

  constructor() {
    this.dialogService.registerContainerRef(this.viewContainerRef);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
