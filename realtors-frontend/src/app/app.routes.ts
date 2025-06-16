import { Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home';
import { DashboardComponent } from './screens/dashboard/dashboard';
import { ProfileComponent } from './screens/profile/profile';
import { HistoryComponent } from './screens/history/history.component';
import { ReferralsComponent } from './screens/referrals/referrals.component';
import { AuthComponent } from './screens/auth/auth.component';
import { NotFound } from './screens/not-found/not-found';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'referrals', component: ReferralsComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: NotFound }
];
