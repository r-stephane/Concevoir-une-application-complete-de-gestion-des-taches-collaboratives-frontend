import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: 'login',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'register',
    loadComponent: () => import('./projects/register/register.page').then( m => m.SignupPage)
  },
 
];
