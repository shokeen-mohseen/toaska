import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-forecasting',
  templateUrl: './forecasting.component.html',
  styleUrls: ['./forecasting.component.css']
})
export class ForecastingComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  modalRef: NgbModalRef;
  itemList = [];
  selectedItems = [];
  settings = {};
  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  count = 6;
 
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  filter: boolean = false;
  IsTosca: boolean;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  constructor(private router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };
    this.itemListB = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      //addNewItemOnFilter: true,
      //disabled: true
    };
  }
  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.showAction('addRow');
    this.btnBar.showAction('deleteSelectedForecast');
    this.btnBar.showAction('duplicateForecast');
    this.btnBar.showAction('deleteSelectedRow');
    this.btnBar.showAction('calculate');
    this.btnBar.showAction('flex');
    this.btnBar.showAction('AdjustFinalForecast');
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
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
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
    if (type === "add") {
      this.modalRef = this.modalService.open(AddnewForecastComponent, { size: 'lg', backdrop: 'static' });
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
    }
    else if (type === "ManageMarketForecastImport") {
      this.modalRef = this.modalService.open(ManageMarketForecastImportComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "importLocationmaterial") {
      this.modalRef = this.modalService.open(ManageLocationMaterialMappingComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "AdjustFinalForecast") {
      this.modalRef = this.modalService.open(AdjustFinalForecastComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "viewForecastAs") {
      this.modalRef = this.modalService.open(ViewForecastAsComponent, { size: 'xl', backdrop: 'static' });
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

}
