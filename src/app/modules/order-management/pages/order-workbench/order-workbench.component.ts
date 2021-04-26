import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { FormControl } from '@angular/forms';
import { regularOrderModel, CommonOrderModel, OrderWorkbenchFilterModal } from '../../../../core/models/regularOrder.model';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { Id } from '../../../system-settings/freight-mode/map-equipment-type/map-equipment-type.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { UserRolesListViewModel } from '../../../../core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { projectkey } from '../../../../../environments/projectkey';
import { TopBtnGroupComponent } from '../../../../shared/components/top-btn-group/top-btn-group.component';
import { MatTabGroup } from '@angular/material/tabs';
import { confirmationpopup } from '../../../../shared/components/confirmation-popup/confirmation-popup.component';
import { MessageService } from '../../../../core/services/message.service';
import { TableFilterComponent } from '../../../../shared/components/table-filter/table-filter.component';
//import { CurrencyPipe } from '@angular/common';
//import { shipmentManagementComponent } from '../../../shipment-management/pages/shipment-management.component';
declare var $: any;
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
  OrderId: number;
  OrderNumber: string;
  OrderType: string;
  TotalOrderQuantity: number;
  ScheduledShipDate: string;
  RequestedDeliveryDate: string;
  MustArriveByDate: string;
  ActualDeliveryDate: string;
  Carrier: string;
  InvoiceNumber: number;
  ShipmentNumber: string;//number;
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
  OrderQuantity: string;
  ShipmentQuantity: string;
  ShipFromLocation: string;
  ShipToLocation: string;
  OrderAmount: string;
  ShipmentId: string;
  OrderTypeId: number;
  CustomerPriority: string;
}
export interface PeriodicElementManageFilter {
  Id: number;
  FilterName: string;
  DefaultFilter: string;
  FilterExpression: string;
  isEdited: boolean;
}
export interface Element {
  highlighted?: boolean;
}
export interface Element {
  highlighted1?: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [];
const ELEMENT_DATA1: PeriodicElement1[] = [];

const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

@Component({
  selector: 'app-order-workbench',
  templateUrl: './order-workbench.component.html',
  styleUrls: ['./order-workbench.component.css']
})
export class OrderWorkbenchComponent implements OnInit, AfterViewInit {
  orderWorkbenchFilterModal: OrderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };

  SalesOrderDetails: any = {};
  SalesOrderDetailsIB: any = {};
  editingSalesOrder: any;
  decimalPreferences: number;
  MaxEditedRecordsCountPreferences: number;
  SelectedsalesOrderCount: number;
  SalesOrderDetailsBoth: any = [];
  isEditByLink: boolean = false;

  //Globle Filter

  UOMData: any;
  SelectUOM: number;
  Equipmentvalidate: boolean;
  Ordervalidate: boolean;
  NewOrder: number;
  OrderTypeData: string[] = [];
  OrderTypeId: number;
  CarrierData: string[] = [];
  EquipmentTypeData: any;
  dataEquipmentType: any;
  OrderConditionDataList: any = [];
  SCarrierId: number;
  ShipFromTypeList = [];
  ShipToTypeList = [];
  MaterialData: any[] = [];
  ShippingMaterialDetails: any[] = [];
  ShipToList = [];
  LoctionFuntionToId: number;
  isDateExist = false;
  isScheduleDateExist = false;
  ShipFromList = [];
  ShipFromListTemp = [];
  ShipToListTemp = [];
  LoctionFuntionFromId: number;
  MaterialDataForAdjustCharges: any[] = [];
  MaterialDataForAdjustShipping: any[] = [];
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  settingsOrderType = {};
  OrderStatusData = [];
  SalesManagersData: string[] = [];
  userRolesListViewModel: UserRolesListViewModel = new UserRolesListViewModel();
  InvoiceNoList = [];
  AllVersionDataList = [{ id: 0, name: 'All Version' }, { id: 1, name: 'Latest Version' }];
  SourceData: string[] = [];
  SalesOrderSendToMass: any[] = [];
  SalesOrderReSendToMass: any[] = [];
  SelectTab: string;
  FilterName: string;
  DefaultFilter: boolean = false;
  isEditMode = false;
  selectedCustomFilterMethodMapping: PeriodicElementManageFilter;
  //CustomFilterListSelectedItems: [];
  FilterNameEdit: string;
  DefaultFilterEdit: boolean = false;
  IsEditDelete: boolean = true;
  IsSaveCancel: boolean = false;
  CustomFilterId: number;
  modalRef: NgbModalRef;
  activeTab = 'outbound';
  @Output()
  EdittedOrderNumberLink: EventEmitter<any> = new EventEmitter<any>();
  //selectedOrderIdLink: number;
  orderWorkbenchHasReadOnlyAccess: boolean = false;
  ControlPermissions: any = [];
  isCustomerdisabled: boolean = false;
  isStockAndCollectiondisabled: boolean = false;
  isReadAndModifyForBtn: boolean = false;
  isOrderWorkbenchScreen: boolean = false;
  AllToasterMessage: any = [];
  SameShipmentNoOrder = [];
  isShipmentNumber: boolean = true;
  optionbtn: string;
  LinkOrders = [];


  //material table code
  displayedColumns = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'CustomerPriority', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

  displayedColumns1 = ['selectRow', 'OrderNumber', 'OrderType', 'Status', 'OrderCondition', 'MaterialDescription', 'OrderQuantity', 'ShipmentQuantity',
    'ShipFromLocation', 'ShipToLocation', 'CustomerPriority', 'SalesManager', 'BOL', 'ScheduledShipDate',
    'RequestedDeliveryDate', 'MustArriveByDate', 'ActualDeliveryDate',
    'Carrier', 'PurchaseOrderNumber', 'InvoiceNumber', 'ShipmentNumber', 'OrderAmount', 'Source'];

  ManageFilterdisplayedColumns = ['selectRow', 'FilterName', 'DefaultFilter'];
  ManageFilterdisplayedColumnsReplace = ['selectRow', 'FilterName', 'DefaultFilter'];

  dataSource;
  dataSourceIB;
  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  paginationModel = new regularOrderModel();
  filterValue = "";
  isPaggingClick: boolean = false;

  ManageFilterdS;
  CustomFilterItemList = [];
  selectedOrderId: number;
  isTruckOrderNotUsed: boolean = false;
  isOrderSentToMAS: boolean = false;
  selectedOrderTypeId: number;



  // code for searchable dropdown with checkbox

  constructor(private router: Router, private orderManagementService: OrderManagementService, private authservices: AuthService, private toastrService: ToastrService, public modalService: NgbModal, private messageServices: MessageService) {

    if (localStorage.SelectedOrderIdLink != undefined && localStorage.SelectedOrderIdLink != null)
      this.selectedOrderId = parseInt(localStorage.SelectedOrderIdLink);
    //this.selectedOrderTypeId = parseInt(localStorage.SelectedOrderTypeIdLink);
    if (this.selectedOrderId != 0 && !isNaN(this.selectedOrderId) && this.selectedOrderId != undefined && this.selectedOrderId != null) {
      this.SelectedTab = localStorage.SelectedTab;
    }
  }
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
  @Input() buttonBar: any;
  ShipmentNumber: any;
  ManageFilter_ELEMENT_DATA: PeriodicElementManageFilter[] = [];
  isEditTabBack: boolean = false;
  isTabClickHitOnLoad: boolean = false;
  selectedOrderTypeIds = [];


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
    this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
    this.orderManagementService.SalesOrderforEditLinkOrders = [];
    this.isOrderWorkbenchScreen = true;
    this.buttonBar.disableAction('calculate');
    this.buttonBar.disableAction('orderCancel');
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('edit');
    this.buttonBar.disableAction('copy');
    ////this.isCustomer = true;
    ////this.isStockCollection = true;
    this.ShipmentNumber = 'ShipmentNumber';
    this.paginationModel.sortOrder = "DESC";
    ////this.SelectedTab = 'outbound';
    ////await this.getPageSize(this.SelectedTab);

