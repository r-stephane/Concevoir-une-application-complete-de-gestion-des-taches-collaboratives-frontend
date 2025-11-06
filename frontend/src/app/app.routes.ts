import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'projects',
    redirectTo: 'projects/login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./projects/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./projects/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./projects/register/register.page').then((m) => m.SignupPage),
  },
];
