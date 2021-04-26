import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddnewForecastComponent } from '../addnew-forecast/addnew-forecast.component';
import { FlexComponent } from '../flex/flex.component';
import { AdjustFinalForecastComponent } from '../adjust-final-forecast/adjust-final-forecast.component';
import { ForecastMappingComponent } from '../forecast-mapping/forecast-mapping.component';
import { AddNewRowComponent } from '../add-new-row/add-new-row.component';
import { DupicateForecastComponent } from '../dupicate-forecast/dupicate-forecast.component';
import { ManageMarketForecastImportComponent } from '../manage-market-forecast-import/manage-market-forecast-import.component';
import { ManageLocationMaterialMappingComponent } from '../manage-location-material-mapping/manage-location-material-mapping.component';
import { projectkey } from 'environments/projectkey';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { ViewForecastAsComponent } from '../view-forecast-as/view-forecast-as.component';
import { Forecast } from '../../../core/models/Forecast.model';
import { ForecastService } from '../../../core/services/forecast.service';
import { CreateComputeSalesForecastComponent } from '../create-compute-sales-forecast/create-compute-sales-forecast.component';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs/internal/scheduler/async';
import { ForecastUpdateComponent } from '../forecast-update/forecast-update.component';
import { AuthService } from '../../../core';
import { MessageService } from '../../../core/services/message.service';
import { UploadForecastComponent } from '../upload-forecast/upload-forecast.component';

