import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { FormControl } from '@angular/forms';
import { regularOrderModel } from '../../../../core/models/regularOrder.model';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { Id } from '../../../system-settings/freight-mode/map-equipment-type/map-equipment-type.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';


export interface PeriodicElement {
  OrderNum: number;
  OrderType: string;
  Status: string;
  OrderCondition: string;
  MaterialDescription: string;
  OrderQuantity: number;
  PlanToShipQty: number;
  ShipmentQuantity: number;
  ShipFromLocation: string;
  ShipToLocation: string;
  ShipWith: string;
  SalesManager: string;
  BOL: string,
  ScheduledShipDate: string;
  RequestedDeliveryDate: string;
  MustArriveByDate: string;
  ActualDeliveryDate: string;
  Carrier: string;
  PONum: string;
  InvoiceNumber: string;
  Shipmentnum: number;
  OrderAmount: number;
  Source: string;
  OrderNumber: string;
}
export interface PeriodicElement1 {
  OrderNum: number;
  OrderType: string;
  Status: string;
  OrderCondition: string;
  MaterialDescription: string;
  OrderQuantity: number;
  PlanToShipQty: number;
  ShippedQty: number;
  ShipFromLocation: string;
  ShipToLocation: string;
  ShipWith: string;
  SalesManager: string;
  BOL: string;
  ScheduledShipDate: string;
  RequestedDeliveryDate: string;
  MustArriveByDate: string;
  ActualDeliveryDate: string;
  Carrier: string;
  PONum: string;
  InvoiceNumber: string;
  Shipmentnum: number;
  OrderAmount: number;
  Source: string;
}

export interface PeriodicElementNew {
  //OrderNum: number;
  OrderId: number;
  OrderNumber: string;
  OrderType: string;
  TotalOrderQuantity: number;
  ScheduledShipDate: Date;
  RequestedDeliveryDate: Date;
  MustArriveByDate: Date;
  ActualDeliveryDate: Date;
  Carrier: string;
  InvoiceNumber: number;
  ShipmentNumber: number;
  PurchaseOrderNumber: number;
  InvoiceNo: number;
  Source: string;
  FromLocation: string;
  FromLocationId: number;
  ToLocation: string;
  ToLocationID: number;
  ShipmentStatus: string;
  ShipmentCondition: string;
  ShipWithOrderID: number;
  RouteSequence: number;
  LinkOrders: string;
  SalesManager: string;
  IsDeleted: number;
  BOL: string;
  OrderCondition: string;
  Status: string;
  MaterialDescription: string;
  OrderQuantity: number;
  ShipmentQuantity: number;
  ShipFromLocation: string;
  ShipToLocation: string;
  OrderAmount: string;

}

export interface Element {
  highlighted?: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [];
const ELEMENT_DATA1: PeriodicElement1[] = [];


@Component({
  selector: 'app-order-workbench',
  templateUrl: './order-workbench.component.html',
  styleUrls: ['./order-workbench.component.css']
})
export class OrderWorkbenchComponent implements OnInit, AfterViewInit {
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };

  SalesOrderDetails: any = {};
  SalesOrderDetailsIB: any = {};
  editingSalesOrder: any;
  decimalPreferences: number;

  //material table code
  displayedColumns = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

  displayedColumns1 = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

  dataSource;
  dataSourceIB;
  //selection = new SelectionModel<regularOrderModel>(true, []);
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new regularOrderModel();
  filterValue = "";
  // code for searchable dropdown with checkbox

  constructor(private router: Router, private orderManagementService: OrderManagementService, private authservices: AuthService, private toastrService: ToastrService) { }
  public dateFormat: String = "MM-dd-yyyy";
  selectedItems = [];
  itemList = [];
  selectedSalesOrderIds = [];
  settings = {};

  selectedItemsCheck = [];
  itemListCheck = [];
  settingsCheck = {};

  count = 3;
  selectRow: any;
  data = [];
  SelectedTab: string;
  ELEMENT_DATA: PeriodicElementNew[] = [];
  isCustomer: boolean;
  isStockCollection: boolean;

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


