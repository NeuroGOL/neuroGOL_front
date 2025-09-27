import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PlayerFormComponent } from './modules/players/player-form/player-form.component';
import { PlayersListComponent } from './modules/players/players-list/players-list.component';
import { ReportsListComponent } from './modules/reports/reports-list/reports-list.component';

// Guards
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { DeclarationFormComponent } from './modules/declaration/declaration-form/declaration-form.component';
import { DeclarationListComponent } from './modules/declaration/declaration-list/declaration-list.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ReportsByPlayerComponent } from './modules/reports/reports-by-player/reports-by-player.component';
import { EditarPerfilComponent } from './modules/perfil/editar-perfil/editar-perfil.component';
import { AnalysisNplModalComponent } from './modules/analysis/analysis-npl-modal/analysis-npl-modal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🚀 Solo accesibles si NO estás autenticado
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthRedirectGuard] },

  {
    path: 'dashboard',
    component: SidebarComponent,
    canActivate: [AuthGuard], // 🔒 Protegido: solo usuarios autenticados
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'players', component: PlayersListComponent },
      { path: 'players/new', component: PlayerFormComponent },
      { path: 'players/edit/:id', component: PlayerFormComponent },

      { path: 'declarations', component: DeclarationListComponent },
      { path: 'declaration/new', component: DeclarationFormComponent },
      { path: 'declaration/edit/:id', component: DeclarationFormComponent },

      { path: 'analisis/:id', component: AnalysisNplModalComponent },

      { path: 'reports', component: ReportsListComponent },
      { path: 'reports/:id', component: ReportsByPlayerComponent },

      { path: 'profile', component: EditarPerfilComponent }
    ]
  },

  // { path: '**', redirectTo: 'dashboard' }
];
