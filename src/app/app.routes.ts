import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'showcase',
    loadComponent: () => import('./components/showcase/showcase.component').then(m => m.ShowcaseComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/autenticacao/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'projetos',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/projetos/lista-projetos/lista-projetos.component').then(m => m.ListaProjetosComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'projetos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'projetos'
  }
];
