import { Routes } from '@angular/router';
import { AnalysisListComponent } from './modules/analysis/analysis-list/analysis-list.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PlayersListComponent } from './modules/players/players-list/players-list.component';
import { ReportsListComponent } from './modules/reports/reports-list/reports-list.component';
import { PlayerAnalysisComponent } from './modules/analysis/player-analysis/player-analysis.component';
import { PlayerFormComponent } from './modules/players/player-form/player-form.component';
import { AnalysisFormComponent } from './modules/analysis/analysis-form/analysis-form.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 🚀 Solo accesibles si NO estás autenticado
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthRedirectGuard] },

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard], // 🔒 Protegido: solo usuarios autenticados
    children: [
      { path: '', redirectTo: 'players', pathMatch: 'full' }, 
      { path: 'players', component: PlayersListComponent },
      { path: 'players/new', component: PlayerFormComponent },
      { path: 'players/edit/:id', component: PlayerFormComponent },
      
      { path: 'analysis', component: AnalysisListComponent },
      { path: 'analysis/new', component: AnalysisFormComponent },
      { path: 'analysis/edit/:id', component: AnalysisFormComponent },  

      { path: 'reports', component: ReportsListComponent }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
