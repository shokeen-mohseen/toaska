import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComputeSalesForecastComponent } from './create-compute-sales-forecast/create-compute-sales-forecast.component';
import { ForecastingComponent } from './forecasting/forecasting.component';
import { MacroIndicatorComponent } from './macro-indicator/macro-indicator.component';
import { MicroIndicatorComponent } from './micro-indicator/micro-indicator.component';


const routes: Routes = [
  {
    path: 'forecasting',
    component: ForecastingComponent
  },
  {
    path: 'create-compute-sales-forecast',
    component: CreateComputeSalesForecastComponent
  },
  {
    path: 'macro-indicator',
    component: MacroIndicatorComponent
  },
  {
    path: 'micro-indicator',
    component: MicroIndicatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForecastingRoutingModule { }
