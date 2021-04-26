import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { ResizeEvent } from 'angular-resizable-element';
import { regularOrderModel, OrderWorkbenchFilterModal } from '../../../../../core/models/regularOrder.model';
import { OrderHistoryService } from '../../../../../core/services/order-history.service';
import { ToastrService } from 'ngx-toastr';
import { PeriodicElementNew } from '../../order-workbench/order-workbench.component';
import { OrderManagementService } from '../../../../../core/services/order-management.service';

const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrls: ['./order-history-list.component.css']
})
export class OrderHistoryListComponent implements OnInit {

  selectRow: any;
  //Shipmentno: any;

  displayedColumns = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

  displayedColumns1 = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

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

  //displayedColumns = ['selectRow', 'Orderno', 'Ordtype', 'Status', 'Ordcon', 'Materdes', 'Quantity', 'Shipfromloc', 'Shipto', 'Schduleship', 'Requestdeliverydate', 'Mustarrive', 'Actualdeli', 'Carrier', 'Pono', 'Invoicenumber', 'Shipmentno', 'Orderamt', 'Source'];
  //displayedColumnsReplace = ['selectRow', 'key_OrderNo', 'key_Ordertype', 'key_Status', 'key_OrderCondition', 'key_MaterialDescription', 'key_Quantity', 'key_ShipFromLocation', 'key_Shipto', 'key_ScheduledShipDate', 'key_RequestedDeliveryDate', 'key_MustArriveByDate', 'key_ActualDeliveryDate', 'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt', 'key_Source' ];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //selection = new SelectionModel<PeriodicElement>(true, []);

  //list bind start
  dataSource;
  dataSourceIB;
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new regularOrderModel();
  orderHistoryFilterModal: OrderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
  filterValue = "";
  ELEMENT_DATA: PeriodicElementNew[] = [];
  SalesOrderDetailsBoth = [];
  decimalPreferences: number;
  MaxEditedRecordsCountPreferences: number;
  SalesOrderHistoryDetails = [];
  SalesOrderHistoryDetailsIB = [];
  data = [];
  SelectedTab: string;
  activeTab = 'outbound';
  isCustomer: boolean;
  isStockCollection: boolean;
  SelectedsalesOrderCount: number;
  selectedSalesOrderIds = [];
  @Input() buttonBar: any;
  isPaggingClick: boolean = false;
  ShipmentNumber: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.getSalesOrderHistoryDataList();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSourceIB.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        row.IsSelected = true;
        this.selection.select(row)

