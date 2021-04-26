import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { CommonListViewModel, ShipmentworkbenchFilterModel, shipmentworkbenchModel } from '@app/core/models/shipmentworkbench.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { projectkey } from '../../../../../environments/projectkey';
import { AuthService } from '../../../../core';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { TableFilterComponent } from '../../../../shared/components/table-filter/table-filter.component';
import { ToastrService } from 'ngx-toastr';
export interface PeriodicElement {
  ShipDate: string;
  ReqDeliveryDate: string;
  MustArriveByDate: string;
  PickupAppointment: string;
  DeliveryAppointment: string;
  ActDeliveryDate: string;
  ShipmentNo: number;
  ShipmentType: string;
  ShipFrom: string;
  ShipTo: string;
  ShipWith: string;
  Carrier: string;
  OrderQuantity: number;
  PlanToShipQuantity: number;
  ShippedQuantity: number;
  TenderStatus: string;
  ShipmentStatus: string;
  ShipmentCondition: string;
  OrderNo: number;
  PON: number;
}
declare var $: any;
const ELEMENT_DATA: PeriodicElement[] = [

];
export interface PeriodicElementManageFilter {
  Id: number;
  FilterName: string;
  DefaultFilter: string;
  FilterExpression: string;
  isEdited: boolean;
}