    // default page size
    this.paginationModel.pageSize = await this.orderManagementService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);



    this.isCustomer = false;
    this.isStockCollection = false;
    this.getPageControlsPermissions();


    //setTimeout(() => {
    //  if (!isNaN(this.selectedOrderId)) {
    //    this.editOrderNoLinkChange(this.selectedOrderId);
    //  }
    //}, 2000);

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

    //this.settings = {
    //  singleSelection: true,
    //  text: "Select",
    //  selectAllText: 'Select All',
    //  unSelectAllText: 'UnSelect All',
    //  enableSearchFilter: true,
    //  addNewItemOnFilter: true,
    //  badgeShowLimit: 1,
    //  searchBy: ['itemName']
    //};

    this.selectedItemsCheck = [];


    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();
    this.MaxEditedRecordsCountPreferences = await this.orderManagementService.getMaxEditedRecordsCount();

    this.dataSource = new MatTableDataSource<regularOrderModel>();
    this.dataSourceIB = new MatTableDataSource<regularOrderModel>();

    //// this.getSalesOrderDataList(this.SelectedTab);


    this.editingSalesOrder = this.orderManagementService.EditingSalesOrder;

    this.ManageFilterdS = new MatTableDataSource<regularOrderModel>();

    //Globle Filter
    this.BindPreLoadDataOnPage();

    // searchable dropdown end

    this.GetCustomManageFilters();
    
    if (this.orderManagementService.SelectTab == undefined || this.orderManagementService.SelectTab == "") {
      this.orderManagementService.SelectTab = "outbound";
    }

    if (!!this.orderManagementService.SelectTab) {
      this.paginationModel.sortOrder = "DESC";
      if (this.orderManagementService.SelectTab.toLowerCase() == "outbound") {
        this.isEditTabBack = true;
        this.tabClick(this.orderManagementService.SelectTab.toLowerCase());
      } else if (this.orderManagementService.SelectTab.toLowerCase() == "inbound") {
        this.isEditTabBack = true;
        this.tabClick(this.orderManagementService.SelectTab.toLowerCase());
      }
      this.selectRow = 'selectRow';
      this.orderManagementService.SelectTab = "";
    }

    this.buttonPermission();
    this.GetAllNotificationMessage();
  }

  onPaginationEvent(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderDataList(this.SelectedTab);
  }

  onPaginationEvent1(event) {
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getSalesOrderDataList(this.SelectedTab);
  }

  //async getPageSize(tabName) {
  //  this.selection.clear();
  //  this.paginationModel.filterOn = this.filterValue;
  //  var ClientId = parseInt(localStorage.clientId);
  //  this.paginationModel.ClientId = ClientId;
  //  this.paginationModel.LocationType = "Customer";
  //  this.paginationModel.RoleName = "SalesManager";
  //  this.paginationModel.InboundOutbound = tabName;// "outbound";
  //  this.orderManagementService.GetSalesOrderListDataCount(this.paginationModel)
  //    .subscribe(result => {
  //      this.paginationModel.itemsLength = result.recordCount;
  //    }
  //    );

  //  // default page size
  //  this.paginationModel.pageSize = await this.orderManagementService.getDefaultPageSize();
  //  this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);

  //}

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
    'key_Shipto', 'key_CustomerPriority', 'key_Salesmanager', 'key_ShipWith', 'key_ScheduledShipDate',
    'key_RequestedDeliveryDate', 'key_mabd', 'key_ActualDeliveryDate',
    'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt', 'key_Source'];
  displayedColumnsReplaceIB = ['selectRow', 'key_OrderNo', 'key_Ordertype',
    'key_Status', 'key_OrderCondition', 'key_MaterialDescription',
    'key_OrderQuantity', 'key_ShippedQty',
    'key_ShipFromLocation', 'key_Shipto', 'key_CustomerPriority', 'key_Salesmanager', 'key_ShipWith',
    'key_ScheduledShipDate',
    'key_RequestedDeliveryDate', 'key_mabd', 'key_ActualDeliveryDate',
    'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt',
    'key_Source'];

  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('outboundtab') outboundtab: ElementRef;
  @ViewChild('outboundtabDiv') outboundtabDiv: ElementRef;

  @ViewChild(TableFilterComponent) eqList: TableFilterComponent;

  //For Permission Module
  //@ViewChild('tabGroupA') tabGroup: MatTabGroup;
  //@ViewChild('btnBar') btnBar: TopBtnGroupComponent;

  @Output('selectedCharges') selectedCharges = new EventEmitter<regularOrderModel[]>();

  ngAfterViewInit() {
    this.buttonBar.disableAction('approveAndMas');
    this.buttonBar.disableAction('resendToMas');
    this.paginator.showFirstLastButtons = true;
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
  highlight1(element: Element) {
    element.highlighted1 = !element.highlighted1;
  }

  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSourceIB.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        row.IsSelected = true;
        this.selection.select(row)

        const selectedsalesOrder = this.selection.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
          return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
        });

        const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedsalesorders.length;

        if (selectedsalesorders.length > 0 && this.isReadAndModifyForBtn)
          this.buttonBar.enableAction('calculate');
        else
          this.buttonBar.disableAction('calculate');

        this.orderManagementService.SalesOrderforEdit = [];
        this.orderManagementService.SalesOrderforEdit = selectedsalesorders;
        this.orderManagementService.SalesOrderSendToMass = [];
        //to manage check/Uncheck 
        this.selectedSalesOrderIds = [];
        this.selectedOrderTypeIds = [];
        this.CheckStatusForSendtoMassArr = [];
        this.CheckStatusForReSendtoMassArr = [];
        if (selectedsalesorders.length > 0) {
          var k = 0;
          for (k = 0; k < selectedsalesorders.length; k++) {
            this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
            this.selectedOrderTypeIds.push(selectedsalesorders[k].OrderTypeId);

            //Disable all the fields and buttons on edit screen if order type is "Truck Order Not Used" for all customer and stock "22287"
            if (selectedsalesorders[k].OrderCondition.trim() == "Truck Order Not Used") {
              this.isTruckOrderNotUsed = true;
              this.buttonBar.disableAction('save');
              this.buttonBar.disableAction('saveAndNotify');
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('orderCancel');
              this.buttonBar.disableAction('approveAndMas');
              this.buttonBar.disableAction('resendToMas');
              this.buttonBar.disableAction('calculate');
              this.buttonBar.disableAction('shipWith');
              this.buttonBar.disableAction('export');
            }

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
        const selectedsalesOrder = this.selection1.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
          return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
        });
        const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

        this.SelectedsalesOrderCount = 0;
        this.SelectedsalesOrderCount = selectedsalesorders.length;

        //this functionality not work for stock
        //if (selectedsalesorders.length > 0)
        //  this.buttonBar.enableAction('calculate');
        //else
        this.buttonBar.disableAction('calculate');

        this.orderManagementService.SalesOrderforEdit = [];
        this.orderManagementService.SalesOrderforEdit = selectedsalesorders;

        //to manage check/Uncheck 
        this.selectedSalesOrderIds = [];
        this.selectedOrderTypeIds = [];
        if (selectedsalesorders.length > 0) {
          var k = 0;
          for (k = 0; k < selectedsalesorders.length; k++) {
            this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);

            //Disable all the fields and buttons on edit screen if order type is "Truck Order Not Used" for all customer and stock "22287"
            if (selectedsalesorders[k].OrderCondition.trim() == "Truck Order Not Used") {
              this.isTruckOrderNotUsed = true;
              this.buttonBar.disableAction('save');
              this.buttonBar.disableAction('saveAndNotify');
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('orderCancel');
              this.buttonBar.disableAction('approveAndMas');
              this.buttonBar.disableAction('resendToMas');
              this.buttonBar.disableAction('calculate');
              this.buttonBar.disableAction('shipWith');
              this.buttonBar.disableAction('export');
            }
            //To freeze order that are status as "TransferOrderShippedandInventorySentToMAS" for stock and collection only "22288"
            if ((selectedsalesorders[k].OrderType.trim() == "Stock Transfer" || selectedsalesorders[k].OrderType.trim() == "Collections") && (selectedsalesorders[k].Status.trim() == "Shipped Inventory And AR Charges Sent To MAS")) {
              this.isOrderSentToMAS = true;
              this.buttonBar.disableAction('save');
              this.buttonBar.disableAction('saveAndNotify');
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('orderCancel');
              this.buttonBar.disableAction('approveAndMas');
              this.buttonBar.disableAction('resendToMas');
              this.buttonBar.disableAction('calculate');
              this.buttonBar.disableAction('shipWith');
              this.buttonBar.disableAction('export');
            }
          }
        }
      });
  }
  setDateMMddyyyy(date: Date) {
    date = new Date(date);
    return `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
  }


  getSalesOrderDataList(tabName: any) {
    this.selection.clear();
    this.selection1.clear();

    if (!this.isPaggingClick)
      this.paginationModel.filterOn = this.filterValue;

    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.paginationModel.LocationType = "Customer";
    this.paginationModel.RoleName = "SalesManager";
    this.paginationModel.InboundOutbound = tabName;
    this.paginationModel.orderWorkbenchFilterModal = this.orderWorkbenchFilterModal;
    this.paginationModel.itemsLength = 0;

    this.orderManagementService.GetSalesOrderDetailList(this.paginationModel)
      .subscribe(result => {
        console.log("getSalesOrderDataList calling refresh method on order screen success R");

        this.dataSource.data = [];
        this.ELEMENT_DATA = [];
        this.SalesOrderDetailsBoth = [];
        //this.SalesOrderDetailsBoth = result.data;   
        result.data.forEach((value, index) => {
          this.ELEMENT_DATA.push({
            OrderId: value.orderId,
            OrderNumber: value.orderNumber + '.' + value.orderVersionNumber,
            OrderType: value.orderType,
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
            BOL: value.shipWithOrderID != 0 ? "Yes" : "No", // value.showOnBOL,
            OrderCondition: value.orderCondition,
            Status: value.orderStatus,
            MaterialDescription: value.materialDescription,
            OrderQuantity: (value.totalOrderQuantity != null && value.totalOrderQuantity != "") ? formatter.format(value.totalOrderQuantity) : "",
            ShipmentQuantity: (value.shipmentQuantity != null && value.shipmentQuantity != "") ? formatter.format(value.shipmentQuantity) : "",
            ShipFromLocation: value.fromLocation,
            ShipToLocation: value.toLocation,
            OrderAmount: this.ConvertMoneyToDecimalPreferences(Number(value.orderAmount)),
            ShipmentId: value.shipmentId,
            OrderTypeId: value.orderTypeId,
            CustomerPriority: value.customerPriority
          })
        })
        if (this.paginationModel.InboundOutbound == "outbound") {
          this.dataSource = new MatTableDataSource<PeriodicElementNew>();
          this.dataSource.data = this.ELEMENT_DATA;
          this.paginationModel.itemsLength = result.recordCount;
          this.SalesOrderDetails = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
          this.SalesOrderDetailsBoth = this.ELEMENT_DATA;
          if (this.outboundtab != undefined)
            this.outboundtab.nativeElement.classList.remove('active');
          if (this.outboundtabDiv != undefined)
            this.outboundtabDiv.nativeElement.classList.remove('active');
        }
        else if (this.paginationModel.InboundOutbound == "inbound") {
          this.dataSourceIB = new MatTableDataSource<PeriodicElementNew>();
          this.dataSourceIB.data = this.ELEMENT_DATA;
          this.paginationModel.itemsLength = result.recordCount;
          this.SalesOrderDetailsBoth = this.ELEMENT_DATA;
          this.SalesOrderDetailsIB = this.ELEMENT_DATA;
          this.data = Object.assign(this.ELEMENT_DATA);
        }
        this.isPaggingClick = false;
        if (!isNaN(this.selectedOrderId)) {
          this.editOrderNoLinkChange(this.selectedOrderId);
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

  }
  onSelectionChangeCustomFilter(row: OrderManagementService, event: Event, checked: boolean) {
    //to handle custom filter
    if (row.isEdited != true) {
      this.CustomFilterId = row.Id;
      this.ManageFilterdS.data.forEach(row => { row.isSelected = false; });
      row.isSelected = checked;
      this.selection.toggle(row);
    }
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

  public CheckStatusForSendtoMassArr: any = [];
  public CheckStatusForReSendtoMassArr: any = [];

  selectedvalue(row, checked: boolean) {
    row.IsSelected = checked;
    this.SameShipmentNoOrder = [];
    this.LinkOrders = [];

    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    this.isTruckOrderNotUsed = false;
    if (this.SalesOrderDetails != undefined && this.SalesOrderDetails != null) {
      this.selection.toggle(row);
      this.SalesOrderDetails.forEach(irow => {
        ////var isAdded = false;
        //////also selected all diverted order with same shipment no.
        ////if (irow.OrderId == row.OrderId || ((irow.ShipmentNumber != null && irow.ShipmentNumber != "") && irow.ShipmentNumber.trim() == row.ShipmentNumber.trim())) {
        //// this.selection.toggle(irow);
        ////  isAdded = true;
        ////}


        //also selected all diverted order with same shipment no.(No need to display it on List screen but nedd to show this on edit screen)
        if ((irow.ShipmentNumber != null && irow.ShipmentNumber != "") && irow.ShipmentNumber.trim() == row.ShipmentNumber.trim() && this.selection.selected.length > 0) {
          this.SameShipmentNoOrder.push(irow);
          const selectedsalesOrderSameShipment = this.SameShipmentNoOrder.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
            return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
          });
          const selectedSalesoOrdersSameShipment = selectedsalesOrderSameShipment.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
          this.orderManagementService.SalesOrderforEditSameShipmentNo = selectedSalesoOrdersSameShipment
        }
        else if (this.selection.selected.length == 0) {
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
        }

        //need to show all link order on edit screen (No need to display it on List screen but nedd to show this on edit screen)
        var orderNo = '';
        if ((row.LinkOrders != null && row.LinkOrders != "") && this.selection.selected.length > 0) {
          var res = row.LinkOrders.split(",");
          var i;
          for (i = 0; i < res.length; i++) {
            orderNo = res[i];
            if (irow.OrderNumber.trim() == orderNo.trim()) {
              this.LinkOrders.push(irow);
              orderNo = "";
            }
          }
          const selectedSalesOrderLinkOrder = this.LinkOrders.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
            return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
          });
          const selectedSalesOrdersLinkOrder = selectedSalesOrderLinkOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
          this.orderManagementService.SalesOrderforEditLinkOrders = selectedSalesOrdersLinkOrder
        }
        else if (this.selection.selected.length == 0) {
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
        }

        ////also selected all link order with ship with (No need to select link order bydefault 4 march)
        ////var orderNo = '';
        ////if (row.LinkOrders != null && row.LinkOrders != "") {
        ////  var res = row.LinkOrders.split(",");
        ////  var i;
        ////  for (i = 0; i < res.length; i++) {
        ////    orderNo = res[i];
        ////    if (irow.OrderNumber.trim() == orderNo.trim()) {
        ////      this.selection.toggle(irow);
        ////      orderNo = "";
        ////    }
        ////  }
        ////}

      });

      this.EnableDisableDeleteBtnOnSelection(this.selection.selected);
      this.EnableDisableCancelBtnOnSelection(this.selection.selected);
      const selectedsalesOrder = this.selection.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
      });

      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedsalesorders.length;

      if (selectedsalesorders.length > 0 && this.isReadAndModifyForBtn) {
        this.buttonBar.enableAction('edit');
        this.buttonBar.enableAction('copy');
        this.buttonBar.enableAction('calculate');
      }
      else {
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
      }

      this.orderManagementService.SalesOrderforEdit = [];
      this.orderManagementService.SalesOrderforEdit = selectedsalesorders;
      this.orderManagementService.SalesOrderSendToMass = [];

      //to manage check/Uncheck for cancel order array
      this.selectedSalesOrderIds = [];
      this.selectedOrderTypeIds = [];
      this.CheckStatusForSendtoMassArr = [];
      this.CheckStatusForReSendtoMassArr = [];
      if (selectedsalesorders.length > 0) {
        var k = 0;
        for (k = 0; k < selectedsalesorders.length; k++) {
          this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          this.selectedOrderTypeIds.push(selectedsalesorders[k].OrderTypeId);
          localStorage.setItem('FromLocationId', row.FromLocationId);
          localStorage.setItem('ToLocationId', row.ToLocationID);
          localStorage.setItem('OrderType', row.OrderType);
          localStorage.setItem('OrderStatus', row.Status);
          localStorage.setItem('OrderNumber', row.OrderNumber);
          //Disable all the fields and buttons on edit screen if order type is "Truck Order Not Used" for all customer and stock "22287"
          if (selectedsalesorders[k].OrderCondition.trim() == "Truck Order Not Used") {
            this.isTruckOrderNotUsed = true;
            this.buttonBar.disableAction('save');
            this.buttonBar.disableAction('saveAndNotify');
            this.buttonBar.disableAction('delete');
            this.buttonBar.disableAction('orderCancel');
            this.buttonBar.disableAction('approveAndMas');
            this.buttonBar.disableAction('resendToMas');
            this.buttonBar.disableAction('calculate');
            this.buttonBar.disableAction('shipWith');
            this.buttonBar.disableAction('export');
          }
          //To Disable ship with button
          this.buttonBar.enableAction('shipWith');
          if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "customer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "cpu order" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "stock transfer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "collections")
            && (selectedsalesorders[k].Status.trim().toLowerCase() != "open order needs to be completed")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "customer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "cpu order") && (selectedsalesorders[k].FromLocationId == null || selectedsalesorders[k].FromLocationId == "")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "stock transfer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "collections") && (selectedsalesorders[k].ToLocationID == null || selectedsalesorders[k].ToLocationID == "")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if (this.isTruckOrderNotUsed)
            this.buttonBar.disableAction('shipWith');

          this.CheckStatusForSendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType, selectedsalesorders[k].Status);
          this.CheckStatusResendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType);
        }

      } else {
        this.buttonBar.disableAction('shipWith');
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);
        localStorage.setItem('OrderNumber', null);
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
      }

    }
  }

  //GetShipmentNoRecords() {
  //  this.isShipmentNumber = true;
  //  for (var i = 0; i < this.selection.selected.length; i++) {
  //    if (this.selection.selected[i].ShipmentNumber == "" || this.selection.selected[i].ShipmentNumber == null)
  //      this.isShipmentNumber = false;
  //  }
  //}

  selectedvalueIB(row, checked: boolean) {
    row.IsSelected = checked;
    this.SameShipmentNoOrder = [];
    this.LinkOrders = [];
    localStorage.setItem('SelectedOrderId', row.OrderId);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    this.isTruckOrderNotUsed = false;
    this.isOrderSentToMAS = false;

    if (this.SalesOrderDetailsIB != undefined && this.SalesOrderDetailsIB != null) {
      this.selection1.toggle(row);
      this.SalesOrderDetailsIB.forEach(irow => {

        ////var isAdded = false;
        //////also selected all diverted order with same shipment no.
        ////if (irow.OrderId == row.OrderId || ((irow.ShipmentNumber != null && irow.ShipmentNumber != "") && irow.ShipmentNumber.trim() == row.ShipmentNumber.trim())) {
        ////  this.selection1.toggle(irow);
        ////  isAdded = true;
        ////}

        //also selected all diverted order with same shipment no.(No need to display it on List screen but nedd to show this on edit screen)
        if ((irow.ShipmentNumber != null && irow.ShipmentNumber != "") && irow.ShipmentNumber.trim() == row.ShipmentNumber.trim() && this.selection1.selected.length > 0) {
          this.SameShipmentNoOrder.push(irow);
          const selectedsalesOrderSameShipment = this.SameShipmentNoOrder.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
            return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
          });
          const selectedSalesoOrdersSameShipment = selectedsalesOrderSameShipment.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
          this.orderManagementService.SalesOrderforEditSameShipmentNo = selectedSalesoOrdersSameShipment
        }
        else if (this.selection1.selected.length == 0) {
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
        }

        //need to show all link order on edit screen (No need to display it on List screen but nedd to show this on edit screen)
        var orderNo = '';
        if ((row.LinkOrders != null && row.LinkOrders != "") && this.selection1.selected.length > 0) {
          var res = row.LinkOrders.split(",");
          var i;
          for (i = 0; i < res.length; i++) {
            orderNo = res[i];
            if (irow.OrderNumber.trim() == orderNo.trim()) {
              this.LinkOrders.push(irow);
              orderNo = "";
            }
          }
          const selectedSalesOrderLinkOrder = this.LinkOrders.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
            return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, SelectedTab, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
          });
          const selectedSalesOrdersLinkOrder = selectedSalesOrderLinkOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));
          this.orderManagementService.SalesOrderforEditLinkOrders = selectedSalesOrdersLinkOrder
        }
        else if (this.selection1.selected.length == 0) {
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
        }

        //////also selected all link order with ship with
        ////var orderNo = '';
        ////if (row.LinkOrders != null && row.LinkOrders != "") {
        ////  var res = row.LinkOrders.split(",");
        ////  var i;
        ////  for (i = 0; i < res.length; i++) {
        ////    orderNo = res[i];
        ////    if (irow.OrderNumber.trim() == orderNo.trim()) {//&& isAdded == false
        ////      this.selection1.toggle(irow);
        ////      orderNo = "";
        ////    }
        ////  }
        ////}
      });

      this.EnableDisableDeleteBtnOnSelection(this.selection1.selected);
      this.EnableDisableCancelBtnOnSelection(this.selection1.selected);


      const selectedsalesOrder = this.selection1.selected.map(({ OrderId, OrderNumber, OrderStatus, OrderType, OrderID, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }) => {
        return { OrderId, OrderNumber, OrderStatus, OrderType, OrderID, OrderTypeId, ToLocationID, FromLocationId, Status, OrderCondition, ShipmentId, ShipmentStatus, ShipmentCondition }
      });
      const selectedsalesorders = selectedsalesOrder.filter((thing, index, self) => index === self.findIndex((t) => (t.OrderId === thing.OrderId)));

      this.SelectedsalesOrderCount = 0;
      this.SelectedsalesOrderCount = selectedsalesorders.length;

      //this functionality not work for stock
      if (selectedsalesorders.length > 0) {
        this.buttonBar.enableAction('edit');
        this.buttonBar.enableAction('copy');
      }
      else {
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
      }
      this.buttonBar.disableAction('calculate');

      this.orderManagementService.SalesOrderforEdit = [];
      this.orderManagementService.SalesOrderforEdit = selectedsalesorders;

      //to manage check/Uncheck for cancel order array
      this.selectedSalesOrderIds = [];
      this.selectedOrderTypeIds = [];
      if (selectedsalesorders.length > 0) {
        var k = 0;
        for (k = 0; k < selectedsalesorders.length; k++) {
          this.selectedSalesOrderIds.push(selectedsalesorders[k].OrderId);
          // this.selectedOrderTypeIds.push(selectedsalesorders[k].OrderTypeId);
          localStorage.setItem('FromLocationId', row.FromLocationId);
          localStorage.setItem('ToLocationId', row.ToLocationID);
          localStorage.setItem('OrderType', row.OrderType);
          localStorage.setItem('OrderStatus', row.Status);
          localStorage.setItem('OrderNumber', row.OrderNumber);
          //Disable all the fields and buttons on edit screen if order type is "Truck Order Not Used" for all customer and stock "22287"
          if (selectedsalesorders[k].OrderCondition.trim() == "Truck Order Not Used") {
            this.isTruckOrderNotUsed = true;
            this.buttonBar.disableAction('save');
            this.buttonBar.disableAction('saveAndNotify');
            this.buttonBar.disableAction('delete');
            this.buttonBar.disableAction('orderCancel');
            this.buttonBar.disableAction('approveAndMas');
            this.buttonBar.disableAction('resendToMas');
            this.buttonBar.disableAction('calculate');
            this.buttonBar.disableAction('shipWith');
            this.buttonBar.disableAction('export');
          }

          //To freeze order that are status as "TransferOrderShippedandInventorySentToMAS" for stock and collection only "22288"
          if ((selectedsalesorders[k].OrderType.trim() == "Stock Transfer" || selectedsalesorders[k].OrderType.trim() == "Collections") && (selectedsalesorders[k].Status.trim() == "Shipped Inventory And AR Charges Sent To MAS")) {
            this.isOrderSentToMAS = true;
            this.buttonBar.disableAction('save');
            this.buttonBar.disableAction('saveAndNotify');
            this.buttonBar.disableAction('delete');
            this.buttonBar.disableAction('orderCancel');
            this.buttonBar.disableAction('approveAndMas');
            this.buttonBar.disableAction('resendToMas');
            this.buttonBar.disableAction('calculate');
            this.buttonBar.disableAction('shipWith');
            this.buttonBar.disableAction('export');
          }
          //To Disable ship with button
          this.buttonBar.enableAction('shipWith');
          if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "customer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "cpu order" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "stock transfer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "collections")
            && (selectedsalesorders[k].Status.trim().toLowerCase() != "open order needs to be completed")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "customer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "cpu order") && (selectedsalesorders[k].FromLocationId == null || selectedsalesorders[k].FromLocationId == "")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if ((selectedsalesorders[k].OrderType.trim().toLowerCase() != "stock transfer" || selectedsalesorders[k].OrderType.trim().toLowerCase() != "collections") && (selectedsalesorders[k].ToLocationID == null || selectedsalesorders[k].ToLocationID == "")) {
            this.buttonBar.disableAction('shipWith');
          }
          else if (this.isTruckOrderNotUsed || this.isOrderSentToMAS)
            this.buttonBar.disableAction('shipWith');

          this.CheckStatusResendtoMass(selectedsalesorders[k].OrderId, selectedsalesorders[k].OrderType);
        }
      } else {
        this.buttonBar.disableAction('shipWith');
        localStorage.setItem('FromLocationId', null);
        localStorage.setItem('ToLocationId', null);
        localStorage.setItem('OrderType', null);
        localStorage.setItem('OrderStatus', null);
        localStorage.setItem('OrderNumber', null);
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
      }
    }
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getSalesOrderDataList(this.SelectedTab);
    }
  }

  customSort1(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getSalesOrderDataList(this.SelectedTab);
    }
  }

  CancelOrder() {
    if (this.selectedSalesOrderIds.length <= 0) {
      var messages = 'SelectOrderToCancel';
      if (this.AllToasterMessage != undefined) {
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }
      //this.toastrService.error("Please select the order first to cancel it");
      return false;
    }

    this.orderManagementService.CancelOrder(this.selectedSalesOrderIds, this.SelectedTab).subscribe(data => {
      if (data.message == "Success") {
        var messages = 'OrderCancelSuccessfully';
        if (this.AllToasterMessage != undefined) {
          var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
          this.toastrService.success(messagesData);
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
          this.selection.clear();
          this.selection1.clear();
        }
        //this.toastrService.success("Order Cancel successfully.");

        this.getSalesOrderDataList(this.SelectedTab);
        this.selectedSalesOrderIds = [];
        this.buttonBar.disableAction('delete');
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('orderCancel');
        this.buttonBar.disableAction('shipWith');
      }
    });

  }

  DeleteOrder() {
    if (this.selectedSalesOrderIds.length <= 0) {
      var messages = 'SelectOrderToDelete';
      if (this.AllToasterMessage != undefined) {
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }
      //this.toastrService.error("Please select the order first to delete it");
      return false;
    }

    this.orderManagementService.DeleteOrder(this.selectedSalesOrderIds, this.SelectedTab).subscribe(data => {
      if (data.message == "Success") {
        var messages = 'OrderDeletedSuccessfully';
        if (this.AllToasterMessage != undefined) {
          var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
          this.toastrService.success(messagesData);
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
          this.selection.clear();
          this.selection1.clear();
        }
        // this.toastrService.success("Order Deleted successfully.");

        this.getSalesOrderDataList(this.SelectedTab);
        this.selectedSalesOrderIds = [];
        this.buttonBar.disableAction('delete');
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('orderCancel');
        this.buttonBar.disableAction('shipWith');
      }
    });

  }

  tabClick(TabName: any) {
    this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
    this.orderManagementService.SalesOrderforEditLinkOrders = [];
    this.filterValue = "";
    if (this.eqList != undefined)
      this.eqList.pills = [];

    this.GetAllNotificationMessage();
    this.buttonBar.disableAction('orderCancel');
    this.buttonBar.disableAction('shipWith');
    this.buttonBar.disableAction('calculate');
    this.orderManagementService.SelectTab = "";
    this.SelectedTab = TabName;
    this.getSalesOrderDataList(TabName);
    //this.getPageSize(this.SelectedTab);
    this.orderManagementService.SelectTab = TabName;

    this.search(TabName);
  }
  search(activeTab) {
    this.activeTab = activeTab;
  }


  ConvertMoneyToDecimalPreferences(value: number) {
    var result = 0;
    if (value != undefined)
      return value.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    else
      return result.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");


    //if (value != undefined)
    //  return value.toFixed(this.decimalPreferences);
    //else
    //  return result.toFixed(this.decimalPreferences);
  }



  //Globle Filter Start
  BindPreLoadDataOnPage() {
    this.OrderTypeData = [];
    this.orderManagementService.OrderTypeList().pipe()
      .subscribe(
        result => {
          var datas = result.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderTypeData.push(value));
        });
    
    this.userRolesListViewModel.clientId = parseInt(localStorage.clientId);
    this.userRolesListViewModel.userId = parseInt(localStorage.userId);
    this.BindSalesManagersList(this.userRolesListViewModel);
    this.GetStatus();
    this.getShipFromType();
    this.OrderConditionList();
    this.getShipToType();
    this.BindAllFromShipLocation(1);
    this.bindDataForShipToType(6);
    //this.BindMaterialList();
    //this.getAllInvoiceNo();
    this.getSourceDataList();
  }

  GetStatus() {
    this.OrderStatusData = [];
    this.orderManagementService.OrderStatusAllList()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderStatusData.push(value));
        });
  }
  BindCarrierData() {
    this.CarrierData = [];
    this.orderManagementService.CarrierListAll()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
              // locationTypeCode: item.code
            };
          }).forEach(value => this.CarrierData.push(value));
        });
  }
  OrderConditionList() {
    this.orderManagementService.OrderConditionList()
      .subscribe(
        data => {
          var datas = data.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.OrderConditionDataList.push(value));
        });
  }

  getShipToType() {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);//this.orderManagement.ClientId;
    this.ShipToTypeList = [];
    this.orderManagementService.ShipToTypeAllData(this.commonOrderModel)
      .subscribe(result => {
        var datas = result.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id)
          };
        }).forEach(x => this.ShipToTypeList.push(x));
      });
  }

  bindDataForShipToType(shipto: number) {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.orderManagementService.ShipToLocationAllData(this.commonOrderModel)
      .subscribe(result => {
        var datas = result.data;
        this.ShipToList = [];
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id),
            locationFunctionID: item.locationFunctionID
          };
        }).forEach(x => this.ShipToListTemp.push(x));

        // No need to bind Ship From location on load, need to bind it on Ship from type selection
        //var datas = result.data;
        //this.ShipToList = [];
        //datas.map(item => {
        //  return {
        //    name: item.name,
        //    id: Number(item.id),
        //    locationFunctionID: item.locationFunctionID
        //  };
        //}).forEach(x => this.ShipToList.push(x));
        //this.ShipToListTemp = this.ShipToList;
      });
  }

  getShipFromType() {
    this.ShipFromTypeList = [];
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.orderManagementService.ShipFromTypeAllData(this.commonOrderModel)
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id)
          };
        }).forEach(value => this.ShipFromTypeList.push(value));
      });
  }

  BindMaterialList() {
    this.MaterialData = [];
    this.orderManagementService.GetMaterialList()
      .subscribe(
        result => {
          var datas = result.data;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(value => this.MaterialData.push(value));
        }
      );
  }
  BindSalesManagersList(userRolesListViewModel: UserRolesListViewModel) {
    this.orderManagementService.SalesManagersList("salesmanager")
      .subscribe(
        data => {
          var datas = data.Data;
          datas.map(item => {
            return {
              name: item.FirstName + " " + item.LastName,
              id: Number(item.Id)
            };
          }).forEach(value => this.SalesManagersData.push(value));
        });
  }
  BindAllFromShipLocation(LocationFunctionFromID) {
    this.commonOrderModel.ClientID = parseInt(localStorage.clientId);
    this.ShipFromList = [];
    this.orderManagementService.ShipFromLocationAllData(this.commonOrderModel).pipe()
      .subscribe(result => {
        var datas = result.data;
        datas.map(item => {
          return {
            name: item.name,
            id: Number(item.id),
            locationFunctionID: item.locationFunctionID
          };
        }).forEach(value => this.ShipFromListTemp.push(value));


        // No need to bind Ship From location on load, need to bind it on Ship from type selection
        //var datas = result.data;
        //datas.map(item => {
        //  return {
        //    name: item.name,
        //    id: Number(item.id),
        //    locationFunctionID: item.locationFunctionID
        //  };
        //}).forEach(value => this.ShipFromList.push(value));
        //this.ShipFromListTemp = this.ShipFromList;
      });
  }
 
  getAllInvoiceNo() {
    
    this.InvoiceNoList = [];
    this.orderManagementService.InvoiceDataList(parseInt(localStorage.clientId))
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.InvoiceNo,
            id: Number(item.ID)
          };
        }).forEach(value => this.InvoiceNoList.push(value));
      });
  }

  getSourceDataList() {
    this.SourceData = [];
    this.orderManagementService.SourceDataList(parseInt(localStorage.clientId))
      .subscribe(data => {
        var datas = data.data;
        datas.map(item => {
          return {
            name: item.Code,
            id: Number(item.Id)
          };
        }).forEach(value => this.SourceData.push(value));
      });
  }

  ApplyGlobalFilter() {

    if (this.orderWorkbenchFilterModal.ScheduledShipDateN != undefined && this.orderWorkbenchFilterModal.ReqDeliveryDateN != undefined) {
      if (this.orderWorkbenchFilterModal.ScheduledShipDateN.length > 0 && this.orderWorkbenchFilterModal.ReqDeliveryDateN.length > 0) {
        if (new Date(this.orderWorkbenchFilterModal.ScheduledShipDateN[0]) >= new Date(this.orderWorkbenchFilterModal.ReqDeliveryDateN[0])) {
          var messages = 'ScheduledSDGreaterthenRequestDD';
          if (this.AllToasterMessage != undefined) {
            var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
            this.toastrService.error(messagesData);
          }
          //this.toastrService.error("Scheduled ShipDate can not be greater then Request Delivery Date.");
          return;
        }
      }
    }

    this.getSalesOrderDataList(this.SelectedTab);

  }
  ResetGlobalFilter() {
    this.orderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
    this.orderWorkbenchFilterModal.ScheduledShipDateN = null;
    this.CustomFilterId = 0;
    this.getSalesOrderDataList(this.SelectedTab);
  }

  onScheduledShipDateChange(args) {
    this.orderWorkbenchFilterModal.ScheduledShipDateN = args.value;
  }
  onReqDeliveryDateChange(args) {
    this.orderWorkbenchFilterModal.ReqDeliveryDateN = args.value;
  }
  onMustArriveByDateChange(args) {
    this.orderWorkbenchFilterModal.MustArriveByDateN = args.value;
  }

  OnOrderTypeSelect(event) {
  }
  OnOrderTypeDeSelect(event) {
  }
  OnSalesManagersDeSelect(item: any) {
  }
  OnCarrierDeSelect(item: any) {
  }
  OnMaterialDeSelect(item: any) {
  }
  OnShipToDeSelect(item: any) {
  }
  OnShipToSelect(event) {
  }
  OnShipFromDeSelect(item: any) {
  }
  OnShipFromSelect(event) {
  }
  OnShipFromTypeDeSelect(item: any) {
    var tempArr = [];
    this.ShipFromList = [];
    //To DeSelect
    for (var i = 0; i < this.orderWorkbenchFilterModal.selectedShipFromTypeItems.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.orderWorkbenchFilterModal.selectedShipFromTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.ShipFromList = [];
    this.ShipFromList = tempArr;
  }

  OnShipFromTypeSelect(event) {
    var tempArr = [];
    this.ShipFromList = [];
    //To filter ship from location in tha bases of selected ship type value
    for (var i = 0; i < this.orderWorkbenchFilterModal.selectedShipFromTypeItems.length; i++) {
      for (var j = 0; j < this.ShipFromListTemp.length; j++) {
        if (this.ShipFromListTemp[j].locationFunctionID == this.orderWorkbenchFilterModal.selectedShipFromTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipFromListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipFromListTemp[j]);
        }
      }
    }
    this.ShipFromList = [];
    this.ShipFromList = tempArr;
  }
  OnShipToTypeDeSelect(item: any) {
    var tempArr = [];
    this.ShipToList = [];
    //To DeSelect
    for (var i = 0; i < this.orderWorkbenchFilterModal.selectedShipToTypeItems.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.orderWorkbenchFilterModal.selectedShipToTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.ShipToList = [];
    this.ShipToList = tempArr;
  }

  OnShipToTypeSelect(event) {
    var tempArr = [];
    this.ShipToList = [];
    //To filter ship to location in tha bases of selected ship type value
    for (var i = 0; i < this.orderWorkbenchFilterModal.selectedShipToTypeItems.length; i++) {
      for (var j = 0; j < this.ShipToListTemp.length; j++) {
        if (this.ShipToListTemp[j].locationFunctionID == this.orderWorkbenchFilterModal.selectedShipToTypeItems[i].id) {
          var target = tempArr.find(temp => temp.id == this.ShipToListTemp[j].id)
          if (!target)
            tempArr.push(this.ShipToListTemp[j]);
        }
      }
    }
    this.ShipToList = [];
    this.ShipToList = tempArr;
  }
  OnOrderConditionDeSelect(item: any) {
  }
  OnOrderConditionSelect(event) {
  }

  OnInvoiceNoDeSelect(item: any) {
  }
  OnInvoiceNoSelect(event) {
  }

  OnVersionDeSelect(item: any) {
  }
  OnVersionSelect(event) {
  }

  OnOrderStatusDeSelect(event) {
  }

  OnOrderStatusSelect(event) {
  }
  OnMaterialSelect(event) {
  }

  OnSalesManagersSelect(event) {
  }
  OnCarrierSelect(event) {
  }

  OnSourceSelect(event) {
  }
  OnSourceDeSelect(event) {
  }


  CopyOrder() {
    if (this.selectedSalesOrderIds.length <= 0) {
      var messages = 'SelectOrderToCopyOrder';
      if (this.AllToasterMessage != undefined) {
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }
      //this.toastrService.error("Please select the order first then you will able to Copy order");
      return false;
    }
    this.orderManagementService.CopyOrder(this.selectedSalesOrderIds,
      this.SelectedTab).subscribe(result => {
        var datas = result.data;
        if (datas.result == 1 || datas.result == 2) {
          var messages = 'CopyOrderSuccessfully';
          if (this.AllToasterMessage != undefined) {
            var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
            this.toastrService.success(messagesData);

            this.SameShipmentNoOrder = [];
            this.LinkOrders = [];
            this.orderManagementService.SalesOrderforEdit = [];
            this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
            this.orderManagementService.SalesOrderforEditLinkOrders = [];
            this.selection.clear();
            this.selection1.clear();


          }
          //this.toastrService.success("Copy order successfully.");
        }        

        this.getSalesOrderDataList(this.SelectedTab);
        this.selectedSalesOrderIds = [];
        this.buttonBar.disableAction('delete');
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('orderCancel');
        this.buttonBar.disableAction('shipWith');



      });

  }

  CheckStatusForSendtoMass(strOrdernumber: string, Ordertype: string, OrderStatus: string = null) {
    this.orderManagementService.GetCheckStatusForSendtoMass(strOrdernumber,
      Ordertype).subscribe(result => {
        var datas = result.data;
        this.CheckStatusForSendtoMassArr.push({ OrderID: strOrdernumber, Ordertype: Ordertype, Result: datas.result });

        let finddata = this.CheckStatusForSendtoMassArr.find(x => x.Result == 0);
        if (!!finddata) {
          this.buttonBar.disableAction('approveAndMas');

          //to enable approveAndMas button without any condition
          if ((Ordertype.trim() == 'Charge Order' || Ordertype.trim() == 'Credit Charge Order') && OrderStatus.trim() == 'Under Review') {
            if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
              this.buttonBar.enableAction('approveAndMas');
              let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
              this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
            }
          }
        }
        else if ((Ordertype.trim() == 'Charge Order' || Ordertype.trim() == 'Credit Charge Order') && OrderStatus.trim() == 'Under Review') {
          if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
            this.buttonBar.enableAction('approveAndMas');
            let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
            this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
          }
        }
        else if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0) {
          this.buttonBar.enableAction('approveAndMas');
          let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
          this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
        } else {
          this.buttonBar.disableAction('approveAndMas');
        }

      });

  }



  CheckStatusResendtoMass(strOrdernumber: string, Ordertype: string) {

    this.orderManagementService.GetCheckStatusReSendtoMass(strOrdernumber,
      Ordertype).subscribe(result => {
        var datas = result.data;
        this.CheckStatusForReSendtoMassArr.push({ OrderID: strOrdernumber, Ordertype: Ordertype, Result: datas.result });
        let finddata = this.CheckStatusForReSendtoMassArr.find(x => x.Result == 0);
        if (!!finddata) {
          this.buttonBar.disableAction('resendToMas');
        }
        else if (!!this.CheckStatusForReSendtoMassArr && this.CheckStatusForReSendtoMassArr.length > 0) {
          this.buttonBar.enableAction('resendToMas');
          let checkStatusForReSendtoMassArrData = this.CheckStatusForReSendtoMassArr.filter(x => x.Result == 1);
          this.orderManagementService.SalesOrderReSendToMass = checkStatusForReSendtoMassArrData;
        } else {
          this.buttonBar.disableAction('resendToMas');
        }
      });
  }



  SendARChargesTOMAS() {
    console.log("orderWorkbench.SendARChargesTOMAS() fire start on order screen  R");

    this.SalesOrderSendToMass = this.orderManagementService.SalesOrderSendToMass;
    if (this.SalesOrderSendToMass.length <= 0) {
      var messages = 'SelectOrderToSendOrderToMAS';
      if (this.AllToasterMessage != undefined) {
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }
      //this.toastrService.error("Please select the order first then you will able to send order to MAS");
      return false;
    }
    let selectedSalesOrdertypes = [];
    let selectedOrderIds = [];

    if (this.SalesOrderSendToMass.length > 0) {
      var k = 0;
      for (k = 0; k < this.SalesOrderSendToMass.length; k++) {
        selectedOrderIds.push(this.SalesOrderSendToMass[k].OrderID);
        selectedSalesOrdertypes.push(this.SalesOrderSendToMass[k].Ordertype)
      }
    }

    console.log("ApproveAndSendTOMAS fire start on order screen  R");

    this.orderManagementService.ApproveAndSendTOMAS(selectedOrderIds, selectedSalesOrdertypes).subscribe(data => {

      console.log("return success fire start on order screen  R");
      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
        var messages = 'RequestHasBeenSendToMASSuccessfully';
        if (this.AllToasterMessage != undefined) {
          var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
          this.toastrService.success(messagesData);
          console.log("RequestHasBeenSendToMASSuccessfully success msg on order screen  R");
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
          this.selection.clear();
          this.selection1.clear();

          console.log("RequestHasBeenSendToMASSuccessfully success msg1 on order screen  R");
        }
        // this.toastrService.success("Your request has been send to MAS Successfully.");

        console.log("getSalesOrderDataList calling refresh method on order screen start R");
        console.log("this.SelectedTab= " + this.SelectedTab);
        this.getSalesOrderDataList(this.SelectedTab);

        console.log("getSalesOrderDataList calling refresh method on order screen end  R");

        this.buttonBar.disableAction('delete');
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('orderCancel');
        this.buttonBar.disableAction('shipWith');
      }
    });
  }


  ReSendARChargesTOMAS() {
    var outresult = this.orderManagementService.SalesOrderReSendToMass;
    if (outresult.length <= 0) {
      var messages = 'SelectOrderToReSendOrderToMAS';
      if (this.AllToasterMessage != undefined) {
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }
      //this.toastrService.error("Please select the order first then you will able to Resend order to MAS");
      return false;
    }
    let selectedSalesOrdertypes = [];
    let selectedOrderIds = [];

    if (outresult.length > 0) {
      var k = 0;
      for (k = 0; k < outresult.length; k++) {
        selectedOrderIds.push(outresult[k].OrderID);
        selectedSalesOrdertypes.push(outresult[k].Ordertype)
      }
    }
    this.orderManagementService.ReApproveAndSendTOMAS(selectedOrderIds, selectedSalesOrdertypes).subscribe(data => {
      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
        var messages = 'RequestHasBeenReSendToMASSuccessfully';
        if (this.AllToasterMessage != undefined) {
          var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
          this.toastrService.success(messagesData);
          this.SameShipmentNoOrder = [];
          this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
          this.LinkOrders = [];
          this.orderManagementService.SalesOrderforEditLinkOrders = [];
          this.selection.clear();
          this.selection1.clear();
        }
        //this.toastrService.success("Your request has been Re-send to MAS Successfully.");
        this.buttonBar.disableAction('delete');
        this.buttonBar.disableAction('edit');
        this.buttonBar.disableAction('copy');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('orderCancel');
        this.buttonBar.disableAction('shipWith');
      }
    });
  }
  editShipment(action, row) {
    localStorage.SelectedTab = null;
    localStorage.setItem('SelectedShipmentId', row.ShipmentId);
    localStorage.setItem('SelectedTab', this.SelectedTab);
    this.router.navigateByUrl('/shipment-management/shipment-workbench');
  }
  CreateNewFilter() {
    if (this.FilterName != null && this.FilterName != "") {

      var RequestObject = {
        FilterName: this.FilterName,
        IsDefault: this.DefaultFilter,
        FilterExpression: JSON.stringify(this.orderWorkbenchFilterModal),
        UserID: this.authservices.currentUserValue.UserId,
        ClientID: this.authservices.currentUserValue.ClientId,
        SelectedTab: this.SelectedTab
      };
      this.orderManagementService.CreateManageFilter(RequestObject)
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

    this.orderManagementService.GetAllCustomManageFilters(this.authservices.currentUserValue.ClientId, this.authservices.currentUserValue.UserId, this.SelectedTab)
      .subscribe(
        data => {
          var result = data.data;
          this.CustomFilterId = 0;
          this.ManageFilterdS.data = [];
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
          this.ManageFilterdS = new MatTableDataSource<PeriodicElementManageFilter>();
          this.ManageFilterdS.data = this.ManageFilter_ELEMENT_DATA;
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
                this.orderWorkbenchFilterModal = JSON.parse(value.FilterExpression);
                this.getSalesOrderDataList(this.SelectedTab);
                return;
              }
            })
          }
        });
  }

  ApplyCustomFilterChange(event) {
    if (event.target.value != undefined) {
      this.orderWorkbenchFilterModal = new OrderWorkbenchFilterModal();
      var SelectedFilterObj = this.CustomFilterItemList.find(f => f.Id == Number(event.target.value));
      this.orderWorkbenchFilterModal = JSON.parse(SelectedFilterObj.FilterExpression);
      this.getSalesOrderDataList(this.SelectedTab);
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
        FilterExpression: JSON.stringify(this.orderWorkbenchFilterModal),
        UserID: this.authservices.currentUserValue.UserId,
        ClientID: this.authservices.currentUserValue.ClientId,
        SelectedTab: this.SelectedTab
      };

      this.orderManagementService.UpdateManageFilter(RequestObject)
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
          UserID: this.authservices.currentUserValue.UserId,
          ClientID: this.authservices.currentUserValue.ClientId,
          SelectedTab: this.SelectedTab
        };
        this.orderManagementService.DeleteManageFilter(RequestObject)
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

  onBlurFilterName(value) {
    this.FilterNameEdit = value;
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


  editOrderNoLinkChange(orderId: number) {
    if (orderId != 0 && this.isEditByLink == false) {
      this.isEditByLink = true;
      ////var row = null;
      ////if (this.SalesOrderDetailsBoth != undefined && this.SalesOrderDetailsBoth != null && this.SalesOrderDetailsBoth.length > 0) {
      ////  row = this.SalesOrderDetailsBoth.find(x => x.OrderId === orderId);
      ////  if (this.SelectedTab == "outbound")
      ////    this.selectedvalue(row, true);
      ////  else
      ////    this.selectedvalueIB(row, true);
      ////}
      this.EdittedOrderNumberLink.emit(orderId);
      //localStorage.SelectedOrderIdLink = null;
      localStorage.SelectedTab = null;
      this.selectedOrderId = 0;
    }

  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authservices.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authservices.currentUserValue.UserId;
    this.authservices.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
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
              this.orderWorkbenchHasReadOnlyAccess = false;
              if (this.orderManagementService.SalesOrderforEdit.length > 0) {
                this.buttonBar.enableAction('delete');
                this.buttonBar.enableAction('copy');
                this.buttonBar.enableAction('orderCancel');
                //this.buttonBar.enableAction('save');
                //this.buttonBar.enableAction('saveAndNotify');
                this.buttonBar.enableAction('calculate');
              }
              this.buttonBar.enableAction('issue');
              this.buttonBar.enableAction('export');
              this.isReadAndModifyForBtn = true;
            }
            else {
              this.orderWorkbenchHasReadOnlyAccess = true;
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('copy');
              this.buttonBar.disableAction('issue');
              this.buttonBar.disableAction('orderCancel');
              this.buttonBar.disableAction('save');
              this.buttonBar.disableAction('saveAndNotify');
              this.buttonBar.disableAction('calculate');
              this.buttonBar.disableAction('export');
              this.isReadAndModifyForBtn = false;
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
  getPageControlsPermissions() {
    var ModuleRoleCode = "OrderWorkbench.ViewCustomerList,OrderWorkbench.ViewStockTransferList";
    var ClientId = this.authservices.currentUserValue.ClientId;
    var LoginId = this.authservices.currentUserValue.LoginId;
    this.orderManagementService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;

          //Stock
          var isStockAndCollectionPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("OrderWorkbench.ViewStockTransferList"));
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

          //Customer
          var isCustomerPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("OrderWorkbench.ViewCustomerList"));
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

          if (this.isCustomer == true && this.isEditTabBack == false) {
            this.SelectTab = 'outbound';
            this.SelectedTab = 'outbound';
            this.tabClick(this.SelectTab);
            return;
          }
          if (this.isStockCollection == true && this.isEditTabBack == false) {
            this.SelectTab = 'inbound';
            this.SelectedTab = 'inbound';
            this.tabClick(this.SelectTab);
            return;
          }

        }
      });
  }

  EnableDisableDeleteBtnOnSelection(irow) {
    this.buttonBar.disableAction('delete');
    //if (irow.length == 0 && this.isReadAndModifyForBtn) {
    //  this.buttonBar.enableAction('delete');
    //}
    //else {
    var isDeleteAllowCount = 0;
    irow.forEach(row => {

      this.buttonBar.disableAction('delete');

      if (row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable delete
        this.buttonBar.enableAction('delete');
        isDeleteAllowCount = isDeleteAllowCount + 1;
      }
      else if ((row.OrderType.trim() == 'CPU Order' || row.OrderType.trim() == 'Customer' || row.OrderType.trim() == 'Customer Return' ||
        row.OrderType.trim() == 'Customer To Customer' || row.OrderType.trim() == 'Stock Transfer' || row.OrderType.trim() == 'Collections')
        && (row.Status == 'Open Order Needs To Be Completed')
        && (row.OrderCondition == 'New Order') && row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable delete
        this.buttonBar.enableAction('delete');
        isDeleteAllowCount = isDeleteAllowCount + 1;
      }
      else if ((row.OrderType.trim() == 'CPU Order' || row.OrderType.trim() == 'Customer' ||
        row.OrderType.trim() == 'Customer To Customer')
        && (row.Status == 'Accounting Hold')
        && (row.OrderCondition == 'On Accounting Hold from MAS') && row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable delete
        this.buttonBar.enableAction('delete');
        isDeleteAllowCount = isDeleteAllowCount + 1;
      }
      else if ((row.OrderType.trim() == 'CPU Order' || row.OrderType.trim() == 'Customer' || row.OrderType.trim() == 'Customer Return' ||
        row.OrderType.trim() == 'Customer To Customer' || row.OrderType.trim() == 'Stock Transfer' || row.OrderType.trim() == 'Collections')
        && (row.Status == 'Cancelled')
        && (row.OrderCondition == 'Cancelled') && row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable delete
        this.buttonBar.enableAction('delete');
        isDeleteAllowCount = isDeleteAllowCount + 1;
      }
      else if ((row.OrderType.trim() == 'CPU Order' || row.OrderType.trim() == 'Customer' ||
        row.OrderType.trim() == 'Customer To Customer')
        && (row.Status == 'Over Credit Limit')
        && (row.OrderCondition == 'Over Credit Limit') && row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable delete
        this.buttonBar.enableAction('delete');
        isDeleteAllowCount = isDeleteAllowCount + 1;
      }

    });
    //to check if any single record not allow to cancel in multiple selection then button should be disable
    if (this.SelectedTab == 'outbound') {
      if (this.selection.selected.length != isDeleteAllowCount || this.isTruckOrderNotUsed || this.isOrderSentToMAS) {
        this.buttonBar.disableAction('delete');
      }
    }
    if (this.SelectedTab == 'inbound' || this.isTruckOrderNotUsed || this.isOrderSentToMAS) {
      if (this.selection1.selected.length != isDeleteAllowCount) {
        this.buttonBar.disableAction('delete');
      }
    }
    // }
  }

  EnableDisableCancelBtnOnSelection(irow) {
    this.buttonBar.disableAction('orderCancel');
    //if (irow.length == 0 && this.isReadAndModifyForBtn) {
    //  this.buttonBar.enableAction('orderCancel');
    //}
    //else {

    var isCancelAllowCount = 0;
    irow.forEach(row => {

      this.buttonBar.disableAction('orderCancel');

      if ((row.Status == 'Open Order Needs To Be Completed' || row.Status == 'Accounting Hold' || row.Status == 'Over Credit Limit')
        && (row.OrderCondition == 'New Order') && row.ShipmentId == null && this.isReadAndModifyForBtn) {
        //enable cancel btn
        this.buttonBar.enableAction('orderCancel');
        isCancelAllowCount = isCancelAllowCount + 1;
      }
      else if ((row.Status == 'Assigned To Shipment') && (row.OrderCondition == 'Shipment Planning')
        && (row.ShipmentStatus == 'Open Shipment Needs to be Completed') && (row.ShipmentCondition == 'Tendered')
        && this.isReadAndModifyForBtn) {
        //enable cancel btn
        this.buttonBar.enableAction('orderCancel');
        isCancelAllowCount = isCancelAllowCount + 1;
      }
      else if ((row.Status == 'Assigned To Shipment') && this.isReadAndModifyForBtn) {
        //enable cancel btn
        this.buttonBar.enableAction('orderCancel');
        isCancelAllowCount = isCancelAllowCount + 1;
      }
    });

    //to check if any single record not allow to cancel in multiple selection then button should be disable
    if (this.SelectedTab == 'outbound') {
      if (this.selection.selected.length != isCancelAllowCount || this.isTruckOrderNotUsed || this.isOrderSentToMAS) {
        this.buttonBar.disableAction('orderCancel');
      }
    }
    if (this.SelectedTab == 'inbound') {
      if (this.selection1.selected.length != isCancelAllowCount || this.isTruckOrderNotUsed || this.isOrderSentToMAS) {
        this.buttonBar.disableAction('orderCancel');
      }
    }
    // }
  }

  OnShipFromTypeSelectAll(items: any, str: any) {

    var tempArr = [];
    this.ShipFromList = [];
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
    this.ShipFromList = [];
    this.ShipFromList = tempArr;
  }
  OnShipFromTypeDeSelectAll(items: any) {
    this.ShipFromList = [];
    this.orderWorkbenchFilterModal.selectedShipFromItems = [];
  }

  OnShipToTypeSelectAll(items: any) {
    var tempArr = [];
    this.ShipToList = [];
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
    this.ShipToList = [];
    this.ShipToList = tempArr;
  }
  OnShipToTypeDeSelectAll(items: any) {
    this.ShipToList = [];
    this.orderWorkbenchFilterModal.selectedShipToItems = [];
  }

  OnOrderTypeSelectAll(items: any) {
  }

  calculateExistingOrderFromWorkbench() {
    if (this.selectedSalesOrderIds.length == 0) {
      this.modalRef = this.modalService.open(confirmationpopup, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.msg = "Please open order in edit and then press calculate";
      this.modalRef.componentInstance.isOK = true;
      this.modalRef.componentInstance.isYesNO = false;
      this.modalRef.result.then((result) => { }, (reason) => {
      });
      return;
    }

    this.orderManagementService.RecalculateOrderFromWorkbench(this.selectedSalesOrderIds, this.selectedOrderTypeIds).subscribe(result => {

      if (result.data != undefined) {
        if (result.data.isValid) {
          var messages = 'OrderRecalculatedSuccessfully';
          if (this.AllToasterMessage != undefined) {
            var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
            this.toastrService.success(messagesData);
            this.getSalesOrderDataList(this.SelectedTab);
            this.buttonBar.disableAction('delete');
            this.buttonBar.disableAction('edit');
            this.buttonBar.disableAction('copy');
            this.buttonBar.disableAction('calculate');
            this.buttonBar.disableAction('approveAndMas');
            this.buttonBar.disableAction('resendToMas');
            this.buttonBar.disableAction('orderCancel');
            this.buttonBar.disableAction('shipWith');
            this.SameShipmentNoOrder = [];
            this.orderManagementService.SalesOrderforEditSameShipmentNo = [];
            this.LinkOrders = [];
            this.orderManagementService.SalesOrderforEditLinkOrders = [];
            this.selection.clear();
            this.selection1.clear();
          }
          //this.toastrService.success("Order recalculated successfully.");
        }
        else {
          this.modalRef = this.modalService.open(confirmationpopup, { size: 'lg', backdrop: 'static' });
          this.modalRef.componentInstance.msg = result.data.message;
          this.modalRef.componentInstance.isOK = true;
          this.modalRef.componentInstance.isYesNO = false;
          this.modalRef.result.then((result) => { }, (reason) => {
          });
          return;
        }
      }
    });

  }
  GetAllNotificationMessage() {
    this.orderManagementService.getMessageByModuleCodeForOrder("Ord", parseInt(localStorage.clientId)).subscribe(result => {
      this.AllToasterMessage = result.data;
    });
    ////this.messageServices.getMessageByModuleCode("Ord").subscribe(result => {
   
    ////  this.AllToasterMessage = result.data;
    ////});
  }
  loading = false;
  onInvoiceOpen(event) {
    
    this.getAllInvoiceNo();
    
    //console.log(this.itemList);
  }
  onInvoiceClose(e) {
    this.InvoiceNoList = [];
  }

  OnMaterialOpen(event) {

    this.BindMaterialList();

    //console.log(this.itemList);
  }
  onMaterialClose(e) {
    this.MaterialData = [];
  }
  OnCarrierOpen(event) {

    this.BindCarrierData();

    //console.log(this.itemList);
  }
  onCarrierClose(e) {
    this.CarrierData = [];
  }
  fetchInvoiceMore(event: any) {
    //alert("Fetch More");
    
    if (event.end === this.InvoiceNoList.length - 1) {
      this.getAllInvoiceNo();
      //this.loading = true;
      //this.appService.getChunkData(this.itemList.length, this.bufferSize).then(chunk => {
      //  this.itemList = this.itemList.concat(chunk);
      //  this.loading = false;
      //}, () => this.loading = false);
    }
  }
}
