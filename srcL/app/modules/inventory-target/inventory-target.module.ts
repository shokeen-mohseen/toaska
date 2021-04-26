import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { ResizableModule } from 'angular-resizable-element';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { InventorytargetRoutingModule } from './inventory-target-routing.module';
import { DCInventoryLevelsComponent } from './pages/dcinventory-levels/dcinventory-levels.component';
import { PlantInventoryLevelsComponent } from './pages/plant-inventory-levels/plant-inventory-levels.component';
import { PlantInventoryLavelListComponent } from './pages/plant-inventory-levels/plant-inventory-lavel-list/plant-inventory-lavel-list.component';
import { DcinventoryLavelListComponent } from './pages/dcinventory-levels/dcinventory-lavel-list/dcinventory-lavel-list.component';


@NgModule({
  declarations: [DCInventoryLevelsComponent, PlantInventoryLevelsComponent, PlantInventoryLavelListComponent, DcinventoryLavelListComponent],
  imports: [
    CommonModule,
    InventorytargetRoutingModule, ResizableModule,
    SharedModule, UiSwitchModule, MaterialModule,
    NgSelect2Module, AngularMultiSelectModule, DateRangePickerModule, DateTimePickerModule, DatePickerModule
  ]
})
export class InventoryTargetModule { }

