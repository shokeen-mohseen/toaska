import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Forecast, CommonOrderModel } from '../../../core/models/Forecast.model';
import { AuthService, PreferenceTypeService } from '../../../core';
import { OrderManagementService } from '../../../core/services/order-management.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ForecastService } from '../../../core/services/forecast.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-new-row',
  templateUrl: './add-new-row.component.html',
  styleUrls: ['./add-new-row.component.css']
})
export class AddNewRowComponent implements OnInit {

  modalRef: NgbModalRef;
  // displayedColumns = ['selectRow', 'Location', 'Material', 'col1', 'col2', 'col3'];
  displayedColumns = [];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //masterToggle() {
  //  this.isAllSelected() ?
  //    this.selection.clear() :
  //    this.dataSource.data.forEach(row => this.selection.select(row));
  //}
  isLinear = false;
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  LocationData = [];
  MaterialData: any = [];
  PeriodStartCodes: any = [];
  ForecastNewRows: any = [];
  selectedLocation:any = [];
  selectedMaterial:any = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  Location: any;
  Material: any;
  SelectedForecastID: any;
  constructor(private router: Router, public modalService: NgbModal, public activeModal: NgbActiveModal, private authenticationService: AuthService,
    private orderManagementService: OrderManagementService, private forecastService: ForecastService, private toastrService: ToastrService ) { }

  ngOnInit(): void {
    this.Location = 'Location';
    this.Material = 'Material';
    this.dropdownSettings = {
      singleSelection: true,
      text: "Select Location",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      searchBy: ['name'],
      labelKey: 'name'
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      text: "Select Material",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      searchBy: ['name'],
      labelKey: 'name'
    };
    this.bindDataForShipToType();
  

  }

  editDefinechar() {
    //this.modalRef = this.modalService.open(AddEditDefineCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }
  onItemSelect(item: any) {
    this.BindMaterialList(this.SelectedForecastID, this.selectedLocation[0].id);
  }
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  onItemSelect1(item: any) { }
  OnItemDeSelect1(item: any) {}
  onSelectAll1(items: any) { }
  onDeSelectAll1(items: any) {}

  bindDataForShipToType() {
    this.commonOrderModel.OrderTypeId = 2;
    this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.commonOrderModel.Action = 'shipto';
    this.commonOrderModel.LocationFunctionID = 1;

    this.orderManagementService.ShipToData(this.commonOrderModel)
      .subscribe(result => {
        var datas = result.data;
        this.LocationData = [];
        datas.map(item => {
          return {
            name: item.name + '-' + item.code,
            id: Number(item.id),
            locationTypeCode: item.locationTypeCode
          };
        }).forEach(x => this.LocationData.push(x));
     });
  }

  async BindMaterialList(ForecastId, LocationID) {
    this.MaterialData = [];
    this.PeriodStartCodes = [];
    this.forecastService.getMaterialforNewRows(ForecastId, LocationID)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              this.MaterialData = result.data == undefined ? result.Data : result.data;
         }
        });
    
    this.forecastService.getPeriodStartCodes(15)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.PeriodStartCodes = result.data == undefined ? result.Data : result.data;
            this.displayedColumns.push("Location");
            this.displayedColumns.push("Material");
            this.PeriodStartCodes.forEach(code => {
              this.displayedColumns.push(code.periodStartCode);
            })
          }
        });
  }

  AddRowstoGrid() {
    this.ForecastNewRows = [];
    this.selectedMaterial.forEach(row => {
      let newrow: any = {};
      this.displayedColumns.forEach(column => {
        if (column == "Location") { newrow[column] = this.selectedLocation[0].name; }
        else if (column == "Material") { newrow[column] = row.name }
        else newrow[column] = "0";
      });
      newrow.locationid = this.selectedLocation[0].id;
      newrow.materialid = row.id;
      this.ForecastNewRows.push(newrow);
    });
  }

  SaveForeCastNewRows() {
    if (this.ForecastNewRows != undefined) {
      if (this.ForecastNewRows.length == 0) {
        this.toastrService.error("Please Add Rows");
        return;
      }
      var SaveForecastRows: any = {};
      SaveForecastRows.updateby = this.authenticationService.currentUserValue.LoginId;
      SaveForecastRows.forecastid = 15;
      SaveForecastRows.clientID = this.authenticationService.currentUserValue.ClientId;
      SaveForecastRows.browserDateTime = this.converttoSqlString(new Date());
      var forecastrows: any = [];

      this.ForecastNewRows.forEach(row => {
        for (var key in row) {
          if (key != "Location" && key != "Material" && key != "locationid" && key != "materialid") {
            let newrow: any = {};
            newrow.locationid = row.locationid;
            newrow.materialid = row.materialid;
            newrow.header = key;
            if (newrow.quantity != '') { newrow.quantity = Number(row[key]);}
            else { newrow.quantity == 0;}
            forecastrows.push(newrow);
          }
        }
      });

    SaveForecastRows.forecastrows = forecastrows;
      this.forecastService.SaveForecastNewRows(SaveForecastRows).subscribe(result => {
        debugger;
        console.log(result);
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {

          this.toastrService.info(result.data.message);
          this.ForecastNewRows = [];
          this.MaterialData = [];
          this.PeriodStartCodes = [];
          this.selectedMaterial = [];
          this.selectedLocation = [];
        }
        else {
          this.toastrService.error('Error Occured while saving new rows');
        }
       
      });
  }
}
  converttoSqlString(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var ampm = 'AM';
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");

      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + " " + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }

}

export interface PeriodicElement {
  selectRow: string;
  Location: string;
  Material: string;
  col1: string;
  col2: string;
  col3: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Location: '', Material: '', col1: '', col2: '', col3: '' }

];

