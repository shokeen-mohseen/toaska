import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ToastrService } from 'ngx-toastr';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { AdjustChargesModel, CommonOrderModel, CommonShipModel, EditVerifyEquipmentMaterialProperty, MaterialPropertyGrid, OrderManagement, RateTypeWithUOM, regularOrderModel, SalesOrder } from '../../../../core/models/regularOrder.model';
import { OrderManagementAdjustChargesService } from '../../../../core/services/order-management-AdjustCharges.service';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { finalize } from 'rxjs/operators';
import { formatNumber } from '@angular/common';
import { NgForm, Validators } from '@angular/forms';
import { pipe } from 'rxjs';

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


export interface Element {
  highlighted?: boolean;
}


@Component({
  selector: 'app-regular-order',
  templateUrl: './regular-order.component.html',
  styleUrls: ['./regular-order.component.css']
})
export class RegularOrderComponent implements OnInit, OnDestroy {

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
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

      if (this.SalesOrderforEdit == undefined)
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

  MaterialData: any[] = [];
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
  shipfromtypelist = [];
  shiptotypelist = [];
  shipfromlist = [];
  shiptolist = [];
  contactlist = [];
  contactfromlist = [];
  enduserlist = [];
  addressnamelist = [];
  contracttolist = [];
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
  ToContractlist = [];
  FromContractlist = [];
  ShippingMaterialDetails: any[] = [];

  rateTypeWithUOM: RateTypeWithUOM[] = [];
  EquivalentPallates: number = 0;
  TotalPalates: number = 0;
  TempPalates: number = 0;
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
  isTrailerSealNumber: boolean;
  // multi select
  // public options: Options;
  // public exampleData: any;
  //rateTypeWithUOM: RateTypeWithUOM[] = [];
  //EquivalentPallates: number = 0;
  //TotalPalates: number = 0;
  //TempPalates: number = 0;
  //EditFlag: boolean = false;
  //SelectAddjustMaterial: number = 0;
  //SelectMaterialData: any = [];
  //ShippingUOMData: any;
  //ShippingSelectUOM: string;
  //AQuantity: string;
  //orderManagement: OrderManagement = new OrderManagement();
  //SalesOrder: SalesOrder = new SalesOrder();
  //panelOpenState = false;
  //panelOpenState1 = false;
  //SCarrierId: number;
  //Ordervalidate: boolean;
  //OrderNumber: string;
  //NewOrder: number;
  //closeResult: string;
  //TempData: any = [];
  //FreightModeData: any[] = [];
  //isChecked: boolean;
  //orderTypevalidate: boolean;
  isRequestedDeliveryDateValidate: boolean;
  isScheduleShipDate: boolean;
  isMustArriveByDate: boolean;
  isPONumber: boolean;
  isCarrier: boolean;
  isSaveEditAndNextOrder: string;
  selectedshipfromItems = [];
  selectedCarrierItems = [];
  selectedMaterialItems = [];
  selectedETDItems = [];
  FromLocationName: string;
  decimalPreferences: number;
  TempDataShippingMaterial: any = [];
  AdjustShippingEditFlag: boolean = false;
  OrderConditionDataList: any = [];
  // multi select
  // public options: Options;
  // public exampleData: any;

  @Output()
  EdittedOrderNumber: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('addOrderForm') orderForm: NgForm;

  get isAdjustmentchargeAvailable(): boolean {
    return this.orderManagementAdjustCharges.allAdjustChargesData.length > 0;
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
    debugger;

    if (this.orderManagement.ARChargesSentToAccounting == 1) {
      return true;
    }
    else
      return false;
  }
  get IsOrderEdit(): boolean {

    if (this.orderManagement.Id >1) {
      return true;
    }
    else
      return false;
  }

