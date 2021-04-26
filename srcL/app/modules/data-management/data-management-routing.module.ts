import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { OrganizationComponent } from './facility-organization-setup/organization/organization.component';
import { OrganizationLevelComponent } from './facility-organization-setup/organization-level/organization-level.component';
import { OrganizationTypeGroupComponent } from './facility-organization-setup/organization-type-group/organization-type-group.component';

import { EditContractComponent } from './contract/pages/edit-contract/edit-contract.component';
import { ContractListComponent } from './contract/pages/contract-list/contract-list.component';

import { OperatingLocationComponent } from './operating-location/operating-location.component';
import { CustomerPartnerByLocationComponent } from './customer-partner-by-location/customer-partner-by-location.component';
import { BusinessPartnerByLocationComponent } from './business-partner-by-location/business-partner-by-location.component';

import { MaterialComponent } from './material-management/material/material.component';
import { EditMaterialComponent } from './material-management/edit-material/edit-material.component';


import { MaterialGroupComponent } from './material-management/material-group/material-group.component';
import { MaterialHierarchyComponent } from './material-management/material-hierarchy/material-hierarchy.component';
import { FuelPriceComponent } from './freight-management/fuel-price/fuel-price.component';
import { AddOrganizationComponent } from './facility-organization-setup/organization-details/add-organization/add-organization.component';
import { EditOrganizationComponent } from './facility-organization-setup/organization-details/edit-organization/edit-organization.component';
import { CommodityComponent } from './commodity-detail/commodity/commodity.component';
import { ClaimComponent } from './claim-detail/claim/claim.component';
import { FreightLanesComponent } from './freight-management/freight-lanes/freight-lanes.component';
import { ContractComponent } from './contract/contract.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { TeamCalendarComponent } from './team-calendar/team-calendar.component';
import { BillofmaterialComponent } from './billofmaterial/billofmaterial.component';
import { PropertiesComponent } from './Infrastructure/properties/properties.component';
import { RelationsComponent } from './Infrastructure/relations/relations.component';
import { EquipmentComponent } from './equipment-management/equipment/equipment.component';
import { EquipmentClassComponent } from './equipment-management/equipment-class/equipment-class.component';
import { CapabilitiesComponent } from './Infrastructure/capabilities/capabilities.component';
import { InfraPlantFlowComponent } from './Infrastructure/infra-plant-flow/infra-plant-flow.component';



const routes: Routes = [
  // {
  //   path: '',
  //   component: FindPartographComponent
  // },
  //{
  //   path: 'new-partograph',
  //   component: NewPartographComponent
  // }
  {
    path: 'manage-organization',
    component: ManageOrganizationComponent
  },
  {
    path: 'organization',
    component: OrganizationComponent
  },

  {
    path: 'add-organization',
    component: AddOrganizationComponent
  },
  {
    path: 'edit-organization',
    component: EditOrganizationComponent
  },
  {
    path: 'organization-level',
    component: OrganizationLevelComponent
  },
  {
    path: 'organization-type-group',
    component: OrganizationTypeGroupComponent
  },

  
  {
    path: 'business-partner-by-location',
    component: BusinessPartnerByLocationComponent
  },
 

  {
    path: 'customer-partner-by-location',
    component: CustomerPartnerByLocationComponent
  },
  
  {
    path: 'operating-location',
    component: OperatingLocationComponent
  },


  /*{
    path: 'edit-contract', component: ContractComponent
  },*/
  {
    path: 'contract-list', component: ContractComponent
  },
  {
    path: 'material', component: MaterialComponent
  },
  {
    path: 'edit-material', component: EditMaterialComponent
  },
  {
    path: 'material-group', component: MaterialGroupComponent
  },
  {
    path: 'material-hierarchy', component: MaterialHierarchyComponent
  },
  {
    path: 'fuel-price',
    component: FuelPriceComponent
  },
  {
    path: 'commodity',
    component: CommodityComponent
  },
  {
    path: 'claim',
    component: ClaimComponent
  },
  {
    path: 'freight-lanes',
    component: FreightLanesComponent
  },
  {
    path: 'appointment',
    component: AppointmentComponent
  },
  {
    path: 'team-calendar',
    component: TeamCalendarComponent
  },
  {
    path: 'billofmaterial',
    component: BillofmaterialComponent
  },
  {
    path: 'properties',
    component: PropertiesComponent
  },
  {
    path: 'relations',
    component: RelationsComponent
  },
  {
    path: 'capabilities',
    component: CapabilitiesComponent
  },
  {
    path: 'infra-plant-flow',
    component: InfraPlantFlowComponent
  },
  {
    path: 'equipment',
    component: EquipmentComponent
  },
  {
    path: 'equipment-class',
    component: EquipmentClassComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
