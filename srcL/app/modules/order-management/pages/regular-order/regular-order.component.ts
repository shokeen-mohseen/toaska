import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { AdjustChargesModel, CommonOrderModel, CommonShipModel, EditVerifyEquipmentMaterialProperty, MaterialPropertyGrid, OrderManagement, RateTypeWithUOM, regularOrderModel, SalesOrder } from '../../../../core/models/regularOrder.model';
import { MessageService } from '../../../../core/services/message.service';
import { OrderManagementAdjustChargesService } from '../../../../core/services/order-management-AdjustCharges.service';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { confirmationpopup } from '../../../../shared/components/confirmation-popup/confirmation-popup.component';
import { projectkey } from '../../../../../environments/projectkey';
//import { setTimeout } from 'timers';

declare var $: any;

export interface PeriodicElement {
  name: string;
  quantity: number;
  shippedQuantity: number;
  materialId: number;

}


export interface PeriodicElements {
  Material: string;
  OrderQuantity: string;
  ShippedQuantity: string;
  Action: string;
}



export interface PeriodicElementDocument {
  Material: string;
  Charge: string;
  Commodity: string;
  ShowOnBOL: boolean
  OrderQuantity: number
  ShippedQuantity: number
  PriceMethod: string
  RateValue: string
  RateType: string
  Amount: string
}

const ELEMENT_DATA: PeriodicElements[] = [];

const ELEMENT_DATADocument: PeriodicElementDocument[] = [];

const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})
//const formatterDecimal = new Intl.NumberFormat('en-US', {
//  //style: 'currency',
//  currency: 'USD',
//  minimumFractionDigits: 0
//})


export interface Element {
  highlighted?: boolean;
}


@Component({
  selector: 'app-regular-order',
  templateUrl: './regular-order.component.html',
  styleUrls: ['./regular-order.component.css']
})
export class RegularOrderComponent implements OnInit, OnDestroy {
  @Input() buttonBar: any;
  isDateExist = false;
  isScheduleDateExist = false;
  MaterialDataForAdjustCharges: any[] = [];
  MaterialDataForAdjustShipping: any[] = [];
  ChargeData: any[] = [];
  RawChargeData: any[] = [];
  CommodityData: any[] = [];
  PriceMethodData: any[] = [];
  RateTypeData: any[] = [];
  AllRateTypeData: any[] = [];
  selectedItemsB = [];
  materialPropertyPopup: string = "";
  editVerifyEquipmentMaterialProperty: EditVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();

  ThresHoldDays: number = 1;
  public isLoading: boolean = false;
  public LoadingMessage: string = "";
  public materialPropertyPopupShow: boolean = false;
  public selectedMaterialPropertiesshow: boolean = false;
  SalesOrderforEdit: any[] = [];
  SelectedSalesOrdersforEdit: OrderManagement;

  public dateFormat: String = "MM-dd-yyyy";
  public dateFormatWithTime: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");
  CurrentOrderId: number;
  CurrentOrderType: string;
  isEditNextOrder: boolean;
  CurrentEditListItemIndex: number;
  OrderStatusDisableProp = true;
  Fromrequired: string;
  regularOrderHasReadOnlyAccess: boolean = false;
  isRegularScreen: boolean = false;
  OrderType: string;
  SelectedItem: object;
  SelectedOrderId: number;
  isReadAndModifyForBtn: boolean = false;
  isTruckOrderNotUsed: boolean = false;
  isOrderSentToMAS: boolean = false;
  isChargeOrderSentToMAS: boolean = false;
  SelectedOrderIdLink: number;
  SelectedOrderTypeStr: string;
  isOrderLinkClick: string;


  displayedColumns = ['Material', 'OrderQuantity', 'ShippedQuantity', 'Action'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  displayedColumnsAdjust = ['materialName', 'chargeName', 'commodityName', 'showOnBOL',
    'chargeUnit', 'priceMethod', 'rateValue', 'rateTypeName',
    'amount', 'Action'];
  dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>();
  allAdjustChargesData: AdjustChargesModel[];
  defaultContractChargesData: AdjustChargesModel[];

  missingMaterialProerptyColumn = ['materialName', 'materialWeight', 'unitInPallet',
    'unitInEquipement', 'palletInEquipement'];
  MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>();
  MissingMaterialPropertyData: MaterialPropertyGrid[] = [];

  //selection = new SelectionModel<PeriodicElement>(true, []);
  displayedColumnsDocument = [/*'selectRow', */'Material', 'Charge', 'Commodity', 'ShowOnBOL',
    'OrderQuantity', 'ShippedQuantity', 'PriceMethod', 'RateValue', 'RateType',
    'Amount'];
  dataSourceDocument = new MatTableDataSource<PeriodicElementDocument>(ELEMENT_DATADocument);
  //selection = new SelectionModel<PeriodicElement>(true, []);

  //material table code here
  displayedColumnsAddMaterial = ['Material', 'OrderQuantity', 'ShippedQuantity', 'Action'];
  dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  isRecalculate: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
      console.log("regular order BindOrderDetails start");
      this.BindOrderDetails(Number(this.SalesOrderforEdit[0].OrderId), this.SalesOrderforEdit[0].OrderType, this.SalesOrderforEdit[0]);
      console.log("regular order BindOrderDetails End");

      this.CurrentOrderId = this.SalesOrderforEdit[0].OrderId;
      this.CurrentOrderType = this.SalesOrderforEdit[0].OrderType;
      if (this.SalesOrderforEdit.length > 1) {
        //enable
        this.isEditNextOrder = false;
      }
      else {
        //diseble
        this.isEditNextOrder = true;
      }
    }

