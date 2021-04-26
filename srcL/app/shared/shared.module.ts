import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ResizableModule } from 'angular-resizable-element';
import { MaterialModule } from 'app/material/material.module';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateRangePickerModule, DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FetalHeartLinechartComponent } from './components/chart/fetal-heart-linechart/fetal-heart-linechart.component';
import { ModalContentComponent } from './components/modal-content/heart-rate/modal-content.component';
import { AmnioticMouldingchartComponent } from './components/chart/amniotic-mouldingchart/amniotic-mouldingchart.component';
import { CervixDescentchartComponent } from './components/chart/cervix-descentchart/cervix-descentchart.component';
import { NextPreviousButtonComponent } from './components/next-previous-button/next-previous-button.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsComponent } from './components/comments/comments.component';
import { CervixDescentModalPopUpComponent } from './components/modal-content/cervix-descent.chart.popup/cervix-descent.chart.popup.component';
import { ContractionsChartComponent } from './components/chart/contractions.chart/contractions.chart.component';
import { TimeChartComponent } from './components/chart/time.chart/time.chart.component';
import { ContractionModalPopUpComponent } from './components/modal-content/contraction.chart.popup/contraction.chart.popup.component';
import { AmnioticChartPopupComponent } from './components/modal-content/amniotic.chart.popup/amniotic.chart.popup.component';
import { MouldingChartPopupComponent } from './components/modal-content/moulding.chart.popup/moulding.chart.popup.component';
import { OxitocinChartPopupComponent } from './components/modal-content/oxitocin.chart.popup/oxitocin.chart.popup.component';
import { OxitocinChartComponent } from './components/chart/oxitocin.chart/oxitocin.chart.component';
import { PulsebpChartComponent } from './components/chart/pulsebp.chart/pulsebp.chart.component';
import { DrugsChartComponent } from './components/chart/drugs.chart/drugs.chart.component';
import { DrugsChartPopupComponent } from './components/modal-content/drugs.chart.popup/drugs.chart.popup.component';
import { PulsebpChartPopupComponent } from './components/modal-content/pulsebp.chart.popup/pulsebp.chart.popup.component';
import { TempProteinVolumeAcetonChartComponent } from './components/chart/temp.protein.volume.aceton.chart/temp.protein.volume.aceton.chart.component';
import { TempProteinVolumeAcetonChartPopupComponent } from './components/modal-content/temp.protein.volume.aceton.chart.popup/temp.protein.volume.aceton.chart.popup.component';
import { TempratureChartComponent } from './components/chart/temprature.chart/temprature.chart.component';
import { TempratureChartPopupComponent } from './components/modal-content/temprature.chart.popup/temprature.chart.popup.component';
import { PatientHeaderComponent } from './components/patient-header/patient-header.component';
import { CervixAlertPopupComponent } from './components/chart/cervix-alert.popup/cervix-alert.popup.component';
import { FetalHeartAlertPopupComponent } from './components/modal-content/fetal-heart.alert.popup/fetal-heart.alert.popup.component';
import { NotificationPopupComponent } from './components/modal-content/notification.popup/notification.popup.component';
import { RecentcommentComponent } from './components/recentcomment/recentcomment.component';
import { CharthistoryComponent } from './components/charthistory/charthistory.component';
import { PatientinformationComponent } from './components/patientinformation/patientinformation.component';
import { CervixDescentnewChartComponent } from './components/chart/cervix-descentnew.chart/cervix-descentnew.chart.component';
import { ContactfieldsComponent } from './components/contactfields/contactfields.component';
import { AddressfieldsComponent } from './components/addressfields/addressfields.component';
import { CervixDescentSecondPhaseComponent } from './components/chart/cervix-descent-second-phase/cervix-descent-second-phase.component';
import { AddComplicationsComponent } from './components/modal-content/add-complications/add-complications.component';
import { CaputSuccedaneumComponent } from './components/chart/caput-succedaneum/caput-succedaneum.component';
import { ContactAddressComponent } from './components/modal-content/contact-address/contact-address.component';
import { ShowNotesComponent } from './components/show-notes/show-notes.component';
import { FilterComponent } from './components/filter/filter.component';
import { OthersCommonComponent } from './components/modal-content/others-common/others-common.component';
import { AddContactComponent } from './components/modal-content/add-contact/add-contact.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { AddPlanningLocationComponent } from './components/add-planning-location/add-planning-location.component';
import { AddEditAddressComponent } from './components/modal-content/add-edit-address/add-edit-address.component';
import { AddEditRoleComponent } from './components/modal-content/add-edit-role/add-edit-role.component';
import { AddEditPlanningLocationComponent } from './components/modal-content/add-edit-planning-location/add-edit-planning-location.component';
import { OrganizationinfoComponent } from './components/organizationinfo/organizationinfo.component';
import { NextContentTabComponent } from './components/next-content-tab/next-content-tab.component';
import { AddBirthingPositionComponent } from './components/modal-content/add-birthing-position/add-birthing-position.component';
import { CharacteristicsComponent } from './components/modal-content/characteristics/characteristics.component';
import { AddressPanelComponent } from './components/address-panel/address-panel.component';
import { PaymentPlanComponent } from './components/payment-plan/payment-plan.component';
import { GeographicinfoComponent } from './components/geographicinfo/geographicinfo.component';

