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
     path: 'invitation/', component: Accueil,
  },

    // {
    //   path: 'marie',
    //   canActivate: [marieGuard],
    //   ...
    // },

    //   {
    //     path: 'admin',
    //     loadComponent: () =>
    //       import('./layout/admin-layout/admin-layout.component')
    //         .then(m => m.AdminLayoutComponent),

    //     children: [

    //       {
    //         path: 'dashboard',
    //         loadComponent: () =>
    //           import('./pages/admin/dashboard/dashboard.component')
    //             .then(m => m.DashboardComponent)
    //       },

    //       {
    //         path: 'utilisateurs',
    //         loadComponent: () =>
    //           import('./pages/admin/utilisateurs/utilisateurs.component')
    //             .then(m => m.UtilisateursComponent)
    //       },

    //       {
    //         path: 'mariages',
    //         loadComponent: () =>
    //           import('./pages/admin/mariages/mariages.component')
    //             .then(m => m.MariagesComponent)
    //       },

    //       {
    //         path: 'statistiques',
    //         loadComponent: () =>
    //           import('./pages/admin/statistiques/statistiques.component')
    //             .then(m => m.StatistiquesComponent)
    //       },

    //       {
    //         path: '',
    //         redirectTo: 'dashboard',
    //         pathMatch: 'full'
    //       }
    //     ]
    //   },


    // ==============================
    // ESPACE MARIÉ
    // ==============================

    //   {
    //     path: 'marie',
    //     loadComponent: () =>
    //       import('./layout/marie-layout/marie-layout.component')
    //         .then(m => m.MarieLayoutComponent),

    //     children: [

    //       {
    //         path: 'dashboard',
    //         loadComponent: () =>
    //           import('./pages/marie/dashboard/dashboard.component')
    //             .then(m => m.DashboardComponent)
    //       },

    //       {
    //         path: 'mariage',
    //         loadComponent: () =>
    //           import('./pages/marie/mariage/mariage.component')
    //             .then(m => m.MariageComponent)
    //       },

    //       {
    //         path: 'invites',
    //         loadComponent: () =>
    //           import('./pages/marie/invites/invites.component')
    //             .then(m => m.InvitesComponent)
    //       },

    //       {
    //         path: 'boissons',
    //         loadComponent: () =>
    //           import('./pages/marie/boissons/boissons.component')
    //             .then(m => m.BoissonsComponent)
    //       },

    //       {
    //         path: 'tables',
    //         loadComponent: () =>
    //           import('./pages/marie/tables/tables.component')
    //             .then(m => m.TablesComponent)
    //       },

    //       {
    //         path: 'controle',
    //         loadComponent: () =>
    //           import('./pages/marie/controle/controle.component')
    //             .then(m => m.ControleComponent)
    //       },

    //       {
    //         path: 'statistiques',
    //         loadComponent: () =>
    //           import('./pages/marie/statistiques/statistiques.component')
    //             .then(m => m.StatistiquesComponent)
    //       },

    //       {
    //         path: '',
    //         redirectTo: 'dashboard',
    //         pathMatch: 'full'
    //       }
    //     ]
    //   },


    // ==============================
    // ESPACE INVITÉ
    // ==============================

    //   {
    //     path: 'invitation/:code',
    //     loadComponent: () =>
    //       import('./pages/invite/accueil/accueil.component')
    //         .then(m => m.AccueilComponent)
    //   },

    //   {
    //     path: 'invitation/:code/confirmation',
    //     loadComponent: () =>
    //       import('./pages/invite/confirmation/confirmation.component')
    //         .then(m => m.ConfirmationComponent)
    //   },


    // ==============================
    // ROUTE PAR DÉFAUT
    // ==============================

    {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },

    {
        path: '**',
        redirectTo: 'admin/dashboard'
    }


];
