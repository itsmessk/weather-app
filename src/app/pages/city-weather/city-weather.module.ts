import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CityWeatherComponent } from './city-weather.component';

const routes: Routes = [
  { path: '', component: CityWeatherComponent },
  { path: ':cityName', component: CityWeatherComponent }
];

@NgModule({
  declarations: [
    CityWeatherComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CityWeatherComponent
  ]
})
export class CityWeatherModule { }
