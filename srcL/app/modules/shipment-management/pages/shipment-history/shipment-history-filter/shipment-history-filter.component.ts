import { Component, ViewChild, OnInit } from '@angular/core';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { AuthService } from '../../../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { CommonListViewModel, ShipmentworkbenchFilterModel, shipmentworkbenchModel } from '@app/core/models/shipmentworkbench.model';
import { ShipmentHistoryListComponent } from '../shipment-history-list/shipment-history-list.component';

/*import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';*/

/*declare var $: any;*//*

export interface PeriodicElement {
  FilterName: string;
  DefaultFilter: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    FilterName: 'Shipment no',
    DefaultFilter: 'yes'
  }
];*/

@Component({
  selector: 'app-shipment-history-filter',
  templateUrl: './shipment-history-filter.component.html',
  styleUrls: ['./shipment-history-filter.component.css']
})
export class ShipmentHistoryFilterComponent implements OnInit {
  //selectRow: any;
  public dateFormat: String = "MM-dd-yyyy";
  panelOpenState = false;
  shipmentworkbenchFilterModel: ShipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel();
  paginationModel = new shipmentworkbenchModel();
  CustomFilterId: number;
  shipmentTypeList = [];
  shipmentTypeSetting = {};

  shipmentStatusList = [];
  shipmentStatusSetting = {};

  shipmentConditionList = [];
  shipmentConditionSetting = {};

  tenderStatusList = [];
  tenderStatusSetting = {};

  carrierList = [];
  carrierSetting = {};

