import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CityWeatherComponent } from './city-weather.component';

const routes: Routes = [
  { path: '', component: CityWeatherComponent }
];

@NgModule({
  declarations: [
    CityWeatherComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CityWeatherModule { }
