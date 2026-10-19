import { Routes } from '@angular/router';
import { staffGuard, portalGuard } from './core/guards/role.guard';
import { moduleGuard } from './core/guards/module.guard';

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
    path: 'recuperar-senha',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/autenticacao/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
      }
    ]
  },
  {
    path: 'redefinir-senha',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/autenticacao/redefinir-senha/redefinir-senha.component').then(m => m.RedefinirSenhaComponent)
      }
    ]
  },
  {
    path: 'ativar-conta',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/autenticacao/ativar-conta/ativar-conta.component').then(m => m.AtivarContaComponent)
      }
    ]
  },
  {
    path: 'portal',
    canActivate: [portalGuard],
    loadComponent: () => import('./layout/portal-layout/portal-layout.component').then(m => m.PortalLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/portal/portal-cliente/portal-cliente.component').then(m => m.PortalClienteComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/portal/portal-cliente/portal-cliente.component').then(m => m.PortalClienteComponent)
      }
    ]
  },
  {
    path: 'perfil',
    canActivate: [staffGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/perfil/meu-perfil/meu-perfil.component').then(m => m.MeuPerfilComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [staffGuard, moduleGuard('dashboard')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  {
    path: 'projetos',
    canActivate: [staffGuard, moduleGuard('projetos')],
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
    path: 'agenda',
    canActivate: [staffGuard, moduleGuard('agenda')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/agenda/agenda.component').then(m => m.AgendaComponent)
      }
    ]
  },
  {
    path: 'leads',
    canActivate: [staffGuard, moduleGuard('leads')],
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
    canActivate: [staffGuard, moduleGuard('clientes')],
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
    path: 'fornecedores',
    canActivate: [staffGuard, moduleGuard('fornecedores')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/fornecedores/fornecedores.component').then(m => m.FornecedoresComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/fornecedores/detalhes-fornecedor/detalhes-fornecedor.component').then(m => m.DetalhesFornecedorComponent)
      }
    ]
  },
  {
    path: 'configuracoes',
    canActivate: [staffGuard, moduleGuard('configuracoes')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'empresa',
        pathMatch: 'full'
      },
      {
        path: 'empresa',
        loadComponent: () => import('./components/configuracoes/dados-empresa/dados-empresa.component').then(m => m.DadosEmpresaComponent)
      },
      {
        path: 'templates-projeto',
        loadComponent: () => import('./components/configuracoes/templates-projeto/templates-projeto.component').then(m => m.TemplatesProjetoComponent)
      },
      {
        path: 'modelo-proposta',
        loadComponent: () => import('./components/configuracoes/modelo-proposta/modelo-proposta.component').then(m => m.ModeloPropostaComponent)
      },
      {
        path: 'origens-lead',
        loadComponent: () => import('./components/leads/origens-lead/origens-lead.component').then(m => m.OrigensLeadComponent)
      },
      {
        path: 'equipe',
        loadComponent: () => import('./components/configuracoes/gestao-equipe/gestao-equipe.component').then(m => m.GestaoEquipeComponent)
      }
    ]
  },
  {
    path: 'financeiro',
    canActivate: [staffGuard, moduleGuard('financeiro')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/financeiro/financeiro.component').then(m => m.FinanceiroComponent)
      }
    ]
  },
  {
    path: 'simulador',
    canActivate: [staffGuard, moduleGuard('simulador')],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/honorarios/simulador/simulador.component').then(m => m.SimuladorComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
