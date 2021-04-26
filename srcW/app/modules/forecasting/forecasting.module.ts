import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';

import { ForecastingRoutingModule } from './forecasting-routing.module';
import { CreateComputeSalesForecastComponent } from './create-compute-sales-forecast/create-compute-sales-forecast.component';
import { ForecastingComponent } from './forecasting/forecasting.component';
import { AddnewForecastComponent } from './addnew-forecast/addnew-forecast.component';
import { FlexComponent } from './flex/flex.component';
import { AdjustFinalForecastComponent } from './adjust-final-forecast/adjust-final-forecast.component';
import { ForecastMappingComponent } from './forecast-mapping/forecast-mapping.component';
import { AddNewRowComponent } from './add-new-row/add-new-row.component';
import { DupicateForecastComponent } from './dupicate-forecast/dupicate-forecast.component';
import { ManageMarketForecastImportComponent } from './manage-market-forecast-import/manage-market-forecast-import.component';
import { ManageLocationMaterialMappingComponent } from './manage-location-material-mapping/manage-location-material-mapping.component';
import { ViewForecastAsComponent } from './view-forecast-as/view-forecast-as.component';
import { MacroIndicatorListComponent } from './macro-indicator/macro-indicator-list/macro-indicator-list.component';
import { MacroIndicatorComponent } from './macro-indicator/macro-indicator.component';
import { AddMarcoIndicatorComponent } from './macro-indicator/add-marco-indicator/add-marco-indicator.component';
import { EditMarcoIndicatorComponent } from './macro-indicator/edit-marco-indicator/edit-marco-indicator.component';
import { MicroIndicatorComponent } from './micro-indicator/micro-indicator.component';
import { MicroIndicatorListComponent } from './micro-indicator/micro-indicator-list/micro-indicator-list.component';
import { AddMicroIndicatorComponent } from './micro-indicator/add-micro-indicator/add-micro-indicator.component';
import { EditMicroIndicatorComponent } from './micro-indicator/edit-micro-indicator/edit-micro-indicator.component';
import { AddeditMicroIndicatorDetailComponent } from './micro-indicator/addedit-micro-indicator-detail/addedit-micro-indicator-detail.component';




@NgModule({
  declarations: [
    CreateComputeSalesForecastComponent,
    ForecastingComponent,
    AddnewForecastComponent,
    FlexComponent,
    AdjustFinalForecastComponent,
    ForecastMappingComponent,
    AddNewRowComponent,
    DupicateForecastComponent,
    ManageMarketForecastImportComponent,
    ManageLocationMaterialMappingComponent,
    ViewForecastAsComponent,
    MacroIndicatorListComponent,
    MacroIndicatorComponent,
    AddMarcoIndicatorComponent,
    EditMarcoIndicatorComponent,
    MicroIndicatorComponent,
    MicroIndicatorListComponent,
    AddMicroIndicatorComponent,
    EditMicroIndicatorComponent,
    AddeditMicroIndicatorDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ForecastingRoutingModule,
    MaterialModule,
    NgSelect2Module,
    AngularMultiSelectModule,
    ResizableModule
  ]
})
export class ForecastingModule { }
