import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login-component/login-component';
import { adminGuard } from './core/guards/admin.guard';
import { marieGuard } from './core/guards/marie.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout-component/admin-layout-component';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { MarieLayoutComponent } from './layout/marie-layout/marie-layout-component/marie-layout-component';
import { DashboardComponent } from './pages/marie/dashboard-component/dashboard-component';
import { Accueil } from './pages/invite/accueil/accueil';
import { UtilisateursComponent } from './pages/admin/utilisateurs/utilisateurs';
import { MariagesComponent } from './pages/admin/mariages/mariages';

import { InvitationPubliqueComponent } from './pages/invite/invitation-publique/invitation-publique';
import { Invites } from './pages/marie/invites/invites';

export const routes: Routes = [

  // ==============================
  // AUTHENTIFICATION
  // ==============================

  {
    path: 'login', component: LoginComponent

  },


  // ==============================
  // ESPACE ADMIN
  // ==============================

  {
    path: 'admin', component: AdminLayoutComponent,
    canActivate: [adminGuard],

    children: [

      {
        path: 'dashboard', component: Dashboard
      },
      {
        path: 'utilisateurs', component: UtilisateursComponent
      },
      {
        path: 'mariages', component: MariagesComponent
      }
    ]
  },


  // =========================
  // ESPACE MARIE
  // =========================
  {
    path: 'marie', component: MarieLayoutComponent,
    canActivate: [marieGuard],

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'mariage',
        component: DashboardComponent
      },
      {
        path:'invites', component: Invites

      },
      {
        path: '',
        redirectTo: 'mariage',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: 'invitation/:code', component: Accueil,
  },

  // ==============================
  // INVITATION PUBLIQUE
  // ==============================
  // {
  //   path: 'invitation/:code', component: InvitationPubliqueComponent
  // },


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