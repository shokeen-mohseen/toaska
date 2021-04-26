import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonShipModel, ShipmentAdjustChargesModel, FinalShipmentAdjustChargesModel } from '../../../../core/models/regularOrder.model';
import { CommonListViewModel, ShipmentMaterialDeatails } from '../../../../core/models/shipmentworkbench.model';
import { DatePipe } from '@angular/common';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ResizeEvent } from 'angular-resizable-element';
import { OrderManagementAdjustChargesService } from '../../../../core/services/order-management-AdjustCharges.service';
import { ToastrService } from 'ngx-toastr';
import JsBarcode from 'jsbarcode/bin/JsBarcode';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

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
  constructor(private router: Router,
    private shipmentManagementService: shipmentManagementService, private orderManagementAdjustCharges: OrderManagementAdjustChargesService, private orderManagementService: OrderManagementService,
    private authenticationService: AuthService, private toastrService: ToastrService, private datepipe: DatePipe) { 
  }
  // @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @Input() buttonBar: any;
  actionGroupConfig;
  itemListA = [];
  itemListB = [];
  itemListUOM = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};
  selectedItemsUOM = [];
  settingsUOM = {};

  count = 3;
  public helpbtns: any;

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
  TenderStatusforDD: any = {};

  // ReceiveBtnDisabled: boolean = true;

  ChargeTypes: any = {};
  ShipmentDetails: any = {};
  ShippingOrders: any = [];
  ShippingOrdersGrid: any;
  ShippingSaveDetails: any = {};

  ShipmentsforEdit: any = {};
  SelectedShipmentsforEdit: any = {};
  ShippingOrdersDetails: any;
  FinalShippingOrdersDetails: any;
  ShipmentTypeId: number;
  ShipmentTypeName: string;
  ShipmentStatusId: number;
  ShipmentStatusName: string;
  ShipmentConditionId: number;
  ShipmentConditionName: string;
  ShipDate: Date;
  MaterialChargesDetails: any;
  FinalMaterialList: any;

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

  ApprovedBy: string;
  ApprovedDate: any;
  ToShip: boolean;


  TrailerCheckInTime: any;
  TrailerCheckOutTime: any;
  TrailerTimeTrackingduration: string = '';
  SortStartTime: any;
  SortEndTime: any;
  SortTimeTrackingduration: string = '';
  enableTrailerTimeTracking: boolean;
  DropTrailer: boolean;

  SaveBtnDisabled: boolean = false;
  TenderStatusDisbled: boolean = true;
  OrderLocationDisble: boolean = true;
  OrderAppointmentDisable: boolean = true;


  OrderCommentData: any = {}

  SelectMaterial: number = 0;
  MaterialData: any=[];
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
  apchargeBusinessPartner: any;
  apchargeChargeType: any;
  apchargeUOM: number = 70;
  apchargeContractAmount: number = 200;
  apchargeModifiedAmount: number;
  apchargeEditno: number = 0;
  apchargeEditMode: boolean = false;
  apchargeEditModeText: string = 'key_Insert';
  APCModified: boolean = false;
  CTempData: any = [];
  DefaultMaterialProperty: any;
  onReceiveDisable: boolean = true;
  btnshipDisable: boolean = true;
  OrderAmountforApchargeNew: number = 0;
  ApChargeNewShipmentStatus: string = "";
  ApChargeNewShipmentStatustemp: string = "";
  ApchargeModified: boolean = false;
  ApchargeModifiedTemp: boolean = false;



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
  EqipmentPallets: number = 60;
  TempPallets: number = 0;
  Value: any;
  UOMData: any;
  UOMCode: string;
  UOMID: number = 0;
  TempDeleteMaterial = [];

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

  ngOnInit() {
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
    this.Clearpickupdroptimings();

    //this.GetShipMentType();
    //this.GetStatus();
    //this.GetShipmentCondition();
    //this.GetCarrierData();

    //this.GetEquipment();
    //this.GetFrieghtMode();
    // this.GetLocationsforDD();
    this.GetTenderstatusforDD();
    this.LocationsforDD = this.shipmentManagementService.LocationsData;
    this.GetChargeType();
    //this.BindMaterialList(1, 2,3);

    this.GetShipmentEditlist();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
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

        });
   // this.getrecord();
  }//init() end

  GetShipmentEditlist() {
    this.Clearpickupdroptimings();
    this.ShipmentsforEdit = this.shipmentManagementService.ShipmentsforEdit;
    this.SelectedShipmentsforEdit = this.ShipmentsforEdit[0];
    this.GetShipmentDetailsforEdit(this.SelectedShipmentsforEdit);

    //this.shipmentManagementService.EditingShipment = this.SelectedShipmentsforEdit.shipmentNumber;
    //this.GetShipmentDetails(this.SelectedShipmentsforEdit.id);
    //this.GetShippingOrders(this.SelectedShipmentsforEdit.id);
    //this.GetShippingOrdersDetails(this.SelectedShipmentsforEdit.id);
    //this.GetApcharges(this.SelectedShipmentsforEdit.id);
    var RequestObject = {
      ContractID: 4580,
      ShipTOLocationID: 21959,
      ClientID: this.authenticationService.currentUserValue.ClientId,
    };
    this.GetAdjustChargesDefault(RequestObject);
  }

  GetShipmentforEdit(shipmentnumber: any) {
    this.SelectedShipmentsforEdit = this.ShipmentsforEdit.find(x => x.shipmentNumber == shipmentnumber);
    this.GetShipmentDetailsforEdit(this.SelectedShipmentsforEdit);

  }

  GetShipmentDetailsforEdit(SelectedShipment: any) {
    this.Clearpickupdroptimings();
    this.GetShipmentDetails(SelectedShipment.id);

    //  this.GetShipmentOrders(SelectedShipment.id);
   // this.GetApcharges(SelectedShipment.id);
   // this.SetInputData();
  }

  RemoveShipment(shipmentnumber) {
    this.ShipmentsforEdit.splice(this.ShipmentsforEdit.findIndex(item => item.shipmentNumber === shipmentnumber), 1)
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
    this.shipmentManagementService.OrderStatusList()
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
    'selectRow', 'route', 'orderNumber', 'fromLocationNameGrid', 'toLocationID', 'reqDeliveryDate',
    'mustArriveByDate', 'actualDeliveryDate', 'travelTime', 'pickupAppointment', 'deliveryAppointment'];

  displayedColumnsReplace = [
    'selectRow', 'key_Route', 'key_OrderNumber', 'key_FromLocation',
    'key_ToLocation', 'key_ReqDeliveryDate', 'key_mabd',
    'key_ActualDeliveryDate', 'key_TravelTime', 'key_PickupAppointment',
    'key_DeliveryAppointment'
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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
    'selectRow',
    'orderNumber',
    'materialName',
    'orderQuantity',
    'shippedQuantity',
    'quantityDiff',
    'showOnBOL',
    'locationName'
  ];


  ShipmentReceiptColumnsCheck = [
    'orderNumber',
    'materialName',
    'orderQuantity',
    'shippedQuantity',
    'quantityDiff',
    'showOnBOL',
    'locationName'
  ];

  AddShipmentReceiptColumns = [
    'selectRow',
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
    'selectRow', 'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
    'key_Shipqunt', 'key_QuantityDiff', 'key_ShowOnBOL',
    'key_Shipto', 'key_Action'];

  ShipmentReceiptColumnsHeaderCheck = [
    'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
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
  dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>();
  dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>();
  selection3 = new SelectionModel<ShipmentAdjustChargesModel>(false, []);

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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  // for editor code 
  htmlContent = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
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
      this.CarrierPickupcidt = pctimings[0].CheckInTime;
      this.CarrierPickupcodt = pctimings[0].CheckOutTime;
      this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt);
    }
  }
  GetStopTimings() {
    const pctimings = this.CarrierStopData.filter(x => x.LocationID == this.CarrierStopDeliveryLocationID);
    if (pctimings.length > 0) {
      this.CarrierStopDeliverycidt = pctimings[0].CheckInTime;
      this.CarrierStopDeliverycodt = pctimings[0].CheckOutTime;
      this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
    }
  }

  GetCarrierPickupOutcwt(event) {
      if (this.CarrierPickupcodt != undefined) {
        if (this.CarrierPickupcidt == undefined) {
            this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
        }
        else {
              if (this.CarrierPickupcidt <= this.CarrierPickupcodt) {
                this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt);
                this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
              }
              else { this.toastrService.error("Carrier Out Date Time should be later than Carrier In Date Time"); }
        }
        this.ShippingSaveDetails.CarrierPickupData = this.CarrierPickupData;
    }
  }

  GetCarrierPickupIncwt(event) {
    if (this.CarrierPickupcidt != undefined) {
      if (this.CarrierPickupcodt == undefined) {
        this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
      }
      else {
        if (this.CarrierPickupcidt <= this.CarrierPickupcodt) {
          this.CarrierPickupduration = this.TimeDifferenceHrsMins(this.CarrierPickupcidt, this.CarrierPickupcodt);
          this.SetCarrierdata(this.CarrierPickupLocationID, this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupData);
        }
        else { this.toastrService.error("Carrier Out Date Time should be later than Carrier In Date Time"); }
      }
      this.ShippingSaveDetails.CarrierPickupData = this.CarrierPickupData;
    }
  }

  ChangeShipDateForCarrierOutime(LocationId, outime) {
    const selorders = this.ShippingOrders.filter(x => x.fromLocationID == LocationId);
    const routeno = selorders[0].route;
    if (routeno == 1) {
      this.ShipmentDetails.shipDate = outime;
    }

  }
  GetCarrierStopDeliveryIncwt(event) {
    if (this.CarrierStopDeliverycidt != undefined) {
      if (this.CarrierStopDeliverycodt == undefined) {
        this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData); 
      }
      else {
        if (this.CarrierStopDeliverycidt <= this.CarrierStopDeliverycodt) {
          this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
          this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData);
        }
        else {
          this.CarrierStopDeliverycidt = null;
          this.CarrierStopDeliveryduration = null;
          this.toastrService.error("Carrier Out Date Time should be later than Carrier In Date Time");
        }
          
      }
    }
    this.ShippingSaveDetails.CarrierStopData = this.CarrierStopData;
  }

  GetCarrierStopDeliveryOutcwt(event) {
    if (this.CarrierStopDeliverycodt != undefined) {

      if (this.CarrierStopDeliverycidt == undefined) {
        this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData);
      }
      else {

        if (this.CarrierStopDeliverycidt <= this.CarrierStopDeliverycodt) {
          this.CarrierStopDeliveryduration = this.TimeDifferenceHrsMins(this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt);
          this.SetCarrierdata(this.CarrierStopDeliveryLocationID, this.CarrierStopDeliverycidt, this.CarrierStopDeliverycodt, this.CarrierStopData);
        }
        else {
           this.CarrierStopDeliverycodt = null;
           this.CarrierStopDeliveryduration = null;
          this.toastrService.error("Carrier Out Date Time should be later than Carrier In Date Time");
          }

      }
    }
    this.ShippingSaveDetails.CarrierStopData = this.CarrierStopData;
  }

  GetTrailerTimeTrackingIncwt(event, type) {
    if (this.TrailerCheckInTime != undefined) {
      if (this.TrailerCheckOutTime != undefined) {
        if (this.TrailerCheckInTime <= this.TrailerCheckOutTime) {
          this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime)
        }
        else {
          this.toastrService.error("Trailer Checkout Date Time should be later than trainer checkin Date Time")
          event.target.value = '';
          this.TrailerCheckInTime = null;
          this.TrailerTimeTrackingduration = null;
        }
      }
      this.ShippingSaveDetails.trailerCheckInTime = this.TrailerCheckInTime;
    }
  }

  GetTrailerTimeTrackingOutcwt(event, type) {
    if (this.TrailerCheckOutTime != undefined) {
      if (this.TrailerCheckInTime != undefined) {
          if (this.TrailerCheckInTime <= this.TrailerCheckOutTime) {
            this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime)
          }
          else {
            this.toastrService.error("Trailer Checkout Date Time should be later than trainer checkin Date Time")
            event.target.value = '';
            this.TrailerCheckOutTime = null;
            this.TrailerTimeTrackingduration = null;
        }
      }
      this.ShippingSaveDetails.trailerCheckOutTime = this.TrailerCheckOutTime;
    }
 }

  GetSortTrackingTcwt(event, type) {

    if (this.SortEndTime != undefined) {
      if (this.SortStartTime != undefined) {
        if (this.SortStartTime <= this.SortEndTime) {
          this.SortTimeTrackingduration = this.TimeDifferenceHrsMins(this.SortStartTime, this.SortEndTime)
        }
        else {
          this.toastrService.error("Sort End Date Time should be later than Sort Start Date Time");
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
      else { this.toastrService.error("Please Enter Sort Start Date Time") }
    }
    this.ShippingSaveDetails.sortStartTime = this.SortStartTime;
    this.ShippingSaveDetails.sortEndTime = this.SortEndTime;
  }

  TenderStatusChange(event) {
    this.ShippingSaveDetails.shipmentTenderStatusID = event.target.value;
    const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
    if (selectedtenderstatus != undefined) {
      this.ShippingSaveDetails.tenderStatusName = selectedtenderstatus.name;
    }
    console.log(this.ShippingSaveDetails.tenderStatusName )
    this.EnableDisableShipButton();
  }
  EquipmentChange(event) {
    this.ShippingSaveDetails.equipmentTypeID = event.target.value;
  }
  DispatchApprove(event) {
    if (this.ShipmentDetails.compliedWithShippingInstructions) {
      this.CheckCarrierOuttimePopulated();
     
      if (this.CarrierOuttimePopulated) {
        var dt = new Date();
        // const datepipe: DatePipe = new DatePipe('en-US')
        // this.ApprovedDate1 = datepipe.transform(dt, 'MM-dd-yyyy hh:mm:ss');
        const appd = dt.toISOString().slice(0, 16);
        this.ApprovedDate = appd;
        this.ApprovedBy = this.authenticationService.currentUserValue.LoginId;
        $("#compilePopup").modal('show');
      }
      else {
        this.ApprovedDate = '';
        this.ApprovedBy = '';
        this.toastrService.warning("carrier out date time is mandatory");
        this.ShipmentDetails.compliedWithShippingInstructions = false;
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
    this.ShippingSaveDetails.compliedWithShippingInstructions = this.ShipmentDetails.compliedWithShippingInstructions;
    this.EnableDisableShipButton()
  }


  ReceiveChange(event) {
    this.EnableDisableReceiveButton();
  }
  GetShipmentDetails(ShipmentId: number) {
    this.shipmentManagementService.GetShipmentDetails(ShipmentId)
      .subscribe(data => {
        this.ShipmentDetails = data.data[0];
        this.ShippingSaveDetails = data.data[0];
        this.shipmentManagementService.EditingShipment = this.ShipmentDetails.shipmentNumber;
        this.GetShipmentOrders(ShipmentId);
        this.GetShipmentOrderDetails(ShipmentId);
        this.GetShippingOrdersDetails(ShipmentId);
        this.GetApcharges(ShipmentId);
        this.SetInputData();
        this.EnableDisableShipButton();
        this.EnableDisableReceiveButton();
        this.EnableDisableCancelButton();
        this.EnableDisableTonuButton();
        this.EnableDisableTenderStatus();
        this.EnableDisableOrderLocation();
        this.EnableDisableAppointments();
        this.EnableToReceiveCheck();
        this.EnableDisableSaveButton();       
        const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
        if (selectedtenderstatus != undefined) {
          this.SelectedTenderStatus = [{ "id": selectedtenderstatus.id, "name": selectedtenderstatus.name }];
        }
      });
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

  EnableDisableSaveButton() {
    this.CheckCarrierOuttimePopulated();
    if (this.ShipmentDetails.dropTrailer) {
      if (this.ShipmentDetails.shipmentType.toLowerCase() == "customer" || this.ShipmentDetails.shipmentType.toLowerCase() == "cpuorder") {
        if (!this.CarrierOuttimePopulated || this.ShipmentDetails.carrierID == null) { this.SaveBtnDisabled = true; }
        else { this.SaveBtnDisabled = false; }
      }

      if (this.ShipmentDetails.shipmentType.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentType.toLowerCase() == "stocktransfer") {
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

  EnableDisableReceiveButton() {
    if (this.ShipmentDetails.shipmentType.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentType.toLowerCase() == "collections" ||
      this.ShipmentDetails.shipmentType.toLowerCase() == "stocktransfer") {
      const cdate = new Date().toISOString().slice(0, 16);
      if (this.ShipmentDetails.shipDate <= cdate && this.ShipmentDetails.receive && this.ShipmentDetails.tenderStatusName.toLowerCase() == "tender accept"
        && this.CarrierIntimePopulated && this.ShipmentDetails.shipmentStatusName.trim().toLowerCase() != "receive")
        this.buttonBar.enableAction('receive');
      else {
        this.buttonBar.disableAction('receive');
      }
    }
    else {
      this.buttonBar.disableAction('receive');
    }
  }

  EnableDisableShipButton() {
    if (this.ShipmentDetails.shipmentType.toLowerCase() == "customer" || this.ShipmentDetails.shipmentType.toLowerCase() == "cpuorder") {
      const cdate = new Date().toISOString().slice(0, 16);
      if (this.ShipmentDetails.shipDate <= cdate && this.ShipmentDetails.compliedWithShippingInstructions
        && this.ShipmentDetails.tenderStatusName.toLowerCase() == "tender accept" && this.CarrierOuttimePopulated
        && this.ShipmentDetails.shipmentStatusName.trim().toLowerCase() != "shipped"
        && this.ShipmentDetails.shipmentStatusName.trim().toLowerCase() != "shipped and ap charges sent to mas")
        this.buttonBar.enableAction('ship');
      else {
        this.buttonBar.enableAction('ship');
      }
    }
    else {
      this.buttonBar.enableAction('ship');
    }
  }

  EnableDisableTonuButton() {
    if (this.ShipmentDetails.tenderStatusName.toLowerCase() == "tenderaccepted") {
      this.buttonBar.enableAction('tonu');
    }
    else {
      this.buttonBar.disableAction('tonu');
    }
  }

  EnableDisableCancelButton() {
    if (this.ShipmentDetails.tenderStatusName.toLowerCase() == "tenderaccepted") {
      this.buttonBar.enableAction('cancel');
    }
    else {
      this.buttonBar.disableAction('cancel');
    }
  }

  EnableDisableTenderStatus() {

    if (this.ShipmentDetails.shipmentTenderStatusID == null) {
      const seltenstid= this.TenderStatusforDD.find(x => x.name.toLowerCase() == "tendered");
      if (seltenstid != undefined && seltenstid !=null) {this.SelectedTenderStatus = seltenstid.id; }
    }
    
    if (this.ShipmentDetails.shipmentStatusName.toLowerCase() == 'open shipment needs to be completed') {
      this.TenderStatusDisbled = false;
    }
    else {
      this.TenderStatusDisbled = true;
    }
  }

  EnableDisableOrderLocation() {
    // Id- 2 - Code- Tender Accepted
    // Id- 4- Code- Tendered
    if (this.ShipmentDetails.shipmentStatusName.toLowerCase() == 'open shipment needs to be completed'
      && (this.ShipmentDetails.tenderStatusName.toLowerCase() == 'tender accepted'
        || this.ShipmentDetails.tenderStatusName.toLowerCase() == 'tendered')) { this.OrderLocationDisble = false; }
    else { this.OrderLocationDisble = true; }
  }

  EnableDisableAppointments() {
    if (this.ShipmentDetails.shipmentStatusName.toLowerCase() == 'open shipment needs to be completed'
      && (this.ShipmentDetails.tenderStatusName.toLowerCase() == 'tender accepted'
        || this.ShipmentDetails.tenderStatusName.toLowerCase() == 'tendered')) { this.OrderAppointmentDisable = false; }
    else { this.OrderAppointmentDisable = true; }
  }

  EnableToReceiveCheck() {
    if (this.ShipmentDetails.shipmentType.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentType.toLowerCase() == "collections") {
      this.onReceiveDisable = false;
    }
    else {
      this.onReceiveDisable = true;
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
    this.CarrierIntimePopulated = false;
    if (this.ShippingOrders != null && this.ShippingOrders.length > 0) {
      const sorder = this.ShippingOrders.filter(x => x.route = 1);
      const tolocationid = sorder[0].toLocationid;
      const pctimings = this.CarrierStopData.filter(x => x.LocationID == tolocationid);
      if (pctimings.length > 0) {
        if (pctimings[0].CheckOutTime != null) { this.CarrierIntimePopulated = true; }
      }
    }
  }

  GetShipmentOrders(ShipmentId: number) {
    this.shipmentManagementService.GetShippingOrders(ShipmentId)
      .subscribe(data => {
        this.ShippingOrders = data.data;
        console.log(this.ShippingOrders)
        this.SetFromlocationforCarrierDD();
        this.SetTolocationforCarrierDD();
        this.GetBusinessPartner();
      });
  }

  Clearpickupdroptimings() {
    this.CarrierPickupLocationID = 0;
    this.CarrierPickupcidt = null;
    this.CarrierPickupcodt = null;
    this.CarrierPickupduration = "";
    this.CarrierStopDeliveryLocationID = 0;
    this.CarrierStopDeliverycidt = null;
    this.CarrierStopDeliverycodt = null;
    this.CarrierStopDeliveryduration = "";
  }
  SetInputData() {
    this.ApprovedBy = this.ShipmentDetails.approvedBy;
    this.ApprovedDate = this.ShipmentDetails.approvedDateTime;
    this.TrailerCheckInTime = this.ShipmentDetails.trailerCheckInTime;
    this.TrailerCheckOutTime = this.ShipmentDetails.trailerCheckOutTime;
    if (this.TrailerCheckInTime != undefined && this.TrailerCheckOutTime != undefined) {
      this.TrailerTimeTrackingduration = this.TimeDifferenceHrsMins(this.TrailerCheckInTime, this.TrailerCheckOutTime);
    }
    this.SortStartTime = this.ShipmentDetails.sortStartTime;
    this.SortEndTime = this.ShipmentDetails.sortEndTime;
    if (this.SortStartTime != undefined && this.SortEndTime != undefined) {
      this.SortTimeTrackingduration = this.TimeDifferenceHrsMins(this.SortStartTime, this.SortEndTime)
    }
  }

  //GetLocationsforDD() {
  //  this.shipmentManagementService.GetLocationsforDD()
  //    .subscribe(result => {
  //      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
  //        this.LocationsforDD = result.data
  //      }
  //    });
  //}

  GetTenderstatusforDD() {
    this.shipmentManagementService.GetTenderstatusforDD()
      .subscribe(data => {
        this.TenderStatusforDD = data.data;
        if (this.ShipmentDetails != undefined) {
          const selectedtenderstatus = this.TenderStatusforDD.find(x => x.id == this.ShipmentDetails.shipmentTenderStatusID);
          if (selectedtenderstatus != undefined) {
            this.SelectedTenderStatus = [{ "id": selectedtenderstatus.id, "name": selectedtenderstatus.name }];
          }
        }

      });
  }
  GetChargeType() {
    this.shipmentManagementService.GetChargeType()
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          const ChargeTypesAll = result.data
          this.ChargeTypes = ChargeTypesAll.filter(f => f.chargeCategoryId === 2);
        }
      });
  }

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
    let BPlist = [];
    const FromBP = this.ShippingOrders.map(({ businessPartner }) => {
      return { businessPartner }
    })
    FromBP.forEach(bp => {
      let bparray = bp.businessPartner.split('*BP*');
      bparray.forEach(bpa => {
        if (bpa != '') {
          let bpitem = bpa.split('*B*');
          BPlist.push({ id: bpitem[0], name: bpitem[1], BPtype: bpitem[2] })
        }
      })
    })
    this.ApChargeBPList = BPlist.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
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
  }
  SetCarrierdata(LocationID, Checkintime, Checkouttime, Datavar) {
    var dataexists: boolean = false;
    for (var i = 0; i < Datavar.length; i++) {
      if (Datavar[i]['LocationID'] === parseInt(LocationID)) {
        dataexists = true;
        Datavar[i]['LocationID'] = parseInt(LocationID);
        Datavar[i]['CheckInTime'] = Checkintime;
        Datavar[i]['CheckOutTime'] = Checkouttime;
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
          this.GetLocationDetails(this.SODTimings[0].toLocationId);
        }
        this.CarrierPickupLocationID = this.FromlocationforCarrierDD[0].fromLocationID;
        this.CarrierStopDeliveryLocationID = this.TolocationforCarrierDD[0].toLocationID;        
        this.InitializeCarrierPickupdata(this.SODTimings);
        this.InitializeCarrierStopdata(this.SODTimings);
        this.GetStartTimings();
        this.GetStopTimings();

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
            this.apchargesDataEdit = [...this.apchargesData];
          }
          else {
            this.apchargesData = [];
            this.apchargesDataEdit = [];
          }
          this.apchargesDataTab = new MatTableDataSource<any>(this.apchargesData);
          this.apchargesDataEditTab = new MatTableDataSource<any>(this.apchargesDataEdit);

        }
      });
  }
  SelectForEditApcharges(row) {
    if (row.autoAdded == 'Yes') {
      this.selectionAPCEdit.clear();
      this.apchargesDataEdit.forEach(row1 => { row1.highlighted = false });
      this.selectionAPCEdit.select(row);
      row.highlighted = true;
      this.apchargeEditno = row.SNo;
      this.apchargeEditMode = true;
      this.apchargeEditModeText = 'key_Insert';
      const seleditBP = this.ApChargeBPList.find(x => x.id == row.businessPartnerID);
      const seleditCT = this.ChargeTypes.find(x => x.id == row.chargeID);
      this.apchargeBusinessPartner = [{ "id": seleditBP.id, "name": seleditBP.name, "BPtype": seleditBP.BPtype }];
      this.apchargeChargeType = [{ "id": seleditCT.id, "name": seleditCT.name }];
      this.apchargeContractAmount = row.chargeValue;
      this.apchargeModifiedAmount = row.chargeModifiedValue;
    }
    else {
      this.toastrService.info("You cannot edit this record");
    }
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
      this.toastrService.error("Please Select Business Partner");
      return false;
    }
    if (this.apchargeChargeType == undefined) {
      this.toastrService.error("Please Select Charge Type");
      return false;
    }
    if (this.apchargeModifiedAmount == undefined || this.apchargeModifiedAmount == null) {
      this.toastrService.error("Please Enter Modified Amount");
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
      this.toastrService.warning("Data Modified, Please click Add button to save the Data ");
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
      this.shipmentManagementService.GetOrderAmountforApcharges(this.apchargeBusinessPartner[0].id, this.apchargeChargeType[0].id, this.ShipmentDetails.id)
        .subscribe(result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.apchargeContractAmount = result.data;
            this.apchargeModifiedAmount = result.data;
          }
        });
    }
  }

  MakeShipmentDetailsforSave() {
    // Order comment adding to Main JSON starts 

    var OrderComments: any = [];
    var Appointments: any = [];
    var Locations: any = [];
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
        appointment.pickupAppointment = order.pickupAppointment;
        appointment.deliveryAppointment = order.deliveryAppointment;
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
        location.toLocationID = order.toLocationID;
        location.entityCode = order.entityCode;
        Locations.push(location);
      })

    }
    this.ShippingSaveDetails.OrderComments = OrderComments;
    this.ShippingSaveDetails.Locations = Locations;
    this.ShippingSaveDetails.Appointments = Appointments;
    this.ShippingSaveDetails.ten
    // Order comments, Order apppointments, Order locations adding to Main JSON ends
    var tt = this.ShippingOrdersDetails;

    var materialList: any = [];
    if (this.FinalMaterialList != null && this.FinalMaterialList != undefined) {
      this.FinalMaterialList.forEach(material => {
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
    this.ShippingSaveDetails.salesOrderDetail = materialList;
    // this.ShippingSaveDetails.salesOrderDetail = this.ShippingOrdersDetails;
    this.ShippingSaveDetails.deletesalesOrderDetail = this.TempDeleteMaterial;
    this.ShippingSaveDetails.clientID = this.authenticationService.currentUserValue.ClientId;
    
    //this.ShippingSaveDetails.orderType = this.shipmentManagementService.OrderType;


    this.ShippingSaveDetails.apcharges = this.apchargesData.map(({ shipmentID, bpType, businessPartnerID, businessPartnerContactID,
      chargeID, chargeUOMID, chargeValue, chargeModifiedValue }) => {
      return {
        shipmentID, BusinessPartnerType: bpType, BusinessPartnerLocationID: parseFloat(businessPartnerID), BusinessPartnerContactID: null,
        CarrierID: parseFloat(businessPartnerID), ChargeID: parseInt(chargeID), ChargeUOMID: parseInt(chargeUOMID), ChargeSequece: 1,
        ChargeValue: parseFloat(chargeValue), ChargeModifiedValue: parseFloat(chargeModifiedValue), SalesTaxClassID: 1
      }
    });
  }

  saveShipment() {
    if (this.ShipmentDetails.carrierID == null) {
      this.toastrService.warning("Carrier is not set");
      return false;
    }
   
    if (this.ShipmentDetails.dropTrailer || this.ShipmentDetails.compliedWithShippingInstructions) {
      if (this.ShipmentDetails.shipmentType.toLowerCase() == "customer" || this.ShipmentDetails.shipmentType.toLowerCase() == "cpuorder") {
        this.CheckCarrierOuttimePopulated();
        if (!this.CarrierOuttimePopulated) {
          this.toastrService.warning("When Drop Trailer checked or To Ship Checked , Carrier Pick up - Carrier Out Time Must be Entered");
          return false;
        }
        if (this.ShipmentDetails.shipmentType.toLowerCase() == "customerreturn" || this.ShipmentDetails.shipmentType.toLowerCase() == "stocktransfer") {
          this.CheckCarrierIntimePopulated();
          if (!this.CarrierIntimePopulated || this.ShipmentDetails.carrierID == null) {
            this.toastrService.warning("When Drop Trailer Checked or To Ship Checked, Carrier Stop Delivery -  Carrier In Time Must be Entered");
            return false;
          }

        }
      }
    }
    if (this.ShipmentDetails.dropTrailer) {
        if (this.TrailerCheckInTime == undefined || this.TrailerCheckInTime == null) {
          this.toastrService.warning("When Drop Trailer checked , Trailer check In Time Must be Entered");
        }
    }

    this.MakeShipmentDetailsforSave();
    this.shipmentManagementService.SaveShipment(this.ShippingSaveDetails)
      .subscribe(result => {
      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
         this.toastrService.info(result.data[0].message);
      }
    });
 }
  
  Tonu() {
    var RequestObject = {
      shipmentid: this.SelectedShipmentsforEdit.id,
      updateby: this.authenticationService.currentUserValue.LoginId
    };
    this.shipmentManagementService.Tonu(RequestObject)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.toastrService.info("Shipment Tonu Successfully");
          }
        }
      );
  }
  Cancel() {
    var RequestObject = {
      shipmentid: this.SelectedShipmentsforEdit.id,
      updateby: this.authenticationService.currentUserValue.LoginId
    };
    this.shipmentManagementService.Cancel(RequestObject)
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            this.toastrService.info("Shipment Cancelled Successfully");
          }
        }
      );
  }
  ReceiveSelectedShipment() {
    this.MakeShipmentDetailsforSave()
    this.shipmentManagementService.ReceiveSelectedShipment(this.ShippingSaveDetails)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.toastrService.info(result.data[0].message);
        }
      });

  }

  ShipSelectedShipment() {
    this.MakeShipmentDetailsforSave();
    console.log(this.ShippingSaveDetails);
    this.shipmentManagementService.ShipSelecteShipment(this.ShippingSaveDetails)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {

          this.toastrService.info(result.data[0].message);
        }
      });
  }

  //Converttodatetime(deliveryAppointment) {
  // let dt=new Date(deliveryAppointment);
  //  console.log(dt)
  //     var date = dt.getDate();
  //  var month = dt.getMonth() + 1;
  //  var year = dt.getFullYear();
  //  var hours = dt.getHours();
  //  var minuts = dt.getMinutes();
  //  let dts = year.toString() + "-" + month.toString() + "-" + date.toString() + "-T" + hours.toString() + "-" + minuts.toString() + ":00";
  //  console.log(dts)

  //}
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

    var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
    //var RequestObjects = {     
    //  LocationID: locationID,
    //  ClientID: this.authenticationService.currentUserValue.ClientId,     
    //};
    //this.GetMaterialCommodity(this.selectedItemsB, RequestObjects);
    //var equipmentSelected = setInterval(() => {
    //  //  ;
    //  if (this.CTempData != undefined && this.CTempData != null &&  this.CTempData.length>0) {
    //    clearInterval(equipmentSelected);
    //    var dd = this.CTempData;
    //    this.Temp();
    //  }
    //  }, 1000);
    if (this.selectedItemsB.length < 1 || this.OrderTypeId == 0 || this.UOMID == 0) {
      this.toastrService.warning('Please select vailid data');
      return;
    }
    else {
      this.Temp();
    }



  }

  Temp() {

    var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
    var tempID = this.ShippingOrdersDetails[this.ShippingOrdersDetails.length - 1].id;

    var locationID = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.toLocationID;
    //this.LocationsforDD.find(f => f.orderid == Number(this.OrderTypeId))?.name;
    var getmaterial = this.MaterialData.find(f => f.id == this.SelectMaterial);
    //var getUom = this.UOMData.filter(f => f.id == this.SelectUOM);
    //var Condition1 = this.ShippingOrdersDetails.find(temp => temp.materialID == getmaterial.id)
    var ONo = this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.orderNumber

    for (var i = 0; i < this.selectedItemsB.length; i++) {
      tempID = tempID + 1;
      var Condition1 = this.ShippingOrdersDetails.find(temp => temp.materialID == this.selectedItemsB[i].id && temp.orderNumber == ONo)
      if (Condition1) {
      }
      else {
        var vv = this.CTempData;

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
          uomcode: this.UOMCode,
          propertyValue: '0',
          mCode: this.selectedItemsB[i].code,
          code: '',
          salesOrderID: Number(this.OrderTypeId),
          newMaterial: 1,
          entityCode: this.ShippingOrders.find(f => f.orderid == Number(this.OrderTypeId))?.entityCode,
          equivalentPallets:0
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
      EquipmentTypeID: 4570,
      ClientID: this.authenticationService.currentUserValue.ClientId,
      EntityPropertyCode: 'Number of Units in an Equipment'
    };
    this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
  }


  GetShippingOrdersDetails(ShipmentId: number) {
    this.shipmentManagementService.GetShippingOrdersDetails(ShipmentId)
      .subscribe(data => {
        this.FinalShippingOrdersDetails = data.data;
        this.GetPalletsCalculation();
        this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
      });

    this.shipmentManagementService.GetShippingOrdersDetails(ShipmentId)
      .subscribe(data => {
        this.ShippingOrdersDetails = data.data;
       // this.FinalShippingOrdersDetails = data.data;
        this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
        //this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
        var RequestObject = {
          EquipmentTypeID: 4570,
          ClientID: this.authenticationService.currentUserValue.ClientId,
          EntityPropertyCode: 'Number of Units in an Equipment'
        };
        this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
      });
  }

  AddAllMaterial() {
    var dd = this.ShippingOrdersDetails;
    this.EqualPallets = 0;

    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].uomcode == 'EA') {
        if (this.ShippingOrdersDetails[i].code != "F23") {
          var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          
          this.TotalPallets = this.TotalPallets + Number(cal);
          this.EqualPallets = this.EqualPallets + Number(cal);
        }
        else {
          var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
         
          this.TotalPallets = this.TotalPallets + Number(cal1);
          this.EqualPallets = this.EqualPallets + Number(cal1 * 2);

        }


      }


    }
    if (this.EqualPallets <= this.EqipmentPallets) {

      this.FinalMaterialList = this.ShippingOrdersDetails;
      this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.ShippingOrdersDetails);

    }
    else {

      this.FinalMaterialList = this.FinalShippingOrdersDetails;
      this.toastrService.warning('Material Quantity is over.');
      return false;

    }
    //Number(this.SelectEquipment), Number(event.target.value), 100, "Number of Units in an Equipment"
    //var RequestObject = {
    //  EquipmentTypeID: 4570,      
    //  ClientID: 100,
    //  EntityPropertyCode:'Number of Units in an Equipment'
    //};   
    //this.GetMaterialQuantity(this.ShippingOrdersDetails, RequestObject);
  }

  GetAdjustChargesDefault(RequestObject: any) {

    this.shipmentManagementService.GetAdjustChargesDefault(RequestObject)
      .subscribe(
        result => {
          this.MaterialChargesDetails = result.data.responseContractDefaultRateValue;
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

  CalculateQuantity(OrderNo: string, ID: number, event) {


    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].id == Number(ID) && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
        this.ShippingOrdersDetails[i].shippedQuantity = Number(event);
      }
    }





    this.TotalPallets = 0;
    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].uomcode == 'EA' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
       if (this.ShippingOrdersDetails[i].code != "F23") {
          var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.ShippingOrdersDetails[i].equivalentPallets = Number(cal);
          this.TotalPallets = this.TotalPallets + Number(cal);
          this.EqualPallets = this.EqipmentPallets + Number(cal);
        }
        else {
          var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.ShippingOrdersDetails[i].equivalentPallets = Number(cal);
          this.TotalPallets = this.TotalPallets + Number(cal1);
          this.EqualPallets = this.EqipmentPallets + Number(cal1 * 2);
        }
      }
    }

    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].uomcode == 'PLT' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
        this.ShippingOrdersDetails[i].shippedQuantity = this.TotalPallets;
      }
    }
    this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);

    var data = this.ShippingOrdersDetails.find(f => f.orderid == Number(this.OrderTypeId) && f.id == Number(ID));
    if (data.mcode != 'WW-PALLET' && data.uomcode == 'PLT') {

      for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
        if (this.ShippingOrdersDetails[i].mcode == 'WW-PALLET' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {
          if (Number(this.ShippingOrdersDetails[i].shippedQuantity) <= Number(data.shippedQuantity)) {
            this.ShippingOrdersDetails[i].shippedQuantity = Number(this.ShippingOrdersDetails[i].shippedQuantity) - Number(data.shippedQuantity);
          }
          else {
            this.toastrService.warning("Pallets is over");
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
    var data = this.ShippingOrdersDetails.find(f => f.id == Number(ID) && f.orderNumber == OrderNo);

    this.TempDeleteMaterial.push({
      "materialID": data.materialID,
      "orderNumber": data.orderNumber,
      "salesOrderID": Number(data.salesOrderID),
      "entityCode":data.entityCode

    });

    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {
      if (this.ShippingOrdersDetails[i].uomcode == 'EA' && this.ShippingOrdersDetails[i].orderNumber == OrderNo && this.ShippingOrdersDetails[i].id == ID) {

        if (this.ShippingOrdersDetails[i].code != "F23") {

          var cal = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.TempPallets = Number(cal);
          this.EqualPallets = this.EqipmentPallets - Number(cal);
          this.ShippingOrdersDetails.splice(i, 1);
        }
        else {
          var cal1 = Math.ceil(Number(this.ShippingOrdersDetails[i].shippedQuantity) / Number(this.ShippingOrdersDetails[i].propertyValue));
          this.TempPallets = Number(cal1);
          this.EqualPallets = this.EqipmentPallets - Number(cal1 * 2);
          this.ShippingOrdersDetails.splice(i, 1);
        }
      }
    }

    for (var i = 0; i < this.ShippingOrdersDetails.length; i++) {

      if (this.ShippingOrdersDetails[i].mCode == 'WW-PALLET' && this.ShippingOrdersDetails[i].orderNumber == OrderNo) {

        this.ShippingOrdersDetails[i].shippedQuantity = Number(this.ShippingOrdersDetails[i].shippedQuantity) - Number(this.TempPallets);

      }
    }
    this.dataSource3 = new MatTableDataSource<ShipmentAdjustChargesModel>(this.ShippingOrdersDetails);
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

  SendShipmentForMAS(isShip: boolean) {
    if (isShip) {
      if (this.SelectedShipmentsforEdit == undefined) {
        this.toastrService.error("Please select the at least one shipment.");
        return false;
      }
      //if (this.CarrierPickupcodt == null || this.CarrierPickupcodt == undefined) {
      //  this.toastrService.error("Please select carrier pickup out date.");
      //  return false;
      //}
      this.CheckCarrierOuttimePopulated();
      if (!this.CarrierOuttimePopulated) {
        this.toastrService.error("Please select carrier pickup out date.");
        return false;
      }
      if (this.ShipmentDetails.compliedWithShippingInstructions == false) {
        this.toastrService.error("Please Complied with shipping instructions.");
        return false;
      }
     // if (Number(this.ShipmentDetails.shipmentTenderStatusID) != 2) {
      if (this.ShipmentDetails.tenderStatusName.toLowerCase() == "tender accept") {
        this.toastrService.error("Shipment must be Tender Accepted.");
        return false;
      }
    }
    else if (!isShip) {
      if (this.SelectedShipmentsforEdit == undefined) {
        this.toastrService.error("Please select the at least one shipment.");
        return false;
      }
      this.CheckCarrierOuttimePopulated();
      if (!this.CarrierOuttimePopulated) {
        this.toastrService.error("Please select carrier pickup out date.");
        return false;
      }
      //if (this.CarrierPickupcodt == null || this.CarrierPickupcodt == undefined) {
      //  this.toastrService.error("Please select carrier pickup out date.");
      //  return false;
      //}
      if (this.ShipmentDetails.compliedWithShippingInstructions == false) {
        this.toastrService.error("Please Complied with shipping instructions.");
        return false;
      }
      if (this.ApChargeNewShipmentStatus == "underreview") {
        this.ShippingSaveDetails.shipmentstatusId = 11
        this.ApChargeNewShipmentStatus = "";
      }
      if (this.ApChargeNewShipmentStatus != "underreview") {
        this.ShippingSaveDetails.shipmentstatusId = 7
        this.ApChargeNewShipmentStatus = "";
      }


    }
    var selectedShipemnetID = this.SelectedShipmentsforEdit.id;

    this.shipmentManagementService.SendShipmentTOMAS(Number(selectedShipemnetID), this.CarrierPickupcidt, this.CarrierPickupcodt, this.CarrierPickupLocationID).subscribe(data => {

      if (data.message == GlobalConstants.Success || data.Message == GlobalConstants.Success) {
        this.toastrService.success("your request has been sent successfully");
      }
      else {
        this.toastrService.error("contact to administrator.");
      }
    });
  }

  OrderLocationChange(item, type) {
    const sl = this.LocationsforDD.filter(x => x.id == item.fromLocationID)
    if (this.FromlocationforCarrierDD.indexOf(sl[0].fromLocationId) == -1) {
      this.FromlocationforCarrierDD.push(
        {
          fromLocationID: sl[0].id,
          fromLocationName: sl[0].name
        }
      );
    }
  }

  CompileCheckOK() {
    this.compilecheckclose.nativeElement.click();
  }
  CompileCheckCancel() {
    this.ShipmentDetails.compliedWithShippingInstructions = false;
    this.compilecheckclose.nativeElement.click();
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
            this.toastrService.info("Shipment Orders Updated Successfully");
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
      this.BindMaterialList(Number(dd.orderid), 2, Number(dd.orderTypeID));
      var tt = this.MaterialData;
    }
    else {
      this.MaterialData = [];
    }
  
  }

  GetPalletsCalculation() {
    var ClientID = this.authenticationService.currentUserValue.ClientId;
    var SalesOrderID = this.FinalShippingOrdersDetails[0].salesOrderID;
    this.shipmentManagementService.GetPalletsCalculation(ClientID, SalesOrderID,this.FinalShippingOrdersDetails[0].ShipmentTypeCode)
      .subscribe(res => {
        if (res.message == "Success") {
          this.PalletsCalculation = res.data;
        }
      });
  }

  GetLocationDetails(LocationId:number)
  {
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
    JsBarcode(canvas, text, { format: "CODE39" });
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
          width: 120,
          hieight: 40,
          alignment: 'right',
          absolutePosition: { x: 50, y: 40 }
        },
        {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABQCAYAAABRX4iyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUUwRjk1N0IwMjUyMTFFQjgwOUU4REMwQjQ2QjAwODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUUwRjk1N0MwMjUyMTFFQjgwOUU4REMwQjQ2QjAwODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RTBGOTU3OTAyNTIxMUVCODA5RThEQzBCNDZCMDA4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RTBGOTU3QTAyNTIxMUVCODA5RThEQzBCNDZCMDA4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi0hj44AABiLSURBVHja7FwJdBzV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',
          fit:[50,60],
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
              text: 'Customer: ' + this.ShippingOrders[0].toLocationName,
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
              [{ text: 'Office Use - Fill out as needed', alignment: 'center',colSpan: 3, fontSize: 10 }, '',''],
              [{ text: 'Time IN',fontSize:10 }, {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 19,
                    lineWidth: 0.5,
                    lineColor: 'black',
                  }], colSpan: 2 },''],
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
              },''],
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
              }, { text: 'AM/PM', fontSize: 10}],
              [{ text: 'Driver Phone #', fontSize: 10}, {
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
              },''],
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
                  width:300
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
                  [{ text: 'Trailer Number #', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 90, h: 18, lineWidth: 0.3, lineColor: 'black' }], colSpan: 3 }, '', '', '', '', { text: 'Drop Trailer', fontSize: 9 }, { text: (this.ShipmentDetails.dropTrailer == true) ? 'YES' : 'NO', fontSize: 9},'',''],
                  [{ text: 'RPC Sizes / # Pallets', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Seal #', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Special Load Requirements', fontSize: 9, colSpan: 4, alignment: 'center'},'','',''],
                  ['', '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 19, lineWidth: 0.3, lineColor: 'black' }] }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '# of Pallets scans', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Bagged', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '16 USA', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Heat Treated', fontSize: 8 }, { text: 'Yes', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'No', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Verified by', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.5, lineColor: 'black' }] }, { text: 'Export / HTP', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: '16 CAN', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Last 4 Pallets Double Wrapped', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', '', '', { text: 'Tall Stacks', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, { text: 'Dry', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }],
                  [{ text: 'Load Locked', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', { text: 'Tosca Provided', fontSize: 8 }, { canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 18, lineWidth: 0.3, lineColor: 'black' }] },'','','',''],
                  [{ text: '# CHEP Pallets', fontSize: 8 }, '', { canvas: [{ type: 'rect', x: 0, y: 0, w: 35, h: 18, lineWidth: 0.3, lineColor: 'black' }] }, '', '', '', '', '', '', '', ''],
                  [{ text: 'Comments', fontSize: 8 }, { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500 - 2 * 35, y2: 5, lineWidth: 0.5 }],colSpan:10 },'','','','','','','','','']
                 
                ]
              }
            },
            {
              text: 'Staple to printed and signed hard copy BOL. Maintain for 3 yrs for audit purposes',
              fontSize: 9,
              bold: true,
              alignment:'center'
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] }  

          ]]
        }
        
      ],
      styles: {
        tablematerial: {
          fontSize: 10,
          alignment:'center'
        } }

    }
  }

  getMaterialObject(material: any[]) {
    return {
      style:'tablematerial',
      table: {
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          [{
            text: 'Size',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            fillColor:'#8abbeb'
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

}
