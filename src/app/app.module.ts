import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './common/menu-bar/menu-bar.component';
import { LoginComponent } from './common/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ThemeToggleComponent } from './common/theme-toggle/theme-toggle.component';
import { FooterComponent } from './common/footer/footer.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CityWeatherComponent } from './pages/city-weather/city-weather.component';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';
import { WeatherNewsComponent } from './components/weather-news/weather-news.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { WeatherIconPipe } from './pipes/weather-icon.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    ThemeToggleComponent,
    FooterComponent,
    ContactComponent,
    CityWeatherComponent,
    WeatherDashboardComponent,
    WeatherNewsComponent,
    SettingsComponent,
    TemperaturePipe,
    WeatherIconPipe,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
