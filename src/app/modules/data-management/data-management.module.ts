import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'app/material/material.module';

import { DataManagementRoutingModule } from './data-management-routing.module';
import { PartographSetupComponent } from './partograph-setup/partograph-setup.component';
import { OrganizationComponent } from './facility-organization-setup/organization/organization.component';
import { OrganizationTypeGroupComponent } from './facility-organization-setup/organization-type-group/organization-type-group.component';
import { OrganizationLevelComponent } from './facility-organization-setup/organization-level/organization-level.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { MatExpansionModule } from '@angular/material/expansion';

import { BusinessPartnerByLocationComponent } from './business-partner-by-location/business-partner-by-location.component';
import { CustomerPartnerByLocationComponent } from './customer-partner-by-location/customer-partner-by-location.component';
import { OperatingLocationComponent } from './operating-location/operating-location.component';


import { MaterialComponent } from './material-management/material/material.component';
import { EditMaterialComponent } from './material-management/edit-material/edit-material.component';

import { DefineCharacteristicsComponent } from './material-management/define-characteristics/define-characteristics.component';
import { DefineEquipmentMaterialComponent } from './material-management/define-equipment-material/define-equipment-material.component';
import { MapForecastComponent } from './material-management/map-forecast/map-forecast.component';

import { AddEditDefineCharacteristicsComponent } from './material-management/add-edit-define-characteristics/add-edit-define-characteristics.component';
import { EditEquipmentMaterialComponent } from './material-management/edit-equipment-material/edit-equipment-material.component';
import { BusinessCharacteristicsComponent } from './business-characteristics/business-characteristics.component';
import { MaterialGroupComponent } from './material-management/material-group/material-group.component';
import { MaterialHierarchyComponent } from './material-management/material-hierarchy/material-hierarchy.component';
import { MaterialGroupDetailComponent } from './material-management/material-group-detail/material-group-detail.component';
import { MaterialHierarchyDetailComponent } from './material-management/material-hierarchy-detail/material-hierarchy-detail.component';
import { FuelPriceComponent } from './freight-management/fuel-price/fuel-price.component';
import { NgSelect2Module } from 'ng-select2';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddOrganizationComponent } from './facility-organization-setup/organization-details/add-organization/add-organization.component';
import { EditOrganizationComponent } from './facility-organization-setup/organization-details/edit-organization/edit-organization.component';
import { OrganizationListComponent } from './facility-organization-setup/organization-details/organization-list/organization-list.component';

