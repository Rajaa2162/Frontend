import { Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { DashboardComponent } from './screens/dashboard/dashboard';
import { ProfileComponent } from './screens/profile/profile.component';
import { HistoryComponent } from './screens/history/history.component';
import { ReferralsComponent } from './screens/referrals/referrals.component';
import { AuthComponent } from './screens/auth/auth.component';
import { FeaturesComponent } from './screens/features/features';
import { HowItWorksComponent } from './screens/how-it-works/how-it-works';
import { TestimonialsComponent } from './screens/testimonials/testimonials';
import { FaqComponent } from './screens/faq/faq';
import { ContactComponent } from './screens/contact/contact';
import { NotFound } from './screens/not-found/not-found';
import { WalletComponent } from './screens/transactions-pro/transactions-pro.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'referrals', component: ReferralsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'wallet', component: WalletComponent },
  { path: '**', component: NotFound }
];
