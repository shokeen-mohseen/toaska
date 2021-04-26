import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentTypeComponent } from './equipment-type/equipment-type.component';
import { ChargeComponent } from './charge/charge.component';
import { EditChargeComponent } from './charge/edit-charge/edit-charge.component';
import { FuelSurchargeComponent } from './fuel-surcharge/fuel-surcharge.component';
import { AddFuelsurchargeComponent } from './fuel-surcharge/add-fuelsurcharge/add-fuelsurcharge.component';
import { EditFuelsurchargeComponent } from './fuel-surcharge/edit-fuelsurcharge/edit-fuelsurcharge.component';
import { FreightModeComponent } from './freight-mode/freight-mode.component';
import { GeoLocationComponent } from './geo-location/geo-location.component';
import { ApplicationChargesComponent } from './application-charges/application-charges.component';
import { ApplicationSettingsComponent } from './application-settings/application-settings.component';
import { SpecialPreferenceComponent } from './special-preference/special-preference.component';


const routes: Routes = [
  //   {
  //     path: '',
  //     children: [
  //       {
  //         path: 'budget',
  //         component: BudgetComponent
  //       }
  //     ]
  //   }

  //{
  //  path: '',
  //  component: CreditUserListComponent
  //},
  {
    path: 'equipment-type',
    component: EquipmentTypeComponent
  },
  {
    path: 'charge',
    component: ChargeComponent
  },
  {
    path: 'edit-charge',
    component: EditChargeComponent
  },
  {
    path: 'fuel-surcharge',
    component: FuelSurchargeComponent
  },
  {
    path: 'add-fuelsurcharge',
    component: AddFuelsurchargeComponent
  },
  {
    path: 'edit-fuelsurcharge',
    component: EditFuelsurchargeComponent
  },
  {
    path: 'freight-mode',
    component: FreightModeComponent
  },
  {
    path: 'application-chagers',
    component: ApplicationChargesComponent
  },
  {
    path: 'geo-location',
    component: GeoLocationComponent
  },
  {
    path: 'application-settings',
    component: ApplicationSettingsComponent
  },
  {
    path: 'special-preference',
    component: SpecialPreferenceComponent
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
