import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ForecastService } from '../../../core/services/forecast.service';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../../core/services/message.service';
import { CreateComputeSalesForecastComponent } from '../create-compute-sales-forecast/create-compute-sales-forecast.component';

@Component({
  selector: 'app-flex',
  templateUrl: './flex.component.html',
  styleUrls: ['./flex.component.css']
})
export class FlexComponent implements OnInit {
  //displayedColumnsReplace = null;
  displayedColumns = ['CalenderPeriodCode', 'Value'];
  displayedColumnsReplace = ['Calender Period Code', 'Value (%)'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  ForecastingforEditFilteredClm: any[] = [];
  filteredColumnList: any = [];
  FlexForecastDS = [];
  DSFirstClm: string;
  LocationId: string;
  MaterialId: string;
  ForecastId: string;
  FlexForecastDSTemp = [];
  userMessages: any = [];
  IsSaveNext: boolean = false;
  CurrentItemIndex: number = 0;
  IsSaveNextDisable: boolean = false;
  filteredColumnArrayFlex = [];
  ApplyToAllInput: number;
  ActiveIdDefault: number;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  forecastComponentInstance: CreateComputeSalesForecastComponent;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isLinear = false;

  constructor(private router: Router, public activeModal: NgbActiveModal
    , public forecastService: ForecastService, private authenticationService: AuthService, private toastrService: ToastrService
    , public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.ActiveIdDefault = 0;
    this.IsSaveNext = false;
    this.CurrentItemIndex = 0;
    this.IsSaveNextDisable = false;
    this.LocationId = null;
    this.MaterialId = null;
    this.ForecastId = null;
    this.DSFirstClm = "CalenderPeriodCode";
    this.bindFlexData();
    this.getMessages();

    if (this.forecastService.ForecastingforEdit.length > 0) {
      this.LocationId = this.forecastService.ForecastingforEdit[0].LocationID
      this.MaterialId = this.forecastService.ForecastingforEdit[0].MaterialId
      this.ForecastId = this.forecastService.ForecastingforEdit[0].ForecastID
    }

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

  bindFlexData() {

    var k = 0;
    for (k = 0; k < this.forecastService.ForecastingforEdit.length; k++) {
      this.forecastService.ForecastingforEdit[k].ActiveId = k;
    }

    if (this.forecastService.ForecastingforEdit.length == 1) {
      //disable next button
      this.IsSaveNextDisable = true;
    }

    this.ForecastingforEditFilteredClm = this.forecastService.ForecastingforEdit;

    //remove extra column from object
    if (this.ForecastingforEditFilteredClm != undefined && this.ForecastingforEditFilteredClm != null) {

      this.filteredColumnArrayFlex = JSON.parse(JSON.stringify(this.ForecastingforEditFilteredClm));
      this.RemoveExtraColumnFromFlexOject();

      //Get filtered column list with only property name
      var filteredColumn = Object.getOwnPropertyNames(this.filteredColumnArrayFlex[0]);
      this.filteredColumnList = filteredColumn;

      this.AddItemsInFlexDS();

    }
  }

  AddItemsInFlexDS() {
    this.FlexForecastDS = [];
    this.FlexForecastDSTemp = [];
    this.filteredColumnList.forEach(column => {
      let newrow: any = {};
      newrow[column] = 0;
      this.FlexForecastDS.push(newrow);
      this.FlexForecastDSTemp.push(newrow);

    });

  }

  BindFlexDetails(item: any = null, index: number = 0) {
    this.CurrentItemIndex = index;
    this.ActiveIdDefault = index;
    this.LocationId = null;
    this.MaterialId = null;
    this.ForecastId = null;
    this.FlexForecastDS = [];
    if (item != undefined && item != null && item != "") {
      this.LocationId = item.LocationID;
      this.MaterialId = item.MaterialId;
      this.ForecastId = item.ForecastID;
      this.FlexForecastDS = this.FlexForecastDSTemp;
      var k = 0;
      for (k = 0; k < this.FlexForecastDS.length; k++) {
        this.FlexForecastDS[k].Value = 0;
      }
    }
  }

  SaveFlex() {

    var headerStr = this.filteredColumnList.toString();
    var valueList = [];
    var rr = 0;
    for (rr = 0; rr < this.FlexForecastDS.length; rr++) {
      valueList.push(this.FlexForecastDS[rr].Value);
      if (valueList[rr] == undefined)
        valueList[rr] = 0;
    }
    var valueStr = valueList.toString();

    //validation if we don't pass percentage value then do nothing
    var i = 0;
    var count = 0;
    for (i = 0; i < valueList.length; i++) {
      if (valueList[i] == 0)
        count = count + 1;
    }
    if (valueList.length == count) {
      this.toastrService.info(this.getMessage("ProvideAtLeastOnePeriodValue"));
      return;
    }

    this.forecastService.SaveFlexForecast(this.ForecastId, this.LocationId, this.MaterialId, headerStr, valueStr)
      .subscribe(
        result => {
          if (result != undefined && result != null && result != "" && result.message == "Success" && result.data == true) {

            this.toastrService.success(this.getMessage("FlexPercentageUpdatedSuccessfully"));
            this.ApplyToAllInput = 0;

            //select next forecast
            if (this.IsSaveNext) {
              this.CurrentItemIndex = this.CurrentItemIndex + 1;
              if (this.forecastService.ForecastingforEdit.length > 0) {
                if ((this.CurrentItemIndex == this.forecastService.ForecastingforEdit.length - 1)) {
                  //disable next button
                  this.IsSaveNextDisable = true;
                  var nextItemObject = this.forecastService.ForecastingforEdit[this.CurrentItemIndex];
                  this.BindFlexDetails(nextItemObject, this.CurrentItemIndex);
                }
                else {
                  this.IsSaveNextDisable = false;
                  var nextItemObject = this.forecastService.ForecastingforEdit[this.CurrentItemIndex];
                  this.BindFlexDetails(nextItemObject, this.CurrentItemIndex);
                }
              }
            }
            if (!this.IsSaveNext) {
              //reset percentage value
              var k = 0;
              for (k = 0; k < this.FlexForecastDS.length; k++) {
                this.FlexForecastDS[k].Value = 0;
              }
            }
            this.IsSaveNext = false;

          }
        });

  }

  SaveNextFlex() {
    this.IsSaveNext = true;
    this.SaveFlex();
  }

  ClosePopup() {
    this.activeModal.dismiss('Cross click');
    //To refresh forecast grid
    if (this.forecastComponentInstance != null && this.forecastComponentInstance != undefined)
      this.forecastComponentInstance.getForecastDetail();
  }

  FlexApplyToAll() {
    var rr = 0;
    for (rr = 0; rr < this.FlexForecastDS.length; rr++) {
      this.FlexForecastDS[rr].Value = this.ApplyToAllInput;
    }
  }

  RemoveExtraColumnFromFlexOject() {
    var k = 0;
    for (k = 0; k < this.filteredColumnArrayFlex.length; k++) {
      if (this.filteredColumnArrayFlex[k].MasCustomerCode != undefined)
        delete this.filteredColumnArrayFlex[k].MasCustomerCode;
      if (this.filteredColumnArrayFlex[k].MaterialId != undefined)
        delete this.filteredColumnArrayFlex[k].MaterialId;
      if (this.filteredColumnArrayFlex[k].SalesManagerID != undefined)
        delete this.filteredColumnArrayFlex[k].SalesManagerID;
      if (this.filteredColumnArrayFlex[k].SalesManagername != undefined)
        delete this.filteredColumnArrayFlex[k].SalesManagername;
      if (this.filteredColumnArrayFlex[k].Status != undefined)
        delete this.filteredColumnArrayFlex[k].Status;
      if (this.filteredColumnArrayFlex[k].Total != undefined)
        delete this.filteredColumnArrayFlex[k].Total;
      if (this.filteredColumnArrayFlex[k].UpdateDateTimeServer != undefined)
        delete this.filteredColumnArrayFlex[k].UpdateDateTimeServer;
      if (this.filteredColumnArrayFlex[k].hovered != undefined)
        delete this.filteredColumnArrayFlex[k].hovered;
      if (this.filteredColumnArrayFlex[k].isSelected != undefined)
        delete this.filteredColumnArrayFlex[k].isSelected;
      if (this.filteredColumnArrayFlex[k].BillingEntityName != undefined)
        delete this.filteredColumnArrayFlex[k].BillingEntityName;
      if (this.filteredColumnArrayFlex[k].CommodityName != undefined)
        delete this.filteredColumnArrayFlex[k].CommodityName;
      if (this.filteredColumnArrayFlex[k].DataSegment != undefined)
        delete this.filteredColumnArrayFlex[k].DataSegment;
      if (this.filteredColumnArrayFlex[k].EnterpriseName != undefined)
        delete this.filteredColumnArrayFlex[k].EnterpriseName;
      if (this.filteredColumnArrayFlex[k].ForecastID != undefined)
        delete this.filteredColumnArrayFlex[k].ForecastID;
      if (this.filteredColumnArrayFlex[k].GroupName != undefined)
        delete this.filteredColumnArrayFlex[k].GroupName;
      if (this.filteredColumnArrayFlex[k].ID != undefined)
        delete this.filteredColumnArrayFlex[k].ID;
      if (this.filteredColumnArrayFlex[k].LocationID != undefined)
        delete this.filteredColumnArrayFlex[k].LocationID;
      if (this.filteredColumnArrayFlex[k].MasLocationAddressCode != undefined)
        delete this.filteredColumnArrayFlex[k].MasLocationAddressCode;
      if (this.filteredColumnArrayFlex[k].MaterialDescription != undefined)
        delete this.filteredColumnArrayFlex[k].MaterialDescription;
      if (this.filteredColumnArrayFlex[k].ShipToLocation != undefined)
        delete this.filteredColumnArrayFlex[k].ShipToLocation;
      if (this.filteredColumnArrayFlex[k].ForecastName != undefined)
        delete this.filteredColumnArrayFlex[k].ForecastName;
      if (this.filteredColumnArrayFlex[k].LocationType != undefined)
        delete this.filteredColumnArrayFlex[k].LocationType;
      if (this.filteredColumnArrayFlex[k].ActiveId != undefined)
        delete this.filteredColumnArrayFlex[k].ActiveId;
      if (this.filteredColumnArrayFlex[k].IsLocked != undefined)
        delete this.filteredColumnArrayFlex[k].IsLocked;
      if (this.filteredColumnArrayFlex[k].IsPublished != undefined)
        delete this.filteredColumnArrayFlex[k].IsPublished;
    }
  }
}

export interface PeriodicElement {
  cpc: string;
  Value: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { cpc: '202001', Value: '' },
  { cpc: '202002', Value: '' },
  { cpc: '202003', Value: '' },
  { cpc: '202004', Value: '' },
  { cpc: '202005', Value: '' },
  { cpc: '202006', Value: '' },
  { cpc: '202007', Value: '' }

];