import { MaterialListComponent } from './material-management/material-list/material-list.component';
import { AddMaterialComponent } from './material-management/add-material/add-material.component';
import { AddMapInvestorLocationComponent } from './material-management/add-map-investor-location/add-map-investor-location.component';
import { AddItemComponent } from './contract/pages/edit-contract/contract-line-items/add-item/add-item.component';
import { EditItemComponent } from './contract/pages/edit-contract/contract-line-items/edit-item/edit-item.component';
import { CommodityComponent } from './commodity-detail/commodity/commodity.component';
import { AddCommodityComponent } from './commodity-detail/add-commodity/add-commodity.component';
import { EditCommodityComponent } from './commodity-detail/edit-commodity/edit-commodity.component';
import { CommodityListComponent } from './commodity-detail/commodity-list/commodity-list.component';
import { AddBusinessPartnerComponent } from './business-partner-detail/add-business-partner/add-business-partner.component';
import { EditBusinessPartnerComponent } from './business-partner-detail/edit-business-partner/edit-business-partner.component';
import { BusinesspartnerListComponent } from './business-partner-detail/businesspartner-list/businesspartner-list.component';
import { AddCustomerPartnerComponent } from './customer-partner-detail/add-customer-partner/add-customer-partner.component';
import { EditCustomerPartnerComponent } from './customer-partner-detail/edit-customer-partner/edit-customer-partner.component';
import { CustomerListComponent } from './customer-partner-detail/customer-list/customer-list.component';
import { EditOperatingLocationComponent } from './operating-location-detail/edit-operating-location/edit-operating-location.component';
import { AddOperatingLocationComponent } from './operating-location-detail/add-operating-location/add-operating-location.component';
import { OperatingListComponent } from './operating-location-detail/operating-list/operating-list.component';
import { MapEquipmentTypeComponent } from './business-partner-detail/map-equipment-type/map-equipment-type.component';
import { AddEditEquipmentTypeComponent } from './business-partner-detail/add-edit-equipment-type/add-edit-equipment-type.component';
import { MapPreferredMaterialsComponent } from './business-partner-detail/map-preferred-materials/map-preferred-materials.component';
import { AddEditMapPreferredMaterialsComponent } from './business-partner-detail/add-edit-map-preferred-materials/add-edit-map-preferred-materials.component';
import { AddEditMapPalletTypeComponent } from './business-partner-detail/add-edit-map-pallet-type/add-edit-map-pallet-type.component';
import { MapPalletTypeComponent } from './business-partner-detail/map-pallet-type/map-pallet-type.component';
import { ClaimComponent } from './claim-detail/claim/claim.component';
import { ClaimListComponent } from './claim-detail/claim-list/claim-list.component';
import { AddClaimComponent } from './claim-detail/add-claim/add-claim.component';
import { EditClaimComponent } from './claim-detail/edit-claim/edit-claim.component';
import { ChargeDetailComponent } from './claim-detail/charge-detail/charge-detail.component';
import { ChargeListComponent } from './claim-detail/charge-list/charge-list.component';
import { AddEditchargeComponent } from './claim-detail/add-editcharge/add-editcharge.component';
import { FreightLanesComponent } from './freight-management/freight-lanes/freight-lanes.component';
import { FreightLanesListComponent } from './freight-management/freight-lanes/freight-lanes-list/freight-lanes-list.component';
import { AddEditFreightlanesComponent } from './freight-management/freight-lanes/add-edit-freightlanes/add-edit-freightlanes.component';
import { EditOrganizationLabelComponent } from './facility-organization-setup/organization-level/edit-organization-label/edit-organization-label.component';
import { AddOrganizationLabelComponent } from './facility-organization-setup/organization-level/add-organization-label/add-organization-label.component';
import { OrganizationLabelListComponent } from './facility-organization-setup/organization-level/organization-label-list/organization-label-list.component';
import { AddNewTypeComponent } from './commodity-detail/add-new-type/add-new-type.component';
import { ImportComponent } from './freight-management/freight-lanes/import/import.component';
import { ContractDetailsComponent } from './contract/pages/edit-contract/contract-details/contract-details.component';
import { ContractComponent } from './contract/contract.component';
import { ContractListComponent } from './contract/pages/contract-list/contract-list.component';
import { EditContractComponent } from './contract/pages/edit-contract/edit-contract.component';
import { ViewItemComponent } from './contract/pages/edit-contract/contract-line-items/view-item/view-item.component';
import { ContractLineItemsComponent } from './contract/pages/edit-contract/contract-line-items/contract-line-items.component';
import { ContractDefiningCharacteristicsComponent } from './contract/pages/edit-contract/contract-defining-characteristics/contract-defining-characteristics.component';
import { EditBusinesspartnerTypeComponent } from './business-partner-detail/edit-businesspartner-type/edit-businesspartner-type.component';
import { AddContractComponent } from './contract/pages/add-contract/add-contract.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { AddManageorganizationComponent } from './manage-organization/add-manageorganization/add-manageorganization.component';
import { EditManageorganizationComponent } from './manage-organization/edit-manageorganization/edit-manageorganization.component';
import { ManageorganizationListComponent } from './manage-organization/manageorganization-list/manageorganization-list.component';
import { AddEditCharacteristicsComponent } from './customer-partner-detail/add-edit-characteristics/add-edit-characteristics.component';
import { AddeditLocationCharacteristicsComponent } from './operating-location-detail/addedit-location-characteristics/addedit-location-characteristics.component';
import { AddeditOrganizationCharacteristicsComponent } from './facility-organization-setup/organization-level/addedit-organization-characteristics/addedit-organization-characteristics.component';
import { AddeditCharacteristicsComponent } from './manage-organization/addedit-characteristics/addedit-characteristics.component';
import { AddMapForecastMaterialComponent } from './customer-partner-detail/add-map-forecast-material/add-map-forecast-material.component';
import { DeleteCommoditytypePopupComponent } from './commodity-detail/delete-commoditytype-popup/delete-commoditytype-popup.component';
import { AddFuelComponent } from './freight-management/fuel-price/add-fuel/add-fuel.component';
import { CarrierpartnerlistComponent } from './business-partner-detail/carrierpartnerlist/carrierpartnerlist.component';

import { AppointmentComponent } from './appointment/appointment.component';
import { AddEditShipfromLocComponent } from './customer-partner-detail/add-edit-shipfrom-loc/add-edit-shipfrom-loc.component';

