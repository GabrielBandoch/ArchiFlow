import { Routes } from '@angular/router';

// Rotas serão adicionadas progressivamente a cada PR de módulo
export const appRoutes: Routes = [
  {
    path: '**',
    redirectTo: ''
  }
];
