import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { BulkOrderManagement, BulkSalesOrder, CommonOrderModel, CommonShipModel, EditFinalElement, EditVerifyEquipmentMaterialProperty, MaterialPropertyGrid, OrderManagement, regularOrderModel, SaveVerifyEquipmentMaterialProperty } from '../../../../core/models/regularOrder.model';
import { OrderManagementAdjustChargesService } from '../../../../core/services/order-management-AdjustCharges.service';
import { OrdermanagementCommonOperation } from '../../../../core/services/order-management-common-operations.service';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { projectkey } from '../../../../../environments/projectkey';


declare var $: any;
export interface PeriodicElement {
  name: string;
  quantity: number;
  propertyValue: number;
  pallets: number;
  materialID: number;
  IsSeleted: boolean;

}

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.component.html',
  styleUrls: ['./bulk-order.component.css']
})
export class BulkOrderComponent implements OnInit {
  @Input() buttonBar: any;
  isPONo: boolean = false;
  isPallets: boolean = false;
  isValidationPallets: boolean = true;
  iscalculates: boolean = false;
  isEditPallets: boolean = false;
  isDeletePallets: boolean = false;
  dataOrderTypes: any;
  OrderTypeData: any;
  OrderTypeId: number;
  SelectedOrderCode: any;
  OrderStatusData: any;
  orderManagement: OrderManagement = new OrderManagement();
  commonOrderModel: CommonOrderModel = new CommonOrderModel();
  regularOrderData: regularOrderModel = new regularOrderModel();
  ediFinalElement: EditFinalElement = new EditFinalElement();
  editVerifyEquipmentMaterialProperty: EditVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();
  OrderStatuslist = [];
  shipfromtypelist = [];
  shiptotypelist = [];
  shiptotypeEditlist = [];
  shipfromlist = [];
  shiptolist = [];
  shiptoEditlist = [];
  contactlist = [];
  editContactlist = [];
  contactfromlist = [];
  filterShipFromTypeModel: CommonShipModel[] = [];
  filterShipToTypeModel: CommonShipModel[] = [];
  filterShipToModel: CommonShipModel[] = [];
  filterShipFromModel: CommonShipModel[] = [];
  filterContactModel: CommonShipModel[] = [];
  dataCarrier: any;
  LocationFunctionId: number;
  LoctionFuntionToId: number;
  LoctionFuntionFromId: number;
  LocationId: number;
  LoctionFromId: number;
  ShipFromId: number;
  ShipToId: number;
  ShipToTypeId: number;
  isDateExist = false;
  isStatusSelected = false;
  SelectEquipment: number;
  Equipmentvalidate: boolean;
  EquipmentTypeData: any;
  dataEquipmentType: any;
  EquivalentPallates: number = 0;
  TotalPalates: number = 0;
  FreightModeData: any = [];
  FromContractlist = [];
  CarrierData: any;
  CarrierEditData: any;
  MaterialData: any;
  UOMData: any;
  MaterialDetails: any = [];
  SelectMaterial: number = 0;
  OrderID: number;
  OQuantity: string;
  Mpallet: string;
  SelectMaterialData: any = [];
  EditFlag: boolean = false;
  MPallets: string;
  OrderTypeName: string;
  ShipToLocationName: string;
  MaterialName: string;
  MaterialId: number;
  OrderQuantity: number;
  EquipmentTypeName: string;
  CarierName: string;
  numerOfOrders: number = 0;
  ContractNo: string;
  orderBulkList: BulkOrderManagement[] = [];
  orderSummaryList: BulkOrderManagement[] = [];
  ShippingMaterialDetails: any = [];
  ///DESGINER
  panelOpenState1 = false;
  panelOpenState = false;
  panelOpenState111 = false;
  items: '';
  selectedItems = [];
  selectedOrderType = [];
  selectedOrderstatusItems = [];
  selectedshipfromtypeItems = [];
  selectedshiptotypeItems = [];
  selectedshipfromItems = [];
  selectedshiptoItems = [];
  selectedETDItems = [];
  selectedCarrierItems = [];
  selectedEditCarrierItems = [];
  selectedMaterialItems = [];
  selectedcontacttoItems = [];
  selectedshiptoEditItems = [];
  selectededitcontacttoItems = [];
  selectedFCTItems = [];
  MaterialDataBackup: any;
  validatePallets: number;
  itemList = [];
  settings = {};
  Materialsettings = {};
  editsetting = {};
  editsettings = {};
  Ordersettings = {};
  selectedItemsCheck = [];
  itemListCheck = [];
  settingsCheck = {};
  count = 3;
  isMultiple: boolean = true;
  isAllMaterialSelected: boolean = false;
  isAllFinalSelected: boolean = false;
  isSaveOrder: boolean = true;
  isEditMaterials: boolean = false;
  existingMaterialId: string = '';
  isChecked: boolean;
  ContractType: string;
  OrganizationName: string;
  ShipToTypeName: string = '';
  ToContractName: string = '';
  ShipFromTypeName: string = '';
  FromContractName: string = '';
  FromLocationName: string = '';
  finalcontactlist = [];
  iscustomradio: boolean = false;
  requestedDeliveryDate = new FormControl(new Date(new Date().toLocaleString()));
  scheduledShipDate = new FormControl(new Date(new Date().toLocaleString()));
  date = new FormControl(new Date(new Date().toLocaleString()));
  serializedDate = new FormControl((new Date()).toISOString());
  minDate: Date;
  isSubmit: boolean = true;
  isFinalEdit: boolean = false;
  isFinalDelete: boolean = false;
  orderEditBulkList: any = [];
  orderMeterialBulkList: any = [];
  editOrder: string = '';
  editOrderMaterila: string = '';
  existingfinalId: string;
  OrderNumEdit: number;
  checktotalPallets: number = 0;
  CommodityData: any[] = [];
  OrderTypeCode: string;
  ToContractlist = [];
  editPropertyvalue: string = "";
  @Output() closeBulk: EventEmitter<any> = new EventEmitter();
  OCode: string;
  regularOrderHasReadOnlyAccess: boolean = false;
  SendNotification: boolean = false;
  isCheckOrderValidation: boolean = true;
  Iscalculate: boolean = true;
  alertMessages: any = [];

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