        const selectedsalesOrder = this.selection.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab }) => {
          return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab }
        });

        const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedsalesorders.length;

        this.orderManagementService.SalesOrderforEdit = [];
        this.orderManagementService.SalesOrderforEdit = selectedsalesorders;
        this.orderManagementService.SalesOrderSendToMass = [];
        //to manage check/Uncheck 
        this.selectedSalesOrderIds = [];
        if (selectedsalesorders.length > 0) {
          var k = 0;
          for (k = 0; k < selectedsalesorders.length; k++) {
            this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          }

        }

      });
  }

  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.dataSourceIB.data.forEach(row => {
        row.IsSelected = true;
        this.selection1.select(row)

        const selectedsalesOrder = this.selection1.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID }) => {
          return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID }
        });
        const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedsalesorders.length;

        this.orderManagementService.SalesOrderforEdit = [];
        this.orderManagementService.SalesOrderforEdit = selectedsalesorders;
        //to manage check/Uncheck
        this.selectedSalesOrderIds = [];
        if (selectedsalesorders.length > 0) {
          var k = 0;
          for (k = 0; k < selectedsalesorders.length; k++) {
            this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          }
        }

      });
  }

  constructor(
    private route: Router, private orderHistoryService: OrderHistoryService, private toastrService: ToastrService,
    private orderManagementService: OrderManagementService
  ) { }

  async ngOnInit() {
    this.ShipmentNumber = 'ShipmentNumber';
    this.selectRow = 'selectRow';
    // this.Shipmentno = 'Shipmentno';
    this.SelectedTab = 'outbound';
    this.paginationModel.sortOrder = "DESC";
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('issue');

    // default page size
    this.paginationModel.pageSize = await this.orderManagementService.getDefaultPageSize();

    this.isCustomer = true;
    this.isStockCollection = true;
    this.dataSource = new MatTableDataSource<regularOrderModel>();
    this.dataSourceIB = new MatTableDataSource<regularOrderModel>();

    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();
    this.MaxEditedRecordsCountPreferences = await this.orderManagementService.getMaxEditedRecordsCount();

    //if (this.orderManagementService.SelectTab == undefined || this.orderManagementService.SelectTab == "") {
    //  this.orderManagementService.SelectTab = "outbound";
    //}

    //if (!!this.orderManagementService.SelectTab) {
    //  this.paginationModel.sortOrder = "DESC";
    //  if (this.orderManagementService.SelectTab.toLowerCase() == "outbound") {
    //   // this.isEditTabBack = true;
    //    this.tabClick(this.orderManagementService.SelectTab.toLowerCase());
    //  } else if (this.orderManagementService.SelectTab.toLowerCase() == "inbound") {
    //   // this.isEditTabBack = true;
    //    this.tabClick(this.orderManagementService.SelectTab.toLowerCase());
    //  }
    //  this.selectRow = 'selectRow';
    //  this.orderManagementService.SelectTab = "";
    //}
    this.getSalesOrderHistoryDataList();

  }

  openShipHistory() {
    let url = '/shipment-management/shipment-history'
    this.route.navigate([url]);
    //window.open(url, '_blank')
  }

  selectedvalue(row, checked: boolean) {//row, event: Event, checked: boolean
    row.IsSelected = checked;

    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);

    if (this.SalesOrderHistoryDetails != undefined && this.SalesOrderHistoryDetails != null) {
      this.SalesOrderHistoryDetails.forEach(irow => {
        if (irow.OrderId == row.OrderId) {
          this.selection.toggle(irow);
        }
      });
      const selectedsalesOrder = this.selection.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab }
      });

      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedsalesorders.length;

      this.orderManagementService.SalesOrderforEdit = [];
      this.orderManagementService.SalesOrderforEdit = selectedsalesorders;
      this.orderManagementService.SalesOrderSendToMass = [];
      //this.orderManagementService.SelectTab = "";
      // this.orderManagementService.SelectTab = this.SelectedTab;
      //to manage check/Uncheck for cancel order array
      this.selectedSalesOrderIds = [];
      //this.CheckStatusForSendtoMassArr = [];
      //this.CheckStatusForReSendtoMassArr = [];
      if (selectedsalesorders.length > 0) {
        var k = 0;
        for (k = 0; k < selectedsalesorders.length; k++) {
          this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          localStorage.setItem('FromLocationId', row.FromLocationId);
          localStorage.setItem('ToLocationId', row.ToLocationID);
          localStorage.setItem('OrderType', row.OrderType);
          localStorage.setItem('OrderStatus', row.Status);
          localStorage.setItem('OrderNumber', row.OrderNumber);
          //this.CheckStatusForSendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType);
          //this.CheckStatusResendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType);
        }

      } else {
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);
        localStorage.setItem('OrderNumber', null);
        //this.buttonBar.disableAction('approveAndMas');
        //this.buttonBar.disableAction('resendToMas');
      }

    }
  }

  selectedvalueIB(row, checked: boolean) {
    row.IsSelected = checked;

    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);

    if (this.SalesOrderHistoryDetailsIB != undefined && this.SalesOrderHistoryDetailsIB != null) {
      this.SalesOrderHistoryDetailsIB.forEach(irow => {
        if (irow.OrderId == row.OrderId) { this.selection1.toggle(irow); }
      });
      const selectedsalesOrder = this.selection1.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID }
      });
      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedsalesorders.length;

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
          localStorage.setItem('OrderNumber', row.OrderNumber);

          //this.CheckStatusResendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType);
        }
      } else {
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);
        localStorage.setItem('OrderNumber', null);
        //this.buttonBar.disableAction('approveAndMas');
        //this.buttonBar.disableAction('resendToMas');
      }
    }
  }

  getSalesOrderHistoryDataList() {
    this.selection.clear();
    this.selection1.clear();

    if (!this.isPaggingClick)
      this.paginationModel.filterOn = this.filterValue;

    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.LocationType = "Customer";
    this.paginationModel.RoleName = "SalesManager";
    this.paginationModel.InboundOutbound = this.SelectedTab;// tabName;
    this.paginationModel.orderWorkbenchFilterModal = this.orderHistoryFilterModal;
    this.paginationModel.itemsLength = 0;

    this.orderHistoryService.GetSalesOrderHistoryDetailList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = [];
        this.ELEMENT_DATA = [];
        this.SalesOrderDetailsBoth = [];
        //this.SalesOrderDetailsBoth = result.data;   
        result.data.forEach((value, index) => {
          this.ELEMENT_DATA.push({
            OrderId: value.orderId,
            OrderNumber: value.orderNumber + '.' + value.orderVersionNumber,
            OrderType: value.orderTypeName,//value.orderType,
            TotalOrderQuantity: value.totalOrderQuantity,
            ScheduledShipDate: value.scheduledShipDate != null ? this.setDateMMddyyyy(value.scheduledShipDate) : null,
            RequestedDeliveryDate: value.requestedDeliveryDate != null ? this.setDateMMddyyyy(value.requestedDeliveryDate) : null,
            MustArriveByDate: value.mustArriveByDate != null ? this.setDateMMddyyyy(value.mustArriveByDate) : null,
            ActualDeliveryDate: value.actualDeliveryDate != null ? this.setDateMMddyyyy(value.actualDeliveryDate) : null,
            Carrier: value.carrier,
            InvoiceNumber: value.invoiceNo,
            ShipmentNumber: value.shipmentNumber != null ? (value.shipmentNumber + '.' + value.shipmentVersion) : "",
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
            BOL: value.shipWithOrderID != 0 ? "Yes" : "No",
            OrderCondition: value.orderCondition,
            Status: value.orderStatus,
            MaterialDescription: value.materialDescription,
            OrderQuantity: (value.totalOrderQuantity != null && value.totalOrderQuantity != "") ? formatter.format(value.totalOrderQuantity) : "",
            ShipmentQuantity: (value.shipmentQuantity != null && value.shipmentQuantity != "") ? formatter.format(value.shipmentQuantity) : "",
            ShipFromLocation: value.fromLocation,
            ShipToLocation: value.toLocation,
            OrderAmount: this.ConvertMoneyToDecimalPreferences(Number(value.orderAmount)),
            ShipmentId: value.shipmentId,
            OrderTypeId: value.orderId,
            CustomerPriority : ''
          })
        })
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.dataSource = new MatTableDataSource<PeriodicElementNew>();
          this.dataSource.data = this.ELEMENT_DATA;
          this.paginationModel.itemsLength = result.recordCount;
          this.SalesOrderHistoryDetails = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
          this.SalesOrderDetailsBoth = this.ELEMENT_DATA;
          //this.outboundtab.nativeElement.classList.remove('active');
          //this.outboundtabDiv.nativeElement.classList.remove('active');
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.dataSourceIB = new MatTableDataSource<PeriodicElementNew>();
          this.dataSourceIB.data = this.ELEMENT_DATA;
          this.paginationModel.itemsLength = result.recordCount;
          this.SalesOrderDetailsBoth = this.ELEMENT_DATA;
          this.SalesOrderHistoryDetailsIB = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
        }
        this.isPaggingClick = false;
      }
      );

  }
  ConvertMoneyToDecimalPreferences(value: number) {
    var result = 0;
    if (value != undefined)
      return value.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    else
      return result.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  setDateMMddyyyy(date: Date) {
    date = new Date(date);
    return `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
  }

  tabClick(TabName: any) {
    this.orderManagementService.SelectTab = "";
    this.SelectedTab = TabName;
    this.getSalesOrderHistoryDataList();
    this.orderManagementService.SelectTab = TabName;
    this.search(TabName);
  }

  search(activeTab) {
    this.activeTab = activeTab;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getSalesOrderHistoryDataList();//this.SelectedTab
    }
  }

  customSort1(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getSalesOrderHistoryDataList();//this.SelectedTab
    }
  }

  onPaginationEvent(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderHistoryDataList();//this.SelectedTab
  }

  onPaginationEvent1(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderHistoryDataList();//this.SelectedTab
  }

  editShipment(action, row) {
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedShipmentId', row.ShipmentId);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    this.route.navigateByUrl('/shipment-management/shipment-workbench');
  }

}
export interface PeriodicElement {
  selectRow: string;
  Orderno: string;
  Ordtype: string;
  Status: string;
  Ordcon: string;
  Materdes: string;
  Quantity: string;
  Shipfromloc: string;
  Shipto: string;
  Schduleship: string;
  Requestdeliverydate: string;
  Mustarrive: string;
  Actualdeli: string;
  Carrier: string;
  Pono: string;
  Invoicenumber: string;
  Shipmentno: string;
  Orderamt: string;
  Source: string;

}


