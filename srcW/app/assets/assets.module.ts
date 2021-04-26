import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablewithsortingComponent } from './tablewithsorting/tablewithsorting.component';
import { SharedModule } from '@app/shared';
import { MaterialModule } from 'app/material/material.module';

import { ResizableModule } from 'angular-resizable-element';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { AccordionComponent } from './accordion/accordion.component';
import { MatTabWithNextPrevComponent } from './mat-tab-with-next-prev/mat-tab-with-next-prev.component';
import { Tab1Component } from './mat-tab-with-next-prev/tab1/tab1.component';
import { Tab2Component } from './mat-tab-with-next-prev/tab2/tab2.component';
import { Tab3Component } from './mat-tab-with-next-prev/tab3/tab3.component';
import { DragableTableComponent } from './dragable-table/dragable-table.component';
import { TableWithSearchSortPaginationComponent } from './table-with-search-sort-pagination/table-with-search-sort-pagination.component';
import { MatTabGlobalComponent } from './mat-tab-global/mat-tab-global.component';

import { AssetsRoutingModule } from './assets-routing.module';
import { BodyWithoutHeaderComponent } from './body-without-header/body-without-header.component';
import { AngularPdfComponent } from './angular-pdf/angular-pdf.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';



@NgModule({
  declarations: [TablewithsortingComponent, AccordionComponent, MatTabWithNextPrevComponent, Tab1Component, Tab2Component, Tab3Component, DragableTableComponent, TableWithSearchSortPaginationComponent, MatTabGlobalComponent, BodyWithoutHeaderComponent, AngularPdfComponent, DatepickerComponent, MultiselectDropdownComponent],
  imports: [
    CommonModule, SharedModule,
    MaterialModule,
    ResizableModule,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    AssetsRoutingModule,
  ],
  exports: [
    MatTabWithNextPrevComponent,
    Tab1Component,
    Tab2Component,
    Tab3Component,
    DragableTableComponent,
    TableWithSearchSortPaginationComponent
  ]
})
export class AssetsModule { }