export interface PeriodicElement1 {
  ShipDate: string;
  ReqDeliveryDate: string;
  MustArriveByDate: string;
  PickupAppointment: string;
  DeliveryAppointment: string;
  ActDeliveryDate: string;
  ShipmentNo: number;
  ShipmentType: string;
  ShipFrom: string;
  ShipTo: string;
  ShipWith: string;
  Carrier: string;
  OrderQuantity: number;
  PlanToShipQuantity: number;
  ShippedQuantity: number;
  TenderStatus: string;
  ShipmentStatus: string;
  ShipmentCondition: string;
  OrderNo: number;
  PON: number;
}
const ELEMENT_DATA1: PeriodicElement1[] = [];

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.css']
})
export class WorkbenchComponent implements OnInit {
  selectedShipmentId: number;
  public dateFormat: String = "MM-dd-yyyy";
  orderNumber: any;
  shipmentWorkbenchHasReadOnlyAccess: boolean = false;
  ShipFromListTemp = [];
  ShipToListTemp = [];

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService, private toastrService: ToastrService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, public modalService: NgbModal
  ) {

    //this.activatedRoute.queryParams.subscribe((params: Params) => {
    //  this.selectedShipmentId = Number(params.ShipmentId);
    //});

    //if (this.selectedShipmentId != 0 && !isNaN(this.selectedShipmentId) && this.selectedShipmentId != undefined && this.selectedShipmentId != null) {
    //  //load all data
    //  this.ngOnInit();
    //}
    this.buttonPermission();
    if (localStorage.SelectedShipmentId != undefined && localStorage.SelectedShipmentId != null) {
      this.selectedShipmentId = parseInt(localStorage.SelectedShipmentId);
    }
    //this.SelectedTab = localStorage.SelectedTab;
    //this.tabClick(this.SelectedTab);
    if (this.selectedShipmentId != 0 && !isNaN(this.selectedShipmentId) && this.selectedShipmentId != undefined && this.selectedShipmentId != null && (localStorage.SelectedTab != undefined && localStorage.SelectedTab != null)) {

      this.SelectedTab = localStorage.SelectedTab;
    }
    this.getPageControlsPermissions();

  }

  clientID: number;
  LocationTypeFromList: any[];
  LocationTypeToList: any[];
  LocationFromList: any[];
  LocationToList: any[];
  LocationTypeSetting = {};
  LocationListSetting = {};

  SelectTab: string;
  ShipmentDetails: any = {};
  SDInbound: any = [];
  SDOutbound: any = [];
  ShipmentDetails1: any = {};
  selectedshipsments: any = {};
  itemListA = [];
  itemListB = [];

  settingsA = {};
  settingsB = {};

  selectedItemsA = [];
  selectedItemsB = [];
  SelectedTab: string;
  isPaggingClick: boolean = false;
  count = 3;

  editingShipment: any;
  selectRow: any;
  shipmentworkbenchFilterModel: ShipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel();
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
  orderQuantity: any;
  totalShipmentQuantity: any;
  sendObj: CommonListViewModel = new CommonListViewModel();

  //manage custom filter
  FilterName: string;
  DefaultFilter: boolean = false;
  isEditMode = false;
  //selectedCustomFilterMethodMapping: PeriodicElementManageFilter;
  FilterNameEdit: string;
  DefaultFilterEdit: boolean = false;
  IsEditDelete: boolean = true;
  IsSaveCancel: boolean = false;
  CustomFilterId: number;
  // modalRef: NgbModalRef;
  //activeTab = 'outbound';
  activeTab = 'outbound';
  isCustomer: boolean;
  isStockCollection: boolean;
  ManageFilterdSShipment;
  ManageFilter_ELEMENT_DATA: PeriodicElementManageFilter[] = [];
  CustomFilterItemList = [];
  SDManageFilter: any = [];
  selectedCustomFilterMethodMapping: PeriodicElementManageFilter;
  modalRef: NgbModalRef;
  @Output()
  EdittedShipmentNumber: EventEmitter<any> = new EventEmitter<any>();
  ControlPermissions: any = [];
  isEditByLink: boolean = false;
  MaxEditedRecordsCountPreferences: number;
  SelectedsalesOrderCount: number;

  async ngOnInit() {
    this.orderNumber = 'orderNumber';
    this.orderQuantity = 'orderQuantity'
    this.totalShipmentQuantity = 'totalShipmentQuantity';

    ////this.isCustomer = true;
    ////this.isStockCollection = true;
    this.isCustomer = false;
    this.isStockCollection = false;

    this.clientID = this.authService.currentUserValue.ClientId;
    this.selectRow = 'selectRow';
    this.paginationModel.sortOrder = "DESC";


    //if (!!this.shipmentManagementService.SelectTab) {
    //  this.SelectedTab = this.shipmentManagementService.SelectTab;
    //  this.paginationModel.sortOrder = "DESC";
    //  if (this.shipmentManagementService.SelectTab.toLowerCase() == "outbound") {
    //    this.activeTab = 'outbound';
    //    this.tabClick(this.shipmentManagementService.SelectTab.toLowerCase());
    //  } else if (this.shipmentManagementService.SelectTab.toLowerCase() == "inbound") {
    //    this.activeTab = 'inbound';
    //    this.tabClick(this.shipmentManagementService.SelectTab.toLowerCase());
    //  }
    //  this.selectRow = 'selectRow';
    //  this.shipmentManagementService.SelectTab = "";

    //}
    //else {
    //  this.activeTab = 'outbound';
    //  this.SelectedTab = 'outbound';
    //  this.getPageSize(this.SelectedTab);
    //  this.GetShipmentDetails(this.SelectedTab);
    //  this.editingShipment = this.shipmentManagementService.EditingShipment;
    //  
    //}
    //this.SelectedTab = 'outbound';
    if (localStorage.SelectedTab != null && localStorage.SelectedTab != 'null' && localStorage.SelectedTab != "") {
      this.SelectedTab = localStorage.SelectedTab;
      this.search(this.SelectedTab);

    }
    else {
      this.SelectedTab = 'outbound';
      this.search(this.SelectedTab);
    }

    // this.getPageControlsPermissions();
    ////this.getPageSize(this.SelectedTab);
    ////this.GetShipmentDetails(this.SelectedTab);

    this.editingShipment = this.shipmentManagementService.EditingShipment;

    this.dsSDInbound = new MatTableDataSource<any>();
    this.dsSDOutbound = new MatTableDataSource<any>();
    this.setupDropDownSettings();
    this.getShipmentTypeList();
    this.getShipmentStatusList();
    this.getShipmentConditionList();
    this.getTenderStatusList();
    //this.getCarrierList();

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
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      searchBy: ['itemName']
    };
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      searchBy: ['itemName']
    };


    this.GetLocationsData();
    this.GetLocationTypeFromList();
    this.GetLocationTypeToList();
    this.GetLocationFromList();
    this.GetLocationToList();

    this.ManageFilterdSShipment = new MatTableDataSource<any>(this.SDManageFilter);
    this.GetCustomManageFilters();

    // this.buttonPermission();
    // searchable dropdown end
  }//init() end

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
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  //material table code

  shipmentColumns = ['selectRow', 'shipDate', 'requestedDeliveryDate', 'mustArriveByDate', 'pickupAppointment',
    'deliveryAppointment', 'actualDeliveryDate', 'shipmentNumber', 'shipmentType', 'fromLocationName', 'toLocationName', 'isShipWith', 'carrierName',
    'orderQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];
  //'planToShipQuantity',
  shipmentColumns1 = ['selectRow', 'shipDate', 'requestedDeliveryDate', 'mustArriveByDate', 'pickupAppointment',
    'deliveryAppointment', 'actualDeliveryDate', 'shipmentNumber', 'shipmentType', 'fromLocationName', 'toLocationName', 'isShipWith', 'carrierName',
    'orderQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];

  shipmentColumnsNew = ['selectRow', 'key_ShipDate', 'key_RequestedDeliveryDate',
    'key_mabd', 'key_PickupAppointment',
    'key_DeliveryAppointment', 'key_ActualDeliveryDate', 'key_ShipmentNumber',
    'key_ShipmentType', 'key_fromLocationName', 'key_toLocationName',
    'key_ShipWith', 'key_Carriername', 'key_OrderQuantity',
    'key_totalShipmentQuantity', 'key_TenderStatus', 'key_ShipmentStatus',
    'key_ShipmentCondition', 'key_OrderNumber', 'key_purchaseOrderNumber'
  ];
  ManageFilterdisplayedColumns = ['selectRow', 'FilterName', 'DefaultFilter'];

  // 'key_ptsq',
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

  //dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
  //dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
  dsSDInbound = new MatTableDataSource<any>();
  dsSDOutbound = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new shipmentworkbenchModel();
  AllStatusUnderReview: boolean = false;
  AllshipmentSendMas: boolean = false;
  filterValue = "";
  ELEMENT_DATA = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(TableFilterComponent) eqList: TableFilterComponent;


  ////For Permission Module
  //@ViewChild('tabGroupA') tabGroup: MatTabGroup;
  //@ViewChild('btnBar') btnBar: TopBtnGroupComponent;

  @Input() buttonBar: any;

  /*  onResizeEnd(event: ResizeEvent, columnName): void {
      if (event.edges.right) {
        const cssValue = event.rectangle.width + 'px';
        const columnElts = document.getElementsByClassName('mat-column-' + columnName);
        for (let i = 0; i < columnElts.length; i++) {
          const currentEl = columnElts[i] as HTMLDivElement;
          currentEl.style.width = cssValue;
        }
      }
    }*/

  ngAfterViewInit() {
    this.buttonBar.showAction('edit');
    this.dsSDInbound.paginator = this.paginator;
    this.dsSDInbound.sort = this.sort;
    this.dsSDOutbound.paginator = this.paginator;
    this.dsSDOutbound.sort = this.sort;
    this.buttonBar.disableAction('ship');
    this.buttonBar.disableAction('approveAndMas');
    this.buttonBar.disableAction('resendToMas');
    this.buttonBar.disableAction('tonu');
    this.buttonBar.disableAction('cancel');
    this.buttonBar.disableAction('receive');

       
    //  if (!isNaN(this.selectedShipmentId)) {
    //    this.editShipmentChange(this.selectedShipmentId);
    //  } 
  }

  applyFilterCustomer(filterText: string) {
    //filterValue = filterValue.trim();
    //filterValue = filterValue.toLowerCase();
    //this.dsSDOutbound.filter = filterValue;

    this.filterValue = filterText.trim();
    this.GetShipmentDetails(this.SelectedTab);
  }

  applyFilterStock(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dsSDOutbound.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dsSDInbound.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dsSDInbound.data.forEach(row => {
        row.IsSelected = true;
        this.selection.select(row)

        const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }) => {
          return { id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }
        });
        const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedshipments.length;

        this.shipmentManagementService.ShipmentsforEdit = {};
        this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
        this.shipmentManagementService.SelectTab = "";

      });
  }

  masterToggle1() {
    this.isAllSelected1() ?
      this.selection.clear() :
      this.dsSDOutbound.data.forEach(row => {
        row.IsSelected = true;
        this.selection.select(row)

        const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }) => {
          return { id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID }
        });
        const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedshipments.length;

        this.shipmentManagementService.ShipmentsforEdit = {};
        this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
        this.shipmentManagementService.SelectTab = "";

      });
  }

  isAllSelected1() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dsSDOutbound.data.length;
    return numSelected === numRows;
  }

  onPaginationEvent1(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.GetShipmentDetails(this.SelectedTab);
  }

  Converttodate(vdatetime: Date) {
    let dt = new Date(vdatetime);
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var date = dt.getDate();
    return month.toString() + "/" + date.toString() + "/" + year.toString();
  }

  GetShipmentDetails(tabName: any) {
    this.selection.clear();
    this.AllStatusUnderReview = false;

    if (!this.isPaggingClick)
      this.paginationModel.filterOn = this.filterValue;

    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.InboundOutbound = tabName;
    this.paginationModel.UpdatedBy = this.authService.currentUserValue.LoginId;
    this.paginationModel.itemsLength = 0;

    this.shipmentManagementService.GetAllShipmentDetails(this.paginationModel)
      .subscribe(data => {
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.ShipmentDetails = data.data;
          this.paginationModel.itemsLength = data.recordCount;
          this.SDInbound = data.data;
          this.SDInbound.forEach(row => {
            if (!(row.shipDate == null || row.shipDate == undefined || row.shipDate == '')) {
              row.shipDate = this.Converttodate(row.shipDate);
            }
            if (!(row.requestedDeliveryDate == null || row.requestedDeliveryDate == undefined || row.requestedDeliveryDate == '')) {
              row.requestedDeliveryDate = this.Converttodate(row.requestedDeliveryDate);
            }
            if (!(row.mustArriveByDate == null || row.mustArriveByDate == undefined || row.mustArriveByDate == '')) {
              row.mustArriveByDate = this.Converttodate(row.mustArriveByDate);
            }
            if (!(row.actualDeliveryDate == null || row.actualDeliveryDate == undefined || row.actualDeliveryDate == '')) {
              row.actualDeliveryDate = this.Converttodate(row.actualDeliveryDate);
            }

            if (!(row.pickupAppointment == null || row.pickupAppointment == undefined || row.pickupAppointment == '')) {
              row.pickupAppointment = this.Converttodate(row.pickupAppointment);
            }
            if (!(row.deliveryAppointment == null || row.deliveryAppointment == undefined || row.deliveryAppointment == '')) {
              row.deliveryAppointment = this.Converttodate(row.deliveryAppointment);
            }
            if (!(row.shipmentNumber == null || row.shipmentNumber == undefined || row.shipmentNumber == '')) {
              row.shipmentNumber = row.shipmentNumber + "." + row.shipmentVersion;
            }
            row.orderNumber = row.orderNumber + "." + row.orderVersionNumber;

            row.isShipWith = row.isShipWith ? "Yes" : "No";
            row.orderQuantity = Math.abs(row.orderQuantity);
            row.totalShipmentQuantity = Math.abs(row.totalShipmentQuantity);
          })
          //console.log(this.SDInbound);
          this.dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
          this.reselectShipments();
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.ShipmentDetails = data.data;
          this.paginationModel.itemsLength = data.recordCount;
          this.SDOutbound = data.data;
          this.SDOutbound.forEach(row => {
            if (!(row.shipDate == null || row.shipDate == undefined || row.shipDate == '')) {
              row.shipDate = this.Converttodate(row.shipDate);
            }
            if (!(row.requestedDeliveryDate == null || row.requestedDeliveryDate == undefined || row.requestedDeliveryDate == '')) {
              row.requestedDeliveryDate = this.Converttodate(row.requestedDeliveryDate);
            }
            if (!(row.mustArriveByDate == null || row.mustArriveByDate == undefined || row.mustArriveByDate == '')) {
              row.mustArriveByDate = this.Converttodate(row.mustArriveByDate);
            }
            if (!(row.actualDeliveryDate == null || row.actualDeliveryDate == undefined || row.actualDeliveryDate == '')) {
              row.actualDeliveryDate = this.Converttodate(row.actualDeliveryDate);
            }

            if (!(row.pickupAppointment == null || row.pickupAppointment == undefined || row.pickupAppointment == '')) {
              row.pickupAppointment = this.Converttodate(row.pickupAppointment);
            }
            if (!(row.deliveryAppointment == null || row.deliveryAppointment == undefined || row.deliveryAppointment == '')) {
              row.deliveryAppointment = this.Converttodate(row.deliveryAppointment);
            }
            if (!(row.shipmentNumber == null || row.shipmentNumber == undefined || row.shipmentNumber == '')) {
              row.shipmentNumber = row.shipmentNumber + "." + row.shipmentVersion;
            }
            row.orderNumber = row.orderNumber + "." + row.orderVersionNumber;
            row.isShipWith = row.isShipWith ? "Yes" : "No";
            row.orderQuantity = Math.abs(row.orderQuantity);
            row.totalShipmentQuantity = Math.abs(row.totalShipmentQuantity);
          })
          this.dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
          this.reselectShipments();
        }       
        if (!isNaN(this.selectedShipmentId)) {
          this.editShipmentChange(this.selectedShipmentId);
        }
      });

  }

  GetLocationsData() {
    this.shipmentManagementService.GetLocationsforDD()
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.shipmentManagementService.LocationsData = result.data
        }
      });
  }

  //OrderStatusList() {
  //  this.shipmentManagementService.OrderStatusList(1)
  //    .subscribe(data => {
  //      this.OrderStatusList = data.data;
  //    });
  //}

  reselectShipments() {
    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      if (this.shipmentManagementService.ShipmentsforEdit.length > 0) {
        this.ShipmentDetails.forEach(row => {
          if (this.shipmentManagementService.ShipmentsforEdit.some(item => item.id === row.id)) { this.selection.select(row) }
        });
      }

    }
  }
  selectAllrows() {
    this.ShipmentDetails.forEach(row => { this.selection.select(row) });
    const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }) => {
      return { id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }
    });
    const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
    this.shipmentManagementService.ShipmentsforEdit = {};
    this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
  }
  unselectrows() {
    this.selection.clear();
    this.ShipmentDetails.forEach(row => {
      if (this.editingShipment == row.shipmentNumber) {
        this.selection.select(row)
      }
    });
    const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }) => {
      return { id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }
    });
    const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
    this.shipmentManagementService.ShipmentsforEdit = {};
    this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
  }

  selectedvalue(row, checked: boolean) {
    row.IsSelected = checked;

    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      this.ShipmentDetails.forEach(irow => {
        if (irow.id == row.id) { this.selection.toggle(irow); }
      });
      const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID, shipmentStatusCode, shipmentOrderSendtoMAS }) => {
        return { id, shipmentNumber, shipmentVersion, shipmentStatusName, tenderStatusName, orderID, shipmentStatusCode, shipmentOrderSendtoMAS }
      });
      const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));

      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedshipments.length;

      this.shipmentManagementService.ShipmentsforEdit = {};
      this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
      this.shipmentManagementService.SelectTab = "";
      this.buttonBar.disableAction('approveAndMas');
      this.buttonBar.disableAction('resendToMas');
      if (selectedshipments.length > 0 && selectedshipments != undefined && selectedshipments != null) {
        this.AllStatusUnderReview = selectedshipments.every(function (e: any) { return e.shipmentStatusCode.toLowerCase() == 'under review'; });
        if (this.AllStatusUnderReview) {
          this.buttonBar.enableAction('approveAndMas');
        }
        this.AllshipmentSendMas = selectedshipments.every(function (e: any) { return e.shipmentOrderSendtoMAS == 1; });
        if (this.AllshipmentSendMas) {
          this.buttonBar.enableAction('resendToMas');
        }
      }
    }
  }



  onPaginationEvent(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.GetShipmentDetails(this.SelectedTab);
  }

  //async getPageSize(tabName) {
  //  this.selection.clear();
  //  this.paginationModel.filterOn = this.filterValue;
  //  var ClientId = parseInt(localStorage.clientId);
  //  this.paginationModel.ClientId = ClientId;
  //  this.paginationModel.InboundOutbound = tabName;
  //  this.shipmentManagementService.GetAllShipmentDetailsCount(this.paginationModel)
  //    .subscribe(result => {
  //     
  //      //this.paginationModel.itemsLength = result.recordCount;
  //    }
  //    );

  //  // default page size
  //  this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
  //  this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);

  //}

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.GetShipmentDetails(this.SelectedTab);
    }
  }


  tabClick(TabName: any) {
    this.filterValue = "";
    if (this.eqList != undefined)
      this.eqList.pills = [];

    //this.shipmentManagementService.SelectTab = TabName;
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedTab', TabName);
    this.filterValue = "";
    this.SelectedTab = TabName;
    // this.getPageSize(this.SelectedTab);
    this.GetShipmentDetails(TabName);

    this.search(TabName);
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
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
              // locationTypeCode: item.code
            };
          }).forEach(value => this.carrierList.push(value));
        });
  }
  OnCarrierOpen(event) {

    this.getCarrierList();

    //console.log(this.itemList);
  }
  OnCarrierClose(e) {
    this.carrierList = [];
  }
  OnCarrierSelect(event) {
  }
  applyShippingFilter() {
    this.paginationModel.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;
    this.GetShipmentDetails(this.SelectedTab);
  }

  editShipmentChange(shipmentId: number) {   
    if (shipmentId != 0) {//&& this.isEditByLink == false
      this.isEditByLink = true;
      ////var row = null;
      ////if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      ////  row = this.ShipmentDetails.find(x => x.id === shipmentId);
      ////  this.selectedvalue(row, true);
      ////}
     // this.shipmentManagementService.ShipmentsforEdit.Push({ "id": shipmentId });
      this.shipmentManagementService.EditingShipmentID = shipmentId;
      this.EdittedShipmentNumber.emit(shipmentId);
      //localStorage.SelectedShipmentId = null;
      localStorage.SelectedTab = null;
      this.selectedShipmentId = 0;
    }
  }

  //manage custom filter
  ResetGlobalFilter() {
    this.shipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel;
    this.paginationModel.shipmentworkbenchFilterModel = null;
    this.CustomFilterId = 0;
    this.GetShipmentDetails(this.SelectedTab);

  }

  CreateNewFilter() {
    if (this.FilterName != null && this.FilterName != "") {

      var RequestObject = {
        FilterName: this.FilterName,
        IsDefault: this.DefaultFilter,
        FilterExpression: JSON.stringify(this.shipmentworkbenchFilterModel),
        UserID: this.authService.currentUserValue.UserId,
        ClientID: this.authService.currentUserValue.ClientId,
        SelectedTab: this.SelectedTab
      };
      this.shipmentManagementService.CreateManageFilter(RequestObject)
        .subscribe(result => {
          if (result.data == true && result.message == "Success") {
            this.GetCustomManageFilters();
            this.FilterName = "";
            this.DefaultFilter = false;
            this.CustomFilterId = 0;
          }
        }
        );
    }
  }
  GetCustomManageFilters() {
    this.shipmentManagementService.GetAllCustomManageFilters(this.authService.currentUserValue.ClientId, this.authService.currentUserValue.UserId, this.SelectedTab)
      .subscribe(
        data => {

          var result = data.data;
          this.CustomFilterId = 0;
          this.ManageFilterdSShipment.data = [];
          this.ManageFilter_ELEMENT_DATA = [];
          result.forEach((value, index) => {
            this.ManageFilter_ELEMENT_DATA.push({
              Id: value.id,
              FilterName: value.filterName,
              DefaultFilter: value.isDefault == false ? "No" : "Yes",
              FilterExpression: value.filterExpression,
              isEdited: false

            })
          })
          this.ManageFilterdSShipment = new MatTableDataSource<PeriodicElementManageFilter>();
          this.ManageFilterdSShipment.data = this.ManageFilter_ELEMENT_DATA;
          this.CustomFilterItemList = [];
          if (this.ManageFilter_ELEMENT_DATA.length > 0) {
            this.ManageFilter_ELEMENT_DATA.forEach((value, index) => {
              this.CustomFilterItemList.push({
                Id: value.Id,
                FilterName: value.FilterName,
                DefaultFilter: value.DefaultFilter,
                FilterExpression: value.FilterExpression
              })
            })
            // if we have any custom filter as default yes then it should apply on load
            this.CustomFilterItemList.forEach((value, index) => {
              if (value.DefaultFilter == "Yes") {
                this.CustomFilterId = value.Id;
                this.shipmentworkbenchFilterModel = JSON.parse(value.FilterExpression);
                this.paginationModel.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;//JSON.parse(SelectedFilterObj.FilterExpression);
                this.GetShipmentDetails(this.SelectedTab);
                //this.paginationModel.shipmentworkbenchFilterModel = JSON.parse(value.FilterExpression);
                //this.GetShipmentDetails(this.SelectedTab);
                return;
              }
            })
          }
        });
  }
  onSelectionChangeCustomFilter(row: shipmentManagementService, event: Event, checked: boolean) {
    //to handle custom filter
    if (row.isEdited != true) {
      this.CustomFilterId = row.Id;
      this.ManageFilterdSShipment.data.forEach(row => { row.isSelected = false; });
      row.isSelected = checked;
      this.selection.toggle(row);
    }
  }
  onBlurFilterName(value) {
    this.FilterNameEdit = value;
  }
  ApplyCustomFilterChange(event) {
    if (event.target.value != undefined) {
      this.shipmentworkbenchFilterModel = new ShipmentworkbenchFilterModel();
      var SelectedFilterObj = this.CustomFilterItemList.find(f => f.Id == Number(event.target.value));
      this.shipmentworkbenchFilterModel = JSON.parse(SelectedFilterObj.FilterExpression);
      this.paginationModel.shipmentworkbenchFilterModel = this.shipmentworkbenchFilterModel;//JSON.parse(SelectedFilterObj.FilterExpression);
      this.GetShipmentDetails(this.SelectedTab);
    }
  }

  setEditMode(edit: boolean) {
    if (edit) {
      this.isEditMode = true;
      if (this.selection.selected.length == 1) {
        this.selectedCustomFilterMethodMapping = this.selection.selected[0];
        this.selectedCustomFilterMethodMapping.isEdited = true;
        this.FilterNameEdit = this.selection.selected[0].FilterName;
        this.DefaultFilterEdit = this.selection.selected[0].DefaultFilter == "Yes" ? true : false;
        this.selection.clear();
        this.IsEditDelete = false;
        this.IsSaveCancel = true;
      }
    } else {
      this.isEditMode = false;
      if (this.selectedCustomFilterMethodMapping != null)
        this.selectedCustomFilterMethodMapping.isEdited = false;
      this.selectedCustomFilterMethodMapping = null;
      this.FilterNameEdit = "";
    }

  }
  buttonAction(button: String) {
    if (button === 'edit') {
      this.setEditMode(true);
    } else if (button === 'save') {
      this.UpdateCustomFilter();
      this.setEditMode(false);
      this.IsEditDelete = true;
      this.IsSaveCancel = false;
    } else if (button === 'cancel') {
      this.setEditMode(false);
      this.GetCustomManageFilters();
      this.IsEditDelete = true;
      this.IsSaveCancel = false;
    } else if (button === 'delete') {
      this.DeleteCustomFilter();
    }
  }

  UpdateCustomFilter() {
    if (this.CustomFilterId != 0) {
      var RequestObject = {
        Id: this.CustomFilterId,
        FilterName: this.FilterNameEdit,
        IsDefault: this.DefaultFilterEdit,
        FilterExpression: JSON.stringify(this.shipmentworkbenchFilterModel),
        UserID: this.authService.currentUserValue.UserId,
        ClientID: this.authService.currentUserValue.ClientId,
        SelectedTab: this.SelectedTab
      };

      this.shipmentManagementService.UpdateManageFilter(RequestObject)
        .subscribe(result => {
          if (result.data == true && result.message == "Success") {
            this.GetCustomManageFilters();
            this.FilterNameEdit = "";
            this.DefaultFilterEdit = false;
            this.CustomFilterId = 0;
          }
        }
        );
    }
  }

  DeleteCustomFilter() {
    if (this.CustomFilterId != 0 && this.CustomFilterId != undefined) {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        var RequestObject = {
          Id: this.CustomFilterId,
          UserID: this.authService.currentUserValue.UserId,
          ClientID: this.authService.currentUserValue.ClientId,
          SelectedTab: this.SelectedTab
        };
        this.shipmentManagementService.DeleteManageFilter(RequestObject)
          .subscribe(result => {
            this.CustomFilterId = 0;
            if (result.data == true && result.message == "Success") {
              this.GetCustomManageFilters();
              this.FilterNameEdit = "";
              this.DefaultFilterEdit = false;
              this.CustomFilterId = 0;
            }
          }
          );
      }, (reason) => {
      });
    }
  }
  OpenManageCustomFilter() {
    $("#manageFilter").modal('show');
    this.isEditMode = false;
    this.FilterName = "";
    this.DefaultFilter = false;
    this.CustomFilterId = 0;
  }
  CloseManageFilter() {
    this.buttonAction('cancel');
    $("#manageFilter").modal('hide');
  }

  search(activeTab) {
    this.activeTab = activeTab;
  }

  // Order No link
  editOrderLink(action, row) {    
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedOrderIdLink', row.orderID);
    localStorage.setItem('SelectedOrderTypeIdLink', row.orderTypeID);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    localStorage.setItem('isOrderLinkClick', 'Yes');
    localStorage.setItem('SelectedOrderType', row.orderType);
    this.router.navigateByUrl('/order-management/order-workbench');
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

            var isReadAndModify = false;
            data.forEach(irow => {
              if (irow.PermissionType == "Read and Modify") {
                isReadAndModify = true;
              }
            });

            if (isReadAndModify) {
              this.shipmentWorkbenchHasReadOnlyAccess = false;
              //  this.btnBar.enableAction('edit');
            }
            else {
              this.shipmentWorkbenchHasReadOnlyAccess = true;
              //this.btnBar.disableAction('edit');
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }

  //To Show/Hide customer and stock tab permission wise
  async getPageControlsPermissions() {
    // default page size
    this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
    this.MaxEditedRecordsCountPreferences = await this.shipmentManagementService.getMaxEditedRecordsCount();

    var ModuleRoleCode = "ShipmentWorkbench.ViewCustomerList,ShipmentWorkbench.ViewStockTransferList";
    var ClientId = this.authService.currentUserValue.ClientId;
    var LoginId = this.authService.currentUserValue.LoginId;
    this.shipmentManagementService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

          //For Stock
          var isStockAndCollectionPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentWorkbench.ViewStockTransferList"));
          if (isStockAndCollectionPermission != null && isStockAndCollectionPermission != undefined) {
            if (isStockAndCollectionPermission.length > 0) {
              if ((isStockAndCollectionPermission[0].PermissionType.toLowerCase() == "read and modify") || (isStockAndCollectionPermission[0].PermissionType.toLowerCase() == "read only")) {
                //Show Stock Grid
                this.isStockCollection = true;
              } else {
                //Hide Customer
                this.isStockCollection = false;
              }
            }
          }
          if (isStockAndCollectionPermission.length == 0) {
            this.isStockCollection = false;
          }

          //For Customer
          var isCustomerPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentWorkbench.ViewCustomerList"));
          if (isCustomerPermission != null && isCustomerPermission != undefined) {
            if (isCustomerPermission.length > 0) {
              if ((isCustomerPermission[0].PermissionType.toLowerCase() == "read and modify") || (isCustomerPermission[0].PermissionType.toLowerCase() == "read only")) {
                //Show Customer Grid
                this.isCustomer = true;
              } else {
                //Hide Customer Grid and Show Stock Grid
                this.isCustomer = false;
              }
            }
          }
          if (isCustomerPermission.length == 0) {
            this.isCustomer = false;
          }

          if (this.isCustomer == true) {
            this.SelectTab = 'outbound';
            this.SelectedTab = 'outbound';
            // this.getPageSize(this.SelectedTab);
            this.tabClick(this.SelectTab);
            return;
          }
          if (this.isStockCollection == true) {
            this.SelectTab = 'inbound';
            this.SelectedTab = 'inbound';
            //this.getPageSize(this.SelectedTab);
            this.tabClick(this.SelectTab);
            return;
          }
        }
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
  ApproveandSendShipmentForMASMulti() {
    let selectedids = '';
    this.shipmentManagementService.ShipmentsforEdit.forEach(x => { selectedids = selectedids + x.id + ","; })
    if (selectedids.length > 0) {
      this.shipmentManagementService.ApproveandSendShipmentForMASMultiple(selectedids).subscribe(data => {
        if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
          this.toastrService.success("Selected Shipments have been sent to MAS successfully");
          this.GetShipmentDetails(this.SelectedTab);
        }
        else { this.toastrService.error("An Error occurred. Please contact Tech Support"); }

      });
    }
  }

  ReSendShipmentForMASMulti() {
    let selectedids = '';
    this.shipmentManagementService.ShipmentsforEdit.forEach(x => { selectedids = selectedids + x.id + ","; })
    if (selectedids.length > 0) {
      this.shipmentManagementService.ReSendShipmentForMASMultiple(selectedids).subscribe(data => {
        if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
          this.toastrService.success("Selected Shipments have been sent to MAS successfully");
          this.GetShipmentDetails(this.SelectedTab);
        }
        else { this.toastrService.error("An Error occurred. Please contact Tech Support"); }

      });
    }
  }

}


