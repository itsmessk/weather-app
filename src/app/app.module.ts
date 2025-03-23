import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './common/menu-bar/menu-bar.component';
import { LoginComponent } from './common/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CityWeatherComponent } from './pages/city-weather/city-weather.component';
import { CitySearchComponent } from './components/city-search/city-search.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    SettingsComponent,
    CityWeatherComponent,
    CitySearchComponent,
    WeatherCardComponent,
    MapViewComponent,
    TemperaturePipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