  get IsShipment(): boolean {

    if (this.orderManagement.ShipmentID > 1) {
      return true;
    }
    else
      return false;
  }
  constructor(private orderManagementAdjustCharges: OrderManagementAdjustChargesService, private router: Router, private orderManagementService: OrderManagementService, private toastrService: ToastrService,
    private authenticationService: AuthService, private orderCommonService: OrdermanagementCommonOperation, private systemPreferences: PreferenceTypeService) {

    this.orderManagement = new OrderManagement();

    this.orderManagementService.getRateTypeWithUOM()
      .subscribe(
        data => {
          if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
            this.rateTypeWithUOM = <RateTypeWithUOM[]>data.data;
            this.orderManagementAdjustCharges.rateTypeWithUOM = this.rateTypeWithUOM;
          }
        });
  }

  async ngOnInit() {

    if (this.orderManagementService.SalesOrderforEdit != undefined) {
      this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
      if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
        this.orderManagement.Id = Number(this.SalesOrderforEdit[0].OrderId);
        this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
      }
    }

    this.BindPreLoadDataOnPage();
    
    if (this.SalesOrderforEdit != undefined && this.SalesOrderforEdit.length > 0) {
    
      this.BindOrderDetails(Number(this.SalesOrderforEdit[0].OrderId), this.SalesOrderforEdit[0].OrderType);
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
    this.isSaveEditAndNextOrder = "";

    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();

    this.resetValidationCss();
  }

  ngOnDestroy(): void {
    this.orderManagementAdjustCharges.AddEditMaterialUnSubscribe();
  }

  //count = 3;

  BindPreLoadDataOnPage() {

    this.multiselectSetting();

    this.orderManagementService.GetUOMData()
      .subscribe(
        data => {
          this.UOMData = data.data;
          this.SelectUOM = this.UOMData.find(f => f.code == GlobalConstants.EA)?.id;
        });

    this.Equipmentvalidate = true;
    this.Ordervalidate = true;
    this.NewOrder = 0;
    this.orderManagementService.OrderTypeList()
      .subscribe(
        data => {
          this.OrderTypeData = data.data;
          this.orderCommonService.OrderTypeList = data.data;
          this.OrderTypeId = this.OrderTypeData.find(f => f.code == GlobalConstants.Customer)?.id;
          this.orderManagement.OrderTypeId = this.OrderTypeId;

          //because on edit don't want to show default order type
          if (this.SalesOrderforEdit.length > 0)
            this.OrderTypeId = 0;

          this.orderManagement.OrderTypeCode = this.OrderTypeData.find(f => f.code == GlobalConstants.Customer)?.code;
          this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
          this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;

          this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;

          if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0) {
            this.getShipToType();
            this.getShipFromType();
            this.BindMaterialList(this.OrderID, 0);
          }
        });

    this.orderManagementService.CarrierList(this.regularOrderData)
      .subscribe(
        data => {
          this.CarrierData = data.data;
        });

    this.orderManagementService.EquipmentTypeData(this.regularOrderData)
      .subscribe(
        data => {

          this.EquipmentTypeData = [];
          this.dataEquipmentType = data.data;
          this.dataEquipmentType.map(item => {
            return {
              name: item.name + " " + item.maxPalletQty + " Pallets",
              id: Number(item.id),
              maxPalletQty: Number(item.maxPalletQty == undefined || item.maxPalletQty == null ? 0 : item.maxPalletQty)
            };
          }).forEach(x => this.EquipmentTypeData.push(x));
        });




    ////////////////////////////////////////////////
    //this.BindSalesManagerListData();

    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id == 0)  { this.GetStatus(0); }

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



  AddMaterial()
  {
    debugger;
    if (Number(this.OQuantity) <= 0 || (Number(this.OQuantity) % 1) != 0) {
      this.toastrService.error('Please enter a valid quantity.');
      return false;
    }

    var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
    //var getUom = this.UOMData.filter(f => f.id == this.SelectUOM);
    var Condition1 = this.MaterialDetails.find(temp => temp.materialID == getmaterial.id)

    if (Condition1) {
      // if material already exists then modify the quantity and proceed to update 
      var userInputedQuantity = this.OQuantity;

      this.SelectMaterialEdit(getmaterial.id);
      this.OQuantity = userInputedQuantity;
      this.EditMaterial();
      this.EditFlag = false;
      this.SelectMaterial = 0;
      this.OQuantity = "";

      // this.toastrService.success('This material already add in list.');
      //this.toastrService.success('Material Update Successfully.');
    }
    else {
      if (this.AdjustShippingCalculate(1) == true) {
        //this.modifyAdjustChargesSection();
        this.BindAdjustmentChargesMaterialDropDownList();
        this.UpdateAdjustmentChargesGrid();

        this.toastrService.success('Material Add Successfully.');
      }
      //this.toastrService.success('Material Add Successfully.');
    }


  }

  DeleteMaterial(id: number) {
    for (var i = 0; i < this.MaterialDetails.length; i++) {

      if (this.MaterialDetails[i].materialID == id) {

        //var cal3 = Math.ceil(Number(this.MaterialDetails[i].quantity) / Number(this.MaterialDetails[i].propertyValue));
        var cal3 = Math.ceil((this.IsShipment ? Number(this.MaterialDetails[i].shippedQuantity) : Number(this.MaterialDetails[i].quantity)) / this.TempData.propertyValue);

        if (this.MaterialDetails[i].code == "F23") {
          this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
          this.MaterialDetails.splice(i, 1);
          this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        }
        else {
          this.TotalPalates = this.TotalPalates - Number(cal3);
          this.MaterialDetails.splice(i, 1);
          this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;

        }
        this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
        this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        this.selection = new SelectionModel<PeriodicElement>(true, [])
        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
          if (this.ShippingMaterialDetails[i].flag == 0) {

            if (this.IsShipment) {
              this.ShippingMaterialDetails[i].shippedQuantity = Number(this.ShippingMaterialDetails[i].shippedQuantity) - Number(cal3);
            }
            else {
              this.ShippingMaterialDetails[i].quantity = Number(this.ShippingMaterialDetails[i].quantity) - Number(cal3);
            }
           

            this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            debugger;
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            this.selection = new SelectionModel<PeriodicElement>(true, []);
          }
        }
        this.BindAdjustmentChargesMaterialDropDownList();
        this.removeAdjustChargesFromList(id);

      }

    }


  }

  SaveMaterialProperties() {

    if (this.editVerifyEquipmentMaterialProperty.materialWeight <= 0) {
      this.toastrService.error("Please enter a valid material weight greater than zero.");
      return false;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {
      this.toastrService.error("Please enter the valid material quantity per pallet.");
      return false;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {
      this.toastrService.error("Please enter the valid Pallet quantity for the equipment.");
      return false;
    }

    if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {
      this.toastrService.error("Please enter the valid material quntity for the equipment.");
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
        this.CommodityData = result.data == undefined ? result.Data : result.data;
        $("#materialPropertyPopup").modal('hide');
        this.modifyMaterialGrid();
      }
      else {
        this.toastrService.error("there is some issue contact to admin.");
      }

    });
    // call on success of modify material grid


  }

  modifyMaterialGrid() {
    this.verifyMaterialProperties(this.SelectMaterial, "modifymaterial");

  }

  OnSelectedmaterial(event) {

    this.orderManagementService.MaterialQuantity(Number(this.SelectEquipment), Number(event.target.value), 100, "Number of Units in an Equipment")
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
    this.GetStatus(0);
    this.GetCarrier();
    //this.selectedCarrierItems.push({ "id": this.SCarrierId, "name": this.orderManagement.carierName });
  }

  getShipToType() {
    //this.OrderTypeId = this.OrderTypeData.find(f => f.code == this.orderManagement.SelectedOrderCode)?.id;

    if (!!this.OrderTypeId) {
      this.commonOrderModel.OrderTypeId = Number(this.orderManagement.OrderTypeId != undefined ? this.orderManagement.OrderTypeId : this.OrderTypeId);
      this.commonOrderModel.ClientID = this.orderManagement.ClientId;
      this.commonOrderModel.Action = 'shiptotype';
      this.shiptotypelist = [];
      this.orderManagementService.ShipTypeData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;

          this.orderCommonService.ShipToType = datas

          this.filterShipToTypeModel = Object.assign({}, datas);


          //this.orderManagement.ShipToTypeId = 0;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.shiptotypelist.push(x));

          if (this.orderManagement.Id == undefined || this.orderManagement.Id == 0) {
            this.orderManagement.ShipToTypeId = this.orderCommonService.setDefultToLocationType(Number(this.OrderTypeId));
            if (this.orderManagement.ShipToTypeId > 0) {
              this.bindDataForShipToType(Number(this.orderManagement.ShipToTypeId));
            }
          }
          else {
            this.orderManagement.ShipToTypeId = Number(this.SelectedSalesOrdersforEdit.ShipToTypeId);
          }
        });
    }
  }

  getShipFromType() {
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
            this.orderManagement.ShipFromTypeId = 0;
          }
          


        }



      }))
        .subscribe(result => {

          var datas = result.data;
          this.filterShipFromTypeModel = Object.assign({}, datas);

          // this.orderManagement.ShipFromTypeId = 0;
          datas.map(item => {
            return {
              name: item.name,
              id: Number(item.id),
              code:item.code
            };
          }).forEach(x => this.shipfromtypelist.push(x));



        });
    }
  }


  selectShipType(event) {

    if (event.target.value != 0) {
      this.BindAllFromShipLocation(event.target.value);
    }
    else {
      this.orderManagement.ShipFromTypeId = 0;
      this.shipfromlist = [];
    }
  }

  BindAllFromShipLocation(LocationFunctionFromID) {

    this.LoctionFuntionFromId = Number(LocationFunctionFromID);
    this.orderManagement.ShipFromTypeId = Number(this.LoctionFuntionFromId);
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
              name: item.name,
              id: Number(item.id),
              locationTypeCode: item.locationTypeCode
            };
          }).forEach(value => this.shipfromlist.push(value));
        });
    }
  }

  selectShipToType(event) {

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
        this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);

        this.orderManagementService.ShipToData(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            this.filterShipToModel = datas;

            this.shiptolist = [];
            datas.map(item => {
              return {
                name: item.name,
                id: Number(item.id),
                locationTypeCode: item.locationTypeCode
              };
            }).forEach(x => this.shiptolist.push(x));
          });
      }
    }

  }


  selectShipTo(event) {

    if (event.id != 0) {
      this.orderManagement.ToLocationId = Number(event.id);
      this.LocationId = Number(event.id);


      this.orderManagementAdjustCharges.DefaultCommodityID = this.filterShipToModel.find(f => f.id == this.LocationId).defaultCommodityID;
      this.orderManagement.ToLocationId = this.LocationId;
      if (!!this.OrderTypeId) {


        this.selectaddressname(this.LocationId);



        if (!this.IsStockTransfer && !this.IsCustomerReturn) { this.BindAvailableCredit(Number(this.LocationId)); }


        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'contact';
        //this.commonOrderModel.LocationFunctionID = this.LocationFunctionId;
        this.commonOrderModel.LocationID = this.LocationId;

        this.contactlist = [];

        this.orderManagementService.ShipToContactData(this.commonOrderModel).pipe()
          .subscribe(result => {

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
            //  if (!!!this.orderManagement.RequestedDeliveryDate) {
            //    this.isScheduleDateExist = false;
            //    this.isDateExist = true;
            //    return;
            //  }
            //}
            //else if (this.isStockTransfer) {
            //  if (!!!this.orderManagement.ScheduledShipDate) {
            //    this.isDateExist = false;
            //    this.isScheduleDateExist = true;
            //    return;
            //  }
            //}

            if (!this.isStockTransfer) {
              if (!!!this.orderManagement.RequestedDeliveryDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {

                return false;
              }
            }
            else {
              if (!!!this.orderManagement.ScheduledShipDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {

                return false;
              }
            }

            if (!this.IsCustomerReturn) {
              this.BindFuelCharges(Number(this.orderManagement.ToLocationId == undefined ? this.LocationId : this.orderManagement.ToLocationId));

              this.BindSalesManagerListData();
              this.GetEquipment(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
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
        });


      if (this.orderManagement != undefined && this.orderManagement.Id != undefined && Number(this.orderManagement.Id) > 0) {
        if (!this.IsStockTransfer) {
          this.ChangeShiptoLocationEditValidation();
        }
        else if (this.IsStockTransfer) {
          this.ChangeShipTOLocationEditForStockTransfer();
        }
      }
    }


  }


  onRequestedDeliveryDateChange(args) {
    this.orderManagement.RequestedDeliveryDate = args.value;

    if (this.IsCustomer || this.IsCPUOrder || this.IsCustomerToCustomer) {
      this.bindDataForToLocationContractRelated();
    }
    else if (this.IsCustomerReturn) {
      this.bindDataForFromLocationContractRelated();
    }

  }

  onScheduleShipDateChange(args) {
    this.orderManagement.ScheduledShipDate = args.value;
    if (this.isStockTransfer) {
      this.bindDataForToLocationContractRelated();
    }
  }


  bindDataForToLocationContractRelated() {

    if (!this.isStockTransfer) {
      if (!!!this.orderManagement.RequestedDeliveryDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {
        return false;
      }
    }
    else if (this.isStockTransfer) {
      if (!!!this.orderManagement.ScheduledShipDate || !!!this.orderManagement.OrderTypeId || !!!this.orderManagement.ToLocationId) {
        return false;
      }
    }


    var equipmentSelected = setInterval(() => {
      //  ;
      if (this.SelectEquipment != undefined && this.SelectEquipment != null) {
        clearInterval(equipmentSelected);
        //if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {
        
        this.LocationMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);

        this.LocationShippingMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
        //}
        var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

        this.Tocontract(this.orderManagement.ToLocationId, selectedDate, this.OrderTypeId);

      }

    }, 1000);




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



  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 18-Sep-2020
  //////////////////////////////////////////////////
  BindOrderDetails(orderID, OrderType) {
    var index = this.SalesOrderforEdit.findIndex(x => x.OrderId === orderID && x.OrderType === OrderType);
    this.EnableDisableEditNextOrderBtn(index);


    this.GetSalesOrderDataByOrderId(Number(orderID), OrderType);
  }

  GetEquipment(LocationId: any, ClientId: any) {
    this.selectedETDItems = [];
    this.orderManagementService.GetEquipment(LocationId, ClientId)
      .subscribe(
        data => {

          if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {
            this.SelectEquipment = data.data.id;
            this.selectedETDItems.push({ "id": data.data.id, "name": data.data.name });
          }
          else {
            this.SelectEquipment = this.orderManagement.EquipmentTypeId;
            this.selectedETDItems.push({ "id": this.SelectEquipment, "name": data.data.name });
          }

          if (this.SelectEquipment > 0) {
            this.Equipmentvalidate = false;
            var dd = this.EquipmentTypeData.find(f => f.id == this.SelectEquipment);
            this.EquivalentPallates = dd.maxPalletQty;
            this.orderManagementAdjustCharges.MaxPalletSize = dd.maxPalletQty;
            this.GetFreightMode(this.SelectEquipment, this.orderManagement.ClientId);
          }
        });

  }


  GetStatus(OrderId: number) {

   
   this.OrderStatusData = [];

    this.orderManagementService.OrderStatusList(OrderId)
      .subscribe(
        data => {
          this.OrderStatusData = data.data;

          if (OrderId == 0) {
            this.Ordervalidate = true;
            this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.id;
            this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.code;
            this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.name;
          }
          else if (this.SelectedSalesOrdersforEdit != undefined && this.orderManagement != undefined) {
            this.Ordervalidate = false;
            this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.id;
            this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.code;
            this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.id == this.SelectedSalesOrdersforEdit.OrderStatusId)?.name;

          }

          if (OrderId > 0) {
            if (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping) {
              this.OrderStatusDisableProp = false;
            }
            else {
              this.OrderStatusDisableProp = true;
            }

          }
          else {
            this.OrderStatusDisableProp = true;
          }



        });

  }

  ///////////////////////////////////////////////
  /// This method use to get detail of order by its id and ordertype.
  /// Developed By Kapil Pandey
  /// On : 18-Sep-2020
  //////////////////////////////////////////////////
  BindMaterialList(orderID, sectionID) {

    if (sectionID == 2) { this.MaterialDataForAdjustCharges = []; }
    if (sectionID == 0) { this.MaterialData = []; }
    if (sectionID == 1) { this.MaterialDataForAdjustShipping = []; }

    this.orderManagementService.GetOrderMaterialList(orderID, sectionID, this.orderManagement.OrderTypeId)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            if (sectionID == 2) { this.MaterialDataForAdjustCharges = result.data == undefined ? result.Data : result.data; }
            if (sectionID == 0) { this.MaterialData = result.data == undefined ? result.Data : result.data; }
            if (sectionID == 1) { this.MaterialDataForAdjustShipping = result.data == undefined ? result.Data : result.data; }
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
            this.AllRateTypeData = JSON.parse(JSON.stringify(this.RateTypeData));
          }
        }
      );
  }

  adjustmentMaterialGridSelect(event: any) {
    this.orderManagement.adjustChargesSectionMaterialName = event.target['options'][event.target['options'].selectedIndex].text;
  }
  ///////////////////////////////////////////////
  /// This method Refresh Rate and PriceMethod.
  /// Developed By Kapil Pandey
  /// On : 21-Sep-2020
  //////////////////////////////////////////////////
  RefershPriceMethodAndComputationMethod(event: any, source: string) {

    this.orderManagement.adjustChargesSectionMaterialID = Number(this.orderManagement.adjustChargesSectionMaterialID);
    this.orderManagement.adjustChargesSectionChargeID = Number(this.orderManagement.adjustChargesSectionChargeID);
    if (source == 'material') {
      this.orderManagement.adjustChargesSectionMaterialName = event.target['options'][event.target['options'].selectedIndex].text;

    }
    else {
      this.orderManagement.adjustChargesSectionChargeName = event.target['options'][event.target['options'].selectedIndex].text;

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
        this.orderManagementService.ShipToAddressName(this.commonOrderModel)
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

  selectShipFrom(item: any) {

    if (item.id != 0) {
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
            debugger;
            this.BindFuelCharges(Number(this.orderManagement.FromLocationId == undefined ? this.LocationId : this.orderManagement.FromLocationId));

            this.BindSalesManagerListData();
            this.GetEquipment(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
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



      
    }
  }


  selectOrderStatus(event) {

    if (event.target.value != 0) {
      this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.id == Number(event.target.value))?.id;
      this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.id == Number(event.target.value))?.code;
      this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.id == Number(event.target.value))?.name;
    }
  }

  onSubmit() {


  }
  ///////////////////////////////////////////////
  /// This method use to get contract list.
  /// Developed By Abhay Singh
  /// On : 22-Sep-2020
  //////////////////////////////////////////////////
  Tocontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    this.ToContractlist = [];
    this.orderManagementService.Tocontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {
          //  ;

          this.ToContractlist = data.data;
          //this.orderManagement.ToContractId = this.ToContractlist[0].id;
          var ordertype = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;

          if (this.isLocationChangeByUser) {
            this.SelectContractTo(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.ToLocationId));
          }
          else {
            if (this.SelectedSalesOrdersforEdit != undefined) {
              this.orderManagement.ToContractId = this.SelectedSalesOrdersforEdit.ToContractId;
            }
          }

          if (!this.IsCustomerReturn) {
            this.GetComment(this.orderManagement.ToContractId, this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          }


          if (!this.isStockTransfer || !this.IsCustomerReturn) {
            this.clearAdjustmentChargesPanel();
            const interval = setInterval(() => {

              if (this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) {

                clearInterval(interval);
                //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
                if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0)  && this.isLocationChangeByUser)
                  return false;

                this.BindAdjustmentChargesMaterialDropDownList();

                this.GetDefaultAdjustChargesData();


               
              }

            }, 1000);
          }



        });

  }

  BindAdjustmentChargesMaterialDropDownList() {
    this.MaterialDataForAdjustCharges = [];

    this.MaterialDetails.forEach((value, index) => {
      this.MaterialDataForAdjustCharges.push({ name: value.name, id: value.materialID });
    });


    this.ShippingMaterialDetails.forEach((value, index) => {
      this.MaterialDataForAdjustCharges.push({ name: value.name, id: value.materialID });
    });

  }

  GetDefaultAdjustChargesData() {
    this.orderManagementAdjustCharges.shipToLocationID = Number(this.orderManagement.ToLocationId);
    this.orderManagementAdjustCharges.shipFromLocationID = Number(this.orderManagement.FromLocationId != undefined && Number(this.orderManagement.FromLocationId) > 0 ? this.orderManagement.FromLocationId : 0);
    this.orderManagementAdjustCharges.contractID = !this.IsCustomerReturn ? Number(this.orderManagement.ToContractId) : Number(this.orderManagement.FromContractId);
    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;
    this.orderManagementAdjustCharges.OrderTypeID = Number(this.orderManagement.OrderTypeId);
    this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
    this.FilterAdjustmentChargeSectionCharges();
    this.orderManagementAdjustCharges.updateContractDefault();

    

      
    


    this.orderManagementAdjustCharges.defaultUpdate.subscribe(result => {

      if (result == true) {
        this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

        if (this.isLocationChangeByUser || this.isToContractChangeByUser ) {
          this.orderManagementAdjustCharges.reCalculateAllOrder();

          if (!this.IsStockTransfer && !this.IsCustomerReturn) { this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(this.orderManagement.AvailableCredit) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString())); }
        }


        this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);
      }
    });
  }



  ///////////////////////////////////////////////
  /// This method use to get contract list Ship from.
  /// Developed By Abhay Singh
  /// On : 23-Sep-2020
  //////////////////////////////////////////////////
  Fromcontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    
    this.orderManagementService.Fromcontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {
          var ordertype = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;
          this.FromContractlist = data.data;


        

          if (this.isFromLocationChangeByUser) {
            this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));
          }
          else {
            if (this.SelectedSalesOrdersforEdit != undefined) {
              this.orderManagement.FromContractId = this.SelectedSalesOrdersforEdit.FromContractId;
            }
          }
          //this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));
          //this.orderManagement.FromContractId = this.FromContractlist[0].id;

          if (this.IsCustomerReturn) {
            this.GetComment(this.orderManagement.FromContractId, this.orderManagement.FromLocationId, this.orderManagement.ClientId);

            if (!this.isStockTransfer) {
              this.clearAdjustmentChargesPanel();
              const interval = setInterval(() => {

                if (this.MaterialDetails.length > 0 && this.ShippingMaterialDetails.length > 0) {
                  clearInterval(interval);
                  //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
                  if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0)  && this.isLocationChangeByUser)
                    return false;
                  this.BindAdjustmentChargesMaterialDropDownList();

                  this.GetDefaultAdjustChargesData();


                 
                }

              }, 1000);
            }

          }
        });

  }

  AddAdjustChargesData() {

    if (this.orderManagement.adjustChargesSectionChargeID <= 0 || this.orderManagement.adjustChargesCommodityID <= 0
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


    if (!this.isStockTransfer) {
      this.orderManagement.AvailableCredit = (Number(this.orderManagement.AvailableCredit) - this.orderManagementAdjustCharges.TotalAmount).toString();
    }
    else {
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number("0"));
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



  }

  DeleteAdjustChargesItem(element: AdjustChargesModel) {


    // var index = this.orderManagementAdjustCharges.allAdjustChargesData.indexOf(element);
    var items: AdjustChargesModel[] = [];
    items.push(element);
    this.orderManagementAdjustCharges.removeAdjustChargesValue(items);
    this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.orderManagementAdjustCharges.allAdjustChargesData);

  }


  selectToContract(event) {
    if (Number(event.target.value) == 0) return;

    if (this.MaterialDetails != null && this.MaterialDetails.length > 0 && !this.IsCustomerReturn) {
      this.GetDefaultAdjustChargesData();
    }
  }

  selectFromContract(event) {
    if (Number(event.target.value) == 0) return;

    if (this.MaterialDetails != null && this.MaterialDetails.length > 0 && this.IsCustomerReturn) {
      this.GetDefaultAdjustChargesData();
    }
  }

  LocationShippingMaterial(LocationID: number, ClientID: number) {

   

    var orderID: number = 0;
    var orderTypeID: number = 0;
    if (!this.isLocationChangeByUser) {
      orderID = Number(this.SelectedSalesOrdersforEdit.Id);
      orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    }

    //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0)  && this.isLocationChangeByUser)
      return false;


    this.orderManagementService.LocationShippingMaterial(LocationID, ClientID, orderID, orderTypeID).pipe()
      .subscribe(
        data => {
          if (data.data != null) {
            this.ShippingMaterialDetails = data.data;
            this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            this.selection = new SelectionModel<PeriodicElement>(true, []);
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
          sum = sum + Number(cal1);
          this.TotalPalates = this.TotalPalates + Number(cal1 * 2);

        }

      }
      this.ShippingMaterialDetails[0].quantity = Number(sum);
      for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {

        if (this.ShippingMaterialDetails[i].flag == 0) {
          //Because We implement edit functionality for AdjustShippingMaterial Also
          //this.ShippingMaterialDetails[i].quantity = Number(sum);        
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)

          this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
          this.selection = new SelectionModel<PeriodicElement>(true, []);
        }
      }
      return true;

    }
    else {
      var cal3 = Math.ceil(Number(this.OQuantity) / this.SelectMaterialData.propertyValue);
      if (this.SelectMaterialData.code == "F23") {
        this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
      }
      else {
        this.TotalPalates = this.TotalPalates + Number(cal3);
      }
      if (this.TotalPalates <= this.EquivalentPallates) {
        var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
        this.MaterialDetails.push({
          name: getmaterial.name,
          quantity: this.OQuantity,
          shippedQuantity: this.OQuantity,
          materialID: getmaterial.id,
          propertyValue: this.SelectMaterialData.propertyValue,
          code: this.SelectMaterialData.code,
          Pallets: this.SelectMaterialData.code == "F23" ? Number(cal3 * 2) : Number(cal3)
        });
        this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
        this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        this.selection = new SelectionModel<PeriodicElement>(true, []);

        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {

          if (this.ShippingMaterialDetails[i].flag == 0) {
            if (this.IsShipment) {
              this.ShippingMaterialDetails[i].shippedQuantity = this.ShippingMaterialDetails[i].shippedQuantity + cal3;
            }
            else {
              this.ShippingMaterialDetails[i].quantity = this.ShippingMaterialDetails[i].quantity + cal3;
            }
           

            this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);
          }
        }
      }
      else {
        this.toastrService.success('Material quantity being added cannot exceed ' + this.TotalPalates + ' for this equipment.');
        var cal3 = Math.ceil(Number(this.OQuantity) / Number(this.SelectMaterialData.propertyValue));

        if (this.SelectMaterialData.code == "F23") {
          this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
          this.SelectMaterialData.Pallets = Number(cal3 * 2);
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
      this.toastrService.error('Please enter a valid quantity.');
      return false;
    }

    var PelletQty = 0;
    var k = 0;
    for (k; k < this.ShippingMaterialDetails.length; k++) {
      if (this.ShippingMaterialDetails[k].flag == 0 && this.ShippingMaterialDetails[k].name == "WW-PALLET") {

        PelletQty = (this.IsShipment ? Number(this.ShippingMaterialDetails[k].shippedQuantity) : Number(this.ShippingMaterialDetails[k].quantity));
      }
    }

    var getmaterial = this.MaterialDataForAdjustShipping.find(f => f.id == this.SelectAddjustMaterial);

    var Condition1 = this.ShippingMaterialDetails.find(temp => temp.materialID == getmaterial.id);
    //var Condition2 = this.ShippingMaterialDetails.find(temp => temp.materialID == getmaterial.id && temp.bagFlag != 0)

    if (!Condition1 && this.ShippingSelectUOM == GlobalConstants.PelletCode) {
      var Data = this.ShippingMaterialDetails.find(temp => temp.flag == 0);
      if (Number(this.AQuantity) <= (this.IsShipment ? Number(Data.shippedQuantity) : Number(Data.quantity)) ) {
        this.ShippingMaterialDetails.push({
          name: getmaterial.name,
          quantity: this.AQuantity,
          shippedQuantity: this.AQuantity,
          materialID: getmaterial.id,
          flag: 1,
          uomcode: this.ShippingSelectUOM,
        });
      }
      for (var i = 0; this.ShippingMaterialDetails.length; i++) {
        if (this.ShippingMaterialDetails[i].flag == 0) {
          if (this.IsShipment) {
            this.ShippingMaterialDetails[i].shippedQuantity = this.ShippingMaterialDetails[i].shippedQuantity - Number(this.AQuantity);
          }
          else {
            this.ShippingMaterialDetails[i].quantity = this.ShippingMaterialDetails[i].quantity - Number(this.AQuantity);
          }
         
        }
      }

    }
    else if (!Condition1 && this.ShippingSelectUOM == GlobalConstants.BagCode) {
      if (Number(this.AQuantity) > PelletQty) {
        this.toastrService.error('Bags Quantity can not be greater then Pellet Quantity.');
        return;
      }
      this.ShippingMaterialDetails.push({
        name: getmaterial.name,
        quantity: Number(this.AQuantity),
        shippedQuantity: Number(this.AQuantity),
        materialID: getmaterial.id,
        flag: 1,
        uomcode: this.ShippingSelectUOM,
      });

    }
    else {
      this.toastrService.success('This material already add in list.');
    }
    this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
    this.selection = new SelectionModel<PeriodicElement>(true, []);
    this.BindAdjustmentChargesMaterialDropDownList();
    //this.UpdateAdjustmentChargesGrid();
  }

  AdjustDeleteMaterial(id: number) {
    for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
      if (this.ShippingMaterialDetails[i].materialID == id && this.ShippingMaterialDetails[i].flag != 0) {
        this.ShippingMaterialDetails.splice(i, 1);
        this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
        this.selection = new SelectionModel<PeriodicElement>(true, []);
        this.BindAdjustmentChargesMaterialDropDownList();
        /// forciably remove pallet/bag from the Adjustment charges grid.
        this.removeAdjustChargesFromList(id);
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


  OnSelectedAdjustmaterial(event) {

    var id = this.MaterialDataForAdjustShipping.find(f => f.id == Number(this.SelectAddjustMaterial))?.defaultUOMID;
    this.ShippingSelectUOM = this.ShippingUOMData.find(f => f.id == Number(id))?.code;

  }


  SaveOrder() {
    this.isLoading = true;
    this.LoadingMessage = "Your Order validating..";

    if (Number(this.orderManagement.ToContractId != undefined ? this.orderManagement.ToContractId : 0) == 0 && (this.orderManagement.OrderTypeCode == "CPUOrder" || this.orderManagement.OrderTypeCode == "Customer")) {
      this.toastrService.info("No Customer Contract is applied to the order. Please check.");
    }

    var allMaterialList: any[] = [];

    this.MaterialDetails.forEach((value, index) => {
      allMaterialList.push({ MaterialID: Number(value.materialID), Quantity: Number(value.quantity), Pallets: Number(value.pallets == undefined ? value.Pallets : value.pallets), IsPackage: false, ShippedQuantity:Number(value.shippedQuantity) });
    });

    this.ShippingMaterialDetails.forEach((value, index) => {
      allMaterialList.push({ MaterialID: Number(value.materialID), Quantity: Number(value.quantity), Pallets: Number(value.quantity), IsPackage: true, ShippedQuantity: 0 });
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

    this.orderManagementService.ValidateOrderCore(this.orderManagementAdjustCharges.allAdjustChargesData, this.orderManagement, allMaterialList).subscribe(result => {
      if (result.data != null) {
        if (result.data.validationResponse.isValid == true) {
          this.LoadingMessage = "Saving your order..";
          this.orderManagementService.SaveOrder(this.orderManagementAdjustCharges.allAdjustChargesData, this.orderManagement, allMaterialList)
            .subscribe(
              data => {
                this.isLoading = false;
                if (data.data != null) {
                  this.Ordervalidate = false;
                  if (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping) {
                    this.OrderStatusDisableProp = false;
                  }
                  else {
                    this.OrderStatusDisableProp = true;
                  }

                  this.toastrService.success(GlobalConstants.OrderSuccess);
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
                    this.isFromContact = true;
                  }

                  if (!isOrderInEditList && this.isSaveEditAndNextOrder != "SaveAndNextOrder" && this.isSaveEditAndNextOrder != "EditAndNextOrder") {
                    // TODO : this section will be open later after unit testing Kapil
                    // this.orderManagementService.SalesOrderforEdit.push({ OrderId: this.orderManagement.Id, OrderNumber: data.data.orderNumber, OrderStatus: this.orderManagement.OrderStatusCode, OrderType: this.orderManagement.OrderTypeCode, OrderID: this.orderManagement.Id });

                    // this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
                    // this.BindOrderDetails(Number(this.orderManagement.Id), this.orderManagement.OrderTypeId);
                  }

                  if (this.isSaveEditAndNextOrder == "SaveAndNextOrder") {
                    if (!isOrderInEditList) {
                      this.orderManagementService.SalesOrderforEdit.push({ OrderId: this.orderManagement.Id, OrderNumber: data.data.orderNumber, OrderStatus: this.orderManagement.OrderStatusCode, OrderType: this.orderManagement.OrderTypeCode, OrderID: this.orderManagement.Id });
                      this.SalesOrderforEdit = this.orderManagementService.SalesOrderforEdit;
                    }

                    this.orderTypevalidate = false;
                    this.isFromContact = false;
                    this.OrderNumber = 'New Order';
                    this.OrderTypeCode = '';

                    this.orderManagement = new OrderManagement();
                    this.ClearSelectedFields();
                  }
                  if (this.isSaveEditAndNextOrder == "EditAndNextOrder") {
                    this.SelectNextOrderForEdit();
                  }

                }


              });
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

    if (!(this.orderManagement.OrderStatusCode == GlobalConstants.StockTransfer || this.orderManagement.OrderStatusCode == GlobalConstants.Collections)) {
      this.orderManagementService.GetAvailableCreditOfLocation(lo, orderDate)
        .subscribe(
          result => {


            if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              var data = result.data == undefined ? result.Data : result.data;
              this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number(data));


              this.GetStatuswithcondition(lo, String(this.orderManagement.AvailableCredit));
            }

          }
        );
    }
    else {
      this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number("0"));
    }


  }

  ///////////////////////////////////////////////
  /// This method use to get the salesmanager detail
  /// Developed By Kapil Pandey
  /// On : 28-Sep-2020
  //////////////////////////////////////////////////
  BindFuelCharges(locationID: number) {

    if (this.orderManagement.OrderTypeCode == GlobalConstants.StockTransfer || this.orderManagement.OrderTypeCode == GlobalConstants.Collections) {
      this.orderManagement.fuelChargesMiles = '0';
      this.orderManagement.fuelChargesRatePerMile = '0';
      this.orderManagement.fuelChargesPercentage = 0;
      this.orderManagementAdjustCharges.ChargeRatePerMile = 0;
      this.orderManagementAdjustCharges.PerMileCharge = 0;
      this.orderManagementAdjustCharges.PassthrowPercentage = 0;
      return false;
    }

    var orderDate = this.orderManagement.RequestedDeliveryDate;

    this.orderManagementService.GetFuleCharges(locationID, orderDate)
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var data = result.data == undefined ? result.Data : result.data;
            this.orderManagement.fuelChargesMiles = data.customerMiles;
            this.orderManagement.fuelChargesRatePerMile = data.chargeRatePerMile;
            this.orderManagement.fuelChargesPercentage = Number(data.customerPercent);

            this.orderManagementAdjustCharges.ChargeRatePerMile = Number(data.customerMiles);
            this.orderManagementAdjustCharges.PerMileCharge = Number(data.chargeRatePerMile);
            this.orderManagementAdjustCharges.PassthrowPercentage = Number(data.customerPercent);

          }
        }
      );


  }

  LocationMaterial(LocationID: number, ClientID: number) {

    var orderID: number = 0;
    var orderTypeID: number = 0;
    if (!this.isLocationChangeByUser) {
      orderID = Number(this.SelectedSalesOrdersforEdit.Id);
      orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    }

    //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0)  && this.isLocationChangeByUser)
      return false;

    this.orderManagementService.LocationMaterial(LocationID, ClientID, GlobalConstants.EA, this.SelectEquipment, orderID, orderTypeID).pipe().
      subscribe(
        data => {
          if (data.data != null) {
            this.MaterialDetails = data.data;
            this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
            this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);

            //if (this.isLocationChangeByUser) {
            var shippingCaculateMat = setTimeout(() => {
              this.AdjustShippingCalculate(0);
            }, 100);
            //}


          }
        });
  }

  ////////////////////////////////////////////////////
  /// This method refersh the Adjustment Charges Grid
  ////////////////////////////////////////////////////


  UpdateAdjustmentChargesGrid() {

    this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

    if (this.isLocationChangeByUser || this.isToContractChangeByUser) {
      this.orderManagementAdjustCharges.reCalculateAllOrder();

      if (!this.IsStockTransfer && !this.IsCustomerReturn) { this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(this.orderManagement.AvailableCredit) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString())); }
    }


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

    if (element.materialID > 0) {
      this.orderManagement.adjustChargesSectionMaterialID = element.materialID;
      this.orderManagement.adjustChargesSectionMaterialName = element.materialName;
    }
    else {
      this.orderManagement.adjustChargesSectionMaterialID = -1;
      this.orderManagement.adjustChargesSectionMaterialName = '';
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
      this.toastrService.error('Please enter a valid quantity');
      return false;
    }

    //changes
    this.TotalPalates = this.TotalPalates - Number(this.TempPalates);
    var cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
    debugger;
    var cal = Math.ceil((this.IsShipment ? Number(this.TempData.shippedQuantity) : Number(this.TempData.quantity)) / this.TempData.propertyValue);

    //var cal = Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
    if (this.TempData.code == "F23") {
      this.TotalPalates = this.TotalPalates + Number(cal3 * 2);
    }
    else {
      this.TotalPalates = this.TotalPalates + Number(cal3);
    }
    if (this.TotalPalates <= this.EquivalentPallates) {

      debugger;
      for (var i = 0; i < this.MaterialDetails.length; i++) {

        if (this.MaterialDetails[i].materialID == this.SelectMaterial) {
         // this.MaterialDetails[i].quantity = this.OQuantity;
          if (this.IsShipment) {
            this.MaterialDetails[i].shippedQuantity = this.OQuantity;
          }
          else {
             this.MaterialDetails[i].quantity = this.OQuantity;
          }
        }
      }

      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
      this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
      this.selection = new SelectionModel<PeriodicElement>(true, []);

      for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {

        if (this.ShippingMaterialDetails[i].flag == 0) {
          if (this.IsShipment) {
            this.ShippingMaterialDetails[i].shippedQuantity = (this.ShippingMaterialDetails[i].shippedQuantity - cal) + cal3;
          }
          else {
            this.ShippingMaterialDetails[i].quantity = (this.ShippingMaterialDetails[i].quantity - cal) + cal3;
          }
          


          this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
          this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
          this.selection = new SelectionModel<PeriodicElement>(true, []);

          this.toastrService.success('Material Update Successfully.');
        }
      }
    }
    else {
      this.toastrService.success('Material quantity being added cannot exceed ' + this.TotalPalates + ' for this equipment.');
      var cal3 = Math.ceil(Number(this.OQuantity) / this.TempData.propertyValue);
      if (this.TempData.code == "F23") {
        this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
      }
      else {
        this.TotalPalates = this.TotalPalates - Number(cal3);
      }
      this.TotalPalates = this.TotalPalates + Number(this.TempPalates);
      return false;
    }

    this.UpdateAdjustmentChargesGrid();

    return true;
  }

  SelectMaterialEdit(id: number) {
    this.EditFlag = true;
    this.TempData = this.MaterialDetails.find(f => f.materialID == id);
    var cal3 = Math.ceil(Number(this.TempData.quantity) / this.TempData.propertyValue);
    if (this.SelectMaterialData.code == "F23") {
      this.TempPalates = Number(cal3 * 2);
    }
    else {
      this.TempPalates = Number(cal3);
    }
    this.SelectMaterial = this.TempData.materialID;
    //if() Abhaysingh
    if (this.IsShipment) {
      this.OQuantity = this.TempData.shippedQuantity;
    }
    else {
      this.OQuantity = this.TempData.quantity;
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
          this.orderManagement.Comments = data.data.additionalComments;
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
    this.orderManagementService.ToSelectedContract(data, OrderType, ClientID, LocationID).pipe()
      .subscribe(
        data => {

          if (data.data != null) {
            if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {
              this.orderManagement.ToContractId = data.data;
            }
            else {
              this.orderManagement.ToContractId = this.orderManagement.ToContractId;
            }
          }
          else {
            this.orderManagement.ToContractId = 0;
          }

        });
  }

  SelectedContractFrom(data: any[], OrderType: string, ClientID: number, LocationID: number) {
    this.orderManagementService.SelectedContractFrom(data, OrderType, ClientID, LocationID).pipe()
      .subscribe(
        data => {

          if (data.data != null) {
            if (!!!this.orderManagement.Id || this.orderManagement.Id == 0 || !!!this.orderManagement.FromContractId) {
              this.orderManagement.FromContractId = data.data;
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

  SendARChargesTOMAS() {

    if (this.orderManagement.Id == undefined || this.orderManagement.Id == null || this.orderManagement.Id == 0) {
      this.toastrService.error("Please select the order first then you will able to send order to MAS");
      return false;
    }

    this.orderManagementService.ApproveAndSendTOMAS(5).subscribe(data => {
      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
        this.toastrService.success("Your request has been send to MAS Successfully.");
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
              if (this.EditFlag) { this.EditMaterial(); }
              else { this.AddMaterial(); }
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
        ErrorMessage = ErrorMessage + "Please enter the valid material weight for Material :" + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {

        ErrorMessage = ErrorMessage + "Please enter the valid material unit into a pallet for Material :" + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {

        ErrorMessage = ErrorMessage + "Please enter the valid Pallet unit into an equipment for Material :" + value.materialName;
        isErrorFound = true;
      }

      if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {

        ErrorMessage = ErrorMessage + "Please enter the valid material unit into an equipment.Material :" + value.materialName;
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
          this.CommodityData = result.data == undefined ? result.Data : result.data;
          $("#compilePopup").modal('hide');
          this.SaveOrder();
        }
        else {
          this.toastrService.error("There is a technical issue encountered. Please refer this to support team.");
        }

      });
    }
  }


  RemoveSalesOrder(OrderID) {
    this.orderManagementService.SalesOrderforEdit.splice(this.orderManagementService.SalesOrderforEdit.findIndex(x => x.OrderId === OrderID), 1);
  }


  SelectedEquipment(item: any) {
    this.orderManagement.EquipmentTypeId = item.id;
    this.orderManagement.equipmentTypeName = item.itemName;
    this.SelectEquipment = item.id;
    this.orderManagementAdjustCharges.MaxPalletSize = this.EquipmentTypeData.find(x => x.id == Number(this.orderManagement.EquipmentTypeId))?.maxPalletQty;
    this.GetFreightMode(Number(this.SelectEquipment), this.orderManagement.ClientId);
  }


  GetStatuswithcondition(locationID: number, Credit: string) {

    if (this.orderManagement == undefined || this.orderManagement.Id == undefined || this.orderManagement.Id <= 0 || (this.orderManagement.Id > 0 && this.SelectedSalesOrdersforEdit != undefined && Number(this.orderManagement.ToLocationId) != Number(this.SelectedSalesOrdersforEdit.ToLocationId) && this.SelectedSalesOrdersforEdit.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted)) {
      this.OrderStatusData = [];
      this.orderManagementService.GetStatuswithcondition(locationID, Credit)
        .subscribe(
          data => {
            this.OrderStatusData = data.data;
            var data = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.id;

            if (data) {


              this.orderManagement.OrderStatusId = Number(data);

              this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.code;
              this.orderManagement.OrderStatusName = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.name;

            }
            else {
              this.orderManagement.OrderStatusId = this.OrderStatusData[0].id;
              this.orderManagement.OrderStatusCode = this.OrderStatusData[0].code;
              this.orderManagement.OrderStatusName = this.OrderStatusData[0].name;
            }



          });
    }

  }

  GetSalesOrderDataByOrderId(OrderId: number, OrderType: string) {
    let letdata: any;
    this.orderManagementService.SalesOrderDataByOrderIdwithClientID(OrderId,
      this.authenticationService.currentUserValue.ClientId,
      OrderType)
      .pipe(
        finalize(() => {
          if (letdata != null || letdata != undefined) {
            this.orderManagement = new OrderManagement();
            letdata.map(f => {
              this.orderManagement.Id = f.OrderId;
              this.orderManagement.OrderTypeId = f.OrderTypeID;
              this.orderManagement.OrderTypeCode = f.OrderTypeCode;

              this.orderManagementAdjustCharges.OrderID = Number(this.orderManagement.Id);
              this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;
              this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

              this.OrderTypeId = f.OrderTypeID;
              this.orderManagement.OrderStatusId = f.OrderStatusID;
              this.orderManagement.OrderStatusCode = f.OrderStatusCode;
              this.orderManagement.ShipFromTypeId = Number(!!!f.ShipFromTypeId ? 0 : f.ShipFromTypeId);
              this.orderManagement.FromLocationId = !!!f.FromLocationID ? 0 : f.FromLocationID;
              this.FromLocationName = !!!f.FLocation ? '' : f.FLocation;
              // this.orderManagement.FromAddres = !!!f.FromAddressID ? 0 : f.FromAddressID;
              this.orderManagement.FromAddres = !!!f.FromAddressID ? '' : f.FromAddressID;
              this.orderManagement.ShipFromLocationContactId = !!!f.ShipFromLocationContactID ? 0 : f.ShipFromLocationContactID;
              this.orderManagement.FromContractId = !!!f.FromCustomerContractID ? (!!!f.FromBusinessPartnerContractID ? 0 : f.FromBusinessPartnerContractID) : f.FromCustomerContractID;
              this.SCarrierId = !!!f.CarrierID ? 0 : f.CarrierID;
              this.orderManagement.CarrierId = !!!f.CarrierID ? 0 : f.CarrierID;
              this.orderManagement.carierName = !!!f.CarrierName ? '' : f.CarrierName;
              this.SelectEquipment = !!!f.EquipmentTypeID ? 0 : f.EquipmentTypeID;
              this.orderManagement.equipmentTypeName = !!!f.EquipmentName ? '' : f.EquipmentName;
              this.orderManagement.EquipmentTypeId = !!!f.EquipmentTypeID ? 0 : f.EquipmentTypeID;
              this.orderManagement.TrailerNumber = f.TrailerNumber;
              this.orderManagement.TrailerSealNumber = f.TrailerSealNumber;
              this.orderManagement.FreightModeID = !!!f.FreightModeID ? 0 : f.FreightModeID;
              this.orderManagement.RequestedDeliveryDate = f.RequestedDeliveryDate;
              this.orderManagement.ScheduledShipDate = f.ScheduledShipDate;
              this.orderManagement.MustArriveByDate = f.MustArriveByDate;
              this.orderManagement.ShipToTypeId = Number(!!!f.ShipToTypeId ? 0 : f.ShipToTypeId);
              this.orderManagement.ToLocationId = !!!f.ToLocationID ? 0 : f.ToLocationID;
              this.orderManagement.shipToLocationName = !!!f.TLocation ? '' : f.TLocation;
              this.orderManagement.ToAddressId = f.ToAddressID;
              this.orderManagement.ShipToLocationContactId = !!!f.ShipToLocationContactID ? 0 : f.ShipToLocationContactID;
              this.orderManagement.InvoiceNo = f.InvoiceNumber;
              this.orderManagement.ToContractId = !!!f.ToCustomerContractID ? (!!!f.ToBusinessPartnerContractID ? 0 : f.ToBusinessPartnerContractID) : f.ToCustomerContractID;
              this.isChecked = f.SupressEmailConfirmation;
              this.orderManagement.PurchaseOrderNumber = f.PurchaseOrderNumber;
              this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;
              this.orderManagement.orderNumber = f.OrderNumber;
              this.OrderNumber = f.OrderNumber;
              this.orderManagementService.CurrentEditOrderNumber = f.OrderNumber;
              this.orderManagement.PickupApplointment = f.PickupAppointment;
              this.orderManagement.DeliveryAppointment = f.DeliveryAppointment;
              this.orderManagement.CreatedBy = f.UpdatedBy;
              this.orderManagement.OrderStatusName = f.OrderStatusName;
              this.orderManagement.OrderConditionCode = f.OrderConditionCode;
              this.orderManagement.UpdateDateTimeServerStrFromat = (f.UpdateDateTimeServer != undefined && f.UpdateDateTimeServer != null ? f.UpdateDateTimeServer.toLocaleString() : "");
              this.orderManagement.ShipmentID = !!!f.OrderConditionID ? 0 : f.ShipmentID;
              this.orderManagement.ARChargesSentToAccounting = !!!f.ARChargesSentToAccounting ? 0 : f.ARChargesSentToAccounting;
            });

            this.SelectedSalesOrdersforEdit = JSON.parse(JSON.stringify(this.orderManagement));

            this.GetStatus(Number(this.orderManagement.Id));

            this.orderManagementAdjustCharges.OrderID = this.orderManagement.Id;
            this.orderManagementAdjustCharges.OrderTypeID = this.orderManagement.OrderTypeId;
            this.orderManagementAdjustCharges.OrderTypeCode = this.orderManagement.OrderTypeCode;

            this.BindMaterialList(this.orderManagement.Id, 0);
            this.getShipToType();

            this.getShipFromType();
            if (this.orderManagement.ShipFromTypeId > 0) { this.BindAllFromShipLocation(this.orderManagement.ShipFromTypeId); }

            if (this.orderManagement.ShipToTypeId > 0) {
              this.selectToType(this.orderManagement.ShipToTypeId);
            }

            if (this.orderManagement.FromLocationId > 0) {

              this.selectEditShipFrom(this.orderManagement.FromLocationId);
            }

            if (!this.IsStockTransfer && !this.IsCustomerReturn) { this.BindAvailableCredit(Number(this.orderManagement.ToLocationId)); }
            this.orderTypevalidate = true;
            if (!!this.orderManagement.OrderStatusCode && (this.orderManagement.OrderStatusCode == GlobalConstants.OpenOrderNeedsToBeCompleted || this.orderManagement.OrderStatusCode == GlobalConstants.SendforShipping)) {
              // this.OrderTypeCodeStatus(this.orderManagement.OrderTypeCode);
              this.Ordervalidate = false;
            }
            else {
              this.Ordervalidate = true;
            }
            this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "name": this.orderManagement.carierName });
            this.editorderselctionchange();
            this.propertySetDisableEdit();
            this.propertySetDisable();

            this.FilterAdjustmentChargeSectionCharges();
            //this.GetCarrier();
            if (this.IsAssignedTOShipment) {
              this.settingsShipFromTo = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };
            }
            
                        debugger;

            if (this.ARChargesSentToAccounting && (this.IsCustomer || this.IsCPUOrder || this.IsCustomerReturn)) {
              debugger;
              this.settings = {
                singleSelection: true,
                text: "Select Location",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };

              this.settingsShipFromTo = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };


              this.settingsCarrier = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };

              this.settingsEquip = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                disabled: true,
                badgeShowLimit: 1,
                labelKey: 'name'
              };
              this.isFromContract = true;
              this.isFreight = true;
              this.isRequestedDeliveryDateValidate = true;
              this.isToContract = true;
              this.isScheduleShipDate = true;
              this.isMustArriveByDate = true;
              this.isShowOnBOL = true;

            }

            if (this.ARChargesSentToAccounting && (this.IsChargeOrder)) {
              debugger;
              this.settings = {
                singleSelection: true,
                text: "Select Location",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };

              this.settingsShipFromTo = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };


              this.settingsCarrier = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                badgeShowLimit: 1,
                disabled: true,
                labelKey: 'name'
              };

              this.settingsEquip = {
                singleSelection: true,
                text: "Select",
                enableSearchFilter: true,
                addNewItemOnFilter: false,
                disabled: true,
                badgeShowLimit: 1,
                labelKey: 'name'
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

          }
        }),
      )
      .subscribe(
        result => {
          letdata = result.data;
        });
  }

  selectToType(LoctionFuntionToId) {

    if (LoctionFuntionToId != 0) {

      this.orderManagement.ShipToTypeId = Number(LoctionFuntionToId);
      this.bindForShipToType(Number(LoctionFuntionToId));
    }
    else {

      this.orderManagement.ShipToTypeId = 0;
      this.shiptolist = [];
    }
  }

  bindForShipToType(shipto: number) {
    if (shipto != 0) {
      this.isStockTransfer ? (this.isScheduleDateExist = false) : (this.isDateExist = false);

      this.LoctionFuntionToId = Number(shipto);

      if (!!this.OrderTypeId) {
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
                  name: item.name,
                  id: Number(item.id),
                  locationTypeCode: item.locationTypeCode
                };
              }).forEach(x => this.shiptolist.push(x));
              if (this.orderManagement.ToLocationId > 0 && this.shiptolist.length > 0) {

                this.selectedItemsB.push({ "id": this.orderManagement.ToLocationId, "name": this.orderManagement.shipToLocationName });
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
        this.BindFuelCharges(Number(this.orderManagement.ToLocationId));

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

  selectEditShipFrom(event) {
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
     // var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;
      //this.Fromcontract(Number(this.orderManagement.FromLocationId), selectedDate, Number(this.OrderTypeId));
      this.selectedshipfromItems.push({ "id": this.orderManagement.FromLocationId, "name": this.FromLocationName });
    }
  }

  editorderselctionchange() {
    this.EdittedOrderNumber.emit(this.orderManagement.orderNumber);
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
      }
      else {
        this.orderTypevalidate = false;
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
          labelKey: 'name'
        };

      }
      else {

        this.IsShipFromLocation = false;
        this.settings = {
          singleSelection: true,
          text: "Select Location",
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          disabled: false,
          labelKey: 'name'
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

    //if (this.IsShippedInventoryAndARChargesSentToMAS || this.IsShippedAndUnderReview || this.IsTransferOrderShippedandInventorySentToMAS) {
    //  this.IsMaterialEdit = true;
    //  this.IsChargesEdit = true;
    //  this.IsPalletEdit = true;
    //}
    //else {
    //  this.IsMaterialEdit = true;
    //  this.IsChargesEdit = true;
    //  this.IsPalletEdit = true;
    //}

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
    this.BindPreLoadDataOnPage();
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
    this.selectedETDItems = [];
    this.orderManagement.ShipToTypeId = 0;
    this.orderManagement.ToAddress = "";
    this.orderManagement.ShipToLocationContactId = 0;
    this.orderManagement.AddressName = "";
    this.orderManagement.ToContractId = 0;
    this.isChecked = false;
    this.orderManagement.PurchaseOrderNumber = "";
    this.orderManagement.AvailableCredit = "";
    this.orderManagement.SalesManager = "";
    this.orderManagement.InvoiceNo = "";
    this.orderManagement.AllocatedFreightCharge = 0;
    this.orderManagement.PickupApplointment = null;
    this.orderManagement.DeliveryAppointment = null;
    this.orderManagement.fuelChargesRatePerMile = '0';
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
        this.BindOrderDetails(Number(this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderId), this.SalesOrderforEdit[this.CurrentEditListItemIndex].OrderType);
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

  multiselectSetting() {
    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: false,
      labelKey: 'name'
    };
    this.settingsEquip = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      disabled: false,
      badgeShowLimit: 1,
      labelKey: 'name'
    };
    this.settingsCarrier = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: false,
      labelKey: 'name'
    };
    this.settingsMaterial = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      labelKey: 'name'
    };

    this.settingsShipFromTo = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      disabled: false,
      labelKey: 'name'
    };
  }

  GetCarrier() {
    this.selectedCarrierItems = [];
    let ordercode = this.OrderTypeData.find(d => d.id === Number(this.OrderTypeId))?.code;
    if (ordercode == "CPUOrder") {
      this.orderManagement.CarrierId = this.CarrierData.find(f => f.code == 'CPU (Customer Pick up)')?.id;
      this.SCarrierId = this.orderManagement.CarrierId;
      this.orderManagement.carierName = this.CarrierData.find(f => f.code == 'CPU (Customer Pick up)')?.name;
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
          this.settingsCarrier = {
            singleSelection: true,
            text: "Select",
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            disabled: true,
            labelKey: 'name'
          };
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
          this.settingsCarrier = {
            singleSelection: true,
            text: "Select",
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            disabled: true,
            labelKey: 'name'
          };
        }


      }
    }
  }

  ChangeShipTOLocationEditForStockTransfer() {

    if (Number(this.orderManagement.ToLocationId) != Number(this.SelectedSalesOrdersforEdit.ToLocationId)) {
      if (this.IsOpenOrderNeedsToBeCompleted) {
        this.isPONumber = false;
        this.orderManagement.PurchaseOrderNumber = "";
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

  ConvertMoneyToDecimalPreferences(value: any) {

    var result = 0;
    if (value != undefined)
      return value.toFixed(this.decimalPreferences);
    else
      return result.toFixed(this.decimalPreferences);
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
    if (this.IsShipment) {
      this.AQuantity = this.TempDataShippingMaterial.shippedQuantity;
    }
    else {
      this.AQuantity = this.TempDataShippingMaterial.quantity;
    }
    
    this.ShippingSelectUOM = this.TempDataShippingMaterial.uomcode;
  }

  modifyAdjustShippingMaterialGrid() {
    if (this.AdjustShippingEditFlag == true) {
      //edit
      this.EditShippingMaterialMaterial();

    } else {
      //add
      this.AddAdjustMaterial();
      this.AdjustShippingEditFlag = false;
    }

  }

  ResetAdjustShipingMaterial() {
    this.AdjustShippingEditFlag = false;
    this.SelectAddjustMaterial = 0;
    this.AQuantity = "";
    this.ShippingSelectUOM = "";
  }

  EditShippingMaterialMaterial() {
    if (Number(this.AQuantity) <= 0 || (Number(this.AQuantity) % 1) != 0) {
      this.toastrService.error('Please enter a valid quantity');
      return false;
    }

    var PelletQty = 0;
    var k = 0;
    for (k; k < this.ShippingMaterialDetails.length; k++) {
      if (this.ShippingMaterialDetails[k].flag == 0 && this.ShippingMaterialDetails[k].name == "WW-PALLET") {

        PelletQty = (this.IsShipment ? Number(this.ShippingMaterialDetails[k].shippedQuantity) : Number(this.ShippingMaterialDetails[k].quantity));
      }
    }

    if (Number(this.AQuantity) > PelletQty) {
      this.toastrService.error('Bags Quantity can not be greater then Pellet Quantity.');
      return;
    }

    for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
      if (this.ShippingMaterialDetails[i].materialID == this.SelectAddjustMaterial) {

        if (this.IsShipment) {
          this.ShippingMaterialDetails[i].shippedQuantity = Number(this.AQuantity);
        }
        else {
          this.ShippingMaterialDetails[i].quantity = Number(this.AQuantity);
        }
       
      }
    }
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails);
    this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
    this.selection = new SelectionModel<PeriodicElement>(true, []);

    this.toastrService.success('Material Update Successfully.');
    return true;

  }

  bindDataForFromLocationContractRelated() {
    debugger;

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


    var equipmentSelected = setInterval(() => {
      //  ;
      if (this.SelectEquipment != undefined && this.SelectEquipment != null) {
        clearInterval(equipmentSelected);
        //if (!!!this.orderManagement.Id || this.orderManagement.Id == 0) {

        this.LocationMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);

        this.LocationShippingMaterial(this.orderManagement.FromLocationId, this.orderManagement.ClientId);
        //}
        var selectedDate = this.isStockTransfer ? this.orderManagement.ScheduledShipDate : this.orderManagement.RequestedDeliveryDate;

        //this.Tocontract(this.orderManagement.ToLocationId, selectedDate, this.OrderTypeId);

        this.Fromcontract(this.orderManagement.FromLocationId, selectedDate, this.OrderTypeId);



      }

    }, 1000);




  }





  ChangeShipFromLocationEditValidation() {
    debugger;

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
          this.settingsCarrier = {
            singleSelection: true,
            text: "Select",
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            disabled: false,
            labelKey: 'name'
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
          this.settingsCarrier = {
            singleSelection: true,
            text: "Select",
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            disabled: false,
            labelKey: 'name'
          };
          

        


          }
        }
    }
  }


  resetValidationCss() {

    if (!this.IsStockTransfer) {
      document.getElementById('RequestedDeliveryDate_input').setAttribute('required', null);
      document.getElementById('ScheduledShipDate_input').removeAttribute('required');


    }
    else {
      document.getElementById('ScheduledShipDate_input').setAttribute('required', null);
      document.getElementById('RequestedDeliveryDate_input').removeAttribute('required');
      
    }

          
  }

  OrderConditionList() {
    this.orderManagementService.OrderConditionList()
      .subscribe(
        data => {
          this.OrderConditionDataList = data.data;
        });
  }




     

}




