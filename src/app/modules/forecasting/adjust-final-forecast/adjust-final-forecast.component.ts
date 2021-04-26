import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ForecastService } from '../../../core/services/forecast.service';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { CreateComputeSalesForecastComponent } from '../create-compute-sales-forecast/create-compute-sales-forecast.component';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-adjust-final-forecast',
  templateUrl: './adjust-final-forecast.component.html',
  styleUrls: ['./adjust-final-forecast.component.css']
})
export class AdjustFinalForecastComponent implements OnInit {
  dynamicHeaderStr: string;
  oct: any;
  nov: any;
  dec: any;
  LocationCode: string;
  Location: string;
  Material: string;
  selectedForecastIds = []
  //displayedColumns = ['lc', 'location', 'Material', 'oct', 'nov', 'dec'];
  //displayedColumnsReplace = ['key_LocationCode', 'key_Location', 'key_Material', 'key_Oct20', 'key_Nov20', 'key_Dec20'];
  displayedColumns = null;// ['MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription', this.dynamicHeaderStr];
  displayedColumnsReplace = null;// ['Location Code', 'Location', 'Material', this.dynamicHeaderStr];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  //ELEMENT_DATA: PeriodicElement[] = [];
  ELEMENT_DATA: any[] = [];
  ForecastingforEditFilteredClm: any[] = [];
  filteredColumnList: any = [];
  AdjustedForecastDS = [];
  userMessages: any = [];
  filteredColumnArray = [];


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

