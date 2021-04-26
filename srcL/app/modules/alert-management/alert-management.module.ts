import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';

import { MaterialModule } from 'app/material/material.module';

import { AlertListComponent } from './pages/alert-list/alert-list.component';
import { AddNewComponent } from '../alert-management/pages/add-new-alert/add-new.component';
import { EditAlertComponent } from './pages/edit-alert/edit-alert.component';

import { AlertManagementRoutingModule } from './alert-management-routing.module';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MatSelectModule } from '@angular/material/select';
import { AlertHistoryComponent } from './alert-history/alert-history.component';
import { AlertHistortListComponent } from './alert-history/alert-histort-list/alert-histort-list.component';
import { ShowAlertComponent } from './alert-history/show-alert/show-alert.component';
import { AlertComponent } from './pages/alert.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
//import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [AlertComponent,AlertListComponent, AddNewComponent, EditAlertComponent, AlertHistoryComponent, AlertHistortListComponent, ShowAlertComponent,],
  imports: [
    AlertManagementRoutingModule,
    CommonModule,
    MaterialModule, AngularMultiSelectModule,/* ResizableModule,*/
    SharedModule, HttpClientModule, AngularEditorModule, MatSelectModule, DateRangePickerModule, DateTimePickerModule, DatePickerModule
  ]
})
export class AlertManagementModule { }
