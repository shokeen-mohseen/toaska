import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ForecastService } from '../../../core/services/forecast.service';

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


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private router: Router, public activeModal: NgbActiveModal, public forecastService: ForecastService) { }

  ngOnInit(): void {
    this.oct = 'oct';
    this.nov = 'nov';
    this.dec = 'dec';
    this.LocationCode = "MasLocationAddressCode";
    this.Location = "ShipToLocation";
    this.Material = "MaterialDescription";
    this.bindDetails();
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
    debugger;
    this.displayedColumns = null;
    this.displayedColumnsReplace = null;


    //var removeItem = ['BillingEntityName', 'CommodityName', 'DataSegment', 'EnterpriseName', 'ForecastID'
    //  , 'GroupName', 'ID', 'LocationID', 'MasCustomerCode', 'MaterialId'
    //  , 'SalesManagerID', 'SalesManagername', 'Status', 'Total', 'UpdateDateTimeServer'
    //  , 'hovered', 'isSelected', 'MasLocationAddressCode', 'MaterialDescription', 'ShipToLocation'];

    this.ForecastingforEditFilteredClm = this.forecastService.ForecastingforEdit;
    //remove extra column from object
    if (this.ForecastingforEditFilteredClm != undefined && this.ForecastingforEditFilteredClm != null) {
      var filteredColumnList = JSON.parse(JSON.stringify(this.ForecastingforEditFilteredClm));
      var k = 0;
      for (k = 0; k < filteredColumnList.length; k++) {
        delete filteredColumnList[k].MasCustomerCode;
        delete filteredColumnList[k].MaterialId;
        delete filteredColumnList[k].SalesManagerID;
        delete filteredColumnList[k].SalesManagername;
        delete filteredColumnList[k].Status;
        delete filteredColumnList[k].Total;
        delete filteredColumnList[k].UpdateDateTimeServer;
        delete filteredColumnList[k].hovered;
        delete filteredColumnList[k].isSelected;
        delete filteredColumnList[k].BillingEntityName;
        delete filteredColumnList[k].CommodityName;
        delete filteredColumnList[k].DataSegment;
        delete filteredColumnList[k].EnterpriseName;
        delete filteredColumnList[k].ForecastID;
        delete filteredColumnList[k].GroupName;
        delete filteredColumnList[k].ID;
        delete filteredColumnList[k].LocationID;
        delete filteredColumnList[k].MasLocationAddressCode;
        delete filteredColumnList[k].MaterialDescription;
        delete filteredColumnList[k].ShipToLocation;
      }
      //Get filtered column list with only property name
      var filteredColumn = Object.getOwnPropertyNames(filteredColumnList[0]);
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

      //this.dataSource.data = this.forecastService.ForecastingforEdit;
      this.AddItemsInDS();


      //this.ELEMENT_DATA = [];
      //this.forecastService.ForecastingforEdit.forEach((value, index) => {
      //  this.ELEMENT_DATA.push({
      //    MasLocationAddressCode: value.MasLocationAddressCode,
      //    ShipToLocation: value.ShipToLocation,
      //    MaterialDescription: value.MaterialDescription,
      //    ID: value.ID,
      //    ForecastID: value.ForecastID
      //  })
      //})
      //this.dataSource = new MatTableDataSource<PeriodicElement>();
      //this.dataSource.data = this.ELEMENT_DATA;
    }
  }
  UpdateAdjustedForecast() {
    debugger;
    var ddd = this.dataSource.data;
    var ppp = this.forecastService.ForecastingforEdit;
    var dds = this.AdjustedForecastDS;

    //var SaveForecastRows: any = {};
    //SaveForecastRows.updateby = this.authenticationService.currentUserValue.LoginId;
    //SaveForecastRows.forecastid = 15;
    //SaveForecastRows.clientID = this.authenticationService.currentUserValue.ClientId;
    //var forecastrows: any = [];
    //this.AdjustedForecastds.forEach(row => {
    //  forecastrows.push(row);
    //});
    //SaveForecastRows.forecastrows = forecastrows;
    this.forecastService.UpdateAdjustFinalForecast(this.AdjustedForecastDS)
      .subscribe(
        result => {
        });
  }

  AddItemsInDS() {
    debugger;
    this.AdjustedForecastDS = [];
    this.forecastService.ForecastingforEdit.forEach(row => {
      let newrow: any = {};
      this.displayedColumns.forEach(column => {
        if (column == "MasLocationAddressCode") { newrow[column] = row.MasLocationAddressCode; }
        else if (column == "MaterialDescription") { newrow[column] = row.MaterialDescription }
        else if (column == "ShipToLocation") { newrow[column] = row.ShipToLocation }
        else newrow[column] = 0;
      });
      newrow.ForecastID = row.ForecastID;
      newrow.LocationID = row.LocationID;
      newrow.MaterialId = row.MaterialId;
      this.AdjustedForecastDS.push(newrow);
    });
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


