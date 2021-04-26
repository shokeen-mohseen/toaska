/// <reference path="add-new.component.spec.ts" />
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { AngularEditorConfig } from '@kolkov/angular-editor';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import JsBarcode from 'jsbarcode/bin/JsBarcode';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { SelectItem } from 'primeng/api';
import { projectkey } from '../../../../../environments/projectkey';
import { CommonShipModel, EditVerifyEquipmentMaterialProperty, FinalShipmentAdjustChargesModel, MaterialPropertyGrid, ShipmentAdjustChargesModel } from '../../../../core/models/regularOrder.model';
import { CommonListViewModel, ShipmentMaterialDeatails } from '../../../../core/models/shipmentworkbench.model';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderManagementAdjustChargesService } from '../../../../core/services/order-management-AdjustCharges.service';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var $: any;
export interface PeriodicElement {
  route: number;
  OrderNum: number;
  FromLocation: string;
  ToLocation: string;
  ReqDeliveryDate: string;
  MustArriveByDate: string;
  ActualDeliveryDate: string;
  TravelTime: string;
  DeliveryAppointment: string;
  PickupAppointment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    route: 11,
    OrderNum: 527576.0,
    FromLocation: 'VGS - SALINAS [VEGETABLE GROWERS SUPPLY CO INC]',
    ToLocation: '4029-1 - Rouge River Produce ( Southern Valley) [Southern Valley Fruit and Ve]',
    ReqDeliveryDate: '09/16/2020',
    MustArriveByDate: '',
    ActualDeliveryDate: '2/29/2020',
    TravelTime: '5',
    PickupAppointment: '1/25/2020',
    DeliveryAppointment: '',
  }

];
export interface ChargeSummary {
  BusinessPartner: string;
  BillingEntity: string;
  ChargeType: string;
  ContractAmount: number;
  ModifiedAmount: number;
  UOM: string;
}

const ELEMENT_DATA1: ChargeSummary[] = [
  {
    BusinessPartner: 'CVQC - C.L. SERVICES, INC.',
    BillingEntity: 'C.L. SERVICES, INC.',
    ChargeType: 'Linehaul',
    ContractAmount: 0.00,
    ModifiedAmount: 729.80,
    UOM: 'USD'
  },
  {
    BusinessPartner: 'CVQC - C.L. SERVICES, INC.',
    BillingEntity: 'C.L. SERVICES, INC.',
    ChargeType: 'Stopoff Charge',
    ContractAmount: 0.00,
    ModifiedAmount: 75.00,
    UOM: 'USD'
  },
];

export interface apCharges {
  BusinessPartner: string;
  BillingEntity: string;
  ChargeType: string;
  ContractAmount: number;
  ModifiedAmount: number;
  UOM: string;
  SalesTax: string;
  AutoAdded: string;
}
const ELEMENT_DATA2: apCharges[] = [
  {
    BusinessPartner: 'CVQC - C.L. SERVICES, INC.',
    BillingEntity: 'C.L. SERVICES, INC.',
    ChargeType: 'Linehaul',
    ContractAmount: 0.00,
    ModifiedAmount: 729.80,
    UOM: 'USD',
    SalesTax: 'Non-Taxable',
    AutoAdded: 'NO',
  }
];

export interface shipReceiving {
  OrderNum: number;
  Material: string;
  Commodity: string;
  OrderQuantity: number;
  ShippedQuantity: number;
  QuantityDiff: number;
  PriceMethod: string;
  ShowOnBOL: string;
  ShipToLocation: string;
}
const ELEMENT_DATA3: shipReceiving[] = [
  {
    OrderNum: 143238.0,
    Material: 'WW-PALLET',
    Commodity: 'Eggs',
    OrderQuantity: 20,
    ShippedQuantity: 0,
    QuantityDiff: 20,
    PriceMethod: 'Non-Taxable',
    ShowOnBOL: 'No',
    ShipToLocation: '60676 - Gemperle Schendel Nucal (KR)'
  },
  {
    OrderNum: 143238.0,
    Material: 'WW-PALLET',
    Commodity: 'Eggs',
    OrderQuantity: 20,
    ShippedQuantity: 0,
    QuantityDiff: 20,
    PriceMethod: 'Non-Taxable',
    ShowOnBOL: 'No',
    ShipToLocation: '60676 - Gemperle Schendel Nucal (KR)'
  }
];
export interface ConfirmModelElement {
  Material: string;
  Property: string;
  Value: string;
}

const ELEMENT_DATACONFIRM: ConfirmModelElement[] = [
  {
    Material: 'TL- 64289', Property: 'Tosca0012', Value: ''
  },
  {
    Material: 'TL- 64290', Property: 'Tosca001', Value: ''
  }
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css'],
  providers: [DatePipe]
})
export class AddNewComponent {
  cars: SelectItem[];
  selectedCar: SelectItem;
  str: string;
  counter = 0;
  totalNumberOfCars: number;
  editShipmentHasReadOnlyAccess: boolean = false;

