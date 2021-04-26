import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges } from '@angular/core';
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
export class MapForecastComponent implements OnInit, AfterViewInit, OnChanges {
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
  Inactive: boolean;
  filterValue: string = "";

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.GetMapForecastCustomerLocation();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.GetMapForecastCustomerLocation();
    }

  }

  customSort(event) {
    if (event.active != 'selectRow') {
      if (event.active === 'MASCustomerAddressCode') {
        event.active = 'PropertyValue';
      }
      if (event.active === 'Name') {
        event.active = 'LocationName';
      }
      
      this.mapForecastCustomerLocationModel.sortColumn = event.active;
      this.mapForecastCustomerLocationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.GetMapForecastCustomerLocation();
    }
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.mapForecastCustomerLocationModel.pageNo = event.pageIndex + 1;
    this.mapForecastCustomerLocationModel.pageSize = event.pageSize;
    this.GetMapForecastCustomerLocation();
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
    this.Inactive = this.materialService.permission == false ? true : false;
    //this.GetMapForecastCustomerLocation();
    this.getCustomerLocationDDList();
    this.dataSource = new MatTableDataSource<MapForecastCustomerLocationModel>();
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      enableCheckAll: false,
      badgeShowLimit: 1,
      labelKey: "dropDownValue",
      searchBy: ['dropDownValue'],
      noDataLabel: "No Data Available"
    };
  }

  onItemSelect(item: any) {
    this.mapForeCastItem;
    //this.selectedEquipmentTypeString = Array.prototype.map.call(this.selectedEquipmentType, function (item) { return item.id; }).join(",");
  }

  async ngOnChanges() {
    this.mapForecastCustomerLocationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.sendDataToChild;
    this.mapForecastCustomerLocationModel.materialID = this.sendMatIDToChild;
    await this.getPageSize();
    this.GetMapForecastCustomerLocation();
    this.mapForeCastItem = [];
  }

  async getPageSize() {
    await this.materialService.totalCount(this.mapForecastCustomerLocationModel)
      .toPromise().then(result => {
        this.mapForecastCustomerLocationModel.itemsLength = result.data;
      });
    // default page size
    this.mapForecastCustomerLocationModel.pageSize = await this.materialService.getDefaultPageSize();
    this.mapForecastCustomerLocationModel.pageSizeOptions.push(this.mapForecastCustomerLocationModel.pageSize);
  }

  GetMapForecastCustomerLocation() {
    this.selection.clear();
    this.mapForecastCustomerLocationModel.filterOn = this.filterValue;
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
    this.materialService.saveMapForecastCustomerLocation(this.mapforeCastSavemodelDS).subscribe(async result => {
      this.mapforeCastSavemodelDS = [];
      this.getCustomerLocationDDList();
      if (result.recordCount != 0) {
        this.toastrService.success("Records saved successfully.");
        this.mapForeCastItem = [];
      }
      else {
        this.toastrService.warning("Location mapping already exists.");
      }
      await this.getPageSize();
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
    this.mapForeCastItem = [];
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
      this.materialService.removeLocationToMaterial(this.selection.selected).subscribe(async result => {
        if (result.message == "Success" || result.Message == "Success") {
          await this.getPageSize();
          this.GetMapForecastCustomerLocation();
          this.toastrService.success("The records are deleted successfully");
        }
        else {
          this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
        }
      });
    }, (reason) => {
    });
  }
}
