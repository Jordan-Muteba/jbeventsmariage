import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login-component/login-component';
import { adminGuard } from './core/guards/admin.guard';
import { marieGuard } from './core/guards/marie.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout-component/admin-layout-component';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { MarieLayoutComponent } from './layout/marie-layout/marie-layout-component/marie-layout-component';
import { DashboardComponent } from './pages/marie/dashboard-component/dashboard-component';
import { Accueil } from './pages/invite/accueil/accueil';

export const routes: Routes = [

    // ==============================
    // AUTHENTIFICATION
    // ==============================

    {
        path: 'login', component: LoginComponent

        // loadComponent: () => LoginComponent

        //   import('./pages/auth/login/login.component')
        // .then(m => m.LoginComponent)
    },


    // ==============================
    // ESPACE ADMIN
    // ==============================

    {
        path: 'admin', component: AdminLayoutComponent,
        //   canActivate: [adminGuard],

        children:[

            {
                path:'dashboard', component: Dashboard
            }
        ]
    },


  // =========================
  // ESPACE MARIE
  // =========================
  {
    path: 'marie', component:MarieLayoutComponent,

    // loadComponent: () =>
    //   import('./layout/marie-layout/marie-layout.component')
    //     .then(m => m.MarieLayoutComponent),

    children: [

      {
        path: 'dashboard', component: DashboardComponent

    //     loadComponent: () =>
    //       import('./pages/marie/dashboard/dashboard.component')
    //         .then(m => m.MarieDashboardComponent)
      }

    ]
  },

  {
     path: 'invitation/:codeInvitation', component: Accueil,
  },


    // ==============================
    // ROUTE PAR DÉFAUT
    // ==============================

{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: 'login'
}


];