import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonAllModule, CheckBoxAllModule, SwitchAllModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule, TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService } from '@syncfusion/ej2-angular-schedule';
import { TeamCalendarComponent } from './team-calendar/team-calendar.component';
import { BillofmaterialComponent } from './billofmaterial/billofmaterial.component';
import { BillmaterialListComponent } from './billofmaterial/billmaterial-list/billmaterial-list.component';
import { PropertiesComponent } from './Infrastructure/properties/properties.component';
import { RelationsComponent } from './Infrastructure/relations/relations.component';

import { AddBillmaterialListComponent } from './billofmaterial/add-billmaterial-list/add-billmaterial-list.component';
import { EquipmentClassComponent } from './equipment-management/equipment-class/equipment-class.component';
import { EquipmentComponent } from './equipment-management/equipment/equipment.component';
import { EquipmentClassListComponent } from './equipment-management/equipment-class/equipment-class-list/equipment-class-list.component';
import { EquipmentListComponent } from './equipment-management/equipment/equipment-list/equipment-list.component';
import { ModalEquipmentTypeComponent } from './equipment-management/equipment-class/modal-equipment-type/modal-equipment-type.component';
//import { ResizableModule } from 'angular-resizable-element';
import { CustomerCharacteristicsPanelComponent } from './customer-partner-detail/customer-characteristics-panel/customer-characteristics-panel.component';
import { MapForecastMaterialPanelComponent } from './customer-partner-detail/map-forecast-material-panel/map-forecast-material-panel.component';
import { ContractsPanelComponent } from './business-partner-detail/contracts-panel/contracts-panel.component';
import { OrgCharacteristicsPanelComponent } from './facility-organization-setup/organization-level/org-characteristics-panel/org-characteristics-panel.component';
import { OperatingCharacteristicsPanelComponent } from './operating-location-detail/operating-characteristics-panel/operating-characteristics-panel.component';
import { EquipmentFilterComponent } from './equipment-management/equipment/equipment-filter/equipment-filter.component';
import { AddDefineCharacteristicsPanelComponent } from './equipment-management/equipment/add-define-characteristics-panel/add-define-characteristics-panel.component';
import { AddEditDefinecharacteristicsComponent } from './equipment-management/equipment/add-edit-definecharacteristics/add-edit-definecharacteristics.component';
import { CapabilitiesComponent } from './Infrastructure/capabilities/capabilities.component';
import { CapabilitiesListComponent } from './Infrastructure/capabilities/capabilities-list/capabilities-list.component';
import { AddCapabilitiesComponent } from './Infrastructure/capabilities/add-capabilities/add-capabilities.component';
import { InfraPlantFlowComponent } from './Infrastructure/infra-plant-flow/infra-plant-flow.component';
import { FilterCapabilitiesComponent } from './Infrastructure/capabilities/filter-capabilities/filter-capabilities.component';
import { AddEditEquipmentComponent } from './equipment-management/equipment/add-edit-equipment/add-edit-equipment.component';
import { AddEditEquipmentclassComponent } from './equipment-management/equipment-class/add-edit-equipmentclass/add-edit-equipmentclass.component';
import { CharacteristicsAddEditPanelComponent } from './manage-organization/characteristics-add-edit-panel/characteristics-add-edit-panel.component';
import { AddEditBillofmaterialComponent } from './billofmaterial/add-edit-billofmaterial/add-edit-billofmaterial.component';
import { BusinessCharacteristicsPanelComponent } from './business-partner-detail/business-characteristics-panel/business-characteristics-panel.component';
import { AddEditBusinessCharacteristicsComponent } from './business-partner-detail/add-edit-business-characteristics/add-edit-business-characteristics.component';
import { FreightlaneFilterComponent } from './freight-management/freight-lanes/freightlane-filter/freightlane-filter.component';
import { AddEditBusinessPartnerTypePopupComponent } from './business-partner-detail/add-edit-business-partner-type-popup/add-edit-business-partner-type-popup.component';
import { ClaimFilterComponent } from './claim-detail/claim-filter/claim-filter.component';
import { EditFreightlaneComponent } from './freight-management/freight-lanes/edit-freightlane/edit-freightlane.component';
import { CalendarModule } from 'primeng/calendar';
import { ViewImportStatusComponent } from './freight-management/freight-lanes/view-import-status/view-import-status.component';
@NgModule({
  declarations: [PartographSetupComponent,
    OrganizationComponent, OrganizationTypeGroupComponent,
    OrganizationLevelComponent, AddOrganizationComponent, EditOrganizationComponent,
    ContractDetailsComponent, 
    AddItemComponent,
    EditItemComponent, EditOrganizationLabelComponent, AddOrganizationLabelComponent,
    BusinessPartnerByLocationComponent,
    CustomerPartnerByLocationComponent,
    OperatingLocationComponent,
    AddBusinessPartnerComponent,
    EditBusinessPartnerComponent,
    MaterialComponent,
    EditMaterialComponent, EditFreightlaneComponent,
    AddCustomerPartnerComponent,
    EditCustomerPartnerComponent, DefineCharacteristicsComponent, EditOperatingLocationComponent, AddOperatingLocationComponent,
    DefineEquipmentMaterialComponent, MapForecastComponent, AddEditDefineCharacteristicsComponent, EditEquipmentMaterialComponent,
    BusinessCharacteristicsComponent,
    MaterialGroupComponent, MaterialHierarchyComponent, MaterialGroupDetailComponent, MaterialHierarchyDetailComponent,
    FuelPriceComponent, OrganizationListComponent, MaterialListComponent,
    AddMaterialComponent, AddMapInvestorLocationComponent, CommodityComponent,
    AddCommodityComponent, EditCommodityComponent, CommodityListComponent,
    BusinesspartnerListComponent, CustomerListComponent, OperatingListComponent,
    MapEquipmentTypeComponent, AddEditEquipmentTypeComponent, MapPreferredMaterialsComponent,
    AddEditMapPreferredMaterialsComponent, AddEditMapPalletTypeComponent, MapPalletTypeComponent,
    ClaimComponent, ClaimListComponent, AddClaimComponent, EditClaimComponent,
    ChargeDetailComponent, ChargeListComponent, AddEditchargeComponent,
    FreightLanesComponent, FreightLanesListComponent,
    AddEditFreightlanesComponent, OrganizationLabelListComponent,
    AddNewTypeComponent, ImportComponent, ContractComponent, ContractListComponent,
    EditContractComponent, AddContractComponent, ViewItemComponent, ContractLineItemsComponent,
    ContractDefiningCharacteristicsComponent, EditBusinesspartnerTypeComponent,
    ManageOrganizationComponent, AddManageorganizationComponent, CarrierpartnerlistComponent,
    EditManageorganizationComponent, ManageorganizationListComponent,
    AddEditCharacteristicsComponent, AddeditLocationCharacteristicsComponent,
    AddeditOrganizationCharacteristicsComponent, AddeditCharacteristicsComponent,
    AddMapForecastMaterialComponent, DeleteCommoditytypePopupComponent, AddFuelComponent,
    AppointmentComponent, AddEditShipfromLocComponent, TeamCalendarComponent,
    BillofmaterialComponent, BillmaterialListComponent, PropertiesComponent,
    RelationsComponent,
    AddBillmaterialListComponent, EquipmentClassComponent, EquipmentComponent,
    EquipmentClassListComponent,  EquipmentListComponent,
     ModalEquipmentTypeComponent,
    CustomerCharacteristicsPanelComponent, MapForecastMaterialPanelComponent,
    ContractsPanelComponent, OrgCharacteristicsPanelComponent, OperatingCharacteristicsPanelComponent, EquipmentFilterComponent, AddDefineCharacteristicsPanelComponent, AddEditDefinecharacteristicsComponent, CapabilitiesComponent, CapabilitiesListComponent, AddCapabilitiesComponent, InfraPlantFlowComponent, FilterCapabilitiesComponent, AddEditEquipmentComponent, AddEditEquipmentclassComponent, CharacteristicsAddEditPanelComponent, AddEditBillofmaterialComponent, BusinessCharacteristicsPanelComponent, AddEditBusinessCharacteristicsComponent, FreightlaneFilterComponent,
    AddEditBusinessPartnerTypePopupComponent,
    ClaimFilterComponent, ViewImportStatusComponent  
  ],
    
  
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule, MatExpansionModule,
    DataManagementRoutingModule, MatSelectModule,
    MatFormFieldModule, NgSelect2Module, DateRangePickerModule, DateTimePickerModule, DatePickerModule,
    /*ResizableModule,*/ AngularMultiSelectModule, UiSwitchModule,
    DropDownButtonAllModule, TreeViewModule, DropDownListAllModule, MultiSelectAllModule, MaskedTextBoxModule,
    UploaderAllModule, ToolbarAllModule, ContextMenuAllModule,
    ButtonAllModule, CheckBoxAllModule, SwitchAllModule,
    DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule,
    NumericTextBoxAllModule, TextBoxAllModule,
    ScheduleAllModule, RecurrenceEditorAllModule, CalendarModule
  ],
  exports: [
    PartographSetupComponent
  ],
  providers: [DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService]
})
export class DataManagementModule { }
