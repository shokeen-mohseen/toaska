import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForecastCompareComponent } from './forecast-compare/forecast-compare.component';
import { ForecastReviewComponent } from './forecast-review/forecast-review.component';
import { DownloadReportsComponent } from './download-reports/download-reports.component';


const routes: Routes = [
  {
    path: 'forecast-compare',
    component: ForecastCompareComponent
  },
  {
    path: 'forecast-review',
    component: ForecastReviewComponent
  }  ,
  {
    path: 'download-reports',
    component: DownloadReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
