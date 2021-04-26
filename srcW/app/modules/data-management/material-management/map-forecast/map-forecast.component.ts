import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MapForecastCustomerLocationModel, CustomerLocationDDModel, MapForecastCustomerLocationEditModel } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService, User } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-map-forecast',
  templateUrl: './map-forecast.component.html',
  styleUrls: ['./map-forecast.component.css']
})
export class MapForecastComponent implements OnInit {
  mapForecastCustomerLocationModel = new MapForecastCustomerLocationModel();
  customerLocationDDModel = new CustomerLocationDDModel();
  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'MASCustomerAddressCode', 'Name'];
  dataSource;//= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MapForecastCustomerLocationModel>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  mapforeCastSavemodel: MapForecastCustomerLocationEditModel = new MapForecastCustomerLocationEditModel();
  mapforeCastSavemodelDS: MapForecastCustomerLocationEditModel[] = [];
  @Input() sendDataToChild: string;
  @Input() sendMatIDToChild: number;
  currentUser: User;
  mapAddnewRow: boolean;
  addDeleteBtn: boolean = true;
  settings = {};
  mapForeCastList = [];
  mapForeCastItem = [];
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

  constructor(private router: Router,
    public modalService: NgbModal,
    private materialService: MaterialService, private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    this.customerLocationDDModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.mapForecastCustomerLocationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    //this.GetMapForecastCustomerLocation();
    this.getCustomerLocationDDList();
    this.dataSource = new MatTableDataSource<MapForecastCustomerLocationModel>();
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      labelKey: "dropDownValue",
      noDataLabel: "No Data Available"
    };
  }

  onItemSelect(item: any) {
    debugger
    this.mapForeCastItem;
    //this.selectedEquipmentTypeString = Array.prototype.map.call(this.selectedEquipmentType, function (item) { return item.id; }).join(",");
  }

  ngOnChanges() {
    debugger
    this.mapForecastCustomerLocationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.sendDataToChild;
    this.mapForecastCustomerLocationModel.materialID = this.sendMatIDToChild;
    this.GetMapForecastCustomerLocation();
    console.log("CHANGES")
  }

  GetMapForecastCustomerLocation() {
    this.selection.clear();
    this.materialService.GetMapForecastCustomerLocation(this.mapForecastCustomerLocationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
      });
  }


  getCustomerLocationDDList() {
    this.materialService.GetCustomerLocationDDList(this.customerLocationDDModel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        this.mapForeCastList = result.data;        
      }
    });
  }

  saveMapForecast() {
    this.mapForeCastItem.forEach(item => {
      this.setDataModel(item);
    });
    this.materialService.saveMapForecastCustomerLocation(this.mapforeCastSavemodelDS).subscribe(result => {      
      this.mapforeCastSavemodelDS = [];
      this.getCustomerLocationDDList();
      if (result.recordCount != 0) {
        this.toastrService.success("saved successfully.");       
      }
      else {
        this.toastrService.warning("Location Mapping already exists.");
      }
      this.GetMapForecastCustomerLocation();
    });
  }

  setDataModel(editmodel) {
    this.mapforeCastSavemodel = {
      MaterialID: this.sendMatIDToChild,
      LocationID: editmodel.locationID,
      EntityPropertyID: editmodel.entityPropertyID,      
      PropertyValue: editmodel.propertyValue,
      PropertiesUOM: editmodel.propertiesUOM,
      IsDeleted: editmodel.isDeleted,
      ClientID: this.currentUser.ClientId,
      SourceSystemID: this.currentUser.SourceSystemID,
      UpdatedBy: this.currentUser.LoginId,
      CreateDateTimeServer: new Date(),
      CreateDateTimeBrowser: new Date(),
      CreatedBy: this.currentUser.LoginId,
      UpdateDateTimeBrowser: new Date(),
      UpdateDateTimeServer: new Date()
    } as MapForecastCustomerLocationEditModel;
    this.mapforeCastSavemodelDS.push(this.mapforeCastSavemodel);
  }

  clickToAddNewMapRow() {
    this.mapAddnewRow = true;
    this.addDeleteBtn = false;
  }

  cancel() {
    this.mapAddnewRow = false;
    this.addDeleteBtn = true;
  }

  removeLocationToMaterial() {
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.materialService.removeLocationToMaterial(this.selection.selected).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.GetMapForecastCustomerLocation();
          this.toastrService.success("Record(s) Deleted successfully.");
        }
        else {
          this.toastrService.warning("Something went wrong.");
        }
      });
    }, (reason) => {
    });
  }
}
