import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { AuthService } from '../../../../../core/services/auth.service';
import {  CommonShipModel, EditVerifyEquipmentMaterialProperty, FinalShipmentAdjustChargesModel,
  MaterialPropertyGrid, ShipmentAdjustChargesModel } from '../../../../../core/models/regularOrder.model';
export interface PeriodicElement {
  route: string;
  orderNumber: string;
  fromLocationID: string;
  toLocationID: string;
  reqDeliveryDate: string;
  mustArriveByDate: string;
  actualDeliveryDate: string;
  pickupAppointment: string;
  deliveryAppointment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    route: '1',
    orderNumber: 'CUST352.0',
    fromLocationID: '40514-L&R Farms Inc. WM',
    toLocationID: '60514-L&R Farms Inc. WM',
    reqDeliveryDate: '02/10/2021',
    mustArriveByDate: '02/10/2021',
    actualDeliveryDate: '',
    pickupAppointment: '02/16/2021 02:06 PM',
    deliveryAppointment: '02/16/2021 02:06 PM',
  },
  {
    route: '1',
    orderNumber: 'CUST352.0',
    fromLocationID: '40514-L&R Farms Inc. WM',
    toLocationID: '60514-L&R Farms Inc. WM',
    reqDeliveryDate: '02/10/2021',
    mustArriveByDate: '02/10/2021',
    actualDeliveryDate: '',
    pickupAppointment: '02/16/2021 02:06 PM',
    deliveryAppointment: '02/16/2021 02:06 PM',
  },

];
export interface PeriodicElement1 {
  finalorderNumber: string;
  finalmaterialName: string;
  finalorderQuantity: string;
  finalshippedQuantity: string;
  finalquantityDiff: string;
  finalshowOnBOL: string;
  finallocationName: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    finalorderNumber: 'CUST352.0',
    finalmaterialName: 'TL - 6411 - FIN',
    finalorderQuantity: '9900',
    finalshippedQuantity: '4950',
    finalquantityDiff: '- 4950',
    finalshowOnBOL: 'true',
    finallocationName: 'L & R Farms Inc.WM'
  },
  {
    finalorderNumber: 'CUST352.0',
    finalmaterialName: 'TL - 6411 - FIN',
    finalorderQuantity: '9900',
    finalshippedQuantity: '4950',
    finalquantityDiff: '- 4950',
    finalshowOnBOL: 'true',
    finallocationName: 'L & R Farms Inc.WM'
  },
];

export interface PeriodicElement2 {
  SNo: string;
  businessPartner: string;
  billingEntity: string;
  chargeType: string;
  contractAmount: string;
  modifiedAmount: string;
  uom: string;
  salesTax: string;
  autoAdded: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    SNo: '1',
    businessPartner: 'A E TRUCKING LLC',
    billingEntity: 'A E TRUCKING LLC',
    chargeType: 'Freight Linehaul-Inbound',
    contractAmount: '$0.00',
    modifiedAmount: '$54.00',
    uom: 'US Dollar Currency',
    salesTax: 'Non-Taxable',
    autoAdded: 'No'
  },

];


@Component({
  selector: 'app-shipment-show-detail',
  templateUrl: './shipment-show-detail.component.html',
  styleUrls: ['./shipment-show-detail.component.css']
})
export class ShipmentShowDetailComponent implements OnInit {
  panelOpenState111 = false;
  panelOpenState = false;

  SelectedShipmentsHistory: any = {};
  ViewingShipmentHistory: any = {};

  ShipmentDetailsHistory: any = {};
  ShippmentSalesOrdersHistory: any = [];
  SODTimings: any = [];
  FinalShippingOrdersDetails: any = [];

  CarrierPickupLocationID: number;
  CarrierPickupcidt: Date;
  CarrierPickupcodt: Date;
  CarrierPickupduration: string = '';
  CarrierStopDeliveryLocationID: number;
  CarrierStopDeliverycidt: any;
  CarrierStopDeliverycodt: any;
  CarrierStopDeliveryduration: string = '';
  FromlocationforCarrierDD: any;
  TolocationforCarrierDD: any;
  CarrierStopData: any = [];
  CarrierPickupData: any = [];
  Locationdetails: any;
  LocationsforDD: any = {};
  LocationsforDDFrom: any = {};
  apchargesDataHistory: any = [];
  apchargesDataTabHistory: any;
  OnreceiveHide: boolean = false;
  OnshipHide: boolean = false;

  ShimentppingOrdersDetails: any;
  DefaultPalletsDetails: any;
  TenderStatusTrackingDataHistory: any = [];
  StatusTrackingDataHistory: any = [];

 dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);

  @Input() buttonBar: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private shipmentManagementService: shipmentManagementService, private authenticationService: AuthService) { }

  SalesOrderColumns = ['route', 'orderNumber', 'fromLocationName', 'toLocationName', 'reqDeliveryDate',
    'mustArriveByDate', 'actualDeliveryDate', 'pickupAppointment', 'deliveryAppointment'];


  SalesOrderColumnsReplace = [
    'key_Route', 'key_OrderNumber', 'key_FromLocation',
    'key_ToLocation', 'key_ReqDeliveryDate', 'key_mabd',
    'key_ActualDeliveryDate', 'key_PickupAppointment',
    'key_DeliveryAppointment'
  ];
  // ShippingOrders = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  ShipmentReceiptColumns = [
    'finalorderNumber',
    'finalmaterialName',
    'finalorderQuantity',
    'finalshippedQuantity',
    'finalquantityDiff',
    'finalshowOnBOL',
    'finallocationName'
  ];

  ShipmentReceiptColumnsHeaderCheck = [
    'key_OrderNumber', 'key_Material', 'key_OrderQuantity',
    'key_Shipqunt', 'key_QuantityDiff', 'key_ShowOnBOL',
    'key_Shipto', 'key_Action'];

  ngOnInit(): void {
   
    this.SelectedShipmentsHistory = this.shipmentManagementService.ShipmentsforEditHistory;
    this.ViewingShipmentHistory = this.SelectedShipmentsHistory[0];
    this.GetShipmentHistory(this.ViewingShipmentHistory.shipmentNumber);
  }

  ngAfterViewInit() {
    //this.ShippingOrders.paginator = this.paginator;
    //this.ShippingOrders.sort = this.sort;
  }


  apchargesColumns = ['SNo', 'businessPartner', 'billingEntity', 'chargeType', 'contractAmount',
    'modifiedAmount', 'uom', 'salesTax', 'autoAdded'];

  masterToggle() {
    //this.isAllSelected() ?
    //  this.selection.clear() :
    //  this.ShippingOrders.data.forEach(row => this.selection.select(row));
  }

  GetShipmentHistory(shipmentnumber: any) {
    this.ViewingShipmentHistory = this.SelectedShipmentsHistory.find(x => x.shipmentNumber == shipmentnumber);
    this.shipmentManagementService.EditingShipmentHistory = this.ViewingShipmentHistory.shipmentNumber;
    this.shipmentManagementService.EditingShipmentID = this.ViewingShipmentHistory.id;
    this.GetShipmentDetailsHistory(this.ViewingShipmentHistory.id);

  }

  GetShipmentDetailsHistory(ShipmentId: number) {
    // this.Cleartimings()

    this.shipmentManagementService.GetShipmentDetailsHistory(ShipmentId)
      .subscribe(data => {
        this.ShipmentDetailsHistory = data.data[0];
        console.log(this.ShipmentDetailsHistory);
        this.GetShipmentSalesOrdersHistory(ShipmentId); // orders data 
        this.GetApchargesHistory(ShipmentId); // data from ApCharges for of specified shipemnt id
        this.GetShipmentSalesOrdersDetailsHistory(ShipmentId); // data from salesorderdetails for  Material Grid of specified shipment id
       
        this.GetTenderStatusTrackingHistory(ShipmentId);
       this.GetStatusTrackingHistory(ShipmentId);
        this.ShowHideToShipToReceive();
      });
  }

  GetShipmentSalesOrdersHistory(ShipmentId: number) {
      this.shipmentManagementService.GetShipmentSalesOrdersHistory(ShipmentId)
      .subscribe(data => {
        this.ShippmentSalesOrdersHistory = data.data;
        this.SetFromlocationforCarrierDD();
        this.SetTolocationforCarrierDD();
        this.ShippmentSalesOrdersHistory.forEach(order => {
          if (order.actualDeliveryDate != null) { order.actualDeliveryDate = this.ConverttoDate(order.actualDeliveryDate) }
          if (order.mustArriveByDate != null) { order.mustArriveByDate = this.ConverttoDate(order.mustArriveByDate) }
          if (order.reqDeliveryDate != null) { order.reqDeliveryDate = this.ConverttoDate(order.reqDeliveryDate) }
          if (order.pickupAppointment != null) { order.pickupAppointment = this.ConverttoDateTime(order.pickupAppointment) }
          if (order.deliveryAppointment != null) { order.deliveryAppointment = this.ConverttoDateTime(order.deliveryAppointment) }
        });
        this.GetShipmentOrderDetailsHistory(ShipmentId);
       // this.CheckIsNaftaCCIShow();
      });
  }

  GetShipmentSalesOrdersDetailsHistory(ShipmentId: number) {

    this.shipmentManagementService.GetShipmentSalesOrderDetailsHistory(ShipmentId)
      .subscribe(data => {
        debugger;
        var datas = data.data;
        console.log(data)
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
        console.log(this.FinalShippingOrdersDetails);
      })

      this.dataSource4 = new MatTableDataSource<FinalShipmentAdjustChargesModel>(this.FinalShippingOrdersDetails);
    
    });
  }

  GetShipmentOrderDetailsHistory(ShipmentId: number) {
    
    this.shipmentManagementService.GetShipmentOrderDetailsforSIDHistory(ShipmentId)
      .subscribe(result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
       
          this.SODTimings = result.data;
          console.log(this.SODTimings);
          this.CarrierPickupLocationID = this.FromlocationforCarrierDD[0].fromLocationID;
          this.CarrierStopDeliveryLocationID = this.TolocationforCarrierDD[0].toLocationID;
          this.InitializeCarrierPickupdata(this.SODTimings);
          this.InitializeCarrierStopdata(this.SODTimings);
          this.GetStartTimings();
          this.GetStopTimings();
          this.GetLocationDetails(this.SODTimings[0].toLocationId);
          console.log(this.CarrierStopDeliverycidt)
        }
      })

  }

  GetApchargesHistory(ShipmentId: number) {
    this.shipmentManagementService.GetApchargesHistory(ShipmentId)
      .subscribe(result => {
       
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          const apcharges = result.data;
          console.log(apcharges)
          if (apcharges != undefined && apcharges != null) {
            this.apchargesDataHistory = apcharges.map((apcharges, index) => { return { SNo: index + 1, ...apcharges } })
            this.apchargesDataHistory.forEach(row => { row.autoAdded = row.autoAdded ? "Yes" : "No"; })
          }
          else { this.apchargesDataHistory = []; }
          this.apchargesDataTabHistory = new MatTableDataSource<any>(this.apchargesDataHistory);
        }
      });
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

  GetLocationDetails(LocationId: number) {

    this.shipmentManagementService.getLocationDetails(LocationId)
      .subscribe(res => {
        if (res.message == "Success") {
          this.Locationdetails = res.data;
        }
      });
  }

  TimeDifferenceHrsMins(intime, outtime) {
    let diffMs = new Date(outtime).valueOf() - new Date(intime).valueOf();
    let diffHrs = (diffMs / 3600000).toFixed(2); // hours
    //let diffMins = Math.round((diffMs  % 3600000) / 60000); // minutes
    return diffHrs.toString();
  }

  SetFromlocationforCarrierDD() {
    this.CarrierPickupLocationID = 0;
    const fromlocations = this.ShippmentSalesOrdersHistory.map(({ fromLocationID, fromLocationName }) => {
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
    const tolocations = this.ShippmentSalesOrdersHistory.map(({ toLocationID, toLocationName }) => {
      return { toLocationID, toLocationName }
    });
    this.TolocationforCarrierDD = tolocations.filter((thing, index, self) =>
      index === self.findIndex((t) => (t.toLocationID === thing.toLocationID)))
    if (this.TolocationforCarrierDD != undefined && this.FromlocationforCarrierDD.length > 0) {
      this.CarrierStopDeliveryLocationID = this.TolocationforCarrierDD[0].toLocationID;
    }
    this.GetLocationDetails(tolocations[0].toLocationID);
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
      var datestring = ((month + 1) + "-" + date + "-" + year + " " + hour1 + ":" + minutes1 + " " + ampm)
      return datestring;
    }
    return null;
  }

  ConverttoDate(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();

      var datestring = ((month + 1) + "-" + date + "-" + year)
      return datestring;
    }
    return null;
  }

  ShowHideToShipToReceive() {
    if (this.ShipmentDetailsHistory.shipmentTypeCode.toLowerCase() == "customerreturn" || this.ShipmentDetailsHistory.shipmentTypeCode.toLowerCase() == "stocktransfer"
      || this.ShipmentDetailsHistory.shipmentTypeCode.toLowerCase() == "collections")
       {  this.OnshipHide = true; }
    else { this.OnreceiveHide = true;}
  }

  CheckIsNaftaCCIShow() {

    //this.buttonBar.disableAction('viewnafta');
    //this.buttonBar.disableAction('viewcci');
    //this.ShippingOrders.forEach(order => {
    //  if (order.documentPVFrom == 1) {
    //    this.buttonBar.enableAction('viewnafta');
    //    this.buttonBar.enableAction('viewcci');
    //    return;
    //  }
    //  if (order.documentPVTo == 1) {
    //    this.buttonBar.enableAction('viewnafta');
    //    this.buttonBar.enableAction('viewcci');
    //    return;
    //  }

    //  if (order.countryCodeFrom.toLowerCase == "mex" || order.CountryNameFrom.toLowerCase() == "mexico") {
    //    this.buttonBar.enableAction('viewnafta');
    //    this.buttonBar.enableAction('viewcci');
    //    return;
    //  }
    //  if (order.countryCodeFrom.toLowerCase == "can" || order.CountryNameFrom.toLowerCase() == "canada") {
    //    this.buttonBar.enableAction('viewnafta');
    //    this.buttonBar.enableAction('viewcci');
    //    return;
    //  }

    //})
  }

  GetStatusTrackingHistory(ShipmentId: number) {
    this.shipmentManagementService.GetStatusTrackingHistory(ShipmentId)
      .subscribe(data => {

        this.StatusTrackingDataHistory = data.data;
      });
  }
  GetTenderStatusTrackingHistory(ShipmentId: number) {
    this.shipmentManagementService.GetTenderStatusTrackingHistory(ShipmentId)
      .subscribe(data => {
        this.TenderStatusTrackingDataHistory = data.data;
      });
  }


}
