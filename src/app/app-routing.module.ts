import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './common/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CityWeatherComponent } from './pages/city-weather/city-weather.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'city-weather', component: CityWeatherComponent },
  { path: 'city/:cityName', component: CityWeatherComponent },
  { path: 'city-weather/:cityName', component: CityWeatherComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
