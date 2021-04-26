import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { MaterialModule } from 'app/material/material.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';
import { CalendarModule } from 'primeng/calendar';

import { ReportsRoutingModule } from './reports-routing.module';
import { ForecastCompareComponent } from './forecast-compare/forecast-compare.component';
import { ForecastReviewComponent } from './forecast-review/forecast-review.component';
import { DownloadReportsComponent } from './download-reports/download-reports.component';
import { SetupfilterDdownloadReportsComponent } from './setupfilter-ddownload-reports/setupfilter-ddownload-reports.component';


@NgModule({
  declarations: [ForecastCompareComponent, ForecastReviewComponent, DownloadReportsComponent, SetupfilterDdownloadReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    MaterialModule,
    AngularMultiSelectModule,
    ResizableModule,
    CalendarModule
  ]
})
export class ReportsModule { }