    //this.dataSourceAddMaterial.paginator = this.paginator;
    this.dataSourceAddMaterial.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceAddMaterial.filter = filterValue;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceAddMaterial.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceAddMaterial.data.forEach(row => this.selection.select(row));
  }
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  get IsEditButtonShow(): boolean {

    if (this.orderManagement == undefined || this.orderManagement.Id == undefined)
      return false;
    else {

      if (this.SalesOrderforEdit == undefined || this.SalesOrderforEdit.length == 0)
        return false;
      else {

        var currentselected = this.orderManagementService.SalesOrderforEdit.find(x => x.OrderId == this.orderManagement.Id);
        var indexofCurrent = this.orderManagementService.SalesOrderforEdit.indexOf(currentselected);
        if (indexofCurrent > -1 && indexofCurrent == (this.orderManagementService.SalesOrderforEdit.length - 1))
          return false;
        else
          return true;

      }
    }

  }

  public IsNegativeCredit(): boolean {

    var credit = Number(this.orderManagement.AvailableCredit.replace(/\,/g, ''));

    if (credit < 0)
      return true;
    else
      return false;

  }


  public CreditCalculateLimit(): Date {

    var currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + this.ThresHoldDays);

    return currentDate;
  }

  MaterialDataBackup: any = [];
  MaterialData: any[] = [];
  FilterMaterialData: any[] = [];
  UOMData: any;
  MaterialDetails: any[] = [];
  SelectMaterial: number = 0;
  SelectUOM: number;
  OQuantity: string;
  ShipQuantity: number = 0;
  Action: string = "Edit/Delete";
  OrderTypeData: any;
  CarrierData: any;
  OrderStatusData: any;
  EquipmentTypeData: any;
  dataEquipmentType: any;
  LocationTypeData: [];
  SelectedOrderCode: any;
  ShipToLocationData: any;
  SelectOrderStatusCode: number;
  OrderTypeId: number;
  LocationFunctionId: number;
  LoctionFuntionToId: number;
  LoctionFuntionFromId: number;
  LocationId: number;
  SelectedCountryCode: string;
  SelectedContactCountryCode: string;
  LoctionFromId: number;
  ShipFromId: number;
  ShipToTypeId: number;
  DecimalPlacePreference: number = 2;
  settings = {};
  settingsEquip = {};
  settingsCarrier = {};
  settingsMaterial = {};
  settingsShipFromTo = {};
  settingsOrderType = {};
  settingsOrderStatus = {};
  settingsAdjustShippingMaterial = {};
  settingsAdjustCharges = {};
  settingsAdjustChargesSectionCharge = {};
  shipfromtypelist = [];
  shiptotypelist = [];
  shipfromlist = [];
  shiptolist = [];
  contactlist = [];
  contactfromlist = [];
  enduserlist = [];
  addressnamelist = [];
  contracttolist = [];
  selectedOrderType = [];
  selectedOrderStatus = [];
  ShipToLocationID: number;
  ShipFromLoctionID: number;
  OrderTypeID: number;
  OrderTypeCode: string;
  OrderID: number;
  SelectEquipment: number;
  Equipmentvalidate: boolean;
  regularOrderData: regularOrderModel = new regularOrderModel();
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  filterShipFromTypeModel: CommonShipModel[] = [];
  filterShipToTypeModel: CommonShipModel[] = [];
  filterShipToModel: CommonShipModel[] = [];
  filterShipFromModel: CommonShipModel[] = [];
  filterContactModel: CommonShipModel[] = [];
  filterContactfromModel: CommonShipModel[] = [];
  filterEndUserModel: CommonShipModel[] = [];
  filterAddressNameModel: CommonShipModel[] = [];
  filterContactToModel: CommonShipModel[] = [];
  modalRef: NgbModalRef;
  ToContractlist = [];
  FromContractlist = [];
  ShippingMaterialDetails: any[] = [];
  ShippingMaterialDetailForUI: any[] = [];

  SelectAddjustMaterialId: number = 0;
  rateTypeWithUOM: RateTypeWithUOM[] = [];
  EquivalentPallates: number = 0;
  TotalPalates: number = 0;
  TempPalates: number = 0;
  NPMIPallet: number = 0;
  EditFlag: boolean = false;
  SelectAddjustMaterial: number = 0;
  SelectMaterialData: any = [];
  ShippingUOMData: any;
  ShippingSelectUOM: string;
  AQuantity: string;
  orderManagement: OrderManagement = new OrderManagement();
  SalesOrder: SalesOrder = new SalesOrder();
  panelOpenState = false;
  panelOpenState1 = false;
  SCarrierId: number;
  Ordervalidate: boolean;
  OrderNumber: string = "New Order";
  NewOrder: number;
  closeResult: string;
  TempData: any = [];
  FreightModeData: any = [];
  isChecked: boolean;
  orderTypevalidate: boolean;
  IsAppointment: boolean;
  IsSealNumber: boolean;
  IsEquipmentNumber: boolean;
  IsShipToLocation: boolean;
  IsShipFromLocation: boolean;
  IsMaterialEdit: boolean = false;
  IsPalletEdit: boolean = false;
  IsChargesEdit: boolean = false;
  isFromContact: boolean;
  isFromContract: boolean;
  isToContract: boolean;
  isFreight: boolean;
  isShowOnBOL: boolean;
  isEquipmentNo: boolean;
  IsEquipmentType: boolean = false;
  isTrailerSealNumber: boolean;
  isRequestedDeliveryDateValidate: boolean;
  isScheduleShipDate: boolean;
  isMustArriveByDate: boolean;
  isPONumber: boolean;
  isCarrier: boolean;
  IsOldVersion: boolean = false;
  InOnProcess: boolean = false;
  isSaveEditAndNextOrder: string;
  selectedshipfromItems = [];
  selectedCarrierItems = [];
  selectedMaterialItems = [];
  selectedAdjustShippingItems = [];
  selectedAdjustItems = [];
  selectadjustChargesSectionChargeID = [];
  selectedETDItems = [];
  selectedETDName = '';
  selectedMaterialName = '';
  FromLocationName: string;
  decimalPreferences: number;
  TempDataShippingMaterial: any = [];
  AdjustShippingEditFlag: boolean = false;
  OrderConditionDataList: any = [];
  AllToasterMessage: any = [];
  isOrderEditbindlocation: boolean = true;
  IsAvailableCredit: boolean = false;
  AvailableCreditMessage: string = "NO";
  TempFromLocation: any = [];
  TempToLocation: any = [];
  IsRRequired: boolean = true;
  IsSRequired: boolean = false;
  IsShipFromType: boolean = false;
  IsShipToType: boolean = false;
  SaveAndNotifyHit: boolean = false;

  // multi select
  // public options: Options;
  // public exampleData: any;

  @Output()
  EdittedOrderNumber: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  closeRegular: EventEmitter<any> = new EventEmitter();


  @ViewChild('addOrderForm') orderForm: NgForm;

  get isAdjustmentchargeAvailable(): boolean {
    return this.orderManagementAdjustCharges.allAdjustChargesData.length > 0;
  }

  get OrderWithVersion(): string {
    return this.OrderNumber == "New Order" ? this.OrderNumber : (this.OrderNumber.toString() + "." + this.orderManagement.OrderVersionNumber.toString());
  }

  get AdjustmentgridInEditMode(): boolean {
    return this.orderManagementAdjustCharges.editIndex > -1;
  }

  get MaterialGridVisible(): boolean {
    return this.MaterialData.length > 0;
  }

  get ShippingMaterialGridVisible(): boolean {
    return this.ShippingMaterialDetails.length > 0;
  }

  get ShippingCharegsTotalAmount(): number {
    return this.orderManagementAdjustCharges.TotalAmount;
  }

  get isStockTransfer(): boolean {
    return (this.orderManagement != undefined && this.orderManagement.OrderTypeCode != undefined && (this.orderManagement.OrderTypeCode == "StockTransfer" || this.orderManagement.OrderTypeCode == "Collections")) || (this.orderManagement == undefined);
  }

  get isLocationChangeByUser(): boolean {
    if (this.SelectedSalesOrdersforEdit == undefined) {
      this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
      return true;
    }
    else {

      if (this.orderManagement != undefined && this.SelectedSalesOrdersforEdit != undefined) {

        if (!this.IsCustomerReturn) {
          if (Number(this.orderManagement.ToLocationId) === Number(this.SelectedSalesOrdersforEdit.ToLocationId)) {
            this.orderManagementAdjustCharges.IsLocationChangeByUser = false;
            return false;
          }
          else {
            this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
            return true;
          }
        }
        else {

          if (Number(this.orderManagement.FromLocationId) === Number(this.SelectedSalesOrdersforEdit.FromLocationId)) {
            this.orderManagementAdjustCharges.IsLocationChangeByUser = false;
            return false;
          }
          else {
            this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
            return true;
          }

        }
      }
      else {
        this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
        return true;
      }
    }

  }

  get isRequestedDelieveryDateChangeByUser(): boolean {
    if (this.SelectedSalesOrdersforEdit == undefined) {
      this.orderManagementAdjustCharges.IsRequestedDelieveryDateChangeByUser = true;
      return true;
    }
    else {

      if (this.orderManagement != undefined && this.SelectedSalesOrdersforEdit != undefined && this.orderManagementService != null && this.orderManagementService != undefined) {
        var oldDate = this.orderManagementService.convertDatetoStringDate(this.SelectedSalesOrdersforEdit.RequestedDeliveryDate);
        var newDate = this.orderManagementService.convertDatetoStringDate(this.orderManagement.RequestedDeliveryDate);
        if (oldDate != newDate) {
          this.orderManagementAdjustCharges.IsRequestedDelieveryDateChangeByUser = true;
          return true;
        }
        else {
          this.orderManagementAdjustCharges.IsRequestedDelieveryDateChangeByUser = false;
          return false;
        }

      }
      else {
        this.orderManagementAdjustCharges.IsRequestedDelieveryDateChangeByUser = true;
        return true;
      }
    }

  }


  get isToContractChangeByUser(): boolean {

    if (this.SelectedSalesOrdersforEdit == undefined) {
      this.orderManagementAdjustCharges.IsToContractChangeByUser = true;
      return true;
    }
    else {

      if (this.orderManagement != undefined && this.SelectedSalesOrdersforEdit != undefined) {
        if (!this.IsCustomerReturn) {
          if (this.orderManagement.ToContractId == undefined && this.SelectedSalesOrdersforEdit.ToContractId == undefined) {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = false;
            return false;
          }
          else if (Number(this.orderManagement.ToContractId) === Number(this.SelectedSalesOrdersforEdit.ToContractId)) {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = false;
            return false;
          }
          else {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = true;
            return true;
          }
        }
        else {


          if (this.orderManagement.FromContractId == undefined && this.SelectedSalesOrdersforEdit.FromContractId == undefined) {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = false;
            return false;
          }
          else if (Number(this.orderManagement.FromContractId) === Number(this.SelectedSalesOrdersforEdit.FromContractId)) {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = false;
            return false;
          }
          else {
            this.orderManagementAdjustCharges.IsToContractChangeByUser = true;
            return true;
          }
        }
      }
      else {
        this.orderManagementAdjustCharges.IsToContractChangeByUser = true;
        return true;
      }
    }

  }


  get OrderStatausCode(): string {
    return this.orderManagement.OrderStatusCode;
  }


  get IsAssignedTOShipment(): boolean {

    if (this.OrderStatausCode == "AssignedToShipment") {
      return true;
    }
    else
      return false;
  }

  get IsShippedAndUnderReview(): boolean {

    if (this.OrderStatausCode == "ShippedAndUnderReview") {
      return true;
    }
    else
      return false;
  }
  get IsShippedInventoryAndARChargesSentToMAS(): boolean {

    if (this.OrderStatausCode == "ShippedInventoryAndARChargesSentToMAS") {
      return true;
    }
    else
      return false;
  }

  get IsOpenOrderNeedsToBeCompleted(): boolean {

    if (this.OrderStatausCode == "OpenOrderNeedsToBeCompleted") {
      return true;
    }
    else
      return false;
  }

  get IsSendforShipping(): boolean {

    if (this.OrderStatausCode == "SendforShipping") {
      return true;
    }
    else
      return false;
  }

  get IsTransferOrderShippedandInventorySentToMAS(): boolean {

    if (this.OrderStatausCode == "TransferOrderShippedandInventorySentToMAS") {
      return true;
    }
    else
      return false;
  }

  get OrderTypeCodeStatus(): string {
    return this.orderManagement.OrderTypeCode;
  }

  get IsCPUOrder(): boolean {

    if (this.OrderTypeCodeStatus == "CPUOrder") {
      return true;
    }
    else
      return false;
  }
  get IsCustomer(): boolean {

    if (this.OrderTypeCodeStatus == "Customer") {
      return true;
    }
    else
      return false;
  }
  get IsCustomerReturn(): boolean {

    if (this.OrderTypeCodeStatus == "CustomerReturn") {
      return true;
    }
    else
      return false;
  }
  get IsCustomerToCustomer(): boolean {

    if (this.OrderTypeCodeStatus == "CustomerToCustomer") {
      return true;
    }
    else
      return false;
  }
  get IsStockTransfer(): boolean {

    if (this.OrderTypeCodeStatus == "StockTransfer" || this.OrderTypeCodeStatus == "Collections") {
      return true;
    }
    else
      return false;
  }
  get IsCollections(): boolean {

    if (this.OrderTypeCodeStatus == "Collections") {
      return true;
    }
    else
      return false;
  }

  get IsChargeOrder(): boolean {

    if (this.OrderTypeCodeStatus == "ChargeOrder") {
      return true;
    }
    else
      return false;
  }

  get isFromLocationChangeByUser(): boolean {
    if (this.SelectedSalesOrdersforEdit == undefined) {
      // this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
      return true;
    }
    else {

      if (this.orderManagement != undefined && this.SelectedSalesOrdersforEdit != undefined) {
        if (Number(this.orderManagement.FromLocationId) === Number(this.SelectedSalesOrdersforEdit.FromLocationId)) {
          //this.orderManagementAdjustCharges.IsLocationChangeByUser = false;
          return false;
        }
        else {
          // this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
          return true;
        }
      }
      else {
        //this.orderManagementAdjustCharges.IsLocationChangeByUser = true;
        return true;
      }
    }

  }

  get ARChargesSentToAccounting(): boolean {

    if (this.orderManagement.ARChargesSentToAccounting == 1) {
      return true;
    }
    else
      return false;
  }
  get IsOrderEdit(): boolean {

    if (this.orderManagement.Id > 1) {
      return true;
    }
    else
      return false;
  }

  get IsShipment(): boolean {
    if (this.orderManagement.ShipmentID != undefined && this.orderManagement.ShipmentID > 0) {
      this.orderManagementAdjustCharges.IsShipmentCreated = true;
      return true;
    }
    else {
      this.orderManagementAdjustCharges.IsShipmentCreated = false;
      return false;
    }
  }
  constructor(private orderManagementAdjustCharges: OrderManagementAdjustChargesService, private router: Router, private orderManagementService: OrderManagementService, private toastrService: ToastrService,
    private authenticationService: AuthService, private orderCommonService: OrdermanagementCommonOperation,
    private systemPreferences: PreferenceTypeService, private messageServices: MessageService, private modelservice: NgbModal, private ref: ChangeDetectorRef
  ) {

    this.orderManagement = new OrderManagement();

    console.log("constructor calling");

    //this.orderManagementService.getRateTypeWithUOM()
    //  .subscribe(
    //    data => {
    //      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
    //        this.rateTypeWithUOM = <RateTypeWithUOM[]>data.data;
    //        this.orderManagementAdjustCharges.rateTypeWithUOM = this.rateTypeWithUOM;
    //      }
    //    });
  }

  ngOnInit() {
    console.log("regular order ng oninit start");
    this.buttonBar.disableAction('edit');
    this.isRegularScreen = true;
    //if (document.getElementById('EquipmentType') != undefined && document.getElementById('EquipmentType') != null) { document.getElementById('EquipmentType').setAttribute('required', null); }
    //if (document.getElementById('PONumber') != undefined && document.getElementById('PONumber') != null) { document.getElementById('PONumber').setAttribute('required', null); }


    this.ResetAdjustmentChargesService();
    //this.ThresHoldDays = await this.orderManagementService.getThesHoldDaysCreditCalculationDays();
    //this.ThresHoldDays = 15;
    this.buttonPermission();
    this.updatePrefenceTypeData();


    if (this.orderManagementService.SalesOrderforEdit != undefined && this.orderManagementService.SalesOrderforEdit.length > 0) {
      this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
      //Add same shipment no order on this object
      if (this.orderManagementService.SalesOrderforEditSameShipmentNo.length > 0) {
        for (var i = 0; i < this.orderManagementService.SalesOrderforEditSameShipmentNo.length; i++) {
          var exist = false;
          for (let j = 0; j < this.SalesOrderforEdit.length; j++) {
            if (this.orderManagementService.SalesOrderforEditSameShipmentNo[i].OrderId === this.SalesOrderforEdit[j].OrderId) {
              exist = true;
            }
          }
          if (!exist)
            this.SalesOrderforEdit.push(this.orderManagementService.SalesOrderforEditSameShipmentNo[i]);
        }
      }
      //Add ship with orders on this object
      if (this.orderManagementService.SalesOrderforEditLinkOrders.length > 0) {
        for (var i = 0; i < this.orderManagementService.SalesOrderforEditLinkOrders.length; i++) {
          var exist = false;
          for (let j = 0; j < this.SalesOrderforEdit.length; j++) {
            if (this.orderManagementService.SalesOrderforEditLinkOrders[i].OrderId === this.SalesOrderforEdit[j].OrderId) {
              exist = true;
            }
          }
          if (!exist)
            this.SalesOrderforEdit.push(this.orderManagementService.SalesOrderforEditLinkOrders[i]);
        }
      }

      if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
        this.orderManagement.Id = Number(this.SalesOrderforEdit[0].OrderId);
        //this.orderManagement.OrderTypeId = Number();
        this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
      }
      else {
        console.log("approveAndMas disable 6 R");
        this.buttonBar.disableAction('approveAndMas');
        this.buttonBar.disableAction('resendToMas');
        this.buttonBar.disableAction('calculate');
        this.buttonBar.disableAction('copy');
      }
    }

    console.log("regular order BindPreLoadDataOnPage start");
    this.BindPreLoadDataOnPage();
    console.log("regular order BindPreLoadDataOnPage end");


    this.isSaveEditAndNextOrder = "";
    //this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();
    //this.decimalPreferences = 4;



    this.GetAllNotificationMessage();

    this.getEquipmentMaxPalletSize();

    //for order no link click by shipment screen start
    if (localStorage.SelectedOrderIdLink != undefined && localStorage.SelectedOrderIdLink != null)
      this.SelectedOrderIdLink = parseInt(localStorage.SelectedOrderIdLink);

    if (localStorage.SelectedOrderType != undefined && localStorage.SelectedOrderType != null)
      this.SelectedOrderTypeStr = localStorage.SelectedOrderType;

    if (localStorage.isOrderLinkClick != undefined && localStorage.isOrderLinkClick != null)
      this.isOrderLinkClick = localStorage.isOrderLinkClick;

    if (this.isOrderLinkClick == "Yes") {
      this.GetSalesOrderDataByOrderId(this.SelectedOrderIdLink, this.SelectedOrderTypeStr);
    }
    //for order no link click by shipment screen end

    this.subscribeAdjustmentChargesGridMethod();

    console.log("regular order ng oninit end");

  }

  async updatePrefenceTypeData() {
    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();
    this.ThresHoldDays = await this.orderManagementService.getThesHoldDaysCreditCalculationDays();
    console.log("set user prefernces..");
  }


  getEquipmentMaxPalletSize() {

    if (this.orderManagement.EquipmentTypeId != undefined && this.orderManagement.EquipmentTypeId > 0) {

      var maxPallet = this.EquipmentTypeData.find(x => Number(x.id) == Number(this.orderManagement.EquipmentTypeId))?.maxPalletQty;

      if (maxPallet != undefined || maxPallet != null) {
        this.orderManagementAdjustCharges.MaxPalletSize = Number(maxPallet);
      }

    }

    console.log("set max pallet size");
  }

  GetAllNotificationMessage() {

    this.messageServices.getMessagesByModuleCode("Ord", parseInt(localStorage.clientId)).subscribe(result => {
      this.AllToasterMessage = result.data;
      console.log("set all order screen message");
    });
  }

  ngOnDestroy(): void {
    this.orderManagementAdjustCharges.AddEditMaterialUnSubscribe();
    console.log("ng on destroy call");
  }

  //count = 3;

  BindPreLoadDataOnPage() {
    console.log("Bind Preload Data methods");
    this.multiselectSetting();

    this.orderManagementService.GetUOMData()
      .subscribe(
        data => {
          this.UOMData = data.data;
          this.SelectUOM = this.UOMData.find(f => f.code == GlobalConstants.EA)?.id;
          console.log("Get UOM Data");
        });

    this.Equipmentvalidate = true;
    this.Ordervalidate = true;
    this.NewOrder = 0;

    if (this.OrderTypeData != undefined && this.OrderTypeData.length > 0) {
      this.OrderTypeData.splice(0, this.OrderTypeData.length);
      this.orderCommonService.OrderTypeList.splice(0, this.OrderTypeData.length);
    }

    this.orderManagementService.OrderTypeList()
      .subscribe(
        data => {
          this.OrderTypeData = data.data;
          this.orderCommonService.OrderTypeList = data.data;


          //because on edit don't want to show default order type
          //if (this.SalesOrderforEdit.length > 0)
          if (this.orderManagement != undefined && this.orderManagement.Id != undefined && this.orderManagement.Id > 0 && this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId > 0) {
            this.OrderTypeId = this.orderManagement.OrderTypeId;




          }
          else {
            this.OrderTypeId = this.OrderTypeData.find(f => f.code == GlobalConstants.Customer)?.id;
            this.orderManagement.OrderTypeCode = this.OrderTypeData.find(f => f.code == GlobalConstants.Customer)?.code;
            this.orderManagement.OrderTypeId = this.OrderTypeId;
          }


          this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
          this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;

          console.log("OrderType Data Bind");
          console.log(this.orderManagement)

          this.SelectedOrderTypeSearchable();


          this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;

          if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0) {
            this.getShipToType();
            this.getShipFromType();
            this.BindMaterialList(this.OrderID, 0);
          }

          this.resetValidationCss();
        });

    this.orderManagementService.GetCarrierList(this.authenticationService.currentUserValue.ClientId)
      .subscribe(
        data => {
          this.CarrierData = data.data;
          console.log("get carrier list");
        });

    this.orderManagementService.EquipmentTypeData(this.regularOrderData)
      .subscribe(
        data => {

          this.EquipmentTypeData = [];
          this.dataEquipmentType = data.data;
          this.dataEquipmentType.sort((a, b) => a.name.localeCompare(b.name));
          this.dataEquipmentType.map(item => {
            return {
              name: item.name + " " + item.maxPalletQty + " Pallets",
              id: Number(item.id),
              maxPalletQty: Number(item.maxPalletQty == undefined || item.maxPalletQty == null ? 0 : item.maxPalletQty)
            };
          }).forEach(x => this.EquipmentTypeData.push(x));

          var result = this.EquipmentTypeData;
          console.log("Bind Equipment type");
        });




    ////////////////////////////////////////////////
    //this.BindSalesManagerListData();

    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0) { this.GetStatus(0, 0); }

    this.BindMaterialList(this.OrderID, 1);
    this.BindChargeList();
    this.BindPriceMethod();
    this.BindRateTypeData();
    this.BindCommodity();
    this.GetShippingUOM();
    this.OrderConditionList();
    this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;

    this.DefaultCarrier(this.orderManagement.ClientId, 0);

  }

  SelectedOrderStatusSearchable() {
    this.selectedOrderStatus.splice(0, this.selectedOrderStatus.length);
    var items = this.OrderStatusData.find(x => x.id == Number(this.orderManagement.OrderStatusId));
    this.selectedOrderStatus.push(items);
    console.log("set order status");
  }


  onOrderTypeChange(item: any) {
    if (item.id != 0) {
      //this.orderManagement = new OrderManagement();
      this.OrderType = item.name;
      this.OrderTypeId = Number(item.id);
      this.orderManagement.OrderTypeId = Number(item.id);
      this.selectOrderType();
    }
  }

  AddMaterial() {
    if (Number(this.OQuantity) <= 0 || (Number(this.OQuantity) % 1) != 0) {
      var messages = 'InvalidQuantityFormat';
      if (this.AllToasterMessage != undefined) {

        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        this.toastrService.error(messagesData);
      }


      return false;
    }

    var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
    //var getUom = this.UOMData.filter(f => f.id == this.SelectUOM);
    var Condition1 = this.MaterialDetails.find(temp => temp.materialID == getmaterial.id)

    if (Condition1) {
      // if material already exists then modify the quantity and proceed to update 
      var userInputedQuantity = this.OQuantity;

      this.SelectMaterialEdit(getmaterial.id);
      this.OQuantity = (Number(this.OQuantity) + Number(userInputedQuantity)).toString();
      this.EditMaterial();
      this.EditFlag = false;
      this.SelectMaterial = 0;
      this.OQuantity = "";

      // this.toastrService.success('This material has already been added to the order);
      //this.toastrService.success('Material quantity updated successfully');
    }
    else {

      if (this.AdjustShippingCalculate(1) == true) {
        //this.modifyAdjustChargesSection();
        this.BindAdjustmentChargesMaterialDropDownList();
        //this.UpdateAdjustmentChargesGrid();

        this.orderManagementAdjustCharges.AddExistingMaterial(Number(this.SelectMaterial), Number(this.OQuantity));

        this.UpdateAdjustmentExistingChargesGrid();
        this.ResetMaterial();
        var messages = "MaterialAddedSuccss";
        var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        if (messagesData != undefined) { this.toastrService.info(messagesData); }
      }
      //this.toastrService.success('Material Add Successfully.');
    }


  }

  DeleteMaterial(id: number) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    for (var i = 0; i < this.MaterialDetails.length; i++) {

      if (this.MaterialDetails[i].materialID == id) {

        //var cal3 = Math.ceil(Number(this.MaterialDetails[i].quantity) / Number(this.MaterialDetails[i].propertyValue));
        var cal3 = 0;

        if (this.MaterialDetails[i].code == "F23") {
          //cal3 = Math.ceil((this.IsShipment ? Number(this.MaterialDetails[i].shippedQuantity) : Number(this.MaterialDetails[i].quantity)) / Number(this.MaterialDetails[i].propertyValue));
          //this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
          //this.NPMIPallet = this.NPMIPallet - Number(cal3 * 2);
          this.MaterialDetails.splice(i, 1);

          // this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
          this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
        }
        else {
          cal3 = Math.ceil((this.IsShipment ? Number(this.MaterialDetails[i].shippedQuantity) : Number(this.MaterialDetails[i].quantity)) / Number(this.MaterialDetails[i].propertyValue));
          this.TotalPalates = this.TotalPalates - Number(cal3);
          this.MaterialDetails.splice(i, 1);
          //  this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;

        }
        this.copyMaterialAndShippingMaterialForCharges();
        this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
        //this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        this.selection = new SelectionModel<PeriodicElement>(true, [])
        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
          if (this.ShippingMaterialDetails[i].flag == 0) {

            if (this.IsShipment) {
              this.ShippingMaterialDetails[i].shippedQuantity = ((Number(this.ShippingMaterialDetails[i].shippedQuantity) - Number(cal3)) < 0 ? 0 : Number(this.ShippingMaterialDetails[i].shippedQuantity) - Number(cal3));
              this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));
            }
            else {
              this.ShippingMaterialDetails[i].quantity = ((Number(this.ShippingMaterialDetails[i].quantity) - Number(cal3)) < 0 ? 0 : (Number(this.ShippingMaterialDetails[i].quantity) - Number(cal3)));
              this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));
            }

            this.copyMaterialAndShippingMaterialForCharges();
            // this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.removeZeroValuePallet();
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI);
            //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails);
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            this.refershMaterial(this.ShippingMaterialDetails);
          }
        }
        this.BindAdjustmentChargesMaterialDropDownList();
        this.removeAdjustChargesFromList(id);

      }

    }

    this.UpdateAdjustmentExistingChargesGrid();
  }

  SaveMaterialProperties() {

    //var existingMaterial = this.MaterialDetails.(this.selectedMaterialItems[0].id
    var selec = this.SelectMaterialData;

    var isValidationError: boolean = false;
    var messageCode: string = '';
    if (this.editVerifyEquipmentMaterialProperty.materialWeight <= 0) {
      messageCode = 'materialweightgreaterthanzeor'
      // this.toastrService.error("Please enter a valid material weight greater than zero.");
      isValidationError = true;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {
      messageCode = 'validmaterialquantityperpallet'
      //this.toastrService.error("Please enter the valid material quantity per pallet.");
      isValidationError = true;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {
      messageCode = 'validpalletquantityintoequipement'
      //this.toastrService.error("Please enter the valid Pallet quantity for the equipment.");
      isValidationError = true;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {
      messageCode = 'validmaerialquantityintoequipement'
      //this.toastrService.error("Please enter the valid material quntity for the equipment.");
      isValidationError = true;
    }

    if (isValidationError) {

      var messageData = this.AllToasterMessage.find(x => x.code == messageCode)?.message1;
      this.toastrService.error(messageData);
      return false;
    }

    var selectedMaterialProperties: MaterialPropertyGrid[] = [];

    selectedMaterialProperties.push({
      equipmentID: this.SelectEquipment,
      materialID: Number(this.SelectMaterial),
      materialName: "",
      materialWeight: Number(this.editVerifyEquipmentMaterialProperty.materialWeight),
      palletInEquipement: Number(this.editVerifyEquipmentMaterialProperty.propertyValuePE),
      unitInEquipement: Number(this.editVerifyEquipmentMaterialProperty.propertyValueUE),
      unitInPallet: Number(this.editVerifyEquipmentMaterialProperty.propertyValueUP)
    });

    this.orderManagementService.SaveMulitpleMaterialProperties(selectedMaterialProperties).subscribe(result => {
      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
        this.SelectMaterialData.propertyValue = Number(selectedMaterialProperties[0].unitInPallet);

        //this.SelectMaterialData.code = this.MaterialDetails.find(x => Number(x.materialID) == Number(this.SelectMaterial))?.code;
        this.SelectMaterialData.code = this.MaterialData.find(x => Number(x.id) == Number(this.SelectMaterial))?.hierarchyCode;


        // this.CommodityData = result.data == undefined ? result.Data : result.data;
        $("#materialPropertyPopup").modal('hide');
        this.modifyMaterialGrid();
      }
      else {
        var messageData = this.AllToasterMessage.find(x => x.code == 'contacttoadmin')?.message1;
        this.toastrService.error(messageData);
      }

    });
    // call on success of modify material grid
  }

  modifyMaterialGrid() {

    if (Number(this.OQuantity) <= 0) {
      this.toastrService.error("Please enter a valid quantity.");
      return false;
    }

    this.verifyMaterialProperties(this.SelectMaterial, "modifymaterial");

  }
  OnItemMaterialDataDeSelect(item: any) {

    this.SelectMaterial = 0;
    this.OQuantity = null;
    //this.ResetBoldMaterial();


  }

  OnSelectedmaterial(item: any) {
    this.SelectMaterial = item.id;
    this.selectedMaterialName = item.name;

    this.orderManagementService.MaterialQuantity(Number(this.SelectEquipment), Number(this.SelectMaterial), this.authenticationService.currentUserValue.ClientId, "Number of Units in an Equipment")
      .subscribe(
        data => {
          if (data.data != null) {

            this.OQuantity = data.data.quantity;
            this.SelectMaterialData = data.data;
          }
          else {

            this.OQuantity = null;
          }

        });
    this.EditFlag = false;
  }

  /*private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }*/

  selectOrderType() {
    console.log("OrderType Change");
    this.OrderTypeData.forEach((value, index) => {
      if (Number(value.id) === Number(this.OrderTypeId)) {
        this.orderManagement.OrderTypeCode = value.code;
        this.orderManagement.OrderTypeId = Number(value.id);

        this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;
        this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

        this.BindMaterialList(this.orderManagement.Id, 0);



        this.resetValidationCss();
      }
    });

    if (this.shipfromtypelist != undefined && this.shipfromtypelist.length > 0) { this.shipfromtypelist.splice(0, this.shipfromtypelist.length); }
    if (this.shiptolist != undefined && this.shiptolist.length > 0) { this.shiptolist.splice(0, this.shiptolist.length); }

    this.getShipToType();
    this.getShipFromType();
    this.contactlist = [];
    this.contactfromlist = [];
    this.shipfromlist = [];
    this.enduserlist = [];
    this.addressnamelist = [];
    this.contracttolist = [];
    this.FromContractlist = [];
    this.orderManagement.FromAddres = '';
    this.orderManagement.ToAddress = '';
    this.SelectedCountryCode = '';
    this.orderManagement.AddressName = '';
    this.SelectedContactCountryCode = '';
    this.selectedItemsB = [];
    this.orderManagement.FromCustomerContractId = null;
    this.orderManagement.FromAddressId = null;
    this.orderManagement.FromLocationId = null;
    this.orderManagement.ToCustomerContractId = null;
    this.orderManagement.ToAddressId = null;
    this.orderManagement.ToLocationId = null;


    this.GetStatus(0, this.orderManagement.OrderTypeId);

    this.GetCarrier();
    //this.selectedCarrierItems.push({ "id": this.SCarrierId, "name": this.orderManagement.carierName });
  }

  async getShipToType() {


    //this.OrderTypeId = this.OrderTypeData.find(f => f.code == this.orderManagement.SelectedOrderCode)?.id;
    console.log("Get Shipto type ");
    if (!!this.OrderTypeId) {
      this.commonOrderModel.OrderTypeId = Number(this.orderManagement.OrderTypeId != undefined ? this.orderManagement.OrderTypeId : this.OrderTypeId);
      this.commonOrderModel.ClientID = this.orderManagement.ClientId;
      this.commonOrderModel.Action = 'shiptotype';
      this.shiptotypelist = [];
      this.orderManagementService.ShipTypeData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          this.orderCommonService.ShipToType = datas;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.shiptotypelist.push(x));


          if (this.OrderType != undefined && this.OrderType == "Customer To Customer") {
            var index = this.shiptotypelist.find(x => x.name.trim() === 'RTNFIN');
            this.shiptotypelist = this.shiptotypelist.splice(index, 1);
            if (this.shiptotypelist.length > 0) {
              this.orderManagement.ShipToTypeId = this.shiptotypelist[0].id;
            }
          }

          console.log("Bind Shipto type ");

          if (this.orderManagement.Id == undefined || this.orderManagement.Id == 0) {
            this.orderManagement.ShipToTypeId = this.orderCommonService.setDefultToLocationType(Number(this.OrderTypeId));
            this.orderManagement.ShipFromTypeId = this.orderCommonService.setDefultToLocationType(Number(this.OrderTypeId));
            if (this.orderManagement.ShipToTypeId > 0) {
              this.bindDataForShipToType(Number(this.orderManagement.ShipToTypeId));
            }
            if (this.orderManagement.ShipFromTypeId > 0) {
              this.BindAllFromShipLocation(Number(this.orderManagement.ShipFromTypeId));
            }
          }
          else {
            this.orderManagement.ShipToTypeId = Number(this.SelectedSalesOrdersforEdit.ShipToTypeId);
          }
        });
    }
  }

  async getShipFromType() {
    // this.OrderTypeId = this.OrderTypeData.find(f => f.code == this.orderManagement.SelectedOrderCode)?.id;
    if (!!this.OrderTypeId) {
      this.shipfromtypelist = [];
      this.commonOrderModel.OrderTypeId = Number(this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId != null ? this.orderManagement.OrderTypeId : this.OrderTypeId);
      this.commonOrderModel.ClientID = this.orderManagement.ClientId;
      this.commonOrderModel.Action = 'shipfromtype';
      this.orderManagementService.ShipFromTypeData(this.commonOrderModel).pipe(finalize(() => {


        if (this.orderManagement != undefined && this.orderManagement.Id != undefined && this.orderManagement.Id != null && this.orderManagement.Id > 0) {
          this.orderManagement.ShipFromTypeId = this.SelectedSalesOrdersforEdit.ShipFromTypeId;
        }
        else {
          if (this.IsCustomerReturn) {
            this.orderManagement.ShipFromTypeId = this.shipfromtypelist.find(x => x.code == "CustomerLocation")?.id;
            if (this.orderManagement.ShipFromTypeId == undefined) {
              this.orderManagement.ShipFromTypeId = this.shipfromtypelist[1].id;
            }

            if (this.orderManagement.ShipFromTypeId != undefined && Number(this.orderManagement.ShipFromTypeId) > 0) {
              this.BindAllFromShipLocation(Number(this.orderManagement.ShipFromTypeId));
            }
          }
          else {
            if (!this.IsCustomerToCustomer)
              this.orderManagement.ShipFromTypeId = 0;
          }
        }
      }))
        .subscribe(result => {
          var datas = result.data;
          this.filterShipFromTypeModel = Object.assign({}, datas);
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id),
              code: item.code
            };
          }).forEach(x => this.shipfromtypelist.push(x));
          if (this.OrderType.trim() == "Customer To Customer") {
            var index = this.shipfromtypelist.find(x => x.code.trim() === 'RTNFIN');
            this.shipfromtypelist = this.shipfromtypelist.splice(index, 1);
            if (this.shipfromtypelist.length > 0) {
              this.orderManagement.ShipFromTypeId = this.shipfromtypelist[0].id;
              //this.BindAllFromShipLocation(Number(this.orderManagement.ShipFromTypeId));
            }
          }

          console.log("Get ShipFrom type ");

        });
    }
  }


  selectShipType(event) {

    console.log("Change ShipFrom type ");
    this.selectedshipfromItems = [];
    this.ResetFromLocationDependantValues();
    this.TempFromLocation = [];
    this.TempToLocation = [];

    if (event.target.value != 0) {
      this.BindAllFromShipLocation(event.target.value);
    }
    else {
      this.orderManagement.ShipFromTypeId = 0;
      this.shipfromlist = [];
    }
  }

  async BindAllFromShipLocation(LocationFunctionFromID) {

    this.LoctionFuntionFromId = Number(LocationFunctionFromID);
    this.orderManagement.ShipFromTypeId = Number(this.LoctionFuntionFromId);

    var isPutCode: boolean = true;

    var wearHouse = this.shipfromtypelist.find(x => Number(x.id) == this.LoctionFuntionFromId)?.code;
    if (wearHouse != undefined && (wearHouse == 'Warehouse' || wearHouse == 'WashFacility')) {
      isPutCode = false;
    }

    if (!!this.OrderTypeId) {
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      this.commonOrderModel.Action = 'shipfrom';
      this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionFromId);
      this.shipfromlist = [];
      this.selectedshipfromItems = [];
      this.orderManagementService.ShipFromData(this.commonOrderModel).pipe()
        .subscribe(result => {
          var datas = result.data;
          this.filterShipFromModel = datas;

          datas.map(item => {
            return {
              name: isPutCode ? item.name + "-" + item.code : item.name,
              id: Number(item.id),
              locationTypeCode: item.locationTypeCode
            };
          }).forEach(value => this.shipfromlist.push(value));
          this.RemoveFromLocation();

          console.log("Get ShipFromtype Location ");
        });


    }
  }



  selectShipToType(event) {
    console.log("change Shipto type ");
    this.selectedItemsB = [];
    this.ResetDependantValues();
    this.TempToLocation = [];
    this.TempFromLocation = [];
    if (event.target.value != 0) {

      this.LoctionFuntionToId = Number(event.target.value);
      this.orderManagement.ShipToTypeId = Number(this.LoctionFuntionToId);
      this.bindDataForShipToType(Number(event.target.value));


    }
    else {

      this.orderManagement.ShipToTypeId = 0;
      this.shiptolist = [];


    }
  }

  bindDataForShipToType(shipto: number) {
    if (shipto != 0) {

      this.isStockTransfer ? (this.isScheduleDateExist = false) : (this.isDateExist = false);

      //if (!!!this.orderManagement.RequestedDeliveryDate) {
      //  this.getShipToType();
      //  this.isDateExist = true;
      //  return;
      //}
      this.LoctionFuntionToId = Number(shipto);

      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'shipto';
        this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId == undefined || this.LoctionFuntionToId == null ? 0 : this.LoctionFuntionToId);

        var isPutCode: boolean = true;

        var wearHouse = this.shiptolist.find(x => Number(x.id) == Number(this.LoctionFuntionToId))?.code;
        if (wearHouse != undefined && (wearHouse == 'Warehouse' || wearHouse == 'WashFacility')) {
          isPutCode = false;
        }



        this.orderManagementService.ShipToData(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            this.filterShipToModel = datas;

            this.shiptolist = [];
            datas.map(item => {
              return {
                name: isPutCode ? item.name + '-' + item.code : item.name,
                id: Number(item.id),
                locationTypeCode: item.locationTypeCode
              };
            }).forEach(x => this.shiptolist.push(x));

            this.RemoveToLocation();

            console.log("Bind Shipto type Location ");
          });


      }
    }

  }
  removeToLocationSelect(event) {
    this.ResetDependantValues();
  }
  ResetDependantValues() {

    if (!this.ARChargesSentToAccounting) {
      this.selectedETDItems = [];
      //this.selectedCarrierItems = [];
      this.orderManagement.ToAddress = '';
      this.orderManagement.ShipToLocationContactId = 0;
      this.orderManagement.AddressName = '';
      if (!this.IsCollections && !this.IsStockTransfer) {
        this.orderManagement.PurchaseOrderNumber = '';
      }


    }

    if (this.orderManagementAdjustCharges != undefined && this.orderManagementAdjustCharges != null && this.orderManagementAdjustCharges.allAdjustChargesData != undefined) {
      this.orderManagementAdjustCharges.allAdjustChargesData = [];


    }
    if (this.orderManagementAdjustCharges != undefined && this.orderManagementAdjustCharges != null && this.orderManagementAdjustCharges.defaultContractChargesData != undefined) {

      this.orderManagementAdjustCharges.defaultContractChargesData = [];


    }
    if (this.orderManagementAdjustCharges != undefined && this.orderManagementAdjustCharges != null && this.orderManagementAdjustCharges.SelectedContractCharges != undefined) {

      this.orderManagementAdjustCharges.SelectedContractCharges = [];

    }

    this.orderManagement.ToContractId = 0;

    console.log("Remove all depedent value of ship to type ");
  }

  ResetFromLocationDependantValues() {

    this.orderManagement.FromAddres = '';
    this.orderManagement.ShipFromLocationContactId = 0;
    this.orderManagement.FromContractId = 0;
    console.log("Clear ship from type dependent ");
  }

  async selectShipTo(event) {



    if (event.id != 0) {
      //this.MaterialData = [];
      //this.FilterMaterialData.forEach(val => this.MaterialData.push(Object.assign({}, val)));

      //this.MaterialDataForAdjustShipping = [];
      //this.FilterMaterialDataForAdjustShipping.forEach(val => this.MaterialDataForAdjustShipping.push(Object.assign({}, val)));



      this.ResetDependantValues();
      this.orderManagement.ToLocationId = Number(event.id);
      this.LocationId = Number(event.id);

      if (this.orderManagement != undefined) {
        if (this.isLocationChangeByUser) {
          this.orderManagement.OverrideCreditHold = false;
        }
        else {
          if (this.SelectedSalesOrdersforEdit != undefined) { this.orderManagement.OverrideCreditHold = this.SelectedSalesOrdersforEdit.OverrideCreditHold; }
        }
      }


      this.orderManagementAdjustCharges.DefaultCommodityID = this.filterShipToModel.find(f => f.id == this.LocationId).defaultCommodityID;
      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {


        this.selectaddressname(this.LocationId);



        if (!this.IsStockTransfer && !this.IsCustomerReturn && !this.ARChargesSentToAccounting && !this.IsChargeOrder) { this.BindAvailableCredit(Number(this.LocationId)); }


        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'contact';
        //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
        this.commonOrderModel.LocationID = this.LocationId;

        this.contactlist = [];
        //if (!this.ARChargesSentToAccounting) {
        await this.GetEquipment(this.orderManagement.ToLocationId, this.orderManagement.ClientId);

        if (!(this.IsCustomerReturn || this.IsStockTransfer || this.IsCollections)) { //|| this.ARChargesSentToAccounting
          this.BindFuelCharges(Number(this.orderManagement.ToLocationId == undefined ? this.LocationId : this.orderManagement.ToLocationId));

          this.BindSalesManagerListData();

        }

        //}
        this.orderManagementService.ShipToContactData(this.commonOrderModel).pipe()
          .subscribe(result => {
            console.log("Bind ToLocation based contact ");
            var datas = result.data;
            if (datas.length > 0) {
              this.filterContactModel = datas;
              this.orderManagement.ShipToLocationContactId = datas[0].id;
              this.contactlist = [];
              datas.map(item => {
                return {
                  name: item.name,
                  id: Number(item.id)
                };
              }).forEach(x => this.contactlist.push(x));
            }
            else {
              this.orderManagement.ShipToLocationContactId = 0;
            }

            //this.selectEndUser(this.LocationId);
            this.TotalPalates = 0;




            //if (!this.isStockTransfer) {
            //  if (!!!this.orderManagement.RequestedDeliveryDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {

            //    return false;
            //  }
            //}
            //else {
            //  if (!!!this.orderManagement.ScheduledShipDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {

            //    return false;
            //  }
            //}


            if (!this.IsCustomerReturn) {


              this.bindDataForToLocationContractRelated();
            }
            else {

              var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

              this.Tocontract(this.orderManagement.ToLocationId, selectedDate, this.OrderTypeId);
            }

            //1003 2020-09-22/this.selectContractTo(this.LocationId);
          });
      }
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      this.commonOrderModel.Action = 'shipto';
      this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);
      this.commonOrderModel.LocationID = Number(this.orderManagement.ToLocationId);
      this.orderManagementService.ShipToAddressData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          if (datas != null && datas != undefined) {
            this.orderManagement.ToAddress = datas.toLocationAddressName;
            this.SelectedCountryCode = datas.countryCode;
            this.orderManagement.ToAddressId = datas.addressID;
            this.FilterAdjustmentChargeSectionCharges();
          }
          else {
            this.orderManagement.ToAddress = '';
            this.SelectedCountryCode = '';
          }

          console.log("Bind Shipto address ");
        });


      if (this.orderManagement != undefined && this.orderManagement.Id != undefined && Number(this.orderManagement.Id) > 0) {
        if (!this.IsStockTransfer) {
          this.ChangeShiptoLocationEditValidation();
        }
        else if (this.IsStockTransfer) {
          this.ChangeShipTOLocationEditForStockTransfer();
        }
      }


      if (this.TempFromLocation.length > 0) {
        this.shipfromlist.push({
          name: this.TempFromLocation[0].name,
          id: Number(this.TempFromLocation[0].id),
          locationTypeCode: this.TempFromLocation[0].locationTypeCode
        });
      }

      this.RemoveFromLocation();
    }


  }



  async onRequestedDeliveryDateChange(event) {

    if (event == null) return;


    var reqDate = this.orderManagement.RequestedDeliveryDate = event;

    if (this.orderManagement.ToLocationId != undefined && this.orderManagement.ToLocationId > 0 && (this.IsOpenOrderNeedsToBeCompleted || this.IsSendforShipping || this.IsShipment == false) && (this.IsCustomer || this.IsCPUOrder || this.IsCustomerToCustomer || this.IsChargeOrder)) {

      this.BindAvailableCredit(this.orderManagement.ToLocationId);
      this.BindFuelCharges(this.orderManagement.ToLocationId);
    }




    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0 || (this.SelectedSalesOrdersforEdit != undefined && this.orderManagementService.convertDatetoStringDate(this.SelectedSalesOrdersforEdit.RequestedDeliveryDate) != this.orderManagementService.convertDatetoStringDate(this.orderManagement.RequestedDeliveryDate))) {
      if (this.IsCustomer || this.IsCPUOrder || this.IsCustomerToCustomer || this.IsChargeOrder) {


        if (this.orderManagement.ToLocationId != undefined && this.orderManagement.ToLocationId > 0 && this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId > 0) {

          await this.LocationAllMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);

          //if (this.MaterialDetails.length == 0) {
          //  this.LocationMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          //}

          //if (this.ShippingMaterialDetailForUI.length == 0) {
          //  this.LocationShippingMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          //}

          await this.Tocontract(this.orderManagement.ToLocationId, this.orderManagement.RequestedDeliveryDate, this.orderManagement.OrderTypeId);

          if (this.IsCustomerToCustomer && (this.orderManagement.FromLocationId != undefined || this.orderManagement.FromLocationId != null || this.orderManagement.FromLocationId > 0)) {

            await this.Fromcontract(this.orderManagement.FromLocationId, this.orderManagement.RequestedDeliveryDate, this.orderManagement.OrderTypeId);
          }

        }

      }
      else if (this.IsCustomerReturn) {

        if (this.orderManagement.FromLocationId != undefined && this.orderManagement.FromLocationId > 0 && this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId > 0) {

          await this.LocationAllMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
          //if (this.MaterialDetails.length == 0) {
          //  this.LocationMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
          //}

          //if (this.ShippingMaterialDetailForUI.length == 0) {
          //  this.LocationShippingMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
          //}
          await this.Fromcontract(this.orderManagement.FromLocationId, this.orderManagement.RequestedDeliveryDate, this.orderManagement.OrderTypeId);
        }


      }
    }

  }

  async onScheduleShipDateChange(event) {

    if (event == null) return;

    this.orderManagement.ScheduledShipDate = event;

    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0 || (this.SelectedSalesOrdersforEdit != undefined && this.orderManagementService.convertDatetoStringDate(this.SelectedSalesOrdersforEdit.ScheduledShipDate) != this.orderManagementService.convertDatetoStringDate(this.orderManagement.ScheduledShipDate))) {
      if (this.isStockTransfer) {

        if (this.orderManagement.ToLocationId != undefined && this.orderManagement.ToLocationId > 0 && this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId > 0) {

          await this.LocationAllMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          //if (this.MaterialDetails.length == 0) {
          //  this.LocationMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          //}

          //if (this.ShippingMaterialDetailForUI.length == 0) {
          //  this.LocationShippingMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          //}

          await this.Tocontract(this.orderManagement.ToLocationId, this.orderManagement.ScheduledShipDate, this.orderManagement.OrderTypeId);
        }
      }
    }
  }




  sleepExecution(milisecond: any) {
    return new Promise(resolve => setTimeout(resolve, milisecond));
  }



  async bindDataForToLocationContractRelated() {


    console.log("bind contract and location related things");
    console.log("Equipmnet data :");
    console.log(this.SelectEquipment);


    if (this.SelectEquipment == undefined) {
      console.log("undefined select equipmnet");
      console.log(new Date());
      await this.sleepExecution(1000);
      console.log("waiting complete");
      console.log(new Date());
    }

    // var equipmentSelected = setInterval(() => {
    //  ;
    if (this.SelectEquipment != undefined && this.SelectEquipment != null) {

      await this.LocationAllMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);

      if (!this.isStockTransfer && !this.IsCollections) {
        if (!!!this.orderManagement.RequestedDeliveryDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {
          return false;
        }
      }
      else if (this.isStockTransfer || this.IsCollections) {
        if (!!!this.orderManagement.ScheduledShipDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {
          return false;
        }
      }
      var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

      if (!this.IsCustomerReturn)
        this.Tocontract(this.orderManagement.ToLocationId, selectedDate, this.OrderTypeId);

    }

    //}, 50);




  }


  ///////////////////////////////////////////////
  /// This method use to get the salesmanager detail
  /// Developed By Kapil Pandey
  /// On : 17-Sep-2020
  //////////////////////////////////////////////////
  BindSalesManagerListData() {
    var locationID = 0;
    if (this.IsCustomerReturn) {
      locationID = this.orderManagement.FromLocationId;
    }
    else {
      locationID = this.orderManagement.ToLocationId;
    }


    if (this.orderManagement.OrderTypeCode == GlobalConstants.StockTransfer || this.orderManagement.OrderTypeCode == GlobalConstants.Collections) {
      this.orderManagement.SalesManager = '';
      return false;
    }

    this.orderManagementService.GetAllSalesManagerList(locationID)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var SalesManagersList = result.data == undefined ? result.Data : result.data;
            if (SalesManagersList != undefined && SalesManagersList != null && SalesManagersList.length > 0) {
              this.orderManagement.SalesManager = SalesManagersList[0].name;
            }
            else {
              this.orderManagement.SalesManager = '';
            }
          }
        }
      );


  }

  stopAutoCallRequestedCalender: boolean = false;
  stopAutoCallScheduleShpCalender: boolean = false;


  ResetAdjustmentChargesService() {
    if (this.orderManagementAdjustCharges != undefined && this.orderManagementAdjustCharges != null) {
      this.orderManagementAdjustCharges.OrderID = null;
      this.orderManagementAdjustCharges.OrderTypeID = null;
      this.orderManagementAdjustCharges.OrderTypeCode = '';
      this.orderManagementAdjustCharges.OrderStatusCode = '';
      this.orderManagementAdjustCharges.shipToLocationID = null;
      this.orderManagementAdjustCharges.shipFromLocationID = null;
      this.orderManagementAdjustCharges.contractID = null;
      this.orderManagementAdjustCharges.allAdjustChargesData = [];
      this.orderManagementAdjustCharges.defaultContractChargesData = [];
      this.orderManagementAdjustCharges.DefaultCommodityID = null;
      this.orderManagementAdjustCharges.ChargeRatePerMile = null;
      this.orderManagementAdjustCharges.editIndex = -1;
      this.orderManagementAdjustCharges.TotalAmount = 0;

      this.orderManagementAdjustCharges.IsLocationChangeByUser = false;
      this.orderManagementAdjustCharges.IsShipmentCreated = false;
      this.orderManagementAdjustCharges.IsToContractChangeByUser = false;
      this.orderManagementAdjustCharges.MaterialDetails = [];
      this.orderManagementAdjustCharges.ShippingMaterialDetails = [];
      this.orderManagementAdjustCharges.MaxPalletSize = 0;
      this.orderManagementAdjustCharges.NPMIPallets = 0;
      this.orderManagementAdjustCharges.PassthrowPercentage = 0;
      this.orderManagementAdjustCharges.PerMileCharge = 0;
      this.orderManagementAdjustCharges.RequestedDelieveryDate = '';
      this.orderManagementAdjustCharges.ScheduleShipDate = '';
      this.orderManagementAdjustCharges.ShippingOrdersDetails = [];




    }
  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 18-Sep-2020
  //////////////////////////////////////////////////
  async BindOrderDetails(orderID, OrderType, item: any = null) {
    this.isRegularScreen = true;
    this.buttonBar.disableAction('copy');
    this.regularOrderHasReadOnlyAccess = false;
    this.isTruckOrderNotUsed = false;
    this.isOrderSentToMAS = false;
    this.isChargeOrderSentToMAS = false;

    console.log("regular order clear localstorage");
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('edit');
    // this.buttonBar.enableAction('shipWith');
    // this.buttonBar.enableAction('save');
    this.OrderType = OrderType;
    this.SelectedItem = item;
    this.SelectedOrderId = orderID;
    localStorage.setItem('OrderType', null);
    localStorage.setItem('OrderStatus', null);
    localStorage.setItem('OrderNumber', null);
    localStorage.setItem('SelectedOrderId', null);
    localStorage.setItem('FromLocationId', null);
    localStorage.setItem('ToLocationId', null);
    localStorage.setItem('Orderdata', null);
    console.log("regular order clear localstorage end");
    console.log("regular order set data localstorage start");
    localStorage.setItem('OrderType', OrderType);
    console.log("Order Type");
    console.log(OrderType);
    localStorage.setItem('OrderStatus', item.Status);
    if (item.Status == undefined) {
      item.Status = item.OrderStatusName;
      localStorage.setItem('OrderStatus', item.Status);
    }
    localStorage.setItem('OrderNumber', item.OrderNumber);
    if (item.OrderNumber == undefined) {
      item.OrderNumber = item.orderNumber;
      localStorage.setItem('OrderNumber', item.OrderNumber);
    }

    localStorage.setItem('SelectedOrderId', orderID);
    localStorage.setItem('FromLocationId', item.FromLocationId);
    if (item.FromLocationId == undefined) {
      item.FromLocationId = item.FromLocationID;
      localStorage.setItem('FromLocationId', item.FromLocationId);
    }
    localStorage.setItem('ToLocationId', item.ToLocationID);
    if (item.ToLocationID == undefined) {
      item.ToLocationID = item.ToLocationId;
      localStorage.setItem('ToLocationId', item.ToLocationID);
    }
    var SelectedData = JSON.stringify(item);
    localStorage.setItem('Orderdata', SelectedData);
    console.log("regular order set data localstorage end");
    console.log(SelectedData);

    //To Disable ship with button
    if ((OrderType.trim().toLowerCase() != "customer" || OrderType.trim().toLowerCase() != "cpu order" || OrderType.trim().toLowerCase() != "stock transfer" || OrderType.trim().toLowerCase() != "collections")
      && (item.Status.trim().toLowerCase() != "open order needs to be completed")) {
      this.buttonBar.disableAction('shipWith');
    }
    else if ((OrderType.trim().toLowerCase() != "customer" || OrderType.trim().toLowerCase() != "cpu order") && (item.FromLocationId == null || item.FromLocationId == "")) {
      this.buttonBar.disableAction('shipWith');
    }
    else if ((OrderType.trim().toLowerCase() != "stock transfer" || OrderType.trim().toLowerCase() != "collections") && (item.ToLocationID == null || item.ToLocationID == "")) {
      this.buttonBar.disableAction('shipWith');
    }

    this.SaveAndNotifyHit = false;

    this.stopAutoCallRequestedCalender = true;
    this.stopAutoCallScheduleShpCalender = true;
    this.CurrentOrderId = Number(orderID);
    this.CurrentOrderType = OrderType;
    this.selectedCarrierItems = [];
    var index = this.SalesOrderforEdit.findIndex(x => x.OrderId === orderID && x.OrderType === OrderType);
    this.EnableDisableEditNextOrderBtn(index);
    console.log("regular order start getting data from GetSalesOrderDataByOrderId");
    await this.GetSalesOrderDataByOrderId(Number(orderID), OrderType);
    console.log("regular order end getting data from GetSalesOrderDataByOrderId");
    console.log("regular order mas related data getting start");
    console.log("Call CheckStatusForSendtoMass to enable\disable 1 R");
    //await this.CheckStatusForSendtoMass(orderID, OrderType);
    //this.CheckStatusResendtoMass(orderID, OrderType);
    console.log("regular order mas related data getting end");

    this.EnableDisableCancelBtnOnSelection(item);

   // await this.freezOrder(item.OrderCondition, OrderType, item.Status);
  }

  async GetEquipment(LocationId: any, ClientId: any) {



    this.selectedETDItems = [];
    this.orderManagementService.GetEquipment(LocationId, ClientId)
      .subscribe(
        data => {
          console.log("equipment databinding")
          if (!!!this.orderManagement.Id || this.orderManagement.Id == 0 || (this.isLocationChangeByUser && !this.IsShipment)) {
            this.SelectEquipment = data.data.id;

            console.log("new select equipment");
            console.log(this.SelectEquipment);
            this.selectedETDItems.push({ "id": data.data.id, "name": data.data.name });
            this.orderManagement.EquipmentTypeId = this.SelectEquipment;
            this.selectedETDName = data.data.name;
          }
          else {
            this.SelectEquipment = this.orderManagement.EquipmentTypeId;
            var selectedEquipment = this.EquipmentTypeData.find(f => Number(f.id) == Number(this.SelectEquipment));

            console.log("old select equipment");
            console.log(this.SelectEquipment);

            this.selectedETDItems.push({ "id": this.SelectEquipment, "name": selectedEquipment.name });
            this.selectedETDName = selectedEquipment.name;
          }



          if (this.SelectEquipment > 0) {
            this.Equipmentvalidate = false;
            var dd = this.EquipmentTypeData.find(f => f.id == this.SelectEquipment);
            this.EquivalentPallates = dd.maxPalletQty;
            this.orderManagementAdjustCharges.MaxPalletSize = dd.maxPalletQty == undefined || dd.maxPalletQty == null ? 0 : dd.maxPalletQty;
            this.GetFreightMode(this.SelectEquipment, this.orderManagement.ClientId);
          }
        });

  }


  async GetStatus(OrderId: number, OrderTypeID: number) {

    console.log("Order status get");
    this.OrderStatusData = [];

    this.orderManagementService.OrderStatusList(OrderId, OrderTypeID)
      .subscribe(
        data => {
          this.OrderStatusData = data.data;
          console.log(this.OrderStatusData);
          if (OrderId == 0) {
            this.Ordervalidate = true;

            var openOrderStatus = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted);

            if (openOrderStatus != undefined && (this.orderManagement.OrderStatusId == undefined || this.orderManagement.OrderStatusId <= 0)) {
              this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.id;
              this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.code;
              this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.name;
            }
            else if (openOrderStatus == undefined) {
              this.orderManagement.OrderStatusId = this.OrderStatusData[0].id;
              this.orderManagement.OrderStatusCode = this.OrderStatusData[0].code;
              this.orderManagement.OrderStatusName = this.OrderStatusData[0].name;
            }
            else if (this.orderManagement.OrderStatusId > 0 && openOrderStatus != undefined) {
              var oldOrderStatus = this.OrderStatusData.find(f => Number(f.id) == Number(this.orderManagement.OrderStatusId));

              if (oldOrderStatus == undefined) {
                this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.id;
                this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.code;
                this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.name;

              }
            }
          }
          else if (this.SelectedSalesOrdersforEdit != undefined && this.orderManagement != undefined) {
            this.Ordervalidate = false;
            this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.id;
            this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.code;
            this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.name;

          }

          console.log("order status bind ");

          console.log(this.orderManagement.OrderStatusId);
          console.log(this.orderManagement.OrderStatusCode);
          console.log(this.orderManagement.OrderStatusName);

          if (OrderId > 0) {
            if (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping) {
              this.OrderStatusDisableProp = false;
              this.OrderStatusEnableDisable(false);
            }
            else {
              this.OrderStatusDisableProp = true;
              this.OrderStatusEnableDisable(true);
            }

          }
          else {
            //this.OrderStatusDisableProp = true;
            if (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping) {
              this.OrderStatusDisableProp = false;
              this.OrderStatusEnableDisable(false);
            }
            else {
              this.OrderStatusDisableProp = true;
              this.OrderStatusEnableDisable(true);
            }

          }


          this.SelectedOrderStatusSearchable();
        });

  }


  async SelectedOrderTypeSearchable() {
    console.log("select order type searchable");
    console.log(this.orderManagement.OrderTypeId);
    console.log("Old Order Data")
    console.log(this.OrderTypeData);

    if (this.orderManagement.OrderTypeId != undefined && this.orderManagement.OrderTypeId > 0) {
      this.selectedOrderType.splice(0, this.selectedOrderType.length);
      var items = this.OrderTypeData.find(x => x.id == Number(this.orderManagement.OrderTypeId));
      this.selectedOrderType.push(items);
      console.log("ordertype bind");
      console.log(this.selectedOrderType);
    }

  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 18-Sep-2020
  //////////////////////////////////////////////////
  async BindMaterialList(orderID, sectionID) {

    if (sectionID == 2) { this.MaterialDataForAdjustCharges = []; }
    if (sectionID == 0) { this.MaterialData = []; }
    if (sectionID == 1) { this.MaterialDataForAdjustShipping = []; }
    console.log("Bind Material Data");
    this.orderManagementService.GetOrderMaterialList(orderID, sectionID, this.orderManagement.OrderTypeId)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            if (sectionID == 2) { this.MaterialDataForAdjustCharges = result.data == undefined ? result.Data : result.data; }
            if (sectionID == 0) {
              this.MaterialData = result.data == undefined ? result.Data : result.data;
              this.FilterMaterialData = result.data == undefined ? result.Data : result.data;

            }
            if (sectionID == 1) {
              this.MaterialDataForAdjustShipping = result.data == undefined ? result.Data : result.data;

              let data = Object.assign([{}], this.MaterialDataForAdjustShipping);
              this.MaterialDataBackup = data;
            }

            //if we have order type Charge Order then show all Material in Adjust Charge section 19 feb 21
            if (this.orderManagement.OrderTypeCode.trim() == "ChargeOrder") {
              this.MaterialDataForAdjustCharges = [];
              this.MaterialDataForAdjustCharges = result.data == undefined ? result.Data : result.data;
            }
            console.log("Material Response API");
            console.log(result);
          }
        }
      );
  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 1-Sep-2020
  //////////////////////////////////////////////////
  BindChargeList() {
    this.orderManagementService.GetCharges()
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {

            this.ChargeData = result.data == undefined ? result.Data : result.data;

            this.RawChargeData = JSON.parse(JSON.stringify(this.ChargeData));
          }
        }
      );
  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 19-Sep-2020
  //////////////////////////////////////////////////
  BindCommodity() {
    this.orderManagementService.GetCommodities()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.CommodityData = result.data == undefined ? result.Data : result.data;
            this.CommodityData.sort((a, b) => a.name.localeCompare(b.name));
            this.orderCommonService.CommodityList = JSON.parse(JSON.stringify(this.CommodityData));

          }
        }
      );
  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 19-Sep-2020
  //////////////////////////////////////////////////
  BindPriceMethod() {
    this.orderManagementService.GetPriceMethods()
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.PriceMethodData = result.data == undefined ? result.Data : result.data;
            this.PriceMethodData.sort((a, b) => a.name.localeCompare(b.name));
            this.orderCommonService.PricemethodTypeList = JSON.parse(JSON.stringify(this.PriceMethodData));

          }
        }
      );
  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 19-Sep-2020
  //////////////////////////////////////////////////
  BindRateTypeData() {
    this.orderManagementService.GetRateType()
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.RateTypeData = result.data == undefined ? result.Data : result.data;
            this.RateTypeData.sort((a, b) => a.name.localeCompare(b.name));
            this.AllRateTypeData = JSON.parse(JSON.stringify(this.RateTypeData));

            this.orderManagementAdjustCharges.rateTypeWithUOM = JSON.parse(JSON.stringify(this.RateTypeData));

          }
        }
      );
  }

  adjustmentMaterialGridSelect(item: any) {
    this.orderManagement.adjustChargesSectionMaterialID = item.id;
    //this.orderManagement.adjustChargesSectionMaterialName = event.target['options'][event.target['options'].selectedIndex].text;
    this.orderManagement.adjustChargesSectionMaterialName = item.name;
  }

  AdjustmateriachargelDeSelect(item: any) {
    this.orderManagement.adjustChargesSectionMaterialID = 0;
    this.orderManagement.adjustChargesSectionMaterialName = "";
  }
  ///////////////////////////////////////////////
  /// This method Refresh Rate and PriceMethod.
  /// Developed By Kapil Pandey
  /// On : 21-Sep-2020
  //////////////////////////////////////////////////
  RefershPriceMethodAndComputationMethod(item: any, source: string) {

    this.orderManagement.adjustChargesSectionMaterialID = Number(this.orderManagement.adjustChargesSectionMaterialID);
    this.orderManagement.adjustChargesSectionChargeID = item.id;
    if (source == 'material') {
      this.orderManagement.adjustChargesSectionMaterialName = item.name;

    }
    else {
      this.orderManagement.adjustChargesSectionChargeName = item.name;

    }

    if (this.orderManagement.adjustChargesSectionChargeID <= 0)
      return false;

    this.orderManagementService.GetRefershComputationMethod(this.orderManagement.adjustChargesSectionChargeID)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var mappedRateType: any[] = [];
            mappedRateType = result.data;
            this.RateTypeData.splice(0, this.RateTypeData.length);
            if (mappedRateType != undefined && mappedRateType != null && mappedRateType.length > 0) {
              mappedRateType.forEach((value, index) => {
                this.AllRateTypeData.forEach((valueratetype, ratetypeindex) => {
                  if (Number(valueratetype.id) == Number(value.chargeComputationMethodID)) {
                    this.RateTypeData.push(valueratetype);
                  }
                });
              });
            }
            this.orderCommonService.RateTypeList = [];

            if (this.RateTypeData.length == 0) {
              this.RateTypeData = JSON.parse(JSON.stringify(this.AllRateTypeData));
            }
            this.orderCommonService.RateTypeList = JSON.parse(JSON.stringify(this.RateTypeData));

          }
          if (this.orderManagementAdjustCharges.SelectedContractCharges != undefined && this.orderManagementAdjustCharges.SelectedContractCharges != null && this.orderManagement.adjustChargesSectionChargeID > 0) {
            this.orderCommonService.ContractChargesData = this.orderManagementAdjustCharges.SelectedContractCharges;
            var defaultAdjusmentChargesContractData: AdjustChargesModel = this.orderCommonService.getDefaultSelectedContractDetails(this.orderManagement.adjustChargesSectionMaterialID, this.orderManagement.adjustChargesSectionChargeID);
            if (defaultAdjusmentChargesContractData != undefined && defaultAdjusmentChargesContractData != null) {

              // if selected material available into contract then default value automatically selected
              this.orderManagement.adjustChargesRateTypeID = defaultAdjusmentChargesContractData.rateTypeID;
              this.orderManagement.adjustChargesRateTypeName = defaultAdjusmentChargesContractData.rateTypeName;
              this.orderManagement.adjustChargesRateValue = defaultAdjusmentChargesContractData.rateValue;

              this.orderManagement.adjustChargesShowOnBOL = defaultAdjusmentChargesContractData.showOnBOL;
              this.orderManagement.adjustChargesCommodityID = defaultAdjusmentChargesContractData.commodityID;
              this.orderManagement.adjustChargesCommodityName = defaultAdjusmentChargesContractData.commodityName;
              this.orderManagement.adjustChargesPriceMethodID = defaultAdjusmentChargesContractData.priceMethodID;
              this.orderManagement.adjustChargesPriceMethodName = defaultAdjusmentChargesContractData.priceMethod;


            }
            else {
              /*********************************** IF selected Material with specific chagre not avaiable into Contract *********************************/


              this.orderManagement.adjustChargesRateValue = 0;
              this.orderManagement.ChargeUnits = 1;

              var isMaterial = true;
              if (this.orderManagement.adjustChargesSectionMaterialID > 0) {

                this.ShippingMaterialDetails.forEach((value, index) => {

                  if (Number(value.materialID) == Number(this.orderManagement.adjustChargesSectionMaterialID)) {
                    isMaterial = false;
                  }
                });

              }

              var defaultPricemethod = this.orderCommonService.getMatrialDefaultPriceMethod(isMaterial);
              if (defaultPricemethod != undefined && defaultPricemethod != null) {
                this.orderManagement.adjustChargesPriceMethodID = defaultPricemethod.id;
                this.orderManagement.adjustChargesPriceMethodName = defaultPricemethod.description;
              }

              this.orderManagementAdjustCharges.DefaultCommodityID = !this.IsCustomerReturn ? this.filterShipToModel.find(f => f.id == this.orderManagement.ToLocationId).defaultCommodityID : this.filterShipFromModel.find(f => f.id == this.orderManagement.FromLocationId).defaultCommodityID;

              if (this.orderManagementAdjustCharges.DefaultCommodityID == undefined || this.orderManagementAdjustCharges.DefaultCommodityID == null || this.orderManagementAdjustCharges.DefaultCommodityID == 0) {
                this.orderManagementAdjustCharges.DefaultCommodityID = this.CommodityData.find(x => x.code = 'Produce General').id;
              }

              if (this.orderManagementAdjustCharges.DefaultCommodityID > 0) {
                var defaultCommodity = this.orderCommonService.getDefaultCommodity(this.orderManagementAdjustCharges.DefaultCommodityID);

                if (defaultCommodity != undefined && defaultCommodity != null) {
                  this.orderManagement.adjustChargesCommodityID = defaultCommodity.id;
                  this.orderManagement.adjustChargesCommodityName = defaultCommodity.description;
                }
              }

              var defaultChargesRateType: number = 0;

              this.RawChargeData.forEach((value, index) => {
                if (value.id == Number(this.orderManagement.adjustChargesSectionChargeID)) {
                  defaultChargesRateType = Number(value.chargeComputationMethodId == null ? 0 : value.chargeComputationMethodId)
                }
              });

              if (defaultChargesRateType == undefined || defaultChargesRateType == null || Number(defaultChargesRateType) <= 0) {
                var filterRateTypeData = this.orderCommonService.getDefaultRateType(isMaterial);
                if (filterRateTypeData != undefined && filterRateTypeData != null) {
                  this.orderManagement.adjustChargesRateTypeID = filterRateTypeData.id;
                  this.orderManagement.adjustChargesRateTypeName = filterRateTypeData.name;
                }
                else {
                  this.orderManagement.adjustChargesRateTypeID = this.RateTypeData[0].id;
                  this.orderManagement.adjustChargesRateTypeName = this.RateTypeData[0].name;
                }
              }
              else {
                var isExists: boolean = false;
                this.RateTypeData.forEach((value, index) => {
                  if (value.id === Number(defaultChargesRateType)) {
                    this.orderManagement.adjustChargesRateTypeID = Number(value.id);
                    this.orderManagement.adjustChargesRateTypeName = value.name;
                    isExists = true;
                  }

                  if (!isExists) {
                    this.orderManagement.adjustChargesRateTypeID = this.RateTypeData[0].id;
                    this.orderManagement.adjustChargesRateTypeName = this.RateTypeData[0].name;
                  }
                });
              }
            }

            var selectedCharge = this.orderManagementAdjustCharges.allAdjustChargesData.find(x => x.materialID == this.orderManagement.adjustChargesSectionMaterialID && x.chargeID == this.orderManagement.adjustChargesSectionChargeID);

            if (selectedCharge != undefined) {
              var selectedChargeIndex = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(selectedCharge);

              this.orderManagement.adjustChargesRateTypeID = selectedCharge.overrideRateTypeID > 0 ? selectedCharge.overrideRateTypeID : selectedCharge.rateTypeID;
              this.orderManagement.adjustChargesRateTypeName = selectedCharge.overrideRateTypeID > 0 ? selectedCharge.overrideRateTypeName : selectedCharge.rateTypeName;
              this.orderManagement.adjustChargesRateValue = selectedCharge.overrideRateValue == 0 ? selectedCharge.rateValue : selectedCharge.overrideRateValue;

              this.orderManagement.adjustChargesShowOnBOL = selectedCharge.overrideShowOnBOL;
              this.orderManagement.adjustChargesCommodityID = selectedCharge.overrideCommodityID > 0 ? selectedCharge.overrideCommodityID : selectedCharge.commodityID;
              this.orderManagement.adjustChargesCommodityName = selectedCharge.overrideCommodityID > 0 ? selectedCharge.overrideCommodityName : selectedCharge.commodityName;;
              this.orderManagement.adjustChargesPriceMethodID = selectedCharge.overridePriceMethodID > 0 ? selectedCharge.overridePriceMethodID : selectedCharge.priceMethodID;
              this.orderManagement.adjustChargesPriceMethodName = selectedCharge.overridePriceMethodID > 0 ? selectedCharge.overridePriceMethodName : selectedCharge.priceMethod;
              this.orderManagement.ChargeUnits = selectedCharge.chargeUnit;
              this.orderManagement.adjustChargesAmount = selectedCharge.overrideAmount;

              this.orderManagementAdjustCharges.editIndex = selectedChargeIndex;
            }
          }
        }
      );
  }

  ChargeDeSelect(item: any) {
    this.orderManagement.adjustChargesSectionChargeID = 0;
    this.orderManagement.adjustChargesSectionChargeName = "";
  }

  selectEndUser(event: any) {
    if (event != 0) {
      this.LocationId = Number(event);

      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'EndUser';
        //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
        this.commonOrderModel.LocationID = this.LocationId;
        this.orderManagementService.ShipToEndUser(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            this.orderManagement.EndUserId = datas[0].id;
            this.filterEndUserModel = datas;
            this.enduserlist = [];
            datas.map(item => {
              return {
                name: item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.enduserlist.push(x));
          });
      }
    }
    else {
      this.orderManagement.EndUserId = 0;
      this.enduserlist = [];
    }
  }

  selectaddressname(event: any) {
    if (event != 0) {
      this.LocationId = Number(event);
      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'AddressName';
        //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
        this.commonOrderModel.LocationID = this.LocationId;
        this.orderManagementService.ShipToUserAddressName(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            if (datas.length > 0) {
              this.orderManagement.AddressName = datas[0].name;
              this.SelectedContactCountryCode = datas[0].countryCode;
              this.orderManagement.EndUserId = datas[0].id;
              this.FilterAdjustmentChargeSectionCharges();
            }
            else {
              this.orderManagement.EndUserId = 0;
              this.orderManagement.AddressName = "";
              this.SelectedContactCountryCode = '';

            }
          });
      }
    }
    else {
      this.orderManagement.AddressName = "";
      this.orderManagement.EndUserId = 0;
      this.SelectedContactCountryCode = '';
    }
  }

  selectContractTo(event: any) {
    if (event != 0) {
      this.LocationId = Number(event);

      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'ContractTo';
        //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
        this.commonOrderModel.LocationID = this.LocationId;
        this.orderManagementService.ShipToContractTo(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            this.filterContactToModel = datas;
            this.contracttolist = [];
            datas.map(item => {
              return {
                name: item.name,
                id: Number(item.id)

              };
            }).forEach(x => this.contracttolist.push(x));
          });
      }
    }
    else {
      this.orderManagement.ToContractId = 0;
      this.contracttolist = [];
    }
  }

  async selectShipFrom(item: any) {
    if (item.id != 0) {
      //this.MaterialData = [];     
      //this.FilterMaterialData.forEach(val => this.MaterialData.push(Object.assign({}, val)));

      //this.MaterialDataForAdjustShipping = [];
      //this.FilterMaterialDataForAdjustShipping.forEach(val => this.MaterialDataForAdjustShipping.push(Object.assign({}, val))); 

      this.orderManagement.FromLocationId = item.id;
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      this.commonOrderModel.Action = 'shipto';
      this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);
      this.commonOrderModel.LocationID = Number(this.orderManagement.FromLocationId);
      this.orderManagementService.ShipToAddressData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          if (datas != null && datas != undefined) {
            this.orderManagement.FromAddres = datas.toLocationAddressName;
            this.orderManagement.FromAddressId = datas.addressID;
          }
          else {
            this.orderManagement.FromAddres = '';
          }

        });



      // this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      //this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      //this.commonOrderModel.Action = 'contact';
      //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
      // this.commonOrderModel.LocationID = this.LocationId;

      if (this.IsCustomerReturn) {
        await this.GetEquipment(this.orderManagement.FromLocationId, this.orderManagement.ClientId);

        this.BindFuelCharges(Number(this.orderManagement.FromLocationId == undefined ? this.LocationId : this.orderManagement.FromLocationId));

        this.BindSalesManagerListData();
      }

      this.contactfromlist = [];
      this.orderManagementService.ShipToContactData(this.commonOrderModel)
        .subscribe(result => {

          var datas = result.data;
          if (datas.length > 0) {
            this.orderManagement.ShipFromLocationContactId = datas[0].id;
            datas.map(item => {
              return {
                name: item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.contactfromlist.push(x));
          }
          else {
            this.orderManagement.ShipFromLocationContactId = 0;
          }

          if (this.IsCustomerReturn) {



            this.bindDataForFromLocationContractRelated();
          }
          else {



            var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;
            this.Fromcontract(Number(this.orderManagement.FromLocationId), selectedDate, Number(this.OrderTypeId));
          }
        });

      //this.orderManagement.FromAddres = this.filterShipFromModel.find(f => f.id == Number(this.orderManagement.FromLocationId)).fromLocationAddressName;


      if (this.orderManagement != undefined && this.orderManagement.Id != undefined && Number(this.orderManagement.Id) > 0) {
        if (this.IsCustomerReturn) {
          this.ChangeShipFromLocationEditValidation();
        }

      }


      if (this.TempToLocation.length > 0) {
        this.shiptolist.push({
          name: this.TempToLocation[0].name,
          id: Number(this.TempToLocation[0].id),
          locationTypeCode: this.TempToLocation[0].locationTypeCode
        });
      }


      this.RemoveToLocation();

    }
  }





  selectOrderStatus(event) {

    if (event.id != 0) {
      this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.id == Number(event.id))?.id;
      this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.id == Number(event.id))?.code;
      this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.id == Number(event.id))?.name;
      this.SelectedOrderStatusSearchable();
      this.resetValidationCssStatus();
    }
  }

  onSubmit() {


  }
  ///////////////////////////////////////////////
  /// This method use to get contract list.
  /// Developed By Abhay Singh
  /// On : 22-Sep-2020
  //////////////////////////////////////////////////



  TocontractOld(LocationID: number, RequestDate: any, OrderTypeID: number) {

    this.ToContractlist = [];
    this.orderManagementService.Tocontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {
          //  ;

          this.ToContractlist = data.data;
          //this.orderManagement.ToContractId = this.ToContractlist[0].id;
          var ordertype = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;

          //if (this.isLocationChangeByUser) {

          //  this.SelectContractTo(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.ToLocationId));
          //}
          //else {
          //  if (this.SelectedSalesOrdersforEdit != undefined) {
          //    this.orderManagement.ToContractId = this.SelectedSalesOrdersforEdit.ToContractId;
          //  }

          //this.CotractRelatedChargesBind();
          //}

          this.SelectContractTo(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.ToLocationId));

          this.CotractRelatedChargesBind();






        });

  }

  Tocontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    this.ToContractlist = [];
    var OrderID = null;
    if (!this.isLocationChangeByUser && this.orderManagement != undefined && this.orderManagement.Id != undefined)
      OrderID = this.orderManagement.Id;

    this.orderManagementService.GetContractForOrder(LocationID, RequestDate, OrderTypeID, OrderID, true).subscribe(result => {
      if (result != undefined && result.data != undefined) {

        this.ToContractlist = result.data.contractsList;
        if (result.data.selectedContract != undefined && result.data.selectedContract != null) {
          this.orderManagement.ToContractId = result.data.selectedContract.id;
          //this.CotractRelatedChargesBind();

        }
        else {
          this.orderManagement.ToContractId = 0;
        }

        if (this.isLocationChangeByUser) {
          this.GetComment(this.orderManagement.ToContractId, this.orderManagement.ToLocationId, this.orderManagement.ClientId)
        }
        else {

          if (this.SelectedSalesOrdersforEdit != undefined) {
            this.orderManagement.TransportationComment = this.SelectedSalesOrdersforEdit.TransportationComment;
            this.orderManagement.LoadingComment = this.SelectedSalesOrdersforEdit.LoadingComment;
            this.orderManagement.Comments = this.SelectedSalesOrdersforEdit.Comments;

          }
        }

        this.CotractRelatedChargesBind();

      }

    });
  }


  CotractRelatedChargesBind() {
    if (!this.isStockTransfer || !this.IsCustomerReturn || !this.IsCollections) {
      this.clearAdjustmentChargesPanel();
      var starCount = 0;
      //const interval = setInterval(() => {

      //if ((this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) || starCount > 5) {

      //clearInterval(interval);
      //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
      // if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && !this.isLocationChangeByUser)
      //  return false;

      this.BindAdjustmentChargesMaterialDropDownList();


      this.GetDefaultAdjustChargesData();



      //}
      //else
      //starCount = starCount + 1;

      //}, 50);
    }


  }


  BindAdjustmentChargesMaterialDropDownList() {

    if (this.orderManagement.OrderTypeCode.trim() == "ChargeOrder")
      return;

    this.MaterialDataForAdjustCharges = [];



    this.MaterialDetails.forEach((value, index) => {
      this.MaterialDataForAdjustCharges.push({ name: value.name, id: value.materialID });
    });


    this.ShippingMaterialDetails.forEach((value, index) => {
      this.MaterialDataForAdjustCharges.push({ name: value.name, id: value.materialID });
    });

  }

  private copyMaterialAndShippingMaterialForCharges() {
    if (this.orderManagementAdjustCharges.MaterialDetails != undefined && this.orderManagementAdjustCharges.MaterialDetails.length > 0) {
      this.orderManagementAdjustCharges.MaterialDetails.splice(0, this.orderManagementAdjustCharges.MaterialDetails.length);
    }
    else {
      this.orderManagementAdjustCharges.MaterialDetails = [];
    }
    if (this.orderManagementAdjustCharges.ShippingMaterialDetails != undefined && this.orderManagementAdjustCharges.ShippingMaterialDetails.length > 0) {
      this.orderManagementAdjustCharges.ShippingMaterialDetails.splice(0, this.orderManagementAdjustCharges.ShippingMaterialDetails.length);
    }
    else {
      this.orderManagementAdjustCharges.ShippingMaterialDetails = [];
    }
    if (this.MaterialDetails != undefined && this.MaterialDetails.length > 0) {
      // this.MaterialDetails.forEach(val => this.orderManagementAdjustCharges.MaterialDetails.push(Object.assign({}, val)));

      this.orderManagementAdjustCharges.MaterialDetails = JSON.parse(JSON.stringify(this.MaterialDetails));
    }
    if (this.ShippingMaterialDetails != undefined && this.ShippingMaterialDetails.length > 0) {
      // this.ShippingMaterialDetails.forEach(val => this.orderManagementAdjustCharges.ShippingMaterialDetails.push(Object.assign({}, val)));

      this.orderManagementAdjustCharges.ShippingMaterialDetails = JSON.parse(JSON.stringify(this.ShippingMaterialDetails));
    }



  }

  GetDefaultAdjustChargesData() {

    if (this.isStockTransfer || this.orderManagement.RequestedDeliveryDate == undefined || this.orderManagement.RequestedDeliveryDate == null)
      return;

    this.orderManagementAdjustCharges.shipToLocationID = Number(this.orderManagement.ToLocationId);
    this.orderManagementAdjustCharges.shipFromLocationID = Number(this.orderManagement.FromLocationId != undefined && Number(this.orderManagement.FromLocationId) > 0 ? this.orderManagement.FromLocationId : 0);
    this.orderManagementAdjustCharges.contractID = !this.IsCustomerReturn ? Number(this.orderManagement.ToContractId) : Number(this.orderManagement.FromContractId);
    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

    //if ((this.isLocationChangeByUser && !this.IsCustomerReturn) || (this.isFromLocationChangeByUser && this.IsCustomerReturn)) {
    this.orderManagementAdjustCharges.OrderTypeID = Number(this.orderManagement.OrderTypeId);
    this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
    //}
    //else {
    //  this.orderManagementAdjustCharges.OrderTypeID = 0;
    //  this.orderManagementAdjustCharges.OrderID = 0;
    //}





    var requestedDelieveryDate = new Date(this.orderManagement.RequestedDeliveryDate.toString());
    //this.orderManagementAdjustCharges.RequestedDelieveryDate = this.orderCommonService.convertDatetoStringDate((this.orderManagement.RequestedDeliveryDate == undefined || this.orderManagement.RequestedDeliveryDate == null) ? new Date() : this.orderManagement.RequestedDeliveryDate);
    this.orderManagementAdjustCharges.RequestedDelieveryDate = this.orderCommonService.convertDatetoStringDate(requestedDelieveryDate);
    this.copyMaterialAndShippingMaterialForCharges();
    this.FilterAdjustmentChargeSectionCharges();
    this.isRecalculate = (this.isLocationChangeByUser || this.isRequestedDelieveryDateChangeByUser);



    this.orderManagementAdjustCharges.updateContractDefault();






  }

  subscribeAdjustmentChargesGridMethod() {
    this.orderManagementAdjustCharges.defaultUpdate.subscribe(result => {

      if (result == true) {
        this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
        //|| this.ShippingMaterialDetails.length > 0 || this.MaterialDetails.length > 0

        //|| this.isToContractChangeByUser


        if (this.isRecalculate) {
          //this.orderManagementAdjustCharges.reCalculateAllOrder();
          if (!this.IsStockTransfer && !this.IsCustomerReturn && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {
            var currentCredit = this.orderManagement.AvailableCredit.replace(/\,/g, '');
            this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(currentCredit) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString()));
            this.CheckAvailableCredit();
            //this.orderManagement.AvailableCredit = formatterDecimal.format(Number(this.orderManagement.AvailableCredit))
          }
        }


        this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
        this.orderManagementAdjustCharges.isChargeCalculated = false;
        //this.orderManagementAdjustCharges.contractAdjustmentCharges.next(this.orderManagementAdjustCharges.isChargeCalculated);
      }
    });

  }

  ///////////////////////////////////////////////
  /// This method use to get contract list Ship from.
  /// Developed By Abhay Singh
  /// On : 23-Sep-2020
  //////////////////////////////////////////////////
  FromcontractOld(LocationID: number, RequestDate: any, OrderTypeID: number) {

    this.orderManagementService.Fromcontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {

          var ordertype = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;
          this.FromContractlist = data.data;

          this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));


          //if (this.isFromLocationChangeByUser) {
          //  this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));
          //}
          //else {
          //  if (this.SelectedSalesOrdersforEdit != undefined) {
          //    this.orderManagement.FromContractId = this.SelectedSalesOrdersforEdit.FromContractId;
          //  }
          //}
          //this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));
          //this.orderManagement.FromContractId = this.FromContractlist[0].id;

          if (this.IsCustomerReturn) {

            if (!this.isStockTransfer) {
              this.clearAdjustmentChargesPanel();

              var countStart: number = 0;
              // const interval = setInterval(() => {

              if ((this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) || countStart > 5) {
                // clearInterval(interval);
                //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
                if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
                  return false;
                this.BindAdjustmentChargesMaterialDropDownList();

                this.GetDefaultAdjustChargesData();



              }
              else
                countStart = countStart + 1;

              //  }, 50);
            }

          }
        });

  }

  Fromcontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    this.FromContractlist = [];
    var OrderID = null;
    if (!this.isLocationChangeByUser && this.orderManagement != undefined && this.orderManagement.Id != undefined)
      OrderID = this.orderManagement.Id;

    this.orderManagementService.GetContractForOrder(LocationID, RequestDate, OrderTypeID, OrderID, false).subscribe(result => {
      if (result != undefined && result.data != undefined) {

        this.FromContractlist = result.data.contractsList;
        if (result.data.selectedContract != undefined) {
          this.orderManagement.FromContractId = result.data.selectedContract.id;



          if (this.IsCustomerReturn) {

            if (!this.isStockTransfer) {
              this.clearAdjustmentChargesPanel();

              var countStart: number = 0;
              // const interval = setInterval(() => {

              //if ((this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) || countStart > 5) {
              // clearInterval(interval);
              //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
              if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
                return false;
              this.BindAdjustmentChargesMaterialDropDownList();

              this.GetDefaultAdjustChargesData();



              //}
              // else
              //   countStart = countStart + 1;

              //  }, 50);
            }

          }

        }
        else {
          this.orderManagement.FromContractId = 0;
        }
      }

    });
  }



  AddAdjustChargesData() {

    if (this.orderManagement.adjustChargesSectionChargeID <= 0 //|| this.orderManagement.adjustChargesCommodityID <= 0
      || this.orderManagement.adjustChargesPriceMethodID <= 0 || this.orderManagement.adjustChargesRateTypeID <= 0) {

      this.toastrService.error(GlobalConstants.ValidationError);
      return;
    }

    if (this.orderManagementAdjustCharges.editIndex == -1 && this.orderManagementAdjustCharges.allAdjustChargesData.length > 0) {
      var alreadyAvaiable = this.orderManagementAdjustCharges.allAdjustChargesData.find(x => x.materialID == this.orderManagement.adjustChargesSectionMaterialID && this.orderManagement.adjustChargesSectionMaterialID > 0 && x.chargeID == this.orderManagement.adjustChargesSectionChargeID);

      if (alreadyAvaiable != undefined) {

        var indexOfExisting = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(alreadyAvaiable);
        this.orderManagementAdjustCharges.editIndex = indexOfExisting;

        //this.toastrService.error(GlobalConstants.AlreadyaddedMaterial);
        //return;
      }
      else {

        var alreadyAvaiablecharge = this.orderManagementAdjustCharges.allAdjustChargesData.find(x => x.materialID <= 0 && x.chargeID == this.orderManagement.adjustChargesSectionChargeID && this.orderManagement.adjustChargesSectionMaterialID == 0);

        if (alreadyAvaiablecharge != undefined) {
          this.toastrService.error(GlobalConstants.AlreadyaddedCharge);
          return;
        }

      }
    }

    var isMaterial: boolean = false;
    var isOnlyCharge: boolean = false;
    if (this.orderManagement.adjustChargesSectionMaterialID > 0) {
      this.MaterialData.forEach((matData, matIndex) => {
        if (matData.id == this.orderManagement.adjustChargesSectionMaterialID) {
          isMaterial = true;
        }
      });
    }
    else {
      isOnlyCharge = true;
    }

    if (this.orderManagementAdjustCharges.editIndex > 0) {
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideCommodityID = Number(this.orderManagement.adjustChargesCommodityID);
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideCommodityName = this.orderManagement.adjustChargesCommodityName;


      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateTypeID = Number(this.orderManagement.adjustChargesRateTypeID);
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateTypeName = this.orderManagement.adjustChargesRateTypeName;


      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overridePriceMethodID = Number(this.orderManagement.adjustChargesPriceMethodID);
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overridePriceMethodName = this.orderManagement.adjustChargesPriceMethodName;
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateValue = Number(this.orderManagement.adjustChargesRateValue);
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideAmount = Number(this.orderManagement.adjustChargesAmount);
    }

    this.CommodityData.forEach((value, index) => {
      if (value.id == Number(this.orderManagement.adjustChargesCommodityID)) {
        this.orderManagement.adjustChargesCommodityName = value.name;
      }
    });


    this.orderManagementAdjustCharges.AddEditMaterialInAdjustCharges(
      this.orderManagement.adjustChargesSectionMaterialID, this.orderManagement.adjustChargesSectionMaterialName,
      this.orderManagement.adjustChargesQuantity, this.orderManagement.adjustChargesSectionChargeID,
      this.orderManagement.adjustChargesSectionChargeName, this.orderManagement.adjustChargesRateTypeID, this.orderManagement.adjustChargesRateTypeName,
      this.orderManagement.adjustChargesRateValue, this.orderManagement.adjustChargesPriceMethodID, this.orderManagement.adjustChargesPriceMethodName,
      this.orderManagement.adjustChargesCommodityID, this.orderManagement.adjustChargesCommodityName, this.orderManagement.adjustChargesShowOnBOL,
      this.orderManagement.adjustChargesAmount, isMaterial, isOnlyCharge, this.SelectEquipment, this.orderManagement.ChargeUnits
    );
    if (!this.isStockTransfer && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {
      var currentCredit = this.orderManagement.AvailableCredit.replace(/\,/g, '');
      var oldCredit = Number(currentCredit);
      this.orderManagement.AvailableCredit = (Number(currentCredit) - this.orderManagementAdjustCharges.TotalAmount).toString();
      var newCredit = Number(this.orderManagement.AvailableCredit.replace(/\,/g, ''));
      this.CheckAvailableCredit();

      if (oldCredit >= 0 && newCredit < 0) {
        if (this.orderManagement.OrderTypeCode != GlobalConstants.CustomerReturn)
          this.GetStatuswithcondition(this.orderManagement.ToLocationId, newCredit.toString());
      }
      //this.orderManagement.AvailableCredit = formatterDecimal.format(Number(this.orderManagement.AvailableCredit))
    }
    else {
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number("0"));
      this.CheckAvailableCredit();
    }
    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);

    if (!this.AdjustmentgridInEditMode) {
      this.resetAddAjustment();
    }

    //this.orderManagementAdjustCharges.addEditAdjustmentChargesFlag.subscribe(result => {

    //  if (result == true) {


    //    //this.orderManagementAdjustCharges.AddEditMaterialUnSubscribe();
    //  }
    //  else if (result == false) {
    //    //this.orderManagementAdjustCharges.AddEditMaterialUnSubscribe();
    //  }


    //});
    this.resetAddAjustment();


  }

  DeleteAdjustChargesItem(element: AdjustChargesModel) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    // var index = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(element);
    var items: AdjustChargesModel[] = [];
    items.push(element);
    this.orderManagementAdjustCharges.removeAdjustChargesValue(items);
    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);

  }


  selectToContract(event) {
    if (Number(event.target.value) == 0) return;

    //if (this.MaterialDetails != null && this.MaterialDetails.length > 0 && !this.IsCustomerReturn) {
    if (!this.IsCustomerReturn) {
      this.GetDefaultAdjustChargesData();
    }
  }

  selectFromContract(event) {
    if (Number(event.target.value) == 0) return;

    //if (this.MaterialDetails != null && this.MaterialDetails.length > 0 && this.IsCustomerReturn) {
    if (this.IsCustomerReturn) {
      this.GetDefaultAdjustChargesData();
    }
  }

  async LocationShippingMaterial(LocationID: number, ClientID: number) {



    var orderID: number = 0;
    var orderTypeID: number = 0;
    if (!this.isLocationChangeByUser) {
      orderID = Number(this.SelectedSalesOrdersforEdit.Id);
      orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    }

    //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    // if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
    //   return false;


    this.orderManagementService.LocationShippingMaterial(LocationID, ClientID, orderID, orderTypeID).pipe()
      .subscribe(
        data => {
          if (data.data != null) {
            // this.ShippingMaterialDetails = data.data;
            this.ShippingMaterialDetails = [];
            data.data.forEach((value, index) => {
              this.ShippingMaterialDetails.push({
                bagFlag: value.bagFlag,
                code: value.code,
                flag: value.flag,
                materialID: value.materialID,
                name: value.name,
                pallets: value.pallets,
                propertyValue: value.propertyValue,
                quantity: value.quantity,
                shippedQuantity: value.shippedQuantity,
                displayQuantity: formatter.format(value.quantity),
                displayShippedQuantity: formatter.format(value.shippedQuantity),
                uomcode: value.uomcode,
                uomid: value.uomid
              })
            })
            // this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.copyMaterialAndShippingMaterialForCharges();
            this.removeZeroValuePallet();
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
            //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            this.refershMaterial(this.ShippingMaterialDetails);
          }
        });

  }
  // changes
  AdjustShippingCalculate(flag: number) {
    if (flag == 0) {
      var sum = 0;

      for (var i = 0; i < this.MaterialDetails.length; i++) {
        if (this.MaterialDetails[i].code != "F23") {
          var cal = Math.ceil(this.MaterialDetails[i].quantity / this.MaterialDetails[i].propertyValue);
          sum = sum + Number(cal);
          this.TotalPalates = this.TotalPalates + Number(cal);
        }
        else {
          var cal1 = Math.ceil(this.MaterialDetails[i].quantity / this.MaterialDetails[i].propertyValue);
          //sum = sum + Number(cal1);
          //this.TotalPalates = this.TotalPalates + Number(cal1 * 2);
          this.NPMIPallet = this.NPMIPallet + Number(cal1 * 2);
          //this.NPMIPallet = this.getTotalNPMIPallet(Number(this.MaterialDetails[i].materialID)) + Number(cal1 * 2);
          this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();

        }

      }


      for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {

        if (this.ShippingMaterialDetails[i].flag == 0) {
          //Because We implement edit functionality for AdjustShippingMaterial Also
          //this.ShippingMaterialDetails[i].quantity = Number(sum);
          this.ShippingMaterialDetails[0].quantity = Number(sum) > 0 ? Number(sum) : 0;
          this.ShippingMaterialDetails[0].displayQuantity = Number(sum) > 0 ? Number(sum) : 0;

          this.removeZeroValuePallet();
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)

          //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
          this.copyMaterialAndShippingMaterialForCharges();
          // this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
          this.selection = new SelectionModel<PeriodicElement>(true, []);
        }
      }
      return true;

    }
    else {

      var cal3 = 0;
      var temCalc3 = 0;

      //if (this.SelectMaterialData.code == "F23") {
      //  // this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
      // // this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue)) * 2);
      //  this.NPMIPallet = this.getTotalNPMIPallet(Number(getmaterial.id)) + Number((Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue)) * 2);
      //  this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
      //}
      //else {
      //  cal3 = Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue);
      //  this.TotalPalates = this.TotalPalates + Number(cal3);
      //}


      if (this.SelectMaterialData.code == "F23") {
        // this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
        // this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue)) * 2);
        temCalc3 = Number((Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue)) * 2);
        this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
      }
      else {
        cal3 = Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue);
        temCalc3 = cal3;
        this.TotalPalates = this.TotalPalates + Number(cal3);
      }


      if ((this.getTotalPallet() + this.getTotalNPMIPallet() + temCalc3) <= this.EquivalentPallates) {
        var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
        this.MaterialDetails.push({
          name: getmaterial.name,
          quantity: this.IsShipment ? 0 : this.OQuantity,
          shippedQuantity: this.IsShipment ? this.OQuantity : 0,
          displayQuantity: this.IsShipment ? "0" : formatter.format(Number(this.OQuantity)),
          displayShippedQuantity: this.IsShipment ? formatter.format(Number(this.OQuantity)) : 0,
          materialID: getmaterial.id,
          propertyValue: this.SelectMaterialData.propertyValue,
          code: this.SelectMaterialData.code,
          Pallets: Number(temCalc3)
        });
        this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
        this.copyMaterialAndShippingMaterialForCharges();
        //this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        this.selection = new SelectionModel<PeriodicElement>(true, []);
        console.log("shipping material display after material add");
        console.log(this.ShippingMaterialDetails);

        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {


          if (this.ShippingMaterialDetails[i].flag == 0) {

            console.log("shpping material index : " + i);

            if (this.IsShipment) {
              this.ShippingMaterialDetails[i].shippedQuantity = this.ShippingMaterialDetails[i].shippedQuantity + cal3 > 0 ? this.ShippingMaterialDetails[i].shippedQuantity + cal3 : 0;
              this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));

              console.log("shipped Quantity : ");
              console.log(this.ShippingMaterialDetails[i].shippedQuantity);
            }
            else {

              this.ShippingMaterialDetails[i].quantity = this.ShippingMaterialDetails[i].quantity + cal3 > 0 ? this.ShippingMaterialDetails[i].quantity + cal3 : 0;

              this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));

              console.log("shipped Quantity : ");
              console.log(this.ShippingMaterialDetails[i].quantity);
            }



            this.removeZeroValuePallet();

            console.log("Shpping materila for UI ");
            console.log(this.ShippingMaterialDetailForUI);


            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
            //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            // this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.copyMaterialAndShippingMaterialForCharges();
            this.selection = new SelectionModel<PeriodicElement>(true, []);
          }
        }
      }
      else {

        var remainingPallets = Number(this.EquivalentPallates - (this.getTotalNPMIPallet() + this.getTotalPallet()));

        this.toastrService.error('Material quantity being added cannot exceed the equipment capacity.' + this.EquivalentPallates + ' for this equipment.');
        var cal3 = Math.ceil(Number(this.OQuantity) / Number(this.SelectMaterialData.propertyValue));

        if (this.SelectMaterialData.code == "F23") {
          // this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
          //this.SelectMaterialData.Pallets = Number(cal3 * 2);
          //this.NPMIPallet = this.NPMIPallet - Number(cal3 * 2);
          this.NPMIPallet = this.getTotalNPMIPallet() - Number(cal3 * 2);
          this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
        }
        else {
          this.TotalPalates = this.TotalPalates - Number(cal3);
          this.SelectMaterialData.Pallets = Number(cal3);
        }

        return false;
      }

      return true;
    }

  }




  AddAdjustMaterial() {
    this.AdjustShippingEditFlag = false;

    if (Number(this.AQuantity) <= 0 || (Number(this.AQuantity) % 1) != 0) {
      //this.toastrService.error('Please enter a valid quantity.');
      var messagesData = this.AllToasterMessage.find(x => x.code == 'InvalidQuantityFormat')?.message1;
      this.toastrService.error(messagesData);
      return false;
    }

    var PelletQty = 0;
    var k = 0;
    for (k; k < this.ShippingMaterialDetails.length; k++) {
      if (this.ShippingMaterialDetails[k].flag == 0) {
        //&& this.ShippingMaterialDetails[k].name == "WW-PALLET"
        PelletQty = (this.IsShipment ? Number(this.ShippingMaterialDetails[k].shippedQuantity) : Number(this.ShippingMaterialDetails[k].quantity));
      }
    }

    var getmaterial = this.MaterialDataForAdjustShipping.find(f => f.id == this.SelectAddjustMaterial);

    var Condition1 = this.ShippingMaterialDetails.find(temp => temp.materialID == getmaterial.id);
    //var Condition2 = this.ShippingMaterialDetails.find(temp => temp.materialID == getmaterial.id && temp.bagFlag != 0)

    if (!Condition1 && this.ShippingSelectUOM == GlobalConstants.PelletCode) {
      var Data = this.ShippingMaterialDetails.find(temp => temp.flag == 0);
      if (Number(this.AQuantity) <= (this.IsShipment ? Number(Data.shippedQuantity) : Number(Data.quantity)) || Number(this.AQuantity) == 0) {
        this.ShippingMaterialDetails.push({
          name: getmaterial.name,
          quantity: Number(this.IsShipment ? 0 : this.AQuantity),
          shippedQuantity: Number(this.IsShipment ? this.AQuantity : 0),
          displayQuantity: formatter.format(Number(this.IsShipment ? 0 : this.AQuantity)),
          displayShippedQuantity: formatter.format(Number(this.IsShipment ? this.AQuantity : 0)),
          materialID: getmaterial.id,
          flag: 1,
          uomcode: this.ShippingSelectUOM,
        });

        this.SelectAddjustMaterial = 0;

        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
          if (this.ShippingMaterialDetails[i].flag == 0) {
            if (this.IsShipment) {
              this.ShippingMaterialDetails[i].shippedQuantity = (this.ShippingMaterialDetails[i].shippedQuantity - Number(this.AQuantity)) > 0 ? (this.ShippingMaterialDetails[i].shippedQuantity - Number(this.AQuantity)) : 0;
              this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));
            }
            else {
              this.ShippingMaterialDetails[i].quantity = (this.ShippingMaterialDetails[i].quantity - Number(this.AQuantity)) > 0 ? (this.ShippingMaterialDetails[i].quantity - Number(this.AQuantity)) : 0;
              this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));
            }

          }
        }
      }
    }
    else if (!Condition1 && this.ShippingSelectUOM == GlobalConstants.BagCode) {
      if (Number(this.AQuantity) > PelletQty || Number(this.AQuantity) == 0) {
        var messagesData = this.AllToasterMessage.find(x => x.code == 'bagcantmorethanpallet')?.message1;
        this.toastrService.error(messagesData);
        return;
      }
      this.ShippingMaterialDetails.push({
        name: getmaterial.name,
        quantity: Number(this.IsShipment ? 0 : this.AQuantity),
        shippedQuantity: Number(this.IsShipment ? this.AQuantity : 0),
        displayQuantity: formatter.format(Number(this.IsShipment ? 0 : this.AQuantity)),
        displayShippedQuantity: this.IsShipment ? formatter.format(Number(this.AQuantity)) : 0,
        materialID: getmaterial.id,
        flag: 1,
        uomcode: this.ShippingSelectUOM,
      });

    }
    else {
      var messagedata = this.AllToasterMessage.find(x => x.code == 'materialalreadyintoist')?.message1;
      this.toastrService.error(messagedata);
    }


    this.copyMaterialAndShippingMaterialForCharges();

    //this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
    this.removeZeroValuePallet();
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
    //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    this.refershMaterial(this.ShippingMaterialDetails);
    this.BindAdjustmentChargesMaterialDropDownList();
    //this.UpdateAdjustmentChargesGrid();
  }


  removeZeroValuePallet() {
    if (this.ShippingMaterialDetails != undefined && this.ShippingMaterialDetails.length > 0) {
      this.ShippingMaterialDetailForUI.splice(0, this.ShippingMaterialDetailForUI.length);

      this.ShippingMaterialDetails.forEach(val => this.ShippingMaterialDetailForUI.push(Object.assign({}, val)));

      var zeroValuePallets = this.ShippingMaterialDetailForUI.filter(x => x.quantity == 0 && x.shippedQuantity == 0);
      if (zeroValuePallets != undefined && zeroValuePallets.length > 0) {
        zeroValuePallets.forEach((value, index) => {

          var index = this.ShippingMaterialDetailForUI.indexOf(value);

          this.ShippingMaterialDetailForUI.splice(index, 1);
        });
      }
    }
  }


  AdjustDeleteMaterial(id: number) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    if (this.IsShipment) {
      var DeletePallet = this.ShippingMaterialDetails.find(f => f.materialID == id)?.shippedQuantity;
      this.ShippingMaterialDetails.map((todo, i) => {
        if (todo.flag == 0 && todo.shippedQuantity > 0) {

          this.ShippingMaterialDetails[i].shippedQuantity = Number(this.ShippingMaterialDetails[i].shippedQuantity) + Number(DeletePallet);
          this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));
        }
      });
    }
    else {
      var DeletePallet = this.ShippingMaterialDetails.find(f => f.materialID == id)?.quantity;
      this.ShippingMaterialDetails.map((todo, i) => {
        if (todo.flag == 0 && todo.quantity > 0) {
          this.ShippingMaterialDetails[i].quantity = Number(this.ShippingMaterialDetails[i].quantity) + Number(DeletePallet);
          this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));
        }
      });
    }

    for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
      if (this.ShippingMaterialDetails[i].materialID == id && this.ShippingMaterialDetails[i].flag != 0) {

        this.ShippingMaterialDetails.splice(i, 1);

        //this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
        //this.selection = new SelectionModel<PeriodicElement>(true, []);
        //this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
        this.copyMaterialAndShippingMaterialForCharges();
        this.removeZeroValuePallet();
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
        //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
        this.selection = new SelectionModel<PeriodicElement>(true, []);
        this.BindAdjustmentChargesMaterialDropDownList();
        /// forciably remove pallet/bag from the Adjustment charges grid.

        this.removeAdjustChargesFromList(id);
        this.refershMaterial(this.ShippingMaterialDetails);
      }
    }


  }

  GetShippingUOM() {
    this.orderManagementService.GetShippingUOM()
      .subscribe(
        data => {
          this.ShippingUOMData = data.data;
        });
  }


  OnSelectedAdjustmaterial(item: any) {

    this.SelectAddjustMaterial = item.id;
    var id = this.MaterialDataForAdjustShipping.find(f => f.id == Number(this.SelectAddjustMaterial))?.defaultUOMID;
    this.ShippingSelectUOM = this.ShippingUOMData.find(f => f.id == Number(id))?.code;


  }

  OnItemAdjustmaterialSelect(item: any) {
    this.SelectAddjustMaterial = 0;
  }

  SaveOrder() {
    this.isLoading = true;
    this.LoadingMessage = "Your Order validating..";


    if (this.MaterialDetails.length == 0 && this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping && ((this.orderManagement.OrderTypeCode == "CPUOrder" || this.orderManagement.OrderTypeCode == "Customer"))) {
      //var otherMaterial = this.MaterialDetails.filter(x => x.code != 'F23');
      var otherShippingMaterial = this.ShippingMaterialDetails.filter(x => Number(x.quantity) > 0 || Number(x.shippedQuantity) > 0);

      //if ((otherMaterial == undefined || otherMaterial.length == 0) && (otherShippingMaterial == undefined || otherShippingMaterial.length == 0)) {




      this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });

      if (otherShippingMaterial != undefined && otherShippingMaterial.length > 0) {
        this.modalRef.componentInstance.msg = 'An order with pallet materials must contain an RPC material. Please add an RPC material to the order or delete the pallet materials.';
      }
      else {
        this.modalRef.componentInstance.msg = 'Please add at least one RPC material to the order.';
      }


      this.modalRef.componentInstance.isOK = true;
      this.modalRef.componentInstance.isYesNO = false;

      this.modalRef.result.then((result) => {
        return false;
        //this.saveAndVerifyOrder();
      }, (reason) => {
      });


      //  }
      //  else {
      //    this.saveAndVerifyOrder();
      //  }

    }
    else {

      if (this.orderManagement.OrderTypeCode == GlobalConstants.ChargeOrder && (this.orderManagement.Comments == undefined || this.orderManagement.Comments == null || this.orderManagement.Comments.length == 0 || this.orderManagement.Comments.trim().length == 0)) {
        this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });

        this.modalRef.componentInstance.msg = 'Please add order comment for charge order.';



        this.modalRef.componentInstance.isOK = true;
        this.modalRef.componentInstance.isYesNO = false;

        this.modalRef.result.then((result) => {
          return false;
          //this.saveAndVerifyOrder();
        }, (reason) => {
        });

      }
      else {
        this.saveAndVerifyOrder();
      }

    }




  }

  private saveAndVerifyOrder() {
    if (!this.IsStockTransfer && !this.IsCollections) {
      if (Number(this.orderManagement.ToContractId != undefined ? this.orderManagement.ToContractId : 0) == 0 && (this.orderManagement.OrderTypeCode == "CPUOrder" || this.orderManagement.OrderTypeCode == "Customer")) {

        var messagesData = this.AllToasterMessage.find(x => x.code == 'nocustomercontractapply')?.message1;
        this.toastrService.info(messagesData);
      }
    }

    var allMaterialList: any[] = [];

    this.MaterialDetails.forEach((value, index) => {
      allMaterialList.push({ MaterialID: Number(value.materialID), Quantity: Number(value.quantity), Pallets: Number(value.Pallets == undefined ? value.pallets : value.Pallets), IsPackage: false, ShippedQuantity: Number(value.shippedQuantity) });
    });

    this.ShippingMaterialDetails.forEach((value, index) => {
      allMaterialList.push({ MaterialID: Number(value.materialID), Quantity: Number(value.quantity), Pallets: Number(value.quantity), IsPackage: true, ShippedQuantity: Number(value.shippedQuantity) });
    });
    /***********************************************************************************/
    // this section Identifiy which section is autoadded and which is added by manual //
    this.orderManagementAdjustCharges.allAdjustChargesData.forEach((value, index) => {

      var selectedDefault = this.orderManagementAdjustCharges.defaultContractChargesData.find(x => ((x.materialID == value.materialID) || (x.materialID == null && value.materialID == -1)) && x.chargeID == value.chargeID);


      if (selectedDefault != undefined && value.rateTypeID == selectedDefault.rateTypeID && value.priceMethodID == selectedDefault.priceMethodID && value.rateValue == selectedDefault.rateValue && value.commodityID == selectedDefault.commodityID && value.overrideRateTypeID == 0 && value.overrideRateValue == 0 && value.chargeUnit == selectedDefault.chargeUnit) {
        value.IsAutoAdded = true;
        value.IsModified = false;
      }
      else {
        value.IsModified = true;
        value.IsAutoAdded = false;
      }


    });

    /************************************************************************** */

    var code = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;
    this.orderManagement.EquipmentTypeId = Number(this.SelectEquipment);
    this.orderManagement.OrderTypeId = Number(this.OrderTypeId);
    this.orderManagement.OrderStatusId = Number(this.orderManagement.OrderStatusId);
    this.orderManagement.CarrierId = Number(this.SCarrierId);
    this.orderManagement.FromLocationId = Number(this.orderManagement.FromLocationId);
    this.orderManagement.AllocatedFreightCharge = Number(this.orderManagement.AllocatedFreightCharge);
    this.orderManagement.CreatedBy = this.authenticationService.currentUserValue.LoginId;

    if (this.SelectedSalesOrdersforEdit != undefined && this.SelectedSalesOrdersforEdit.Id > 0) {
      this.orderManagement.OldToLocationID = this.SelectedSalesOrdersforEdit.ToLocationId;
    }

    if (this.isChecked == true) {
      this.orderManagement.SupressEmailConfirmation = "1";
    }
    else {
      this.orderManagement.SupressEmailConfirmation = "0";
    }

    if (this.orderManagement.ToLocationId != undefined && this.orderManagement.ToLocationId > 0) {
      var shiptolocationtype = this.shiptolist.find(x => x.id == Number(this.orderManagement.ToLocationId))?.locationTypeCode;

      if (this.orderManagement.ToContractId != undefined && Number(this.orderManagement.ToContractId) > 0) {
        if (shiptolocationtype == "Customer") {
          this.orderManagement.ToCustomerContractId = Number(this.orderManagement.ToContractId);
          this.orderManagement.ToBusinessPartnerContractId = null;
        }
        else {
          this.orderManagement.ToCustomerContractId = null;
          this.orderManagement.ToBusinessPartnerContractId = Number(this.orderManagement.ToContractId);
        }
      }
      else {
        this.orderManagement.ToCustomerContractId = null;
        this.orderManagement.ToBusinessPartnerContractId = null;
      }
    }
    else {
      this.orderManagement.ToCustomerContractId = null;
      this.orderManagement.ToBusinessPartnerContractId = null;
    }
    if (this.orderManagement.FromLocationId != undefined && this.orderManagement.FromLocationId > 0) {
      var shipfromlocationtype = this.shipfromlist.find(x => x.id == Number(this.orderManagement.FromLocationId))?.locationTypeCode;

      if (this.orderManagement.FromContractId != undefined && Number(this.orderManagement.FromContractId) > 0) {
        if (shipfromlocationtype == "Customer") {
          this.orderManagement.FromCustomerContractId = Number(this.orderManagement.FromContractId);
          this.orderManagement.FromBusinessPartnerContractId = null;
        }
        else {
          this.orderManagement.FromCustomerContractId = null;
          this.orderManagement.FromBusinessPartnerContractId = Number(this.orderManagement.FromContractId);
        }
      }
    }
    else {
      this.orderManagement.FromCustomerContractId = null;
      this.orderManagement.FromBusinessPartnerContractId = null;
    }
    //if (this.NewOrder == 0) {
    this.orderManagement.FreightModeID = Number(this.orderManagement.FreightModeID);

    if (this.orderManagement.DeliveryAppointment != undefined && this.orderManagement.DeliveryAppointment != null) { this.orderManagement.DeliveryAppointmentString = this.orderCommonService.convertDatetoStringDate(this.orderManagement.DeliveryAppointment); }
    if (this.orderManagement.PickupApplointment != undefined && this.orderManagement.PickupApplointment != null) { this.orderManagement.PickupApplointmentString = this.orderCommonService.convertDatetoStringDate(this.orderManagement.PickupApplointment); }
    this.modalRef = null;

    this.orderManagement.RequestedDeliveryDateStr = ((this.orderManagement.RequestedDeliveryDate != undefined && this.orderManagement.RequestedDeliveryDate != null) ? this.orderCommonService.convertDatetoStringDate(this.orderManagement.RequestedDeliveryDate) : '');
    this.orderManagement.ScheduledShipDateStr = ((this.orderManagement.ScheduledShipDate != undefined && this.orderManagement.ScheduledShipDate != null) ? this.orderCommonService.convertDatetoStringDate(this.orderManagement.ScheduledShipDate) : '');
    this.orderManagement.MustArriveByDateStr = ((this.orderManagement.MustArriveByDate != undefined && this.orderManagement.MustArriveByDate != null) ? this.orderCommonService.convertDatetoStringDate(this.orderManagement.MustArriveByDate) : '');

    this.orderManagement.CreateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());
    this.orderManagement.UpdateDateTimeBrowserStr = this.orderCommonService.convertDatetoStringDate(new Date());

    this.orderManagementService.ValidateOrderCore(this.orderManagementAdjustCharges.allAdjustChargesData, this.orderManagement, allMaterialList).subscribe(result => {
      if (result.data != null) {
        if (result.data.validationResponse.isValid == true) {
          this.LoadingMessage = "Saving your order..";

          if (result.data.validationResponse.isConfirmation == true) {

            this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });

            this.modalRef.componentInstance.msg = result.data.validationResponse.message;
            this.modalRef.componentInstance.isOK = false;
            this.modalRef.componentInstance.isYesNO = true;

            this.modalRef.result.then((result) => {
              this.savefinalorder(allMaterialList);
            }, (reason) => {
            });
          }
          else {
            this.savefinalorder(allMaterialList);
          }

        }
        else {
          this.isLoading = false;
          if (result.data.validationResponse.message == "materialpropertymissing") {
            // open material property popup to display missing material property grid.
            //this.materialPropertyPopupShow = true;
            $("#compilePopup").modal('show');
            this.MissingMaterialPropertyData = <MaterialPropertyGrid[]>result.data.editVerifyEquipmentMaterialProperties;
            this.MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>(result.data.editVerifyEquipmentMaterialProperties);
          }
          else {
            this.toastrService.error(result.data.validationResponse.message);
          }
        }


      }
      else {
        this.isLoading = false;
        this.toastrService.error("");
      }
    });

    //}


  }

  private savefinalorder(allMaterialList: any[]) {

    var OldVersionID = (this.orderManagement.Id == undefined ? 0 : this.orderManagement.Id);


    this.orderManagement.InboundOutbound = localStorage.SelectedTab;
    this.orderManagement.SaveAndNotifyHit = this.SaveAndNotifyHit;

    this.orderManagementService.SaveOrder(this.orderManagementAdjustCharges.allAdjustChargesData, this.orderManagement, allMaterialList)
      .subscribe(
        data => {
          this.isLoading = false;
          if (data.data != null) {
            this.Ordervalidate = false;
            if (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping) {
              this.OrderStatusDisableProp = false;
              this.OrderStatusEnableDisable(false);
            }
            else {
              this.OrderStatusDisableProp = true;
              this.OrderStatusEnableDisable(true);
            }



            this.OrderNumber = data.data.orderNumber;
            this.orderManagement.Id = data.data.id;
            this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
            this.NewOrder = 0;
            /// need to open only for new record
            var isOrderInEditList: boolean = false;
            if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
              var itemsAvaialble = this.SalesOrderforEdit.find(x => Number(x.OrderId) == Number(this.orderManagement.Id));
              if (itemsAvaialble != undefined) {
                isOrderInEditList = true;
              }

            }

            if (this.isSaveEditAndNextOrder == "") {
              this.orderTypevalidate = true;
              this.OrderTypeEnableDisable(true);
              this.isFromContact = true;
            }


            if (data.data.status != undefined && (data.data.status == "NewVersion" || data.data.status == "NewDiversion")) {
              // remove old version
              var existingEdit = this.orderManagementService.SalesOrderforEdit.find(x => Number(x.OrderId) == Number(OldVersionID));

              if (existingEdit != undefined) {
                var oldIndex = this.orderManagementService.SalesOrderforEdit.indexOf(existingEdit);

                this.orderManagementService.SalesOrderforEdit.splice(oldIndex, 1);
                isOrderInEditList = true;

                this.orderManagementService.SalesOrderforEdit.push({ OrderId: this.orderManagement.Id, OrderNumber: this.orderManagement.orderNumber + '.' + data.data.orderVersionNumber, Status: this.orderManagement.OrderStatusCode, OrderType: this.orderManagement.OrderTypeCode, OrderID: this.orderManagement.Id });

              }
            }

            if (this.SaveAndNotifyHit)
              this.toastrService.success(GlobalConstants.OrderSuccessAndNotify);
            else
              this.toastrService.success(GlobalConstants.OrderSuccess);




            if (this.isSaveEditAndNextOrder == "SaveAndNextOrder") {
              if (!isOrderInEditList) {
                this.orderManagementService.SalesOrderforEdit.push({ OrderId: this.orderManagement.Id, OrderNumber: data.data.orderNumber + '.' + data.data.orderVersionNumber, Status: this.orderManagement.OrderStatusCode, OrderType: this.orderManagement.OrderTypeCode, OrderID: this.orderManagement.Id });
                this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
              }

              this.orderTypevalidate = false;
              this.OrderTypeEnableDisable(false);
              this.isFromContact = false;
              this.OrderNumber = 'New Order';
              this.OrderTypeCode = 'Customer';


              this.orderManagement = new OrderManagement();
              this.ResetAdjustmentChargesService();
              this.ClearSelectedFields();
            }
            if (this.isSaveEditAndNextOrder == "EditAndNextOrder") {
              this.ResetAdjustmentChargesService();
              this.SelectNextOrderForEdit();
            }

            if ((this.isSaveEditAndNextOrder != "SaveAndNextOrder" && this.isSaveEditAndNextOrder != "EditAndNextOrder") || (data.data.status != undefined && (data.data.status == "NewVersion" || data.data.status == "NewDiversion"))) {

              if (!isOrderInEditList) {
                this.orderManagementService.SalesOrderforEdit.push({ OrderId: this.orderManagement.Id, OrderNumber: data.data.orderNumber + '.' + data.data.orderVersionNumber, Status: this.orderManagement.OrderStatusCode, OrderType: this.orderManagement.OrderTypeCode, OrderID: this.orderManagement.Id, OrderStatus: this.orderManagement.OrderStatusName, OrderCondition: this.orderManagement.OrderCondition });
                this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;

                this.CurrentEditListItemIndex = 0;

              }

              //this.CurrentEditListItemIndex = this.SalesOrderforEdit.findIndex(x => x.OrderId === this.orderManagement.Id && x.OrderType === this.orderManagement.OrderTypeCode);
              //this.CurrentEditListItemIndex = 0;
              this.CurrentEditListItemIndex = this.SalesOrderforEdit.findIndex(x => x.OrderId === this.orderManagement.Id && x.OrderType === this.orderManagement.OrderTypeCode);


              if (this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping && ((this.CreditCalculateLimit() > this.orderManagement.RequestedDeliveryDate && !this.IsStockTransfer && !this.IsCollections) || (this.CreditCalculateLimit() > this.orderManagement.ScheduledShipDate && this.IsStockTransfer && this.IsCollections))) {

                this.handleSendForShippingOrderCondition(this.orderManagement.Id, this.orderManagement.OrderTypeCode);
              }
              else if (this.CurrentEditListItemIndex >= 0) {
                this.BindOrderDetails(Number(this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderId), this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderType, this.SalesOrderforEdit[this.CurrentEditListItemIndex]);
                this.CurrentOrderId = this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderId;
                this.CurrentOrderType = this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderType;
                this.EnableDisableEditNextOrderBtn(this.CurrentEditListItemIndex);
              }


            }



            this.isSaveEditAndNextOrder = '';



          }


        });

  }

  removeAdjustChargesFromList(materialID: number) {

    if (materialID <= 0 || this.orderManagementAdjustCharges.allAdjustChargesData == undefined || this.orderManagementAdjustCharges.allAdjustChargesData.length == 0) return;

    var items: AdjustChargesModel[] = [];


    this.orderManagementAdjustCharges.allAdjustChargesData.forEach((values, index) => {
      if (values.materialID == materialID) {
        items.push(values);
      }

    });

    // forcibly remove the element from the list
    //var elementData = this.orderManagementAdjustCharges.allAdjustChargesData.find(x => x.materialID == materialID);
    // var selectedData = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(elementData); 
    this.orderManagementAdjustCharges.removeAdjustChargesValue(items, true);
    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
  }

  ///////////////////////////////////////////////
  /// This method use to get the salesmanager detail
  /// Developed By Kapil Pandey
  /// On : 17-Sep-2020
  //////////////////////////////////////////////////
  BindAvailableCredit(locationID: number) {
    let lo = !!!locationID ? this.orderManagement.ToLocationId : locationID;
    var orderDate = this.orderManagement.RequestedDeliveryDate;
    if (this.orderManagement.RequestedDeliveryDate == null || this.orderManagement.RequestedDeliveryDate == undefined || this.orderManagement.ToLocationId == undefined || this.orderManagement.ToLocationId == 0)
      return;

    if (!(this.orderManagement.OrderStatusCode == GlobalConstants.StockTransfer || this.orderManagement.OrderStatusCode == GlobalConstants.Collections)) {
      this.orderManagementService.GetAvailableCreditOfLocation(lo, orderDate)
        .subscribe(
          result => {

            if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              var data = result.data == undefined ? result.Data : result.data;
              this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number(data));

              if (Number(this.orderManagementAdjustCharges.TotalAmount) != 0 && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {
                this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(data) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString()));
              }
              //this.orderManagement.AvailableCredit = formatterDecimal.format(Number(this.orderManagement.AvailableCredit));


              this.CheckAvailableCredit();
              this.GetStatuswithcondition(lo, String(this.orderManagement.AvailableCredit));
            }

          }
        );
    }
    else {
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number("0"));
      this.CheckAvailableCredit();
    }


  }

  ///////////////////////////////////////////////
  /// This method use to get the salesmanager detail
  /// Developed By Kapil Pandey
  /// On : 28-Sep-2020
  //////////////////////////////////////////////////
  async BindFuelCharges(locationID: number) {

    if (locationID == undefined || locationID == 0 || this.orderManagement.RequestedDeliveryDate == null || this.orderManagement.RequestedDeliveryDate == undefined)
      return;

    if (this.orderManagement.OrderTypeCode == GlobalConstants.StockTransfer || this.orderManagement.OrderTypeCode == GlobalConstants.Collections) {
      this.orderManagement.fuelChargesMiles = null;// 0;
      this.orderManagement.fuelChargesRatePerMile = null;// 0;
      this.orderManagement.fuelChargesPercentage = 0;
      this.orderManagementAdjustCharges.ChargeRatePerMile = 0;
      this.orderManagementAdjustCharges.PerMileCharge = 0;
      this.orderManagementAdjustCharges.PassthrowPercentage = 0;
      return false;
    }

    var orderDate = (this.orderManagement.ScheduledShipDate != null && this.orderManagement.ScheduledShipDate != undefined) ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

    this.orderManagementService.GetFuleCharges(locationID, orderDate)
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var data = result.data == undefined ? result.Data : result.data;
            this.orderManagement.fuelChargesMiles = this.ConvertMoneyToDecimalPreferences(Number(data.customerMiles)).toString();
            this.orderManagement.fuelChargesRatePerMile = this.ConvertMoneyToDecimalPreferences(Number(data.chargeRatePerMile)).toString();
            this.orderManagement.fuelChargesPercentage = Number(data.customerPercent);

            this.orderManagementAdjustCharges.ChargeRatePerMile = Number(data.customerMiles);
            this.orderManagementAdjustCharges.PerMileCharge = Number(data.chargeRatePerMile);
            this.orderManagementAdjustCharges.PassthrowPercentage = Number(data.customerPercent);

          }
        }
      );


  }

  async LocationMaterial(LocationID: number, ClientID: number) {

    var orderID: number = 0;
    var orderTypeID: number = 0;
    if (!this.isLocationChangeByUser) {
      orderID = Number(this.SelectedSalesOrdersforEdit.Id);
      orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    }

    //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
      return false;

    this.orderManagementService.LocationMaterial(LocationID, ClientID, GlobalConstants.EA, this.SelectEquipment, orderID, orderTypeID).pipe().
      subscribe(
        data => {
          if (data.data != null) {
            // this.MaterialDetails = data.data;
            this.MaterialDetails = [];
            data.data.forEach((value, index) => {
              this.MaterialDetails.push({
                bagFlag: value.bagFlag,
                code: value.code,
                flag: value.flag,
                materialID: value.materialID,
                name: value.name,
                pallets: value.pallets,
                propertyValue: value.propertyValue,
                quantity: value.quantity,
                displayQuantity: formatter.format(value.quantity),
                shippedQuantity: value.shippedQuantity,
                displayShippedQuantity: formatter.format(value.shippedQuantity),
                uomcode: value.uomcode,
                uomid: value.uomid
              })
            })

            this.MaterialDetails.forEach((value, index) => {

              if (value.code == "F23") {
                if (!this.IsShipment)
                  this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))) * 2);
                else
                  this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))) * 2);
              }
            });

            this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
            this.copyMaterialAndShippingMaterialForCharges();
            // this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            if (this.isOrderEditbindlocation) {
              this.isOrderEditbindlocation = true;
              //var shippingCaculateMat = setTimeout(() => {
              this.AdjustShippingCalculate(0);
              // }, 50);
            }

          }
        });
  }

  async LocationAllMaterial(LocationID: number, ClientID: number) {
    console.log("location all material data");

    var orderID: number = 0;
    var orderTypeID: number = 0;
    if (!this.isLocationChangeByUser) {
      orderID = Number(this.SelectedSalesOrdersforEdit.Id);
      orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    }

    //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
      return false;

    console.log("calling location all material api..");
    this.orderManagementService.LocationAllMaterial(LocationID, ClientID, GlobalConstants.EA, this.SelectEquipment, orderID, orderTypeID).pipe().
      subscribe(
        data => {
          if (data.data != null) {
            // this.MaterialDetails = data.data;
            this.MaterialDetails = [];
            this.ShippingMaterialDetails = [];
            this.ShippingMaterialDetailForUI = [];
            console.log("all material location");
            console.log(data.data);

            data.data.shippingMaterialData.forEach((value, index) => {
              this.ShippingMaterialDetails.push({
                bagFlag: value.bagFlag,
                code: value.code,
                flag: value.flag,
                materialID: value.materialID,
                name: value.name,
                pallets: value.pallets,
                propertyValue: value.propertyValue,
                quantity: value.quantity,
                shippedQuantity: value.shippedQuantity,
                displayQuantity: formatter.format(value.quantity),
                displayShippedQuantity: formatter.format(value.shippedQuantity),
                uomcode: value.uomcode,
                uomid: value.uomid
              })
            })


            data.data.materialData.forEach((value, index) => {
              this.MaterialDetails.push({
                bagFlag: value.bagFlag,
                code: value.code,
                flag: value.flag,
                materialID: value.materialID,
                name: value.name,
                pallets: value.pallets,
                propertyValue: value.propertyValue,
                quantity: value.quantity,
                displayQuantity: formatter.format(value.quantity),
                shippedQuantity: value.shippedQuantity,
                displayShippedQuantity: formatter.format(value.shippedQuantity),
                uomcode: value.uomcode,
                uomid: value.uomid
              })
            })

            this.MaterialDetails.forEach((value, index) => {

              if (value.code == "F23") {
                if (!this.IsShipment)
                  this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))) * 2);
                else
                  this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))) * 2);
              }
            });

            this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)




            // this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            if (this.isOrderEditbindlocation) {
              this.isOrderEditbindlocation = true;
              //var shippingCaculateMat = setTimeout(() => {

              console.log("all material location adjustshipping calculate")
              this.AdjustShippingCalculate(0);
              // }, 50);
            }

            this.removeZeroValuePallet();
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
            //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            this.copyMaterialAndShippingMaterialForCharges();
            this.refershMaterial(this.ShippingMaterialDetails);


          }
        });
  }

  getTotalPallet(materialID: number = 0) {
    var totalPallets: number = 0;

    if (this.ShippingMaterialDetails == undefined || this.ShippingMaterialDetails.length == 0)
      return totalPallets;

    if (materialID == 0) {
      if (this.MaterialDetails.length > 0) {
        this.MaterialDetails.forEach((value, index) => {

          if (value.code != 'F23') {
            if (!this.IsShipment)
              totalPallets = totalPallets + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))));
            else
              totalPallets = totalPallets + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))));
          }
        });


      }
    }
    else {
      var otherMaterials = this.MaterialDetails.filter(x => x.materialID != materialID && x.code != "F23");
      if (otherMaterials.length > 0) {
        otherMaterials.forEach((value, index) => {
          if (!this.IsShipment)
            totalPallets = totalPallets + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))));
          else
            totalPallets = totalPallets + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))));
        });
      }
    }

    return totalPallets;
  }


  getTotalNPMIPallet(materialID: number = 0) {
    var totalNPMIMaterial: number = 0;

    if (this.MaterialDetails.length == 0)
      return totalNPMIMaterial;

    if (materialID > 0) {
      var otherMaterial = this.MaterialDetails.filter(x => x.materialID != materialID && x.code == "F23");

      if (otherMaterial == undefined || otherMaterial.length == 0)
        return totalNPMIMaterial;

      if (otherMaterial.length > 0) {
        otherMaterial.forEach((value, index) => {
          if (!this.IsShipment)
            totalNPMIMaterial = totalNPMIMaterial + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))) * 2);
          else
            totalNPMIMaterial = totalNPMIMaterial + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))) * 2);
        });
      }

    }
    else {
      var allNPMIPalletMaterial = this.MaterialDetails.filter(x => x.code == "F23");

      if (allNPMIPalletMaterial == undefined || allNPMIPalletMaterial.length == 0)
        return totalNPMIMaterial;

      if (allNPMIPalletMaterial.length > 0) {
        allNPMIPalletMaterial.forEach((value, index) => {
          if (!this.IsShipment)
            totalNPMIMaterial = totalNPMIMaterial + Number((Math.ceil(Number(value.quantity) / Number(value.propertyValue))) * 2);
          else
            totalNPMIMaterial = totalNPMIMaterial + Number((Math.ceil(Number(value.shippedQuantity) / Number(value.propertyValue))) * 2);
        });
      }
    }

    return totalNPMIMaterial;
  }

  ////////////////////////////////////////////////////
  /// This method refersh the Adjustment Charges Grid
  ////////////////////////////////////////////////////


  UpdateAdjustmentChargesGrid() {

    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
    this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();

    // if (this.isLocationChangeByUser || this.isToContractChangeByUser) {
    this.orderManagementAdjustCharges.reCalculateAllOrder();
    if (!this.IsStockTransfer && !this.IsCustomerReturn && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {
      var currentCredit = this.orderManagement.AvailableCredit.replace(/\,/g, '');
      var oldCredit = Number(currentCredit);
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(currentCredit) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString()));
      var newCredit = Number(this.orderManagement.AvailableCredit.replace(/\,/g, ''));
      this.CheckAvailableCredit();

      if (oldCredit >= 0 && newCredit < 0) {
        if (this.orderManagement.OrderTypeCode != GlobalConstants.CustomerReturn)
          this.GetStatuswithcondition(this.orderManagement.ToLocationId, newCredit.toString());
      }


    }
    //}


    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
  }

  UpdateAdjustmentExistingChargesGrid() {

    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

    //this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
    //this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;

    this.copyMaterialAndShippingMaterialForCharges();
    this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();

    // if (this.isLocationChangeByUser || this.isToContractChangeByUser) {
    this.orderManagementAdjustCharges.reModifyExistingCharges();

    if (!this.IsStockTransfer && !this.IsCustomerReturn && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {

      var currentCredit = this.orderManagement.AvailableCredit.replace(/\,/g, '');
      var oldCredit = Number(currentCredit);
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(currentCredit) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString()));
      var newCredit = Number(this.orderManagement.AvailableCredit.replace(/\,/g, ''));
      this.CheckAvailableCredit();

      if (oldCredit >= 0 && newCredit < 0) {
        if (this.orderManagement.OrderTypeCode != GlobalConstants.CustomerReturn)
          this.GetStatuswithcondition(this.orderManagement.ToLocationId, newCredit.toString());
      }


      //this.orderManagement.AvailableCredit = formatterDecimal.format(Number(this.orderManagement.AvailableCredit));   
    }
    //}


    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
  }


  selectCommodity(event: any) {

    this.orderManagement.adjustChargesCommodityName = event.target['options'][event.target['options'].selectedIndex].text;

    if (this.orderManagementAdjustCharges.editIndex > -1) {
      //  this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideCommodityID = Number(this.orderManagement.adjustChargesCommodityID);
      //  this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideCommodityName = this.orderManagement.adjustChargesCommodityName;
    }
  }

  selectRateType(event: any) {
    this.orderManagement.adjustChargesRateTypeName = event.target['options'][event.target['options'].selectedIndex].text;

    if (this.orderManagementAdjustCharges.editIndex > -1) {
      // this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateTypeID = Number(this.orderManagement.adjustChargesRateTypeID);
      // this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateTypeName = this.orderManagement.adjustChargesRateTypeName;
    }

  }

  selectPriceMethod(event: any) {
    this.orderManagement.adjustChargesPriceMethodName = event.target['options'][event.target['options'].selectedIndex].text;

    if (this.orderManagementAdjustCharges.editIndex > -1) {
      //  this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overridePriceMethodID = Number(this.orderManagement.adjustChargesPriceMethodID);
      //  this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overridePriceMethodName = this.orderManagement.adjustChargesPriceMethodName;
    }
  }

  editAdjustmentChargesData(element: AdjustChargesModel) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    this.selectadjustChargesSectionChargeID = [];
    this.selectedAdjustItems = [];
    this.orderManagement.adjustChargesCommodityID = element.overrideCommodityID > 0 ? element.overrideCommodityID : element.commodityID;
    this.orderManagement.adjustChargesCommodityName = element.overrideCommodityID > 0 ? element.commodityName : element.commodityName;
    this.orderManagement.adjustChargesPriceMethodID = element.overridePriceMethodID > 0 ? element.overridePriceMethodID : element.priceMethodID;
    this.orderManagement.adjustChargesPriceMethodName = element.overridePriceMethodID > 0 ? element.overridePriceMethodName : element.priceMethod;
    this.orderManagement.adjustChargesQuantity = element.orderQuantity;
    this.RateTypeData = [];
    this.RateTypeData = JSON.parse(JSON.stringify(this.AllRateTypeData));
    this.orderManagement.adjustChargesRateTypeID = element.overrideRateTypeID > 0 ? element.rateTypeID : element.rateTypeID;
    this.orderManagement.adjustChargesRateTypeName = element.overrideRateTypeID > 0 ? element.overrideRateTypeName : element.rateTypeName;
    this.orderManagement.adjustChargesSectionChargeID = element.chargeID;
    this.orderManagement.adjustChargesSectionChargeName = element.chargeName;
    this.orderManagement.adjustChargesShowOnBOL = element.overrideShowOnBOL;  //we always try to set overrideshowonbol
    this.orderManagement.adjustChargesRateValue = element.overrideRateValue ? element.overrideRateValue : element.rateValue;
    this.selectadjustChargesSectionChargeID.push({ "id": element.chargeID, "name": element.chargeName });
    if (element.materialID > 0) {
      this.orderManagement.adjustChargesSectionMaterialID = element.materialID;
      this.orderManagement.adjustChargesSectionMaterialName = element.materialName;
      //this.selectedAdjustShippingItems.push({ "id": element.materialID, "name": element.materialName });
      this.selectedAdjustItems.push({ "id": element.materialID, "name": element.materialName });
    }
    else {
      this.orderManagement.adjustChargesSectionMaterialID = -1;
      this.orderManagement.adjustChargesSectionMaterialName = '';
      this.selectedAdjustShippingItems = [];
    }
    this.orderManagement.adjustChargesAmount = element.overrideAmount;
    this.orderManagement.ChargeUnits = element.chargeUnit;
    this.orderManagementAdjustCharges.editIndex = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(element);

  }

  resetAddAjustment() {
    this.orderManagement.adjustChargesCommodityID = -1;
    this.orderManagement.adjustChargesPriceMethodID = -1;
    this.orderManagement.adjustChargesQuantity = 0;
    this.orderManagement.adjustChargesRateTypeID = -1;
    this.orderManagement.adjustChargesSectionChargeID = -1;
    this.orderManagement.adjustChargesShowOnBOL = false;
    this.orderManagement.adjustChargesRateValue = 0;
    this.orderManagement.adjustChargesSectionMaterialID = -1;
    this.orderManagement.adjustChargesAmount = 0;
    this.orderManagement.ChargeUnits = 1;

    this.orderManagementAdjustCharges.editIndex = -1;
    this.selectadjustChargesSectionChargeID = [];
    this.selectedAdjustItems = [];
  }

  clearAdjustmentChargesPanel() {
    this.orderManagementAdjustCharges.clearPreviousValues();
    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
  }

  setAdjustOverrideAmount(event) {

    if (this.orderManagementAdjustCharges.editIndex > -1) {
      // this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideAmount = Number(event.target.value);

    }
  }
  setAdjustOverrideRateValue(event) {
    if (this.orderManagementAdjustCharges.editIndex > -1) {
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].isEdited = true;
      // this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideRateValue = Number(event.target.value);
    }
  }

  EditMaterial() {
    if (Number(this.OQuantity) <= 0 || (Number(this.OQuantity) % 1) != 0) {

      //this.toastrService.error('Please enter a valid quantity');
      var messagesData = this.AllToasterMessage.find(x => x.code == 'InvalidQuantityFormat')?.message1;
      this.toastrService.error(messagesData);
      return false;
    }

    //changes
    this.TotalPalates = this.TotalPalates - Number(this.TempPalates);
    var cal3 = 0;

    var cal = 0;

    //var cal = Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
    //if (this.TempData.code == "F23") {
    //  //this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
    //  this.NPMIPallet = this.NPMIPallet + Number((Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue)) * 2);
    //  this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
    //}
    //else {
    //  cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
    //  cal = Math.ceil((this.IsShipment ? Number(this.TempData.shippedQuantity) : Number(this.TempData.quantity)) / this.TempData.propertyValue);
    //  this.TotalPalates = this.TotalPalates + Number(cal3);
    //}

    if (this.TempData.code == "F23") {
      //this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
      cal3 = Number((Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue)) * 2);
      cal = Number(Math.ceil((this.IsShipment ? Number(this.TempData.shippedQuantity) : Number(this.TempData.quantity)) / Number(this.TempData.propertyValue)) * 2);
      this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
    }
    else {
      cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
      cal = Number(Math.ceil((this.IsShipment ? Number(this.TempData.shippedQuantity) : Number(this.TempData.quantity)) / Number(this.TempData.propertyValue)));
      this.TotalPalates = this.TotalPalates + Number(cal3);
    }


    if ((this.getTotalPallet(this.SelectMaterial) + this.getTotalNPMIPallet(this.SelectMaterial) + cal3) <= this.EquivalentPallates) {


      for (var i = 0; i < this.MaterialDetails.length; i++) {

        if (this.MaterialDetails[i].materialID == this.SelectMaterial) {
          // this.MaterialDetails[i].quantity = this.OQuantity;
          if (this.IsShipment) {
            this.MaterialDetails[i].shippedQuantity = this.OQuantity;
            this.MaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.OQuantity));
            this.MaterialDetails[i].Pallets = cal3;
          }
          else {
            this.MaterialDetails[i].quantity = this.OQuantity;
            this.MaterialDetails[i].displayQuantity = formatter.format(Number(this.OQuantity));
            this.MaterialDetails[i].Pallets = cal3;
          }
        }
      }

      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
      //this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
      this.copyMaterialAndShippingMaterialForCharges();
      this.selection = new SelectionModel<PeriodicElement>(true, []);

      for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {

        if (this.ShippingMaterialDetails[i].flag == 0) {
          if (this.IsShipment) {
            //this.ShippingMaterialDetails[i].shippedQuantity = ((this.ShippingMaterialDetails[i].shippedQuantity - cal) + cal3) > 0 ? ((this.ShippingMaterialDetails[i].shippedQuantity - cal) + cal3) : 0;
            var totalremainingpallet = this.getTotalPallet() - this.shippigMaterialQuanity();
            this.ShippingMaterialDetails[i].shippedQuantity = (totalremainingpallet <= 0 ? 0 : totalremainingpallet);//((this.ShippingMaterialDetails[i].shippedQuantity - cal) + cal3) > 0 ? ((this.ShippingMaterialDetails[i].shippedQuantity - cal) + cal3) : 0;
            this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));
          }
          else {
            //this.ShippingMaterialDetails[i].quantity = ((this.ShippingMaterialDetails[i].quantity - cal) + cal3) > 0 ? ((this.ShippingMaterialDetails[i].quantity - cal) + cal3) : 0;

            var totalremainingpalletOther = this.getTotalPallet() - this.shippigMaterialQuanity();
            this.ShippingMaterialDetails[i].quantity = (totalremainingpalletOther <= 0 ? 0 : totalremainingpalletOther);//((this.ShippingMaterialDetails[i].quantity - cal) + cal3) > 0 ? ((this.ShippingMaterialDetails[i].quantity - cal) + cal3) : 0;
            this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));
          }


          this.removeZeroValuePallet();
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
          //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
          //this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
          this.copyMaterialAndShippingMaterialForCharges();

          this.selection = new SelectionModel<PeriodicElement>(true, []);
          var messagesData = this.AllToasterMessage.find(x => x.code == 'materialUpdatedsuccfully')?.message1;
          this.toastrService.info(messagesData);
        }
      }
    }
    else {




      var remainingQuantity = Number(this.EquivalentPallates - (this.getTotalNPMIPallet() + this.getTotalPallet()));

      if (remainingQuantity > 1) {
        var messagesDataMt: string = <string>this.AllToasterMessage.find(x => x.code == 'materialquanityexceed')?.message1;

        this.toastrService.error(messagesDataMt.replace('{0}', remainingQuantity.toString()));
      }
      else {
        this.toastrService.error('Material quantity being added cannot exceed the equipment capacity.' + this.EquivalentPallates + ' for this equipment.');
      }

      var cal3 = 0;
      if (this.TempData.code == "F23") {
        //this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
        cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
        this.NPMIPallet = this.NPMIPallet - Number(cal3 * 2);
        this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
      }
      else {
        cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
        this.TotalPalates = this.TotalPalates - Number(cal3);
      }
      this.NPMIPallet = this.NPMIPallet + Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
      this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
      this.TotalPalates = this.TotalPalates + Number(this.TempPalates);
      return false;
    }
    this.ResetMaterial();

    this.UpdateAdjustmentExistingChargesGrid();



    return true;
  }

  shippigMaterialQuanity() {
    var totalPallets: number = 0

    if (this.ShippingMaterialDetails != undefined && this.ShippingMaterialDetails.length > 0) {
      var otherShippingMaterials = this.ShippingMaterialDetails.filter(x => x.flag != 0);

      if (otherShippingMaterials != undefined && otherShippingMaterials.length > 0) {
        otherShippingMaterials.forEach((value, index) => {
          totalPallets = totalPallets + (this.IsShipment ? Number(value.shippedQuantity) : Number(value.quantity));
        });
      }

    }

    return totalPallets;

  }

  SelectMaterialEdit(id: number) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    this.selectedMaterialItems = [];
    this.EditFlag = true;
    this.TempData = this.MaterialDetails.find(f => f.materialID == id);
    var cal3 = 0;
    if (this.SelectMaterialData.code == "F23") {
      cal3 = Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
      //this.TempPalates = Number(cal3 * 2);
      this.NPMIPallet = this.NPMIPallet - Number(cal3 * 2);
      this.orderManagementAdjustCharges.NPMIPallets = this.getTotalNPMIPallet();
    }
    else {
      cal3 = Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
      this.TempPalates = Number(cal3);
    }
    this.SelectMaterial = this.TempData.materialID;
    var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
    this.selectedMaterialName = getmaterial.name;

    this.selectedMaterialItems.push({ "id": this.SelectMaterial, "name": getmaterial.name });
    //if() Abhaysingh
    if (this.IsShipment) {
      this.OQuantity = this.TempData.shippedQuantity;// parseFloat(this.TempData.shippedQuantity.replace(/,/g, ''));//
    }
    else {
      this.OQuantity = this.TempData.quantity//parseFloat(this.TempData.quantity.replace(/,/g, ''));//
    }

  }

  GetFreightMode(EquipmentTypeID: any, ClientId: any) {
    this.FreightModeData = [];
    this.orderManagementService.GetFreightMode(EquipmentTypeID, ClientId).pipe()
      .subscribe(
        data => {
          this.FreightModeData = data.data;
          if (!!!this.orderManagement.Id || this.orderManagement.Id == 0 && !!!this.orderManagement.FreightModeID) {
            var isFind: boolean = false;
            this.FreightModeData.forEach((value, index) => {

              if (value.code == "TL" || value.Code == "TL") {

                this.orderManagement.FreightModeID = value.id;
                isFind = true;

              }
            });

            if (!isFind) {
              this.orderManagement.FreightModeID = Number(this.FreightModeData[0].id);
            }

          }
          else {
            this.orderManagement.FreightModeID = this.orderManagement.FreightModeID;
          }

        });

  }


  GetComment(ContractID: any, LocationID: any, ClientId: any) {
    this.orderManagementService.GetComment(ContractID, LocationID, ClientId).pipe()
      .subscribe(
        data => {
          this.orderManagement.TransportationComment = data.data.transportationComment;
          this.orderManagement.LoadingComment = data.data.loadingComment;
          this.orderManagement.Comments = data.data.orderComment;
        });

  }

  changeShowOnBOL() {
    if (this.orderManagementAdjustCharges.editIndex > -1) {
      this.orderManagementAdjustCharges.allAdjustChargesData[this.orderManagementAdjustCharges.editIndex].overrideShowOnBOL = this.orderManagement.adjustChargesShowOnBOL;
    }
  }

  DefaultCarrier(ClientID: any, UserID: any,) {
    this.selectedCarrierItems = [];
    this.orderManagementService.DefaultCarrier(ClientID, UserID).pipe()
      .subscribe(
        data => {
          if (data.data.id > 0) {
            this.SCarrierId = data.data.id;
            if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {
              this.selectedCarrierItems.push({ "id": this.SCarrierId, "name": data.data.name });
            }
          }
          else {
            this.SCarrierId = 0;
          }

        });
  }



  SelectContractTo(data: any[], OrderType: string, ClientID: number, LocationID: number) {

    let letdata: any;
    this.orderManagementService.ToSelectedContract(data, OrderType, ClientID, LocationID).pipe(
      finalize(() => {

        if (letdata != null || letdata != undefined) {
          if ((!!!this.orderManagement.Id || this.orderManagement.Id == 0 || this.orderManagement.Id > 0) && this.isLocationChangeByUser) {
            this.orderManagement.ToContractId = letdata;
            if (!this.IsCustomerReturn) {
              this.GetComment(this.orderManagement.ToContractId, this.orderManagement.ToLocationId, this.orderManagement.ClientId);

              // this.ContractMaterial(ClientID, LocationID, this.orderManagement.ToContractId);
              // this.ContractCharge(ClientID, LocationID, this.orderManagement.ToContractId, this.orderCommonService.convertDatetoStringDate(this.orderManagement.RequestedDeliveryDate));
              //(keyup)="onSearch($event.target.value)" (onOpen)="onOpenMaterial()" class="materialBold"
            }
          }
          else {
            this.orderManagement.ToContractId = this.orderManagement.ToContractId;
          }
        }
        else {
          this.orderManagement.ToContractId = 0;
        }

        this.CotractRelatedChargesBind();
      }))
      .subscribe(
        result => {
          letdata = result.data;
        });
  }

  SelectedContractFrom(data: any[], OrderType: string, ClientID: number, LocationID: number) {
    this.orderManagementService.SelectedContractFrom(data, OrderType, ClientID, LocationID).pipe()
      .subscribe(
        data => {

          if (data.data != null) {
            if (!!!this.orderManagement.Id || this.orderManagement.Id == 0 || !!!this.orderManagement.FromContractId) {
              this.orderManagement.FromContractId = data.data;
              if (this.IsCustomerReturn) {
                this.GetComment(this.orderManagement.FromContractId, this.orderManagement.FromLocationId, this.orderManagement.ClientId);
              }

            }
            else {
              this.orderManagement.FromContractId = this.orderManagement.FromContractId;
            }
          }
          else {
            this.orderManagement.FromContractId = 0;
          }

        });
  }



  onPONum(event) {
    let PONum = event.target.value.trim();
    if (!!PONum) {
      const re = /^[A-Za-z0-9-,. ]*$/;
      if (!(re.test(String(PONum).toLowerCase()))
        && !!PONum && PONum) {
        PONum = PONum.toString().substring(0, PONum.length - 1);
        event.target.value = PONum;
      }
    }
    this.orderManagement.PurchaseOrderNumber = PONum;
  }
  onEquipNo(event) {
    let TrailerNumber = event.target.value.trim();
    if (!!TrailerNumber) {
      const re = /^[A-Za-z0-9]*$/;
      if (!(re.test(String(TrailerNumber).toLowerCase()))
        && !!TrailerNumber && TrailerNumber) {
        TrailerNumber = TrailerNumber.toString().substring(0, TrailerNumber.length - 1);
        event.target.value = TrailerNumber;
      }
    }
    this.orderManagement.TrailerNumber = TrailerNumber;
  }
  onSealNo(event) {
    let TrailerSealNumber = event.target.value.trim();
    if (!!TrailerSealNumber) {
      const re = /^[A-Za-z0-9]*$/;
      if (!(re.test(String(TrailerSealNumber).toLowerCase()))
        && !!TrailerSealNumber && TrailerSealNumber) {
        TrailerSealNumber = TrailerSealNumber.toString().substring(0, TrailerSealNumber.length - 1);
        event.target.value = TrailerSealNumber;
      }
    }
    this.orderManagement.TrailerSealNumber = TrailerSealNumber;
  }

  ResetMaterial() {
    this.EditFlag = false;
    this.SelectMaterial = 0;
    this.OQuantity = "";
    this.selectedMaterialItems.splice(0, this.selectedMaterialItems.length);
  }

  verifyMaterialProperties(materials: number, action: string) {


    this.selectedMaterialPropertiesshow = false;
    this.orderManagementService.VerifyEquipmentMaterialPropertyOrder(materials, this.SelectEquipment)
      .subscribe(
        data => {
          this.editVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();
          var result = data.data;

          result.map(f => {
            this.editVerifyEquipmentMaterialProperty.materialWeight = !!!f.materialWeight ? 0 : f.materialWeight;
            if (f.code == 'Number of Units on a Pallet') {
              this.editVerifyEquipmentMaterialProperty.propertyValueUP = !!!f.propertyValue ? 0 : f.propertyValue;
            }
            if (f.code == 'Number of Pallets in an Equipment') {
              this.editVerifyEquipmentMaterialProperty.propertyValuePE = !!!f.propertyValue ? 0 : f.propertyValue;
            }
            if (f.code == 'Number of Units in an Equipment') {
              this.editVerifyEquipmentMaterialProperty.propertyValueUE = !!!f.propertyValue ? 0 : f.propertyValue;
            }
          });

          if (this.editVerifyEquipmentMaterialProperty.materialWeight == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValueUP == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValuePE == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValueUE == 0) {

            $("#materialPropertyPopup").modal('show');
            this.materialPropertyPopup = "materialPropertyPopup";
            this.selectedMaterialPropertiesshow = true;
            return;
          }
          else {
            if (action == "modifymaterial") {
              if (this.EditFlag) {
                this.EditMaterial();

              }
              else {
                this.AddMaterial();




                //this.selectedMaterialItems.splice(0, this.selectedMaterialItems.length);
              }


            }
          }
        });
  }

  saveallmaterialProperties() {

    var selectedMaterialProperties: MaterialPropertyGrid[] = [];
    var ErrorMessage = "";
    var isErrorFound: boolean = false;
    this.MissingMaterialPropertyData.forEach((value, index) => {
      if (value.materialWeight <= 0) {
        ErrorMessage = ErrorMessage + "Please enter valid Weight for Material" + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {

        ErrorMessage = ErrorMessage + 'Please enter valid "Material Unit on a Pallet" for Material :' + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {

        ErrorMessage = ErrorMessage + 'Please enter valid "No. of Pallets in the Equipment" for Material :' + value.materialName;
        isErrorFound = true;
      }

      if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {

        ErrorMessage = ErrorMessage + 'Please enter valid "No. of material units in the Equipment" for Material :' + value.materialName;
        isErrorFound = true;
      }
      selectedMaterialProperties.push({
        equipmentID: Number(this.orderManagement.EquipmentTypeId),
        materialID: Number(value.materialID),
        materialName: value.materialName,
        materialWeight: Number(value.materialWeight),
        palletInEquipement: Number(value.palletInEquipement),
        unitInEquipement: Number(value.unitInEquipement),
        unitInPallet: Number(value.unitInPallet)
      });

    });


    if (isErrorFound) {
      selectedMaterialProperties.splice(0, selectedMaterialProperties.length);
      this.toastrService.error(ErrorMessage);
      return;
    }
    else {
      this.orderManagementService.SaveMulitpleMaterialProperties(selectedMaterialProperties).subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          //resolve error

          //this.CommodityData = result.data == undefined ? result.Data : result.data;
          $("#compilePopup").modal('hide');

          this.SaveOrder();
        }
        else {
          this.toastrService.error("There is a technical issue encountered. Please refer this to support team");
        }

      });
    }
  }


  RemoveSalesOrder(OrderID) {
    this.orderManagementService.SalesOrderforEdit.splice(this.orderManagementService.SalesOrderforEdit.findIndex(x => x.OrderId === OrderID), 1);
  }


  SelectedEquipment(item: any) {
    this.orderManagement.EquipmentTypeId = item.id;
    this.orderManagement.equipmentTypeName = item.name;
    this.selectedETDName = item.name;
    this.SelectEquipment = item.id;
    this.EquivalentPallates = this.EquipmentTypeData.find(x => x.id == Number(this.orderManagement.EquipmentTypeId))?.maxPalletQty;
    this.orderManagementAdjustCharges.MaxPalletSize = this.EquipmentTypeData.find(x => x.id == Number(this.orderManagement.EquipmentTypeId))?.maxPalletQty;
    this.GetFreightMode(Number(this.SelectEquipment), this.orderManagement.ClientId);
  }


  GetStatuswithcondition(locationID: number, Credit: string) {


    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id <= 0 || this.IsShipment == false || (this.orderManagement.Id > 0 && this.SelectedSalesOrdersforEdit != undefined && Number(this.orderManagement.ToLocationId) != Number(this.SelectedSalesOrdersforEdit.ToLocationId) && this.SelectedSalesOrdersforEdit.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted)) {
      if (this.orderManagement.OrderTypeCode == GlobalConstants.ChargeOrder) return;

      //if (this.orderManagement != undefined && this.orderManagement.OverrideCreditHold && !this.isLocationChangeByUser)
      //  return;

      this.OrderStatusData = [];
      var requestedDelieveryDate = this.orderManagement.RequestedDeliveryDate != undefined ? this.orderCommonService.convertDatetoStringDate(this.orderManagement.RequestedDeliveryDate) : null;

      this.orderManagementService.GetStatuswithcondition(locationID, Credit, requestedDelieveryDate, this.orderManagement.Id, this.orderManagement.OrderTypeId)
        .subscribe(
          data => {
            this.OrderStatusData = data.data;

            var statusID = 0;
            if (this.orderManagement.OrderStatusId != undefined)
              statusID = Number(this.orderManagement.OrderStatusId);

            var statusAvailable = this.OrderStatusData.find(f => (Number(statusID) > 0 && f.id == Number(statusID)) || (Number(statusID) == 0 && f.code == GlobalConstants.OpenOrderNeedsToBeCompleted));

            if (statusAvailable != undefined) {
              this.orderManagement.OrderStatusId = statusAvailable.id;
              this.orderManagement.OrderStatusCode = statusAvailable.code;
              this.orderManagement.OrderStatusName = statusAvailable.name;

            }
            else {

              this.orderManagement.OrderStatusId = this.OrderStatusData[0].id;
              this.orderManagement.OrderStatusCode = this.OrderStatusData[0].code;
              this.orderManagement.OrderStatusName = this.OrderStatusData[0].name;
            }

            this.SelectedOrderStatusSearchable();

          });
    }

  }

  async GetSalesOrderDataByOrderId(OrderId: number, OrderType: string) {
    let letdata: any;
    this.orderManagementService.SalesOrderDataByOrderIdwithClientID(OrderId,
      this.authenticationService.currentUserValue.ClientId,
      OrderType)
      .pipe(
        finalize(async () => {
          if (letdata != null || letdata != undefined) {
            console.log("regular order data from GetSalesOrderDataByOrderId");
            console.log(letdata);

            this.orderManagement = new OrderManagement();
            letdata.map(f => {
              this.orderManagement.Id = f.OrderId;
              this.orderManagement.OrderTypeId = f.OrderTypeID;
              this.orderManagement.OrderTypeCode = f.OrderTypeCode;
              this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
              this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;
              this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
              this.orderManagement.OrderVersionNumber = f.OrderVersionNumber;
              this.OrderTypeId = Number(f.OrderTypeID);
              this.orderManagement.OrderStatusId = f.OrderStatusID;
              this.orderManagement.OrderStatusCode = f.OrderStatusCode;

              this.orderManagement.ShipFromTypeId = Number(!!!f.ShipFromTypeId ? 0 : f.ShipFromTypeId);
              this.orderManagement.FromLocationId = !!!f.FromLocationID ? 0 : f.FromLocationID;

              this.FromLocationName = !!!f.FLocation ? '' : f.FLocation;
              this.orderManagement.FromAddressId = f.FromAddressID;
              this.orderManagement.ShipFromLocationContactId = !!!f.ShipFromLocationContactID ? 0 : f.ShipFromLocationContactID;
              this.orderManagement.FromContractId = 0;
              //!!!f.FromCustomerContractID ? (!!!f.FromBusinessPartnerContractID ? 0 : f.FromBusinessPartnerContractID) : f.FromCustomerContractID;
              this.SCarrierId = !!!f.CarrierID ? 0 : f.CarrierID;
              this.orderManagement.CarrierId = !!!f.CarrierID ? 0 : f.CarrierID;
              this.orderManagement.carierName = !!!f.CarrierName ? '' : f.CarrierName;
              this.SelectEquipment = !!!f.EquipmentTypeID ? 0 : f.EquipmentTypeID;
              this.orderManagement.equipmentTypeName = !!!f.EquipmentName ? '' : f.EquipmentName;
              this.selectedETDName = this.orderManagement.equipmentTypeName;
              this.orderManagement.EquipmentTypeId = !!!f.EquipmentTypeID ? 0 : f.EquipmentTypeID;
              this.orderManagement.TrailerNumber = f.TrailerNumber == null ? '' : f.TrailerNumber;
              this.orderManagement.TrailerSealNumber = f.TrailerSealNumber == null ? '' : f.TrailerSealNumber;
              this.orderManagement.FreightModeID = !!!f.FreightModeID ? 0 : f.FreightModeID;
              //this.orderManagement.RequestedDeliveryDate = f.RequestedDeliveryDate;
              this.orderManagement.RequestedDeliveryDate = f.RequestedDeliveryDate != null ? this.setDateMMddyyyy(new Date(f.RequestedDeliveryDate)) : f.RequestedDeliveryDate;
              //this.orderManagement.ScheduledShipDate = f.ScheduledShipDate;
              this.orderManagement.ScheduledShipDate = f.ScheduledShipDate != null ? this.setDateMMddyyyy(new Date(f.ScheduledShipDate)) : f.ScheduledShipDate;
              this.orderManagement.MustArriveByDate = f.MustArriveByDate != null ? this.setDateMMddyyyy(new Date(f.MustArriveByDate)) : f.MustArriveByDate;
              this.orderManagement.ShipToTypeId = Number(!!!f.ShipToTypeId ? 0 : f.ShipToTypeId);
              this.orderManagement.ToLocationId = !!!f.ToLocationID ? 0 : f.ToLocationID;
              this.orderManagement.shipToLocationName = !!!f.TLocation ? '' : f.TLocation;
              this.orderManagement.ToAddressId = f.ToAddressID;
              this.orderManagement.ShipToLocationContactId = !!!f.ShipToLocationContactID ? 0 : f.ShipToLocationContactID;
              this.orderManagement.InvoiceNo = f.InvoiceNumber;
              this.orderManagement.ToContractId = 0;
              //!!!f.ToCustomerContractID ? (!!!f.ToBusinessPartnerContractID ? 0 : f.ToBusinessPartnerContractID) : f.ToCustomerContractID;
              this.isChecked = f.SupressEmailConfirmation;
              this.orderManagement.PurchaseOrderNumber = f.PurchaseOrderNumber;
              this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;
              this.orderManagement.orderNumber = f.OrderNumber;
              this.OrderNumber = f.OrderNumber;
              this.orderManagementService.CurrentEditOrderNumber = f.OrderNumber;
              this.orderManagement.PickupApplointment = f.PickupAppointment != null ? (new Date(f.PickupAppointment)) : f.PickupAppointment;
              this.orderManagement.DeliveryAppointment = f.DeliveryAppointment != null ? (new Date(f.DeliveryAppointment)) : f.DeliveryAppointment;
              this.orderManagement.CreatedBy = f.UpdatedBy;
              this.orderManagement.OrderStatusName = f.OrderStatusName;
              this.orderManagement.OrderConditionCode = f.OrderConditionCode;
              //this.orderManagement.UpdateDateTimeServerStrFromat = (f.UpdateDateTimeServer != undefined && f.UpdateDateTimeServer != null ? f.UpdateDateTimeServer.toLocaleString() : "");
              this.orderManagement.ShipmentID = !!!f.ShipmentID ? 0 : f.ShipmentID;
              this.orderManagement.ARChargesSentToAccounting = !!!f.ARChargesSentToAccounting ? 0 : f.ARChargesSentToAccounting;
              this.orderManagement.TransportationComment = f.TransportationComment == null ? '' : f.TransportationComment;
              this.orderManagement.LoadingComment = f.LoadingComment == null ? '' : f.LoadingComment;
              this.orderManagement.Comments = f.Comments == null ? '' : f.Comments;
              this.orderManagement.TransplaceOrderComment = f.TransplaceOrderComment == null ? '' : f.TransplaceOrderComment;
              this.orderManagement.TransplaceDeliveryComment = f.TransplaceDeliveryComment == null ? '' : f.TransplaceDeliveryComment;
              this.orderManagement.OrderCondition = f.OrderCondition;
              this.orderManagement.ShipmentNumber = f.ShipmentNumber;
              this.orderManagement.ShipmentVersion = f.ShipmentVersion;
              this.orderManagement.ShipmentStr = (this.orderManagement.ShipmentNumber != null && this.orderManagement.ShipmentNumber != "") ? "(Shipment - " + this.orderManagement.ShipmentNumber + "." + this.orderManagement.ShipmentVersion + ")" : "";
              this.orderManagement.OverrideCreditHold = f.OverrideCreditHold == null ? false : (f.OverrideCreditHold == 0 ? false : true);
              this.IsOldVersion = f.IsLatestVersion == 0 ? true : false;
              this.InOnProcess = f.IsOnProcess;
              //this.orderManagement.UpdateDate = (f.UpdateDate == null || f.UpdateDate == "") ? f.CreateDate : f.UpdateDate;
              //this.orderManagement.CreateDate = f.CreateDate;

              this.orderManagement.UpdateDate = this.orderManagementService.getLocalDateTime((f.UpdateDate == null || f.UpdateDate == "") ? f.CreateDate : f.UpdateDate);
              this.orderManagement.CreateDate = this.orderManagementService.getLocalDateTime(f.CreateDate);

              this.orderManagement.UpdatedBy = f.UpdatedBy;
              this.orderManagement.CreatedBy = f.CreatedBy;
              this.orderManagement.LinkOrders = f.LinkOrders;
              this.orderManagement.AllocatedFreightCharge = Number(f.AllocationFrightCharges == null ? 0 : f.AllocationFrightCharges);
              this.orderManagement.AllocatedFreightChargeStr = (this.orderManagement.AllocatedFreightCharge != null && this.orderManagement.AllocatedFreightCharge != undefined ? this.ConvertMoneyToDecimalPreferences(this.orderManagement.AllocatedFreightCharge) : this.ConvertMoneyToDecimalPreferences(0));
            });

            //var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;
            //this.Tocontract(this.orderManagement.ToLocationId > 0 ? this.orderManagement.ToLocationId : 0, selectedDate, this.OrderTypeId);
            //this.Fromcontract(this.orderManagement.FromLocationId > 0 ? this.orderManagement.FromLocationId : 0, selectedDate, this.OrderTypeId);




            this.SelectedSalesOrdersforEdit = JSON.parse(JSON.stringify(this.orderManagement));

            console.log("Initial  data of order");
            console.log(this.SelectedSalesOrdersforEdit);

            console.log("Binding edit mode events data");
            this.refershingDataOrderSelectedOrder();
            console.log("End Binding edit mode events data");
            this.DisabedLocation();
            // this.ContractMaterial(this.orderManagement.ClientId, this.orderManagement.ToLocationId, this.orderManagement.ToContractId > 0 ? this.orderManagement.ToContractId : 0);

            //to handle left menu on edit screen on link order click from shipment screen
            if (this.isOrderLinkClick == "Yes") {
              this.SalesOrderforEdit = letdata;
              this.orderManagementService.SalesOrderforEdit = [];
              this.orderManagementService.SalesOrderforEdit = letdata;

              if (this.orderManagementService.SalesOrderforEdit != undefined && this.orderManagementService.SalesOrderforEdit.length > 0) {
                this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
                //Add same shipment no order on this object
                if (this.orderManagementService.SalesOrderforEditSameShipmentNo.length > 0) {
                  for (var i = 0; i < this.orderManagementService.SalesOrderforEditSameShipmentNo.length; i++) {
                    var exist = false;
                    for (let j = 0; j < this.SalesOrderforEdit.length; j++) {
                      if (this.orderManagementService.SalesOrderforEditSameShipmentNo[i].OrderId === this.SalesOrderforEdit[j].OrderId) {
                        exist = true;
                      }
                    }
                    if (!exist)
                      this.SalesOrderforEdit.push(this.orderManagementService.SalesOrderforEditSameShipmentNo[i]);
                  }
                }
                //Add ship with order on this object
                if (this.orderManagementService.SalesOrderforEditLinkOrders.length > 0) {
                  for (var i = 0; i < this.orderManagementService.SalesOrderforEditLinkOrders.length; i++) {
                    var exist = false;
                    for (let j = 0; j < this.SalesOrderforEdit.length; j++) {
                      if (this.orderManagementService.SalesOrderforEditLinkOrders[i].OrderId === this.SalesOrderforEdit[j].OrderId) {
                        exist = true;
                      }
                    }
                    if (!exist)
                      this.SalesOrderforEdit.push(this.orderManagementService.SalesOrderforEditLinkOrders[i]);
                  }
                }

                if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
                  this.orderManagement.Id = Number(this.SalesOrderforEdit[0].OrderId);
                  this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
                }
                else {
                  console.log("approveAndMas disable 1 R");
                  this.buttonBar.disableAction('approveAndMas');
                  this.buttonBar.disableAction('resendToMas');
                  this.buttonBar.disableAction('calculate');
                  this.buttonBar.disableAction('copy');
                }
              }
              //ng after
              if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
                this.BindOrderDetails(Number(this.SalesOrderforEdit[0].OrderId), this.SalesOrderforEdit[0].OrderType, this.SalesOrderforEdit[0]);
                this.CurrentOrderId = this.SalesOrderforEdit[0].OrderId;
                this.CurrentOrderType = this.SalesOrderforEdit[0].OrderType;
                if (this.SalesOrderforEdit.length > 1) {
                  //enable
                  this.isEditNextOrder = false;
                }
                else {
                  //diseble
                  this.isEditNextOrder = true;
                }
              }

              localStorage.SelectedOrderIdLink = null;
              localStorage.SelectedOrderTypeIdLink = null;
              localStorage.isOrderLinkClick = null;
              this.SelectedOrderIdLink = 0;
              this.SelectedOrderTypeStr = null;
              this.isOrderLinkClick = null;
            }
            localStorage.SelectedOrderIdLink = null;
            this.SelectedOrderIdLink = 0;
            this.SelectedOrderTypeStr = null;
            this.isOrderLinkClick = null;
            await this.freezOrder(this.orderManagement.OrderCondition, this.orderManagement.OrderTypeCode, this.orderManagement.OrderStatusCode);
          }
        }),
      )
      .subscribe(
        result => {
          letdata = result.data;
        });
  }

  resetAllSelectedDrodowns() {

    if (this.selectedCarrierItems.length > 0) {
      this.selectedCarrierItems.splice(0, this.selectedCarrierItems.length);

    }


    if (this.selectedETDItems.length > 0) {
      this.selectedETDItems.splice(0, this.selectedETDItems.length);
    }

    if (this.selectedshipfromItems.length > 0) {
      this.selectedshipfromItems.splice(0, this.selectedshipfromItems.length);
      this.shipfromlist.splice(0, this.shipfromlist.length);
    }

    // Requested Deleiver Date Flags
    this.isRequestedDeliveryDateValidate = false;

    // Scheduleship  Date Flags
    this.isScheduleShipDate = false;


    // Must arrive Date Flags
    this.isMustArriveByDate = false;
    this.isTruckOrderNotUsed = false;
    this.isOrderSentToMAS = false;
    this.isChargeOrderSentToMAS = false;


    this.IsShipFromType = false;
    this.isFromContract = false;
    this.isEquipmentNo = false;
    this.isTrailerSealNumber = false;
    this.isFreight = false;


    if (this.orderManagementAdjustCharges.allAdjustChargesData != undefined && this.orderManagementAdjustCharges.allAdjustChargesData.length > 0) {
      this.orderManagementAdjustCharges.allAdjustChargesData = [];
      this.orderManagementAdjustCharges.defaultContractChargesData = [];
      this.orderManagementAdjustCharges.SelectedContractCharges = [];
      this.orderManagementAdjustCharges.TotalAmount = 0;
      this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
    }

  }

  async refershingDataOrderSelectedOrder() {

    if (this.orderManagement.OrderStatusCode.trim() == "Cancelled" || this.orderManagement.ShipmentID > 0) {
      this.buttonBar.disableAction('saveAndNotify');
    }
    else {
      if (this.isReadAndModifyForBtn && !this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS)
        this.buttonBar.enableAction('saveAndNotify');

    }
    console.log("clear previous values");
    this.resetAllSelectedDrodowns();

    console.log("SelectedOrderTypeSearchable on edit")
    this.SelectedOrderTypeSearchable();
    console.log("GetStatus on edit")
    this.GetStatus(Number(this.orderManagement.Id), Number(this.orderManagement.OrderTypeId));
    console.log("GetStatus on edit")

    if (this.orderManagementAdjustCharges == null || this.orderManagementAdjustCharges == undefined) {
      console.log("instiate on edit")
    }
    this.orderManagementAdjustCharges.OrderID = this.orderManagement.Id;
    this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;
    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;


    console.log("BindMaterialList on edit")
    this.BindMaterialList(this.orderManagement.Id, 0);
    console.log("getShipToType on edit")
    this.getShipToType();

    this.BindFuelCharges(Number(this.orderManagement.ToLocationId));

    console.log("getShipFromType on edit")
    this.getShipFromType();
    if (this.orderManagement.ShipFromTypeId > 0) {
      console.log("BindAllFromShipLocation on edit")
      this.BindAllFromShipLocation(this.orderManagement.ShipFromTypeId);
    }

    if (this.orderManagement.ShipToTypeId > 0) {
      console.log("selectToType on edit")
      await this.selectToType(this.orderManagement.ShipToTypeId);
    }

    if (this.orderManagement.FromLocationId > 0) {
      this.isOrderEditbindlocation = false;
      console.log("selectEditShipFrom on edit")
      this.selectEditShipFrom(this.orderManagement.FromLocationId);
    }



    if (this.orderManagement.ToLocationId > 0) {
      this.isOrderEditbindlocation = false;
      console.log("EditOrderToLocation on edit")
      this.EditOrderToLocation();
    }



    if (!this.IsStockTransfer && !this.IsCustomerReturn && !this.IsChargeOrder) {
      console.log("BindAvailableCredit on edit")
      this.BindAvailableCredit(Number(this.orderManagement.ToLocationId));
    }
    this.orderTypevalidate = true;

    console.log("OrderTypeEnableDisable on edit")
    this.OrderTypeEnableDisable(true);
    if (!!this.orderManagement.OrderStatusCode && (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping)) {
      // this.OrderTypeCodeStatus(this.orderManagement.OrderTypeCode);
      this.Ordervalidate = false;
    }
    else {
      this.Ordervalidate = true;
    }

    console.log("carrrier selected on edit")
    this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "name": this.orderManagement.carierName });

    console.log("editorderselctionchange on edit")
    this.editorderselctionchange();
    this.propertySetDisableEdit();
    this.propertySetDisable();

    console.log("FilterAdjustmentChargeSectionCharges on edit")
    this.FilterAdjustmentChargeSectionCharges();

    if (this.IsAssignedTOShipment) {
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipFromToEnableDisable(true);
      else
        this.settingsShipFromTo = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }



    if (this.ARChargesSentToAccounting && (this.IsCustomer || this.IsCPUOrder || this.IsCustomerReturn)) {

      if (this.IsCustomerReturn) {
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true,
          labelKey: 'name',
          searchBy: ['name']
        };
      }
      if (this.IsCustomer || this.IsCPUOrder) {
        this.settingsShipFromTo = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true,
          labelKey: 'name',
          searchBy: ['name']
        };
      }


      this.settingsCarrier = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.settingsEquip = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        disabled: true,
        badgeShowLimit: 1,
        labelKey: 'name',
        searchBy: ['name']
      };
      this.isFromContract = true;
      this.isFreight = true;
      this.isRequestedDeliveryDateValidate = true;
      //this.isToContract = true;
      this.isScheduleShipDate = true;
      this.isMustArriveByDate = true;
      this.isShowOnBOL = true;
      this.stopAutoCallRequestedCalender = false;
      this.stopAutoCallScheduleShpCalender = false;
    }

    if (this.ARChargesSentToAccounting && (this.IsChargeOrder)) {

      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };


      this.settingsCarrier = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.settingsEquip = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        disabled: true,
        badgeShowLimit: 1,
        labelKey: 'name',
        searchBy: ['name']
      };
      this.isFromContract = true;
      this.isFreight = true;
      this.isRequestedDeliveryDateValidate = true;
      this.isToContract = true;
      this.isScheduleShipDate = true;
      this.isMustArriveByDate = true;
      this.isShowOnBOL = true;
      this.isEquipmentNo = true;
      this.IsSealNumber = true;
      this.IsAppointment = true;

    }
    console.log("verifyLocationStatus on edit");
    this.verifyLocationStatus();

    console.log("resetValidationCss on edit");
    this.resetValidationCss();
    if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS && this.isReadAndModifyForBtn)
      this.buttonBar.enableAction('calculate');
    if (this.IsOldVersion) {
      this.buttonBar.disableAction('calculate');
      this.buttonBar.disableAction('delete');
      this.buttonBar.disableAction('copy');
      this.buttonBar.disableAction('issue');
      this.buttonBar.disableAction('orderCancel');
      this.buttonBar.disableAction('save');
      this.buttonBar.disableAction('saveAndNotify');
      this.buttonBar.disableAction('export');
      this.regularOrderHasReadOnlyAccess = true;
      this.toastrService.warning("A newer version is available for this order. Please edit the same to make any modifications.");
    }
    if (this.InOnProcess) {
      this.buttonBar.disableAction('calculate');
      this.buttonBar.disableAction('delete');
      this.buttonBar.disableAction('copy');
      this.buttonBar.disableAction('issue');
      this.buttonBar.disableAction('orderCancel');
      this.buttonBar.disableAction('save');
      this.buttonBar.disableAction('saveAndNotify');
      this.buttonBar.disableAction('export');
      this.regularOrderHasReadOnlyAccess = true;
      this.toastrService.warning("The current order is being processed by backend processes. Please wait and refresh to edit the order");
    }
    if (!this.InOnProcess && !this.IsOldVersion && !this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS && this.isReadAndModifyForBtn) {
      this.buttonBar.enableAction('calculate');
      //this.buttonBar.enableAction('copy');
      this.buttonBar.enableAction('issue');
      this.EnableDisableCancelBtnOnSelection(this.orderManagement);
      this.buttonBar.enableAction('save');
      if (this.orderManagement.OrderStatusCode.trim() == "Cancelled" || this.orderManagement.ShipmentID > 0) {
        this.buttonBar.disableAction('saveAndNotify');
      }
      else
        if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
          this.buttonBar.enableAction('saveAndNotify');
        }

      this.buttonBar.enableAction('export');
    }
    this.CheckStatusForSendtoMass(this.orderManagement.Id.toString(), this.orderManagement.OrderTypeCode);
    this.CheckStatusResendtoMass(this.orderManagement.Id.toString(), this.orderManagement.OrderTypeCode);
  }


  async selectToType(LoctionFuntionToId) {

    if (LoctionFuntionToId != 0) {

      this.orderManagement.ShipToTypeId = Number(LoctionFuntionToId);
      this.bindForShipToType(Number(LoctionFuntionToId));
    }
    else {

      this.orderManagement.ShipToTypeId = 0;
      this.shiptolist = [];
    }
  }

  async bindForShipToType(shipto: number) {
    if (shipto != 0) {
      this.isStockTransfer ? (this.isScheduleDateExist = false) : (this.isDateExist = false);

      this.LoctionFuntionToId = Number(shipto);

      if (!!this.OrderTypeId) {

        var isPutCode: boolean = true;

        var wearHouse = this.shiptolist.find(x => Number(x.id) == Number(this.LoctionFuntionToId))?.code;
        if (wearHouse != undefined && (wearHouse == 'Warehouse' || wearHouse == 'WashFacility')) {
          isPutCode = false;
        }

        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'shipto';
        this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);

        let data: any;

        this.orderManagementService.ShipToData(this.commonOrderModel)
          .pipe(
            finalize(() => {
              var datas = data;
              this.filterShipToModel = datas;
              this.shiptolist = [];
              this.selectedItemsB = [];
              datas.map(item => {
                return {
                  name: isPutCode ? item.name + "-" + item.code : item.name,
                  id: Number(item.id),
                  locationTypeCode: item.locationTypeCode
                };
              }).forEach(x => this.shiptolist.push(x));
              if (this.orderManagement.ToLocationId > 0 && this.shiptolist.length > 0) {


                var selectedLocationName = this.shiptolist.find(x => Number(x.id) == Number(this.orderManagement.ToLocationId))?.name;

                this.selectedItemsB.push({ "id": this.orderManagement.ToLocationId, "name": selectedLocationName });
              }
              this.selectEditShipTo(this.orderManagement.ToLocationId);
            }),
          )
          .subscribe(
            result => {
              data = result.data;
            });

      }
    }
  }

  selectEditShipTo(event) {

    if (event != 0) {
      this.orderManagement.ToLocationId = Number(event);
      this.LocationId = Number(event);
      this.contactlist = [];
      this.orderManagementAdjustCharges.DefaultCommodityID = this.filterShipToModel.find(f => f.id == this.LocationId).defaultCommodityID;
      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'contact';
        this.commonOrderModel.LocationID = this.LocationId;


        this.selectaddressname(this.LocationId);
        this.BindSalesManagerListData();
        // 2020-09-22/this.selectContractTo(this.LocationId);

        this.GetEquipment(this.orderManagement.ToLocationId, this.orderManagement.ClientId);

        // this.bindDataForToLocationContractRelated();

        this.orderManagementService.ShipToContactData(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            if (datas.length > 0) {
              this.filterContactModel = datas;
              //this.orderManagement.ShipToLocationContactId = datas[0].id;
              this.contactlist = [];
              datas.map(item => {
                return {
                  name: item.name,
                  id: Number(item.id)
                };
              }).forEach(x => this.contactlist.push(x));
            }
            this.TotalPalates = 0;


          });
      }
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      this.commonOrderModel.Action = 'shipto';
      this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);
      this.commonOrderModel.LocationID = Number(this.orderManagement.ToLocationId);
      this.orderManagementService.ShipToAddressData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          if (datas != null && datas != undefined) {
            this.orderManagement.ToAddress = datas.toLocationAddressName;
            this.SelectedCountryCode = datas.countryCode;
            this.orderManagement.ToAddressId = datas.addressID;
          }
          else {
            this.orderManagement.ToAddress = '';
            this.SelectedCountryCode = '';
          }
        });
    }
  }

  async selectEditShipFrom(event) {
    if (event != 0) {

      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
      this.commonOrderModel.Action = 'shipto';
      this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);
      this.commonOrderModel.LocationID = Number(this.orderManagement.FromLocationId);
      this.orderManagementService.ShipToAddressData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          if (datas != null && datas != undefined) {

            this.orderManagement.FromAddres = datas.toLocationAddressName;

          }
          else {
            this.orderManagement.FromAddres = '';
          }

        });
      this.contactfromlist = [];
      this.orderManagementService.ShipToContactData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          if (datas.length > 0) {
            if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {
              this.orderManagement.ShipFromLocationContactId = datas[0].id;
            }
            else {
              this.orderManagement.ShipFromLocationContactId = this.orderManagement.ShipFromLocationContactId;
            }
            datas.map(item => {
              return {
                name: item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.contactfromlist.push(x));
          }
          else {
            this.orderManagement.ShipFromLocationContactId = 0;
          }

          var tt = this.contactfromlist;
        });
      var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;
      this.Fromcontract(Number(this.orderManagement.FromLocationId), selectedDate, Number(this.OrderTypeId));
      this.selectedshipfromItems.push({ "id": this.orderManagement.FromLocationId, "name": this.FromLocationName });
    }
  }

  editorderselctionchange() {
    this.EdittedOrderNumber.emit(this.orderManagement.orderNumber + "." + this.orderManagement.OrderVersionNumber.toString());
  }

  propertySetDisable() {

    if (this.IsOpenOrderNeedsToBeCompleted || this.IsSendforShipping) {
      this.Ordervalidate = false;
    }
    else {
      this.Ordervalidate = true;
    }

    if (this.IsStockTransfer) {
      if (this.IsStockTransfer) {
        this.orderTypevalidate = true;
        this.OrderTypeEnableDisable(true);
      }
      else {
        this.orderTypevalidate = false;
        this.OrderTypeEnableDisable(false);
      }


      if (this.IsShippedAndUnderReview) {

        this.isRequestedDeliveryDateValidate = true;
        this.isMustArriveByDate = true;
        this.isScheduleShipDate = true;

      } else {

        this.isRequestedDeliveryDateValidate = false;
        this.isMustArriveByDate = false;
        this.isScheduleShipDate = false;
      }
      //if (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS) {
      //  this.isPONumber = true;
      //}
      //else {
      //  this.isPONumber = false;
      //}
      if (this.IsOpenOrderNeedsToBeCompleted || this.IsSendforShipping) {
        this.isCarrier = false;
        this.Equipmentvalidate = false;
      }
      else {
        this.isCarrier = true;
        this.Equipmentvalidate = false;
      }
      if (this.IsOpenOrderNeedsToBeCompleted || this.IsSendforShipping || this.IsAssignedTOShipment) {
        this.IsSealNumber = false;
        this.IsEquipmentNumber = false;
      }
      else {
        this.IsSealNumber = true;
        this.IsEquipmentNumber = false;
      }

      if (this.IsTransferOrderShippedandInventorySentToMAS) {
        this.IsMaterialEdit = true;
        this.IsPalletEdit = true;
        this.IsChargesEdit = true;
      }
      else {
        this.IsMaterialEdit = false;
        this.IsPalletEdit = false;
        this.IsChargesEdit = false;
      }

      if (this.IsTransferOrderShippedandInventorySentToMAS
        || this.IsShippedAndUnderReview
        || this.IsShippedInventoryAndARChargesSentToMAS) {
        //this.IsShipToLocation = true;
        this.IsShipFromLocation = true;
        this.settings = {
          singleSelection: true,
          text: "Select",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: true,
          labelKey: 'name',
          searchBy: ['name']
        };

      }
      else {

        this.IsShipFromLocation = false;
        if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
          this.ShipToLocationEnableDisable(true);
        else
          this.settings = {
            singleSelection: true,
            text: "Select Location",
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            disabled: false,
            labelKey: 'name',
            searchBy: ['name']
          };
      }

      //if (this.IsShippedInventoryAndARChargesSentToMAS) {
      //  this.IsAppointment = true;
      //}
      //else {
      //  this.IsAppointment = false;
      //}
    }
    if (this.IsCPUOrder) {
      if (!this.IsOpenOrderNeedsToBeCompleted || !this.IsSendforShipping
        || !this.IsAssignedTOShipment) {
        this.IsSealNumber = false;
        this.IsEquipmentNumber = false;
      }
      else {
        this.IsSealNumber = true;
        this.IsEquipmentNumber = true;

      }

      //if (this.IsTransferOrderShippedandInventorySentToMAS
      //  || this.IsShippedAndUnderReview
      //  || this.IsShippedInventoryAndARChargesSentToMAS) {
      //  //this.IsShipToLocation = true;
      //  this.IsShipFromLocation = true;
      //  this.settings = {
      //    singleSelection: true,
      //    text: "Select Location",
      //    enableSearchFilter: true,
      //    addNewItemOnFilter: false,
      //    badgeShowLimit: 1,
      //    disabled: true,
      //    labelKey: 'name'
      //  };

      //}
      //else {
      //  // this.IsShipToLocation = false;
      //  this.IsShipFromLocation = false;
      //  this.settings = {
      //    singleSelection: true,
      //    text: "Select Location",
      //    enableSearchFilter: true,
      //    addNewItemOnFilter: false,
      //    badgeShowLimit: 1,
      //    disabled: false,
      //    labelKey: 'name'
      //  };
      //}

      //if (this.IsShippedInventoryAndARChargesSentToMAS) {
      //  this.IsAppointment = true;
      //}
      //else {
      //  this.IsAppointment = false;
      //}
    }

    if (this.IsOpenOrderNeedsToBeCompleted || this.IsSendforShipping) {
      this.IsEquipmentType = false;
    }
    else {
      this.IsEquipmentType = true;
    }

  }

  propertySetDisableEdit() {
    if (this.IsCPUOrder == true) {
      this.isCarrier = true;
      if (this.IsOpenOrderNeedsToBeCompleted == true || this.IsSendforShipping == true) {
        //editable
        this.Ordervalidate = false;

        this.isMustArriveByDate = false;
        this.isScheduleShipDate = false;

        this.Equipmentvalidate = false;

        this.isRequestedDeliveryDateValidate = false;
      } else {
        //not editable
        this.Ordervalidate = true;

        this.isMustArriveByDate = true;
        this.isScheduleShipDate = true;

        this.Equipmentvalidate = true;
      }
      //if (this.IsShippedAndUnderReview == true || this.IsShippedInventoryAndARChargesSentToMAS == true) {
      //  //not editable
      //  this.isRequestedDeliveryDateValidate = true;

      //  this.isMustArriveByDate = true;
      //  this.isScheduleShipDate = true;

      //} else {
      //  //editable
      //  //this.isRequestedDeliveryDateValidate = false;

      //  this.isMustArriveByDate = false;
      //  this.isScheduleShipDate = false;
      //}
      //if (this.IsShippedInventoryAndARChargesSentToMAS == true) {
      //  //not editable
      //  this.isPONumber = true;
      //} else {
      //  //editable
      //  this.isPONumber = false;
      //}
    }
  }

  OnItemShipFromDeSelect(item: any) {
    this.FromContractlist = [];
    this.ResetFromLocationDependantValues();
  }

  onItemCarrierSelect(item: any) {
    this.orderManagement.CarrierId = item.id;
    this.orderManagement.carierName = item.name;
    this.SCarrierId = item.id;
  }

  OnItemCarrierDeSelect(item: any) {

  }

  OnItemETDeSelect(item: any) {
    //console.log(item);
  }

  SaveAndNextOrder() {
    this.isSaveEditAndNextOrder = "SaveAndNextOrder";
    this.SaveOrder();
  }

  ClearSelectedFields() {
    this.MaterialDetails = [];
    this.ShippingMaterialDetails = [];
    this.orderManagement.FromLocationId = 0;
    this.SelectEquipment = 0;
    this.orderManagement.TrailerNumber = "";
    this.orderManagement.TrailerSealNumber = "";
    this.orderManagement.FreightModeID = 0;
    this.orderManagement.RequestedDeliveryDate = null;
    this.orderManagement.ScheduledShipDate = null;
    this.orderManagement.MustArriveByDate = null;
    this.selectedItemsB = [];
    this.selectedshipfromItems = [];
    this.selectedCarrierItems = [];
    this.selectedMaterialItems = [];
    this.selectedAdjustShippingItems = [];
    this.selectedAdjustItems = [];
    this.selectadjustChargesSectionChargeID = [];
    this.selectedETDItems = [];
    this.selectedMaterialItems = [];
    this.selectedAdjustShippingItems = [];
    this.selectedAdjustItems = [];
    this.TempData = [];
    this.TempDataShippingMaterial = [];
    this.TempPalates = 0;

    this.selectadjustChargesSectionChargeID = [];
    this.OQuantity = "";
    this.orderManagement.ShipToTypeId = 0;
    this.orderManagement.ToAddress = "";
    this.orderManagement.ShipToLocationContactId = 0;
    this.orderManagement.AddressName = "";
    this.orderManagement.ToContractId = 0;
    this.isChecked = false;
    if (!this.IsCollections && !this.IsStockTransfer) {
      this.orderManagement.PurchaseOrderNumber = "";
    }

    this.orderManagement.AvailableCredit = "";
    this.orderManagement.SalesManager = "";
    this.orderManagement.InvoiceNo = "";
    this.orderManagement.AllocatedFreightCharge = 0;
    this.orderManagement.PickupApplointment = null;
    this.orderManagement.DeliveryAppointment = null;
    this.orderManagement.fuelChargesRatePerMile = null;// 0;
    this.orderManagement.fuelChargesPercentage = 0;
    //Order Details
    this.SelectMaterial = 0;
    this.OQuantity = "";
    this.SelectUOM = 0;

    this.SelectAddjustMaterial = 0;
    this.AQuantity = "";
    this.ShippingSelectUOM = "";

    this.orderManagement.adjustChargesSectionMaterialID = -1;
    this.orderManagement.adjustChargesSectionChargeID = 0;
    this.orderManagement.adjustChargesCommodityID = 0;
    this.orderManagement.ChargeUnits = 1;
    this.orderManagement.adjustChargesRateTypeID = -1;
    this.orderManagement.adjustChargesPriceMethodID = -1;
    this.orderManagement.adjustChargesRateValue = 0;
    this.orderManagement.adjustChargesAmount = 0;
    this.orderManagement.adjustChargesShowOnBOL = false;
    this.dataSourceAddMaterial = null;
    this.dataSource = null;
    this.dataSourceAdjust = null;
    //comment
    this.orderManagement.TransportationComment = "";
    this.orderManagement.LoadingComment = "";
    this.orderManagement.TransplaceOrderComment = "";
    this.orderManagement.TransplaceDeliveryComment = "";
    this.orderManagement.Comments = "";
    this.orderManagement.OverrideCreditHold = false;
    this.AvailableCreditMessage = "No";
    this.IsAvailableCredit = false;

    this.resetAllSelectedDrodowns();

    this.BindPreLoadDataOnPage();
    this.resetValidationCss();
  }

  EditNextOrder() {
    this.isSaveEditAndNextOrder = "EditAndNextOrder";
    this.SaveOrder();
  }

  SelectNextOrderForEdit() {
    this.CurrentEditListItemIndex = 0;
    this.CurrentEditListItemIndex = this.SalesOrderforEdit.findIndex(x => x.OrderId === this.CurrentOrderId && x.OrderType === this.CurrentOrderType);
    if (this.CurrentEditListItemIndex >= 0) {
      if (this.SalesOrderforEdit.length - 1 > this.CurrentEditListItemIndex) {
        this.CurrentEditListItemIndex = this.CurrentEditListItemIndex + 1;
        this.BindOrderDetails(Number(this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderId), this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderType, this.SalesOrderforEdit[this.CurrentEditListItemIndex]);
        this.CurrentOrderId = this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderId;
        this.CurrentOrderType = this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderType;

      }
      this.EnableDisableEditNextOrderBtn(this.CurrentEditListItemIndex);
    }
  }

  EnableDisableEditNextOrderBtn(index: number) {
    if (index >= this.SalesOrderforEdit.length - 1) {
      //diseble
      this.isEditNextOrder = true;
    }
    else {
      //enable
      this.isEditNextOrder = false;
    }
  }

  OrderTypeEnableDisable(IsDisable: boolean = false) {
    this.settingsOrderType = {
      singleSelection: true,
      text: "Select Order Type",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      disabled: IsDisable,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };

  }

  OrderStatusEnableDisable(IsDisable: boolean = false) {
    this.settingsOrderStatus = {
      singleSelection: true,
      text: "Select Order Status",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      disabled: IsDisable,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };

  }


  multiselectSetting() {
    this.OrderTypeEnableDisable(false);
    this.OrderStatusEnableDisable(false);

    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      this.ShipToLocationEnableDisable(true);
    else
      this.settings = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: false,
        labelKey: 'name', searchBy: ['name']
      };
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      this.EquipEnableDisable(true);
    else
      this.settingsEquip = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        disabled: false,
        badgeShowLimit: 1,
        labelKey: 'name',
        searchBy: ['name']
      };
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      this.CarrierEnableDisable(true);
    else
      this.settingsCarrier = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: false,
        labelKey: 'name',
        searchBy: ['name']
      };
    this.settingsMaterial = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };

    this.settingsAdjustShippingMaterial = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };
    this.settingsAdjustCharges = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };

    this.settingsAdjustChargesSectionCharge = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      this.ShipFromToEnableDisable(true);
    else
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: false,
        labelKey: 'name',
        searchBy: ['name']
      };
  }

  GetCarrier() {
    this.selectedCarrierItems = [];
    let ordercode = this.OrderTypeData.find(d => d.id === Number(this.OrderTypeId))?.code;
    if (ordercode == "CPUOrder") {
      this.orderManagement.CarrierId = this.CarrierData.find(f => f.code == 'CPU1')?.id;
      this.SCarrierId = this.orderManagement.CarrierId;
      this.orderManagement.carierName = this.CarrierData.find(f => f.code == 'CPU1')?.name;
      this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "name": this.orderManagement.carierName });
    }
    else if (ordercode != "CPUOrder") {

      this.orderManagement.CarrierId = this.CarrierData.find(f => f.code == 'Transplace')?.id;
      this.SCarrierId = this.orderManagement.CarrierId;
      this.orderManagement.carierName = this.CarrierData.find(f => f.code == 'Transplace')?.name;
      this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "name": this.orderManagement.carierName });
    }
  }


  //changes 
  ChangeShiptoLocationEditValidation() {

    if (this.orderManagement.Id != undefined && this.orderManagement.Id > 0) {
      if (this.IsCPUOrder || this.IsCustomer) {
        if (this.IsOpenOrderNeedsToBeCompleted == true) {

          if (Number(this.orderManagement.ToLocationId) === Number(this.SelectedSalesOrdersforEdit.ToLocationId)) {
            this.orderManagement.PurchaseOrderNumber = this.SelectedSalesOrdersforEdit.PurchaseOrderNumber;
            this.orderManagement.PickupApplointment = this.SelectedSalesOrdersforEdit.PickupApplointment;
            this.orderManagement.DeliveryAppointment = this.SelectedSalesOrdersforEdit.DeliveryAppointment;
          }
          else {
            this.orderManagement.PurchaseOrderNumber = '';
            this.orderManagement.PickupApplointment = null;
            this.orderManagement.DeliveryAppointment = null;
          }

          if (this.IsCPUOrder) {
            this.settingsCarrier = {
              singleSelection: true,
              text: "Select",
              enableSearchFilter: true,
              addNewItemOnFilter: false,
              badgeShowLimit: 1,
              disabled: true,
              labelKey: 'name',
              searchBy: ['name']
            };
          }
        }
        else if (this.IsAssignedTOShipment == true) {
          if (Number(this.orderManagement.ToLocationId) === Number(this.SelectedSalesOrdersforEdit.ToLocationId)) {
            this.orderManagement.PurchaseOrderNumber = this.SelectedSalesOrdersforEdit.PurchaseOrderNumber;
            this.orderManagement.PickupApplointment = this.SelectedSalesOrdersforEdit.PickupApplointment;
            this.orderManagement.DeliveryAppointment = this.SelectedSalesOrdersforEdit.DeliveryAppointment;
          }
          else {
            this.orderManagement.PurchaseOrderNumber = '';
            this.orderManagement.PickupApplointment = null;
            this.orderManagement.DeliveryAppointment = null;
          }
          if (this.IsCPUOrder) {
            this.settingsCarrier = {
              singleSelection: true,
              text: "Select",
              enableSearchFilter: true,
              addNewItemOnFilter: false,
              badgeShowLimit: 1,
              disabled: true,
              labelKey: 'name',
              searchBy: ['name']
            };
          }
        }


      }
    }
  }

  ChangeShipTOLocationEditForStockTransfer() {

    if (Number(this.orderManagement.ToLocationId) != Number(this.SelectedSalesOrdersforEdit.ToLocationId)) {
      if (this.IsOpenOrderNeedsToBeCompleted) {
        this.isPONumber = false;
        // this.orderManagement.PurchaseOrderNumber = "";
        this.IsAppointment = false
        this.orderManagement.PickupApplointment = null;
        this.orderManagement.DeliveryAppointment = null;

      }
      else if (this.IsAssignedTOShipment) {

      }
    }
    else {
      this.orderManagement.PurchaseOrderNumber = this.SelectedSalesOrdersforEdit.PurchaseOrderNumber;

      this.orderManagement.PickupApplointment = this.SelectedSalesOrdersforEdit.PickupApplointment;
      this.orderManagement.DeliveryAppointment = this.SelectedSalesOrdersforEdit.DeliveryAppointment;
    }

  }

  ConvertMoneyToDecimalPreferences(value: number = 0) {
    var result: number = 0;
    if (value != undefined)
      return value.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    else
      return result.toFixed(this.decimalPreferences).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    //if (value != undefined)
    //  return formatter.format(Number(parseFloat(value.toString()).toFixed(this.decimalPreferences)));
    //else
    //  return formatter.format(Number(result.toFixed(this.decimalPreferences)));
  }



  FilterAdjustmentChargeSectionCharges() {

    if ((this.orderManagement.ToContractId == undefined || this.orderManagement.ToContractId == 0) && this.SelectedCountryCode == undefined && this.SelectedContactCountryCode == undefined)
      return false;

    var isContractExport: boolean = false;
    if (this.orderManagement.ToContractId != undefined && this.orderManagement.ToContractId > 0) {
      var selectedContract = this.ToContractlist.find(x => x.id == Number(this.orderManagement.ToContractId))?.contractType;

      if (selectedContract != undefined && selectedContract != null && selectedContract.indexOf('Export') != -1) {
        isContractExport = true;
      }
    }

    if (!isContractExport) {
      if ((this.SelectedContactCountryCode != 'USA' && this.SelectedContactCountryCode != undefined) || (this.SelectedCountryCode != 'USA' && this.SelectedCountryCode != undefined)) {
        isContractExport = true;
      }
    }

    this.ChargeData = [];
    if (isContractExport) {

      this.RawChargeData.forEach((x, i) => {
        if ((x.exportOnly == true || x.domesticExportBoth == true) && x.domesticOnly == false) {
          this.ChargeData.push(x);
        }
      });

    }
    else {

      this.RawChargeData.forEach((x, i) => {
        if ((x.domesticOnly == true || x.domesticExportBoth == true) && x.exportOnly == false) {
          this.ChargeData.push(x);
        }
      });


    }

  }

  AdjustEditMaterial(id: number) {
    if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
      return;

    this.selectedAdjustShippingItems = [];
    this.AdjustShippingEditFlag = true;

    this.TempDataShippingMaterial = this.ShippingMaterialDetails.find(f => f.materialID == id);
    var cal3 = Math.ceil((this.IsShipment ? Number(this.TempDataShippingMaterial.shippedQuantity) : Number(this.TempDataShippingMaterial.quantity)) / this.TempDataShippingMaterial.propertyValue);

    //var cal3 = Math.ceil(Number(this.TempDataShippingMaterial.quantity) / this.TempDataShippingMaterial.propertyValue);
    if (this.SelectMaterialData.code == "F23") {
      this.TempPalates = Number(cal3 * 2);
    }
    else {
      this.TempPalates = Number(cal3);
    }
    this.SelectAddjustMaterial = this.TempDataShippingMaterial.materialID;
    //var getAddjustmaterial = this.MaterialDataForAdjustShipping.find(f => f.id == this.SelectAddjustMaterial);
    var getAddjustmaterial = this.MaterialDataBackup.find(f => f.id == this.SelectAddjustMaterial);
    this.selectedAdjustShippingItems.push({ "id": this.SelectAddjustMaterial, "name": getAddjustmaterial.name });
    //this.selectedAdjustShippingItems.push({ "id": this.SelectAddjustMaterial, "name": getAddjustmaterial.name });
    if (this.IsShipment) {
      this.AQuantity = this.TempDataShippingMaterial.shippedQuantity;
    }
    else {
      this.AQuantity = this.TempDataShippingMaterial.quantity;
    }

    this.ShippingSelectUOM = this.TempDataShippingMaterial.uomcode;
    //this.refershMaterial(this.ShippingMaterialDetails);
  }

  modifyAdjustShippingMaterialGrid() {
    this.selectedAdjustShippingItems = [];
    if (this.AdjustShippingEditFlag == true) {
      //edit
      this.EditShippingMaterialMaterial();
      this.ResetAdjustShipingMaterial();
    } else {
      //add
      this.AddAdjustMaterial();
      this.AdjustShippingEditFlag = false;
      this.ResetAdjustShipingMaterial();
    }

  }

  ResetAdjustShipingMaterial() {
    this.AdjustShippingEditFlag = false;
    this.SelectAddjustMaterial = 0;
    this.AQuantity = "";
    this.ShippingSelectUOM = "";
    this.settingsAdjustShippingMaterial = [];
  }

  EditShippingMaterialMaterial() {
    if (Number(this.AQuantity) <= 0 || (Number(this.AQuantity) % 1) != 0) {
      //this.toastrService.error('Please enter a valid quantity');
      var messagesData = this.AllToasterMessage.find(x => x.code == 'InvalidQuantityFormat')?.message1;
      this.toastrService.error(messagesData);
      return false;
    }

    var PelletQty = 0;
    var k = 0;
    for (k; k < this.ShippingMaterialDetails.length; k++) {
      if (this.ShippingMaterialDetails[k].flag == 0) {
        //&& this.ShippingMaterialDetails[k].name == "WW-PALLET"

        PelletQty = (this.IsShipment ? Number(this.ShippingMaterialDetails[k].shippedQuantity + Number(this.TempDataShippingMaterial.shippedQuantity)) : Number(this.ShippingMaterialDetails[k].quantity) + Number(this.TempDataShippingMaterial.quantity));
      }
    }

    if (Number(this.AQuantity) > PelletQty) {
      this.toastrService.error('Quantity can not be greater then Pellet Quantity.');
      return;
    }

    for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
      if (this.ShippingMaterialDetails[i].materialID == this.SelectAddjustMaterial) {

        if (this.IsShipment) {
          this.ShippingMaterialDetails[i].shippedQuantity = Number(this.AQuantity);
          this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.AQuantity));
        }
        else {
          this.ShippingMaterialDetails[i].quantity = Number(this.AQuantity);
          this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.AQuantity));
        }

      }
    }

    if (this.IsShipment) {

      this.ShippingMaterialDetails.map((todo, i) => {
        if (todo.flag == 0) {
          this.ShippingMaterialDetails[i].shippedQuantity = Number(PelletQty) - Number(this.AQuantity);
          this.ShippingMaterialDetails[i].displayShippedQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].shippedQuantity));
        }
      });
    }
    else {
      this.ShippingMaterialDetails.map((todo, i) => {
        if (todo.flag == 0) {
          this.ShippingMaterialDetails[i].quantity = Number(PelletQty) - Number(this.AQuantity);
          this.ShippingMaterialDetails[i].displayQuantity = formatter.format(Number(this.ShippingMaterialDetails[i].quantity));
        }
      });
    }

    this.removeZeroValuePallet();
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetailForUI)
    //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails);
    // this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
    this.copyMaterialAndShippingMaterialForCharges();
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    //this.refershMaterial(this.ShippingMaterialDetails);
    this.toastrService.info('Material quantity updated successfully.');
    return true;

  }

  async bindDataForFromLocationContractRelated() {


    console.log("selected equipment ")

    if (this.SelectEquipment == undefined) {
      console.log("undefined select equipmnet");
      console.log(new Date());
      await this.sleepExecution(1000);
      console.log("waiting complete");
      console.log(new Date());
    }

    // var equipmentSelected = setInterval(() => {

    if (this.SelectEquipment != undefined && this.SelectEquipment != null) {
      // clearInterval(equipmentSelected);
      //if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {

      //  if ( !this.isLocationChangeByUser &&  !(this.IsShippedAndUnderReview || this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS)) {
      //await this.LocationMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);

      //await this.LocationShippingMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
      //}
      //}
      await this.LocationAllMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);

      if (!this.isStockTransfer) {
        if (!!!this.orderManagement.RequestedDeliveryDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.FromLocationId) {
          return false;
        }
      }
      else if (this.isStockTransfer) {
        if (!!!this.orderManagement.ScheduledShipDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.FromLocationId) {
          return false;
        }
      }

      var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

      //this.Tocontract(this.orderManagement.ToLocationId, selectedDate, this.OrderTypeId);

      this.Fromcontract(this.orderManagement.FromLocationId, selectedDate, this.OrderTypeId);



    }

    //}, 50);

  }





  ChangeShipFromLocationEditValidation() {

    if (this.orderManagement.Id != undefined && this.orderManagement.Id > 0) {
      if (this.IsCustomerReturn) {
        if (this.IsOpenOrderNeedsToBeCompleted == true) {

          if (Number(this.orderManagement.FromLocationId) === Number(this.SelectedSalesOrdersforEdit.FromLocationId)) {
            this.orderManagement.PurchaseOrderNumber = this.SelectedSalesOrdersforEdit.PurchaseOrderNumber;
            this.orderManagement.PickupApplointment = this.SelectedSalesOrdersforEdit.PickupApplointment;
            this.orderManagement.DeliveryAppointment = this.SelectedSalesOrdersforEdit.DeliveryAppointment;
          }
          else {
            //this.orderManagement.PurchaseOrderNumber = '';
            this.orderManagement.PickupApplointment = null;
            this.orderManagement.DeliveryAppointment = null;
          }
          if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
            this.CarrierEnableDisable(true);
          else
            this.settingsCarrier = {
              singleSelection: true,
              text: "Select",
              enableSearchFilter: true,
              addNewItemOnFilter: false,
              badgeShowLimit: 1,
              disabled: false,
              labelKey: 'name',
              searchBy: ['name']
            };
        }
        else if (this.IsAssignedTOShipment == true) {
          if (Number(this.orderManagement.FromLocationId) === Number(this.SelectedSalesOrdersforEdit.FromLocationId)) {
            this.orderManagement.PurchaseOrderNumber = this.SelectedSalesOrdersforEdit.PurchaseOrderNumber;
            this.orderManagement.PickupApplointment = this.SelectedSalesOrdersforEdit.PickupApplointment;
            this.orderManagement.DeliveryAppointment = this.SelectedSalesOrdersforEdit.DeliveryAppointment;
          }
          else {
            // this.orderManagement.PurchaseOrderNumber = '';
            //this.orderManagement.PickupApplointment = null;
            //this.orderManagement.DeliveryAppointment = null;
          }
          if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
            this.CarrierEnableDisable(true);
          else
            this.settingsCarrier = {
              singleSelection: true,
              text: "Select",
              enableSearchFilter: true,
              addNewItemOnFilter: false,
              badgeShowLimit: 1,
              disabled: false,
              labelKey: 'name',
              searchBy: ['name']
            };
        }
      }
    }
  }


  resetValidationCss() {
    //if (document.getElementById('EquipmentType') != undefined && document.getElementById('EquipmentType') != null) { document.getElementById('EquipmentType').setAttribute('required', null); }
    //if (document.getElementById('PONumber') != undefined && document.getElementById('PONumber') != null) { document.getElementById('PONumber').setAttribute('required', null); }

    if (!this.IsStockTransfer) {
      this.IsRRequired = true;
      this.IsSRequired = false;
    }
    else {
      this.IsRRequired = false;
      this.IsSRequired = true;
    }
    if (this.IsCustomerReturn || this.IsStockTransfer || this.IsCollections || this.IsCustomerToCustomer) {
      if (document.getElementById('ShipFromType') != undefined && document.getElementById('ShipFromType') != null) { document.getElementById('ShipFromType').setAttribute('required', null); }
      if (document.getElementById('ShipFrom') != undefined && document.getElementById('ShipFrom') != null) { document.getElementById('ShipFrom').setAttribute('required', null); }
    }
    else {
      if (document.getElementById('ShipFromType') != undefined && document.getElementById('ShipFromType') != null) { document.getElementById('ShipFromType').removeAttribute('required'); }
      if (document.getElementById('ShipFrom') != undefined && document.getElementById('ShipFrom') != null) { document.getElementById('ShipFrom').removeAttribute('required'); }
      if (document.getElementById('ShipTotype') != undefined && document.getElementById('ShipTotype') != null) { document.getElementById('ShipTotype').setAttribute('required', null); }
      if (document.getElementById('ShipTo') != undefined && document.getElementById('ShipTo') != null) { document.getElementById('ShipTo').setAttribute('required', null); }
    }

    if (this.IsChargeOrder) {
      //Ship From Type/ Ship To type, Ship From Location/Ship To Location, RD date and Charge required only
      if (document.getElementById('ShipFromType') != undefined && document.getElementById('ShipFromType') != null) { document.getElementById('ShipFromType').setAttribute('required', null); }
      if (document.getElementById('ShipTotype') != undefined && document.getElementById('ShipTotype') != null) { document.getElementById('ShipFromType').setAttribute('required', null); }
      if (document.getElementById('ShipFrom') != undefined && document.getElementById('ShipFrom') != null) { document.getElementById('ShipFrom').setAttribute('required', null); }
      if (document.getElementById('ShipTo') != undefined && document.getElementById('ShipTo') != null) { document.getElementById('ShipFrom').setAttribute('required', null); }
      //this.isPONumber = false;
      //document.getElementById('EquipmentType').removeAttribute('required');
      //document.getElementById('PONumber').removeAttribute('required');

    }


    console.log("required css apply");
  }

  OrderConditionList() {
    this.orderManagementService.OrderConditionList()
      .subscribe(
        data => {
          this.OrderConditionDataList = data.data;
          console.log("order condition bind");
        });
  }
  public CheckStatusForSendtoMassArr: any = [];
  public CheckStatusForReSendtoMassArr: any = [];

  CheckStatusForSendtoMass(strOrdernumber: string, Ordertype: string) {
    this.orderManagementService.SalesOrderSendToMass = [];
    this.CheckStatusForSendtoMassArr = [];
    this.orderManagementService.GetCheckStatusForSendtoMass(strOrdernumber,
      Ordertype).subscribe(result => {
        var datas = result.data;
        this.CheckStatusForSendtoMassArr.push({ OrderID: strOrdernumber, Ordertype: Ordertype, Result: datas.result });
        let finddata = this.CheckStatusForSendtoMassArr.find(x => x.Result == 0);
        if (!!finddata) {
          {
            console.log("approveAndMas disable 2 R");
            this.buttonBar.disableAction('approveAndMas');
          }

          //to enable approveAndMas button without any condition
          if (this.IsChargeOrder && this.orderManagement.OrderStatusCode.trim() == 'UnderReview') {
            if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
              console.log("approveAndMas enable 1 R");
              this.buttonBar.enableAction('approveAndMas');
              let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
              this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
            }
          }
        }
        else if (this.IsChargeOrder && this.orderManagement.OrderStatusCode.trim() == 'UnderReview') {
          if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
            console.log("approveAndMas enable 2 R");
            this.buttonBar.enableAction('approveAndMas');
            let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
            this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
          }
        }
        else if (!!this.CheckStatusForSendtoMassArr && this.CheckStatusForSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
          console.log("approveAndMas enable 3 R");
          this.buttonBar.enableAction('approveAndMas');
          let checkStatusForSendtoMassArrData = this.CheckStatusForSendtoMassArr.filter(x => x.Result == 1);
          this.orderManagementService.SalesOrderSendToMass = checkStatusForSendtoMassArrData;
        }
        else {
          console.log("approveAndMas disable 3 R");
          this.buttonBar.disableAction('approveAndMas');
        }

        console.log("check send to mas condition");
      });
  }

  CheckStatusResendtoMass(strOrdernumber: string, Ordertype: string) {
    this.orderManagementService.SalesOrderReSendToMass = [];
    this.CheckStatusForReSendtoMassArr = [];
    this.orderManagementService.GetCheckStatusReSendtoMass(strOrdernumber,
      Ordertype).subscribe(result => {
        var datas = result.data;
        this.CheckStatusForReSendtoMassArr.push({ OrderID: strOrdernumber, Ordertype: Ordertype, Result: datas.result });
        let finddata = this.CheckStatusForReSendtoMassArr.find(x => x.Result == 0);
        if (!!finddata) {
          this.buttonBar.disableAction('resendToMas');
        }
        else if (!!this.CheckStatusForReSendtoMassArr && this.CheckStatusForReSendtoMassArr.length > 0 && this.isReadAndModifyForBtn) {
          this.buttonBar.enableAction('resendToMas');
          let checkStatusForReSendtoMassArrData = this.CheckStatusForReSendtoMassArr.filter(x => x.Result == 1);
          this.orderManagementService.SalesOrderReSendToMass = checkStatusForReSendtoMassArrData;
        } else {
          this.buttonBar.disableAction('resendToMas');
        }


      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  decimalnumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else if (charCode == 46) {
      return false;
    }
    return true;
  }

  EditOrderToLocation() {
    if (this.IsCustomer || this.IsCPUOrder || this.IsCustomerToCustomer || this.IsChargeOrder || this.IsCollections || this.IsStockTransfer) {
      this.bindDataForToLocationContractRelated();
    }
    else if (this.IsCustomerReturn) {
      this.bindDataForFromLocationContractRelated();

    }
  }


  refershMaterial(data: any = []) {
    if (!!data) {
      if (!!this.MaterialDataForAdjustShipping) {
        data.filter(item => {
          let index = this.MaterialDataForAdjustShipping.findIndex(x => x.id == item.materialID && item.materialID != Number(this.SelectAddjustMaterial));
          if (index > -1) {
            this.MaterialDataForAdjustShipping.splice(index, 1);
          }
        });
      }
    }
  }

  handleSendForShippingOrderCondition(currentOrderID: number, currentOrderType: string) {

    if (this.SalesOrderforEdit.length > 1) {
      var index = this.SalesOrderforEdit.findIndex(x => Number(x.OrderId) == Number(currentOrderID) && x.OrderType === currentOrderType);

      if (index > -1 && index < this.SalesOrderforEdit.length - 1) {
        this.SalesOrderforEdit.splice(index, 1);
        // var indexGlobal = this.orderManagementService.SalesOrderforEdit.findIndex(x => Number(x.OrderId) && x.OrderType === currentOrderType);
        // if (indexGlobal >= 0) { this.orderManagementService.SalesOrderforEdit.splice(indexGlobal, 1); }
        if (index >= 0) {
          this.BindOrderDetails(Number(this.SalesOrderforEdit[index].OrderId), this.SalesOrderforEdit[index].OrderType, this.SalesOrderforEdit[index]);
          this.CurrentOrderId = this.SalesOrderforEdit[index].OrderId;
          this.CurrentOrderType = this.SalesOrderforEdit[index].OrderType;
          this.EnableDisableEditNextOrderBtn(index);
        }

      }
      else {
        this.SalesOrderforEdit.splice(0, this.SalesOrderforEdit.length);
        this.closeRegular.emit();

      }
    }
    else {
      this.closeRegular.emit();
    }

  }

  resetValidationCssStatus() {
    if (this.IsSendforShipping) {
      document.getElementById('ShipFromType').setAttribute('required', null);
      document.getElementById('ShipFrom').setAttribute('required', null);
    }
    else {
      document.getElementById('ShipFromType').removeAttribute('required');
      document.getElementById('ShipFrom').removeAttribute('required');
    }
  }

  verifyLocationStatus() {

    if (this.orderManagement.ToLocationId == undefined && this.orderManagement.ToLocationId == 0 && this.orderManagement.FromLocationId == undefined && this.orderManagement.FromLocationId == 0)
      return false;

    var locationObject = {

      TolocationID: this.orderManagement.ToLocationId,
      IsValidToLocation: false,
      FromlocationID: this.orderManagement.FromLocationId,
      IsValidFromLocation: false
    };

    this.orderManagementService.verifySavedLocation(locationObject).subscribe((result) => {

      if (result.data != null && result.data != undefined) {
        if (result.data.isValidToLocation && result.data.isValidFromLocation) return;
        this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });

        var msg = "";

        if (result.data.isValidToLocation == false && result.data.isValidFromLocation) { msg = "Ship To location is inactive. Please make this location active."; }
        if (result.data.isValidToLocation && result.data.isValidFromLocation == false) { msg = "Ship From location is inactive. Please make this location active."; }
        if (result.data.isValidToLocation == false && result.data.isValidFromLocation == false) { msg = "Both Ship From and Ship To locations are inactive. Please make these locations active."; }

        this.modalRef.componentInstance.msg = msg;
        this.modalRef.componentInstance.isOK = true;
        this.modalRef.componentInstance.isYesNO = false;

        this.modalRef.result.then((result) => {
        }, (reason) => {
        });
      }


    });

  }


  CheckAvailableCredit() {

    var currentCredit = this.orderManagement.AvailableCredit.replace(/\,/g, '');
    if (Number(currentCredit) < 0) {
      this.IsAvailableCredit = true;
      this.AvailableCreditMessage = "Yes"
    }
    else {
      this.IsAvailableCredit = false;
      this.AvailableCreditMessage = "No"
    }


  }
  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
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
              this.regularOrderHasReadOnlyAccess = false;
              if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
                this.buttonBar.enableAction('orderCancel');
                this.buttonBar.enableAction('save');
                //this.buttonBar.enableAction('delete');
                //this.buttonBar.enableAction('copy');
                this.buttonBar.enableAction('issue');
                this.buttonBar.enableAction('saveAndNotify');
                this.buttonBar.enableAction('calculate');
                this.buttonBar.enableAction('export');
              }
              this.isReadAndModifyForBtn = true;
            }
            else {
              this.regularOrderHasReadOnlyAccess = true;
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('copy');
              this.buttonBar.disableAction('issue');
              this.buttonBar.disableAction('orderCancel');
              this.buttonBar.disableAction('save');
              this.buttonBar.disableAction('calculate');
              this.buttonBar.disableAction('export');
              this.buttonBar.disableAction('saveAndNotify');
              this.isReadAndModifyForBtn = false;
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
          this.EnableDisableCancelBtnOnSelection(this.SelectedItem);
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }




  ContractMaterial(ClientID: number, LocationID: number, ContractID: number) {

    this.orderManagementService.ContractMaterial(Number(ClientID), Number(LocationID), Number(ContractID)).pipe()
      .subscribe(
        data => {

          if (data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
              let indexs = this.MaterialData.findIndex(x => x.id == Number(data.data[i].MaterialID));
              if (indexs > -1) {
                this.MaterialData[indexs].boldFlag = Number(1);

              }
            }

            for (var i = 0; i < data.data.length; i++) {
              let indexs = this.MaterialDataForAdjustShipping.findIndex(x => x.id == Number(data.data[i].MaterialID));
              if (indexs > -1) {
                this.MaterialDataForAdjustShipping[indexs].boldFlag = Number(1);

              }
            }

            this.FilterMaterialData = [];
            this.MaterialData.forEach(val => this.FilterMaterialData.push(Object.assign({}, val)));

          }
          else {
            for (var i = 0; i < this.MaterialData.length; i++) {
              this.MaterialData[i].boldFlag = Number(0);
            }
            this.FilterMaterialData = [];
            this.MaterialData.forEach(val => this.FilterMaterialData.push(Object.assign({}, val)));

          }

          try {
            //for bold dropdown items
            for (var i = 0; i < this.MaterialData.length; i++) {
              if (this.MaterialData[i].boldFlag == 1) {
                var elems = document.querySelectorAll(".materialBold .pure-checkbox");
                elems[i].className += " active1";
              }
              else {
                var elems = document.querySelectorAll(".materialBold .pure-checkbox");
                elems[i].classList.remove('active1');
                console.log('output = ' + elems[i].className);
              }
            }

            for (var i = 0; i < this.MaterialDataForAdjustShipping.length; i++) {
              if (this.MaterialDataForAdjustShipping[i].boldFlag == 1) {
                var elems = document.querySelectorAll(".materialBold .pure-checkbox");
                elems[i].className += " active1";
              }
              else {
                var elems = document.querySelectorAll(".materialBold .pure-checkbox");
                elems[i].classList.remove('active1');
                console.log('output = ' + elems[i].className);
              }
            }

          }
          catch (e) {
            //console.log(e);
          }

        });

  }

  RemoveFromLocation() {

    if (this.IsCustomerToCustomer || this.IsStockTransfer || this.IsCollections) {


      let indexs = this.shipfromlist.findIndex(x => x.id == Number(this.orderManagement.ToLocationId));

      if (indexs > -1) {
        this.TempFromLocation = this.shipfromlist.filter(x => x.id == Number(this.orderManagement.ToLocationId));
        this.shipfromlist.splice(indexs, 1);
      }
    }
  }
  RemoveToLocation() {
    if (this.IsCustomerToCustomer || this.IsStockTransfer || this.IsCollections) {
      let indexs = this.shiptolist.findIndex(x => x.id == Number(this.orderManagement.FromLocationId));

      if (indexs > -1) {
        this.TempToLocation = this.shiptolist.filter(x => x.id == Number(this.orderManagement.FromLocationId));

        this.shiptolist.splice(indexs, 1);
      }
    }
  }

  calculateExistingOrder() {
    if (this.orderManagement == undefined || this.orderManagement.Id == undefined) {
      this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.msg = "Please open order in edit and then press calculate";
      this.modalRef.componentInstance.isOK = true;
      this.modalRef.componentInstance.isYesNO = false;
      this.modalRef.result.then((result) => { }, (reason) => {
      });
      return;
    }

    this.orderManagementService.RecalculateOrder(this.orderManagement).subscribe(result => {
      if (result.data != undefined) {
        if (result.data.isValid) {
          this.toastrService.success("Order recalculated successfully.");
          this.CurrentEditListItemIndex = 0;
          this.CurrentEditListItemIndex = this.SalesOrderforEdit.findIndex(x => x.OrderId === this.orderManagement.Id && x.OrderType === this.orderManagement.OrderTypeCode);
          this.BindOrderDetails(this.orderManagement.Id, this.orderManagement.OrderTypeCode, this.orderManagement);
        }
        else {
          this.modalRef = this.modelservice.open(confirmationpopup, { size: 'lg', backdrop: 'static' });
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
  onSearch(evt: any) {
    var uu = evt
    console.log('search');
    //for bold dropdown items
    //if (!!evt) {
    //  this.MaterialData = [];
    //  this.MaterialData = this.FilterMaterialData.filter(function (d) {
    //    return d.name.toLowerCase().includes(evt.toLowerCase().trim());
    //  });
    //}
    //else {
    //  this.MaterialData = [];
    //  this.FilterMaterialData.forEach(val => this.MaterialData.push(Object.assign({}, val)));
    //}

    //for (var i = 0; i < this.MaterialData.length; i++) {
    //  if (this.MaterialData[i].boldFlag == 1) {
    //    var elems = document.querySelectorAll(".materialBold .pure-checkbox");

    //    elems[i].className += " active1";
    //    console.log('output = ' + elems[i].className);
    //  }
    //  else {
    //    var elems = document.querySelectorAll(".materialBold .pure-checkbox");
    //    elems[i].classList.remove('active1');
    //    console.log('output = ' + elems[i].className);
    //  }

    //}
  }

  setDateMMddyyyy(date: Date) {

    return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  }

  DisabedLocation() {
    var str = this.OrderNumber;
    var OrderNumberType = str.substring(0, 4);

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsCustomer) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsCPUOrder) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsCustomerReturn) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = true;
      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };
    }

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsStockTransfer) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = true;
      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };
    }

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsCollections) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = true;
      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };
    }

    if ((this.IsShippedInventoryAndARChargesSentToMAS && this.IsChargeOrder) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = true;
      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };
    }

    // check Under review

    if ((this.IsShippedAndUnderReview && this.IsCustomer) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsShippedAndUnderReview && this.IsCPUOrder) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsShippedAndUnderReview && this.IsCustomerReturn && OrderNumberType) && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) >= 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false;
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsAssignedTOShipment && this.IsCustomer && OrderNumberType == 'CTOC') && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) == 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = false
      if (this.isTruckOrderNotUsed || this.isOrderSentToMAS || this.isChargeOrderSentToMAS)
        this.ShipToLocationEnableDisable(true);
      else
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name',
          searchBy: ['name']
        };
    }

    if ((this.IsAssignedTOShipment && this.IsCustomerReturn && OrderNumberType == 'CTOC') && (Number(this.SelectedSalesOrdersforEdit.OrderVersionNumber) == 0)) {

      this.IsShipFromType = true;
      this.settingsShipFromTo = {
        singleSelection: true,
        text: "Select",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };

      this.IsShipToType = true
      this.settings = {
        singleSelection: true,
        text: "Select Location",
        enableSearchFilter: true,
        addNewItemOnFilter: false,
        badgeShowLimit: 1,
        disabled: true,
        labelKey: 'name',
        searchBy: ['name']
      };
    }
  }



  SaveAndNotify() {
    this.SaveAndNotifyHit = true;
    this.SaveOrder();
  }

  ResetBoldMaterial() {
    this.MaterialData = [];
    this.FilterMaterialData.forEach(val => this.MaterialData.push(Object.assign({}, val)));
    try {
      for (var i = 0; i < this.MaterialData.length; i++) {
        if (this.MaterialData[i].boldFlag == 1) {
          var elems = document.querySelectorAll(".materialBold .pure-checkbox");

          elems[i].className += " active1";
          console.log('output = ' + elems[i].className);
        }
        else {
          var elems = document.querySelectorAll(".materialBold .pure-checkbox");
          elems[i].classList.remove('active1');
        }

      }

      this.ref.detectChanges()
    } catch (e) {
      //console.log(e);
    }
  }
  CancelOrder() {
    var tab = "";
    if (this.OrderType.trim().toLowerCase() == "stock transfer" || this.OrderType.trim().toLowerCase() == "collections")
      tab = "inbound";
    else
      tab = "outbound";

    this.orderManagementService.CancelOrder(this.SelectedOrderId, tab).subscribe(data => {
      if (data.message == "Success") {
        //var messages = 'OrderCancelSuccessfully';
        //if (this.AllToasterMessage != undefined) {
        //  var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
        //  this.toastrService.success(messagesData);
        //}
        this.toastrService.success("Order Cancel successfully.");

        this.BindOrderDetails(Number(this.SelectedOrderId), this.OrderType, this.SelectedItem);
      }
    });
  }
  EnableDisableCancelBtnOnSelection(row) {
    this.buttonBar.disableAction('orderCancel');
    //if (row == null && row == "" && row == undefined && this.isReadAndModifyForBtn) {
    //  this.buttonBar.enableAction('orderCancel');
    //}
    //else {
    var isCancelAllowCount = 0;
    //this.buttonBar.disableAction('orderCancel');

    if ((row.Status == 'Open Order Needs To Be Completed' || row.Status == 'Accounting Hold' || row.Status == 'Over Credit Limit')
      && (row.OrderCondition == 'New Order') && row.ShipmentId == null && this.isReadAndModifyForBtn && !this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
      //enable cancel btn
      this.buttonBar.enableAction('orderCancel');
      isCancelAllowCount = isCancelAllowCount + 1;
    }
    else if ((row.Status == 'Assigned To Shipment') && (row.OrderCondition == 'Shipment Planning')
      && (row.ShipmentStatus == 'Open Shipment Needs to be Completed') && (row.ShipmentCondition == 'Tendered')
      && this.isReadAndModifyForBtn && !this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
      //enable cancel btn
      this.buttonBar.enableAction('orderCancel');
      isCancelAllowCount = isCancelAllowCount + 1;
    }
    else if ((row.Status == 'Assigned To Shipment') && this.isReadAndModifyForBtn && !this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
      //enable cancel btn
      this.buttonBar.enableAction('orderCancel');
      isCancelAllowCount = isCancelAllowCount + 1;
    }

    // }
  }

  ShipFromToEnableDisable(IsDisable: boolean = false) {
    this.settingsShipFromTo = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };

  }

  CarrierEnableDisable(IsDisable: boolean = false) {
    this.settingsCarrier = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }
  EquipEnableDisable(IsDisable: boolean = false) {
    this.settingsEquip = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      disabled: IsDisable,
      badgeShowLimit: 1,
      labelKey: 'name',
      searchBy: ['name']
    };
  }

  ShipToLocationEnableDisable(IsDisable: boolean = false) {
    this.settings = {
      singleSelection: true,
      text: "Select Location",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }
  MaterialEnableDisable(IsDisable: boolean = false) {
    this.settingsMaterial = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }
  AdjustShippingMaterialEnableDisable(IsDisable: boolean = false) {
    this.settingsAdjustShippingMaterial = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }
  AdjustChargesEnableDisable(IsDisable: boolean = false) {
    this.settingsAdjustCharges = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }
  AdjustChargesSectionChargeEnableDisable(IsDisable: boolean = false) {
    this.settingsAdjustChargesSectionCharge = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: IsDisable,
      labelKey: 'name',
      searchBy: ['name']
    };
  }

  EnableDisableAllFieldsOnOrderCondition(isDisable: boolean = false) {
    //disable Truck Order Not Used
    this.OrderTypeEnableDisable(isDisable);
    this.OrderStatusEnableDisable(isDisable);
    this.ShipFromToEnableDisable(isDisable);
    this.CarrierEnableDisable(isDisable);
    this.EquipEnableDisable(isDisable);
    this.ShipToLocationEnableDisable(isDisable);
    this.MaterialEnableDisable(isDisable);
    this.AdjustShippingMaterialEnableDisable(isDisable);
    this.AdjustChargesEnableDisable(isDisable);
    this.AdjustChargesSectionChargeEnableDisable(isDisable);

    if (isDisable) {
      this.buttonBar.disableAction('save');
      this.buttonBar.disableAction('saveAndNotify');
      this.buttonBar.disableAction('delete');
      this.buttonBar.disableAction('orderCancel');
      console.log("approveAndMas disable 4 R");
      this.buttonBar.disableAction('approveAndMas');
      this.buttonBar.disableAction('resendToMas');
      this.buttonBar.disableAction('calculate');
      this.buttonBar.disableAction('shipWith');
      this.buttonBar.disableAction('export');
    }
    if (!isDisable) {
      this.buttonBar.enableAction('save');
      this.buttonBar.enableAction('calculate');
      this.buttonBar.enableAction('export');
    }
  }

  EnableDisableAllFieldsOnOrderStatusForStock() {
    //Disable
    this.OrderTypeEnableDisable(this.isOrderSentToMAS);
    this.OrderStatusEnableDisable(this.isOrderSentToMAS);
    this.ShipFromToEnableDisable(this.isOrderSentToMAS);
    this.CarrierEnableDisable(this.isOrderSentToMAS);
    this.EquipEnableDisable(this.isOrderSentToMAS);
    this.ShipToLocationEnableDisable(this.isOrderSentToMAS);
    this.MaterialEnableDisable(this.isOrderSentToMAS);
    this.AdjustShippingMaterialEnableDisable(this.isOrderSentToMAS);
    this.AdjustChargesEnableDisable(this.isOrderSentToMAS);
    this.AdjustChargesSectionChargeEnableDisable(this.isOrderSentToMAS);

    this.buttonBar.disableAction('save');
    this.buttonBar.disableAction('saveAndNotify');
    this.buttonBar.disableAction('delete');
    this.buttonBar.disableAction('orderCancel');
    console.log("approveAndMas disable 5 R");
    this.buttonBar.disableAction('approveAndMas');
    this.buttonBar.disableAction('resendToMas');
    this.buttonBar.disableAction('calculate');
    //this.buttonBar.disableAction('shipWith');
    this.buttonBar.disableAction('export');

    if (!this.isOrderSentToMAS) {
      this.buttonBar.enableAction('save');
      this.buttonBar.enableAction('calculate');
      this.buttonBar.enableAction('export');
    }
  }

  SendARChargesTOMAS() {
    console.log("SendARChargesTOMAS on ragularOrder screen start  R");
    this.orderManagementService.ApproveAndSendTOMAS(this.SelectedOrderId, this.OrderType).subscribe(data => {
      console.log("RequestHasBeenSendToMASSuccessfully success return on ragularOrder screen  R");
      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
        var messages = 'RequestHasBeenSendToMASSuccessfully';
        if (this.AllToasterMessage != undefined) {
          var messagesData = this.AllToasterMessage.find(x => x.code == messages)?.message1;
          this.toastrService.success(messagesData);
        }

        console.log("RequestHasBeenSendToMASSuccessfully on ragularOrder screen start  R");

        if (this.SalesOrderforEdit.length > 1) {
          var index = this.SalesOrderforEdit.findIndex(x => Number(x.OrderId) == Number(this.orderManagement.Id) && x.OrderTypeId === Number(this.orderManagement.OrderTypeId));

          if (index == (this.SalesOrderforEdit.length - 1)) {
            this.SalesOrderforEdit.splice(index, 1);
            index = 0;
          }
          else {
            this.SalesOrderforEdit.splice(index, 1);
          }
          var OrderID = Number(this.SalesOrderforEdit[index].OrderId);
          var OrderTypeID = this.SalesOrderforEdit[index].OrderType;

          console.log("BindOrderDetails on ragularOrder screen  R");
          this.BindOrderDetails(OrderID, OrderTypeID, this.SalesOrderforEdit[index]);
        }
        else if (this.SalesOrderforEdit.length == 1) {
          this.SalesOrderforEdit.splice(0, this.SalesOrderforEdit.length);
          this.closeRegular.emit();
        }
        else {
          this.closeRegular.emit();
        }

        console.log("RequestHasBeenSendToMASSuccessfully on ragularOrder screen end  R");

      }
    });
    console.log("SendARChargesTOMAS on ragularOrder screen end  R");
  }

  async freezOrder(OrderCondition: string, OrderType: string, Status: string) {
    //Disable all the fields and buttons on edit screen if order type is "Truck Order Not Used" for all customer and stock "22287"
    this.isTruckOrderNotUsed = false;
    if (OrderCondition != undefined && (OrderCondition.trim() == "Truck Order Not Used" || OrderCondition.trim() == "TruckOrderNotUsed")) {
      //disable
      this.isTruckOrderNotUsed = true;
      this.EnableDisableAllFieldsOnOrderCondition(true);
    } else {
      //enable
      this.isTruckOrderNotUsed = false;
      this.EnableDisableAllFieldsOnOrderCondition(false);
    }

    //To freeze order that are status as "TransferOrderShippedandInventorySentToMAS" for stock and collection only "22288"
    this.isOrderSentToMAS = false;
    if ((OrderType.trim() == "Stock Transfer" || OrderType.trim() == "Collections" || OrderType.trim() == "StockTransfer") && (Status.trim() == "Shipped Inventory And AR Charges Sent To MAS" || Status.trim() == "ShippedInventoryAndARChargesSentToMAS")) {
      //disable
      this.isOrderSentToMAS = true;
      this.EnableDisableAllFieldsOnOrderStatusForStock();
    }
    else {
      //enable
      if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
        this.isOrderSentToMAS = false;
        this.EnableDisableAllFieldsOnOrderStatusForStock();
      }
    }
    //Disable every thing if Order type is Charge Order and AR charges send to mas done (ShippedInventoryAndARChargesSentToMAS)
    this.isChargeOrderSentToMAS = false;
    if ((OrderType.trim() == "Credit Charge Order" || OrderType.trim() == "Charge Order" || OrderType.trim() == "ChargeOrder") && (Status.trim() == "Shipped Inventory And AR Charges Sent To MAS" || Status.trim() == "ShippedInventoryAndARChargesSentToMAS")) {
      //disable
      this.isChargeOrderSentToMAS = true;
      this.EnableDisableAllFieldsOnOrderCondition(true);
    }
    else {
      //enable
      if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS) {
        this.isChargeOrderSentToMAS = false;
        this.EnableDisableAllFieldsOnOrderCondition(false);
      }
    }

    //disable carrier if order type is CPU Order
    if (this.OrderType.trim() == "CPU Order" || this.OrderType.trim() == "CPUOrder" || OrderType.trim() == "CPU Order" || OrderType.trim() == "CPUOrder") {
      //disable
      this.CarrierEnableDisable(true);
    }
    else {
      if (!this.isTruckOrderNotUsed && !this.isOrderSentToMAS && !this.isChargeOrderSentToMAS)
        this.CarrierEnableDisable(false);
    }
  }
}