  @ViewChild('dd') dropdown: any;

  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService, private orderManagementAdjustCharges: OrderManagementAdjustChargesService,
    private orderManagementService: OrderManagementService, private authenticationService: AuthService,
    private toastrService: ToastrService, private datepipe: DatePipe) {


    /*--dropdown primeng--*/
    this.cars = [
      { label: 'Ford', value: 'dFord' },
      { label: 'Honda', value: 'eHonda' },
      { label: 'Jaguar', value: 'fJaguar' },
      { label: 'Mercedes', value: 'gMercedes' },
      { label: 'Renault', value: 'hRenault valor largo' },
      { label: 'VW', value: 'iVW' },
      { label: 'Volvo', value: 'jVolvo' },
      { label: 'a b', value: "ala" },
      { label: 'a c', value: "ola" }
    ];
    this.totalNumberOfCars = this.cars.length;
    this.str = '';

  }


  OnFocus() {
    if (this.OrderLocationsforDD.length > this.OrderLocationsforDD) {
      this.OrderLocationsforDD.shift();
    }
  }

  OnBlur() {
    //   console.log("OnBlur");
  }

  test(event) {
    const charCode = event.keyCode;
    if (event.key === 'Enter') {
      this.selectedCar = this.cars.find(car => {
        return car.label.toLowerCase().includes(this.str.toLowerCase());
      });
      this.cars.unshift(this.selectedCar)
      this.str = '';
    } else if (event.key === 'Backspace') {
      this.str = this.str.replace(/.$/, "");
    } else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8) {
      this.str += event.key;
    }
  }


  @Input() buttonBar: any;



  actionGroupConfig;
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  itemListA = [];
  itemListB = [];
  itemListUOM = [];

  date6: Date;

  selectedItemsA = [];
  settingsA = {};
  selectedItemsB = [];
  settingsB = {};
  selectedItemsUOM = [];
  settingsUOM = {};

  count = 3;
  public helpbtns: boolean;

  public exampleData: any;
  OrderTypeData: any;
  Locationdetails: any;
  PalletsCalculation: any[];
  filterShipToTypeModel: CommonShipModel[] = [];
  shipmenttypelist = [];
  OrderStatusData: any;
  ShipmentConditionData: any = [];
  SelectOrderStatusCode: number;
  EquipmentTypeData: any = [];
  freightModeData: any = [];
  SelectEquipment: number;
  SelectCarrierId: number;
  CarrierData: any = [];
  commonListViewModel: CommonListViewModel = new CommonListViewModel();
  editVerifyEquipmentMaterialProperty: EditVerifyEquipmentMaterialProperty = new EditVerifyEquipmentMaterialProperty();
  materialPropertyPopup: string = "";
  public selectedMaterialPropertiesshow: boolean = false;
  SelectMaterialID: number = 0;
  SelectMaterialOrderNo: string = '';
  SelectMaterialNo: number = 0;
  SelectMaterialQuantity: number = 0;
  Equipmentvalidate: boolean;

  FromlocationforCarrierDD: any;
  TolocationforCarrierDD: any;
  CarrierStopData: any = [];
  CarrierPickupData: any = [];

  SelectedShipmentStatus: any;
  SelectedShipmentCondition: any;
  SelectedTenderStatus: any;
  SelectedEquipment: any;
  SelectedfreightMode: any
  SelectedCarrier: any;

  LocationsforDD: any = {};
  LocationsforDDFrom: any = {};

  TenderStatusforDD: any = {};
  ChargeTypes: any = [];
  ShipmentDetails: any = {};
  ShippingOrders: any = [];
  ShippingOrdersGrid: any;
  ShippingSaveDetails: any = {};
  OrderCommentData: any = {}

  ShipmentsforEdit: any = {};
  SelectedShipmentsforEdit: any = {};
  ShippingOrdersDetails: any;
  DefaultPalletsDetails: any;

  SelecteOrderDetails: any;
  ToContractlist: any = [];
  FromContractlist: any = [];
  DefaulatPallet: any = {};

  Convert_date: Date;

  FinalShippingOrdersDetails: any = [];
  ShipmentTypeId: number;
  ShipmentTypeName: string;
  ShipmentStatusId: number;
  ShipmentStatusName: string;
  ShipmentConditionId: number;
  ShipmentConditionName: string;
  ShipDate: Date;
  MaterialChargesDetails: any;
  FinalMaterialList: any = [];
  TempFinalMaterialList: any = [];
  CarrierPickupLocationID: number;
  CarrierPickupcidt: Date;
  CarrierPickupcodt: Date;
  CarrierPickupduration: string = '';
  CarrierStopDeliveryLocationID: number;
  CarrierStopDeliverycidt: any;
  CarrierStopDeliverycodt: any;
  CarrierStopDeliveryduration: string = '';
  DispatchDropTrailer: any;
  CarrierOuttimePopulated: boolean = false;
  CarrierIntimePopulated: boolean = false;
  IsAdd: boolean = false;

  ApprovedBy: string;
  ApprovedDate: any;
  ToShip: boolean;
  shiprequirementrules = [];

  TrailerCheckInTime: Date;
  TrailerCheckOutTime: Date;
  TrailerTimeTrackingduration: string = '';
  SortStartTime: Date;
  SortEndTime: Date;
  SortTimeTrackingduration: string = '';
  enableTrailerTimeTracking: boolean;
  DropTrailer: boolean;

  SaveBtnDisabled: boolean = false;
  TenderStatusDisbled: boolean = true;
  OrderToLocationDisbled: boolean = true;
  OrderFromLocationDisbled: boolean = true;
  OrderAppointmentDisable: boolean = false;
  onReceiveDisable: boolean = false;
  OnreceiveHide: boolean = false;
  OnshipHide: boolean = false;
  onShipDisable: boolean = false;
  btnshipDisable: boolean = true;
  OrderCommentsDisable: boolean = false;
  MaterialGridAddEditDisable: boolean = false;

  TenderStatussettings: any = {}
  TempShippingOrdersDetails: any;
  TempAllMaterial: any = [];
  SelectMaterial: number = 0;
  MaterialData: any = [];
  OrderTypeId: number = 0;
  ApChargeBPList: any = [];
  ShipmentMaterialDeatail: ShipmentMaterialDeatails = new ShipmentMaterialDeatails();
  ShipmentMaterialDeatails: ShipmentMaterialDeatails[] = [];
  TempData: any = [];
  SODTimings: any = [];

  apchargesData: any = [];
  apchargesDataTab: any;
  apchargesDataEdit: any = [];
  apchargesDataEditTab: any;
  apchargesServer: any = [];
  apchargeBusinessPartner: any;
  apchargeChargeType: any;
  apchargeUOM: number = 220

  apchargeContractAmount: number = 0;
  apchargeModifiedAmount: number;
  apchargeEditno: number = 0;
  apchargeEditMode: boolean = false;
  apchargeEditModeText: string = 'key_Insert';
  APCModified: boolean = false;
  CTempData: any = [];
  DefaultMaterialProperty: any;

  OrderAmountforApchargeNew: number = 0;
  ApChargeNewShipmentStatus: string = "";
  ApChargeNewShipmentStatustemp: string = "";
  ApchargeModified: boolean = false;
  ApchargeModifiedTemp: boolean = false;
  EditingShipmentVersion: string = '';
  @ViewChild('apcmclose') apcmclose;
  @ViewChild('forfocus') forfocus;
  @ViewChild('cpcidt') cpcidt;
  @ViewChild('compilecheckclose') compilecheckclose;
  //OrderCommentData: any = {}
  selectRow: any;
  toLocationID: any;
  quantityDiff: any;
  fromLocationID: any;
  pickupAppointment: any;
  deliveryAppointment: any;
  showOnBOL: any;
  shippedQuantity: any;
  action: any;
  TotalPallets: number;
  EqualPallets: number = 0;
  EqipmentPallets: number = 0;
  TempPallets: number = 0;
  Pallets: number = 0;
  Value: any;
  UOMData: any;
  UOMCode: string;
  UOMID: number = 0;
  TempDeleteMaterial = [];
  MaterialDetails: any[] = [];
  ShippingMaterialDetails: any[];
  ControlPermissions: any = [];
  Shippingreceivingdisabled: boolean = false;
  Transportationdisabled: boolean = false;
  Transportationhide: boolean = false;
  Shippingreceivinghide: boolean = false;
  TonuCancelMessage: string = "";
  TonuCancelpopup: string = "cancel";
  TempOrderData: any;
  OrderLocationsforDD: any = [];
  OrderLocationsforDDFrom: any = [];
  UomforApchargespopup: any = [];
  cpChkOutTime = false;
  csdChkInTime = false;
  strResult: string = "";
  isNaftaCCIshow: boolean = false;
  CarrierPickupdisabled: boolean = false;
  StopDeliverydisabled: boolean = false;
  toReceive: boolean = false;
  TenderStatusTrackingData: any = [];
  StatusTrackingData: any = [];
  TenderstatusLableShow: boolean = false;
  isLinkClick: boolean = false;
  SelectedShipmentId: number;

  TenderStatussettingstrue = {
    singleSelection: true,
    text: "Select Tender Status",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    labelKey: 'name',
    searchBy: ['name'],
    disabled: true
  };

  TenderStatussettingsfalse = {
    singleSelection: true,
    text: "Select Tender Status",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    labelKey: 'name',
    searchBy: ['name'],
    disabled: false
  };

  /* onResizeEnd(event: ResizeEvent, columnName): void {
     if (event.edges.right) {
       const cssValue = event.rectangle.width + 'px';
       const columnElts = document.getElementsByClassName('mat-column-' + columnName);
       for (let i = 0; i < columnElts.length; i++) {
         const currentEl = columnElts[i] as HTMLDivElement;
         currentEl.style.width = cssValue;
       }
     }
   }*/

  ngOnInit() {
    this.buttonPermission();
    this.getPageControlsPermissions();
    this.Value = 'Value';
    this.selectRow = 'selectRow';
    this.fromLocationID = 'fromLocationID';
    this.toLocationID = 'toLocationID';
    this.pickupAppointment = 'pickupAppointment';
    this.deliveryAppointment = 'deliveryAppointment';
    this.quantityDiff = 'quantityDiff';
    this.showOnBOL = 'showOnBOL';
    this.shippedQuantity = 'shippedQuantity';
    this.action = 'action';

    this.GetTenderstatusforDD();
    this.GetUOMforApcharespopup();
    //this.GetShipMentType();
    //this.GetStatus();
    //this.GetShipmentCondition();
    //this.GetCarrierData();
    //this.GetEquipment();
    //this.GetFrieghtMode();
    // this.GetChargeType();
    //this.BindMaterialList(1, 2,3);

    if (localStorage.SelectedShipmentId != undefined && localStorage.SelectedShipmentId != null) {
      this.SelectedShipmentId = parseInt(localStorage.SelectedShipmentId);
      localStorage.SelectedShipmentId = null;
    }

    this.GetShipmentEditlist();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // for searchable dropdown
    this.itemListA = [
      { "id": 1, "itemName": "Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1 Option 1" },
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
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['name'],
    };
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      addNewItemOnFilter: true,
      searchBy: ['itemName'],
    };

    this.SelectMaterial = 0;
    // for searchable dropdown
    //this.exampleData = [
    //  { id: 2, text: 'Please Select' },
    //   { id: 1, text: 'Shipment Type' }
    //];
    // this.options = { multiple: false, tags: true };

    var DRequestObject = {
      ClientID: this.authenticationService.currentUserValue.ClientId,
    };
    this.GetDefaultMaterialProperty(DRequestObject);
    this.orderManagementService.GetUOMData()
      .subscribe(
        data => {
          this.UOMData = data.data;
          var data = this.UOMData.find(f => f.code == 'EA');
          this.selectedItemsUOM.push({ "id": data.id, "name": data.name, "code": data.code });
        });

    //   this.PagePermission();

    // this.getrecord();
  }//init() end

  GetShipmentEditlist() {

    if (this.shipmentManagementService.ShipmentsforEdit.length == 0) {
      this.isLinkClick = true;
      this.GetShipmentDetails(this.SelectedShipmentId);
    } else {
      this.ShipmentsforEdit = this.shipmentManagementService.ShipmentsforEdit;
      this.SelectedShipmentsforEdit = this.ShipmentsforEdit[0];
      this.GetShipmentforEdit(this.SelectedShipmentsforEdit.shipmentNumber);
      //  this.shipmentManagementService.EditingShipment = this.SelectedShipmentsforEdit.id
      // this.shipmentManagementService.EditingShipment = this.ShipmentDetails.shipmentNumber;
      // this.shipmentManagementService.EditingShipmentID = this.SelectedShipmentsforEdit.id;
      //  this.GetShipmentDetailsforEdit(this.SelectedShipmentsforEdit);
    }
  }

  GetShipmentforEdit(shipmentnumber: any) {
    this.SelectedShipmentsforEdit = this.ShipmentsforEdit.find(x => x.shipmentNumber == shipmentnumber);
    this.GetShipmentDetailsforEdit(this.SelectedShipmentsforEdit);
  }

  GetShipmentDetailsforEdit(SelectedShipment: any) {
    // this.shipmentManagementService.EditingShipment = SelectedShipment.id;
    this.shipmentManagementService.EditingShipment = this.ShipmentDetails.shipmentNumber;
    this.shipmentManagementService.EditingShipmentID = this.SelectedShipmentsforEdit.id;
    this.GetShipmentDetails(SelectedShipment.id);
  }

  RemoveShipment(shipmentnumber) {
   
    this.ShipmentsforEdit.splice(this.ShipmentsforEdit.findIndex(item => item.shipmentNumber === shipmentnumber), 1)
    this.shipmentManagementService.ShipmentsforEdit = this.ShipmentsforEdit;
    this.shipmentManagementService.ShipmentforEditOrders.splice(this.shipmentManagementService.ShipmentforEditOrders.findIndex(item => item.shipmentNumber === shipmentnumber), 1)
  }

  GetShipMentType() {
    this.shipmentManagementService.OrderTypeList()
      .subscribe(
        result => {
          var datas = [result.data];
          this.OrderTypeData = datas;
          // this.ShipmentTypeId = result.data.id;
        });
  }

  GetStatus() {
    this.shipmentManagementService.shipmentStatusList()
      .subscribe(
        data => {
          this.OrderStatusData = data.data;
          if (this.ShipmentDetails != undefined) {
            const selectedshipmentstatus = this.OrderStatusData.find(x => x.id == this.ShipmentDetails.shipmentstatusId);
            if (selectedshipmentstatus != undefined) {
              this.SelectedShipmentStatus = [{ "id": selectedshipmentstatus.id, "name": selectedshipmentstatus.name }];
            }
          }


          // this.SelectOrderStatusCode = this.OrderStatusData.find(f => f.code == "OpenOrderNeedsToBeCompleted")?.id;
        });
  }

  GetShipmentCondition() {
    this.shipmentManagementService.ShipmentConditionList()
      .subscribe(
        data => {
          this.ShipmentConditionData = data.data;
          if (this.ShipmentDetails != undefined) {
            const selectedshipmentcondition = this.ShipmentConditionData.find(x => x.id == this.ShipmentDetails.shipmentConditionID);
            if (selectedshipmentcondition != undefined) {
              this.SelectedShipmentCondition = [{ "id": selectedshipmentcondition.id, "name": selectedshipmentcondition.name }];
            }
          }
          // this.SelectOrderStatusCode = this.OrderStatusData.find(f => f.code == "OpenOrderNeedsToBeCompleted")?.id;
        });
  }

  GetEquipment() {
    this.shipmentManagementService.EquipmentTypeData(this.commonListViewModel)
      .subscribe(
        data => {
          this.EquipmentTypeData = data.data;
          if (this.ShipmentDetails != undefined) {
            const selectedequip = this.EquipmentTypeData.find(x => x.id == this.ShipmentDetails.equipmentTypeID);
            if (selectedequip != undefined) {
              this.SelectedEquipment = [{ "id": selectedequip.id, "name": selectedequip.name }];
            }
          }
          //this.Equipmentvalidate = true;
        });

  }

  GetCarrierData() {
    this.shipmentManagementService.CarrierList(this.commonListViewModel)
      .subscribe(
        data => {
          this.CarrierData = data.data;
          if (this.ShipmentDetails != undefined) {

            const seletedcarrier = this.CarrierData.find(x => x.id == this.ShipmentDetails.carrierID);
            if (seletedcarrier != undefined) {

              this.SelectedCarrier = [{ "id": seletedcarrier.id, "name": seletedcarrier.name }];
            }
          }

        });



  }

  panelOpenState111 = false;
  panelOpenState = false;
  //material table code


  displayedColumns = [
    /*'selectRow',*/ 'route', 'orderNumber', 'fromLocationID', 'toLocationID', 'reqDeliveryDate',
    'mustArriveByDate', 'actualDeliveryDate', 'pickupAppointment', 'deliveryAppointment'];

  displayedColumnsReplace = [
    /*'selectRow',*/ 'key_Route', 'key_OrderNumber', 'key_FromLocation',
    'key_ToLocation', 'key_ReqDeliveryDate', 'key_mabd',
    'key_ActualDeliveryDate', 'key_PickupAppointment',
    'key_DeliveryAppointment'
  ];
  //////'key_TravelTime',
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  //material property
  missingMaterialProerptyColumn = ['materialName', 'materialWeight', 'unitInPallet',
    'unitInEquipement', 'palletInEquipement'];
  MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>();
  MissingMaterialPropertyData: MaterialPropertyGrid[] = [];

  displayedColumns11 = [
    'BusinessPartner', 'BillingEntity', 'ChargeType', 'ContractAmount',
    'ModifiedAmount', 'UOM'];
  dataSource11 = new MatTableDataSource<ChargeSummary>(ELEMENT_DATA1);

  //displayedColumns2 = [
  //  'selectRow', 'BusinessPartner', 'BillingEntity', 'ChargeType', 'ContractAmount',
  //  'ModifiedAmount', 'UOM', 'SalesTax', 'AutoAdded'];

  apchargesColumns = ['SNo', 'businessPartner', 'billingEntity', 'chargeType', 'contractAmount',
    'modifiedAmount', 'uom', 'salesTax', 'autoAdded'];

  apchargesColumnsEdit = ['SNo', 'businessPartner', 'billingEntity', 'chargeType', 'contractAmount',
    'modifiedAmount', 'uom', 'salesTax', 'autoAdded', 'delete'];

  dataSource2 = new MatTableDataSource<apCharges>(ELEMENT_DATA2);
  selection1 = new SelectionModel<apCharges>(true, []);
  selectionAPCEdit = new SelectionModel<apCharges>(true, []);

  displayedColumns3 = [
    'selectRow', 'OrderNum', 'Material', 'Commodity', 'OrderQuantity',
    'ShippedQuantity', 'QuantityDiff', 'PriceMethod', 'ShowOnBOL',
    'ShipToLocation'];

  ShipmentReceiptColumns = [
    /* 'selectRow',*/
    'finalorderNumber',
    'finalmaterialName',
    'finalorderQuantity',
    'finalshippedQuantity',
    'finalquantityDiff',
    'finalshowOnBOL',
    'finallocationName'
  ];


  ShipmentReceiptColumnsCheck = [
    'finalorderNumber',
    'finalmaterialName',
    'finalorderQuantity',
    'finalshippedQuantity',
    'finalquantityDiff',
    'finalshowOnBOL',
    'finallocationName'
  ];

  AddShipmentReceiptColumns = [
    /*'selectRow',*/
    'orderNumber',
    'materialName',
    'orderQuantity',
    'shippedQuantity',
    'quantityDiff',
    'showOnBOL',
    'locationName',
    'action'
  ];

  ShipmentReceiptColumnsHeader = [
    /*'selectRow',*/ 'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
    'key_Shipqunt', 'key_QuantityDiff', 'key_ShowOnBOL',
    'key_Shipto', 'key_Action'];

  ShipmentReceiptColumnsHeaderCheck = [
    /*'selectRow', */'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
    'key_Shipqunt', 'key_QuantityDiff', 'key_ShowOnBOL',
    'key_Shipto', 'key_Action'];

  // to check
  displayedConfirmModel = ['Material', 'Property', 'Value'];
  displayedConfirmModelNew = ['key_MaterialLocation', 'key_Property', 'key_Value'];
  dataSourceConfirmModel = new MatTableDataSource<ConfirmModelElement>(ELEMENT_DATACONFIRM);

  ShipmentReceiptColumnsHeaders = [
    'selectRow', 'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
    'key_Shipqunt', 'key_QuantityDiff', 'key_ShowOnBOL',
    'key_Shipto'];

  TenderStatusTrackingDataColumns = ['trackingDetail'];
  StatusTrackingDataColumns = ['trackingDetail'];



  dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>();
  dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>();
  dataSource5 = new MatTableDataSource<FinalShipmentAdjustChargesModel>();
  selection3 = new SelectionModel<ShipmentAdjustChargesModel>(false, []);
  selection4 = new SelectionModel<FinalShipmentAdjustChargesModel>(false, []);


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
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  // for editor code 
  htmlContent = '';
  editorConfig: AngularEditorConfig = {
    editable: !this.editShipmentHasReadOnlyAccess,
    spellcheck: true,
    height: 'auto',
    minHeight: '200',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    uploadUrl: 'no',
    translate: 'no',
    placeholder: 'Enter text here...',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  GetStartTimings() {

    this.CarrierPickupcidt = null;
    this.CarrierPickupcodt = null;
    this.CarrierPickupduration = null;
    const pctimings = this.CarrierPickupData.filter(x => x.LocationID == this.CarrierPickupLocationID);
    if (pctimings.length > 0) {
      if (pctimings[0].CheckInTime != null) { this.CarrierPickupcidt = new Date(pctimings[0].CheckInTime); }
      if (pctimings[0].CheckOutTime != null) { this.CarrierPickupcodt = new Date(pctimings[0].CheckOutTime); }
      if (this.CarrierPickupcidt != null && this.CarrierPickupcodt != null) {
        this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt);
      }
    }
  }

  GetStopTimings() {
    this.CarrierStopDeliverycidt = null;
    this.CarrierStopDeliverycodt = null;
    const pctimings = this.CarrierStopData.filter(x => x.LocationID == this.CarrierStopDeliveryLocationID);
    if (pctimings.length > 0) {
      if (pctimings[0].CheckInTime != null) { this.CarrierStopDeliverycidt = new Date(pctimings[0].CheckInTime); }
      if (pctimings[0].CheckOutTime != null) { this.CarrierStopDeliverycodt = new Date(pctimings[0].CheckOutTime); }
      if (this.CarrierStopDeliverycodt != null && this.CarrierStopDeliverycidt != null) {
        this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
      }
    }
  }

  GetCarrierPickupOutcwt(event) {

    if (this.CarrierPickupcodt != undefined && this.CarrierPickupcodt != null) {
      let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
      let vcdate = this.GetDatepart(this.CarrierPickupcodt);
      let vtodaydate = this.GetDatepart(new Date());

      if (vcdate > vtodaydate) { this.toastrService.warning("Carrier Out Date cannot be future date"); }
      else { this.ChangeShipDateForCarrierOutime(this.CarrierPickupLocationID, this.CarrierPickupcodt);}
     
      if (this.CarrierStopDeliverycidt != undefined && this.CarrierStopDeliverycidt != null) {
        let vcsdidate = this.GetDatepart(this.CarrierStopDeliverycidt);
        if (vcdate > vcsdidate) {this.toastrService.error("Carrier Out Time at Pickup should not be later than Carrier In Time at Delivery."); }
      }
      if (this.CarrierPickupcidt != undefined) {
        if (this.CarrierPickupcidt <= this.CarrierPickupcodt) { this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt); }
        else { this.toastrService.error("Carrier Out Time should be later than Carrier In Time."); }
      }
      this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
      this.ShippingSaveDetails.CarrierPickupData = this.CarrierPickupData;
      this.EnableDisableShipReceiveButtons();
    }
    else {
      this.ShipmentDetails.compliedWithShippingInstructions = false;
      this.EnableDisableShipReceiveButtons();
    }
  }w

  GetCarrierPickupLoccwt() {  }

  GetCarrierPickupIncwt(event) {
    let vcdate = this.GetDatepart(this.CarrierPickupcidt);
    let vtodaydate = this.GetDatepart(new Date());
    if (vcdate > vtodaydate) {
      this.toastrService.warning("Carrier in date time (Carrier Pick Up) cannot be future date");
    }

    if (this.CarrierPickupcidt != undefined) {
      if (this.CarrierPickupcodt == undefined) {
        this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
      }
      else {
        if (this.CarrierPickupcidt <= this.CarrierPickupcodt) {
          this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt);
          this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
        }
        else {
          this.toastrService.error("Carrier Out Time should be later than Carrier In Time.");
          this.CarrierPickupduration = null;
        }
      }
      this.ShippingSaveDetails.CarrierPickupData = this.CarrierPickupData;
    }
   
  }

  ChangeShipDateForCarrierOutime(LocationId, outime, mode = '') {

    if (this.CarrierPickupcodt != undefined && this.CarrierPickupcodt != null) {
      let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
      let vcpoutdate = this.GetDatepart(this.CarrierPickupcodt);
      this.ShipmentDetails.shipDate = outime; return;
    
    }
    //    if (mode.toLowerCase() == 'receive') {
    if (this.CarrierStopDeliverycidt != undefined && this.CarrierStopDeliverycidt != null) {
      let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
      let vcsdidate = this.GetDatepart(this.CarrierStopDeliverycidt);
      if (vcsdidate < vshipdate) {
        this.ShipmentDetails.shipDate = outime; return;
      }
      //   }
    }
    //if (mode.toLowerCase() == 'receive') { this.ShipmentDetails.shipDate = outime; return }
    //const selorders = this.ShippingOrders.filter(x => x.fromLocationID == LocationId);
    //if (selorders != undefined) {
    //  const routeno = selorders[0].route;
    //  if (routeno == 1 || routeno == 0) {  this.ShipmentDetails.shipDate = outime; }
    //}
  }

  ChangeShipDateForCarrierIntime(LocationId, intime) {
    const selorders = this.ShippingOrders.filter(x => x.toLocationID == LocationId);
    if (selorders != undefined) {
      const routeno = selorders[0].route;
      if (routeno == 1) {
        this.ShipmentDetails.shipDate = intime;
      }
    }
  }

  GetCarrierStopDeliveryIncwt(event) {
    let vcindate = this.GetDatepart(this.CarrierStopDeliverycidt);
    let vtodaydate = this.GetDatepart(new Date());
    if (vcindate > vtodaydate) {
      this.toastrService.warning("Carrier In date time (Carrier Stop and Delivery) cannot be future date");
    }

    if (this.CarrierStopDeliverycidt != undefined && this.CarrierStopDeliverycidt != null) {
      let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
      let vcdate = this.GetDatepart(this.CarrierStopDeliverycidt);

      //if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      //  this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
      //  if (vcdate < vshipdate) {
      //    this.ChangeShipDateForCarrierOutime(this.CarrierPickupLocationID, this.CarrierStopDeliverycidt, 'receive');
      //  }
      //}
      if (this.CarrierPickupcodt != undefined && this.CarrierPickupcodt != null) {
        let cpcodt = this.GetDatepart(this.CarrierPickupcodt);
        if (cpcodt > vcdate) {
          this.toastrService.error("Receive date cannot be less than the carrier out date or shipment ship date.");
        }
      }
      if (this.CarrierStopDeliverycodt != undefined && this.CarrierStopDeliverycodt != null) {
        if (this.CarrierStopDeliverycidt <= this.CarrierStopDeliverycodt) {
          this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
        }
        else {
          this.CarrierStopDeliveryduration = null;
          this.toastrService.error("Receive date cannot be less than the carrier out date or shipment ship date.");
        }
      }
    }
    else {
      this.toReceive = false;
      this.EnableDisableShipReceiveButtons();
    }
    this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData);
    this.ShippingSaveDetails.CarrierStopData = this.CarrierStopData;
    this.EnableDisableShipReceiveButtons();
  }

  GetCarrierStopDeliveryOutcwt(event) {

    let vcdate = this.GetDatepart(this.CarrierStopDeliverycodt);
    let vtodaydate = this.GetDatepart(new Date());
    if (vcdate > vtodaydate) {
      this.toastrService.warning("Carrier out date time (Carrier Stop and Delivery) cannot be future date");
    }


    if (this.CarrierStopDeliverycodt != undefined) {
      if (this.CarrierStopDeliverycidt != undefined) {
        if (this.CarrierStopDeliverycidt <= this.CarrierStopDeliverycodt) {
          this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
        }
        else {
          this.CarrierStopDeliveryduration = null;
          this.toastrService.error("Carrier Out Time should be later than Carrier In Time.");
        }
      }
      this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData);
      this.ShippingSaveDetails.CarrierStopData = this.CarrierStopData;
    }

  }

  GetTrailerTimeTrackingIncwt(event, type) {
    let vttcindate = this.GetDatepart(this.TrailerCheckInTime);
    let vtodaydate = this.GetDatepart(new Date());
    if (vttcindate > vtodaydate) {
      this.toastrService.warning("Trailer Check-in Time cannot be future date");
    }


    if (this.TrailerCheckInTime != undefined) {
      if (this.TrailerCheckOutTime != undefined) {
        if (this.TrailerCheckInTime <= this.TrailerCheckOutTime) {
          this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime)
        }
        else {
          this.toastrService.error("Trailer Checkout Time should be later than Trailer Check-in Time.")
          event.target.value = '';
          this.TrailerCheckInTime = null;
          this.TrailerTimeTrackingduration = null;
        }
      }
      this.ShippingSaveDetails.trailerCheckInTime = this.TrailerCheckInTime;
    }
  }

  GetTrailerTimeTrackingOutcwt(event, type) {
    let vttcoutdate = this.GetDatepart(this.TrailerCheckInTime);
    let vtodaydate = this.GetDatepart(new Date());
    if (vttcoutdate > vtodaydate) {
      this.toastrService.warning("Trailer Check-Out Time cannot be future date");
    }

    if (this.TrailerCheckOutTime != undefined) {
      if (this.TrailerCheckInTime != undefined) {
        if (this.TrailerCheckInTime <= this.TrailerCheckOutTime) {
          this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime)
        }
        else {
          this.toastrService.error("Trailer Checkout Time should be later than Trailer Check-in Time.")
          event.target.value = '';
          this.TrailerCheckOutTime = null;
          this.TrailerTimeTrackingduration = null;
        }
      }
      this.ShippingSaveDetails.trailerCheckOutTime = this.TrailerCheckOutTime;
    }
  }

  GetSortTrackingTcwt(event, type) {
    if (type == 'end') {
      let vsortenddate = this.GetDatepart(this.SortEndTime);
      let vtodaydate = this.GetDatepart(new Date());
      if (vsortenddate > vtodaydate) { this.toastrService.warning("Sort End Time cannot be future date"); }
    }
    else {
      let vsortstartdate = this.GetDatepart(this.SortStartTime);
      let vtodaydate = this.GetDatepart(new Date());
      if (vsortstartdate > vtodaydate) {
        this.toastrService.warning("Sort Start Time cannot be future date");
      }
    }


    if (this.SortEndTime != undefined) {
      if (this.SortStartTime != undefined) {
        if (this.SortStartTime <= this.SortEndTime) {
          this.SortTimeTrackingduration = this.TimeDifferenceHrsMins(this.SortStartTime, this.SortEndTime)
        }
        else {
          this.toastrService.error("Sort End Time should be later than Sort Start Time.");
          if (type == 'end') {
            this.SortEndTime = null;
            this.SortTimeTrackingduration = null;
          }
          if (type == 'start') {
            this.SortStartTime = null;
            this.SortTimeTrackingduration = null;
          }
        }
      }
      else { this.toastrService.error("Please Enter Sort Start Date Time.") }
    }
    this.ShippingSaveDetails.sortStartTime = this.SortStartTime;
    this.ShippingSaveDetails.sortEndTime = this.SortEndTime;
  }

  TenderStatusChange(event) {

    this.ShippingSaveDetails.shipmentTenderStatusID = event.target.value;
    const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
    if (selectedtenderstatus != undefined) { this.ShippingSaveDetails.tenderStatusName = selectedtenderstatus.name; }

    if (this.ShipmentDetails.tenderStatusName.toLowerCase() == "tender accept") {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "cpuorder"
        || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customertocustomer") {
        this.ShipmentDetails.conditionName = "Ready for Shipping";
        this.ShipmentDetails.ShipmentConditionCode = "ReadyforShipping";
      }
      else {
        this.ShipmentDetails.conditionName = "Ready for Receiving";
        this.ShipmentDetails.ShipmentConditionCode = "ReceiveShipment";
        if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" ||
          this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
          this.ShipmentDetails.shipmentStatusName = "Awaiting Receipt";
          this.ShipmentDetails.shipmentStatusCode = "Shipped and Awaiting Receipt";
        }
      }
    }
    else {
      this.ShipmentDetails.conditionName = "Tendered";
      this.ShipmentDetails.ShipmentConditionCode = "Tendered";
    }

    this.EnableDisableShipReceiveButtons();
    this.EnableDisableToShipCheck();
    this.EnableDisableToReceiveCheck();
    this.EnableDisableCancelButton();
    this.EnableDisableTonuButton();
  }

  Cleartimings() {
    this.cpChkOutTime = false;
    this.csdChkInTime = false;
    this.CarrierPickupLocationID = 0;
    this.CarrierPickupcidt = null;
    this.CarrierPickupcodt = null;
    this.CarrierPickupduration = "";
    this.CarrierStopDeliveryLocationID = 0;
    this.CarrierStopDeliverycidt = null;
    this.CarrierStopDeliverycodt = null;
    this.CarrierStopDeliveryduration = "";
    this.TrailerCheckInTime = null;
    this.TrailerCheckOutTime = null;
    this.TrailerTimeTrackingduration = '';
    this.SortStartTime = null;
    this.SortEndTime = null;
    this.SortTimeTrackingduration = '';
  }
  SetInputData() {
    this.ApprovedBy = this.ShipmentDetails.approvedBy;
    this.ApprovedDate = this.ConverttoDateTime(this.ShipmentDetails.approvedDateTime);
    this.TrailerCheckInTime == null;
    this.TrailerCheckOutTime == null;
    this.SortStartTime == null;
    this.SortEndTime == null;

    if (this.ShipmentDetails.trailerCheckInTime != null) {
      this.TrailerCheckInTime = new Date(this.ShipmentDetails.trailerCheckInTime);
    }
    if (this.ShipmentDetails.trailerCheckOutTime != null) {
      this.TrailerCheckOutTime = new Date(this.ShipmentDetails.trailerCheckOutTime);
    }
    if (this.ShipmentDetails.sortStartTime != null) {
      this.SortStartTime = new Date(this.ShipmentDetails.sortStartTime);
    }
    if (this.ShipmentDetails.sortEndTime != null) {
      this.SortEndTime = new Date(this.ShipmentDetails.sortEndTime);
    }
    if (this.TrailerCheckInTime != undefined && this.TrailerCheckOutTime != undefined) {
      this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime);
    }
    if (this.SortStartTime != undefined && this.SortEndTime != undefined) {
      this.SortTimeTrackingduration = this.TimeDifferenceHrsMins(this.SortStartTime, this.SortEndTime)
    }
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
      this.toReceive = this.ShipmentDetails.compliedWithShippingInstructions;
    }
  }


  ConverttoDateOnlyforDB(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();

      var datestring = year + "-" + (month + 1) + "-" + date.toString();
      return datestring;
    }
    return null;
  }

  ConverttoDateTime(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var ampm = 'AM';
      if (hour > 12) {
        ampm = "PM";
        hour = hour - 12;
      }
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      var datestring = ((month + 1) + "/" + date + "/" + year + " " + hour1 + ":" + minutes1 + " " + ampm)
      return datestring;
    }
    return null;
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
    this.ShipmentDetails.TrailerNumber = TrailerNumber;
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
    this.ShipmentDetails.TrailerSealNumber = TrailerSealNumber;
  }
  ConverttoDatepicker(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var ampm = 'AM';
      if (hour > 12) {
        ampm = "PM";
        hour = hour - 12;
      }
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      var datestring = ((month + 1) + "/" + date + "/" + year + " " + hour1 + ":" + minutes1 + " " + ampm)
      return datestring;
    }
    return null;
  }



  GetDatepart(vdatetime) {
    let dt = new Date(vdatetime);
    var date = dt.getDate();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    let dts = new Date(year, month, date);
    return dts;
  }

  converttoSqlString(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var ampm = 'AM';
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");

      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + " " + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }

  converttoSqlStringWithT(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + "T" + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }


  DispatchApprove(event) {

    if (this.ShipmentDetails.compliedWithShippingInstructions) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() != "customertocustomer") {
        if (this.CarrierPickupcodt != null) {
          var dt = new Date();
          this.ApprovedDate = this.ConverttoDateTime(dt);
          this.ApprovedBy = this.authenticationService.currentUserValue.LoginId;
          this.dataSource5 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
          $("#compilePopup").modal('show');
        }
        else {
          this.ApprovedDate = '';
          this.ApprovedBy = '';
          this.toastrService.warning("Carrier Out Date Time is mandatory.");
          this.ShipmentDetails.compliedWithShippingInstructions = false;
          event.srcElement.checked = false;
          $("#compilePopup").modal('hide');
        }
      }
      else {
        var dt = new Date();
        this.ApprovedDate = this.ConverttoDateTime(new Date());
        this.ApprovedBy = this.authenticationService.currentUserValue.LoginId;
        this.dataSource5 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
        $("#compilePopup").modal('show');
      }
    }
    else {
      this.ApprovedDate = '';
      this.ApprovedBy = '';
    }

    this.ShippingSaveDetails.approvedBy = this.ApprovedBy;
    this.ShippingSaveDetails.approvedDateTime = this.ApprovedDate;
    this.ShippingSaveDetails.compliedWithShippingInstructions = this.ShipmentDetails.compliedWithShippingInstructions;
    this.EnableDisableShipReceiveButtons();
  }

  ReceiveChange(event) {

    if (this.toReceive) {
      if (this.CarrierStopDeliverycidt != null) {
        var dt = new Date();
        this.ApprovedDate = this.ConverttoDateTime(dt);
        this.ApprovedBy = this.authenticationService.currentUserValue.LoginId;
        this.dataSource5 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);

        $("#compilePopup").modal('show');
      }
      else {
        this.ApprovedDate = '';
        this.ApprovedBy = '';
        this.toastrService.warning("Carrier In Date Time is mandatory.");
        event.srcElement.checked = false;
        $("#compilePopup").modal('hide');
      }
    }
    else {
      this.ApprovedDate = '';
      this.ApprovedBy = '';
    }
    this.ShippingSaveDetails.approvedBy = this.ApprovedBy;
    this.ShippingSaveDetails.approvedDateTime = this.ApprovedDate;
    this.ShippingSaveDetails.compliedWithShippingInstructions = this.toReceive;
    this.EnableDisableShipReceiveButtons();
  }
  GetShipmentDetails(ShipmentId: number, isversion: number = 0) {
    this.Cleartimings()
    // getting shipment details
    var oldid = this.ShipmentDetails.id;
    this.shipmentManagementService.GetShipmentDetails(ShipmentId)
      .subscribe(data => {
        this.ShipmentDetails = data.data[0];

        //this.ShipmentDetails.UpdateDate = (data.data[0].updateDateTimeServer == null || data.data[0].updateDateTimeServer == "") ? data.data[0].createDateTimeServer : data.data[0].updateDateTimeServer;
        this.ShipmentDetails.UpdateDate = this.orderManagementService.getLocalDateTime((data.data[0].updateDateTimeServer == null || data.data[0].updateDateTimeServer == "") ? data.data[0].createDateTimeServer : data.data[0].updateDateTimeServer);
        //this.ShipmentDetails.CreateDate = data.data[0].createDateTimeServer;
        this.ShipmentDetails.CreateDate = this.orderManagementService.getLocalDateTime(data.data[0].createDateTimeServer);
        this.ShipmentDetails.UpdatedBy = (data.data[0].updatedBy == null || data.data[0].updatedBy == "") ? data.data[0].createdBy : data.data[0].updatedBy;
        this.ShipmentDetails.CreatedBy = data.data[0].createdBy;

        console.log(this.ShipmentDetails);
        this.ShippingSaveDetails = data.data[0];
        this.shipmentManagementService.EditingShipment = this.ShipmentDetails.shipmentNumber;
        this.shipmentManagementService.EditingShipmentID = ShipmentId;
        this.shipmentManagementService.EditingVersion = this.ShipmentDetails.shipmentVersion;
        this.EditingShipmentVersion = this.ShipmentDetails.shipmentNumber + '.' + this.ShipmentDetails.shipmentVersion;
        this.ResetValidationCss();
        this.getPageControlsPermissions();
        this.EnableDisableProformaInvoice();
        this.EnableDisableTenderStatus();
        this.ShowHideTenderStausLabelDropdown();
        this.EnableDisableToShipCheck();
        this.EnableDisableToReceiveCheck();
        this.EnableDisableCarrierPickup();
        this.EnableDisableStopDelivery();
        this.GetLocationsforDD(ShipmentId, this.authenticationService.currentUserValue.ClientId);
        this.GetTenderStatusTracking(ShipmentId);
        this.GetStatusTracking(ShipmentId);

        if (isversion == 1) {

          this.SelectedShipmentsforEdit.id = this.ShipmentDetails.id;
          // this.SelectedShipmentsforEdit.OrderID = this.ShipmentDetails.OrderID;
          this.SelectedShipmentsforEdit.shipmentNumber = this.ShipmentDetails.shipmentNumber + "." + this.ShipmentDetails.shipmentVersion;
          this.SelectedShipmentsforEdit.shipmentStatusName = this.ShipmentDetails.shipmentStatusName;
          this.SelectedShipmentsforEdit.shipmentVersion = this.ShipmentDetails.shipmentVersion;
          this.SelectedShipmentsforEdit.tenderStatusName = this.ShipmentDetails.tenderStatusName;

          //this.ShipmentsforEdit.forEach(shipment => {
          //  if (shipment.id == oldid) {
          //    shipment.id = this.ShipmentDetails.id;
          //    shipment.shipmentNumber = this.ShipmentDetails.shipmentNumber + "." + this.ShipmentDetails.shipmentVersion;
          //    shipment.shipmentStatusName = this.ShipmentDetails.shipmentStatusName;
          //    shipment.shipmentVersion = this.ShipmentDetails.shipmentVersion;
          //    shipment.tenderStatusName = this.ShipmentDetails.tenderStatusName;
          //  }
          //});

          this.SelectedShipmentsforEdit.id = this.ShipmentDetails.id;
          //  this.shipmentManagementService.EditingShipment = this.SelectedShipmentsforEdit.id;
          this.shipmentManagementService.EditingShipment = this.ShipmentDetails.shipmentNumber;
          this.shipmentManagementService.EditingShipmentID = this.SelectedShipmentsforEdit.id;

        }
        if (this.isLinkClick) {
          this.ShipmentsforEdit = [];
          this.ShipmentsforEdit.push(this.ShipmentDetails);
          //localStorage.SelectedShipmentId = null;
        }
      });
  }

  GetAllShipmentMetod(ShipmentId: number) {

    this.GetShipmentOrders(ShipmentId);
    this.EnableDisableOrderLocation();

    this.GetShippingOrdersDetails(ShipmentId); // data from salesorderdetails for  Material Grid of specified shipment id
    this.GetApcharges(ShipmentId); // data from ApCharges for of specified shipemnt id
    this.SetInputData();

    this.EnableDisableCancelButton();
    this.EnableDisableTonuButton();
    this.EnableDisableDeleteButton();
    this.EnableDisableApproveMasButton();
    this.EnableDisableResendtoMasButton();
    //this.GetLocationsforDD(this.ShipmentDetails.orderTypeID, this.authenticationService.currentUserValue.ClientId);
    this.EqipmentPallets = this.ShipmentDetails.equipmentMaxPalletQty

    this.EnableDisableAppointments();
    this.EnableDisableOrderComments();
    this.EnableDisableShipReceiveButtons();
    this.EnableDisableMaterialGridAddEdit();

    if (this.shiprequirementrules.length > 0) { this.helpbtns = true }
    else { this.helpbtns = false }

    var RequestObject = {
      ContractID: 4580,
      ShipTOLocationID: 21959,
      ClientID: this.authenticationService.currentUserValue.ClientId,
      OrderTypeID: this.ShipmentDetails.orderTypeID
    };
    this.GetAdjustChargesDefault(RequestObject);
  }

  EnableDisableSaveButton() {
    return;
    this.CheckCarrierOuttimePopulated();
    if (this.ShipmentDetails.dropTrailer) {
      if (!(this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
        || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections")) {
        if (!this.CarrierOuttimePopulated || this.ShipmentDetails.carrierID == null) { this.SaveBtnDisabled = true; }
        else { this.SaveBtnDisabled = false; }
      }

      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
        || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") {
        if (!this.CarrierIntimePopulated || this.ShipmentDetails.carrierID == null) { this.SaveBtnDisabled = true; }
        else { this.SaveBtnDisabled = false; }
      }
    }
    else {
      if (this.ShipmentDetails.carrierID == null) {
        this.SaveBtnDisabled = true;
      }
      else {
        this.SaveBtnDisabled = false;
      }
    }
  }

  EnableDisableShipReceiveButtons() {
   
    this.shiprequirementrules = [];
    if (this.ShipmentDetails.isSendToMAS) {
      this.buttonBar.disableAction('receive');
      this.buttonBar.disableAction('ship');
      this.helpbtns = false;
      return;
    }

    if (this.ShipmentDetails.hasVersions) {
      this.buttonBar.disableAction('receive');
      this.buttonBar.disableAction('ship');
      this.helpbtns = false;
      return;
    }
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
      this.buttonBar.enableAction('receive');
      this.buttonBar.disableAction('ship');
      this.EnableDisableReceiveButton();
    }
    else {
      this.buttonBar.enableAction('ship');
      this.buttonBar.disableAction('receive');
      this.EnableDisableShipButton();
    }
    if (this.shiprequirementrules.length > 0) { this.helpbtns = true }
    else { this.helpbtns = false }
  }


  EnableDisableReceiveButton() {
    const cdate = new Date();
    let vcdate = this.GetDatepart(cdate);
    let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
    let vReceivedate = this.GetDatepart(this.CarrierStopDeliverycidt);
    let vCpuoutdate = this.GetDatepart(this.CarrierPickupcodt);
    if (vReceivedate < vshipdate) {
      this.shiprequirementrules.push("Receive date cannot be less than the carrier out date or shipment ship date.");
      this.buttonBar.disableAction('receive');
    }

    if (this.CarrierStopDeliverycidt == null) {
      this.shiprequirementrules.push("Carrier In time (Carrier Stop and Delivery) Should be entered");
      this.buttonBar.disableAction('receive');
    }
    if (this.CarrierPickupcodt == null) {
      this.shiprequirementrules.push("Carrier Out time ( Carrier Pick Up) Should be entered");
      this.buttonBar.disableAction('receive');
    }

    if (vReceivedate > vcdate) {
      this.shiprequirementrules.push("Carrier In datetime cannot be future date");
      this.buttonBar.disableAction('receive');
    }

    if (vCpuoutdate > vcdate) {
      this.shiprequirementrules.push("Carrier Out datetime cannot be future date");
      this.buttonBar.disableAction('receive');
    }

    if (!this.toReceive) {
      this.shiprequirementrules.push("To Receive Checkbox should be checked");
      this.buttonBar.disableAction('receive');
    }

    if (this.TenderstatusLableShow) {
      if (this.ShipmentDetails.tenderStatusCode.toLowerCase() == "tendered") {
        this.shiprequirementrules.push('Tender Status should be "Tender Accept".');
        this.buttonBar.disableAction('receive');
      }
    }
    else {
      const seltenstcode = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
      if (seltenstcode.code.toLowerCase() == "tendered") {
        this.shiprequirementrules.push('Tender Status should be "Tender Accept".');
        this.buttonBar.disableAction('receive');
      }
    }

    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "under review") {
      this.shiprequirementrules.push("Shipment is underreview");
      this.buttonBar.disableAction('receive');
    }
    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "receive") {
      this.shiprequirementrules.push("Shipment Status Should not be shipped");
      this.buttonBar.disableAction('receive');
    }
    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "Receieve and ap charges sent to mas") {
      this.shiprequirementrules.push("Shipment Status Should not be Receieve and ap charges sent to mas");
      this.buttonBar.disableAction('receive');
    }
  }

  EnableDisableShipButton() {
   
    const cdate = new Date();
    let vcdate = this.GetDatepart(cdate);
    let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
    let vCpuoutdate = this.GetDatepart(this.CarrierPickupcodt);
    if (vshipdate > vcdate) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() != "customertocustomer") {
        this.shiprequirementrules.push("Ship Date cannot be a future date.");
        this.buttonBar.disableAction('ship');
      }
    }

    if (vCpuoutdate > vcdate) {
      this.shiprequirementrules.push("Carrier Out date cannot be future date");
      this.buttonBar.disableAction('ship');
    }

    if (this.TenderstatusLableShow) {
      if (this.ShipmentDetails.tenderStatusCode.toLowerCase() == "tendered") {
        this.shiprequirementrules.push('Tender Status should be "Tender Accept".');
        this.buttonBar.disableAction('ship');
      }
    }
    else {
      const seltenstcode = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
      if (seltenstcode.code.toLowerCase() == "tendered") {
        this.shiprequirementrules.push('Tender Status should be "Tender Accept".');
        this.buttonBar.disableAction('ship');
      }
    }
    if (this.CarrierPickupcodt == null) {
        this.shiprequirementrules.push("Carrier Out time Should be entered");
        this.buttonBar.disableAction('ship');
     
    }
    if (!this.ShipmentDetails.compliedWithShippingInstructions) {
      this.shiprequirementrules.push("To Ship Checkbox should be checked");
      this.buttonBar.disableAction('ship');
    }
    //  this.CheckCarrierOuttimePopulated();


    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "under review") {
      this.shiprequirementrules.push("Shipment is underreview");
      this.buttonBar.disableAction('ship');
    }

    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "shipped") {
      this.shiprequirementrules.push("Shipment Status Should not be shipped");
      this.buttonBar.disableAction('ship');
    }
    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "shipped and ap charges sent to mas") {
      this.shiprequirementrules.push("Shipment Status Should not be shshipped and ap charges sent to masipped");
      this.buttonBar.disableAction('ship');
    }
  }
  EnableDisableTonuButton() {
    this.buttonBar.enableAction('tonu');
    // var TonuPermission = [];
    //TonuPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentWorkbench.Tonu"));
    //if (TonuPermission.length > 0) { this.buttonBar.disableAction('tonu'); return }
    //if (TonuPermission.length > 0) {  if (TonuPermission[0].PermissionType.toLowerCase() != "read modify") { this.buttonBar.disableAction('tonu'); return }  }

    if (this.TenderstatusLableShow) {
      if (this.ShipmentDetails.tenderStatusCode.toLowerCase() != "tender accept") {
        this.buttonBar.disableAction('tonu');
      }
    }
    else {
      const seltenstcode = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
      if (seltenstcode.code.toLowerCase() != "tender accept") { this.buttonBar.disableAction('tonu'); return }
    }
    if (this.ShipmentDetails.isSendToMAS) { this.buttonBar.disableAction('tonu'); return }
    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "under review") { this.buttonBar.disableAction('tonu'); return }

  }
  EnableDisableCancelButton() {
    this.buttonBar.enableAction('cancel');
    if (this.ShipmentDetails.isSendToMAS) { this.buttonBar.disableAction('cancel'); return; }
    if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() == 'cancelshipment') { this.buttonBar.disableAction('cancel'); return; }
    if (this.ShipmentDetails.shipmentStatusCode.trim().toLowerCase() == "under review") { this.buttonBar.disableAction('cancel'); return }
    var CancelPermission: any = [];
    CancelPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentWorkbench.Cancel"));
    if (CancelPermission.length = 0) { this.buttonBar.disableAction('cancel'); return }
    if (CancelPermission.length > 0) {
      if (CancelPermission[0].PermissionType.toLowerCase() != "read and modify") { this.buttonBar.disableAction('cancel'); return; }
    }
    if (this.ShipmentDetails.hasVersions) { this.buttonBar.disableAction('cancel'); return; }
  }
  EnableDisableDeleteButton() {
    this.buttonBar.enableAction('delete');
    if (this.ShipmentDetails.isSendToMAS) { this.buttonBar.disableAction('delete'); return; }
  }
  EnableDisableTenderStatus() {
    if (this.ShipmentDetails.shipmentTenderStatusID == null) {
      const seltenstid = this.TenderStatusforDD.find(x => x.name.toLowerCase() == "tendered");
      if (seltenstid != undefined && seltenstid != null) { this.SelectedTenderStatus = seltenstid.id; }
    }
    if (this.editShipmentHasReadOnlyAccess) {
      this.TenderStatusDisbled = true;
      return;
    }

    var TenderPermission: any = [];
    TenderPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("TenderAccept"));
    if (TenderPermission.length > 0) {
      if (TenderPermission[0].PermissionType.toLowerCase() == "read and modify") {
        if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() == 'open shipment needs to be completed' && !this.ShipmentDetails.isSendToMAS
          && this.ShipmentDetails.tenderStatusCode.toLowerCase() != "tender accept") {
          this.TenderStatusDisbled = false;
          return;
        }
        else { this.TenderStatusDisbled = true; }
      }
      else { this.TenderStatusDisbled = true; }
    }
    else { this.TenderStatusDisbled = true; }

  }
  EnableDisableOrderLocation() {
    this.OrderToLocationDisbled = false;
    this.OrderFromLocationDisbled = false;
    if (this.editShipmentHasReadOnlyAccess) {
      this.OrderToLocationDisbled = true;
      this.OrderFromLocationDisbled = true;
      return;
    }
    if (this.ShipmentDetails.isSendToMAS) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
        this.OrderFromLocationDisbled = true;
        this.OrderToLocationDisbled = true;
        return;
      }
    }
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn") {
      if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() == 'shipped and ap charges sent to mas') {
        this.OrderFromLocationDisbled = true;
        this.OrderToLocationDisbled = true;
        return;
      }
    }
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "cpuorder" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customer") {
      if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() == 'shipped and ap charges sent to mas') {
        this.OrderFromLocationDisbled = true;

        return;
      }
    }
   
  }
  EnableDisableAppointments() {
    this.OrderAppointmentDisable = false;
    if (this.editShipmentHasReadOnlyAccess) { this.OrderAppointmentDisable = true; return; }
    //if (this.ShipmentDetails.isSendToMAS) { this.OrderAppointmentDisable = true; return; }
    ////if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() == 'open shipment needs to be completed'
    ////  && (this.ShipmentDetails.tenderStatusCode.toLowerCase() == 'tender accepted'
    ////    || this.ShipmentDetails.tenderStatusCode.toLowerCase() == 'tendered')) { this.OrderAppointmentDisable = false; }
    ////else { this.OrderAppointmentDisable = true; }
  }

  EnableDisableToReceiveCheck() {
    this.onReceiveDisable = false;
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
      this.onReceiveDisable = false;
      this.OnreceiveHide = false;
      if (this.ShipmentDetails.isSendToMAS) { this.onReceiveDisable = true; return; }
      if (this.Shippingreceivingdisabled) { this.onReceiveDisable = true; }
    }
    else {
      this.onReceiveDisable = true;
      this.OnreceiveHide = true;
    }
  }

  EnableDisableCarrierPickup() {
    this.CarrierPickupdisabled = false;
    if (this.ShipmentDetails.isSendToMAS) { this.CarrierPickupdisabled = true; return }
  }

  EnableDisableStopDelivery() {
    this.StopDeliverydisabled = false;
    if (this.ShipmentDetails.isSendToMAS) { this.StopDeliverydisabled = true; return; }
  }

  EnableDisableToShipCheck() {
    this.onShipDisable = false;
    this.OnshipHide = false;
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
      || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") {
      this.onShipDisable = true;
      this.OnshipHide = true;
      return;
    }
    // if (this.ShipmentDetails.tenderStatusCode.toLowerCase() != "tender accept") { this.onShipDisable = true; }
    if (this.ShipmentDetails.isSendToMAS) { this.onShipDisable = true; return; }
    if (this.Shippingreceivingdisabled) { this.onShipDisable = true; }

  }

  EnableDisableApproveMasButton() {
    this.buttonBar.enableAction('approveAndMas');
    //var AppmasPermission: any = [];
    //AppmasPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("Shipmentapprovetomas"));
    //if (AppmasPermission.length == 0) { this.buttonBar.disableAction('approveAndMas'); return; }
    //if (AppmasPermission.length > 0) {
    //  if (AppmasPermission[0].PermissionType.toLowerCase() != "read and modify") { this.buttonBar.enableAction('approveAndMas'); return; }
    //}

    // // if (this.ShipmentDetails.hasVersions) { this.buttonBar.disableAction('approveAndMas'); return; }
    if (this.ShipmentDetails.isSendToMAS) { this.buttonBar.disableAction('approveAndMas'); return; }
    if (this.ShipmentDetails.shipmentStatusCode.toLowerCase() != "under review") { this.buttonBar.disableAction('approveAndMas'); return }
  }

  EnableDisableResendtoMasButton() {

    this.buttonBar.enableAction('resendToMas');
    //var ResmasPermission: any = [];
    //ResmasPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentResend"));
    //if (ResmasPermission.length == 0) { this.buttonBar.disableAction('resendToMas'); return; }
    //if (ResmasPermission.length > 0) {
    //  if (ResmasPermission[0].PermissionType.toLowerCase() != "read and modify") { this.buttonBar.disableAction('resendToMas'); return; }
    //}
    if (!this.ShipmentDetails.shipmentOrderSendtoMAS) {
      this.buttonBar.disableAction('resendToMas');
      //if (this.ShipmentDetails.hasVersions) { this.buttonBar.enableAction('resendToMas'); }
      //else { this.buttonBar.disableAction('resendToMas'); }
    }
  }

  EnableDisableOrderComments() {
    this.OrderCommentsDisable = false;
    if (this.editShipmentHasReadOnlyAccess) { this.OrderCommentsDisable = true; return }
  }

  EnableDisableMaterialGridAddEdit() {

    this.MaterialGridAddEditDisable = false;
    if (this.editShipmentHasReadOnlyAccess) { this.MaterialGridAddEditDisable = true; return; }
    if (this.ShipmentDetails.isSendToMAS) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
        || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") { this.MaterialGridAddEditDisable = true; }
    }
  }

  CheckCarrierOuttimePopulated() {
    this.CarrierOuttimePopulated = false;
    if (this.ShippingOrders != null && this.ShippingOrders.length > 0) {
      const sorder = this.ShippingOrders.filter(x => x.route = 1);
      const fromlocationid = sorder[0].fromLocationID;
      const pctimings = this.CarrierPickupData.filter(x => x.LocationID == fromlocationid);
      if (pctimings.length > 0) {
        if (pctimings[0].CheckOutTime != null) { this.CarrierOuttimePopulated = true; }
      }
    }
  }

  CheckCarrierIntimePopulated() {
    //this.CarrierIntimePopulated = false;
    //if (this.ShippingOrders != null && this.ShippingOrders.length > 0) {
    //  const sorder = this.ShippingOrders.filter(x => x.route = 1);
    //  const tolocationid = sorder[0].toLocationid;
    //  const pctimings = this.CarrierStopData.filter(x => x.LocationID == tolocationid);
    //  if (pctimings.length > 0) {
    //    if (pctimings[0].CheckOutTime != null) { this.CarrierIntimePopulated = true; }
    //  }
    //}
    if (this.CarrierStopDeliverycidt != null) { this.CarrierIntimePopulated = true; }
    else { this.CarrierIntimePopulated = false; }

  }


  GetShipmentOrders(ShipmentId: number) {
    this.shipmentManagementService.GetShippingOrders(ShipmentId)
      .subscribe(data => {
        this.ShippingOrders = data.data;

        //if we have only 1 item in list then show it as default selected
        if (this.ShippingOrders.length == 1) {
          this.OrderTypeId = this.ShippingOrders[0].orderid;
          var dd = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId));
          this.BindMaterialList(Number(dd.orderid), 2, Number(dd.orderTypeID));
        }
        this.SetFromlocationforCarrierDD();
        this.SetTolocationforCarrierDD();
        this.GetBusinessPartner();

        this.ShippingOrders.forEach(order => {
          if (order.pickupAppointment != null) { order.pickupAppointment = new Date(order.pickupAppointment) }
          if (order.deliveryAppointment != null) { order.deliveryAppointment = new Date(order.deliveryAppointment) }
          if ((order.transportationComment != null || order.transportationComment == "")) {
            this.validationspanishTransportationComment(order.transportationComment, order.orderid);
          }
          if ((order.loadingComment != null || order.loadingComment == "")) {
            this.validationspanishLoadingComment(order.loadingComment, order.orderid);
          }
        });

        this.GetShipmentOrderDetails(ShipmentId);


        this.CheckIsNaftaCCIShow();
      });
  }

  EnableDisableProformaInvoice() {
    if (this.ShipmentDetails.shipmentTypeCode != undefined) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") { this.buttonBar.disableAction('performaInvoice') }
      else { this.buttonBar.enableAction('performaInvoice') }
    }
  }

  CheckIsNaftaCCIShow() {
    this.buttonBar.disableAction('viewnafta');
    this.buttonBar.disableAction('viewcci');
    this.ShippingOrders.forEach(order => {
      if (order.documentPVFrom == 1) {
        this.buttonBar.enableAction('viewnafta');
        this.buttonBar.enableAction('viewcci');
        return;
      }
      if (order.documentPVTo == 1) {
        this.buttonBar.enableAction('viewnafta');
        this.buttonBar.enableAction('viewcci');
        return;
      }

      if (order.countryCodeFrom != undefined && order.countryNameFrom != undefined) {
        if (order.countryCodeFrom.toLowerCase == "mex" || order.countryNameFrom.toLowerCase() == "mexico") {
          this.buttonBar.enableAction('viewnafta');
          this.buttonBar.enableAction('viewcci');
          return;
        }
        if (order.countryCodeFrom.toLowerCase == "can" || order.countryNameFrom.toLowerCase() == "canada") {
          this.buttonBar.enableAction('viewnafta');
          this.buttonBar.enableAction('viewcci');
          return;
        }
      }

    })
  }

  GetLocationsforDD(ShipmentType: number, ClientID: number) {

    this.shipmentManagementService.GetAllLocationsforDD(ShipmentType, ClientID)

      .subscribe(result => {

        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.LocationsforDD = result.data.filter(x => x.allLoctionType == 'ToLocation');
          this.OrderLocationsforDD = [];
          this.LocationsforDD.forEach(location => {
            let loc: any = {};
            loc.label = location.name;
            loc.value = location.id;
            this.OrderLocationsforDD.push(loc);
          });

          this.LocationsforDDFrom = result.data.filter(x => x.allLoctionType == 'FromLocation');
          this.OrderLocationsforDDFrom = [];
          this.LocationsforDDFrom.forEach(location => {
            let loc: any = {};
            loc.label = location.name;
            loc.value = location.id;
            this.OrderLocationsforDDFrom.push(loc);
          });

          this.GetAllShipmentMetod(ShipmentType);
          // this.GetShipmentOrders(ShipmentType);
          //this.GetShipmentOrderDetails(ShipmentType); // data from shipmentorderdetails  of specified shipemnt id
          //this.GetShippingOrdersDetails(ShipmentType); // data from salesorderdetails for  Material Grid of specified shipment id
          //this.GetApcharges(ShipmentType);

          //OrderLocationsforDD
        }
      });
  }

  GetTenderstatusforDD() {
    this.shipmentManagementService.GetTenderstatusforDD()
      .subscribe(data => {
        this.TenderStatusforDD = data.data;

        if (this.ShipmentDetails != undefined) {
          const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
          if (selectedtenderstatus != undefined) { this.SelectedTenderStatus = [{ "id": selectedtenderstatus.id, "name": selectedtenderstatus.name }]; }
        }
      });
  }
  GetChargeTypes() {
    this.ChargeTypes = [];

    this.shipmentManagementService.GetChargeType(this.apchargeBusinessPartner[0].id, 0, this.ShipmentDetails.id).subscribe(result => {
      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
        this.ChargeTypes = result.data;
      }
    });

  }

  //EquipmentChange(event) {
  //  this.ShippingSaveDetails.equipmentTypeID = event.target.value;
  //}

  //var ChargeCategory=[];
  //this.shipmentManagementService.GetChargeCategory()
  //  .subscribe(result => {
  //    if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
  //      ChargeCategory = result.data;
  //   }
  //  });

  //this.shipmentManagementService.GetChargeType(this.apchargeBusinessPartner[0].id, 0, this.ShipmentDetails.id) .subscribe(result => {
  //     if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
  //       this.ChargeTypes = result.data;
  //  const ChargeTypesAll = result.data;
  //  if (ChargeCategory.length > 0) {
  //    const cctype = ChargeCategory.filter(x => x.code == "AP");
  //    if (cctype != undefined && cctype != null) {
  //      this.ChargeTypes = ChargeTypesAll.filter(f => f.chargeCategoryId === cctype[0].id);
  //    }
  //    else { this.ChargeTypes = ChargeTypesAll; }
  //  }
  //  else {this.ChargeTypes = ChargeTypesAll; }
  //      }
  //    });
  //}

  GetFrieghtMode() {
    this.shipmentManagementService.GetFrieghtMode()
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.freightModeData = result.data;
          if (this.ShipmentDetails != undefined) {
            const selectedMode = this.freightModeData.find(x => x.id == this.ShipmentDetails.freightModeID);
            if (selectedMode != undefined) {
              this.SelectedfreightMode = [{ "id": selectedMode.id, "name": selectedMode.name }];
            }
          }

        }
      });
  }

  GetBusinessPartner() {
    if (!(this.ShippingOrders == null || this.ShippingOrders == undefined || this.ShippingOrders.length == 0)) {
      let BPlist = [];
      const FromBP = this.ShippingOrders.map(({ businessPartner }) => { return { businessPartner } })

      FromBP.forEach(bp => {
        let bparray = bp.businessPartner.split('*BP*');
        if (bparray.length > 0) {
          bparray.forEach(bpa => {
            if (bpa != '') {
              let bpitem = bpa.split('*B*');
              BPlist.push({ id: bpitem[0], name: bpitem[1], BPtype: bpitem[2] })
            }
          })
        }
      })
      this.ApChargeBPList = BPlist.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
    }
  }

  SetFromlocationforCarrierDD() {
    this.CarrierPickupLocationID = 0;
    const fromlocations = this.ShippingOrders.map(({ fromLocationID, fromLocationName }) => {
      return { fromLocationID, fromLocationName }
    });
    this.FromlocationforCarrierDD = fromlocations.filter((thing, index, self) =>
      index === self.findIndex((t) => (t.fromLocationID === thing.fromLocationID)))
    if (this.FromlocationforCarrierDD != undefined && this.FromlocationforCarrierDD.length > 0) {
      this.CarrierPickupLocationID = this.FromlocationforCarrierDD[0].fromLocationID;
    }
  }

  SetTolocationforCarrierDD() {
    this.CarrierStopDeliveryLocationID = 0;
    const tolocations = this.ShippingOrders.map(({ toLocationID, toLocationName }) => {
      return { toLocationID, toLocationName }
    });
    this.TolocationforCarrierDD = tolocations.filter((thing, index, self) =>
      index === self.findIndex((t) => (t.toLocationID === thing.toLocationID)))
    if (this.TolocationforCarrierDD != undefined && this.FromlocationforCarrierDD.length > 0) {
      this.CarrierStopDeliveryLocationID = this.TolocationforCarrierDD[0].toLocationID;
    }
    this.GetLocationDetails(tolocations[0].toLocationID);
  }


  SetCarrierdata(LocationID, Checkintime, Checkouttime, Datavar) {
    var dataexists: boolean = false;
    for (var i = 0; i < Datavar.length; i++) {
      if (Datavar[i]['LocationID'] === parseInt(LocationID)) {
        dataexists = true;
        Datavar[i]['LocationID'] = parseInt(LocationID);
        Datavar[i]['CheckInTime'] = this.converttoSqlStringWithT(Checkintime);
        Datavar[i]['CheckOutTime'] = this.converttoSqlStringWithT(Checkouttime);
        break;
      }
    }

    if (!dataexists) {
      // insert new element
      let stopdata: any = {};
      stopdata.LocationID = parseInt(LocationID);
      stopdata.CheckInTime = Checkintime;
      stopdata.CheckOutTime = Checkouttime;
      Datavar.push(stopdata);
    }
  }

  TimeDifferenceHrsMins(intime, outtime) {
    let diffMs = new Date(outtime).valueOf() - new Date(intime).valueOf();
    let diffHrs = (diffMs / 3600000).toFixed(2); // hours
    //let diffMins = Math.round((diffMs  % 3600000) / 60000); // minutes
    return diffHrs.toString();
  }

  InitializeCarrierPickupdata(sodtimings: any) {

    this.CarrierPickupData = [];
    if (sodtimings != undefined) {
      for (var i = 0; i < sodtimings.length; ++i) {
        let stopdata: any = {};
        if (this.CarrierPickupData.indexOf(sodtimings[i].fromLocationId) == -1) {
          stopdata.LocationID = parseInt(sodtimings[i].fromLocationId);
          stopdata.CheckInTime = sodtimings[i].fromCarrierInTime;
          stopdata.CheckOutTime = sodtimings[i].fromCarrierOutTime;
          this.CarrierPickupData.push(stopdata);
        }
      }
    }

  }

  InitializeCarrierStopdata(sodtimings: any) {
    this.CarrierStopData = [];
    if (sodtimings != undefined) {
      for (var i = 0; i < sodtimings.length; ++i) {
        let stopdata: any = {};
        if (this.CarrierStopData.indexOf(sodtimings[i].toLocationId) == -1) {
          stopdata.LocationID = parseInt(sodtimings[i].toLocationId);
          stopdata.CheckInTime = sodtimings[i].toCarrierInTime;
          stopdata.CheckOutTime = sodtimings[i].toCarrierOutTime;
          this.CarrierStopData.push(stopdata);
        }
      }
    }
  }

  GetShipmentOrderDetails(ShipmentId: number) {

    this.shipmentManagementService.GetShipmentOrderDetailsforSID(ShipmentId)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.SODTimings = result.data;
          this.CarrierPickupLocationID = this.FromlocationforCarrierDD[0].fromLocationID;
          this.CarrierStopDeliveryLocationID = this.TolocationforCarrierDD[0].toLocationID;

          this.InitializeCarrierPickupdata(this.SODTimings);
          this.InitializeCarrierStopdata(this.SODTimings);
          this.GetStartTimings();
          this.GetStopTimings();
          this.GetLocationDetails(this.SODTimings[0].toLocationId);
          this.EnableDisableShipReceiveButtons();

        }
      })
  }

  GetApcharges(ShipmentId: number) {
    this.shipmentManagementService.GetApcharges(ShipmentId)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          const apcharges = result.data;

          if (apcharges != undefined && apcharges != null) {
            this.apchargesData = apcharges.map((apcharges, index) => { return { SNo: index + 1, ...apcharges } }
            )
            this.apchargesData.forEach(row => {
              row.autoAdded = row.autoAdded ? "Yes" : "No";
            })
            this.apchargesDataEdit = [...this.apchargesData];

            this.apchargesServer = apcharges.map((apcharges, index) => { return { SNo: index + 1, ...apcharges } }
            )
            this.convertBooleanToYesNoAPChargeServer();
          }
          else {
            this.apchargesData = [];
            this.apchargesDataEdit = [];
            this.apchargesServer = [];
          }
          this.apchargesDataTab = new MatTableDataSource<any>(this.apchargesData);
          this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);

        }
      });
  }

  public displayChargeModified(element: any) {
    if (element != undefined) {
      if (element.chargeValue != "" && Number(element.chargeValue) != 0 && (element.chargeModifiedValue == null || element.chargeModifiedValue == "" || Number(element.chargeModifiedValue) == 0)) {

        return element.chargeValue;
      }
      else {
        return element.chargeModifiedValue;
      }
    }
  }

