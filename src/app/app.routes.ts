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
      },
      {
        path: ':id',
        loadComponent: () => import('./components/projetos/detalhes-projeto/detalhes-projeto.component').then(m => m.DetalhesProjetoComponent)
      }
    ]
  },
  {
    path: 'leads',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/leads/leads.component').then(m => m.LeadsComponent)
      },
      {
        path: 'origens',
        loadComponent: () => import('./components/leads/origens-lead/origens-lead.component').then(m => m.OrigensLeadComponent)
      }
    ]
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/clientes/lista-clientes/lista-clientes.component').then(m => m.ListaClientesComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/clientes/detalhes-cliente/detalhes-cliente.component').then(m => m.DetalhesClienteComponent)
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
