/// <reference path="../../../../core/models/shipmentworkbench.model.ts" />
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import {
  ResizeEvent
} from 'angular-resizable-element';
import { shipmentworkbenchModel } from '../../../../core/models/shipmentworkbench.model';

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

const ELEMENT_DATA: PeriodicElement[] = [
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 456050,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'Yes',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 2502, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 416090,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'Yes',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 11520, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 416090,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'No',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 101, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
];

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
const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 456050,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'Yes',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 2502, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 416090,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'Yes',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 11520, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
  {
    ShipDate: '25/09/2020', ReqDeliveryDate: '26/09/2020', MustArriveByDate: '2/09/2020',
    PickupAppointment: '', DeliveryAppointment: '', ActDeliveryDate: '', ShipmentNo: 416090,
    ShipmentType: 'customer', ShipFrom: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]', ShipTo: '4036-10 - BC Systems (2Ls Cooling TX)[Chiquita Brands International]',
    ShipWith: 'No',
    Carrier: 'CPU1 - CPU (Customer Pick up)',
    OrderQuantity: 1,
    PlanToShipQuantity: 101, ShippedQuantity: 1, TenderStatus: '', ShipmentStatus: 'Open Shipment Needs to be Completed',
    ShipmentCondition: 'Tendered', OrderNo: 10, PON: 101
  },
];

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.css']
})
export class WorkbenchComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService) { }

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

  count = 3;

  editingShipment: any;
  selectRow: any;

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.paginationModel.sortOrder = "DESC";
    this.SelectedTab = 'outbound';
    this.GetShipmentDetails(this.SelectedTab);
    this.getPageSize(this.SelectedTab);
    this.editingShipment = this.shipmentManagementService.EditingShipment;

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
      addNewItemOnFilter: true,
      badgeShowLimit: 1
    };
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1
    };
    this.GetLocationsData();


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
    'orderQuantity', 'planToShipQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];

  shipmentColumns1 = ['selectRow', 'shipDate', 'requestedDeliveryDate', 'mustArriveByDate', 'pickupAppointment',
    'deliveryAppointment', 'actualDeliveryDate', 'shipmentNumber', 'shipmentType', 'fromLocationName', 'toLocationName', 'isShipWith', 'carrierName',
    'orderQuantity', 'planToShipQuantity', 'totalShipmentQuantity',
    'tenderStatusName', 'shipmentStatusName', 'conditionName', 'orderNumber', 'purchaseOrderNumber'];

  shipmentColumnsNew = ['selectRow', 'key_ShipDate', 'key_RequestedDeliveryDate',
    'key_mabd', 'key_PickupAppointment',
    'key_DeliveryAppointment', 'key_ActualDeliveryDate', 'key_ShipmentNumber',
    'key_ShipmentType', 'key_fromLocationName', 'key_toLocationName',
    'key_ShipWith', 'key_Carriername', 'key_OrderQuantity', 'key_ptsq',
    'key_totalShipmentQuantity', 'key_TenderStatus', 'key_ShipmentStatus',
    'key_ShipmentCondition', 'key_OrderNumber', 'key_purchaseOrderNumber'
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);
  dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
  dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new shipmentworkbenchModel();
  filterValue = "";
  ELEMENT_DATA = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() buttonBar: any;

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

  ngAfterViewInit() {
    this.buttonBar.showAction('edit');
    this.dsSDInbound.paginator = this.paginator;
    this.dsSDInbound.sort = this.sort;

    this.dsSDOutbound.paginator = this.paginator;
    this.dsSDOutbound.sort = this.sort;
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
      this.dsSDInbound.data.forEach(row => this.selection.select(row));
  }

  GetShipmentDetails(tabName: any) {
    // debugger;
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.InboundOutbound = tabName;

    this.shipmentManagementService.GetAllShipmentDetails(this.paginationModel)
      .subscribe(data => {
        // debugger; 
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.ShipmentDetails = data.data;
          this.SDInbound = data.data;
          this.dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
          this.reselectShipments();
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.ShipmentDetails = data.data;
          this.SDOutbound = data.data;
          this.dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
          this.reselectShipments();
        }
      });

    ////this.shipmentManagementService.GetAllShipmentDetails()
    ////  .subscribe(data => {
    ////    console.log(data);
    ////    this.ShipmentDetails = data.data;
    ////    this.SDInbound = this.ShipmentDetails.filter(x => x.shipmentTypeCode != "StockTransfer" && x.shipmentTypeCode != "Collections")
    ////    this.SDOutbound = this.ShipmentDetails.filter(x => x.shipmentTypeCode == "StockTransfer" || x.shipmentTypeCode == "Collections")
    ////    this.dsSDInbound = new MatTableDataSource<any>(this.SDInbound);
    ////    this.dsSDOutbound = new MatTableDataSource<any>(this.SDOutbound);
    ////    this.reselectShipments();
    ////  });
    ////this.shipmentManagementService.GetAllShipmentDetails()
    ////  .subscribe(data => {
    ////    this.ShipmentDetails1 = data.data;
    ////    this.reselectShipments();
    ////  });
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
      this.ShipmentDetails.forEach(row => {
        if (this.shipmentManagementService.ShipmentsforEdit.length != undefined) {
          if (this.shipmentManagementService.ShipmentsforEdit.some(item => item.id === row.id)) { this.selection.select(row) }
        }
      });
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

  selectedvalue(row) {

    if (this.ShipmentDetails != undefined && this.ShipmentDetails != null) {
      this.ShipmentDetails.forEach(irow => {
        if (irow.id == row.id) { this.selection.toggle(irow); }
      });
      const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }) => {
        return { id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }
      });
      const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
      this.shipmentManagementService.ShipmentsforEdit = {};
      this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
    }
  }


  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.GetShipmentDetails(this.SelectedTab);
  }

  async getPageSize(tabName) {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.InboundOutbound = tabName;
    this.shipmentManagementService.GetAllShipmentDetailsCount(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );

    // default page size
    this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);

  }

  customSort(event) {
    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.GetShipmentDetails(this.SelectedTab);
  }


  tabClick(TabName: any) {
    this.filterValue = "";
    this.SelectedTab = TabName;
    this.GetShipmentDetails(TabName);
    this.getPageSize(this.SelectedTab);
  }



}