  clientID: number;
  LocationTypeFromList: any[];
  LocationTypeToList: any[];
  LocationFromList: any[];
  LocationToList: any[];
  LocationTypeSetting = {};
  LocationListSetting = {};
  ShipFromListTemp = [];
  ShipToListTemp = [];
  sendObj: CommonListViewModel = new CommonListViewModel();

  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private shipmentHistoryListComponent: ShipmentHistoryListComponent) { }

  itemListA = [];
  itemListB = [];

  settingsA = {};
  settingsB = {};

  selectedItemsA = [];
  selectedItemsB = [];

  count = 3;


  ngOnInit(): void {
    this.clientID = this.authService.currentUserValue.ClientId;
    this.setupDropDownSettings();
    this.getShipmentTypeList();
    this.getShipmentStatusList();
    this.getShipmentConditionList();
    this.getTenderStatusList();
    this.getCarrierList();
    this.GetLocationTypeFromList();
    this.GetLocationTypeToList();
    this.GetLocationFromList();
    this.GetLocationToList();

    /*this.selectRow = 'selectRow';*/

    // for searchable dropdown
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],
      badgeShowLimit: 3
    };
    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],

      badgeShowLimit: 3
    };
    // searchable dropdown end
  }//init() end


 /* OpenManageCustomFilter() {
    $("#manageFilter").modal('show');    
  }
  CloseManageFilter() {
    $("#manageFilter").modal('hide');
  }
*/
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) {}
  setupDropDownSettings() {
    this.shipmentTypeSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    };
    this.shipmentStatusSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    };
    this.shipmentConditionSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    };
    this.tenderStatusSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    }
    this.carrierSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    }
    this.LocationTypeSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    }
    this.LocationListSetting = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: "name",
      searchBy: ['name']
    }
  }

  getShipmentTypeList() {

    this.shipmentManagementService.OrderTypeList()
      .subscribe(result => {

        if (result && result.data)
          this.shipmentTypeList = result.data;
      });
  }
  getShipmentStatusList() {
    this.shipmentManagementService.shipmentStatusList()
      .subscribe(result => {
        if (result && result.data)
          this.shipmentStatusList = result.data;
      });
  }
  getShipmentConditionList() {
    this.shipmentManagementService.ShipmentConditionList()
      .subscribe(result => {
        if (result && result.data)
          this.shipmentConditionList = result.data;
      });
  }

  getTenderStatusList() {
    this.shipmentManagementService.GetTenderstatusforDD()
      .subscribe(result => {
        if (result && result.data)
          this.tenderStatusList = result.data;
      });
  }
  getCarrierList() {
    this.shipmentManagementService.CarrierList(this.sendObj)
      .subscribe(result => {
        if (result && result.data)
          this.carrierList = result.data;
      });
  }

  OnShipFromTypeSelect(event) {
    var tempArr = [];
    this.LocationFromList = [];
    //To filter ship from location in tha bases of selected ship type value
    for (var i = 0; i < this.shipmentworkbenchFilterModel.locationTypeFromSelected.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.shipmentworkbenchFilterModel.locationTypeFromSelected[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.LocationFromList = [];
    this.LocationFromList = tempArr;
  }
  OnShipFromTypeDeSelect(item: any) {
    var tempArr = [];
    this.LocationFromList = [];
    //To filter ship from location in tha bases of selected ship type value
    for (var i = 0; i < this.shipmentworkbenchFilterModel.locationTypeFromSelected.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.shipmentworkbenchFilterModel.locationTypeFromSelected[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.LocationFromList = [];
    this.LocationFromList = tempArr;
  }
  OnShipFromTypeDeSelectAll(items: any) {
    this.LocationFromList = [];
    this.shipmentworkbenchFilterModel.locationFromSelected = [];
  }
  OnShipFromTypeSelectAll(items: any) {
    var tempArr = [];
    this.LocationFromList = [];
    //To All Select
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == items[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.LocationFromList = [];
    this.LocationFromList = tempArr;
  }

  OnShipToTypeSelect(event) {
    var tempArr = [];
    this.LocationToList = [];
    //To filter ship to location in tha bases of selected ship type value
    for (var i = 0; i < this.shipmentworkbenchFilterModel.locationTypeToSelected.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.shipmentworkbenchFilterModel.locationTypeToSelected[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.LocationToList = [];
    this.LocationToList = tempArr;
  }
  OnShipToTypeDeSelect(item: any) {
    var tempArr = [];
    this.LocationToList = [];
    //To DeSelect
    for (var i = 0; i < this.shipmentworkbenchFilterModel.locationTypeToSelected.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.shipmentworkbenchFilterModel.locationTypeToSelected[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.LocationToList = [];
    this.LocationToList = tempArr;
  }
  OnShipToTypeSelectAll(items: any) {
    var tempArr = [];
    this.LocationToList = [];
    //To All Select
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == items[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.LocationToList = [];
    this.LocationToList = tempArr;
  }
  OnShipToTypeDeSelectAll(items: any) {
    this.LocationToList = [];
    this.shipmentworkbenchFilterModel.locationToSelected = [];
  }


  GetLocationTypeFromList() {

    this.shipmentManagementService.GetLocationTypeFromList(this.clientID)
      .subscribe(res => {

        if (res.message == GlobalConstants.Success) {
          this.LocationTypeFromList = res.data;
        }
      });
  }
  GetLocationTypeToList() {
    this.shipmentManagementService.GetLocationTypeToList(this.clientID)
      .subscribe(res => {
        if (res.message == GlobalConstants.Success) {
          this.LocationTypeToList = res.data;
        }
      });
  }
  GetLocationFromList() {
    this.shipmentManagementService.GetLocationFromList(this.clientID)
      .subscribe(res => {
        if (res.message == GlobalConstants.Success) {
          // this.LocationFromList = res.data;
          this.ShipFromListTemp = res.data;
        }
      });
  }
  GetLocationToList() {
    this.shipmentManagementService.GetLocationToList(this.clientID)
      .subscribe(res => {
        if (res.message == GlobalConstants.Success) {
          // this.LocationToList = res.data;
          this.ShipToListTemp = res.data;
        }
      });
  }


  ApplyGlobalFilter() {
  
    this.shipmentHistoryListComponent.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;
    this.shipmentHistoryListComponent.applyGlobalFilter();

  }

  ResetGlobalFilter() {
    this.shipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel();
      this.shipmentHistoryListComponent.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;
    this.shipmentHistoryListComponent.GetShipmentDetailsHistory("outbound");
  }

 /* displayedColumns = ['selectRow', 'FilterName', 'DefaultFilter'];
 dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    this.shipmentHistoryListComponent.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;
    this.shipmentHistoryListComponent.applyGlobalFilter();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }*/

}