public IsAutoAdded(element:any){
  if (element != undefined) {
    if (element.chargeValue == "" && element.chargeModifiedValue != "" && Number(element.chargeModifiedValue) > 0) {
      return "No";
    }
    if (element.chargeValue != "") {
      return "Yes";
    }
    
  }

  return "No";
}

  async SelectForEditApcharges(row) {
    // if (row.autoAdded != 'Yes') {
    this.selectionAPCEdit.clear();
    this.apchargesDataEdit.forEach(row1 => { row1.highlighted = false });
    this.selectionAPCEdit.select(row);
    row.highlighted = true;
    this.apchargeEditno = row.SNo;
    this.apchargeEditMode = true;
    this.apchargeEditModeText = 'key_Insert';
    const seleditBP = this.ApChargeBPList.find(x => x.id == row.businessPartnerID);
    this.apchargeBusinessPartner = [{ "id": seleditBP.id, "name": seleditBP.name, "BPtype": seleditBP.BPtype }];
    this.ChargeTypes = [];

    this.shipmentManagementService.GetChargeType(this.apchargeBusinessPartner[0].id, 0, this.ShipmentDetails.id).subscribe(result => {
      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
        this.ChargeTypes = result.data;
        const seleditCT = this.ChargeTypes.find(x => x.id == row.chargeID);
        this.apchargeChargeType = [{ "id": seleditCT.id, "name": seleditCT.name }];
        this.apchargeContractAmount = row.chargeValue;
        if (row.chargeModifiedValue == 0 || row.chargeModifiedValue == null) {
          this.apchargeModifiedAmount = row.chargeValue;
        }
        else {
          this.apchargeModifiedAmount = row.chargeModifiedValue;
        }
      }
    });

    //}
    //else {
    //  this.toastrService.warning("This charge is not editable");
    //}
  }
  DeleteApCharge(sno, event) {
    event.stopPropagation();
    this.apchargesDataEdit.splice(sno - 1, 1);
    this.apchargesDataEdit.forEach((row, index) => {
      row.SNo = index + 1;
    })
    this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);
  }
  ClearApcharge() {
    // this.apchargesDataTemp = [];
    this.apchargeEditMode = false;
    this.selectionAPCEdit.clear();
    this.apchargesDataEdit.forEach(row1 => { row1.highlighted = false });
    this.apchargeBusinessPartner = [];
    this.apchargeChargeType = [];
    this.apchargeModifiedAmount = 0;
    this.apchargeEditno = 0;
    this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);
    this.ChargeTypes = [];
  }
  EditApcharge() {
    this.apchargesDataEdit.forEach(row => {
      if (row.SNo == this.apchargeEditno) {
        row.businessPartnerType = this.apchargeBusinessPartner[0].BPtype;
        row.businessPartnerLocationID = this.apchargeBusinessPartner[0].id;
        row.chargeID = this.apchargeChargeType[0].id;
        row.chargeUOMID = this.apchargeUOM;
        row.chargeValue = this.apchargeContractAmount;
        row.chargeModifiedValue = this.apchargeModifiedAmount;
        this.ApChargeNewShipmentStatustemp == "underreview"
      }
    });
    this.ClearApcharge();
    this.APCModified = true;

  }

  OpenApchargesEdit() {
    this.ClearApcharge();
    this.apchargesDataEdit = [...this.apchargesData];
    this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);
  }

  AddApcharge() {
    let apcharge: any = {};
    if (this.apchargesDataEdit != undefined && this.apchargesDataEdit != null) { apcharge.SNo = this.apchargesDataEdit.length + 1; }
    else {
      apcharge.SNo = 1;
    }
    if (this.apchargeBusinessPartner == undefined) {
      this.toastrService.error("Please select a Business Partner.");
      return false;
    }
    if (this.apchargeChargeType == undefined) {
      this.toastrService.error("Please select a Charge Type.");
      return false;
    }
    if (this.apchargeModifiedAmount == undefined || this.apchargeModifiedAmount == null) {
      this.toastrService.error("Please enter Modified Amount.");
      return false;
    }
    apcharge.shipmentID = this.ShippingSaveDetails.id;
    apcharge.bpType = this.apchargeBusinessPartner[0].BPtype;
    apcharge.businessPartnerID = this.apchargeBusinessPartner[0].id;
    apcharge.businessEntityID = this.apchargeBusinessPartner[0].id;
    apcharge.chargeID = this.apchargeChargeType[0].id;
    apcharge.chargeUOMID = this.apchargeUOM;
    apcharge.chargeSequece = 1;
    apcharge.chargeValue = this.apchargeContractAmount;
    apcharge.chargeModifiedValue = this.apchargeModifiedAmount;
    apcharge.salesTaxClassId = 1;
    apcharge.clientID = 100;
    apcharge.modifiedBy = "U";
    apcharge.isManual = 1;
    apcharge.isAutoAdded = 0;
    apcharge.autoAdded = "No",
      apcharge.businessPartnerName = this.apchargeBusinessPartner[0].name;
    apcharge.billingEntity = this.apchargeBusinessPartner[0].name;
    apcharge.chargeTypeName = this.apchargeChargeType[0].name;
    apcharge.chargeUOMName = "US Dollar Currency"
    apcharge.salesTaxClassName = "Non-Taxable",
      this.apchargesDataEdit.push(apcharge);
    this.ApChargeNewShipmentStatus = "Shipped"
    this.ApchargeModifiedTemp = true;
    this.ApChargeNewShipmentStatustemp = "underreview"
    this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);
    this.ClearApcharge();
    this.APCModified = true;
  }
  CheckAPCModified() {
    if (this.APCModified) {
      this.toastrService.warning("Data Modified. Please click Add button to save the record.");
    }
    else {
      this.apcmclose.nativeElement.click();
    }
  }
  AddFinalApcharge() {

    this.apchargesData = [];

    this.apchargesData = [...this.apchargesDataEdit];
    this.APCModified = false;
    if (this.ApChargeNewShipmentStatustemp == "underreview") {
      this.ApChargeNewShipmentStatus = "underreview"
    }
    this.apchargesDataTab = new MatTableDataSource<any>(this.apchargesData);
  }
  CloseApcharge() {
    this.ApChargeNewShipmentStatus = "";
    this.apchargesDataEdit = [...this.apchargesData];

    this.apcmclose.nativeElement.click();
  }

  GetAPchargesOrderAmount() {
    if (this.apchargeBusinessPartner != undefined && this.apchargeChargeType != undefined) {
      this.apchargesDataEdit.forEach(apcharge => {
        if (apcharge.businessPartnerID == this.apchargeBusinessPartner[0].id && apcharge.chargeID == this.apchargeChargeType[0].id) {
          this.apchargeChargeType = [];
          this.toastrService.warning("Charges are already added. Use Edit to modify them.");
          return;
        }
      })

      this.shipmentManagementService.GetOrderAmountforApcharges(this.apchargeBusinessPartner[0].id, this.apchargeChargeType[0].id, this.ShipmentDetails.id)
        .subscribe(result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            if (typeof (result.data) == 'number') {
              this.apchargeContractAmount = result.data;
              this.apchargeModifiedAmount = result.data;
            }
            else {
              this.apchargeContractAmount = 0;
              this.apchargeModifiedAmount = 0;
            }
          }
        });
    }
  }

  MakeShipmentDetailsforSave() {
    // Order comment adding to Main JSON starts 

    var OrderComments: any = [];
    var Appointments: any = [];
    var Locations: any = [];
    var cpddata: any = [];
    var csddata: any = [];
    if (this.ShippingOrders != undefined) {
      this.ShippingOrders.forEach(order => {
        let comment: any = {};
        comment.orderid = order.orderid;
        comment.transportationComment = order.transportationComment;
        comment.spanishTransportationComment = order.spanishTransportationComment;
        comment.loadingComment = order.loadingComment;
        comment.spanishLoadingComment = order.spanishLoadingComment;
        comment.orderComment = order.orderComment;
        comment.ordercommentSpanish = order.ordercommentSpanish;
        comment.transplaceOrderComment = order.transplaceOrderComment;
        comment.transplaceDeliveryComment = order.transplaceDeliveryComment;
        comment.entityCode = order.entityCode;
        OrderComments.push(comment);
      })

      this.ShippingOrders.forEach(order => {
        let appointment: any = {};
        appointment.orderid = order.orderid;
        appointment.pickupAppointment = this.converttoSqlStringWithT(order.pickupAppointment);
        appointment.deliveryAppointment = this.converttoSqlStringWithT(order.deliveryAppointment);
        appointment.entityCode = order.entityCode;
        Appointments.push(appointment);

      })

      this.ShippingOrders.forEach(order => {


        let location: any = {};
        location.orderid = order.orderid;
        if (order.fromLocationID != null && order.fromLocationID != undefined) {
          location.fromLocationID = parseInt(order.fromLocationID);
        }
        else {
          location.fromLocationID = null;
        }
        location.toLocationID = Number(order.toLocationID);
        location.orderTypeID = order.orderTypeID;
        location.purchaseOrderNumber = order.purchaseOrderNumber;
        location.entityCode = order.entityCode;
        location.fromBusinessPartnerContractID = order.fromBusinessPartnerContractID;
        location.toBusinessPartnerContractID = order.toBusinessPartnerContractID;
        location.fromCustomerContractID = order.fromCustomerContractID;
        location.toCustomerContractID = order.toCustomerContractID;

        Locations.push(location);
      })
    }
    this.ShippingSaveDetails.OrderComments = OrderComments;
    this.ShippingSaveDetails.Locations = Locations;
    this.ShippingSaveDetails.Appointments = Appointments;
    var tt = this.ShippingOrdersDetails;
    
    var materialList: any = [];
    if ((this.FinalMaterialList != null && this.FinalMaterialList != undefined) || (this.ShippingOrdersDetails != null && this.ShippingOrdersDetails != undefined)) {
      if (this.FinalMaterialList.length > 0) {
        this.FinalMaterialList.forEach(material => {
          let materials: any = {};
          materials.materialID = material.finalmaterialID;
          materials.orderQuantity = material.finalorderQuantity;
          materials.showOnBOL = material.finalshowOnBOL;
          materials.priceMethodID = material.finalpriceMethodID;
          materials.orderNumber = material.finalorderNumber;
          materials.shippedQuantity = Number(material.finalshippedQuantity);
          materials.commodityID = material.finalcommodityID;
          materials.uomcode = material.finaluomcode;
          materials.salesOrderID = material.finalsalesOrderID;
          materials.newMaterial = material.finalnewMaterial;
          materials.id = material.finalid;
          materials.toLocationId = Number(material.finaltoLocationId);
          materials.entityCode = material.finalentityCode;
          materials.equivalentPallets = material.finalequivalentPallets;
          materialList.push(materials);
        })
      }
      else if (this.ShippingOrdersDetails.length > 0) {
       
        this.ShippingOrdersDetails.forEach(material => {
         
          let materials: any = {};
          materials.materialID = material.materialID;
          materials.orderQuantity = material.orderQuantity;
          materials.showOnBOL = material.showOnBOL;
          materials.priceMethodID = material.priceMethodID;
          materials.orderNumber = material.orderNumber;
          materials.shippedQuantity = Number(material.shippedQuantity);
          materials.commodityID = material.commodityID;
          materials.uomcode = material.uomcode;
          materials.salesOrderID = material.salesOrderID;
          materials.newMaterial = material.newMaterial;
          materials.id = material.id;
          materials.toLocationId = Number(material.toLocationId);
          materials.entityCode = material.entityCode;
          materials.equivalentPallets = material.equivalentPallets;
          materialList.push(materials);
        })
      }
    }

    this.ShippingSaveDetails.salesOrderDetail = materialList;
    // this.ShippingSaveDetails.salesOrderDetail = this.ShippingOrdersDetails;
    this.ShippingSaveDetails.deletesalesOrderDetail = this.TempDeleteMaterial;
    this.ShippingSaveDetails.clientID = this.authenticationService.currentUserValue.ClientId;
    this.ShippingSaveDetails.updateby = this.authenticationService.currentUserValue.LoginId;
    //this.ShippingSaveDetails.orderType = this.shipmentManagementService.OrderType;

    this.ShippingSaveDetails.apcharges = this.apchargesData.map(({ shipmentID, bpType, businessPartnerID, businessPartnerContactID,
      chargeID, chargeUOMID, chargeValue, chargeModifiedValue, autoAdded ,  }) => {
      return {
        shipmentID, BusinessPartnerType: bpType, BusinessPartnerLocationID: parseFloat(businessPartnerID), BusinessPartnerContactID: null,
        CarrierID: parseFloat(businessPartnerID), ChargeID: parseInt(chargeID), ChargeUOMID: parseInt(chargeUOMID), ChargeSequece: 1,
        ChargeValue: parseFloat(chargeValue), ChargeModifiedValue: parseFloat(chargeModifiedValue), SalesTaxClassID: 1, IsManual: (autoAdded == "Yes" ? false : true), IsAutoAdded: (autoAdded == "Yes" ? true : false)
      }
    });

    this.setBusinessPartnerContract(Locations);

    if (this.ShippingSaveDetails.approvedDateTime == "") { this.ShippingSaveDetails.approvedDateTime = null; }

    this.ShipmentDetails.trailerCheckInTime = this.converttoSqlStringWithT(this.TrailerCheckInTime);
    this.ShipmentDetails.trailerCheckOutTime = this.converttoSqlStringWithT(this.TrailerCheckOutTime);
    this.ShipmentDetails.sortStartTime = this.converttoSqlStringWithT(this.SortStartTime);
    this.ShipmentDetails.sortEndTime = this.converttoSqlStringWithT(this.SortEndTime);
    this.ShippingSaveDetails.browserDateTime = this.converttoSqlString(new Date());    
    this.ShippingSaveDetails.apchargesModidifed = this.CheckApchargesModified();

    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") { this.ShipmentDetails.compliedWithShippingInstructions = this.toReceive; }

    this.ShippingSaveDetails.SourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;


  }

  CheckApchargesModified(): boolean {
    let apccount = this.apchargesData.length;
    let apcservercount = this.apchargesServer.length;
    if (apccount != apcservercount) return true;
    else {
      if (JSON.stringify(this.apchargesData) === JSON.stringify(this.apchargesServer)) { return false; }
      else { return true; }
    }
    return false;
  }

  setBusinessPartnerContract(Location:any[]) {
    this.ShippingSaveDetails.apcharges.forEach((value, index) => {
      if (Location.length > 0) {
        var locationExists = Location.find(x => x.fromLocationID == value.BusinessPartnerLocationID || x.toLocationID == value.BusinessPartnerLocationID);

        if (locationExists != undefined) {
          if (locationExists.fromLocationID == value.BusinessPartnerLocationID) {
            value.BusinessPartnerContactID = locationExists.fromBusinessPartnerContractID;
          }
          else if (locationExists.toLocationID == value.BusinessPartnerLocationID){
            value.BusinessPartnerContactID = locationExists.toBusinessPartnerContractID;
          }
        }

      }

    });

  }
  CheckShipValidations(): boolean {
    const cdate = new Date().toISOString().slice(0, 16);
    this.helpbtns = true;
    const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
    if (selectedtenderstatus != undefined) {
      if (selectedtenderstatus.name.toLowerCase() != "tender accept") {
        this.toastrService.warning('Tender Status should be "Tender Accept".');
        return false;
      }
    }

    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "cpuorder") {
      if (this.ShipmentDetails.compliedWithShippingInstructions) {
        this.CheckCarrierOuttimePopulated();
        if (!this.CarrierOuttimePopulated) { this.toastrService.warning("Please enter Carrier Out Time for Pickup."); return false; }
      }

      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
        || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") {
        this.CheckCarrierIntimePopulated();
        if (!this.CarrierIntimePopulated || this.ShipmentDetails.carrierID == null) { this.toastrService.warning("Please enter Carrier In Time for Delivery."); return false; }
      }

    }

    else {
      this.toastrService.warning("To Ship Checkbox is not checked");
      return false;
    }
    //if (this.ShipmentDetails.dropTrailer) {
    //  if (this.TrailerCheckInTime == undefined || this.TrailerCheckInTime == null) {
    //    this.toastrService.warning("Please enter Trailer check In Time");
    //    return false;
    //  }
    //}
    return true;
  }

  ResetValidationCss() {
    
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
      || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ) {
      this.csdChkInTime = true;
      this.cpChkOutTime = true;
    }
    else {
      this.cpChkOutTime = true;
      this.csdChkInTime = false;
    }
  }

  CheckShipReceiveValidations(): boolean {
    
    if (this.TenderStatusforDD != undefined && this.TenderStatusforDD != null) {
      const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
      if (selectedtenderstatus != undefined) {
        if (selectedtenderstatus.name.toLowerCase() != "tender accept") { this.toastrService.warning('Tender Status should be "Tender Accept".'); return false; }
      }
    }
    let vcdate = this.GetDatepart(new Date);
    let vshipdate = this.GetDatepart(this.ShipmentDetails.shipDate);
    let vReceivedate = this.GetDatepart(this.CarrierStopDeliverycidt);
    let vCpuoutdate = this.GetDatepart(this.CarrierPickupcodt);

    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer"
      || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections")
    {
      if (this.CarrierStopDeliverycidt == null) { this.toastrService.warning("Please enter Carrier Stop Delivery -  Carrier In Time"); return false; }
      if (vReceivedate < vshipdate) { this.toastrService.warning("Receive date cannot be less than the carrier out date or shipment ship date."); return false; }
      if (!this.toReceive) { this.toastrService.warning("Please check To Ship Checkbox."); return false; }
      if (vReceivedate > vcdate) { this.toastrService.warning("Receive Date can not be future date"); return false; }
      if (vCpuoutdate > vcdate) {this.shiprequirementrules.push("Carrier Out datetime cannot be future date"); return false; }
    }

    else {
      if (this.CarrierPickupcodt == null) { this.toastrService.warning("Please enter Carrier Out Time for Pickup."); return false; }
      if (vCpuoutdate > vcdate) { this.shiprequirementrules.push("Carrier Out datetime cannot be future date"); return false; }
      if (vshipdate > vcdate) {this.toastrService.warning("Ship Date cannot be a future date."); return false; }
      if (!this.ShipmentDetails.compliedWithShippingInstructions) { this.toastrService.warning("Please check To Ship Checkbox."); return false; }
    }
    return true;
  }

  SaveShipment() {
    this.MakeShipmentDetailsforSave();
    this.shipmentManagementService.SaveShipment(this.ShippingSaveDetails)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {

          this.toastrService.info(result.data[0].message);

          if (result.data[0].shipmentID != null && result.data[0].shipmentID != 0) {
            this.GetShipmentDetails(result.data[0].shipmentID, 1);
          }
          else {
            this.GetShipmentDetails(this.ShipmentDetails.id);
          }
        }
      });
  }

  SaveandNextShipment() {
    this.MakeShipmentDetailsforSave();
    ////if (this.ShippingSaveDetails.salesOrderDetail.length == 0) {
    ////  this.toastrService.warning('Order should contain at least one Material.');
    ////  return;
    ////}
    this.shipmentManagementService.SaveShipment(this.ShippingSaveDetails)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.toastrService.info(result.data[0].message);
          for (var i = 0; i < this.ShipmentsforEdit.length - 1; i++) {
            if (this.ShipmentsforEdit[i].id == this.ShipmentDetails.id) {
              this.SelectedShipmentsforEdit = this.ShipmentsforEdit[i + 1];
              this.GetShipmentDetailsforEdit(this.SelectedShipmentsforEdit);
              break;
            }
          }
        }
      });
  }
  ShipSelectedShipment() {
    if (this.FinalShippingOrdersDetails.length == 0) {
      this.toastrService.warning("At least one material should be present in Shipment.")
      return;
    }
    else {
      let issaveconditionsvalid = this.CheckShipReceiveValidations();
      if (issaveconditionsvalid) {
        this.MakeShipmentDetailsforSave();
        this.shipmentManagementService.ShipSelecteShipment(this.ShippingSaveDetails)
          .subscribe(result => {
            if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              this.toastrService.info(result.data.message);
              this.MoveNextafterShipReceive();
            }
            //  // this.GetShipmentDetails(this.ShipmentDetails.id);
          });
      }
    }

  }

  MoveNextafterShipReceive() {
    var previousID = this.ShipmentDetails.id;
    if (this.ShipmentsforEdit.length == 1) {
      this.GetShipmentDetails(this.SelectedShipmentsforEdit.id);
      return;
    }
    for (var i = 0; i < this.ShipmentsforEdit.length - 1; i++) {
      if (this.ShipmentsforEdit[i].id == this.ShipmentDetails.id) {
        this.SelectedShipmentsforEdit = this.ShipmentsforEdit[i + 1];
        this.shipmentManagementService.EditingShipment = this.SelectedShipmentsforEdit.shipmentNumber;
        this.shipmentManagementService.EditingShipmentID = this.SelectedShipmentsforEdit.id;
        this.GetShipmentDetails(this.SelectedShipmentsforEdit.id);
        break;
      }
    }
    if (this.ShipmentsforEdit.length > 1) {
      this.ShipmentsforEdit.splice(this.ShipmentsforEdit.findIndex(item => item.id === previousID), 1);
      this.shipmentManagementService.ShipmentsforEdit = this.ShipmentsforEdit
      this.shipmentManagementService.ShipmentforEditOrders.splice(this.shipmentManagementService.ShipmentforEditOrders.findIndex(item => item.id === previousID), 1)
    }
  }

  ReceiveSelectedShipment() {

    if (this.FinalShippingOrdersDetails.length == 0) {
      this.toastrService.warning("Atleast one material should present in Shipment after creating shipment.")
      return;
    }
    else {
      let isReceiveconditionsvalid = this.CheckShipReceiveValidations();
      if (isReceiveconditionsvalid) {
        this.MakeShipmentDetailsforSave();
        this.shipmentManagementService.ShipSelecteShipment(this.ShippingSaveDetails)
          .subscribe(result => {
            if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              if (result.data.status.toLowerCase() == "tpcfail") {
                this.TonuCancelMessage = "Total pallet quantity exceeds maximum equipment capacity.";
                this.TonuCancelpopup = "tpcfail";
                $("#tonuPopup").modal('show');
              }
              else {
                this.toastrService.info(result.data.message);
                this.MoveNextafterShipReceive();

              }
            }
            
            // // this.GetShipmentDetails(this.ShipmentDetails.id);
          });
      }
    }
  }
  Tonu() {
    
    this.TonuCancelMessage = "Do you want to Cancel and apply TONU to this shipment?";
    this.TonuCancelpopup = "tonu";
    $("#tonuPopup").modal('show');
  }

  TonuCancelshipment() {
    var RequestObject = {
      shipmentid: this.SelectedShipmentsforEdit.id,
      updateby: this.authenticationService.currentUserValue.LoginId,
      browserDateTime: this.converttoSqlStringWithT(new Date())
       
    };
    if (this.TonuCancelpopup == "tonu") {
      this.closetonupopup();
      this.shipmentManagementService.Tonu(RequestObject)
        .subscribe(result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.toastrService.info("Shipment TONU applied successfully.");

            this.GetShipmentDetails(this.ShipmentDetails.id);
            return;
          }
        });
    }
    if (this.TonuCancelpopup == "cancel") {
      this.closetonupopup();
      this.shipmentManagementService.Cancel(RequestObject)
        .subscribe(result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.toastrService.info("Shipment Cancelled  successfully.");

            this.GetShipmentDetails(this.ShipmentDetails.id);
            return;
          }
        });
    }
    if (this.TonuCancelpopup == "tpcfail") {
      this.TPQFailSendtoMAS(this.ShipmentDetails.id);
      this.GetShipmentDetails(this.ShipmentDetails.id);
    }
  }

  Cancel() {
    this.TonuCancelMessage = "Do you want to Cancel this shipment?";
    this.TonuCancelpopup = "cancel";
    $("#tonuPopup").modal('show');
  }

  closetonupopup() {
    $("#tonuPopup").modal('hide');
  }

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
  onAddItemUOM(data: string) {
    this.count++;
    this.itemListUOM.push({ "id": this.count, "itemName": data });
    this.selectedItemsUOM.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

  // ShippingOrderDetails: any = {};
  // ShipmentsforEditno = 0;
  // disCarrierPickup: boolean = false;

  //GetShippingDataFromOrder(OrderId: number) {
  //  this.shipmentManagementService.GetShippingDataFromOrder(OrderId)
  //    .subscribe(data => {
  //     -- this.ShipmentDatafromOrder = data.data;
  //    });

  //}


  //displayedColumns = [
  //  'selectRow', 'route', 'OrderNum', 'FromLocation', 'ToLocation', 'ReqDeliveryDate',
  //  'MustArriveByDate', 'ActualDeliveryDate', 'TravelTime', 'PickupAppointment', 'DeliveryAppointment'];

  // for searchable dropdown
  //this.exampleData = [
  //  { id: 2, text: 'Please Select' },
  //   { id: 1, text: 'Shipment Type' }
  //];
  // this.options = { multiple: false, tags: true };

  // searchable dropdown end
  BindMaterialList(orderID, sectionID, OrderTypeId) {
 
    this.MaterialData = [];
    this.orderManagementService.GetOrderMaterialList(orderID, sectionID, OrderTypeId)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            if (sectionID == 2) {
              this.MaterialData = result.data == undefined ? result.Data : result.data;
            }
          }
        }
      );
  }

  AddMaterial(event) {
    if (this.selectedItemsB.length < 1 || this.OrderTypeId == 0) {
      this.toastrService.warning('Please select correct order data');
      return;
    }
    else {
      //this.Temp();
    }
    var dd = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId));
    this.LocationShippingMaterial(Number(dd.toLocationID), Number(this.authenticationService.currentUserValue.ClientId));

    this.verifyAllMaterialProperties(this.selectedItemsB);

    //var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;   
    //if (this.selectedItemsB.length < 1 || this.OrderTypeId == 0) {
    //  this.toastrService.warning('Please select correct order data');
    //  return;
    //}
    //else {
    //  this.Temp();
    //}
  }

  Temp() {

    var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
    // var tempID = this.ShippingOrdersDetails[this.ShippingOrdersDetails.length - 1].id;

    var tempID = 0;
    if (this.ShippingOrdersDetails.length > 1) {
      tempID = this.ShippingOrdersDetails[this.ShippingOrdersDetails.length - 1].id;
    }
    else
      tempID = this.ShippingOrdersDetails[0].id;

    //to refresh shipment receiving popup grid if we click on close btn without add btn click
    this.TempShippingOrdersDetails = [];
    this.TempShippingOrdersDetails = this.ShippingOrdersDetails.map(o => {
      return o;
    });

    //var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
    //this.LocationsforDD.find(f => f.orderid == Number(this.OrderTypeId))?.name;
    // var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
    //var getUom = this.UOMData.filter(f => f.id == this.SelectUOM);
    //var Condition1 = this.ShippingOrdersDetails.find(temp => temp.materialID == getmaterial.id)
    var ONo = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.orderNumber

    for (var i = 0; i < this.selectedItemsB.length; i++) {
      tempID = tempID + 1;
      var Condition1 = this.ShippingOrdersDetails.find(temp => temp.materialID == this.selectedItemsB[i].id && temp.orderNumber == ONo)
      if (Condition1) {
      }
      else {
        //var vv = this.CTempData;

        //for (var j = 0; j < this.MaterialChargesDetails.length; j++) {
        //var data = this.MaterialChargesDetails.find(f => f.materialID == Number(this.selectedItemsB[i].id));
        //if (data) {
        //this.selectedItemsB[i].id == this.MaterialChargesDetails[j].materialID
        this.ShippingOrdersDetails.push({
          id: tempID,
          materialID: this.selectedItemsB[i].id,
          orderQuantity: 0,
          showOnBOL: true,
          priceMethod: 'a',
          commudityName: 'a',
          orderNumber: ONo,
          materialName: this.selectedItemsB[i].name,
          toLocationId: Number(locationID),
          locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name,
          quantityDiff: 0,
          shippedQuantity: 0,
          priceMethodID: 0,
          commodityID: 0,
          uomcode: this.selectedItemsB[i].uomCode,
          propertyValue: '0',
          mCode: this.selectedItemsB[i].code,
          code: '',
          salesOrderID: Number(this.OrderTypeId),
          newMaterial: 1,
          entityCode: this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.entityCode,
          equivalentPallets: 0,
          flag: 1
        });
        //}
        //else {
        //  this.ShippingOrdersDetails.push({
        //    id: tempID,
        //    materialID: this.selectedItemsB[i].id,
        //    orderQuantity: 0,
        //    showOnBOL: this.DefaultMaterialProperty.showOnBOL,
        //    priceMethod: this.DefaultMaterialProperty.materialPriceMethod,
        //    commudityName: this.CTempData.find(f => f.id == Number(this.selectedItemsB[i].id))?.commodityName,
        //    orderNumber: ONo,
        //    materialName: this.selectedItemsB[i].name,
        //    toLocationId: Number(locationID),
        //    locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name,
        //    quantityDiff: 0,
        //    shippedQuantity: 0,
        //    priceMethodID: this.DefaultMaterialProperty.materialPriceMethodID,
        //    commodityID: this.CTempData.find(f => f.id == Number(this.selectedItemsB[i].id))?.defaultCommodityId,
        //    uomcode: this.UOMCode,
        //    propertyValue: '0',
        //    mCode: this.selectedItemsB[i].code,
        //    code: '',
        //    salesOrderID: Number(this.OrderTypeId),
        //    newMaterial: 1
        //  });

        //}
        //}
      }
    }
    this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
    this.orderManagementAdjustCharges.ShippingOrdersDetails = this.ShippingOrdersDetails;

    var RequestObject = {
      EquipmentTypeID: Number(this.ShipmentDetails.equipmentTypeID),
      ClientID: this.authenticationService.currentUserValue.ClientId,
      EntityPropertyCode: 'Number of Units in an Equipment'
    };
    this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
  }


  GetShippingOrdersDetails(ShipmentId: number) {
    //this.shipmentManagementService.GetShippingOrdersDetails(ShipmentId)
    //  .subscribe(data => {
    //    
    //    //data.data.forEach(val => this.FinalShippingOrdersDetails.push(Object.assign({}, val)));
    //    // this.FinalShippingOrdersDetails = data.data;


    //    var datas = data.data;
    //    //this.FinalShippingOrdersDetails = Object.assign({}, datas);
    //    this.FinalShippingOrdersDetails = [];
    //    datas.forEach((value, index) => {
    //      this.FinalShippingOrdersDetails.push({
    //        finalid: value.id, finalmaterialID: value.materialID,finalorderQuantity: value.orderQuantity,finalshowOnBOL: value.showOnBOL,finalpriceMethod: value.priceMethod,finalcommudityName: value.commudityName,
    //        finalorderNumber: value.orderNumber,finalmaterialName: value.materialName,finaltoLocationId: Number(value.toLocationId),finallocationName: value.locationName,finalquantityDiff: value.quantityDiff,
    //        finalshippedQuantity: value.shippedQuantity,finalpriceMethodID: value.priceMethodID,finalcommodityID: value.commodityID,finaluomcode: value.uomcode,finalpropertyValue: value.propertyValue,
    //        finalmCode: value.mCode,finalcode: value.code,finalsalesOrderID: Number(value.salesOrderID),finalnewMaterial: Number(value.newMaterial),finalentityCode: value.entityCode,finalequivalentPallets: Number(value.equivalentPallets),
    //        finalflag: value.flag,
    //      })
    //    })


    //    this.GetPalletsCalculation();

    //    this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
    //  });

    this.shipmentManagementService.GetShippingOrdersDetails(ShipmentId)
      .subscribe(data => {

        //data.data.forEach(val => this.ShippingOrdersDetails.push(Object.assign({}, val)));
        this.ShippingOrdersDetails = data.data;
        this.TempAllMaterial = [];
        // this.FinalShippingOrdersDetails = data.data;

        this.TempShippingOrdersDetails = [];
        this.TempShippingOrdersDetails = data.data;
        this.ShippingOrdersDetails.forEach(val => this.TempAllMaterial.push(Object.assign({}, val)));

        this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
        //this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);

        var datas = data.data;

        //this.FinalShippingOrdersDetails = Object.assign({}, datas);
        this.FinalShippingOrdersDetails = [];
        datas.forEach((value, index) => {
          this.FinalShippingOrdersDetails.push({
            finalid: value.id, finalmaterialID: value.materialID, finalorderQuantity: value.orderQuantity, finalshowOnBOL: value.showOnBOL, finalpriceMethod: value.priceMethod, finalcommudityName: value.commudityName,
            finalorderNumber: value.orderNumber, finalmaterialName: value.materialName, finaltoLocationId: Number(value.toLocationId), finallocationName: value.locationName,
            finalquantityDiff: (value.shippedQuantity - value.orderQuantity),
            finalshippedQuantity: value.shippedQuantity, finalpriceMethodID: value.priceMethodID, finalcommodityID: value.commodityID, finaluomcode: value.uomcode, finalpropertyValue: value.propertyValue,
            finalmCode: value.mCode, finalcode: value.code, finalsalesOrderID: Number(value.salesOrderID), finalnewMaterial: Number(value.newMaterial), finalentityCode: value.entityCode, finalequivalentPallets: Number(value.equivalentPallets),
            finalflag: value.flag,
          })
        })



        this.GetPalletsCalculation();

        this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);






        var RequestObject = {
          EquipmentTypeID: Number(this.ShipmentDetails.equipmentTypeID),
          ClientID: this.authenticationService.currentUserValue.ClientId,
          EntityPropertyCode: 'Number of Units in an Equipment'
        };
        this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
      });
  }

  AddAllMaterial() {
    this.EqualPallets = 0;
    this.TotalPallets = 0;
    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {

      if (Number(this.ShippingOrdersDetails[i].shippedQuantity) < 1 && this.ShippingOrdersDetails[i].uomcode != 'PLT' && this.ShippingOrdersDetails[i].flag != 0) {
        this.toastrService.warning('Please Enter vailid number');
        return;
      }


      if (this.ShippingOrdersDetails[i].uomcode == 'EA') {

        if (this.ShippingOrdersDetails[i].code != "F23") {
          var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));

          this.TotalPallets = this.TotalPallets + Number(cal);
          //this.EqualPallets = this.EqualPallets + Number(cal);
        }
        else {
          var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));

          // this.TotalPallets = this.TotalPallets + Number(cal1);
          this.EqualPallets = this.EqualPallets + Number(cal1 * 2);

        }


      }


    }

    if (this.EqualPallets + this.TotalPallets <= this.EqipmentPallets && this.ShipmentDetails.shipmentTypeCode != "CustomerToCustomer") {
      this.FinalMaterialList = [];


      //this.ShippingOrdersDetails.forEach(val => this.FinalMaterialList.push(Object.assign({}, val)));


      this.ShippingOrdersDetails.forEach((value, index) => {
        this.FinalMaterialList.push({
          finalid: value.id, finalmaterialID: value.materialID, finalorderQuantity: value.orderQuantity, finalshowOnBOL: value.showOnBOL, finalpriceMethod: value.priceMethod, finalcommudityName: value.commudityName,
          finalorderNumber: value.orderNumber, finalmaterialName: value.materialName, finaltoLocationId: Number(value.toLocationId), finallocationName: value.locationName,
          finalquantityDiff: (value.shippedQuantity - value.orderQuantity),
          finalshippedQuantity: value.shippedQuantity, finalpriceMethodID: value.priceMethodID, finalcommodityID: value.commodityID, finaluomcode: value.uomcode, finalpropertyValue: value.propertyValue,
          finalmCode: value.mCode, finalcode: value.code, finalsalesOrderID: Number(value.salesOrderID), finalnewMaterial: Number(value.newMaterial), finalentityCode: value.entityCode, finalequivalentPallets: Number(value.equivalentPallets),
          finalflag: value.flag,
        })
      })

      this.FinalShippingOrdersDetails = [];
      this.FinalMaterialList.forEach(val => this.FinalShippingOrdersDetails.push(Object.assign({}, val)));

      //this.FinalMaterialList = [...this.ShippingOrdersDetails];

      this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalMaterialList);

      $("#editshipment").modal('hide');

    }
    else if (this.ShipmentDetails.shipmentTypeCode == "CustomerToCustomer") {
      this.FinalMaterialList = [];


      //this.ShippingOrdersDetails.forEach(val => this.FinalMaterialList.push(Object.assign({}, val)));


      this.ShippingOrdersDetails.forEach((value, index) => {
        this.FinalMaterialList.push({
          finalid: value.id, finalmaterialID: value.materialID, finalorderQuantity: value.orderQuantity, finalshowOnBOL: value.showOnBOL, finalpriceMethod: value.priceMethod, finalcommudityName: value.commudityName,
          finalorderNumber: value.orderNumber, finalmaterialName: value.materialName, finaltoLocationId: Number(value.toLocationId), finallocationName: value.locationName,
          finalquantityDiff: (value.shippedQuantity - value.orderQuantity),
          finalshippedQuantity: value.shippedQuantity, finalpriceMethodID: value.priceMethodID, finalcommodityID: value.commodityID, finaluomcode: value.uomcode, finalpropertyValue: value.propertyValue,
          finalmCode: value.mCode, finalcode: value.code, finalsalesOrderID: Number(value.salesOrderID), finalnewMaterial: Number(value.newMaterial), finalentityCode: value.entityCode, finalequivalentPallets: Number(value.equivalentPallets),
          finalflag: value.flag,
        })
      })

      this.FinalShippingOrdersDetails = [];
      this.FinalMaterialList.forEach(val => this.FinalShippingOrdersDetails.push(Object.assign({}, val)));

      //this.FinalMaterialList = [...this.ShippingOrdersDetails];

      this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalMaterialList);

      $("#editshipment").modal('hide');

    }
    else {

      // this.FinalMaterialList = [];
      // this.FinalShippingOrdersDetails.forEach(val => this.FinalMaterialList.push(Object.assign({}, val)));
      //this.FinalMaterialList = [...this.FinalShippingOrdersDetails];
      this.toastrService.warning('Material quantity exceeds the equipment capacity.');
      return;

    }
    //Number(this.SelectEquipment), Number(event.target.value), 100, "Number of Units in an Equipment"
    //var RequestObject = {
    //  EquipmentTypeID: 4570,      
    //  ClientID: 100,
    //  EntityPropertyCode:'Number of Units in an Equipment'
    //};   
    //this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
    this.toastrService.info("Order Lineitem Modified Successfully")
  }

  GetAdjustChargesDefault(RequestObject: any) {

    this.shipmentManagementService.GetAdjustChargesDefault(RequestObject)
      .subscribe(
        result => {
          if (result.data != null) {
            this.MaterialChargesDetails = result.data.responseContractDefaultRateValue;
          }
        }
      );
  }

  GetMaterialQuantity(data: any[], RequestObject: any) {
    this.shipmentManagementService.GetMaterialQuantity(data, RequestObject)
      .subscribe(
        result => {
          this.TempData = result.data;

          //var dd = this.TempData.find(x => x.materialID == 6);
          for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
            var MaterialData = this.TempData.find(x => x.materialID == this.ShippingOrdersDetails[i].materialID);
            if (MaterialData) {
              this.ShippingOrdersDetails[i].propertyValue = MaterialData.propertyValue;
              this.ShippingOrdersDetails[i].code = MaterialData.code;
            }
          }
          this.orderManagementAdjustCharges.ShippingOrdersDetails = this.ShippingOrdersDetails;
        }
      );

  }

  //Verifymaterialproperty(OrderNo: string, ID: number, event) {

  //  this.SelectMaterialNo = Number(ID);
  //  this.SelectMaterialOrderNo = OrderNo;
  //  this.SelectMaterialQuantity = Number(event);

  //  this.SelectMaterialID = this.ShippingOrdersDetails.find(x => x.id == Number(ID) && x.orderNumber == OrderNo)?.materialID;

  //  //because now we open a new popup for set properties of materials
  //  //this.verifyMaterialProperties(Number(this.SelectMaterialID > 0 ? this.SelectMaterialID : 0));

  //  //need to open this function here from the above function for calculation
  //  this.CalculateQuantity(this.SelectMaterialOrderNo, this.SelectMaterialNo, this.SelectMaterialQuantity);

  //}



  CalculateQuantity(OrderNo: string, ID: number, event: number) {


    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].id == Number(ID) && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
        this.ShippingOrdersDetails[i].shippedQuantity = Number(event);
      }
    }

    var data = this.ShippingOrdersDetails.find(f => f.orderNumber == OrderNo && f.id == Number(ID));

    //if (this.DefaultPalletsDetails != undefined) {
    //  this.DefaulatPallet = this.DefaultPalletsDetails[0];
    //}



    //var data = this.DefaultPalletsDetails;
    var ddtt = this.ShippingOrdersDetails.find(f => f.orderNumber == OrderNo && f.flag == Number(0));


    if ((this.ShippingOrdersDetails.find(f => f.orderNumber == OrderNo && f.flag == Number(0))) == undefined && data.uomcode == 'EA' && data.code != "F23") {

      var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
      if (this.DefaultPalletsDetails != undefined) {
        this.DefaulatPallet = this.DefaultPalletsDetails[0];
        this.ShippingOrdersDetails.push({
          id: Number(this.ShippingOrdersDetails[this.ShippingOrdersDetails.length - 1].id + 1),
          materialID: this.DefaulatPallet.materialID, orderQuantity: 0, showOnBOL: true, priceMethod: 'a', commudityName: 'a', orderNumber: OrderNo, materialName: this.DefaulatPallet.name, toLocationId: Number(locationID),
          locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name, quantityDiff: 0, shippedQuantity: 0, priceMethodID: 0, commodityID: 0, uomcode: 'PLT', propertyValue: '0', mCode: this.DefaulatPallet.code,
          code: '', salesOrderID: Number(this.OrderTypeId), newMaterial: 1, entityCode: this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.entityCode, equivalentPallets: 0, flag: this.DefaulatPallet.flag,
        });
        this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
      }
    }


    this.TotalPallets = 0;
    this.EqualPallets = 0;

    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].uomcode == 'EA' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

        if (this.ShippingOrdersDetails[i].code != "F23") {
          var vvv = Number(this.ShippingOrdersDetails[i].propertyValue);

          var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.ShippingOrdersDetails[i].equivalentPallets = Number(cal);
          this.TotalPallets = this.TotalPallets + Number(cal);
          //this.EqualPallets = this.EqipmentPallets + Number(cal);
        }
        else {
          var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.ShippingOrdersDetails[i].equivalentPallets = Number(cal1 * 2);
          // this.TotalPallets = this.TotalPallets + Number(cal1);
          this.EqualPallets = this.EqualPallets + Number(cal1 * 2);
          this.ValidateNPMIMaterial(OrderNo, ID);
        }
      }
    }
    if (data.uomcode == 'EA') {
      this.Pallets = 0;
      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].flag != 0 && this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

          this.Pallets = this.Pallets + Number(this.ShippingOrdersDetails[i].shippedQuantity);
        }
      }

      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].flag == 0 && this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
          this.ShippingOrdersDetails[i].shippedQuantity = (Number((this.TotalPallets + this.EqualPallets) - this.Pallets) > 0 ? Number(this.TotalPallets - this.Pallets) : 0);
          this.ShippingOrdersDetails[i].shippedQuantity = (Number(this.ShippingOrdersDetails[i].shippedQuantity) > 0 ? Number(this.ShippingOrdersDetails[i].shippedQuantity) : 0);
        }
      }
      this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);


    }

    this.Pallets = 0;
    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].flag != 0 && Number(this.ShippingOrdersDetails[i].id) != Number(ID) && this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

        this.Pallets = this.Pallets + Number(this.ShippingOrdersDetails[i].shippedQuantity);
      }
    }

    // var data = this.ShippingOrdersDetails.find(f => f.salesOrderID == Number(this.OrderTypeId) && f.id == Number(ID));
    if (data.flag != 0 && data.uomcode == 'PLT') {

      //data.mcode != 'WW-PALLET'
      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].flag == 0 && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
          if (Number((this.TotalPallets) - this.Pallets) >= Number(data.shippedQuantity)) {
            this.ShippingOrdersDetails[i].shippedQuantity = Number(this.TotalPallets - this.Pallets) - Number(data.shippedQuantity);
            this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);

          }
          else {
            this.CalculateQuantity(data.orderNumber, data.id, 0)

            this.toastrService.warning("Pallets quantity should be less or equal to the default pallet quantity.");
          }
        }
      }
    }


  }


  //TranCommentChange(orderid) {

  //}

  selectUOM(event) {
    if (event.id != 0) {
      this.UOMID = Number(event.id);
      this.UOMCode = this.UOMData.find(f => f.id == Number(event.id))?.code;
    }
    else {
      this.UOMID = 0;
    }
  }

  DeleteMaterial(OrderNo: string, ID: number) {

    this.TotalPallets = 0;
    this.EqualPallets = 0;
    var data = this.ShippingOrdersDetails.find(f => f.id == Number(ID) && f.orderNumber == OrderNo);

    this.TempDeleteMaterial.push({
      "materialID": data.materialID,
      "orderNumber": data.orderNumber,
      "salesOrderID": Number(data.salesOrderID),
      "entityCode": data.entityCode

    });

    if (data.uomcode == 'EA') {
      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].uomcode == 'EA' && this.ShippingOrdersDetails[i].orderNumber == OrderNo && this.ShippingOrdersDetails[i].id == ID) {

          if (this.ShippingOrdersDetails[i].code != "F23") {

            var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
            this.TempPallets = Number(cal);
            //this.EqualPallets = this.EqualPallets - Number(cal);
            this.ShippingOrdersDetails.splice(i, 1);

          }
          else {
            var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
            //this.TempPallets = Number(cal1);
            this.EqualPallets = this.EqualPallets - Number(cal1 * 2);
            this.ShippingOrdersDetails.splice(i, 1);
            this.ValidateNPMIMaterial(OrderNo, ID);
          }
        }
        this.ValidateNPMIMaterial(OrderNo, ID);
      }

      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {

        if (this.ShippingOrdersDetails[i].flag == 0 && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

          this.ShippingOrdersDetails[i].shippedQuantity = (Number(this.ShippingOrdersDetails[i].shippedQuantity) - Number(this.TempPallets) > 0 ? Number(this.ShippingOrdersDetails[i].shippedQuantity) - Number(this.TempPallets) : 0);

        }
      }
      this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);


    }

    if (data.uomcode == 'PLT' && data.flag != 0) {

      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].flag != 0 && this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo && this.ShippingOrdersDetails[i].id == ID) {
          this.ShippingOrdersDetails.splice(i, 1);
          this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
        }
        if (this.ShippingOrdersDetails[i].flag == 0 && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
          this.ShippingOrdersDetails[i].shippedQuantity = (Number(this.ShippingOrdersDetails[i].shippedQuantity) + Number(data.shippedQuantity)) ? (Number(this.ShippingOrdersDetails[i].shippedQuantity) + Number(data.shippedQuantity)) : 0;
          this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
        }
      }



    }

    if (data.uomcode == 'BAG') {
      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].uomcode == 'BAG' && this.ShippingOrdersDetails[i].orderNumber == OrderNo && this.ShippingOrdersDetails[i].id == ID) {
          this.ShippingOrdersDetails.splice(i, 1);
        }
      }
      this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);


    }

  }

  GetMaterialCommodity(data: any[], RequestObject: any) {
    this.shipmentManagementService.GetMaterialCommodity(data, RequestObject)
      .subscribe(
        result => {
          this.CTempData = result.data;

        }
      );
  }

  GetDefaultMaterialProperty(RequestObject: any) {
    this.shipmentManagementService.GetDefaultMaterialProperty(RequestObject)
      .subscribe(
        result => {
          this.DefaultMaterialProperty = result.data;

        }
      );
  }

  ReSendShipmentForMAS() {
    this.shipmentManagementService.ReSendShipmentToMAS(this.ShipmentDetails.id)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.toastrService.success("Shipment details have been resent to MAS successfully.");
          this.GetShipmentDetails(this.ShipmentDetails.id);
        }
        else {
          this.toastrService.error("An Error occurred. Please contact Tech Support.");
        }
      });
  }

  ApproveandSendShipmentForMAS(isShip: boolean) {
    // if (isShip) {

    if (this.SelectedShipmentsforEdit == undefined) {
      this.toastrService.error("Please select at least one shipment.");
      return false;
    }
    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
      if (!(this.CarrierStopDeliverycidt != undefined && this.CarrierStopDeliverycidt != null)) {
        this.toastrService.error("Please select Carrier-In datetime for delivery.");
        return false;
      }
    }
    else {
      if (!(this.CarrierPickupcodt != undefined && this.CarrierPickupcodt != null)) {
        this.toastrService.error("Please select Carrier-out datetime for pickup.");
        return false;
      }
    }
    if (this.ShipmentDetails.compliedWithShippingInstructions == false) {
      if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections" ||
        this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer") {
        this.toastrService.error("To Receive checkbox is not checked.");
        return false;
      }
      else {
        this.toastrService.error("To Ship checkbox is not checked.");
        return false;
      }
    }
    if (this.ShipmentDetails.tenderStatusName.toLowerCase() != "tender accept") {
      this.toastrService.error('Shipment must be "Tender Accepted" before it can be received or shipped.');
      return false;
    }
    //}
    //else if (!isShip) {
    //  if (this.SelectedShipmentsforEdit == undefined) {
    //    this.toastrService.error("Please select at least one shipment");
    //    return false;
    //  }
    //  this.CheckCarrierOuttimePopulated();
    //  if (!this.CarrierOuttimePopulated) {
    //    this.toastrService.error("Please select Carrier Out date carrier pickup");
    //    return false;
    //  }

    //  if (this.ShipmentDetails.compliedWithShippingInstructions == false) {
    //    this.toastrService.error('Please check "Complied with Shipping Instructions"');
    //    return false;
    //  }
    //  //if (this.ApChargeNewShipmentStatus == "underreview") {
    //  //  this.ShippingSaveDetails.shipmentStatusCode = "underreview";
    //  //  this.ApChargeNewShipmentStatus = "";
    //  //}
    //  //if (this.ApChargeNewShipmentStatus != "underreview") {
    //  //  this.ShippingSaveDetails.shipmentStatusCode = "Shipped and AP Charges Sent To MAS "
    //  //  this.ApChargeNewShipmentStatus = "";
    //  //}

    //}
    var selectedShipemnetID = this.SelectedShipmentsforEdit.id;
    this.shipmentManagementService.ApproveandSendShipmentForMAS(Number(selectedShipemnetID), this.CarrierPickupcidt,
      this.CarrierPickupcodt, this.CarrierPickupLocationID).subscribe(data => {
        if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
          this.toastrService.success("Shipment details have been sent to MAS successfully.");
          this.GetShipmentDetails(this.ShipmentDetails.id);
        }
        else { this.toastrService.error("An Error occurred. Please contact Tech Support."); }
      });
  }

  OrderLocationChange(item, type) {
    const sl = this.LocationsforDD.filter(x => x.id == item.fromLocationID)
    if (this.FromlocationforCarrierDD.indexOf(sl[0].fromLocationId) == -1) {
      this.FromlocationforCarrierDD.push({ fromLocationID: sl[0].id, fromLocationName: sl[0].name });
    }
  }

  CompileCheckOK() {
    this.compilecheckclose.nativeElement.click();
  }
  CompileCheckCancel() {
    this.ShipmentDetails.compliedWithShippingInstructions = false;
    this.toReceive = false;
    this.ApprovedDate = '';
    this.ApprovedBy = '';

    this.compilecheckclose.nativeElement.click();
    this.EnableDisableShipReceiveButtons();
  }

  SaveShipmentOrders() {
    if (this.ShippingOrders = !undefined) {
      var Appointments: any = [];
      var Locations: any = [];
      this.ShippingOrders.forEach(order => {
        let appointment: any = {};
        let location: any = [];
        appointment.orderid = order.orderid;
        appointment.pickupappointment = order.pickupappointment;
        appointment.deliveryappointment = order.deliveryappointment;
        Appointments.push(appointment);
        location.orderid = order.orderid;
        location.fromLocationID = order.fromLocationID;
        location.toLocationID = order.toLocationID;
        Locations.push(location);

      });
      let ShipmentOrdersSave: any = {};
      ShipmentOrdersSave.ShipmentID = this.SelectedShipmentsforEdit.id,
        ShipmentOrdersSave.Updateby = this.authenticationService.currentUserValue.LoginId
      ShipmentOrdersSave.OrderAppointments = Appointments;
      ShipmentOrdersSave.OrderLocations = Locations;
      this.shipmentManagementService.SaveShipmentOrders(ShipmentOrdersSave)
        .subscribe(result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.toastrService.info("Shipment updated successfully.");
          }
        });
    }

  }

  AppointmentClick(event) {
    event.target.blur();
  }

  selectedOrder(event) {

    if (event.target.value != undefined) {
      var dd = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId));
      this.TempOrderData = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId));
      this.BindMaterialList(Number(dd.orderid), 2, Number(dd.orderTypeID));
      var tt = this.MaterialData;


    }
    else {
      this.MaterialData = [];
    }

  }

  GetPalletsCalculation() {
    var ShipmentTypeCode = this.ShipmentDetails.shipmentTypeCode;
    var ClientID = this.authenticationService.currentUserValue.ClientId;
    var SalesOrderID = this.FinalShippingOrdersDetails[0].finalsalesOrderID;
    this.shipmentManagementService.GetPalletsCalculation(ClientID, SalesOrderID, ShipmentTypeCode)
      .subscribe(res => {
        if (res.message == "Success") {
          this.PalletsCalculation = res.data;
        }
      });
  }

  GetLocationDetails(LocationId: number) {

    this.shipmentManagementService.getLocationDetails(LocationId)
      .subscribe(res => {
        if (res.message == "Success") {
          this.Locationdetails = res.data;
        }
      });
  }
  openLoadSheet() {

    const documentDefinition = this.getrecord();
    pdfMake.createPdf(documentDefinition).open();
  }
  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE128" });
    return canvas.toDataURL("image/png");
  }
  getrecord() {
    return {

      content: [
        {
          text: 'Trailer Inspection and Records',
          bold: true,
          fontSize: 17,
          alignment: 'center'
        },
        {
          text: 'Shipping Report',
          bold: true,
          fontSize: 17,
          alignment: 'center',
          margin: [2, 0, 0, 0]
        },
        {
          text: 'BOL#',
          bold: true,
          fontSize: 11,
          alignment: 'center',
          absolutePosition: { x: 205, y: 70 }

        },
        {
          image: this.textToBase64Barcode(this.SelectedShipmentsforEdit.shipmentNumber + '.' + this.ShipmentDetails.shipmentVersion),
          width: 140,
          hieight: 50,
          alignment: 'right',
          absolutePosition: { x: 50, y: 30 }
        },
        {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABQCAYAAABRX4iyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUUwRjk1N0IwMjUyMTFFQjgwOUU4REMwQjQ2QjAwODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUUwRjk1N0MwMjUyMTFFQjgwOUU4REMwQjQ2QjAwODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RTBGOTU3OTAyNTIxMUVCODA5RThEQzBCNDZCMDA4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RTBGOTU3QTAyNTIxMUVCODA5RThEQzBCNDZCMDA4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi0hj44AABiLSURBVHja7FwJdBzVlX2/tq5e1C21dkuWbMmW5RWvGOxgFoOBAAkQSEIyZJkhK0lOgMlkWCZhCUwSziRnhoEJBHImc4YECAYyAzYhEIz3Fbzi3drXXtVL7b/+vF8tS7KRWYJtzBzVOW23qqur/r913333/fq/CWMMxrb3twljEIyBNQbWGFhjYI2BNQbWGARjYI2B9VFv0oc9Ad19k896bdMjtC95DVGVk9o4Qkh7wI594b8vWP721gnL/hTJ6wve7XisRZgoig8qivLT2yedgWAZT/xxBoQDf0sCPgD35JZOWIqVgKnfLTD6WSJCHNEoAfIu4PLvuO4t1LYeBFDoGReGJBr2gyiedKBGXEGmiBKWsM67ATXMLpalLpXOyDDEzlB+PweBzxAi3Ir/9+JL/WuimpMVkb8Nwbm40HvKaGAcyBL8UmRkBRDBOZZNJIsALaZAfzS4y8X4hTMUrGNaruPrP4FxAEdvMCMCBPU+hMWE4U4hK4kEur8C33lkvwz77IHFRFWc3vocHBo3ezuAvF2AdzKYEprAkP0RAQKncpNOflizCmxzD4wy9MNEGYKZXuguWwDx4ipQnIKsUEEEv5mDht7XwfBFwSVC4Oh3TKWYzd3zr3Cg6lLYWbMYgqY1klUcKKSSGz3VQJ0KsIaZMgoDfJluODJ1KTx6yTOg6TL4Bg+hYuHo69ffBefsfRhMX8mIjIj4u6haVhpc/pa4x2sUnA6gToXP4lQZlVU85KRcFnrGnQUDZTKUpzQIGYb3Ks7pEDBcWP6Jn0BH1SLw6/1DX1PsNNnZ+DfwVuMVEDDpKJHvAdX3sfBZx93mKP7zKo+ed3QK2UH9vtVOyP8z1YBpLiFckIs8h4BAKrZFLKauspTIg3jsEH2Io9tbJn0JbAm+TXTrCgSdjQJYOQN25oPFHCojP4XBSFCQVEtHO05BTUpXztyzfvLNEIzDfzCRLRnZP1bIqz5CnQcRkBGxJtCAkwaM1AvxmE/Cew+Dq6cKtw8NlhBSulzDRjFx4V1TNpd+hx2m7YirD+pAIkOydpQVlCIBXY8qbKTTzDgMkjZIisnAPYFCike9ikLy+CXrjATL31h+2Dgcu47mrKUIgOz5nNHtuChGoltFVcADmCG6BWkWiLAGO7rRplAaLoK1gQDhoIpHv2bZrnRebRlUVsDjyYiyXR7l1GLBnEEHXkVIOK/hH+wM1SyPCssJEZcPvh9V3An61hIEQpRkkdlkZP33qAjCkwgWKFXIjhKUMdsZAssASZpp7oOmyMKX1oP0UnCUFmChhbWQBxbAAJ6Inpo4FE6CqB//5riPkT3UAtEagNWlV0Aaw09i9lAtR5kbwBcMlEpQ++ZmKDrwBlihsqGTCWoRg5X3eyUBxhe6XgDtuFd+kFnD4vcxHKLhbl1ybVCzHbBuzl3whxnfA8FyMWyckZIkZhUZZre/Ade9cD3IqRg4anj4cyUEdrYPfE9/DXgI2qcOi48SLAw5LGl82XZYteB+eOa8+yBi8bGAglYdM3KhEFiy8yEIaO1gBCtR5UeUf4IAZiAKZasfh1lPftkjzkcFmHCqGCVwRuU6YO2cO+H5c++AsMa4l8LPRmkEIpBX0aLJCmobPT4xeMCYFfVQufG/YNrT3/CU8aMA7JSAJaJGqcioNXPvg2fO/wkUoaDI1AH2YUYD8Abo5ROges1jMPPJr3wkgAknl1Eo5hhCag6BmvcjWL74LmQUFBh1kjKJXl4HlRt+C9Of/vppB0w4mRolDQK14aw74Q/n3YN1nzsYeiexO0QEvQIZtvbXMOOpm7xi9HQBdlJqQ88euBb4UKNWz78bnlv0YyjyGEVPLlAjvIFeVo8h+QSeX4SDn3v0tAAmnAxGqU7OswcbZ/09PLf4xx6jfCcQ85MGGN4ErZIz7DGY/ux3PDPCaxxyCqdQfXiwzHaw0VS+Mf8e+P0FD0JQP1WMglErA728HspffxhmP32Tp2H9URVSQfXMDMPtZV+FdU03QEvJVMx63B7YpweoQVvBma1V1EHDuifgs3IA9lQsgWACg7L5hjMPrN803AtBbHPIYl4mPG1AjcRMEEErnwjzNj4B8+hD4I1ofPoMBKvUskdYh4+oDhnUqXyoYmhX8ONWG/5/28bAGgPrDAXLddgYWO93q5isYI0rFh7g/9U1JYBqZzjyH+Fo1WkA65UHfwFlEwQQlb/6VEzFhLq++dugheqwvjSHq+YPnhAhWCJBsFQ+M8H6nx/fBise+CWUTRRBlCRk2Afupy5hNdxZOhdMJXR04M/+oECFwiIEQyL8elUafvZi4swtpF+671ZwKYOrfnwrxFskoA59r2Aiw+HG7sUwvNFvpZcJrj0V+/1b7H39sce+m2gyCEUkaB+g8NjqNNz/etrb/cMzFSy+rXzgNq9W+/S9t0DskAuOzU70GJGPKwdH/FWPzKjnsxgIg1LcMZ8d+9jQ/26MClb4YP3bObjiN72Q1t1Tqlkn9fH9yvtvBX9Ygev/4WZIovRkY4wPcB7DDQTQ1VPubtuktYIoDI+6YIZgYAuMerNieA0DJB8HUhTZCJIfhjIIIiQIBFQZT1qlwMZtWbjwVz1g0Y/B4/vjt+d++B1o3bIBlv3gTmg+eyr096IwiscGlSCRL8uOfKNLaJTPhSQi5IkSID533NtyuP8mUcFmiTrARTfr9vYtz7rJfUBkv4cpB1gNCNAVs+HnK3vh8XXp0wLUKQGLb28++yQcXrcabn1tHdRNHQ+xHigwbEitSL8oiv/iurTwpJ6DKfmIzEpiQkB7QuBPTX0GwPzLwT7YCdC/AxiyK6jiSYoleGRFHP7plSQkdQqncyNj6w3Hyp0xsMbAGgNrDKwxsMYg+AA+y3rpjsLkC1/wCyDK5/BhEjd2AMzDax7Hz3ceY78dC6S6eSBNWOi9P9aEED9Riv4JLC3kGW1zAJx9f36ZaqkV/JxS3QIQx80qfM8X/CwR5U947wUB3P79ttW+9WfozfuB2iA3LAKxfHJhYYEgR4hadCcYWdVri54Ec8+K9UJ0wlPShLMbiBL6PtjGKKUQejDHbGNmbjUMdG5xYofAzsRAaVwMcv3Z6O0UALUI/Z+0hJnZL7F8/FzIJ2qYwxczCDEiqTuxbRtYuv2F/gPbDo2/vxUkN9V29PxXQab788TKQzyVgkO9+hoEYOfIBjiWBfVBDRrG5bH2O25CMhFn0v4Dt7PYwcKCI2pBd39ibs5yVzDqQFUoAWWBViyyvVGFy1mm5ytgZr2xMFPLQE88c8Bh8ChDAMdVGxDBzrp8gqlrXUlbN/yAxY/gsQRMPQ+7WhMlFU74qYbi1jonl/wuy/Z5bveYWhQJwCQVCJ/rxdxncc938fPeoUMEQcLq/+e0Z9f3WNcOEbQYEA90xkuMCJX8k/C715qGfo9m0svwgzUSMqFgq11bY5leYFYONNyVNcE+ZhY1N69EgZLKcXiM7k3kP6aGYdYylmwDNtDlTTniLcfmTjUdGIdlXbdtIbhmHtnC6z5HY1msg4xMYXoSI9h24YvMYb9Gjru8PvRYxa9h6zey/gPAcv0IlgAGknHAAC1i2UAszUFGAALvtYFXj7zy4YCIxJuCyVdr8FLpOte2qg0HLsWz5yWOqmPd57ZtuoV2bAHOzJxNsM+FEj4gOVDkM8FnpiE+QAMtKVo5xSt3vNtBCvUIL+LwxWdWC+TYycdeXYY7FUUdnF08sjoWCLO1i5iZKZyDA4AfhxSIpg16HobX0+lUAsqrxnkd9pZKDF6LH8sf8wUV9xzTYbN5tTRiNG+qm4udXzgvVmYC8abBC4NAeA3kYOB5HERqX8zOdQzQTh92YVxEaqwvliRVwvM4OjgOWxzX2I2lhv2rILVnOcnWW9yOrcAwQlpSANt7zE2aRZdLIjECstBcHRavnBiV6ijeSJd5808+uMAz1x0B39CykzpmDMwbYungXhVRkAW4SID3noMQkImMQFzvskFqEL4sz72GZXtUrmPvtdLLxmbF8/T1lEandmdoc2vSXpTW6e6joz38RhsOu9o0kbF64mrUZR9B9nJG7eqzXunNWOdR130Qr/9QVjNv7snYs/f127fjuSybMvUDFdIUQ6O8qgb8RUUYHfTYESdgZ4OeCvNOZSzeW0bDPkFSECwE7PwBh/mxBtUZY+8YySODyPJj8Y5em7HgXj56ir2TmZX9PMvFCld4H230ywKpDPFwcqExqmypDKt3gyg8yxMJZ6PtkvGmzjWmrxH09NG2Q2UQXq6tqLSb55wLpm1D+5EjkIp1pahj/jRjs626w1IfCCwu0sS1PS1wvKnawwNUKOaXg5ZCOXKhPeV2RFSypdgvfYahWCFjGnOW2Gyaxlv57ABEouVQGG0oAGAODq/4EKygQpqyGrkIefASnvcT2Knpjp4FPu3bV4jCd28jHzjFc89qrIYpE2u5fh10tRTewR6ZK6jDSNAxNWBaivCs5w0eKgTm1RXdGJgw63/FkvJD/CK11dUopwmIdRyCt/bsf5UODpW/rzB08c4ogSKovw5veqQWvPR6NAQJCYCVX8wzm4Gd6ss5uwVJfgKtQeFuK4RL0jKe2Vx3JLMKWpnW3UzacHfxhiMzQBbhcx4otnEDy3QLiZwNSc1dLwjvTzGoZYBYUgdi9XSAknqV+IpEL39hmGo25CgmJ2KkjpDBcBf4uiFFnkP1zFZbzzznOM7XLIdOEyQJqirLYeHkCqgvFt8fWFyjiCjB2bc9BeULrgaYfKn3UILxSSD4Gb6m451q4tkrb/Es6m5SVXUjkZQBjzFIRWTFBRxVHobHhxNSHPImW85X7kjYmqhfXKYqwgxmZC5BWwBdGdqH/u95yV80+N0TB6RLHbcUpWL8zMXgRicDCVd/ChxD4AsWDKRZzmItqYEcWLnka9Sxh5beMcyGbuxgxG3dcA3t2PqYm2jZxsz8y5SypSVBBRbWqYNgvccDP2rkoOac6yDavKjwhappoJz9ZSDINjR0/HIXevGPOoYMwZh3N2H4pTBD7earUmU+BCwJ5+KBFelEP4xcqORl8IJ4voHM2c33hYNqpeAYD7Nka10mp0HWglWlJZG9rqjCiRY58b0S6kJTVTg8//zLmv2R0pnYq7tZuus2lu33LtSbpZDS3T+19aUgmUisS+TM32dQ2zhcXnZFX8eMNLBkC7jd21XaveNSlut91XGs243BB8kSIg8gB0/AKgpSIAwNV37v2Bpp/AIQenaD2/UWZ9glDMHi0pPIO3FJ8W1RI5XYr8wqtAaLOf9RFyLJPCyi1Hn+HcwgRErlzX5aTP6IoXuWd93YgSUus6E/T0G36DPB4nLLRU82bPkwpLlnG3GjMeVDRTB4Acm077XRYDItCZBsBYEakNAY7OzIHDE0+ruGi2+AUFON27fud19vbe9ikVDgC1UlQQj50MIMiqIXASgrYGuol+yBZN7dWATwugB153g+ZLTNQVbVLv4cFNVMOa6iFEFa+HdASuqrMQTngZ1HsBhUh6U9F1+yzClbcE2E1Z27CwJRTyy4hcAQu5gogYLRHMkuDGe7qFYSK5ufwVB2PADQGNuY4rvTZqJ4yuJXhWCpOvzAwgVZDULJ/Gu9oeZhwFDC0Y+xzm0ALWtQPHdjtZOH1ngeXn+7L8aik2+46PuPJC+89XGIXHkPTPzh6lzNp+/6Yrxk9rJV+2K/XbWnp2N3jw4J3QXurTzf6SV2lBbL/YZ3Q+wpV4HML3DcHee1lS9SDhM/efMJBqTRddfOXeTsXVHCMP55uDWOKztH9Nntdv9BrrQCX5DJJ7fJXLeYcUHpVXcrJChZsOHRIcB4mI+/5lt+dclnNumPXr4dRX2+gBqZzulAiye8ct7tyzNk7S8U1rPHCxnH0KB6zrVk/PUPgL0ez9O9aygU0Suh48558wEMdKloQpNO+YxVs775rTumL71hPyaeoYeVcnE1TLr2Dmi4+h//3L75xT+nulsCe198eG5nouczM8aXfLO6SFCJUCih0Cw3eWCZpdNAm/hJKDn0AowsYHiKLZu5FELVkzkteSIoQtdcPGg3eNvytGfHNeCFB388hYeYWR9tXe876sAL9oB4dsMvkSZBUWey6ZdvY7teQAd5uHAMAqP4g7Xgj+4Xm5a+4Wx4bD4FP3TGs1B35Y0rZUkMOpHxVSMVSpAVvgI2IkTrq7l55dfRdQO61ebN5dffdRehjiSIglorKj21Mxd1SJLMU3Nz4ZmlS7AkqybF44/wnIvttiec86lsPSbLqnlXrD301J1rA8lVB4kYeRgGF2Sh4fUWuEt6bsCXLplnBpTXQWYdQ/wSRdGK8F8BMXPAfCFurCVMNk34pkrgz2OoSVBAL+S1pGcB8mhn8tqIzORCyC9DcTjEQxCCPlHKHVh/gzTpogOK6Pcd/ckBgVsMJTAdb5TgTLs2tW/Vc9lkwpJTUn3XeXMufQuPqkMg68iQg+eOiUTwzSQhEK09+tiI+ys1XKpVz1662bUsGgwoNfjJNNu2p1mWxW+wgcyKiRib9pqH/o2EKvYKi7/970wJaNSmOWqb3XJJTcadgcks498JiSPA0u2e5ciZzMvsUndn5+x0KrWzZnBlJY+OiMJg7lkzGiqampqdzb8BVj0LjOIpQcPQq+18epImRVI+rbeuInGkis8jzZoW7NCr27SGZc8app5F76JVVte6FVbbnKK257+IVh5ULNjibdsu03p6V1WJocoQFFal8rIykUiqTmdvNXNLteBXl9/jcxyhwqGZ3oxdHt9/pL062ZcIksLyVlEUIJPJCnvb+5OlnYc7w2S4brUtq6y9peUqR8/lfKrPDAaDMlobGb1TgFJXMB2UBT2br0/3GvK+ldc7ffsa9WnXPZ4NTtieyLuxts4u8GtatVw17TY7doBbBczwDLMo9UZfpD1v752Xz+cCTZJQXMRrXDyAM0IMiA9RzHgeekdWgyIoqDsWxDrbtI2VX717asSsr9bjgoMCm0W3lwpN3mzWLvmLlo47uXy+u33A1zk5EhrXGPrL5Zi5oorsAzl5cMKWNSsnLZQMJczHsTzpE8je/QdEJxvh6xKZz+9v96uqgVtlPpebNqBZ/rPIfnExmkS7wHiIJxKhTa+82tRo7Cq7DP+mHlgCDGQywoFtbxYT14riDeuMRqNvh8NhwHqwHM8XzmuG6lpabYVFfT70hbRl1Vx/bP8jcklDJ/ONb4sQyalRtWbn0K5KkusH0yVwMG7RjO4+5oG1detWK6cbTQubjYqJGC+uUJizwdIdAOm2Id0ng4MgXX1AN7dtMeYu8E+RaB5QASBLJXizI787GX85KjI74lA6IafpuQ16rq/5rEDLFL8edRwCpZIebNu8YkJtQxFMQrYxBzzxbzl8ON/eYqcF1+J6lykpKT4oy0o3Mn5KIqvVqOX5+vPHi95gBWoYpPoT9qa+TWV2eKDpikbRi0S+XxvI5Xbt2r1XERm6ciUW6utrr62pySNzj7S1t0cz2Xw0ILnShXWdzJsLhjEmZDpAyfXW1spyrTd6wYeSqAW6zeBQ3IS/dPruWRWv2vI1Dtbeffs2pQYyEwfChtobzHLKeSXAaE6Z7+3PIa3ju8RoXJhyJBkHC7WpNc3yO9uTG3TR6cWKha/AF0xTD/ektMD6omx3yXhrXtoogK0m9syJiWHaF81iqYNGVqNCX3fbvkOWs0kGB8XR1X2K0oeM6EqmUonOvlT9pAZ9QTqYgt6BQtXQF09k32zZsaeiNj9roDgN/UP7U+be7n1rairKJFX1oVzZjiRJbNUba7Suri4pl8uFDV0PDlTnn7+kzvFPKRMnlwUE9IEWSAgSZzoHKYn2YVcfzb3Yojy0LR38Z60wYAlkyrSZcjqdLh2v6ovwijU2L2W8x9TcwJDjx2oZYpOmgnSoXHUXoLuW+DGOy/rijn9laXlVPhj08ylHJJvLKal0prhEMqZGZHuqaWNKJYgtEZMIKKZX71p4h109pouv+EvHdVRXVnglEXYQNc7Hevv6hP54IhQh+Vklsj1H479zxFwzZwlvJ1nozTKfPa1MMRfqtleJWAM6PdRnSK9dcP4S1tjYCKXRUkDAYf3GDWAapoD9LMrltdKsbot+0Q03RNzpc6rIzMqgMEMRIcTpkTVZ/Egadm+PCavTjm+bX5EGZEmgnW1HQEKk7Ww227c1Zj83/LNO7ARTo44ODjnCPpdtGXEAI4IhyL6Ai3cUbPRduq47hp7XDupmD3Pc1wo/BTZYW3hDFWy41GMGKROTgGCxoToIX6ZluflcNtObN9biXVo7mAoZV1bVT0nLAGw5aDuD7WDe70aBmyOdKNRTmqYMnUrwLue6mq4PWKaZEV1b1GxX2JFj23d0sON/C4b/JICL1kPwKQ64YtAFSRmb6zD2KGwMrDGwPnbb/wkwAKpuZ5VlVaQRAAAAAElFTkSuQmCC',
          fit: [50, 60],
          absolutePosition: { x: 30, y: 40 }
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 2 }],
          margin: [0, 10, 0, 0]

        },
        {
          columns: [
            [{
              text: 'Shipped Date : ' + this.DateFormat(this.ShipmentDetails.shipDate),
              margin: [0, 5, 10, 10],
              fontSize: 10,
            },
            {
              text: 'Delivery Date : ' + this.DateFormat(this.ShippingOrders[0].reqDeliveryDate),
              fontSize: 10,
              absolutePosition: { x: 220, y: 110 }
            },
            {
              text: 'Customer: ' + this.Locationdetails[0].name,
              margin: [0, 0, 10, 10],
              fontSize: 10,
            },
            {
              text: 'Address:	' + this.Locationdetails[0].name,
              margin: [0, 0, 10, 5],
              fontSize: 10,
            },
            {
              text: 'City/State/Zip:	' + this.Locationdetails[0].cityName + ',' + this.Locationdetails[0].stateName + ',' + this.Locationdetails[0].zipCode,
              margin: [0, 0, 0, 10],
              fontSize: 10,
            },
            {
              text: 'Carrier:	' + this.ShipmentDetails.carrierName,
              margin: [0, 0, 10, 10],
              fontSize: 10,
            },
            {
              text: 'Stop:	' + this.SODTimings[0].sequenceNo,
              margin: [0, 0, 10, 5],
              fontSize: 10,
            },
            ]

          ],
          margin: [0, 10, 5, 5],
        },
        {
          table: {
            headerRows: 1,
            body: [
              [{ text: 'Office Use - Fill out as needed', alignment: 'center', colSpan: 3, fontSize: 10 }, '', ''],
              [{ text: 'Time IN', fontSize: 10 }, {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 19,
                    lineWidth: 0.5,
                    lineColor: 'black',
                  }], colSpan: 2
              }, ''],
              [{ text: 'Time OUT', fontSize: 10 }, {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 19,
                    lineWidth: 0.5,
                    lineColor: 'black',
                  }], colSpan: 2
              }, ''],
              [{ text: 'Appt. Time', fontSize: 10 }, {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 60,
                    h: 19,
                    lineWidth: 0.5,
                    lineColor: 'black',
                  }]
              }, { text: 'AM/PM', fontSize: 10 }],
              [{ text: 'Driver Phone #', fontSize: 10 }, {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 19,
                    lineWidth: 0.5,
                    lineColor: 'black',
                  }], colSpan: 2
              }, ''],
            ]
          },
          layout: 'noBorders',
          absolutePosition: { x: 375, y: 105 }

        },
        this.getMaterialObject(this.PalletsCalculation),
        {
          margin: [0, 10, 10, 10],
          columns: [
            [{
              columns: [
                {
                  text: 'Order Comments:	',
                  fontSize: 9,
                  bold: true,
                  width: 90,
                  margin: [0, 10, 0, 10],
                },
                {
                  text: this.ShippingOrders[0].orderComment == null ? '' : this.ShippingOrders[0].orderComment,
                  fontSize: 9,
                  bold: false,
                  margin: [0, 10, 0, 10],

                }
              ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, margin: [0, 0, 0, 2] }] },
            {
              columns: [
                {
                  text: 'Loading Comment:	',
                  fontSize: 9,
                  bold: true,
                  width: 100,
                  margin: [0, 10, 0, 10],
                },
                {
                  text: this.ShippingOrders[0].loadingComment == null ? '' : this.ShippingOrders[0].loadingComment,
                  fontSize: 9,
                  bold: false,
                  margin: [0, 10, 0, 10],
                }
              ]

            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, margin: [0, 0, 0, 2] }] },
            {
              columns: [
                {
                  text: 'Transportation Comment:	',
                  fontSize: 9,
                  bold: true,
                  width: 100,
                  margin: [0, 10, 0, 10],
                },
                {
                  text: this.ShippingOrders[0].transportationComment == null ? '' : this.ShippingOrders[0].transportationComment,
                  fontSize: 9,
                  bold: false,
                  margin: [0, 10, 0, 10],
                }
              ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, margin: [0, 0, 0, 2] }] },
            {
              text: 'Safety Inspection - (Please review and Initial)',
              decoration: 'underline',
              decorationStyle: 'solid',
              fontSize: 10,
              bold: true,
              margin: [0, 3, 0, 10],
            },
            {
              columns: [
                {
                  text: 'This trailer has been inspected for safety by the following guildelines: CORP WI SFTY 533',
                  fontSize: 9,
                  width: 400
                },
                {
                  canvas: [{ type: 'rect', x: 0, y: 0, w: 50, h: 18, lineWidth: 0.3, lineColor: 'black' }]
                }
              ],

            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, margin: [0, 0, 0, 2] }] },
            {
              text: 'Food Safety Inspection - (Please review and Initial)',
              decoration: 'underline',
              decorationStyle: 'solid',
              fontSize: 10,
              bold: true,
              margin: [0, 3, 0, 5],
            },
            {
              text: 'This trailer has been inspected for food safety by the following guildelines: CORP PRP FSMS 079',
              fontSize: 9,
              margin: [0, 0, 0, 5],
            },
            {
              columns: [
                {
                  text: '*If trailer is rejected see manager',
                  fontSize: 8,
                  width: 300
                },
                {
                  text: 'Accept',
                  fontSize: 9
                },
                {
                  canvas: [{ type: 'rect', x: 0, y: 0, w: 50, h: 18, lineWidth: 0.3, lineColor: 'black' }]
                },
                {
                  text: 'Reject *',
                  fontSize: 9
                },
                {
                  canvas: [{ type: 'rect', x: 0, y: 0, w: 50, h: 18, lineWidth: 0.3, lineColor: 'black' }]
                }
              ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },
            {
              text: 'Records - (Please review and fil in as needed)',
              decoration: 'underline',
              decorationStyle: 'solid',
              fontSize: 10,
              bold: true,
              margin: [0, 3, 0, 3]
            }

            ]
          ]
        },
        {

          columns: [[
            {
              layout: 'noBorders',
              table: {
                headerRows: 0,
                body: [
                  [{ text: 'Trailer Number #', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 90, h: 18, lineWidth: 0.3, lineColor: 'black' }], colSpan: 3 }, '', '', '', '', { text: 'Drop Trailer', fontSize: 9 }, { text: (this.ShipmentDetails.dropTrailer == true) ? 'YES' : 'NO', fontSize: 9 }, '', ''],
                  [{ text: 'RPC Sizes / # Pallets', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Seal #', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Special Load Requirements', fontSize: 9, colSpan: 4, alignment: 'center' }, '', '', ''],
                  ['', '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 19, lineWidth: 0.3, lineColor: 'black' }] }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '# of Pallets scans', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Bagged', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '16 USA', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Heat Treated', fontSize: 8 }, { text: 'Yes', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'No', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Verified by', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.5, lineColor: 'black' }] }, { text: 'Export / HTP', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '16 CAN', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Last 4 Pallets Double Wrapped', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', '', '', { text: 'Tall Stacks', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Dry', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Load Locked', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', { text: 'Tosca Provided', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', '', ''],
                  [{ text: '# CHEP Pallets', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', '', '', '', '', '', ''],
                  [{ text: 'Comments', fontSize: 8 }, { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500 - 2 * 35, y2: 5, lineWidth: 0.5 }], colSpan: 10 }, '', '', '', '', '', '', '', '', '']

                ]
              }
            },
            {
              text: 'Staple to printed and signed hard copy BOL. Maintain for 3 yrs for audit purposes',
              fontSize: 9,
              bold: true,
              alignment: 'center'
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] }

          ]]
        }

      ],
      styles: {
        tablematerial: {
          fontSize: 10,
          alignment: 'center'
        }
      }

    }
  }

  getMaterialObject(material: any[]) {
    return {
      style: 'tablematerial',
      table: {
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          [{
            text: 'Size',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          {
            text: 'Bags',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          {
            text: 'Pallets',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          {
            text: 'Quantity Per Pallet',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          {
            text: 'Quantity',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          {
            text: 'Checked',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor: '#8abbeb'
          },
          ],
          ...material.map(ed => {
            return [ed.name, ed.bags == 0 ? '' : ed.bags, ed.pallets == 0 ? '' : ed.pallets, ed.propertyValue == 0 ? '' : ed.propertyValue, ed.quantity, ''];
          })
        ]
      }
    };
  }

  DateFormat(datetime) {
    var date = new Date(datetime);
    let formateddate = this.datepipe.transform(date, 'MM/dd/yyyy');
    return formateddate;
  }



  OnSelectedfromLocation(LocationId: any, Id: any, name: any) {

    this.SelecteOrderDetails = this.ShippingOrders.find(f => f.orderid == Number(Id));

    //this.GetDatepart`
    var selectedDate = this.isStockTransfer ? this.SelecteOrderDetails.ScheduledShipDate : this.SelecteOrderDetails.reqDeliveryDate;
    this.Convert_date = this.GetDatepart(selectedDate);
    this.Fromcontract(Number(this.SelecteOrderDetails.fromLocationID), this.Convert_date, Number(this.SelecteOrderDetails.orderTypeID));

    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "customer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "cpuorder") {
      this.ShippingOrders.forEach(order => {
        order.fromLocationID = LocationId;
        let lname = this.OrderLocationsforDDFrom.filter(x => x.value == LocationId);
        order.fromLocationName = lname[0].label;
        order.fromLocationNameGrid = lname[0].label;
      })
    }
    else {
      let lname = this.OrderLocationsforDD.filter(x => x.value == LocationId);
      this.SelecteOrderDetails.fromLocationName = lname[0].label;
      this.SelecteOrderDetails.fromLocationNameGrid = lname[0].label;
    }
    this.SetFromlocationforCarrierDD();


  }

  OnSelectedtoLocation(LocationId: any, Id: any) {

    var dd = Id;

    this.UpdateMaterial(Id, LocationId);
    this.SelecteOrderDetails = this.ShippingOrders.find(f => f.orderid == Number(Id));
    //this.GetDatepart
    var selectedDate = this.isStockTransfer ? this.SelecteOrderDetails.ScheduledShipDate : this.SelecteOrderDetails.reqDeliveryDate;
    this.Convert_date = this.GetDatepart(selectedDate);

    this.Tocontract(Number(this.SelecteOrderDetails.toLocationID), this.Convert_date, Number(this.SelecteOrderDetails.orderTypeID));

    //ToLocationID

    if (this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "stocktransfer" || this.ShipmentDetails.shipmentTypeCode.toLowerCase() == "collections") {
      this.ShippingOrders.forEach(order => {
        order.toLocationID = LocationId;
        let lname = this.OrderLocationsforDD.filter(x => x.value == LocationId);
        order.toLocationName = lname[0].label;
        order.toLocationNameGrid = lname[0].label;
      })
    }
    else {
      let lname = this.OrderLocationsforDD.filter(x => x.value == LocationId);
      this.SelecteOrderDetails.toLocationName = lname[0].label;
      this.SelecteOrderDetails.toLocationNameGrid = lname[0].label;
    }
    this.SetTolocationforCarrierDD();
  }

  UpdateMaterial(event: any, locationID: any) {



    var pp = this.ShippingOrdersDetails.length - 1;


    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].salesOrderID == Number(event)) {
        this.ShippingOrdersDetails[i].toLocationId = Number(locationID);
        this.ShippingOrdersDetails[i].locationName = this.LocationsforDD.find(f => f.id == Number(locationID))?.name;

      }
    }

    for (var i = 0; i < this.FinalShippingOrdersDetails.length; i++) {
      if (this.FinalShippingOrdersDetails[i].finalsalesOrderID == Number(event)) {
        this.FinalShippingOrdersDetails[i].finaltoLocationId = Number(locationID);
        this.FinalShippingOrdersDetails[i].finallocationName = this.LocationsforDD.find(f => f.id == Number(locationID))?.name;

      }
    }


    this.FinalMaterialList = [...this.FinalShippingOrdersDetails];
    this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
    this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);


    //this.MaterialDetails.forEach((value, index) => {
    //  this.ShippingOrdersDetails.push({ id: value.id, materialID: Number(value.materialID), orderQuantity: Number(value.quantity), showOnBOL: true, priceMethod: 'a', commudityName: 'a', orderNumber: this.ShippingOrders.find(f => f.orderid == Number(event))?.orderNumber, materialName: name, toLocationId: Number(locationID), locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name, quantityDiff: 0, shippedQuantity: 0, priceMethodID: 0, commodityID: 0, uomcode: value.umcode, propertyValue: 0, mCode: value.code, code: '', salesOrderID: Number(event), newMaterial: 1, entityCode: this.ShippingOrders.find(f => f.orderid == Number(event))?.entityCode, equivalentPallets: 0 });
    //});

    //this.ShippingMaterialDetails.forEach((value, index) => {
    //  this.ShippingOrdersDetails.push({ id: value.id, materialID: Number(value.materialID), orderQuantity: Number(value.quantity), showOnBOL: true, priceMethod: 'a', commudityName: 'a', orderNumber: this.ShippingOrders.find(f => f.orderid == Number(event))?.orderNumber, materialName: name, toLocationId: Number(locationID), locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name, quantityDiff: 0, shippedQuantity: 0, priceMethodID: 0, commodityID: 0, uomcode: value.umcode, propertyValue: 0, mCode: value.code, code: '', salesOrderID: Number(event), newMaterial: 1, entityCode: this.ShippingOrders.find(f => f.orderid == Number(event))?.entityCode, equivalentPallets: 0 });
    //});




  }

  LocationShippingMaterial(locationID: number, ClientID: number) {



    var orderID: number = 0;
    var orderTypeID: number = 0;
    //if (!this.isLocationChangeByUser) {
    //  orderID = Number(this.SelectedSalesOrdersforEdit.Id);
    //  orderTypeID = Number(this.SelectedSalesOrdersforEdit.OrderTypeId);
    //}

    ////&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
    //if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
    //  return false;


    this.orderManagementService.LocationShippingMaterial(22416, ClientID, orderID, orderTypeID).pipe()
      .subscribe(
        data => {
          if (data.data != null) {

            this.DefaultPalletsDetails = data.data;
            //this.ShippingMaterialDetails.forEach((value, index) => {
            //  this.DefaultPalletsDetails.push({ id: value.id, materialID: Number(value.materialID), orderQuantity: Number(value.quantity), showOnBOL: true, priceMethod: 'a', commudityName: 'a', orderNumber: this.ShippingOrders.find(f => f.orderid == Number(event))?.orderNumber, materialName: name, toLocationId: Number(locationID), locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name, quantityDiff: 0, shippedQuantity: 0, priceMethodID: 0, commodityID: 0, uomcode: value.umcode, propertyValue: 0, mCode: value.code, code: '', salesOrderID: Number(event), newMaterial: 1, entityCode: this.ShippingOrders.find(f => f.orderid == Number(event))?.entityCode, equivalentPallets: 0, flag: value.flag });
            //});

            //this.CalculateQuantity(OrderNo, ID, event)
          }
          else {
            //this.CalculateQuantity(OrderNo, ID, event)
          }
        });
  }

  DropTrailerChange() {
    //if (this.ShipmentDetails.dropTrailer && this.ShipmentDetails.shipmentTypeCode.toLowerCase() != "customertocustomer") {
    //  document.getElementById('TrailerCheckOutTime').setAttribute('required', null);
    //}
    //else {
    //  document.getElementById('TrailerCheckOutTime').removeAttribute('required');
    //}
  }

  getPageControlsPermissions() {

    if (this.editShipmentHasReadOnlyAccess) {
      this.Shippingreceivingdisabled = true;
      this.Transportationdisabled = true;
      this.TenderStatusDisbled = true;
      this.CarrierPickupdisabled = true;
      this.StopDeliverydisabled = true;
      this.buttonBar.disableAction('ship');
      this.buttonBar.disableAction('approveAndMas');
      this.buttonBar.disableAction('resendToMas');
      this.buttonBar.disableAction('tonu');
      this.buttonBar.disableAction('cancel');
      this.buttonBar.disableAction('receive');
      this.editorConfig = {
        editable: !this.editShipmentHasReadOnlyAccess,
        spellcheck: true,
        height: 'auto',
        minHeight: '200',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        uploadUrl: 'no',
        translate: 'no',
        placeholder: 'Enter text here...',
        toolbarHiddenButtons: [
          ['bold', 'italic'],
          ['fontSize']
        ]
      };
      return;
    }

    var ModuleRoleCode = "Ship,Ship.AP, Ship.SR,ShipmentHistory,ShipmentTransportation.Tab,ShipmentWorkbench.Cancel, Shipmgmt,"
    ModuleRoleCode += "ShippingReceiving.AddMaterial, ShippingReceiving.DeleteMaterial, ShippingReceiving.Tab, TenderAccept, ShipmentResend, ShipmentWorkbench.Cancel";
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var LoginId = this.authenticationService.currentUserValue.LoginId;

    this.shipmentManagementService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;
        }
        this.EnableDisableShippingReceivingTab();
        this.EnableDisableTransportationTab();

        //this.EnableDisableDcoumnetTab();

        //this.EnableDisableTrackingHistoryTab();
        //this.EnableDisableTenderHistroyTab();

      });
  }

  EnableDisableShippingReceivingTab() {

    this.Shippingreceivingdisabled = false;
    this.Shippingreceivinghide = false;
    var ShippingReceivingPermission = [];
    ShippingReceivingPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShippingReceiving.Tab"));
    if (ShippingReceivingPermission.length == 0) {
      this.Shippingreceivinghide = true;
      this.Shippingreceivingdisabled = true;
      $('#Transportation-tab').click();
    }

    if (ShippingReceivingPermission.length > 0) {
      var SRPRM = [];
      var SRPRM = ShippingReceivingPermission.filter((x) => x.PermissionType.toLowerCase().includes("read and modify"));
      if (SRPRM.length > 0) {
        // if (ShippingReceivingPermission[0].PermissionType.toLowerCase() == "read and modify") {
        this.Shippingreceivingdisabled = false;
      }
      else {
        this.Shippingreceivingdisabled = true;
      }
    }

  }
  EnableDisableTransportationTab() {
    this.Transportationhide = false;
    this.Transportationdisabled = false;
    var ShipmentTransportationPermission = [];
    ShipmentTransportationPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("ShipmentTransportation.Tab"));
    if (ShipmentTransportationPermission.length == 0) {
      this.Transportationhide = true;
      this.Transportationdisabled = true;
    }
    if (ShipmentTransportationPermission.length > 0) {
      var TRPRM = [];
      var TRPRM = ShipmentTransportationPermission.filter((x) => x.PermissionType.toLowerCase().includes("read and modify"));
      if (TRPRM.length > 0) {
        // if (ShipmentTransportationPermission[0].PermissionType.toLowerCase() == "read and modify") {
        this.Transportationdisabled = false;
      }
      else {
        this.Transportationdisabled = true;
      }
    }
  }

  verifyMaterialProperties(materials: number) {

    this.selectedMaterialPropertiesshow = false;
    this.orderManagementService.VerifyEquipmentMaterialPropertyOrder(materials, Number(this.ShipmentDetails.equipmentTypeID))
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

            this.CalculateQuantity(this.SelectMaterialOrderNo, this.SelectMaterialNo, this.SelectMaterialQuantity);
            //if (action == "modifymaterial") {
            //  if (this.EditFlag) {
            //    this.EditMaterial();
            //    this.ResetMaterial();
            //  }
            //  else { this.AddMaterial(); }
            //}
          }


        });
  }


  SaveMaterialProperties() {
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

      var messageData = "Getting error related material"
      //this.AllToasterMessage.find(x => x.code == messageCode)?.message1;
      this.toastrService.error(messageData);
      return false;
    }

    var selectedMaterialProperties: MaterialPropertyGrid[] = [];

    selectedMaterialProperties.push({
      equipmentID: Number(this.ShipmentDetails.equipmentTypeID),
      materialID: Number(this.SelectMaterialID),
      materialName: "",
      materialWeight: Number(this.editVerifyEquipmentMaterialProperty.materialWeight),
      palletInEquipement: Number(this.editVerifyEquipmentMaterialProperty.propertyValuePE),
      unitInEquipement: Number(this.editVerifyEquipmentMaterialProperty.propertyValueUE),
      unitInPallet: Number(this.editVerifyEquipmentMaterialProperty.propertyValueUP)
    });

    this.orderManagementService.SaveMulitpleMaterialProperties(selectedMaterialProperties).subscribe(result => {
      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {

        //this.SelectMaterialOrderNo, this.SelectMaterialNo, this.SelectMaterialQuantity
        //this.SelectMaterialData.propertyValue = Number(selectedMaterialProperties[0].unitInPallet);
        //this.CommodityData = result.data == undefined ? result.Data : result.data;
        for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
          if (this.ShippingOrdersDetails[i].id == Number(this.SelectMaterialNo) && this.ShippingOrdersDetails[i].orderNumber == this.SelectMaterialOrderNo) {
            this.ShippingOrdersDetails[i].shippedQuantity = Number(this.SelectMaterialQuantity);
            this.ShippingOrdersDetails[i].propertyValue = Number(selectedMaterialProperties[0].unitInPallet);

          }
        }


        $("#materialPropertyPopup").modal('hide');
        this.modifyMaterialGrid();
      }
      else {
        var messageData = "Getting error";
        //this.AllToasterMessage.find(x => x.code == 'contacttoadmin')?.message1;
        this.toastrService.error(messageData);
      }

    });
    // call on success of modify material grid
  }
  modifyMaterialGrid() {
    this.verifyMaterialProperties(Number(this.SelectMaterialID > 0 ? this.SelectMaterialID : 0));
  }

  ShowInfo() {
    if (this.helpbtns) {
      $("#requirerulesmdl").modal('show');
    }
  }

  TPQFailSendtoMAS(ShipmentId: number) {
    this.shipmentManagementService.SendtoMASTPQFail(ShipmentId)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.toastrService.info(result.data.message);
        }
      })
  }

  InitializeDropdownvalus() {
    //const selectedordertype = this.OrderTypeData.find(x => x.id == this.ShipmentDetails.equipmentTypeID);
    //if (selectedordertype != undefined) {
    //  this.SelectedEquipment = [{ "id": selectedordertype.id, "name": selectedordertype.name }];
    //}
    //const selectedshipmentstatus = this.OrderStatusData.find(x => x.id == this.ShipmentDetails.shipmentstatusId);
    //if (selectedshipmentstatus != undefined) {
    //  this.SelectedShipmentStatus = [{ "id": selectedshipmentstatus.id, "name": selectedshipmentstatus.name }];
    //}
    //const selectedshipmentcondition = this.ShipmentConditionData.find(x => x.id == this.ShipmentDetails.shipmentConditionID);
    //if (selectedshipmentcondition != undefined) {
    //  this.SelectedShipmentCondition = [{ "id": selectedshipmentcondition.id, "name": selectedshipmentcondition.name }];
    //}

    //const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
    //if (selectedtenderstatus != undefined) {
    //  this.SelectedTenderStatus = [{ "id": selectedtenderstatus.id, "name": selectedtenderstatus.name }];
    //}

    //const selectedequip = this.EquipmentTypeData.find(x => x.id == this.ShipmentDetails.equipmentTypeID);
    //if (selectedequip != undefined) {
    //  this.SelectedEquipment = [{ "id": selectedequip.id, "name": selectedequip.name }];
    //}
    //const selectedMode = this.freightModeData.find(x => x.id == this.ShipmentDetails.freightModeID);
    //if (selectedMode != undefined) {
    //  this.SelectedfreightMode = [{ "id": selectedMode.id, "name": selectedMode.name }];
    //}
    //const seletedcarrier = this.ChargeTypes.find(x => x.id == this.ShipmentDetails.carrierID);
    //if (seletedcarrier != undefined) {
    //  this.SelectedCarrier = [{ "id": seletedcarrier.id, "name": seletedcarrier.name }];
    //}
  }

  CloseMaterialMissingPropertiesPopup() {
    $("#missingMaterialProerptyPopup").modal('hide');
    $("#editshipment").modal('show');
  }
  saveallmaterialPropertiesForShipment() {
    var selectedMaterialProperties: MaterialPropertyGrid[] = [];
    var ErrorMessage = "";
    var isErrorFound: boolean = false;
    this.MissingMaterialPropertyData.forEach((value, index) => {
      if (value.materialWeight <= 0) {
        ErrorMessage = ErrorMessage + "Please enter valid weight for Material." + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValueUP <= 0) {

        ErrorMessage = ErrorMessage + 'Please enter valid "Unit on a pallet" for Material. :' + value.materialName;
        isErrorFound = true;
      }
      if (this.editVerifyEquipmentMaterialProperty.propertyValuePE <= 0) {

        ErrorMessage = ErrorMessage + 'Please enter valid "No. of pallets in the equipment" for Material :' + value.materialName;
        isErrorFound = true;
      }

      if (this.editVerifyEquipmentMaterialProperty.propertyValueUE <= 0) {
        ErrorMessage = ErrorMessage + 'Please enter valid "No. of units in the equipment" for Material :' + value.materialName;
        isErrorFound = true;
      }
      selectedMaterialProperties.push({
        equipmentID: Number(this.ShipmentDetails.equipmentTypeID),
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
          $("#missingMaterialProerptyPopup").modal('hide');
          $("#editshipment").modal('show');
          //here we add the material inside the grid
          this.Temp();
        }
        else {
          this.toastrService.error("There is a technical issue encountered. Please refer this to support team.");
        }

      });
    }
  }
  verifyAllMaterialProperties(materials: any[]) {
    this.selectedMaterialPropertiesshow = false;
    this.shipmentManagementService.ValidateMaterialProperty(materials, Number(this.ShipmentDetails.equipmentTypeID))
      .subscribe(
        data => {
          var result = data.data;

          if (result.validationResponse.message == "materialpropertymissing") {
            // open material property popup to display missing material property grid.
            $("#missingMaterialProerptyPopup").modal('show');
            $("#editshipment").modal('hide');
            this.MissingMaterialPropertyData = <MaterialPropertyGrid[]>result.editVerifyEquipmentMaterialProperties;
            this.MissingMaterialPropertyDataSource = new MatTableDataSource<MaterialPropertyGrid>(result.editVerifyEquipmentMaterialProperties);
          }
          else {
            // this.toastrService.error(result.validationResponse.message);
            if (result.editVerifyEquipmentMaterialProperties == null && result.validationResponse.message == "") {
              //here we add the material inside the grid
              this.Temp();
            }
          }

        });
  }
  openEditShipmentPopup() {
    $("#editshipment").modal('show');
    this.selectedItemsB = [];
    //this.selectedItemsUOM = [];
    ////this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>();
    ////this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.FinalMaterialList); //TempShippingOrdersDetails    
    this.TempFinalMaterialList = [];

    //this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>();
    //if (this.FinalMaterialList.length > 0) {
    //  this.FinalMaterialList.forEach(val => this.TempFinalMaterialList.push(Object.assign({}, val)));

    //  this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.FinalMaterialList);
    //}
    //else {
    //  this.FinalShippingOrdersDetails.forEach(val => this.TempFinalMaterialList.push(Object.assign({}, val)));
    //  this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.TempFinalMaterialList);
    //}
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ValidateNPMIMaterial(OrderNo: string, ID: number) {

    if (Number(this.ShippingOrdersDetails.filter(f => f.orderNumber == OrderNo && f.code == 'F23').length) > 0 && Number(this.ShippingOrdersDetails.filter(f => f.orderNumber == OrderNo && f.code != 'F23' && f.uomcode == 'EA').length) == 0)  // -> 3
    {
      //this.DefaulatPallet = this.ShippingOrdersDetails.find(f => f.orderNumber == OrderNo && f.flag == Number(0));

      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {

        if (this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

          this.TempDeleteMaterial.push({
            "materialID": this.ShippingOrdersDetails[i].materialID,
            "orderNumber": this.ShippingOrdersDetails[i].orderNumber,
            "salesOrderID": Number(this.ShippingOrdersDetails[i].salesOrderID),
            "entityCode": this.ShippingOrdersDetails[i].entityCode

          });

          //this.EqualPallets = this.EqualPallets - Number(cal);
          this.ShippingOrdersDetails.splice(i, 1);


        }
      }


      this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
    }




  }

  get OrderTypeCodeStatus(): string {
    return this.SelecteOrderDetails.orderTypeCode;
    //this.orderManagement.OrderTypeCode;
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

  get isStockTransfer(): boolean {
    return ((this.OrderTypeCodeStatus == "StockTransfer" || this.OrderTypeCodeStatus == "Collections"));
  }

  Tocontract(LocationID: number, RequestDate: any, OrderTypeID: number) {

    this.ToContractlist = [];


    this.orderManagementService.Tocontract(Number(LocationID), RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {
          //  ;

          this.ToContractlist = data.data;
          //this.orderManagement.ToContractId = this.ToContractlist[0].id;
          var ordertype = this.SelecteOrderDetails.orderTypeCode;

          this.SelectContractTo(data.data, ordertype, Number(this.authenticationService.currentUserValue.ClientId), Number(LocationID));


        });
  }

  Fromcontract(LocationID: number, RequestDate: any, OrderTypeID: number) {

    this.orderManagementService.Fromcontract(LocationID, RequestDate, Number(OrderTypeID)).pipe()
      .subscribe(
        data => {

          var ordertype = this.SelecteOrderDetails.orderTypeCode;
          this.FromContractlist = data.data;
          this.SelectedContractFrom(data.data, ordertype, Number(this.authenticationService.currentUserValue.ClientId), Number(LocationID));



          //this.SelectedContractFrom(data.data, ordertype, Number(this.orderManagement.ClientId), Number(this.orderManagement.FromLocationId));
          //this.orderManagement.FromContractId = this.FromContractlist[0].id;


        });

  }

  SelectContractTo(data: any[], OrderType: string, ClientID: number, LocationID: number) {

    this.orderManagementService.ToSelectedContract(data, OrderType, ClientID, LocationID).pipe()
      .subscribe(
        data => {

          if (data.data > 0) {
            var tempdata = this.ToContractlist.find(f => f.id == Number(data.data))
            var shiptolocationtype = this.LocationsforDD.find(f => f.id == Number(LocationID))?.locationType;

            for (var i = 0; i < this.ShippingOrders.length; i++) {
              if (this.ShippingOrders[i].orderid == Number(this.SelecteOrderDetails.orderid)) {
                this.ShippingOrders[i].toBusinessPartnerContract = tempdata.contractNumber;
                this.ShippingOrders[i].toLocationName = LocationID + "-" + this.LocationsforDD.find(f => f.id == Number(LocationID))?.name;


                if (shiptolocationtype == "Customer") {
                  this.ShippingOrders[i].toCustomerContractID = Number(data.data);
                  this.ShippingOrders[i].toBusinessPartnerContractID = null;
                }
                else if (shiptolocationtype == "BP") {
                  this.ShippingOrders[i].toCustomerContractID = null;
                  this.ShippingOrders[i].toBusinessPartnerContractID = Number(data.data);
                }
                else {
                  this.ShippingOrders[i].toCustomerContractID = null;
                  this.ShippingOrders[i].toBusinessPartnerContractID = null;
                }

              }
            }

            // this.orderManagement.ToContractId = letdata;

            if (!this.IsCustomerReturn) {
              this.GetComment(Number(data.data), LocationID, ClientID);
            }
          }
          else {

            for (var i = 0; i < this.ShippingOrders.length; i++) {
              if (this.ShippingOrders[i].orderid == Number(this.SelecteOrderDetails.orderid)) {
                this.ShippingOrders[i].toBusinessPartnerContract = "";
                this.ShippingOrders[i].toLocationName = LocationID + "-" + this.LocationsforDD.find(f => f.id == Number(LocationID))?.name;
                this.ShippingOrders[i].toCustomerContractID = null;
                this.ShippingOrders[i].toBusinessPartnerContractID = null;
              }
            }
            if (!this.IsCustomerReturn) {
              this.GetComment(Number(0), Number(LocationID), ClientID);
            }
          }
        });
  }

  SelectedContractFrom(data: any[], OrderType: string, ClientID: number, LocationID: number) {

    this.orderManagementService.SelectedContractFrom(data, OrderType, ClientID, LocationID).pipe()
      .subscribe(
        data => {



          if (data.data > 0) {
            var tempdataf = this.FromContractlist.find(f => f.id == Number(data.data));
            var shiptolocationtype = this.LocationsforDDFrom.find(f => f.id == Number(LocationID))?.locationType;
            for (var i = 0; i < this.ShippingOrders.length; i++) {
              if (this.ShippingOrders[i].orderid == Number(this.SelecteOrderDetails.orderid)) {
                this.ShippingOrders[i].fromBusinessPartnerContract = tempdataf.contractNumber;


                if (shiptolocationtype == "Customer") {
                  this.ShippingOrders[i].fromCustomerContractID = Number(data.data);
                  this.ShippingOrders[i].fromBusinessPartnerContractID = null;
                }
                else if (shiptolocationtype == "BP") {
                  this.ShippingOrders[i].fromCustomerContractID = null;
                  this.ShippingOrders[i].fromBusinessPartnerContractID = Number(data.data);
                  // get new apcharges

                }
                else {
                  this.ShippingOrders[i].fromCustomerContractID = null;
                  this.ShippingOrders[i].fromBusinessPartnerContractID = null;
                }




              }
            }
            if (this.IsCustomerReturn) {
              this.GetComment(Number(data.data), LocationID, ClientID);
            }

          }
          else {

            for (var i = 0; i < this.ShippingOrders.length; i++) {
              if (this.ShippingOrders[i].orderid == Number(this.SelecteOrderDetails.orderid)) {
                this.ShippingOrders[i].fromBusinessPartnerContract = "";
                this.ShippingOrders[i].fromCustomerContractID = null;
                this.ShippingOrders[i].fromBusinessPartnerContractID = null;

              }
            }

            if (this.IsCustomerReturn) {
              this.GetComment(Number(0), LocationID, ClientID);
            }
          }

          var apchargeLocChangedata: any = {};
          var orderApcLocChange: any = [];
          var ordDetailsApcLocChange: any = [];
          if (this.ShippingOrders != undefined) {
            this.ShippingOrders.forEach(order => {
              let objorderApcLocChange: any = {};
              objorderApcLocChange.OrderID = order.orderid;
              objorderApcLocChange.FromLocationID = order.fromLocationID;
              objorderApcLocChange.ToLocationID = order.ToLocationID;
              objorderApcLocChange.OrderTypeID = order.OrderTypeID;
              objorderApcLocChange.ReqDeliveryDate = this.ConverttoDateOnlyforDB(order.reqDeliveryDate);
              objorderApcLocChange.PurchaseNumber = order.purchaseOrderNumber;
              objorderApcLocChange.EntityCode = order.entityCode;
              objorderApcLocChange.FromBusinessPartnerContractID = order.fromBusinessPartnerContractID;
              objorderApcLocChange.ToBusinessPartnerContractID = order.toBusinessPartnerContractID;
              objorderApcLocChange.FromCustomerContractID = order.fromCustomerContractID;
              objorderApcLocChange.ToCustomerContractID = order.toCustomerContractID;
              objorderApcLocChange.ClientID = this.authenticationService.currentUserValue.ClientId;;
              orderApcLocChange.push(objorderApcLocChange);
            });
          }
          if (this.FinalShippingOrdersDetails != undefined) {
            this.FinalShippingOrdersDetails.forEach(orderdet => {
              let objordDetailsApcLocChange: any = {};
              objordDetailsApcLocChange.ID = orderdet.finalid;
              objordDetailsApcLocChange.SalesOrderID = orderdet.finalsalesOrderID;
              objordDetailsApcLocChange.MaterialID = orderdet.finalmaterialID;
              objordDetailsApcLocChange.OrderQuantity = orderdet.finalorderQuantity;
              objordDetailsApcLocChange.ShowOnBOL = orderdet.finalshowOnBOL;
              objordDetailsApcLocChange.PriceMethodID = orderdet.finalpriceMethodID;
              objordDetailsApcLocChange.OrderNumber = orderdet.finalorderNumber;
              objordDetailsApcLocChange.ShippedQuantity = orderdet.finalshippedQuantity;
              objordDetailsApcLocChange.CommodityID = orderdet.finalcommodityID;
              objordDetailsApcLocChange.UOMCODE = orderdet.finaluomcode;
              objordDetailsApcLocChange.NewMaterial = orderdet.finalnewMaterial;
              objordDetailsApcLocChange.EquivalentPallets = orderdet.finalequivalentPallets;
              ordDetailsApcLocChange.push(objordDetailsApcLocChange);
            });
          }
          apchargeLocChangedata.shipmentId = this.ShipmentDetails.id;
          apchargeLocChangedata.orderApcLocChange = orderApcLocChange;
          apchargeLocChangedata.ordDetailsApcLocChange = ordDetailsApcLocChange;
          this.GetApchargesLocChage(apchargeLocChangedata);
        });
  }
  GetComment(ContractID: any, LocationID: any, ClientId: any) {

    this.orderManagementService.GetComment(ContractID, LocationID, ClientId).pipe()
      .subscribe(
        data => {

          for (var i = 0; i < this.ShippingOrders.length; i++) {
            if (this.ShippingOrders[i].orderid == Number(this.SelecteOrderDetails.orderid)) {
              this.ShippingOrders[i].transportationComment = data.data.transportationComment;
              this.ShippingOrders[i].loadingComment = data.data.loadingComment;
              this.ShippingOrders[i].Comments = data.data.additionalComments;
            }
          }

          //this.orderManagement.TransportationComment = data.data.transportationComment;
          //this.orderManagement.LoadingComment = data.data.loadingComment;
          //this.orderManagement.Comments = data.data.additionalComments;
        });

  }
  GetUOMforApcharespopup() {
    this.shipmentManagementService.GetUOMforApcharespopup()
      .subscribe(data => {
        this.UomforApchargespopup = data.data;
      });
  }

  validationspanishTransportationComment(Commentstring: string, Id: any) {
    if (Commentstring == null) {
      return;
    }

    this.orderManagementService.TransplaceOrderCommentvalidation(Commentstring)
      .subscribe(
        data => {
          this.strResult = data.result;
          this.SelecteOrderDetails = this.ShippingOrders.find(f => f.orderid == Number(Id));
          this.SelecteOrderDetails.spanishTransportationComment = this.strResult;
        });
  }

  validationspanishLoadingComment(Commentstring: string, Id: any) {
    if (Commentstring == null) {
      return;
    }

    this.orderManagementService.TransplaceOrderCommentvalidation(Commentstring)
      .subscribe(
        data => {
          this.strResult = data.result;
          this.SelecteOrderDetails = this.ShippingOrders.find(f => f.orderid == Number(Id));
          this.SelecteOrderDetails.spanishLoadingComment = this.strResult;
        });

  }
  validationordercommentSpanish(Commentstring: string, Id: any) {
    if (Commentstring == null) {
      return;
    }

    this.orderManagementService.TransplaceOrderCommentvalidation(Commentstring)
      .subscribe(
        data => {
          this.strResult = data.result;
          this.SelecteOrderDetails = this.ShippingOrders.find(f => f.orderid == Number(Id));
          this.SelecteOrderDetails.ordercommentSpanish = this.strResult;
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
              this.editShipmentHasReadOnlyAccess = false;
              this.TenderStatusDisbled = false;
            }
            else {
              this.editShipmentHasReadOnlyAccess = true;
              this.TenderStatusDisbled = true;
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

  GetApchargesLocChage(apchargeLocChangedata: any) {
    this.shipmentManagementService.GetApchargesLocChage(apchargeLocChangedata)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          const apcharges = result.data;
          if (apcharges != undefined && apcharges != null) {
            this.apchargesData = apcharges.map((apcharges, index) => { return { SNo: index + 1, ...apcharges } }
            )
            this.apchargesData.forEach(row => {
              row.autoAdded = row.autoAdded ? "Yes" : "No";
            })
            this.apchargesDataEdit = [...this.apchargesData];
            this.apchargesServer = apcharges.map((apcharges, index) => { return { SNo: index + 1, ...apcharges } }
            )
            this.convertBooleanToYesNoAPChargeServer();
          }
          else {
            this.apchargesData = [];
            this.apchargesDataEdit = [];
            this.apchargesServer = [];
          }

          this.apchargesDataTab = new MatTableDataSource<any>(this.apchargesData);
          this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);

        }
      });
  }

  convertBooleanToYesNoAPChargeServer() {
    this.apchargesServer.forEach((value, index) => {
      if (value.autoAdded == true) {
        value.autoAdded = "Yes";
      }
      else if (value.autoAdded == false){
        value.autoAdded = "No";
      }
    });

  }

  GetTenderStatusTracking(ShipmentId: number) {
    this.shipmentManagementService.GetTenderStatusTracking(ShipmentId)
      .subscribe(data => {
        this.TenderStatusTrackingData = data.data;

      });

  }
  GetStatusTracking(ShipmentId: number) {
    this.shipmentManagementService.GetStatusTracking(ShipmentId)
      .subscribe(data => {

        this.StatusTrackingData = data.data;
      });

  }
  ShowHideTenderStausLabelDropdown() {
    if (this.ShipmentDetails.tenderStatusCode.toLowerCase() == "intransit" || this.ShipmentDetails.tenderStatusCode.toLowerCase() == "delivered"
      || this.ShipmentDetails.tenderStatusCode.toLowerCase() == "tender accept") {
      this.TenderstatusLableShow = true;
    }
    else {
      this.TenderstatusLableShow = false;
    }
  }
}




  //LocationMaterial(locationID: number, ClientID: number, event: any) {

  //  this.MaterialDetails = [];
  //  var orderID: number = 0;
  //  var orderTypeID: number = 0;


  //  //&& (this.IsShippedInventoryAndARChargesSentToMAS || this.IsTransferOrderShippedandInventorySentToMAS || this.IsShippedAndUnderReview)
  //  //if ((this.orderManagement.Id != undefined && this.orderManagement.Id > 0) && this.isLocationChangeByUser)
  //  //  return false;

  //  this.orderManagementService.LocationMaterial(22416, ClientID, GlobalConstants.EA, 4710, orderID, orderTypeID).pipe().
  //    subscribe(
  //      data => {
  //        if (data.data != null) {

  //          this.MaterialDetails = data.data;
  //          this.MaterialDetails.forEach((value, index) => {
  //            this.ShippingOrdersDetails.push({ id: value.id, materialID: Number(value.materialID), orderQuantity: Number(value.quantity), showOnBOL: true, priceMethod: 'a', commudityName: 'a', orderNumber: this.ShippingOrders.find(f => f.orderid == Number(event))?.orderNumber, materialName: name, toLocationId: Number(locationID), locationName: this.LocationsforDD.find(f => f.id == Number(locationID))?.name, quantityDiff: 0, shippedQuantity: 0, priceMethodID: 0, commodityID: 0, uomcode: value.umcode, propertyValue: 0, mCode: value.code, code: '', salesOrderID: Number(event), newMaterial: 1, entityCode: this.ShippingOrders.find(f => f.orderid == Number(event))?.entityCode, equivalentPallets: 0 });
  //          });

  //          this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
  //          this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);

  //        }
  //      });
  //}

    // const datepipe: DatePipe = new DatePipe('en-US')
        // this.ApprovedDate1 = datepipe.transform(dt, 'MM-dd-yyyy hh:mm:ss');