import { FetalHeartSecondPhaseLinechartComponent } from './components/chart/fetal-heart-second-stage-linechart/fetal-heart-second-phase-linechart.component';
// Active Phase portion
import { AmnioticMouldingActivePhasechartComponent } from './components/chart/amniotic-moulding-active-phase-chart/amniotic-moulding-active-phase-chart.component';
import { ContractionsActivePhaseChartComponent } from './components/chart/contractions-active-phase.chart/contractions-active-phase.chart.component';
import { DrugsActivePhaseChartComponent } from './components/chart/drugs.chart-active-phase/drugs-active-phase.chart.component';
import { OxitocinActivePhaseChartComponent } from './components/chart/oxitocin-active-phase.chart/oxitocin-active-phase.chart.component';
import { PulsebpActivePhaseChartComponent } from './components/chart/pulsebp-active-phase.chart/pulsebp-active-phase.chart.component';
import { TempProteinVolumeAcetonActivePhaseChartComponent } from './components/chart/temp.protein.volume.aceton.active.phase.chart/temp.protein.volume.aceton.active.phase.chart.component'
import { FetalHeartActivePhaseLinechartComponent } from './components/chart/fetal-heart-active-phase-linechart/fetal-heart-active-phase-linechart.component';
import { TempratureActivePhaseChartComponent } from './components/chart/temprature-active-phase.chart/temprature-active-phase.chart.component';
import { AmnioticMouldingSecondStageChartComponent } from './components/chart/amniotic-moulding-second-stage-chart/amniotic-moulding-second-stage-chart.component';
import { DrugsChartSecondStageComponent } from './components/chart/drugs.chart-second-stage/drugs.chart-second-stage.component';
import { PulsebpSecondStageChartComponent } from './components/chart/pulsebp-second-stage-chart/pulsebp-second-stage-chart.component';
import { ProteinAcetonVolumeSecondStageChartComponent } from './components/chart/protein-aceton-volume-second-stage-chart/protein-aceton-volume-second-stage-chart.component';
import { TemperatureSecondStageChartComponent } from './components/chart/temperature-second-stage-chart/temperature-second-stage-chart.component';
import { ContractionsSecondStageChartComponent } from './components/chart/contractions-second-stage-chart/contractions-second-stage-chart.component';
import { OxitocinSecondStageChartComponent } from './components/chart/oxitocin-second-stage-chart/oxitocin-second-stage-chart.component';
import { PulsebpThirdStageChartComponent } from './components/chart/pulsebp-third-stage-chart/pulsebp-third-stage-chart.component';
import { PulsebpFourthStageChartComponent } from './components/chart/pulsebp-fourth-stage-chart/pulsebp-fourth-stage-chart.component';
import { TemperatureFourthStageChartComponent } from './components/chart/temperature-fourth-stage-chart/temperature-fourth-stage-chart.component';
import { TemperatureThirdStageChartComponent } from './components/chart/temperature-third-stage-chart/temperature-third-stage-chart.component';