@Component({
  selector: 'app-forecasting',
  templateUrl: './forecasting.component.html',
  styleUrls: ['./forecasting.component.css']
})
export class ForecastingComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
 // @ViewChild(AdjustFinalForecastComponent) adjustFinalForecastComponent: AdjustFinalForecastComponent;
  actionGroupConfig;
  ForecastingList: string = "ForecastExport";
  modalRef: NgbModalRef;
  itemListB = [];
  selectedItemsB = [];
  count = 6;
  forecastListSelected = [];
  forecastList = [];
  forecastSettings = {};
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false; s
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  filter: boolean = false;
  IsTosca: boolean;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild(CreateComputeSalesForecastComponent, { static: false }) createComputeSalesForecastComponent: CreateComputeSalesForecastComponent;
  forecastSelected: Forecast;
  forecastDetailsSelected = [];
  userMessages: any = [];

  constructor(private router: Router
    , public modalService: NgbModal
    , public forecastService: ForecastService
    , public messageService: MessageService
    , private changeDetector: ChangeDetectorRef
    , private toastrService: ToastrService
    , private authService: AuthService) { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();

    this.forecastSettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      searchBy: ['name'],
      labelKey: ['name']
    };


    this.getSelectedForecast();
    this.getForecastList();

    this.getMessages();
    this.buttonPermission();
  }
  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.showAction('addForecast');
    this.btnBar.showAction('addRow');
    this.btnBar.showAction('deleteSelectedForecast');
    this.btnBar.showAction('duplicateForecast');
    this.btnBar.showAction('deleteSelectedRow');
    this.btnBar.showAction('calculate');
    this.btnBar.showAction('flex');
    this.btnBar.showAction('AdjustFinalForecast');
    this.btnBar.showAction('updateForecast');
    this.btnBar.showAction('publish');
    this.btnBar.showAction('lock');
    this.btnBar.showAction('unlock');
    this.btnBar.showAction('mapping');
    this.btnBar.showAction('filter');
    this.btnBar.showAction('graph');
    this.btnBar.showAction('importforecast');
    this.btnBar.showAction('viewForecastAs');
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
    this.btnBar.hideAction('view');
    this.btnBar.hideTab('key_View');
    this.btnBar.hideAction('importLocationmaterial');
    this.changeDetector.detectChanges();
  }
  onAddItem(data: string) {
  }

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }

  actionHandler(type) {
    if (type === "createsNewForecast") {
      this.modalRef = this.modalService.open(AddnewForecastComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then(async (result) => {
        if (result === 'success') {
          await this.getSelectedForecast(); // Refresh Data in table grid
          this.createComputeSalesForecastComponent.setUpForecastSelected(this.forecastSelected);
        }
      }, (reason) => {
      });
    }
    else if (type === "uploadForecast") {
      this.modalRef = this.modalService.open(UploadForecastComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "filter") {
      this.filter = !this.filter;
    }
    else if (type === "flex") {
      this.modalRef = this.modalService.open(FlexComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "duplicateForecast") {
      this.modalRef = this.modalService.open(DupicateForecastComponent, { size: 'md', backdrop: 'static' });
    }
    else if (type === "mapping") {
      this.modalRef = this.modalService.open(ForecastMappingComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "addRow") {
      
      this.modalRef = this.modalService.open(AddNewRowComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.SelectedForecastID = this.createComputeSalesForecastComponent.forecastSelected.id;
    }
    else if (type === "ManageMarketForecastImport") {
      this.modalRef = this.modalService.open(ManageMarketForecastImportComponent, { size: 'xl', backdrop: 'static' });
      this.modalRef.componentInstance.forecastSelected = this.forecastSelected;

    }
    else if (type === "importLocationmaterial") {
      this.modalRef = this.modalService.open(ManageLocationMaterialMappingComponent, { size: 'lg', backdrop: 'static' });
    }
    else if (type === "AdjustFinalForecast") {
      this.modalRef = this.modalService.open(AdjustFinalForecastComponent, { size: 'xl', backdrop: 'static' });
      //this.adjustFinalForecastComponent.bindDetails(this.forecastDetailsSelected);

    }
    else if (type === "viewForecastAs") {
      this.modalRef = this.modalService.open(ViewForecastAsComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "updateForecast") {
      this.modalRef = this.modalService.open(ForecastUpdateComponent, { size: 'md', backdrop: 'static' });
    }
    else if (type === "deleteSelectedRow") {
      this.deleteSelectedRows();
    }
    else if (type === "deleteSelectedForecast") {
      this.deleteSelectedForecast();
    }
  }


  closeTab(action) {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
  }

  async getSelectedForecast() {
    await this.forecastService.getLastUpdatedForecast().toPromise()
      .then(result => {
        if (result.data) {
          this.forecastSelected = result.data;
          this.forecastService.forecastSelected = this.forecastSelected;

        }
      })
      .catch(() => this.toastrService.error(this.getMessage("RecordSaveFailed")));
  }


  getForecastList() {
    this.forecastService.getForecastList(new Forecast()).subscribe(
      result => {
        if (result.data) {
          this.forecastList = result.data;
          this.forecastListSelected = this.forecastList.filter(x => x.id == this.forecastSelected.id);
          this.forecastList.sort((x, y) => x.name.localeCompare(y.name));
        }
      }
    );
  }

  getMessages() {
    this.messageService.getMessagesByModuleCode("CSFOR", parseInt(localStorage.clientId)).subscribe(
      result => {
        if (result.data) {
          this.userMessages = result.data;
        }
      }
    );
  }


  getMessage(messageCode: string) {
    if (this.userMessages) {
      return this.userMessages.find(x => x.code == messageCode)?.message1;

    }
    return '';
  }


  applyFilter() {
    if (this.forecastListSelected && this.forecastListSelected[0]) {
      this.forecastSelected = this.forecastListSelected[0];
      this.forecastService.forecastSelected = this.forecastSelected;
      this.createComputeSalesForecastComponent.setUpForecastSelected(this.forecastSelected);
    }
  }
  selectedForecastList(list) {
    this.forecastDetailsSelected = list;
  }

  deleteSelectedRows() {
    if (this.forecastDetailsSelected != null && this.forecastDetailsSelected.length > 0) {
      var requestObj = {
        Ids: this.forecastDetailsSelected.map(x => parseInt(x.Id)),
        DeletedBy: this.authService.currentUserValue.LoginId
      }
      this.forecastService.deleteForecastDetails(requestObj).subscribe(
        result => {
          if (result.data) {
            if (result.data) {
              this.toastrService.success(this.getMessage("RecordsAreDeletedSuccessfully"));
              this.createComputeSalesForecastComponent.setUpForecastSelected(this.forecastSelected);
            } else {
              this.toastrService.error(this.getMessage("RecordsDeletionFailed"));
            }
          }
        }
      );
    } else {
      this.toastrService.warning(this.getMessage("SelectRecordsToBeDeleted"));
    }
  }

  deleteSelectedForecast() {
    if (this.forecastSelected != null) {
      this.forecastService.deleteForecast(this.forecastSelected).subscribe(
        async result => {
          if (result.data) {
            if (result.data) {
              this.toastrService.success(this.getMessage("ForecastIsDeletedSuccessfully"))
              await this.getSelectedForecast();
              this.createComputeSalesForecastComponent.setUpForecastSelected(null);
            } else {
              this.toastrService.error(this.getMessage("ForecastDeletionFailed"))
            }
          }
        }
      );
    }
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authService.currentUserValue.UserId;
    this.authService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
           // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (data != null || data != undefined) {
            if (data.length != 0) {
              if (data[0].PermissionType == "Read and Modify") {
                this.btnBar.enableAction('add');
                this.btnBar.enableAction('addRow');
                this.btnBar.enableAction('deleteSelectedForecast');
                this.btnBar.enableAction('duplicateForecast');
                this.btnBar.enableAction('deleteSelectedRow');
                this.btnBar.enableAction('AdjustFinalForecast');
                this.btnBar.enableAction('updateForecast');
                this.btnBar.enableAction('publish');
                this.btnBar.enableAction('lock');
                this.btnBar.enableAction('unlock');
              }
              else {
                this.btnBar.disableAction('add');
                this.btnBar.disableAction('addRow');
                this.btnBar.disableAction('deleteSelectedForecast');
                this.btnBar.disableAction('duplicateForecast');
                this.btnBar.disableAction('deleteSelectedRow');
                this.btnBar.disableAction('AdjustFinalForecast');
                this.btnBar.disableAction('updateForecast');
                this.btnBar.disableAction('publish');
                this.btnBar.disableAction('lock');
                this.btnBar.disableAction('unlock');
                
              }
            }
            else {
              this.router.navigate(['/unauthorized']);
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
      });

  }


}
