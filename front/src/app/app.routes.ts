import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/developers/developers.component').then(m => m.DevelopersComponent),
  },
  {
    path: 'developers/:id',
    loadComponent: () =>
      import('./pages/developer-detail/developer-detail.component').then(m => m.DeveloperDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
