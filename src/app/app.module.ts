import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './common/menu-bar/menu-bar.component';
import { LoginComponent } from './common/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CitySearchComponent } from './components/city-search/city-search.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { HighlightDirective } from './directives/highlight.directive';
import { ThemeToggleComponent } from './common/theme-toggle/theme-toggle.component';
import { FooterComponent } from './common/footer/footer.component';
import { ContactComponent } from './pages/contact/contact.component';

// Additional components
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';
import { WeatherNewsComponent } from './components/weather-news/weather-news.component';
import { SettingsComponent } from './components/settings/settings.component';

// Pipes
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
    CitySearchComponent,
    MapViewComponent,
    HighlightDirective,
    ThemeToggleComponent,
    FooterComponent,
    ContactComponent,
    // Additional components
    WeatherDashboardComponent,
    WeatherNewsComponent,
    SettingsComponent,
    // Pipes
    TemperaturePipe,
    WeatherIconPipe,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