  constructor(private router: Router, public activeModal: NgbActiveModal, public forecastService: ForecastService,
    private authenticationService: AuthService, private toastrService: ToastrService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.oct = 'oct';
    this.nov = 'nov';
    this.dec = 'dec';
    this.LocationCode = "MasLocationAddressCode";
    this.Location = "ShipToLocation";
    this.Material = "MaterialDescription";
    this.bindDetails();
    this.getMessages();
  }
  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }

  bindDetails() {
 
    this.displayedColumns = null;
    this.displayedColumnsReplace = null;

    this.ForecastingforEditFilteredClm = this.forecastService.ForecastingforEdit;

    //remove extra column from object
    if (this.ForecastingforEditFilteredClm != undefined && this.ForecastingforEditFilteredClm != null) {

      this.filteredColumnArray = JSON.parse(JSON.stringify(this.ForecastingforEditFilteredClm));
      this.RemoveExtraColumnFromOject();

      //Get filtered column list with only property name
      var filteredColumn = Object.getOwnPropertyNames(this.filteredColumnArray[0]);
      this.filteredColumnList = filteredColumn;

      this.displayedColumns = ['MasLocationAddressCode', 'ShipToLocation', 'MaterialDescription'];
      this.displayedColumnsReplace = ['Location Code', 'Location', 'Material'];

      //push filtered column(dynamic column) on displayedColumns object
      var rr = 0;
      for (rr = 0; rr < filteredColumn.length; rr++) {
        this.displayedColumns.push(filteredColumn[rr]);
      }
      //push filtered column(dynamic column) on displayedColumnsReplace object
      var s = 0;
      for (s = 0; s < filteredColumn.length; s++) {
        this.displayedColumnsReplace.push(filteredColumn[s]);
      }

      this.AddItemsInDS();

    }
  }
  UpdateAdjustedForecast() {

    //Make header section for modal
    var headerProperty = "";
    if (this.filteredColumnList.length > 0)
      headerProperty = Object.values(this.filteredColumnList).join(",");

    //Make quantity section of dynamic column for modal
    if (this.AdjustedForecastDS.length > 0) {

      var quantityList = JSON.parse(JSON.stringify(this.AdjustedForecastDS));

      var rr = 0;
      for (rr = 0; rr < quantityList.length; rr++) {
        if (quantityList[rr].ForecastID != undefined)
          delete quantityList[rr].ForecastID;
        if (quantityList[rr].LocationID != undefined)
          delete quantityList[rr].LocationID;
        if (quantityList[rr].MaterialId != undefined)
          delete quantityList[rr].MaterialId;
        if (quantityList[rr].MaterialDescription != undefined)
          delete quantityList[rr].MaterialDescription;
        if (quantityList[rr].ShipToLocation != undefined)
          delete quantityList[rr].ShipToLocation;
        if (quantityList[rr].MasLocationAddressCode != undefined)
          delete quantityList[rr].MasLocationAddressCode;
      }

      var quantityPropertyValue = [];
      var i = 0;
      for (i = 0; i < quantityList.length; i++) {
        var quantityValues = Object.values(quantityList[i]).join(",");
        quantityPropertyValue.push(quantityValues);
      }
    }

    //make final modal
    var FinalobjectModal = [];
    var Adjustforecastrow: any = {};
    var r = 0;
    for (r = 0; r < this.AdjustedForecastDS.length; r++) {

      Adjustforecastrow.RowID = r + 1;
      Adjustforecastrow.ForecastID = this.AdjustedForecastDS[r].ForecastID;
      Adjustforecastrow.LocationID = this.AdjustedForecastDS[r].LocationID;
      Adjustforecastrow.MaterialId = this.AdjustedForecastDS[r].MaterialId;
      Adjustforecastrow.MaterialDescription = this.AdjustedForecastDS[r].MaterialDescription;
      Adjustforecastrow.ShipToLocation = this.AdjustedForecastDS[r].ShipToLocation;
      Adjustforecastrow.MasLocationAddressCode = this.AdjustedForecastDS[r].MasLocationAddressCode;
      Adjustforecastrow.Header = headerProperty;
      Adjustforecastrow.Quantity = quantityPropertyValue[r];
      Adjustforecastrow.ClientID = this.authenticationService.currentUserValue.ClientId;
      FinalobjectModal.push(Adjustforecastrow);
      Adjustforecastrow = {};
    }
    this.forecastService.UpdateAdjustFinalForecast(FinalobjectModal)
      .subscribe(
        result => {
          if (result != undefined && result != null && result != "" && result.message == "Success" && result.data == true) {
            this.forecastService.ForecastingforEdit = [];
            this.toastrService.success(this.getMessage("ForecastUpdated"));
            this.activeModal.dismiss('Cross click');

            //To refresh forecast grid
            if (this.forecastComponentInstance != null && this.forecastComponentInstance != undefined)
              this.forecastComponentInstance.getForecastDetail();
          }
        });
  }

  AddItemsInDS() {
    this.AdjustedForecastDS = [];
    this.forecastService.ForecastingforEdit.forEach(row => {
      let newrow: any = {};
      this.displayedColumns.forEach(column => {
        if (column == "MasLocationAddressCode") { newrow[column] = row.MasLocationAddressCode; }
        else if (column == "MaterialDescription") { newrow[column] = row.MaterialDescription }
        else if (column == "ShipToLocation") { newrow[column] = row.ShipToLocation }
        else newrow[column] = 0;

        //bind values of dynamic fields
        {
          Object.getOwnPropertyNames(row).forEach(
            function (val, idx, array) {
              if (column == val) {
                newrow[column] = row[val];
                if (newrow[column] == null || newrow[column] == "" || newrow[column] == "0.0000")
                  newrow[column] = 0;
              }
            }

          );
        }

        //else if (column == row[column])
        //  newrow[column] = row[column];
      });
      newrow.ForecastID = row.ForecastID;
      newrow.LocationID = row.LocationID;
      newrow.MaterialId = row.MaterialId;
      this.AdjustedForecastDS.push(newrow);
    });
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

  RemoveExtraColumnFromOject() {
    var k = 0;
    for (k = 0; k < this.filteredColumnArray.length; k++) {
      if (this.filteredColumnArray[k].MasCustomerCode != undefined)
        delete this.filteredColumnArray[k].MasCustomerCode;
      if (this.filteredColumnArray[k].MaterialId != undefined)
        delete this.filteredColumnArray[k].MaterialId;
      if (this.filteredColumnArray[k].SalesManagerID != undefined)
        delete this.filteredColumnArray[k].SalesManagerID;
      if (this.filteredColumnArray[k].SalesManagername != undefined)
        delete this.filteredColumnArray[k].SalesManagername;
      if (this.filteredColumnArray[k].Status != undefined)
        delete this.filteredColumnArray[k].Status;
      if (this.filteredColumnArray[k].Total != undefined)
        delete this.filteredColumnArray[k].Total;
      if (this.filteredColumnArray[k].UpdateDateTimeServer != undefined)
        delete this.filteredColumnArray[k].UpdateDateTimeServer;
      if (this.filteredColumnArray[k].hovered != undefined)
        delete this.filteredColumnArray[k].hovered;
      if (this.filteredColumnArray[k].isSelected != undefined)
        delete this.filteredColumnArray[k].isSelected;
      if (this.filteredColumnArray[k].BillingEntityName != undefined)
        delete this.filteredColumnArray[k].BillingEntityName;
      if (this.filteredColumnArray[k].CommodityName != undefined)
        delete this.filteredColumnArray[k].CommodityName;
      if (this.filteredColumnArray[k].DataSegment != undefined)
        delete this.filteredColumnArray[k].DataSegment;
      if (this.filteredColumnArray[k].EnterpriseName != undefined)
        delete this.filteredColumnArray[k].EnterpriseName;
      if (this.filteredColumnArray[k].ForecastID != undefined)
        delete this.filteredColumnArray[k].ForecastID;
      if (this.filteredColumnArray[k].GroupName != undefined)
        delete this.filteredColumnArray[k].GroupName;
      if (this.filteredColumnArray[k].ID != undefined)
        delete this.filteredColumnArray[k].ID;
      if (this.filteredColumnArray[k].LocationID != undefined)
        delete this.filteredColumnArray[k].LocationID;
      if (this.filteredColumnArray[k].MasLocationAddressCode != undefined)
        delete this.filteredColumnArray[k].MasLocationAddressCode;
      if (this.filteredColumnArray[k].MaterialDescription != undefined)
        delete this.filteredColumnArray[k].MaterialDescription;
      if (this.filteredColumnArray[k].ShipToLocation != undefined)
        delete this.filteredColumnArray[k].ShipToLocation;
      if (this.filteredColumnArray[k].ForecastName != undefined)
        delete this.filteredColumnArray[k].ForecastName;
      if (this.filteredColumnArray[k].LocationType != undefined)
        delete this.filteredColumnArray[k].LocationType;
      if (this.filteredColumnArray[k].IsLocked != undefined)
        delete this.filteredColumnArray[k].IsLocked;
      if (this.filteredColumnArray[k].IsPublished != undefined)
        delete this.filteredColumnArray[k].IsPublished;
    }
  }
}
export interface PeriodicElement {
  //SalesManager: string;
  //Quantity: string;
  //Group: string;
  //MasCustomerCode: string;
  //BillingEntityName: string;
  MasLocationAddressCode: string;
  ShipToLocation: string;
  MaterialDescription: string;
  //CommodityName: string;
  //DataSegment: string;

  //Old
  //lc: string;
  //location: string;
  //Material: string;
  //oct: string;
  //nov: string;
  //dec: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  // { lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
  //{ lc: 'Loc202001', location: 'india', Material: 'eggs', oct: '', nov: '', dec: '' },
]


