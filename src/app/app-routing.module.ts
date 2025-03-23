import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './common/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { 
    path: 'city-weather', 
    loadChildren: () => import('./pages/city-weather/city-weather.module').then(m => m.CityWeatherModule) 
  },
  { 
    path: 'city/:cityName', 
    loadChildren: () => import('./pages/city-weather/city-weather.module').then(m => m.CityWeatherModule) 
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
