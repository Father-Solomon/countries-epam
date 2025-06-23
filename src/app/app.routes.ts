import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./countries/ui/countries').then(m => m.Countries),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