  ngOnInit(): void {
    this.regularOrderData.ClientId = this.authenticationService.currentUserValue.ClientId;
    this.selectedItems = [];
    this.selectedOrderType = [];
    this.selectedOrderstatusItems = [];
    this.selectedshipfromtypeItems = [];
    this.selectedshiptotypeItems = [];
    this.selectedshipfromItems = [];
    this.selectedshiptoItems = [];
    this.selectedshiptoEditItems = [];
    this.selectedCarrierItems = [];
    this.selectedEditCarrierItems = [];

    this.settings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };
    this.Ordersettings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };
    this.editsetting = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 1,
      searchBy: ['itemName'],
      disabled: true
    };
    this.editsettings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };

    this.Materialsettings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 1
    };

    this.orderManagementService.OrderTypeList()
      .subscribe(
        data => {
          this.OrderTypeData = [];
          this.dataOrderTypes = data.data;
          let CustomerReturnIndex = this.dataOrderTypes.findIndex(d => d.code === "CustomerReturn");
          if (CustomerReturnIndex > -1) {
            this.dataOrderTypes.splice(CustomerReturnIndex, 1);
          }
          let CustomerToCustomerIndex = this.dataOrderTypes.findIndex(d => d.code === "CustomerToCustomer");
          if (CustomerToCustomerIndex > -1) {
            this.dataOrderTypes.splice(CustomerToCustomerIndex, 1);
          }
          let ChargeOrderIndex = this.dataOrderTypes.findIndex(d => d.code === "ChargeOrder");
          if (CustomerToCustomerIndex > -1) {
            this.dataOrderTypes.splice(ChargeOrderIndex, 1);
          }
          this.dataOrderTypes.map(item => {
            return {
              itemName: item.name,
              id: Number(item.id),
              code: item.code
            };
          }).forEach(x => this.OrderTypeData.push(x));
          this.orderManagement.OrderTypeId = this.OrderTypeId;
          this.orderManagement.ClientId = this.authenticationService.currentUserValue.ClientId;
          this.getShipToType();
          this.getShipFromType();
        });

    this.orderManagementService.GetCarrierList(this.authenticationService.currentUserValue.ClientId)
      .subscribe(
        data => {
          this.CarrierData = [];
          this.CarrierEditData = [];
          this.dataCarrier = data.data;
          this.dataCarrier.map(item => {
            return {
              itemName: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.CarrierData.push(x));
          this.CarrierEditData = this.CarrierData;
        });

    this.orderManagementService.EquipmentTypeData(this.regularOrderData)
      .subscribe(
        data => {
          this.EquipmentTypeData = [];
          this.dataEquipmentType = data.data;
          this.dataEquipmentType.sort((a, b) => a.name.localeCompare(b.name));
          this.dataEquipmentType.map(item => {
            return {
              itemName: item.name + " " + item.maxPalletQty + " Pallets",
              id: Number(item.id)
            };
          }).forEach(x => this.EquipmentTypeData.push(x));
        });

    this.buttonPermission();

    this.buttonBar.disableAction('saveAndNotify');
    this.getMessages();
  }


  onItemOrderTypeSelect(item: any) {
    //console.log(item);
    this.OrderTypeId = item.id;
    this.OrderTypeName = item.itemName;
    this.orderManagement.OrderTypeId = this.OrderTypeId;
    this.OrderTypeCode = this.dataOrderTypes.find(f => f.id == Number(this.OrderTypeId))?.code;
    this.orderManagement.OrderTypeCode = this.dataOrderTypes.find(f => f.id == Number(this.OrderTypeId))?.code;
    this.selectOrderType();
    this.BindMaterialList(this.OrderID, 0, Number(this.OrderTypeId));
    this.resetValidationCssforType();
  }
  OnItemDeOrderTypeSelect(item: any) {
    //console.log(item);
    this.shipfromtypelist = [];
    this.shiptotypelist = [];
    this.shiptotypeEditlist = [];
    this.shiptolist = [];
    this.shiptoEditlist = [];
    this.contactlist = [];
    this.editContactlist = [];
    this.contactfromlist = [];
    this.shipfromlist = [];
    this.selectedshipfromtypeItems = [];
    this.selectedshiptotypeItems = [];
    this.selectedshipfromItems = [];
    this.selectedshiptoItems = [];
    this.selectedshiptoEditItems = [];
    this.selectedCarrierItems = [];
    this.selectedEditCarrierItems = [];
    this.editContactlist = [];
    this.selectedMaterialItems = [];
    this.OQuantity = null;
    this.MPallets = null;
    this.EquivalentPallates = null;
    this.validatePallets = null;
    this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
    this.orderManagement.TransplaceOrderComment = "";
    this.orderManagement.TransplaceDeliveryComment = "";
    this.iscustomradio = false;

  }

  onItemOrderStatusSelect(item: any) {
    this.orderManagement.OrderStatusId = item.id;
    this.orderManagement.OrderStatusName = item.itemName;
    this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.id == this.orderManagement.OrderStatusId)?.code;
    if (this.orderBulkList.length > 0) {
      let orderBulkList = [];
      this.dataSourcefinal.data.map(f => {
        f.OrderStatusId = this.orderManagement.OrderStatusId;
        orderBulkList.push(f);
      });

      this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    }
    this.resetValidationCssforStatus();
  }
  OnItemOrderStatusDeSelect(item: any) {
    //console.log(item);
  }

  onItemshipfromtypeSelect(item: any) {
    //console.log(item);
    this.LoctionFuntionFromId = item.id;
    this.ShipFromTypeName = item.itemName;
    this.orderManagement.ShipFromTypeId = this.LoctionFuntionFromId;
    this.selectShipType();
    if (this.orderBulkList.length > 0) {
      let orderBulkList = [];
      this.dataSourcefinal.data.map(f => {
        f.ShipFromTypeId = this.orderManagement.ShipFromTypeId;
        f.ShipFromTypeName = this.ShipFromTypeName;
        orderBulkList.push(f);
      });

      this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    }
  }
  OnItemshipfromtypeDeSelect(item: any) {
    this.orderManagement.ShipFromTypeId = 0;
    this.shipfromlist = [];
    this.selectedshipfromtypeItems = [];
    this.selectedshipfromItems = [];
  }

  onItemShipFromSelect(item: any) {

    this.ShipFromId = item.id;
    this.orderManagement.FromLocationId = this.ShipFromId;
    this.FromLocationName = item.itemName;
    this.selectedFCTItems = [];
    this.selectShipFrom();

    if (this.orderBulkList.length > 0) {
      let orderBulkList = [];
      this.dataSourcefinal.data.map(f => {
        f.FromLocationId = this.orderManagement.FromLocationId;
        f.FromLocationName = this.FromLocationName;
        orderBulkList.push(f);
      });

      this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    }
  }
  OnItemShipFromDeSelect(item: any) {
    this.orderManagement.FromLocationId = 0;
    this.FromContractlist = [];
    this.selectedFCTItems = [];
  }
  onItemShiptotypeSelect(item: any) {

    this.LoctionFuntionToId = item.id;
    this.ShipToTypeName = item.itemName;
    this.orderManagement.ShipToTypeId = this.LoctionFuntionToId;
    this.selectShipToType();

  }
  OnItemShiptotypeDeSelect(item: any) {
    this.shiptolist = [];
    this.shiptoEditlist = [];
    this.selectedshiptotypeItems = [];
    this.selectedshiptoItems = [];
    this.selectedshiptoEditItems = [];
  }
  onItemShipToSelect(item: any) {
    //console.log(item);
    this.ShipToId = item.id;
    this.ShipToLocationName = item.itemName;
    this.orderManagement.ToLocationId = this.LoctionFuntionToId;
    this.selectedcontacttoItems = [];
    this.selectedshiptoEditItems = [];
    this.orderManagement.PurchaseOrderNumber = null;
    this.OQuantity = null;
    this.MPallets = null;
    this.selectedMaterialItems = [];
    this.isValidationPallets = true;
    //this.iscustomradio = false;
    this.selectedshiptoEditItems.push({ "id": item.id, "itemName": item.itemName });
    this.selectShipTo();
  }
  OnItemShipToDeSelect(item: any) {
    //console.log(item);
    this.selectedETDItems = [];
    this.MaterialDetails = [];
    this.contactlist = [];
    this.editContactlist = [];
    this.orderManagement.PurchaseOrderNumber = null;
    this.isValidationPallets = true;
    this.selectedcontacttoItems = [];
    this.OQuantity = null;
    this.MPallets = null;
    //this.iscustomradio = false;
    this.selectedMaterialItems = [];
    this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
  }

  selectOrderType() {
    this.getShipToType();
    this.getShipFromType();
    this.shiptolist = [];
    this.contactlist = [];
    this.editContactlist = [];
    this.contactfromlist = [];
    this.shipfromlist = [];
    this.selectedshipfromtypeItems = [];
    this.selectedshiptotypeItems = [];
    this.selectedshipfromItems = [];
    this.selectedFCTItems = [];
    this.selectedshiptoItems = [];
    this.selectedshiptoEditItems = [];
    this.selectedCarrierItems = [];
    this.selectedEditCarrierItems = [];
    this.selectedETDItems = [];
    this.selectedcontacttoItems = [];
    this.selectedMaterialItems = [];
    this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
    if (!this.isStatusSelected) {
      this.GetStatus(0);
    }
    // this.OrderTypeId;

    this.GetCarrier();

  }

  GetStatus(OrderId: number) {
    this.isStatusSelected = true;
    this.orderManagementService.OrderStatusList(OrderId, 0)
      .subscribe(
        data => {
          this.OrderStatuslist = [];
          this.OrderStatusData = data.data;
          //this.OrderStatuslist = Object.assign({}, datas);
          var datas = data.data;
          datas.map(item => {
            return {
              itemName: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.OrderStatuslist.push(x));
          this.orderManagement.OrderStatusId = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.id;
          this.orderManagement.OrderStatusCode = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.code;
          let statusname = this.OrderStatusData.find(f => f.code == GlobalConstants.OpenOrderNeedsToBeCompleted)?.name;
          //this.selectedOrderstatusItems = this.orderManagement.OrderStatusId;
          if (!!this.orderManagement.OrderStatusId) {
            this.selectedOrderstatusItems.push({ "id": this.orderManagement.OrderStatusId, "itemName": statusname });
          }

        });

  }

  GetCarrier() {
    let ordercode = this.dataOrderTypes.find(d => d.id === this.OrderTypeId)?.code;
    if (ordercode == "CPUOrder") {
      this.orderManagement.CarrierId = this.dataCarrier.find(f => f.code == 'CPU1')?.id;
      this.CarierName = this.dataCarrier.find(f => f.code == 'CPU1')?.name;
      if (!!this.orderManagement.CarrierId) {
        this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "itemName": this.CarierName });
      }
    }
    else if (ordercode != "CPUOrder") {
      this.orderManagement.CarrierId = this.dataCarrier.find(f => f.code == 'Transplace')?.id;
      this.CarierName = this.dataCarrier.find(f => f.code == 'Transplace')?.name;
      if (!!this.orderManagement.CarrierId) {
        this.selectedCarrierItems.push({ "id": this.orderManagement.CarrierId, "itemName": this.CarierName });
      }
    }
  }
  getShipToType() {

    if (!!this.OrderTypeId) {
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.orderManagement.ClientId;
      this.commonOrderModel.Action = 'shiptotype';
      this.orderManagementService.ShipTypeData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          this.filterShipToTypeModel = Object.assign({}, datas);
          this.shiptotypelist = [];
          this.shiptotypeEditlist = [];
          this.orderManagement.ShipToTypeId = 0;
          datas.map(item => {
            return {
              itemName: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.shiptotypelist.push(x));
          this.shiptotypeEditlist = this.shiptotypelist;
          if (datas.length == 1) {
            this.selectedshiptotypeItems.push({ "id": this.shiptotypelist[0].id, "itemName": this.shiptotypelist[0].itemName });
            this.LoctionFuntionToId = this.shiptotypelist[0].id;
            this.ShipToTypeName = this.shiptotypelist[0].itemName;
            this.orderManagement.ShipToTypeId = this.LoctionFuntionToId;
            this.selectShipToType();
          }
        });
    }
  }

  getShipFromType() {
    // this.OrderTypeId = this.OrderTypeData.find(f => f.code == this.orderManagement.SelectedOrderCode)?.id;
    if (!!this.OrderTypeId) {
      this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
      this.commonOrderModel.ClientID = this.orderManagement.ClientId;
      this.commonOrderModel.Action = 'shipfromtype';
      this.orderManagementService.ShipFromTypeData(this.commonOrderModel)
        .subscribe(result => {
          var datas = result.data;
          this.filterShipFromTypeModel = Object.assign({}, datas);
          this.shipfromtypelist = [];
          this.orderManagement.ShipFromTypeId = 0;
          datas.map(item => {
            return {
              itemName: item.name,
              id: Number(item.id)
            };
          }).forEach(x => this.shipfromtypelist.push(x));
        });
    }
  }

  selectShipType() {
    if (Number(this.LoctionFuntionFromId) != 0) {

      this.orderManagement.ShipFromTypeId = Number(this.LoctionFuntionFromId);
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'shipfrom';
        this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionFromId);
        var isPutCode: boolean = true;
        var wearHouse = this.shiptolist.find(x => Number(x.id) == Number(this.LoctionFuntionFromId))?.code;
        if (wearHouse != undefined && (wearHouse == 'Warehouse' || wearHouse == 'WashFacility')) {
          isPutCode = false;
        }
        this.orderManagementService.ShipFromData(this.commonOrderModel)
          .subscribe(result => {
            var datas = result.data;
            this.filterShipFromModel = datas;
            this.shipfromlist = [];
            datas.map(item => {
              return {
                itemName: isPutCode ? item.name + '-' + item.code : item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.shipfromlist.push(x));
          });
      }
    }
    else {
      this.orderManagement.ShipFromTypeId = 0;
      this.shipfromlist = [];
    }
  }

  selectShipToType() {
    if (Number(this.LoctionFuntionToId) != 0) {
      this.isDateExist = false;
      this.orderManagement.ShipToTypeId = Number(this.LoctionFuntionToId);
      if (!!this.OrderTypeId) {
        this.commonOrderModel.OrderTypeId = Number(this.OrderTypeId);
        this.commonOrderModel.ClientID = this.authenticationService.currentUserValue.ClientId;
        this.commonOrderModel.Action = 'shipto';
        this.commonOrderModel.LocationFunctionID = Number(this.LoctionFuntionToId);
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
            this.shiptoEditlist = [];
            datas.map(item => {
              return {
                itemName: isPutCode ? item.name + '-' + item.code : item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.shiptolist.push(x));
            this.shiptoEditlist = this.shiptolist;
          });
      }
    }
    else {
      this.orderManagement.ShipToTypeId = 0;
      this.shiptolist = [];
      this.shiptoEditlist = [];
    }
  }

  selectShipFrom() {
    if (Number(this.ShipFromId) != 0) {
      this.LocationId = Number(this.ShipFromId);
      this.orderManagement.FromAddres = this.filterShipFromModel.find(f => f.id == this.LocationId).fromLocationAddressName;
      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let RequestedDeliveryDate = year + "-" + month + "-" + date;
      this.Fromcontract(this.LocationId, RequestedDeliveryDate, Number(this.OrderTypeId));
    }
  }


  selectShipTo() {
    if (Number(this.ShipToId) != 0) {
      this.orderManagement.ToLocationId = Number(this.ShipToId);
      this.LocationId = Number(this.ShipToId);
      this.orderManagement.ToAddress = this.filterShipToModel.find(f => f.id == this.LocationId).toLocationAddressName;
      this.orderManagement.ToAddressId = this.filterShipToModel.find(f => f.id == this.LocationId).addressID;
      this.orderManagementAdjustCharges.DefaultCommodityID = this.filterShipToModel.find(f => f.id == this.LocationId).defaultCommodityID;
      this.orderManagement.ToLocationId = this.LocationId;
      this.OrganizationName = this.filterShipToModel.find(f => f.id == this.LocationId).organizationName;
      this.TotalPalates = 0;
      this.GetEquipment(Number(this.ShipToId), this.authenticationService.currentUserValue.ClientId);

      var equipmentSelected = setInterval(() => {
        //  ;
        if (this.SelectEquipment != undefined && this.SelectEquipment != null) {
          clearInterval(equipmentSelected);
          this.LocationMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          this.LocationShippingMaterial(this.orderManagement.ToLocationId, this.orderManagement.ClientId);
          let date_ob = new Date();
          let date = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let RequestedDeliveryDate = year + "-" + month + "-" + date;
          this.Tocontract(this.orderManagement.ToLocationId, RequestedDeliveryDate, Number(this.OrderTypeId))
        }

      }, 1000);

    }
  }

  LocationMaterial(LocationID: number, ClientID: number) {
    this.orderManagementService.LocationMaterial(LocationID, ClientID, GlobalConstants.EA, this.SelectEquipment)
      .subscribe(
        data => {
          if (data.data != null) {
            this.MaterialDetails = data.data;
            this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
            this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);
            var shippingCaculateMat = setTimeout(() => {
              this.AdjustShippingCalculate(0);

            }, 100);

            this.refershMaterial(this.MaterialDetails);
          }
        });
  }

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
          this.ShippingMaterialDetails[i].quantity = Number(sum);
          //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
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
          pallets: this.MPallets,
          materialId: getmaterial.id,
          propertyValue: this.OQuantity,
          code: this.SelectMaterialData.code,
        });
        this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
        this.orderManagementAdjustCharges.MaterialDetails = this.MaterialDetails;
        this.selection = new SelectionModel<PeriodicElement>(true, []);
        for (var i = 0; i < this.ShippingMaterialDetails.length; i++) {
          if (this.ShippingMaterialDetails[i].flag == 0) {
            this.ShippingMaterialDetails[i].quantity = this.ShippingMaterialDetails[i].quantity + cal3;

            this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            this.selection = new SelectionModel<PeriodicElement>(true, []);
          }
        }
      }
      else {
        // this.toastrService.success('Material quqntity is over.');
        var cal3 = Math.ceil(Number(this.OQuantity) / Number(this.SelectMaterialData.propertyValue));
        if (this.SelectMaterialData.code == "F23") {
          this.TotalPalates = this.TotalPalates - Number(cal3 * 2);
        }
        else {
          this.TotalPalates = this.TotalPalates - Number(cal3);
        }

        return false;
      }
    }
  }

  LocationShippingMaterial(LocationID: number, ClientID: number) {
    this.orderManagementService.LocationShippingMaterial(LocationID, ClientID, this.OrderID, this.OrderTypeId)
      .subscribe(
        data => {
          if (data.data != null) {
            this.ShippingMaterialDetails = data.data;
            this.orderManagementAdjustCharges.ShippingMaterialDetails = this.ShippingMaterialDetails;
            //this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails)
            //this.selection = new SelectionModel<PeriodicElement>(true, []);
          }
        });

  }

  Tocontract(LocationID: number, RequestDate: any, OrderTypeID: number) {

    this.ToContractlist = [];
    this.orderManagementService.Tocontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {

          var result = data.data;

          this.ToContractlist = result;

          var ordertype = this.dataOrderTypes.find(f => f.id == Number(this.OrderTypeId))?.code;


          this.SelectContractTo(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.ToLocationId));


        });
  }

  Fromcontract(LocationID: number, RequestDate: any, OrderTypeID: number) {
    this.orderManagementService.Fromcontract(LocationID, RequestDate, OrderTypeID)
      .subscribe(
        data => {
          var result = data.data;
          this.FromContractlist = [];
          result.map(item => {
            return {
              itemName: item.contractNumber,
              id: Number(item.id)
            };
          }).forEach(x => this.FromContractlist.push(x));
          this.orderManagement.FromContractId = this.FromContractlist[0].id;
          this.selectedFCTItems.push({ "id": this.FromContractlist[0].id, "itemName": this.FromContractlist[0].itemName });
        });

  }

  SelectContractTo(data: any[], OrderType: string, ClientID: number, LocationID: number) {
    let letdata: any;
    this.orderManagementService.ToSelectedContract(data, OrderType, ClientID, LocationID).pipe(
      finalize(() => {

        if (letdata != null || letdata != undefined) {
          this.contactlist = [];
          this.editContactlist = [];
          this.selectedcontacttoItems = [];
          this.selectededitcontacttoItems = [];
          data.map(item => {
            return {
              itemName: item.contractNumber,
              id: Number(item.id),
              ContractType: item.contractType
            };
          }).forEach(x => this.contactlist.push(x));
          this.orderManagement.ToContractId = letdata;
          var ToContract = this.contactlist.find(f => f.id == Number(letdata));
          this.ToContractName = ToContract.itemName;
          this.selectedcontacttoItems.push({ "id": ToContract.id, "itemName": ToContract.itemName });
          this.ContractNo = this.ToContractName;
          this.ContractType = ToContract.ContractType;
          this.editContactlist = this.contactlist;
          this.selectededitcontacttoItems.push({ "id": ToContract.id, "itemName": ToContract.itemName });

        }
        else {
          this.orderManagement.ToContractId = 0;
        }
      }))
      .subscribe(
        result => {
          letdata = result.data;
        });
  }


  SelectedContractFrom(data: any[], OrderType: string, ClientID: number, LocationID: number) {
    let letdata: any;
    this.orderManagementService.SelectedContractFrom(data, OrderType, ClientID, LocationID).pipe(
      finalize(() => {
        if (letdata != null || letdata != undefined) {
          if (!!!this.orderManagement.Id || this.orderManagement.Id == 0 || !!!this.orderManagement.FromContractId) {
            this.orderManagement.FromContractId = letdata;
          }
          else {
            this.orderManagement.FromContractId = this.orderManagement.FromContractId;
          }
        }
        else {
          this.orderManagement.FromContractId = 0;
        }
      }))
      .subscribe(
        result => {
          letdata = result.data;
        });
  }


  GetEquipment(LocationId: any, ClientId: any) {
    this.orderManagementService.GetEquipment(LocationId, ClientId)
      .subscribe(
        data => {
          this.SelectEquipment = data.data.id;
          if (this.SelectEquipment > 0) {
            this.selectedETDItems = [];
            this.Equipmentvalidate = false;
            var dd = this.EquipmentTypeData.find(f => f.id == this.SelectEquipment);
            // this.GetFreightMode(this.SelectEquipment, this.orderManagement.ClientId);
            this.orderManagement.EquipmentTypeId = dd.id;
            this.EquipmentTypeName = dd.itemName;
            this.selectedETDItems.push({ "id": dd.id, "itemName": dd.itemName });
            this.EquivalentPallates = this.dataEquipmentType.find(p => p.id == dd.id)?.maxPalletQty;
          }
        });
  }

  BindMaterialList(orderID, sectionID, OrderTypeId) {
    this.orderManagementService.GetOrderMaterialList(orderID, sectionID, OrderTypeId)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            let Materialdatas = result.data == undefined ? result.Data : result.data;
            this.MaterialData = [];
            Materialdatas.map(item => {
              return {
                itemName: item.name,
                id: Number(item.id)
              };
            }).forEach(x => this.MaterialData.push(x));
            this.MaterialDataBackup = Materialdatas;
          }
        }
      );
  }

  OnSelectedmaterial(event) {
    this.orderManagementService.MaterialQuantity(this.orderManagement.EquipmentTypeId, Number(event), this.authenticationService.currentUserValue.ClientId, "Number of Units in an Equipment")
      .subscribe(
        data => {
          if (data.data != null) {

            this.Mpallet = data.data.pallets;
            this.OQuantity = data.data.quantity;
            this.SelectMaterialData = data.data;
            this.OCode = data.data.code;
          }
          else {
            this.OQuantity = null;
          }

        });
    this.EditFlag = false;
  }

  CancelMaterial() {
    this.OQuantity = null;
    this.MPallets = null;
    this.selectedMaterialItems = [];
  }

  onItemETSelect(item: any) {
    this.orderManagement.EquipmentTypeId = item.id;
    this.orderManagement.equipmentTypeName = item.itemName;
    this.EquipmentTypeName = this.orderManagement.equipmentTypeName;
  }
  OnItemETDeSelect(item: any) {
    //console.log(item);
  }
  onItemConToSelect(item: any) {
    this.orderManagement.ToContractId = item.id;
    this.ContractNo = item.itemName;
    this.ToContractName = item.itemName;
  }
  OnItemConToDeSelect(item: any) {
    this.selectedcontacttoItems = [];
  }

  onItemFCTSelect(item: any) {
    this.orderManagement.FromContractId = item.id;
    this.FromContractName = item.itemName;
  }
  OnItemFCTDeSelect(item: any) {
    // console.log(item);
  }

  onItemMaterialDataSelect(item: any) {
    this.orderManagement.adjustChargesSectionMaterialID = item.id;
    this.MaterialId = item.id;
    this.MaterialName = item.itemName;
    this.OnSelectedmaterial(item.id);
    this.validationPallets(this.MPallets);
  }

  OnItemMaterialDataDeSelect(item: any) {
    //console.log(item);
    this.MaterialId = 0;
    this.OQuantity = null;
    this.MPallets = null;
  }

  onItemCarrierSelect(item: any) {
    this.orderManagement.CarrierId = item.id;
    this.CarierName = item.itemName;
  }
  OnItemCarrierDeSelect(item: any) {
    // console.log(item);
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
  //material table code
  missingMaterialProerptyColumn = ['materialName', 'materialWeight', 'unitInPallet',
    'unitInEquipement', 'palletInEquipement'];
  MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>();
  MissingMaterialPropertyData: MaterialPropertyGrid[] = [];

  displayedColumnsAddMaterial = ['materialID', 'name', 'propertyValue', 'quantity', 'pallets'];
  dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  displayedColumnsfinal = ['Index',
    'OrderNum',
    'Organization',
    'shipToLocationName',
    'materialName',
    'orderQuantity',
    'RequestedDeliveryDate',
    'ScheduledShipDate',
    'MustArriveByDate',
    'PONum',
    'EquipNum',
    'TransplaceOrderComment',
    'TransplaceDeliveryComment',
    'ContractType',
    'ContractNo',
    'Carrier'];
  dataSourcefinal = new MatTableDataSource<BulkOrderManagement>();
  selectionfinal = new SelectionModel<BulkOrderManagement>(true, []);

  displayedColumnsEdit = ['MaterialDescription', 'TruckOrderQty', 'PalletQty'];
  dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>();
  //selection3 = new SelectionModel<EditFinalElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSourceAddMaterial.paginator = this.paginator;
    this.dataSourceAddMaterial.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceAddMaterial.filter = filterValue;
  }

  constructor(private router: Router,
    private orderManagementAdjustCharges: OrderManagementAdjustChargesService,
    private orderManagementService: OrderManagementService,
    private toastrService: ToastrService, private authenticationService: AuthService,
    private orderCommonService: OrdermanagementCommonOperation) {
    this.minDate = this.setDateMMddyyyy(new Date());
  }


  validation(event: any) {
    let PurchaseOrderNumber = event.target.value.trim();
    if (!!PurchaseOrderNumber) {
      const re = /^[A-Za-z0-9-,. ]*$/;
      if (!(re.test(String(PurchaseOrderNumber).toLowerCase()))
        && !!PurchaseOrderNumber && PurchaseOrderNumber) {
        PurchaseOrderNumber = PurchaseOrderNumber.toString().substring(0, PurchaseOrderNumber.length - 1);
        event.target.value = PurchaseOrderNumber;
      }
    }
    this.orderManagement.PurchaseOrderNumber = PurchaseOrderNumber;
    this.validationPallets(this.MPallets);
  }

  CancelOrderLocations() {
    this.isMultiple = true;
    this.selectedshiptotypeItems = [];
    this.selectedshiptoItems = [];
    this.selectedETDItems = [];
    this.selectedcontacttoItems = [];
    this.selectedshiptoEditItems = [];
  }
  singleOrderLocations() {
    this.isMultiple = false;
  }

  validationPallets(Pallets: string) {
    var flag = false;
    this.isPallets = false;
    this.isValidationPallets = false;
    if (!!Pallets) {
      var exced = this.onValidationPallets();
      if (exced < 0) {
        
        this.toastrService.error(this.getMessage("RequestPalletquantityexceed") + this.EquivalentPallates);
        this.isValidationPallets = true;
        return false;
      }
      if (this.validatePallets < Number(Pallets) && Number(Pallets) >= 0) {
        if (!flag) {
          this.toastrService.error(this.getMessage("RequestPalletquantityexceed") + this.EquivalentPallates);
        }
        flag = true;
        this.isValidationPallets = true;
      }
    } else {
      this.isValidationPallets = true;
    }
    if (!!!Pallets || !!!this.MaterialId || !!!this.validatePallets) {
      this.isValidationPallets = true;
    }
    if (!this.isMultiple) {
      if ((!!!this.OrderTypeId && this.OrderTypeId == 0)
        || (!!!this.orderManagement.OrderStatusId && this.orderManagement.OrderStatusId == 0)
        || (!!!this.LoctionFuntionToId && this.LoctionFuntionToId == 0)
        || (!!!this.ShipToId && this.ShipToId == 0)
        || (!!!this.orderManagement.EquipmentTypeId && this.orderManagement.EquipmentTypeId == 0)
        || (!!!this.orderManagement.PurchaseOrderNumber)
        || (!!!this.MaterialId && this.MaterialId == 0)
        || (Number(Pallets) <= 0) || this.isPONo
      ) {

        this.isValidationPallets = true;
      }
    }
    if (this.isMultiple) {
      if ((!!!this.OrderTypeId && this.OrderTypeId == 0)
        || (!!!this.orderManagement.OrderStatusId && this.orderManagement.OrderStatusId == 0)
        || (!!!this.orderManagement.EquipmentTypeId && this.orderManagement.EquipmentTypeId == 0)
        || (!!!this.orderManagement.PurchaseOrderNumber)
        || (!!!this.MaterialId && this.MaterialId == 0)
        || (Number(Pallets) <= 0) || this.isPONo
      ) {
        this.isValidationPallets = true;
      }
    }


    return this.isValidationPallets;
  }

  missingproperty() {
    let materialiDs: string = '';
    let materialId: string = '';
    this.dataSourceAddMaterial.data.filter(x => {
      materialiDs += `${x.materialID},`;
    });
    if (materialiDs.length > 0) {
      materialiDs = materialiDs.substring(0, materialiDs.length - 1);
    }
    materialId = materialiDs;
    let data: any;
    this.orderManagementService.FindMissingMaterialPropertyOrder(materialId, this.orderManagement.EquipmentTypeId)
      .pipe(
        finalize(() => {
          if (!!data && data.length > 0) {
            $("#compilePopup").modal('show');
            this.MissingMaterialPropertyData = <MaterialPropertyGrid[]>data;
            this.MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>(data);
          }
          else {
            $("#compilePopup").modal('hide');
            this.saveallmaterialProperties();
          }
        }),
      )
      .subscribe(
        result => {
          data = result.data;
        });
  }


  calculate() {
    this.Iscalculate = true;
    if (!this.CheckOrdervalidation()) {
      return;
    }
    var code = this.OrderStatusData.find(f => f.id == Number(this.orderManagement.OrderStatusId))?.code;
    if (code == 'SendforShipping') {
      if (!!!this.orderManagement.ShipFromTypeId && !!!this.orderManagement.FromLocationId) {
        if (this.selectedshipfromtypeItems.length == 0) {
          this.toastrService.error(this.getMessage("RequiredShipFromType"));
          this.isCheckOrderValidation = false;
          return;
        }
        else if (this.selectedshipfromItems.length == 0) {
          this.toastrService.error(this.getMessage("RequiredShipFromLocation"));
          this.isCheckOrderValidation = false;
          return;
        }
      }
    }
    if (!!!this.numerOfOrders || this.numerOfOrders <= 0 || this.numerOfOrders > 100) {
      this.toastrService.error(this.getMessage("RequiredOrderNumber"));
      return;
    }
    if (this.dataSourceAddMaterial.data.length > 0) {
      let sumOfPallets: number = 0;
      this.dataSourceAddMaterial.data.map(p => {
        sumOfPallets += p.pallets;
      });
      if (sumOfPallets > this.EquivalentPallates) {
        
        this.toastrService.error(this.getMessage("RequiredExceedTruckLoad")); 
        return;
      }
    }
    //.
    this.missingproperty();

  }

  LoadCalculate() {
    if (!this.Ordervalidation()) {
      this.isValidationPallets = false;
      if (!!this.dataSourceAddMaterial) {
        this.orderSummaryList = [];
        this.orderBulkList = [];
        this.dataSourceAddMaterial.data.forEach(item => {
          let orderSummary: BulkOrderManagement = new BulkOrderManagement();
          orderSummary.materialName = item.name;
          orderSummary.orderQuantity = item.quantity * this.numerOfOrders;
          this.orderSummaryList.push(orderSummary);
        });
        let Index: number = 1;
        for (var i = 1; i <= this.numerOfOrders; i++) {
          let IsDisableCount = 0;
          this.dataSourceAddMaterial.data.forEach(item => {
            IsDisableCount++;
            let orderBulk: BulkOrderManagement = new BulkOrderManagement();
            orderBulk.Index = Index;
            orderBulk.OrderNum = i;
            orderBulk.IsDisable = IsDisableCount > 1;
            if (this.OrderTypeCode == 'StockTransfer' || this.OrderTypeCode == 'Collections') {
              orderBulk.ScheduledShipDate = this.setDateMMddyyyy(new Date());
            }
            else {
              orderBulk.RequestedDeliveryDate = this.setDateMMddyyyy(new Date());
            }
            orderBulk.materialID = item.materialID;
            orderBulk.materialName = item.name;
            orderBulk.orderQuantity = item.quantity;
            orderBulk.shipToLocationName = this.ShipToLocationName;
            orderBulk.equipmentTypeName = this.EquipmentTypeName;
            orderBulk.orderTypeName = this.OrderTypeName;
            orderBulk.Carrier = !!!this.CarierName ? "" : this.CarierName;
            orderBulk.OrderTypeId = this.orderManagement.OrderTypeId;
            orderBulk.FromLocationId = this.orderManagement.FromLocationId;
            orderBulk.ToLocationId = this.orderManagement.ToLocationId;
            orderBulk.OrderStatusId = this.orderManagement.OrderStatusId;
            orderBulk.ClientId = this.orderManagement.ClientId;
            orderBulk.EquipmentTypeId = this.orderManagement.EquipmentTypeId;
            orderBulk.ShipFromLocationContactId = this.orderManagement.ShipFromLocationContactId;
            orderBulk.CarrierId = this.orderManagement.CarrierId;
            orderBulk.ShipToLocationContactId = this.orderManagement.ShipToLocationContactId;
            orderBulk.FromCustomerContractId = this.orderManagement.FromCustomerContractId;
            orderBulk.ToCustomerContractId = this.orderManagement.ToContractId;
            orderBulk.FromBusinessPartnerContractId = this.orderManagement.FromBusinessPartnerContractId;
            orderBulk.ToBusinessPartnerContractId = this.orderManagement.ToBusinessPartnerContractId;
            orderBulk.PONum = this.orderManagement.PurchaseOrderNumber;
            orderBulk.TransplaceOrderComment = this.orderManagement.TransplaceOrderComment;
            orderBulk.TransplaceDeliveryComment = this.orderManagement.TransplaceDeliveryComment;
            orderBulk.ShipFromTypeId = this.orderManagement.ShipFromTypeId;
            orderBulk.FromAddressId = this.orderManagement.FromAddressId;
            orderBulk.ToAddressId = this.orderManagement.ToAddressId;
            orderBulk.AllocatedFreightCharge = this.orderManagement.AllocatedFreightCharge;
            orderBulk.SupressEmailConfirmation = this.orderManagement.SupressEmailConfirmation;
            orderBulk.Comments = this.orderManagement.Comments;
            orderBulk.FromAddres = this.orderManagement.FromAddres;
            orderBulk.FromContractId = this.orderManagement.FromContractId;
            orderBulk.ShipToTypeId = this.orderManagement.ShipToTypeId;
            orderBulk.ContractNo = this.ContractNo;
            orderBulk.CreatedBy = this.authenticationService.currentUserValue.LoginId;
            orderBulk.MaterialName = item.name;
            orderBulk.ShipToLocationName = this.ShipToLocationName;
            orderBulk.ShipToTypeName = this.ShipToTypeName;
            orderBulk.ToContractName = this.ToContractName;
            orderBulk.ShipFromTypeName = this.ShipFromTypeName;
            orderBulk.FromContractName = this.FromContractName;
            orderBulk.FromLocationName = this.FromLocationName;
            orderBulk.EquipmentTypeName = this.EquipmentTypeName;

            orderBulk.EquivalentPallets = item.pallets;
            orderBulk.ContractType = this.ContractType;
            orderBulk.Organization = this.OrganizationName;
            orderBulk.propertyValue = Number(item.propertyValue);

            this.orderBulkList.push(orderBulk);
            Index++;
          });

        }
        this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(this.orderBulkList);
        //this.iscalculates = true;
        //this.isEditPallets = true;
        //this.isDeletePallets = true;
        this.isSubmit = false;
      }
    }
  }


  issavepropety: boolean = true;
  AddMaterial() {
    this.Iscalculate = false;
    if (!this.CheckOrdervalidation()) {
      return;
    }
    if (!this.isValidationPallets) {
      this.isValidationPallets = true;

      if (!!!this.MaterialId || !!!this.MPallets) {
        this.isValidationPallets = true;
        return false;
      }

      this.orderManagementService.VerifyEquipmentMaterialPropertyOrder(this.MaterialId, this.orderManagement.EquipmentTypeId)
        .subscribe(
          data => {
            this.editOrderMaterila = '';
            var result = data.data;
            this.editVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();
            result.map(f => {
              this.editVerifyEquipmentMaterialProperty.equipmentTypeName = this.EquipmentTypeName;
              this.editVerifyEquipmentMaterialProperty.materialName = f.materialName;
              this.editVerifyEquipmentMaterialProperty.materialID = f.materialID;
              this.editVerifyEquipmentMaterialProperty.code = f.code;
              this.editVerifyEquipmentMaterialProperty.id = f.id;
              this.editVerifyEquipmentMaterialProperty.equipmentTypeID = f.equipmentTypeID;
              this.editVerifyEquipmentMaterialProperty.materialWeight = !!!f.materialWeight ? 0 : f.materialWeight;
              if (f.code == 'Number of Units on a Pallet') {
                this.editVerifyEquipmentMaterialProperty.propertyValueUP = !!!f.propertyValue ? 0 : f.propertyValue;
                this.editVerifyEquipmentMaterialProperty.idUP = f.id;
                this.editVerifyEquipmentMaterialProperty.codeUP = f.code;
              }
              if (f.code == 'Number of Pallets in an Equipment') {
                this.editVerifyEquipmentMaterialProperty.propertyValuePE = !!!f.propertyValue ? 0 : f.propertyValue;
                this.editVerifyEquipmentMaterialProperty.idPE = f.id;
                this.editVerifyEquipmentMaterialProperty.codePE = f.code;
              }
              if (f.code == 'Number of Units in an Equipment') {
                this.editVerifyEquipmentMaterialProperty.propertyValueUE = !!!f.propertyValue ? 0 : f.propertyValue;
                this.editVerifyEquipmentMaterialProperty.idUE = f.id;
                this.editVerifyEquipmentMaterialProperty.codeUE = f.code;
              }
            });

            if (this.editVerifyEquipmentMaterialProperty.materialWeight == 0
              || this.editVerifyEquipmentMaterialProperty.propertyValueUP == 0
              || this.editVerifyEquipmentMaterialProperty.propertyValuePE == 0
              || this.editVerifyEquipmentMaterialProperty.propertyValueUE == 0) {

              this.editOrderMaterila = "#editOrderMaterila";
              this.issavepropety = true;
              $("#editOrderMaterila").modal('show');
            }

            if (!!!this.editOrderMaterila && this.editOrderMaterila != '#editOrderMaterila') {
              this.editPropertyvalue = this.editVerifyEquipmentMaterialProperty.propertyValueUP.toString();
              this.OQuantity = this.editVerifyEquipmentMaterialProperty.propertyValueUE.toString();
              this.VerifyEquipmentMaterialPropertyOrder();
              $("#editOrderMaterila").modal('hide');
            }
          });
    }
  }
  VerifyEquipmentMaterialPropertyOrder() {
    if (this.editPropertyvalue != "") {
      this.SelectMaterialData.propertyValue = this.editPropertyvalue;
      this.editPropertyvalue = "";
    }
    //if (this.SelectMaterialData.propertyValue != "" || this.SelectMaterialData.propertyValue != "0") {

    let materialList: any = {
      bagFlag: this.SelectMaterialData.bagFlag,
      code: this.SelectMaterialData.code,
      flag: this.SelectMaterialData.flag,
      materialID: this.MaterialId,
      name: this.MaterialName,
      pallets: Number(this.MPallets),
      propertyValue: Number(this.OQuantity),
      quantity: Number(this.SelectMaterialData.propertyValue) * Number(this.MPallets),
      shippedQuantity: this.SelectMaterialData.shippedQuantity,
      uomcode: this.SelectMaterialData.uomcode,
      uomid: this.SelectMaterialData.uomid
    };

    if (this.isEditMaterials) {
      let data: any = [];
      data = this.dataSourceAddMaterial.data;
      data.map(x => {
        if (x.materialID === this.MaterialId) {
          x.bagFlag = this.SelectMaterialData.bagFlag;
          x.code = this.SelectMaterialData.code;
          x.flag = this.SelectMaterialData.flag;
          x.materialID = this.MaterialId;
          x.name = this.MaterialName;
          x.pallets = Number(this.MPallets);
          x.propertyValue = Number(this.OQuantity);
          x.IsSeleted = false;
          x.quantity = this.SelectMaterialData.propertyValue * Number(this.MPallets);
          x.shippedQuantity = this.SelectMaterialData.shippedQuantity;
          x.uomcode = this.SelectMaterialData.uomcode;
          x.uomid = this.SelectMaterialData.uomid;
        }
      });

      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(data);
      this.isValidationPallets = true;
      this.existingMaterialId = '';
      this.MaterialId = 0;
      this.MaterialName = '';
      this.refershMaterial(data);
    }
    else {
      let data: any = [];
      this.dataSourceAddMaterial.data.forEach(x =>
        data.push(x)
      );

      data.push(materialList);
      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(data);
      this.isValidationPallets = true;
      this.refershMaterial(data);

    }
    this.CancelMaterial();
    this.isEditMaterials = false;
    this.iscustomradio = true;

  }

  refershMaterial(data: any = []) {
    this.MaterialData = [];
    this.MaterialDataBackup.map(item => {
      return {
        itemName: item.name,
        id: Number(item.id)
      };
    }).forEach(x => this.MaterialData.push(x));

    if (!!data) {
      let sumOfPallets: number = 0;
      data.map(p => {
        if (p.code != "F23") {
          sumOfPallets += p.pallets;
        }
        else {
          sumOfPallets += (p.pallets * 2);
        }
      });

      this.validatePallets = this.EquivalentPallates - sumOfPallets;
      //+ (!!this.MPallets ? Number(this.MPallets) : 0)

      if (!!this.validatePallets && this.validatePallets == NaN) {
        this.validatePallets = this.EquivalentPallates;
      }
      if (!!this.MaterialData) {
        data.filter(item => {
          let index = this.MaterialData.findIndex(x => x.id == item.materialID && item.materialID != Number(this.existingMaterialId));
          if (index > -1) {
            this.MaterialData.splice(index, 1);
          }
        });
      }
    }
  }

  Ordervalidation() {
    if (!this.isMultiple) {
      if (this.OrderTypeId != 0 && this.orderManagement.OrderStatusId != 0 && this.orderManagement.EquipmentTypeId != 0
        && this.orderManagement.PurchaseOrderNumber != "" && !this.isPONo
        && this.numerOfOrders != 0) {
        this.isSaveOrder = false;
        this.iscustomradio = true;
        this.settings = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          searchBy: ['itemName'],
          disabled: true
        };
      }
    }
    if (this.isMultiple) {
      if (this.OrderTypeId != 0 && this.LoctionFuntionToId != 0 &&
        this.ShipToId != 0 && this.orderManagement.OrderStatusId != 0 && this.orderManagement.EquipmentTypeId != 0
        && this.orderManagement.PurchaseOrderNumber != "" && !this.isPONo
        && this.numerOfOrders != 0) {
        this.isSaveOrder = false;
        this.iscustomradio = true;
        this.settings = {
          singleSelection: true,
          text: "Select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          addNewItemOnFilter: false,
          badgeShowLimit: 1,
          searchBy: ['itemName'],
          disabled: true
        };
      }
    }
    return this.isSaveOrder;
  }

  saveBulkOrder() {
    this.Iscalculate = true;
    if (!this.CheckOrdervalidation()) {
      return;
    }
    var code = this.OrderTypeData.find(f => f.id == Number(this.OrderTypeId))?.code;
    var codeStatus = this.OrderStatusData.find(f => f.id == Number(this.orderManagement.OrderStatusId))?.code;
    if (codeStatus == 'SendforShipping') {
      if (!!!this.orderManagement.ShipFromTypeId && !!!this.orderManagement.FromLocationId) {
        if (this.selectedshipfromtypeItems.length == 0) {
          this.toastrService.error(this.getMessage("RequiredShipFromType"));
          this.isCheckOrderValidation = false;
          return;
        }
        else if (this.selectedshipfromItems.length == 0) {
          this.toastrService.error(this.getMessage("RequiredShipFromLocation"));
          this.isCheckOrderValidation = false;
          return;
        }        
        
      }
    }
    let data = this.dataSourcefinal.data;
    let orderManagements: BulkSalesOrder[] = [];
    data.map(item => {
      let orderManagementDetails: BulkSalesOrder = new BulkSalesOrder();
      //if (item.RequestedDeliveryDate != undefined && item.RequestedDeliveryDate != null)
      //{
      //  orderManagementDetails.RequestedDeliveryDate = this.orderCommonService.convertDatetoStringDate(item.RequestedDeliveryDate);
      //}
      //if (item.ScheduledShipDate != undefined && item.ScheduledShipDate != null) {
      //  orderManagementDetails.ScheduledShipDate = this.orderCommonService.convertDatetoStringDate(item.ScheduledShipDate);
      //}
      //if (item.MustArriveByDate != undefined && item.MustArriveByDate != null) {
      //  orderManagementDetails.MustArriveByDate = this.orderCommonService.convertDatetoStringDate(item.MustArriveByDate);
      //}
      orderManagementDetails.RequestedDeliveryDate = item.RequestedDeliveryDate == undefined ? '' : this.orderCommonService.convertDatetoStringDate(item.RequestedDeliveryDate);
      orderManagementDetails.ScheduledShipDate = item.ScheduledShipDate == undefined ? '' : this.orderCommonService.convertDatetoStringDate(item.ScheduledShipDate);
      orderManagementDetails.MustArriveByDate = item.MustArriveByDate == undefined ? '' : this.orderCommonService.convertDatetoStringDate(item.MustArriveByDate);
      //orderManagementDetails.RequestedDeliveryDate = new Date(this.orderCommonService.convertDatetoStringDate(item.RequestedDeliveryDate));
      //orderManagementDetails.ScheduledShipDate = item.ScheduledShipDate;
      //orderManagementDetails.MustArriveByDate = item.MustArriveByDate;
      orderManagementDetails.PurchaseOrderNumber = item.PONum;
      orderManagementDetails.TrailerNumber = item.EquipNum == undefined ? '' : item.EquipNum;
      orderManagementDetails.MaterialID = item.materialID;
      //orderManagementDetails.CarrierId = item.CarrierId == 0 || !!!item.CarrierId ? null : item.CarrierId;
      orderManagementDetails.CarrierId = item.CarrierId;
      orderManagementDetails.ToLocationId = item.ToLocationId;
      orderManagementDetails.ShipToTypeId = item.ShipToTypeId;
      orderManagementDetails.ToContractId = item.ToCustomerContractId;
      orderManagementDetails.TransplaceOrderComment = item.TransplaceOrderComment == undefined ? '' : item.TransplaceOrderComment;
      orderManagementDetails.TransplaceDeliveryComment = item.TransplaceDeliveryComment == undefined ? '' : item.TransplaceDeliveryComment;
      orderManagementDetails.CreatedBy = item.CreatedBy;
      orderManagementDetails.OrderNumber = item.OrderNum.toString();
      orderManagementDetails.OrderStatusId = item.OrderStatusId;
      orderManagementDetails.OrderTypeId = item.OrderTypeId;
      orderManagementDetails.EquipmentTypeId = item.EquipmentTypeId;
      orderManagementDetails.ClientId = item.ClientId;
      orderManagementDetails.ShipFromTypeId = item.ShipFromTypeId == undefined ? item.ShipFromTypeId : item.ShipFromTypeId;
      orderManagementDetails.FromCustomerContractId = item.FromContractId == undefined ? item.FromContractId : item.FromContractId;
      orderManagementDetails.FromLocationId = item.FromLocationId == undefined ? item.FromLocationId : item.FromLocationId;
      if (this.isChecked == true) {
        orderManagementDetails.SupressEmailConfirmation = "1";
      }
      else {
        orderManagementDetails.SupressEmailConfirmation = "0";
      }
      orderManagementDetails.Code = code;
      orderManagementDetails.OrderQuantity = item.orderQuantity;
      orderManagementDetails.MaterialName = item.MaterialName;
      orderManagementDetails.ToLocationName = item.ShipToLocationName;
      orderManagementDetails.ShipToTypeName = item.ShipToTypeName;
      orderManagementDetails.ToContractName = item.ToContractName;
      orderManagementDetails.ShipFromTypeName = item.ShipFromTypeName;
      orderManagementDetails.FromContractName = item.FromContractName;
      orderManagementDetails.FromLocationName = item.FromLocationName;
      orderManagementDetails.EquipmentTypeName = item.EquipmentTypeName;
      orderManagementDetails.Carrier = item.Carrier;
      orderManagementDetails.EquivalentPallets = item.EquivalentPallets;
      orderManagementDetails.ContractType = item.ContractType == undefined ? this.ContractType : item.ContractType;
      orderManagementDetails.Organization = item.Organization == undefined ? this.OrganizationName : item.Organization;
      orderManagementDetails.PropertyValue = Number(item.propertyValue);
      orderManagementDetails.ExternalReferenceNumber = 0;
      orderManagementDetails.OrderSourceSystem = "BulkOrder";
      orderManagements.push(orderManagementDetails);
    });

    this.orderManagementService.SaveBulkOrder(orderManagements, this.SendNotification)
      .subscribe(
        data => {
          if (data.data != null) {

            if (this.SendNotification)
              this.toastrService.success(this.getMessage("OrderSavedNotification"));
            else
              this.toastrService.success(this.getMessage("Ordersaved"));

            let result = data.data;
            // result.sort((a, b) => a.bulkOrderID.localeCompare(b.bulkOrderID));
            let orderBulkList = [];
            this.dataSourcefinal.data.forEach(item => {
              let orderSummary: BulkOrderManagement = new BulkOrderManagement();
              orderSummary = item;
              var OrderNumber = result.find(f => f.code == item.OrderNum && f.materialID == item.materialID)?.orderNumber;
              var Index = result.find(f => f.code == item.OrderNum && f.materialID == item.materialID)?.index;
              if (!!OrderNumber) {
                orderSummary.OrderNum = OrderNumber;
                orderSummary.Index = Index;
              }
              orderBulkList.push(orderSummary);
              this.isSubmit = true;
              this.isFinalEdit = true;
              this.isFinalDelete = true;
              this.iscalculates = true;
              this.isEditPallets = true;
              this.isDeletePallets = true;
            });
            orderBulkList = orderBulkList.sort((n1, n2) => n1.Index - n2.Index);
            this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
          }
        });
  }


  selectAllMaterial(check: any) {
    this.selection.clear();
    this.isAllMaterialSelected = check.checked;
    this.dataSourceAddMaterial.data.forEach(row => {
      row.IsSeleted = this.isAllMaterialSelected;
      this.selection.toggle(row);
    });
    this.setUserCheckBoxData();
  }

  selectCheckbox(value: any) {
    this.selection.toggle(value);
    this.dataSourceAddMaterial.data.forEach(row => {
      if (row.materialID == value.materialID)
        row.IsSeleted = !value.IsSeleted;
    });
    this.isAllMaterialSelected = (this.dataSourceAddMaterial.data.length === (this.dataSourceAddMaterial.data.filter(x => x.IsSeleted == true).length));
    this.setUserCheckBoxData();
  }

  setUserCheckBoxData() {
    let iDs: string = '';
    this.dataSourceAddMaterial.data.filter(x => {
      if (x.IsSeleted == true) iDs += `${x.materialID},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.existingMaterialId = iDs;
  }

  DeleteMaterial() {
    if (!!!this.existingMaterialId) {
      return;
    }
    else if (!!this.dataSourceAddMaterial.data) {
      let existing = this.existingMaterialId.split(',');
      let data = this.dataSourceAddMaterial.data;
      let sumOfPallets: number = 0;
      existing.filter(item => {
        let index = data.findIndex(x => x.materialID == Number(item));
        let values = data.find(x => x.materialID == Number(item));
        if (!!values)
          sumOfPallets += values.pallets;
        if (index > -1) {
          data.splice(index, 1);
        }
      });
      this.validatePallets = this.validatePallets + Number(sumOfPallets);
      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(data);

      this.refershMaterialAfter(data);
      this.isSaveOrder = true;
      this.MaterialId = 0;
      this.iscustomradio = false;
      if (!!this.dataSourceAddMaterial) {
        this.validatePallets = this.EquivalentPallates;
        this.MPallets = null;
        this.OQuantity = null;
        this.isAllMaterialSelected = false;
        this.orderSummaryList = [];
        this.orderBulkList = [];
        this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(this.orderBulkList);
      }
    }

  }

  EditMaterial() {
    this.isEditMaterials = true;
    this.selectedMaterialItems = [];
    if (!!!this.existingMaterialId) {
      return;
    }
    else if (!!this.dataSourceAddMaterial.data) {
      let existing = this.existingMaterialId.split(',');
      if (existing.length > 1) {
        return;
      }
      else {
        var editMaterialdata;
        let data = this.dataSourceAddMaterial.data;
        existing.filter(item => {
          editMaterialdata = data.find(x => x.materialID == Number(item));
        });


        //this.validatePallets = this.EquivalentPallates - sumOfPallets;

        this.MPallets = editMaterialdata.pallets;
        this.OQuantity = editMaterialdata.propertyValue;
        this.MaterialId = editMaterialdata.materialID;
        this.MaterialName = editMaterialdata.name;
        this.validatePallets = this.validatePallets + Number(this.MPallets);
        this.selectedMaterialItems.push({ "id": editMaterialdata.materialID, "itemName": editMaterialdata.name });
        this.OnSelectedmaterial(this.MaterialId);
      }
      //this.refershMaterialAfter(this.dataSourceAddMaterial.data);
      this.validationPallets(this.MPallets);
    }
  }

  selectAllFinal(check: any) {
    this.selectionfinal.clear();
    this.isAllFinalSelected = check.checked;
    this.dataSourcefinal.data.forEach(row => {
      if (!row.IsDisable) {
        row.IsfinalSeleted = this.isAllFinalSelected;
      }

      this.selectionfinal.toggle(row);
    });
    this.setFinalCheckBoxData();
  }

  selectFinalCheckbox(value: any) {
    this.selectionfinal.toggle(value);
    this.dataSourcefinal.data.forEach(row => {
      if (row.Index == value.Index && row.IsDisable == false)
        row.IsfinalSeleted = !value.IsfinalSeleted;
    });
    this.isAllMaterialSelected = (this.dataSourcefinal.data.length === (this.dataSourcefinal.data.filter(x => x.IsfinalSeleted == true && x.IsDisable == false).length));
    this.setFinalCheckBoxData();
  }

  setFinalCheckBoxData() {
    let iDs: string = '';
    this.dataSourcefinal.data.filter(x => {
      if (!x.IsDisable) {
        if (x.IsfinalSeleted == true) iDs += `${x.Index},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.existingfinalId = iDs;
  }

  setDateMMddyyyy(date: Date) {
    return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  }

  onRequestedDate(value: any, event) {
    let RequestedDeliveryDate = event;
    this.TocontractRequeste(this.orderManagement.ToLocationId,
      RequestedDeliveryDate, Number(this.OrderTypeId), value);
  }

  onScheduledShipDate(value: any) {
    var result = this.dataSourcefinal.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: BulkOrderManagement = new BulkOrderManagement();
      orderSummary = f;
      if (f.OrderNum == value.OrderNum && f.materialID != value.materialID) {
        orderSummary.ScheduledShipDate = this.setDateMMddyyyy(value.ScheduledShipDate);

      }
      orderBulkList.push(orderSummary);
    });

    this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    this.submitValidation();
  }

  onMustArriveDate(value: any) {
    var result = this.dataSourcefinal.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: BulkOrderManagement = new BulkOrderManagement();
      orderSummary = f;
      if (f.OrderNum == value.OrderNum && f.materialID != value.materialID) {
        orderSummary.MustArriveByDate = this.setDateMMddyyyy(value.MustArriveByDate);
      }
      orderBulkList.push(orderSummary);
    });

    this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    this.submitValidation();
  }

  onPONum(value: any, event) {
    let PONum = event.target.value.trim();
    if (!!PONum) {
      const re = /^[A-Za-z0-9-,. ]*$/;
      if (!(re.test(String(PONum).toLowerCase()))
        && !!PONum && PONum) {
        PONum = PONum.toString().substring(0, PONum.length - 1);
        event.target.value = PONum;
      }
      //this.orderManagement.PurchaseOrderNumber = PONum;
    }
    value.PONum = PONum;
    //var result = this.dataSourcefinal.data;
    let orderBulkList = [];
    this.dataSourcefinal.data.map(f => {
      //let orderSummary: BulkOrderManagement = new BulkOrderManagement();      
      if (f.OrderNum == value.OrderNum) {
        f.PONum = value.PONum;
      }

      orderBulkList.push(f);
    });

    this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    this.submitValidation();


  }

  onEquipNo(value: any, event) {
    let EquipNum = event.target.value.trim();
    if (!!EquipNum) {
      const re = /^[A-Za-z0-9]*$/;
      if (!(re.test(String(EquipNum).toLowerCase()))
        && !!EquipNum && EquipNum) {
        EquipNum = EquipNum.toString().substring(0, EquipNum.length - 1);
        event.target.value = EquipNum;
      }
    }
    value.EquipNum = EquipNum;

    var result = this.dataSourcefinal.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: BulkOrderManagement = new BulkOrderManagement();
      orderSummary = f;
      if (f.OrderNum == value.OrderNum && f.materialID != value.materialID) {
        orderSummary.EquipNum = value.EquipNum;
      }
      orderBulkList.push(orderSummary);
    });

    this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
    this.submitValidation();
  }

  submitValidation() {
    this.isSubmit = false;
    this.dataSourcefinal.data.map(x => {
      if (this.OrderTypeCode == 'StockTransfer' || this.OrderTypeCode == 'Collections') {
        if (!!!x.ScheduledShipDate || !!!x.PONum) {
          this.isSubmit = true;
        }
      }
      else {
        if (!!!x.RequestedDeliveryDate || !!!x.PONum) {
          this.isSubmit = true;
        }
      }
      if (!!x.RequestedDeliveryDate && !!x.ScheduledShipDate && !!x.MustArriveByDate) {
        if (x.RequestedDeliveryDate > x.ScheduledShipDate || x.ScheduledShipDate > x.MustArriveByDate) {
          // this.isSubmit = true;
          //  document.getElementById('RequestedDeliveryDate').style.background = "#ffc0cb";
        }
      }
      if (!!x.RequestedDeliveryDate && !!x.ScheduledShipDate) {
        if (x.RequestedDeliveryDate < x.ScheduledShipDate) {
          //this.isSubmit = true;
          //document.getElementById('RequestedDeliveryDate').style.background = "#ffc0cb";
        } else {
          //document.getElementById('RequestedDeliveryDate').style.background = "#ffffff";
        }
      }
      if (!!x.RequestedDeliveryDate && !!x.MustArriveByDate) {
        if (x.RequestedDeliveryDate < x.MustArriveByDate) {
          //this.isSubmit = true;
          // document.getElementById('RequestedDeliveryDate').style.background = "#ffc0cb";
        } else {
          //document.getElementById('RequestedDeliveryDate').style.background = "#ffffff";
        }
      }
      if (!!x.ScheduledShipDate && !!x.MustArriveByDate) {
        if (x.ScheduledShipDate > x.MustArriveByDate) {
          this.isSubmit = true;
          //.
          this.toastrService.warning(this.getMessage("SSGreaterThanMAByDate"));
        }
      }


      if (!!x.RequestedDeliveryDate) {
        //const dates = "(?:(?:0[1-9]|1[0-2])[\/\\-. ]?(?:0[1-9]|[12][0-9])|(?:(?:0[13-9]|1[0-2])[\/\\-. ]?30)|(?:(?:0[13578]|1[02])[\/\\-. ]?31))[\/\\-. ]?(?:19|20)[0-9]{2}";
      }


    });

  }

  TocontractRequeste(LocationID: number, RequestDate: any, OrderTypeID: number, value: any) {
    var ToContractId: number;
    var results = this.dataSourcefinal.data;
    let orderBulkList = [];
    this.orderManagementService.Tocontract(LocationID, RequestDate, OrderTypeID)
      .subscribe(
        data => {
          var result = data.data;
          this.finalcontactlist = [];
          //this.selectedcontacttoItems = [];
          result.map(item => {
            return {
              itemName: item.contractNumber,
              id: Number(item.id),
              ContractType: item.contractType
            };
          }).forEach(x => this.finalcontactlist.push(x));
          if (result.length > 0) {
            ToContractId = this.finalcontactlist[0].id;
            this.ToContractName = this.finalcontactlist[0].itemName;
            ////this.selectedcontacttoItems.push({ "id": this.contactlist[0].id, "itemName": this.contactlist[0].itemName });
            this.ContractNo = this.finalcontactlist[0].itemName;
            this.ContractType = this.finalcontactlist[0].ContractType;
          }
          else {
            ToContractId = 0;
            this.ToContractName = '';
            ////this.selectedcontacttoItems.push({ "id": this.contactlist[0].id, "itemName": this.contactlist[0].itemName });
            this.ContractNo = '';
            this.ContractType = '';
          }
          results.map(f => {
            let orderSummary: BulkOrderManagement = new BulkOrderManagement();
            orderSummary = f;
            if (f.OrderNum == value.OrderNum) {
              orderSummary.RequestedDeliveryDate = this.setDateMMddyyyy(value.RequestedDeliveryDate);
              orderSummary.ContractType = this.ContractType;
              orderSummary.ToContractName = this.ToContractName;
              orderSummary.ToCustomerContractId = ToContractId;
            }
            orderBulkList.push(orderSummary);
          });
          this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
          this.submitValidation();
        });
  }

  onItemeditConToSelect(item: any) {
    var result = this.dataSourcefinalEdit.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: EditFinalElement = new EditFinalElement();
      orderSummary = f;
      if (f.OrderNum == this.OrderNumEdit) {
        orderSummary.ToCustomerContractId = item.id;
        orderSummary.ToContractName = item.itemName;
      }
      orderBulkList.push(orderSummary);
    });
    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(orderBulkList);
  }
  OnItemeditConToDeSelect(item: any) {
    this.selectededitcontacttoItems = [];
  }
  onItemEditCarrierSelect(item: any) {
    var result = this.dataSourcefinalEdit.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: EditFinalElement = new EditFinalElement();
      orderSummary = f;
      if (f.OrderNum == this.OrderNumEdit) {

        orderSummary.CarrierId = item.id;
        orderSummary.Carrier = item.itemName;
      }
      orderBulkList.push(orderSummary);
    });
    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(orderBulkList);
  }
  OnItemEditCarrierDeSelect(item: any) {
    this.selectedEditCarrierItems = [];
  }

  EditFinalOrder() {
    this.selectedMaterialItems = [];
    if (!!!this.existingfinalId) {
      this.editOrder = "";
      return;
    }
    else if (!!this.dataSourcefinal.data) {
      let existing = this.existingfinalId.split(',');
      if (existing.length > 1) {
        this.editOrder = "";
        return;
      }
      else {
        this.editOrder = "editOrder";
        var editMaterialdata;
        let data = this.dataSourcefinal.data;
        existing.filter(item => {
          editMaterialdata = data.find(x => x.Index == Number(item));
        });
        var results = this.dataSourcefinal.data;
        this.orderEditBulkList = [];
        this.orderMeterialBulkList = [];
        this.selectedshiptotypeItems = [];
        this.selectedshiptoEditItems = [];
        this.selectededitcontacttoItems = [];
        this.selectedEditCarrierItems = [];
        results.map(f => {
          if (f.OrderNum == Number(editMaterialdata.OrderNum) && f.Index == Number(editMaterialdata.Index) && f.IsDisable == false) {
            let orderSummary: BulkOrderManagement = new BulkOrderManagement();
            orderSummary = f;
            this.selectedshiptotypeItems.push({ "id": f.ShipToTypeId, "itemName": f.ShipToTypeName });
            this.selectedshiptoEditItems.push({ "id": f.ToLocationId, "itemName": f.ShipToLocationName });
            this.selectededitcontacttoItems.push({ "id": f.ToCustomerContractId, "itemName": f.ToContractName });
            this.selectedEditCarrierItems.push({ "id": f.CarrierId, "itemName": f.Carrier });
            this.OrderNumEdit = f.OrderNum;
          }
          if (f.OrderNum == Number(editMaterialdata.OrderNum)) {
            this.ediFinalElement = new EditFinalElement();
            this.ediFinalElement.MaterialDescription = f.materialName;
            this.ediFinalElement.TruckOrderQty = f.orderQuantity;
            this.ediFinalElement.PalletQty = f.EquivalentPallets;
            this.ediFinalElement.OrderNum = f.OrderNum;
            this.ediFinalElement.materialID = f.materialID;
            this.ediFinalElement.ToCustomerContractId = f.ToCustomerContractId;
            this.ediFinalElement.ToContractName = f.ToContractName;
            this.ediFinalElement.CarrierId = f.CarrierId;
            this.ediFinalElement.Carrier = f.Carrier;
            this.ediFinalElement.TransplaceOrderComment = f.TransplaceOrderComment;
            this.ediFinalElement.TransplaceDeliveryComment = f.TransplaceDeliveryComment;
            this.ediFinalElement.PropertyValue = f.propertyValue;
            this.orderMeterialBulkList.push(this.ediFinalElement);
          }
        });
      }
    }
    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(this.orderMeterialBulkList);
  }

  DeleteEditMaterial() {
    if (!!!this.existingfinalId) {
      return;
    }
    else if (!!this.dataSourcefinal.data) {
      let existing = this.existingfinalId.split(',');
      let data = this.dataSourcefinal.data;
      existing.filter(item => {
        let index = data.findIndex(x => x.Index == Number(item));
        let orderNumber = data.find(x => x.Index == Number(item))?.OrderNum;
        if (index > -1) {
          data.splice(index, 1);
        }
        let existingData = data.findIndex(x => x.OrderNum == orderNumber);
        if (existingData > -1) {
          data[existingData].IsDisable = false;
        }
      });
      this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(data);
    }
  }

  onTransplaceOrderComment(event: any) {
    var result = this.dataSourcefinalEdit.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: EditFinalElement = new EditFinalElement();
      orderSummary = f;
      if (f.OrderNum == this.OrderNumEdit) {
        orderSummary.TransplaceOrderComment = event;
      }
      orderBulkList.push(orderSummary);
    });

    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(orderBulkList);
  }

  onTransplaceDeliveryComment(event: any) {
    var result = this.dataSourcefinalEdit.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: EditFinalElement = new EditFinalElement();
      orderSummary = f;
      if (f.OrderNum == this.OrderNumEdit) {
        orderSummary.TransplaceDeliveryComment = event;
      }
      orderBulkList.push(orderSummary);
    });

    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(orderBulkList);
  }

  onTruckOrderQty(event: any) {
    this.isValidationPallets = false;
    var Editresult = this.dataSourcefinalEdit.data;
    var finalresult = this.dataSourcefinal.data;
    if (!!Editresult) {
      let sumOfPallets: number = 0;
      let code: string = '';
      let quantity: number = 0;
      let PalletoldQty: number = 0;
      code = this.MaterialDetails.find(p => p.materialID == event.materialID)?.code;
      quantity = finalresult.find(p => p.OrderNum == this.OrderNumEdit && p.materialID == event.materialID)?.orderQuantity;
      PalletoldQty = finalresult.find(p => p.OrderNum == this.OrderNumEdit && p.materialID == event.materialID)?.EquivalentPallets;
      var orderEditBulkList = [];
      let TruckOrderQty;
      let PalletQty;

      Editresult.map(f => {
        let orderSummary: EditFinalElement = new EditFinalElement();
        orderSummary = f;
        if (f.OrderNum == this.OrderNumEdit && f.materialID == event.materialID) {
          TruckOrderQty = event.TruckOrderQty;
          PalletQty = Math.ceil(event.TruckOrderQty / event.PropertyValue);
          if (code != "F23") {
            sumOfPallets += PalletQty
          }
          else {
            sumOfPallets += (PalletQty * 2)
          }
          this.validatePallets = this.EquivalentPallates - sumOfPallets;
          if (!!this.validatePallets && this.validatePallets == NaN) {
            this.validatePallets = this.EquivalentPallates;
          }
          this.TotalPalates;
          this.validatePallets;
          this.checktotalPallets = this.validatePallets;
          if (this.checktotalPallets < Number(PalletQty) && Number(PalletQty) > 0) {
            this.isValidationPallets = true;
            orderSummary.TruckOrderQty = quantity;
            orderSummary.PalletQty = PalletoldQty;

          }
          else {
            orderSummary.TruckOrderQty = TruckOrderQty;
            orderSummary.PalletQty = PalletQty;
            this.validatePallets = + orderSummary.PalletQty;
          }
        }
        orderEditBulkList.push(orderSummary);
      });
    }
    this.dataSourcefinalEdit = new MatTableDataSource<EditFinalElement>(orderEditBulkList);
  }

  SaveUpdatedRecord() {
    let data = this.dataSourcefinalEdit.data;
    var result = this.dataSourcefinal.data;
    let orderBulkList = [];
    result.map(f => {
      let orderSummary: BulkOrderManagement = new BulkOrderManagement();
      orderSummary = f;
      let editMaterialdata = data.find(x => x.OrderNum == Number(this.OrderNumEdit) && x.materialID == f.materialID
        && x.OrderNum == f.OrderNum);
      if (!!editMaterialdata) {
        orderSummary.MaterialDescription = editMaterialdata.MaterialDescription;
        orderSummary.materialName = editMaterialdata.MaterialDescription;
        orderSummary.orderQuantity = editMaterialdata.TruckOrderQty;
        orderSummary.EquivalentPallets = editMaterialdata.PalletQty;
        orderSummary.OrderNum = editMaterialdata.OrderNum;
        orderSummary.materialID = editMaterialdata.materialID;
        orderSummary.ToCustomerContractId = editMaterialdata.ToCustomerContractId;
        orderSummary.ToContractName = editMaterialdata.ToContractName;
        orderSummary.CarrierId = editMaterialdata.CarrierId;
        orderSummary.Carrier = editMaterialdata.Carrier;
        orderSummary.TransplaceOrderComment = editMaterialdata.TransplaceOrderComment;
        orderSummary.TransplaceDeliveryComment = editMaterialdata.TransplaceDeliveryComment;
      }

      orderBulkList.push(orderSummary);
    });
    this.dataSourcefinal = new MatTableDataSource<BulkOrderManagement>(orderBulkList);
  }

  SavePropertyRecord() {
    $("#editOrderMaterila").modal('hide');
    this.editOrderMaterila = "";
    this.editPropertyvalue = "";
    this.issavepropety = false;
    let orderVerification: SaveVerifyEquipmentMaterialProperty = new SaveVerifyEquipmentMaterialProperty();
    orderVerification.createdBy = this.authenticationService.currentUserValue.LoginId;
    orderVerification.clientID = this.authenticationService.currentUserValue.ClientId;
    if (!!this.editVerifyEquipmentMaterialProperty.propertyValueUP) {
      orderVerification.materialWeight = this.editVerifyEquipmentMaterialProperty.materialWeight;
      orderVerification.materialID = this.editVerifyEquipmentMaterialProperty.materialID;
      orderVerification.equipmentTypeID = this.editVerifyEquipmentMaterialProperty.equipmentTypeID;
      orderVerification.propertyValueUP = this.editVerifyEquipmentMaterialProperty.propertyValueUP;
      this.editPropertyvalue = this.editVerifyEquipmentMaterialProperty.propertyValueUP.toString();
      orderVerification.idUP = this.editVerifyEquipmentMaterialProperty.idUP;
      orderVerification.propertiesUOMUP = "EA";
      orderVerification.codeUP = this.editVerifyEquipmentMaterialProperty.codeUP;
    }
    if (!!this.editVerifyEquipmentMaterialProperty.propertyValuePE) {
      orderVerification.idPE = this.editVerifyEquipmentMaterialProperty.idPE;
      orderVerification.propertyValuePE = this.editVerifyEquipmentMaterialProperty.propertyValuePE;
      orderVerification.propertiesUOMPE = "Pallets";
      orderVerification.codePE = this.editVerifyEquipmentMaterialProperty.codePE;
    }
    if (!!this.editVerifyEquipmentMaterialProperty.propertyValueUE) {
      orderVerification.idUE = this.editVerifyEquipmentMaterialProperty.idUE;
      orderVerification.propertyValueUE = this.editVerifyEquipmentMaterialProperty.propertyValueUE;
      this.OQuantity = this.editVerifyEquipmentMaterialProperty.propertyValueUE.toString();
      orderVerification.propertiesUOMUE = "EA";
      orderVerification.codeUE = this.editVerifyEquipmentMaterialProperty.codeUE;
    }

    this.orderManagementService.SaveUpdateVerifyEquipmentMaterial(orderVerification)
      .subscribe(
        data => {
          if (data.data != null) {
            
            this.toastrService.success(this.getMessage("RequestSaveSuccess"));
            this.VerifyEquipmentMaterialPropertyOrder();
          }
        });
  }

  GetEquipNum(event) {
    let EquipNum;
    if (event.data == 'e' || event.data == 'E') {
      EquipNum = event.target.value.trim() ? "" : event.data;
    }
    else {
      EquipNum = event.target.value.trim();
    }
    if (!!EquipNum) {
      const re = /^[0-9]*$/;
      if (!(re.test(String(EquipNum).toLowerCase()))
        && !!EquipNum && EquipNum) {
        EquipNum = EquipNum.toString().substring(0, EquipNum.length - 1);
        event.target.value = EquipNum;
      }
    }
    return EquipNum;
  }

  onMaterialWeight(event) {
    let EquipNum = this.GetEquipNum(event);
    this.editVerifyEquipmentMaterialProperty.materialWeight = Number(EquipNum);
    if (this.editVerifyEquipmentMaterialProperty.materialWeight > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUP > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValuePE > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUE > 0) {
      this.issavepropety = false;
    }
    else {
      this.issavepropety = true;
    }

  }

  onEAPerPallet(event) {
    let EquipNum = this.GetEquipNum(event);
    this.editVerifyEquipmentMaterialProperty.propertyValueUP = Number(EquipNum);
    if (this.editVerifyEquipmentMaterialProperty.materialWeight > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUP > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValuePE > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUE > 0) {
      this.issavepropety = false;
    }
    else {
      this.issavepropety = true;
    }
  }

  onUnitinEquipment(event) {
    let EquipNum = this.GetEquipNum(event);
    this.editVerifyEquipmentMaterialProperty.propertyValueUE = Number(EquipNum);
    if (this.editVerifyEquipmentMaterialProperty.materialWeight > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUP > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValuePE > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUE > 0) {
      this.issavepropety = false;
    }
    else {
      this.issavepropety = true;
    }
  }

  onNoofPalletUnitinEquipment(event) {
    let EquipNum = this.GetEquipNum(event);
    this.editVerifyEquipmentMaterialProperty.propertyValuePE = Number(EquipNum);
    if (this.editVerifyEquipmentMaterialProperty.materialWeight > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUP > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValuePE > 0
      && this.editVerifyEquipmentMaterialProperty.propertyValueUE > 0) {
      this.issavepropety = false;
    }
    else {
      this.issavepropety = true;
    }
  }

  saveallmaterialProperties() {

    var selectedMaterialProperties: MaterialPropertyGrid[] = [];
    var ErrorMessage = "";
    var isErrorFound: boolean = false;
    this.MissingMaterialPropertyData.forEach((value, index) => {
      if (value.materialWeight <= 0) {
        let out = this.getMessage("RequestWeightMaterial");
        ErrorMessage = ErrorMessage + out + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {
        let out = this.getMessage("RequestUnitPallets");
        ErrorMessage = ErrorMessage + out + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {
        let out = this.getMessage("RequestPalletsinEquipment");
        ErrorMessage = ErrorMessage + out + value.materialName;
        isErrorFound = true;
      }

      if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {
       let out= this.getMessage("RequestunitPalletsinEquipment");
        ErrorMessage = ErrorMessage + out + value.materialName;
        isErrorFound = true;
      }
      selectedMaterialProperties.push({
        equipmentID: Number(this.orderManagement.EquipmentTypeId),
        materialID: value.materialID,
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
          this.LoadCalculate();
        }
        else {

          this.toastrService.error(this.getMessage("RequestTechnicalIssue"));
        }

      });
    }
  }

  close() {
    this.closeBulk.emit();
  }


  refershMaterialAfter(data: any = []) {
    this.MaterialData = [];
    this.MaterialDataBackup.map(item => {
      return {
        itemName: item.name,
        id: Number(item.id)
      };
    }).forEach(x => this.MaterialData.push(x));

    if (!!data) {

      if (!!this.MaterialData) {
        data.filter(item => {
          let index = this.MaterialData.findIndex(x => x.id == item.materialID && item.materialID != this.existingMaterialId)
          if (index > -1) {
            this.MaterialData.splice(index, 1);
          }
        });
      }
    }
  }

  onValidationPallets(): number {
    let sumOfPallets: number = 0;
    if (this.OCode != "F23") {
      if (!!this.validatePallets) {
        sumOfPallets = this.validatePallets - Number(this.MPallets);
      }
      else {
        sumOfPallets = this.EquivalentPallates - Number(this.MPallets);
      }

    }
    else {
      if (!!this.validatePallets) {

        sumOfPallets = this.validatePallets - (Number(this.MPallets) * 2);
      }
      else {
        sumOfPallets = this.EquivalentPallates - (Number(this.MPallets) * 2);
      }

    }

    return sumOfPallets;
  }

  resetValidationCssforType() {
    if (this.IsCustomerReturn || this.IsStockTransfer || this.IsCollections) {
      document.getElementById('selectedshipfromtype').setAttribute('required', null);
      document.getElementById('selectedshipfrom').setAttribute('required', null);
      document.getElementById('selectedshiptotype').setAttribute('required', null);
      document.getElementById('selectedshipto').setAttribute('required', null);
    }
    else {
      document.getElementById('selectedshipfromtype').removeAttribute('required');
      document.getElementById('selectedshipfrom').removeAttribute('required');
      document.getElementById('selectedshiptotype').setAttribute('required', null);
      document.getElementById('selectedshipto').setAttribute('required', null);
    }


  }
  resetValidationCssforStatus() {
    if (this.IsSendforShipping) {
      document.getElementById('selectedshipfromtype').setAttribute('required', null);
      document.getElementById('selectedshipfrom').setAttribute('required', null);
    }
    else {
      document.getElementById('selectedshipfromtype').removeAttribute('required');
      document.getElementById('selectedshipfrom').removeAttribute('required');
    }
  }

  editPopupMaterial(value: any) {
    this.orderManagementService.VerifyEquipmentMaterialPropertyOrder(value.materialID, this.orderManagement.EquipmentTypeId)
      .subscribe(
        data => {
          this.editOrderMaterila = '';
          var result = data.data;
          this.editVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();
          result.map(f => {
            this.editVerifyEquipmentMaterialProperty.equipmentTypeName = this.EquipmentTypeName;
            this.editVerifyEquipmentMaterialProperty.materialName = f.materialName;
            this.editVerifyEquipmentMaterialProperty.materialID = f.materialID;
            this.editVerifyEquipmentMaterialProperty.code = f.code;
            this.editVerifyEquipmentMaterialProperty.id = f.id;
            this.editVerifyEquipmentMaterialProperty.equipmentTypeID = f.equipmentTypeID;
            this.editVerifyEquipmentMaterialProperty.materialWeight = !!!f.materialWeight ? 0 : f.materialWeight;
            if (f.code == 'Number of Units on a Pallet') {
              this.editVerifyEquipmentMaterialProperty.propertyValueUP = !!!f.propertyValue ? 0 : f.propertyValue;
              this.editVerifyEquipmentMaterialProperty.idUP = f.id;
              this.editVerifyEquipmentMaterialProperty.codeUP = f.code;
            }
            if (f.code == 'Number of Pallets in an Equipment') {
              this.editVerifyEquipmentMaterialProperty.propertyValuePE = !!!f.propertyValue ? 0 : f.propertyValue;
              this.editVerifyEquipmentMaterialProperty.idPE = f.id;
              this.editVerifyEquipmentMaterialProperty.codePE = f.code;
            }
            if (f.code == 'Number of Units in an Equipment') {
              this.editVerifyEquipmentMaterialProperty.propertyValueUE = !!!f.propertyValue ? 0 : f.propertyValue;
              this.editVerifyEquipmentMaterialProperty.idUE = f.id;
              this.editVerifyEquipmentMaterialProperty.codeUE = f.code;
            }
          });

          if (this.editVerifyEquipmentMaterialProperty.materialWeight == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValueUP == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValuePE == 0
            || this.editVerifyEquipmentMaterialProperty.propertyValueUE == 0) {

            this.editOrderMaterila = "#showOrderMaterila";
            this.issavepropety = true;
            $("#showOrderMaterila").modal('show');
          }

          if (!!!this.editOrderMaterila && this.editOrderMaterila != '#showOrderMaterila') {
            this.editPropertyvalue = this.editVerifyEquipmentMaterialProperty.propertyValueUP.toString();
            this.OQuantity = this.editVerifyEquipmentMaterialProperty.propertyValueUE.toString();
            //this.VerifyEquipmentMaterialPropertyOrder();
            $("#showOrderMaterila").modal('show');
          }
        });
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
            }
            else {
              this.regularOrderHasReadOnlyAccess = true;
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


  CheckOrdervalidation() {
    this.isCheckOrderValidation = true;
    if (!!!this.orderManagement.OrderTypeId || this.selectedOrderType.length == 0) {
      this.toastrService.error(this.getMessage("RequiredOrderType"));
      this.isCheckOrderValidation = false;
      return;
    }
    else if (!!!this.orderManagement.OrderStatusId || this.selectedOrderstatusItems.length == 0) {
      this.toastrService.error(this.getMessage("RequiredOrderStatus"));
      this.isCheckOrderValidation = false;
      return;
    }

    else if (this.orderManagement.OrderTypeCode == 'StockTransfer' || this.orderManagement.OrderTypeCode == 'Collections') {

      if (this.selectedshipfromtypeItems.length == 0) {
        this.toastrService.error(this.getMessage("RequiredShipFromType"));
        this.isCheckOrderValidation = false;
        return;
      }
      else if (this.selectedshipfromItems.length == 0) {
        this.toastrService.error(this.getMessage("RequiredShipFromLocation"));
        this.isCheckOrderValidation = false;
        return;
      }

      else if (this.selectedshiptotypeItems.length == 0) {
       
        this.toastrService.error(this.getMessage("RequiredShipToType"));
        this.isCheckOrderValidation = false;
        return;
      }
      else if (this.selectedshiptoItems.length == 0) {
       
        this.toastrService.error(this.getMessage("RequiredShipToLocation"));
        this.isCheckOrderValidation = false;
        return;
      }
      else if (this.selectedETDItems.length == 0) {
        this.toastrService.error(this.getMessage("RequiredEquipmentType"));
        this.isCheckOrderValidation = false;
        return;
      }
      else if (!this.orderManagement.PurchaseOrderNumber) {
        
       
        this.toastrService.error(this.getMessage("RequiredPONumber"));
        this.isCheckOrderValidation = false;
        return;
      }
      else if (this.dataSourceAddMaterial.data.length == 0 && this.Iscalculate) {
        
          this.toastrService.error(this.getMessage("RequiredOrderDetail"));
        //this.toastrService.error("Please enter valid Material Unit on a Pallet for Material.");
        this.isCheckOrderValidation = false;
        return;
      }
    }

    else if (this.selectedshiptotypeItems.length == 0) {
    
      this.toastrService.error(this.getMessage("RequiredShipToType"));
     // this.toastrService.error("Please select ship to type.");
      this.isCheckOrderValidation = false;
      return;
    }
    else if (this.selectedshiptoItems.length == 0) {
      
      this.toastrService.error(this.getMessage("RequiredShipToLocation"));
      //this.toastrService.error("Please select ship to location.");
      this.isCheckOrderValidation = false;
      return;
    }
    else if (this.selectedETDItems.length == 0) {
     
      this.toastrService.error(this.getMessage("RequiredEquipmentType"));
     // this.toastrService.error("Please select equipment type.");
      this.isCheckOrderValidation = false;
      return;
    }
    else if (!this.orderManagement.PurchaseOrderNumber) {
     
      this.toastrService.error(this.getMessage("RequiredPONumber"));
     // this.toastrService.error("Please enter purchase order number.");
      this.isCheckOrderValidation = false;
      return;
    }
    else if (this.dataSourceAddMaterial.data.length == 0 && this.Iscalculate) {
     
      this.toastrService.error(this.getMessage("RequiredOrderDetail"));
      this.isCheckOrderValidation = false;
      return;
    }


    return this.isCheckOrderValidation;
  }


  getMessages() {
    this.orderManagementService.getMessageByModuleCodeForOrder("Ord", this.authenticationService.currentUserValue.ClientId).subscribe(
      result => {
        if (result.data) {
          this.alertMessages = result.data;
        }
      }
    );
  }
  getMessage(messageCode: string) {
    if (!!this.alertMessages) {
      return this.alertMessages.find(x => x.code == messageCode)?.message1;
    }
    return '';
  }
}