import { GridsComponent } from './components/grids/grids.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { DocumentComponent } from './components/document/document.component';
import { AddEditComponent } from './components/document/add-edit/add-edit.component';
import { ChartHistoryActivePhaseComponent } from './components/chart-history-active-phase/chart-history-active-phase.component';
import { ChartHistorySecondPhaseComponent } from './components/chart-history-second-phase/chart-history-second-phase.component';
import { ChartHistoryThirdPhaseComponent } from './components/chart-history-third-phase/chart-history-third-phase.component';
import { ChartHistoryFourthPhaseComponent } from './components/chart-history-fourth-phase/chart-history-fourth-phase.component';
import { TopBtnGroupComponent } from './components/top-btn-group/top-btn-group.component';
import { TransformPartographPipe } from './pipe/transform-partograph.pipe';
import { DynamicWebcontrolParameterComponent } from './components/dynamic-webcontrol-parameter/dynamic-webcontrol-parameter.component';
import { IssueComponent } from './components/issue/issue.component';
import { ContactPanelComponent } from './components/contact-panel/contact-panel.component';
import { CharacteristicsPanelComponent } from './components/characteristics-panel/characteristics-panel.component';
import { ConfirmDeleteTabledataPopupComponent } from './components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { UpdateTblPopupComponent } from './components/update-tbl-popup/update-tbl-popup.component';
import { DataExportComponent } from './components/data-export/data-export.component';
import { PhysicianAddComponent } from './components/physician-add/physician-add.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ShareScreenComponent } from './components/share-screen/share-screen.component';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { DecimalNumberDirective } from './directive/decimal-number.directive';
import { AddCommentComponent } from './components/issue/add-comment/add-comment.component';
import { DecimalNumber55PDirective } from './directive/decimal-number55P/decimal-number55-p.directive';
import { DecimalNumber42PDirective } from './directive/decimal-number42P/decimal-number42-p.directive';
import { DecimalNumber32PDirective } from './directive/decimal-number32P/decimal-number32-p.directive';
import { PositiveNumberDirective } from './directive/positive-number/positive-number.directive';
import { MultiselectFilterFixDirective } from './directive/multiselect-filter-fix.directive';
import {confirmationpopup } from './components/confirmation-popup/confirmation-popup.component'
import { MomentDateWithZonePipe } from './pipe/moment-date.pipe';
import { ResizeColumnDirective } from './directive/resize-column.directive';
import { CalendarModule } from 'primeng/calendar';
import { ImageDrawingModule } from 'ngx-image-drawing';
import { StringAutocompleteChipsComponent } from './components/share-screen/string-autocomplete-chips/string-autocomplete-chips.component';
import { ValidationService } from './components/share-screen/validation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterModule,
    NgbModule,
    TranslateModule,
    UiSwitchModule,
    MaterialModule,
    NgSelect2Module,
    NgSelectModule,
    //I18nModule,
    ResizableModule,
    AngularMultiSelectModule,
    DateRangePickerModule, DateTimePickerModule, DatePickerModule, CalendarModule,
    ImageDrawingModule
  ],
  declarations: [    
    TransformPartographPipe, ResizeColumnDirective,
    ControlMessagesComponent,
    SpinnerComponent,
    FetalHeartLinechartComponent,
    ModalContentComponent,
    AmnioticMouldingchartComponent,
    CervixDescentchartComponent,
    NextPreviousButtonComponent,
    ProgressBarComponent,
    CommentsComponent,
    CervixDescentModalPopUpComponent,
    ContractionsChartComponent,
    TimeChartComponent,
    ContractionModalPopUpComponent,
    AmnioticChartPopupComponent,
    MouldingChartPopupComponent,
    OxitocinChartPopupComponent,
    OxitocinChartComponent,
    PulsebpChartComponent,
    DrugsChartComponent,
    DrugsChartPopupComponent,
    PulsebpChartPopupComponent,
    TempProteinVolumeAcetonChartComponent,
    TempProteinVolumeAcetonChartPopupComponent,
    TempratureChartComponent,
    TempratureChartPopupComponent,
    PatientHeaderComponent,
    CervixAlertPopupComponent,
    FetalHeartAlertPopupComponent,
    NotificationPopupComponent,
    RecentcommentComponent,
    CharthistoryComponent,
    PatientinformationComponent,
    ContactfieldsComponent,
    AddressfieldsComponent,
    CervixDescentnewChartComponent,
    CervixDescentSecondPhaseComponent,
    AddComplicationsComponent,
    CaputSuccedaneumComponent,
    ContactAddressComponent,
    ShowNotesComponent,
    FilterComponent,
    DocumentComponent,
    OthersCommonComponent,
    AddContactComponent,
    RoleManagementComponent,   
    AddPlanningLocationComponent,
    AddEditAddressComponent,
    AddEditRoleComponent,
    AddEditPlanningLocationComponent,
    OrganizationinfoComponent,
    NextContentTabComponent,
    AddBirthingPositionComponent,
    CharacteristicsComponent,
    AddressPanelComponent,
    PaymentPlanComponent,
    GeographicinfoComponent,
    FetalHeartSecondPhaseLinechartComponent,
    AmnioticMouldingActivePhasechartComponent,
    ContractionsActivePhaseChartComponent,
    DrugsActivePhaseChartComponent,
    OxitocinActivePhaseChartComponent,
    PulsebpActivePhaseChartComponent,
    TempProteinVolumeAcetonActivePhaseChartComponent,
    FetalHeartActivePhaseLinechartComponent,
    TempratureActivePhaseChartComponent,
    AmnioticMouldingSecondStageChartComponent,
    DrugsChartSecondStageComponent,
    PulsebpSecondStageChartComponent,
    ProteinAcetonVolumeSecondStageChartComponent,
    TemperatureSecondStageChartComponent,
    ContractionsSecondStageChartComponent,
    OxitocinSecondStageChartComponent,
    PulsebpThirdStageChartComponent,
    PulsebpFourthStageChartComponent,
    TemperatureFourthStageChartComponent,
    TemperatureThirdStageChartComponent,
    GridsComponent,
    PaginatorComponent,
    AddEditComponent,
    ChartHistoryActivePhaseComponent,
   ChartHistorySecondPhaseComponent,
   ChartHistoryThirdPhaseComponent,
   ChartHistoryFourthPhaseComponent,
    TopBtnGroupComponent,
    DynamicWebcontrolParameterComponent,
    IssueComponent,
    ContactPanelComponent,
    CharacteristicsPanelComponent,
    ConfirmDeleteTabledataPopupComponent,
    UpdateTblPopupComponent,
    DataExportComponent,
    PhysicianAddComponent,
    FeedbackComponent,
    ShareScreenComponent,
    TableFilterComponent,
    AddCommentComponent,
    DecimalNumberDirective,
    PositiveNumberDirective,
    DecimalNumber55PDirective,
    DecimalNumber42PDirective,
    DecimalNumber32PDirective,
    MultiselectFilterFixDirective,
    confirmationpopup,
    MomentDateWithZonePipe,
    StringAutocompleteChipsComponent
  ],
  exports: [
    DecimalNumberDirective, ResizeColumnDirective,
    PositiveNumberDirective,
    DecimalNumber55PDirective,
    DecimalNumber42PDirective,
    DecimalNumber32PDirective,
    PhysicianAddComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    TranslateModule,
    ControlMessagesComponent,
    SpinnerComponent,
    FetalHeartLinechartComponent,
    AmnioticMouldingchartComponent,
    ModalContentComponent,
    CervixDescentchartComponent,
    NextPreviousButtonComponent,
    ProgressBarComponent,
    CommentsComponent,
    CervixDescentModalPopUpComponent,
    ContractionsChartComponent,
    TimeChartComponent,
    ContractionModalPopUpComponent,
    MouldingChartPopupComponent,
    AmnioticChartPopupComponent,
    OxitocinChartPopupComponent,
    OxitocinChartComponent,
    DrugsChartComponent,
    PulsebpChartComponent,
    TempProteinVolumeAcetonChartComponent,
    TempratureChartComponent,
    PatientHeaderComponent,
    CervixAlertPopupComponent,
    FetalHeartAlertPopupComponent,
    RecentcommentComponent,
    CharthistoryComponent,
    PatientinformationComponent,
    ContactfieldsComponent,
    AddressfieldsComponent,
    CervixDescentnewChartComponent,
    CervixDescentSecondPhaseComponent,
    CaputSuccedaneumComponent,
    ContactAddressComponent,
    ShowNotesComponent,
    FilterComponent,
    DocumentComponent,
    OthersCommonComponent,
    AddContactComponent,
    RoleManagementComponent,   
    AddPlanningLocationComponent,
    AddEditAddressComponent,
    AddEditRoleComponent,
    AddEditPlanningLocationComponent,
    OrganizationinfoComponent,
    NextContentTabComponent,
    AddBirthingPositionComponent,
    CharacteristicsComponent,
    AddressPanelComponent,
    PaymentPlanComponent,
    GeographicinfoComponent,
    FetalHeartSecondPhaseLinechartComponent,
    AmnioticMouldingActivePhasechartComponent,
    ContractionsActivePhaseChartComponent,
    DrugsActivePhaseChartComponent,
    OxitocinActivePhaseChartComponent,
    PulsebpActivePhaseChartComponent,
    TempProteinVolumeAcetonActivePhaseChartComponent,
    FetalHeartActivePhaseLinechartComponent,
    TempratureActivePhaseChartComponent,

    AmnioticMouldingSecondStageChartComponent,
    DrugsChartSecondStageComponent,
    PulsebpSecondStageChartComponent,
    ProteinAcetonVolumeSecondStageChartComponent,
    TemperatureSecondStageChartComponent,
    ContractionsSecondStageChartComponent,
    OxitocinSecondStageChartComponent,

    PulsebpThirdStageChartComponent,
    PulsebpFourthStageChartComponent,
    TemperatureFourthStageChartComponent,
    TemperatureThirdStageChartComponent,
    GridsComponent,
    PaginatorComponent,
    ChartHistoryActivePhaseComponent,
    ChartHistorySecondPhaseComponent,
    ChartHistoryThirdPhaseComponent,
    ChartHistoryFourthPhaseComponent,
    TopBtnGroupComponent,
    DynamicWebcontrolParameterComponent,
    IssueComponent,
    ContactPanelComponent,
    CharacteristicsPanelComponent,
    UpdateTblPopupComponent,
    DataExportComponent,
    ShareScreenComponent,
    TableFilterComponent,
    MultiselectFilterFixDirective,
    confirmationpopup,
    MomentDateWithZonePipe,
    CalendarModule,
    StringAutocompleteChipsComponent
  ],
  providers: [ValidationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
