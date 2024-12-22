import { Routes } from '@angular/router';
import { WheelComponent } from '../components/wheel/wheel.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { WheelSpinPageComponent } from './wheel-spin-page/wheel-spin-page.component';
import { CompletePageComponent } from './complete-page/complete-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'spin', component: WheelSpinPageComponent },
  { path: 'complete', component: CompletePageComponent },
];
