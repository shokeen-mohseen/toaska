import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { ResizableModule } from 'angular-resizable-element';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { CalendarModule } from 'primeng/calendar';

import { EquipmentTypeComponent } from './equipment-type/equipment-type.component';
import { EquipmentListComponent } from './equipment-type/equipment-list/equipment-list.component';

import { ChargeComponent } from './charge/charge.component';
import { EditChargeComponent } from './charge/edit-charge/edit-charge.component';
import { ChargeTypeComponent } from './charge/charge-type/charge-type.component';
import { ChargeCategoryComponent } from './charge/charge-category/charge-category.component';
import { MapComputationMethodComponent } from './charge/map-computation-method/map-computation-method.component';
import { AddEditEquipmentComponent } from './equipment-type/add-edit-equipment/add-edit-equipment.component';
import { DefineEquipmentMaterialComponent } from './equipment-type/define-equipment-material/define-equipment-material.component';
import { EditDefineEquipmentMaterialComponent } from './equipment-type/edit-define-equipment-material/edit-define-equipment-material.component';
import { FuelSurchargeComponent } from './fuel-surcharge/fuel-surcharge.component';
import { AddFuelsurchargeComponent } from './fuel-surcharge/add-fuelsurcharge/add-fuelsurcharge.component';
import { EditFuelsurchargeComponent } from './fuel-surcharge/edit-fuelsurcharge/edit-fuelsurcharge.component';
import { ImportExcelComponent } from './equipment-type/import-excel/import-excel.component';
import { FreightModeComponent } from './freight-mode/freight-mode.component';
import { FreightListComponent } from './freight-mode/freight-list/freight-list.component';
import { AddFreightComponent } from './freight-mode/add-freight/add-freight.component'; 
import { EditFreightComponent } from './freight-mode/edit-freight/edit-freight.component';
import { ApplicationChargesComponent } from './application-charges/application-charges.component';
import { GeoLocationComponent } from './geo-location/geo-location.component';
import { MapEquipmentTypeComponent } from './freight-mode/map-equipment-type/map-equipment-type.component';
import { EditMapEquipmentTypeComponent } from './freight-mode/edit-map-equipment-type/edit-map-equipment-type.component';
import { GeoLocationListComponent } from './geo-location/geo-location-list/geo-location-list.component';
import { ChargeListComponent } from './charge/charge-list/charge-list.component';
import { AddnewChargeComponent } from './charge/addnew-charge/addnew-charge.component';
import { ApplicationSettingsComponent } from './application-settings/application-settings.component';
import { SpecialPreferenceComponent } from './special-preference/special-preference.component';
import { PreferenceListComponent } from './special-preference/preference-list/preference-list.component';
import { HelpPreferenceComponent } from './special-preference/help-preference/help-preference.component';
import { FuelListComponent } from './fuel-surcharge/fuel-list/fuel-list.component';
import { EditSpecialPrefrenceComponent } from './special-preference/edit-special-prefrence/edit-special-prefrence.component';
import { AddEditGeolocationComponent } from './geo-location/add-edit-geolocation/add-edit-geolocation.component';
import { ModuleRolePermissionsComponent } from './module-role-permissions/module-role-permissions.component';
import { AddModuleRoleComponent } from './module-role-permissions/add-module-role/add-module-role.component';
import { EditModuleRoleComponent } from './module-role-permissions/edit-module-role/edit-module-role.component';
import { ModuleListComponent } from './module-role-permissions/module-list/module-list.component';
import { MomentDateWithZonePipe } from '../../shared/pipe/moment-date.pipe';
import { AddNewRoleComponent } from './module-role-permissions/add-new-role/add-new-role.component';
import { EditNewRoleComponent } from './module-role-permissions/edit-new-role/edit-new-role.component';
import { EditModuleroleComponent } from '../manage-partograph/pages/modulerolepermissions/edit-modulerole/edit-modulerole.component';

import { FormsModule }   from '@angular/forms';
import { AddModuleroleComponent } from '../manage-partograph/pages/modulerolepermissions/add-modulerole/add-modulerole.component';
import { ModulerolepermissionsComponent } from '../manage-partograph/pages/modulerolepermissions/modulerolepermissions.component';
import { ModulelistComponent } from '../manage-partograph/pages/modulerolepermissions/module-list/module-list.component';


@NgModule({
  declarations: [
    EquipmentTypeComponent,
    EquipmentListComponent,   
    ChargeComponent,
    EditChargeComponent,
    ChargeTypeComponent,
    ChargeCategoryComponent,
    MapComputationMethodComponent,
    AddEditEquipmentComponent,
    DefineEquipmentMaterialComponent,
    EditDefineEquipmentMaterialComponent,
    FuelSurchargeComponent,
    AddFuelsurchargeComponent,
    EditFuelsurchargeComponent,    
    ImportExcelComponent,
    FreightModeComponent,
    FreightListComponent,
    AddFreightComponent,
    EditFreightComponent,
    ApplicationChargesComponent,
    EditFreightComponent,
    GeoLocationComponent,
    MapEquipmentTypeComponent,
    EditMapEquipmentTypeComponent,
    GeoLocationListComponent,
    ChargeListComponent,
    AddnewChargeComponent,
    ApplicationSettingsComponent,
    SpecialPreferenceComponent,
    PreferenceListComponent,
    HelpPreferenceComponent,
    FuelListComponent,
    EditSpecialPrefrenceComponent,
    AddEditGeolocationComponent,
    ModuleRolePermissionsComponent,
    ModulerolepermissionsComponent,
    AddModuleRoleComponent,
    AddModuleroleComponent,
    EditModuleRoleComponent,
    ModuleListComponent,
    ModulelistComponent,
    AddNewRoleComponent,
    EditNewRoleComponent,
    EditModuleroleComponent
  ],
  imports: [
    CommonModule,
    SystemSettingsRoutingModule,
    SharedModule,
    MaterialModule,
    UiSwitchModule,
    NgSelect2Module,
    ResizableModule,
    AngularMultiSelectModule,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    CalendarModule,
    FormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: []
})
export class SystemSettingsModule { }