  async ngOnInit() {

    this.isCustomer = true;
    this.isStockCollection = true;

    this.paginationModel.sortOrder = "DESC";
    this.SelectedTab = 'outbound';
    await this.getPageSize(this.SelectedTab);

    this.selectRow = 'selectRow';
    // for searchable dropdown
    this.itemList = [
      { "id": 1, "itemName": "option1" },
      { "id": 2, "itemName": "option2" },
      { "id": 3, "itemName": "option3" },
      { "id": 4, "itemName": "option4" },
      { "id": 5, "itemName": "option5" },
      { "id": 6, "itemName": "option6" }
    ];
    this.selectedItems = [];
    this.selectedSalesOrderIds = [];

    this.settings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1
    };
    // for checkbox with multiselect
    this.itemListCheck = [
      { "id": 1, "itemName": "option11" },
      { "id": 2, "itemName": "option22" },
      { "id": 3, "itemName": "option33" },
      { "id": 4, "itemName": "option44" },
      { "id": 5, "itemName": "option55" },
      { "id": 6, "itemName": "option66" }
    ];
    this.selectedItemsCheck = [];
    this.settingsCheck = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2
    };

    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();

    this.dataSource = new MatTableDataSource<regularOrderModel>();
    this.dataSourceIB = new MatTableDataSource<regularOrderModel>();
    this.getSalesOrderDataList(this.SelectedTab);
    this.editingSalesOrder = this.orderManagementService.EditingSalesOrder;


    // searchable dropdown end

  }//init() end


  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderDataList(this.SelectedTab);
  }

  onPaginationEvent1(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderDataList(this.SelectedTab);
  }

  //getPageSize() {
  //  this.selection.clear();
  //  this.paginationModel.filterOn = this.filterValue;
  //  var ClientId = parseInt(localStorage.clientId);
  //  this.paginationModel.ClientId = ClientId;
  //  this.paginationModel.LocationType = "Customer";
  //  this.paginationModel.RoleName = "SalesManager";
  //  this.orderManagementService.GetSalesOrderListDataCount(this.paginationModel)
  //    .subscribe(result => {
  //      this.paginationModel.itemsLength = result.recordCount;
  //    }
  //    );

  //}

  async getPageSize(tabName) {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.LocationType = "Customer";
    this.paginationModel.RoleName = "SalesManager";
    this.paginationModel.InboundOutbound = tabName;// "outbound";
    this.orderManagementService.GetSalesOrderListDataCount(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );

    // default page size
    this.paginationModel.pageSize = await this.orderManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);

  }

  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onAddItemCheck(data: string) {
    this.count++;
    this.itemListCheck.push({ "id": this.count, "itemName": data });
    this.selectedItemsCheck.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  displayedColumnsReplace = ['selectRow', 'key_OrderNo', 'key_Ordertype', 'key_Status', 'key_OrderCondition', 'key_MaterialDescription',
    'key_OrderQuantity', 'key_ShippedQty', 'key_ShipFromLocation',
    'key_Shipto', 'key_Salesmanager', 'key_ShipWith', 'key_ScheduledShipDate',
    'key_RequestedDeliveryDate', 'key_mabd', 'key_ActualDeliveryDate',
    'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt', 'key_Source'];
  displayedColumnsReplaceIB = ['selectRow', 'key_OrderNo', 'key_Ordertype',
    'key_Status', 'key_OrderCondition', 'key_MaterialDescription',
    'key_OrderQuantity', 'key_ShippedQty',
    'key_ShipFromLocation', 'key_Shipto', 'key_Salesmanager', 'key_ShipWith',
    'key_ScheduledShipDate',
    'key_RequestedDeliveryDate', 'key_mabd', 'key_ActualDeliveryDate',
    'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt',
    'key_Source'];

  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);
  //selection = new SelectionModel<PeriodicElement>(true, []);
  //selection1 = new SelectionModel<PeriodicElement1>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('outboundtab') outboundtab: ElementRef;
  @ViewChild('outboundtabDiv') outboundtabDiv: ElementRef;
  @Output('selectedCharges') selectedCharges = new EventEmitter<regularOrderModel[]>();

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

    // this.paginator.length = this.paginationModel.pageSize;
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getSalesOrderDataList(this.SelectedTab);

  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getSalesOrderDataList(this.SelectedTab);
    }
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  isAllSelected1() {
    const numSelected1 = this.selection1.selected.length;
    const numRows1 = this.dataSourceIB.data.length;
    return numSelected1 === numRows1;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.dataSourceIB.data.forEach(row => this.selection1.select(row));
  }


  getSalesOrderDataList(tabName: any) {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.LocationType = "Customer";
    this.paginationModel.RoleName = "SalesManager";
    this.paginationModel.InboundOutbound = tabName;//"outbound";

    this.orderManagementService.GetSalesOrderDetailList(this.paginationModel)
      .subscribe(result => {

        this.dataSource.data = [];
        this.ELEMENT_DATA = [];
        result.data.forEach((value, index) => {
          this.ELEMENT_DATA.push({
            OrderId: value.orderId,
            OrderNumber: value.orderNumber,
            OrderType: value.orderType,
            TotalOrderQuantity: value.totalOrderQuantity,
            ScheduledShipDate: value.scheduledShipDate,
            RequestedDeliveryDate: value.requestedDeliveryDate,
            MustArriveByDate: value.mustArriveByDate,
            ActualDeliveryDate: value.actualDeliveryDate,
            Carrier: value.carrier,
            InvoiceNumber: value.invoiceNo,
            ShipmentNumber: value.shipmentNumber,
            PurchaseOrderNumber: value.purchaseOrderNumber,
            InvoiceNo: value.invoiceNo,
            Source: value.source,
            FromLocation: value.fromLocation,
            FromLocationId: value.fromLocationId,
            ToLocation: value.toLocation,
            ToLocationID: value.toLocationId,
            ShipmentStatus: value.shipmentStatus,
            ShipmentCondition: value.shipmentCondition,
            ShipWithOrderID: value.shipWithOrderID,
            RouteSequence: value.routeSequence,
            LinkOrders: value.linkOrders,
            SalesManager: value.salesManager,
            IsDeleted: value.isDeleted,
            BOL: value.showOnBOL,
            OrderCondition: value.orderCondition,
            Status: value.orderStatus,
            MaterialDescription: value.materialDescription,
            OrderQuantity: value.totalOrderQuantity,
            ShipmentQuantity: value.shipmentQuantity,
            ShipFromLocation: value.fromLocation,
            ShipToLocation: value.toLocation,
            OrderAmount: this.ConvertMoneyToDecimalPreferences(value.orderAmount) // this.ConvertMoneyToDecimalPreferences(Number(value.orderAmount))
          })
        })
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.dataSource = new MatTableDataSource<PeriodicElementNew>();
          this.dataSource.data = this.ELEMENT_DATA;
          this.SalesOrderDetails = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
          this.outboundtab.nativeElement.classList.remove('active');
          this.outboundtabDiv.nativeElement.classList.remove('active');
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.dataSourceIB = new MatTableDataSource<PeriodicElementNew>();
          this.dataSourceIB.data = this.ELEMENT_DATA;
          this.SalesOrderDetailsIB = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
        }
      }
      );

  }

  /** On row selection send that row to parent component  */
  onSelectionChange(row: OrderManagementService, event: Event, checked: boolean) {
    if (checked) {
      var SelectedData = JSON.stringify(row);
      localStorage.setItem('Orderdata', SelectedData);

      //To cancel order
      var data = JSON.parse(SelectedData)
      if (!this.selectedSalesOrderIds.some((item) => item == data.orderId)) {
        this.selectedSalesOrderIds.push(data.orderId);
      }

    } else {
      localStorage.removeItem("Orderdata");

      //remove item from array to cencel order
      var SelectedData = JSON.stringify(row);
      var data = JSON.parse(SelectedData)
      const index: number = this.selectedSalesOrderIds.indexOf(data.orderId);
      if (index !== -1) {
        this.selectedSalesOrderIds.splice(index, 1);
      }
    }

    //edit

  }

  unselectrows() {
    //this.selection.clear();
    //this.ShipmentDetails.forEach(row => {
    //  if (this.editingShipment == row.shipmentNumber) {
    //    this.selection.select(row)
    //  }
    //});
    //const selectedshipmentsOrder = this.selection.selected.map(({ id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }) => {
    //  return { id, shipmentNumber, shipmentStatusName, tenderStatusName, orderID }
    //});
    //const selectedshipments = selectedshipmentsOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
    //this.shipmentManagementService.ShipmentsforEdit = {};
    //this.shipmentManagementService.ShipmentsforEdit = selectedshipments;
  }

  selectedvalue(row, event: Event, checked: boolean) {

    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);

    if (this.SalesOrderDetails != undefined && this.SalesOrderDetails != null) {
      this.SalesOrderDetails.forEach(irow => {
        if (irow.OrderId == row.OrderId) {
          this.selection.toggle(irow);
        }
      });
      const selectedsalesOrder = this.selection.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID }
      });
      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
      this.orderManagementService.SalesOrderforEdit = [];
      this.orderManagementService.SalesOrderforEdit = selectedsalesorders;

      //to manage check/Uncheck for cancel order array
      this.selectedSalesOrderIds = [];
      if (selectedsalesorders.length > 0) {
        var k = 0;
        for (k = 0; k < selectedsalesorders.length; k++) {
          this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          localStorage.setItem('FromLocationId', row.FromLocationId);
          localStorage.setItem('ToLocationId', row.ToLocationID);
          localStorage.setItem('OrderType', row.OrderType);
          localStorage.setItem('OrderStatus', row.Status);
        }
      } else {
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);

      }

    }



    ////if (checked) {
    ////  var SelectedData = JSON.stringify(row);
    ////  localStorage.setItem('Orderdata', SelectedData);

    ////  //To cancel order
    ////  var data = JSON.parse(SelectedData)
    ////  if (!this.selectedSalesOrderIds.some((item) => item == data.OrderId)) {
    ////    this.selectedSalesOrderIds.push(data.OrderId);
    ////  }

    ////} else {
    ////  localStorage.removeItem("Orderdata");

    ////  //remove item from array to cencel order
    ////  var SelectedData = JSON.stringify(row);
    ////  var data = JSON.parse(SelectedData)
    ////  const index: number = this.selectedSalesOrderIds.indexOf(data.OrderId);
    ////  if (index !== -1) {
    ////    this.selectedSalesOrderIds.splice(index, 1);
    ////  }
    ////}

  }

  selectedvalueIB(row, event: Event, checked: boolean) {

    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);

    if (this.SalesOrderDetailsIB != undefined && this.SalesOrderDetailsIB != null) {
      this.SalesOrderDetailsIB.forEach(irow => {
        if (irow.OrderId == row.OrderId) { this.selection1.toggle(irow); }
      });
      const selectedsalesOrder = this.selection1.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID }
      });
      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
      this.orderManagementService.SalesOrderforEdit = [];
      this.orderManagementService.SalesOrderforEdit = selectedsalesorders;

      //to manage check/Uncheck for cancel order array
      this.selectedSalesOrderIds = [];
      if (selectedsalesorders.length > 0) {
        var k = 0;
        for (k = 0; k < selectedsalesorders.length; k++) {
          this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          localStorage.setItem('FromLocationId', row.FromLocationId);
          localStorage.setItem('ToLocationId', row.ToLocationID);
          localStorage.setItem('OrderType', row.OrderType);
          localStorage.setItem('OrderStatus', row.Status);
        }
      } else {
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);

      }
    }

    ////if (checked) {
    ////  localStorage.removeItem("Orderdata");
    ////  var SelectedData = JSON.stringify(row);
    ////  localStorage.setItem('Orderdata', SelectedData);

    ////  //To cancel order
    ////  var data = JSON.parse(SelectedData)
    ////  if (!this.selectedSalesOrderIds.some((item) => item == data.OrderId)) {
    ////    this.selectedSalesOrderIds.push(data.OrderId);
    ////  }

    ////} else {
    ////  localStorage.removeItem("Orderdata");

    ////  //remove item from array to cencel order
    ////  var SelectedData = JSON.stringify(row);
    ////  var data = JSON.parse(SelectedData)
    ////  const index: number = this.selectedSalesOrderIds.indexOf(data.OrderId);
    ////  if (index !== -1) {
    ////    this.selectedSalesOrderIds.splice(index, 1);
    ////  }
    ////}

  }

  customSort(event) {

    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getSalesOrderDataList(this.SelectedTab);
  }

  customSort1(event) {

    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getSalesOrderDataList(this.SelectedTab);
  }

  CancelOrder() {

    if (this.selectedSalesOrderIds.length <= 0) {
      this.toastrService.error("Please select the order first then you will able to cancel order");
      return false;
    }

    this.orderManagementService.CancelOrder(this.selectedSalesOrderIds, this.SelectedTab).subscribe(data => {
      //if (data.message == "Success")
      //  this.toastrService.success("Orders Cancel successfully.");

      this.getSalesOrderDataList(this.SelectedTab);
      this.selectedSalesOrderIds = [];
    });

  }

  DeleteOrder() {
    if (this.selectedSalesOrderIds.length <= 0) {
      this.toastrService.error("Please select the order first then you will able to delete order");
      return false;
    }

    this.orderManagementService.DeleteOrder(this.selectedSalesOrderIds, this.SelectedTab).subscribe(data => {
      //if (data.message == "Success")
      //  this.toastrService.success("Orders Delete successfully.");

      this.getSalesOrderDataList(this.SelectedTab);
      this.selectedSalesOrderIds = [];
    });

  }

  tabClick(TabName: any) {
    //alert(TabName);

    //if (TabName.toLowerCase() == "outbound")
    //  this.isCustomer = false;
    //else
    //  this.isStockCollection = false;

    this.SelectedTab = TabName;
    this.getSalesOrderDataList(TabName);
    this.getPageSize(this.SelectedTab);
  }

  ConvertMoneyToDecimalPreferences(value: number) {
    var result = 0;
    if (value != undefined)
      return value.toFixed(this.decimalPreferences);
    else
      return result.toFixed(this.decimalPreferences);
  }

}
