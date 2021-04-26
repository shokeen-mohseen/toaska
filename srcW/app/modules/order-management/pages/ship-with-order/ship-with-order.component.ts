import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderManagementService } from '../../../../core/services/order-management.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { OrderWorkbenchComponent } from '../order-workbench/order-workbench.component';


export interface PeriodicElement {
  RouteSequence: string;
  OrderNum: number;
  ShipToLocation: string;
  OrderQuantity: number;
  DeliverbyDate: string;
  LinkedtoOrder: string;
}
export interface PeriodicElementSO {
  RouteSequence: string;
  OrderNumber: number;
  ToLocation: string;
  OrderQuantity: number;
  RequestedDeliveryDate: string;
  LinkOrders: string;
  OrderId: number;
  ToLocationId: number;
}
export interface PeriodicElementLO {
  RouteSequence: string;
  OrderNumber: number;
  ToLocation: string;
  OrderQuantity: number;
  RequestedDeliveryDate: string;
  LinkOrders: string;
  OrderId: number;
  ShipWithOrderID: string;
  ToLocationId: number;
}
export interface Element {
  highlighted?: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-ship-with-order',
  templateUrl: './ship-with-order.component.html',
  styleUrls: ['./ship-with-order.component.css']
})
export class ShipWithOrderComponent implements OnInit {
  modalRef: NgbModalRef;
  LocationId: number;
  LocationDatalist = [];

  LocationData: any;
  GetLocationData = [];
  GetLocationId: any;
  SalesOrderDatalist = [];
  AllSalesOrderDatalist = [];
  data = [];
  LinkSalesOrderDatalist = [];
  LinkSalesOrderDatalistNew = [];
  LinkSalesOrderDatalistTemp = [];
  isOnLoad: boolean;
  tempArray = [];
  SelectedSalesOrderIdsToLink = [];
  ParentOrderId = 0;
  IsDisabledMoveUp = false;
  IsDisabledMoveDown = false;
  SelectedMoveUpDownRowIndex = 0;
  tempArrayMoveUpDown = [];
  selectedOrderId = 0;
  fromLocationId: string;
  toLocationId: string;

  tempLinkOrderData = [
    {
      actualDeliveryDate: null,
      additionalInstructionComment: null,
      allocatedFreightCharge: null,
      archargesSentToAccounting: null,
      billToCustomerId: null,
      billToOrgAddressId: null,
      carrier: "Transplace",
      carrierId: null,
      chargeRatePerMile: null,
      clientID: null,
      comments: null,
      cpufreight: null,
      createDateTimeBrowser: "0001-01-01T00:00:00",
      createDateTimeServer: null,
      createdBy: null,
      creditHoldFlag: null,
      customerMiles: null,
      customerPercent: null,
      equipmentTypeId: null,
      filterOn: null,
      freightModeId: null,
      fromAddressId: null,
      fromBusinessPartnerContractId: null,
      fromCustomerContractId: null,
      fromLocation: "Opal Foods School Rd",
      fromLocationId: 21973,
      hasClaim: false,
      headerHoldFlag: null,
      hovered: true,
      id: 0,
      invoiceNo: "Invoice23456",
      shipWithOrderID: 1001,
      isActive: false,
      isDeleted: false,
      isDiverted: null,
      loadingComment: null,
      locationType: null,
      materialDescription: "TL-64289",
      mustArriveByDate: "2020-11-11T18:30:00",
      needToSendNotification: null,
      orderAmount: 1130,
      orderCondition: "Shipment Planning",
      orderConditionId: null,
      orderDate: "0001-01-01T00:00:00",
      orderEntryDate: "0001-01-01T00:00:00",
      orderId: 201,
      orderNumber: "CUST201",
      orderStatus: "Open Order Needs To Be Completed",
      orderStatusId: null,
      orderType: "Customer",
      orderTypeId: null,
      orderVersionNumber: null,
      overrideCreditHold: null,
      pageNo: 0,
      pageSize: 0,
      parentSalesOrderId: null,
      purchaseOrderNumber: "04112020Test",
      referenceNo: null,
      requestedDeliveryDate: "2020-11-11T18:30:00",
      responseMessage: "Success",
      responseMessageCode: 0,
      roleName: null,
      routeSequence: 1,
      rowVersion: null,
      salesManager: "Ali Mohammad",
      scheduledShipDate: "2020-11-06T00:00:00",
      shipFromLocationContactId: null,
      shipToCustomerContactAddressId: null,
      shipToCustomerId: null,
      shipToLocationContactId: null,
      shipmentFlowId: null,
      shipmentId: null,
      shipmentNumber: "CUST456052",
      shipmentQuantity: 1130,
      showOnBOL: true,
      sortColumn: null,
      sortOrder: null,
      source: null,
      sourceSystemID: null,
      spanishLoadingComment: null,
      spanishShipmentComment: null,
      spanishTransportationComment: null,
      statusDateTime: null,
      supressEmailConfirmation: null,
      toAddressId: null,
      toBusinessPartnerContractId: null,
      toCustomerContractId: null,
      toLocation: "Ocean Mist-Oxnard",
      toLocationId: null,
      totalEquivalentPallets: null,
      totalOrderQuantity: null,
      totalOrderQuantityUomid: null,
      totalWeight: null,
      totalWeightUomid: null,
      trailerNumber: null,
      trailerSealNumber: null,
      transplaceDeliveryComment: null,
      transplaceDeliveryCommentSpanish: null,
      transplaceOrderComment: null,
      transplaceOrderCommentSpanish: null,
      transportationComment: null,
      updateDateTimeBrowser: null,
      updateDateTimeServer: null,
      updatedBy: null,
      userId: 0,
      voiceNumber: null
    },
    {
      actualDeliveryDate: null,
      additionalInstructionComment: null,
      allocatedFreightCharge: null,
      archargesSentToAccounting: null,
      billToCustomerId: null,
      billToOrgAddressId: null,
      carrier: "Transplace",
      carrierId: null,
      chargeRatePerMile: null,
      clientID: null,
      comments: null,
      cpufreight: null,
      createDateTimeBrowser: "0001-01-01T00:00:00",
      createDateTimeServer: null,
      createdBy: null,
      creditHoldFlag: null,
      customerMiles: null,
      customerPercent: null,
      equipmentTypeId: null,
      filterOn: null,
      freightModeId: null,
      fromAddressId: null,
      fromBusinessPartnerContractId: null,
      fromCustomerContractId: null,
      fromLocation: "Opal Foods School Rd",
      fromLocationId: 21973,
      hasClaim: false,
      headerHoldFlag: null,
      hovered: true,
      id: 0,
      invoiceNo: "Invoice23456",
      shipWithOrderID: 1002,
      isActive: false,
      isDeleted: false,
      isDiverted: null,
      loadingComment: null,
      locationType: null,
      materialDescription: "TL-64289",
      mustArriveByDate: "2020-11-11T18:30:00",
      needToSendNotification: null,
      orderAmount: 1130,
      orderCondition: "Shipment Planning",
      orderConditionId: null,
      orderDate: "0001-01-01T00:00:00",
      orderEntryDate: "0001-01-01T00:00:00",
      orderId: 202,
      orderNumber: "CUST202",
      orderStatus: "Open Order Needs To Be Completed",
      orderStatusId: null,
      orderType: "Customer",
      orderTypeId: null,
      orderVersionNumber: null,
      overrideCreditHold: null,
      pageNo: 0,
      pageSize: 0,
      parentSalesOrderId: null,
      purchaseOrderNumber: "04112020Test",
      referenceNo: null,
      requestedDeliveryDate: "2020-11-11T18:30:00",
      responseMessage: "Success",
      responseMessageCode: 0,
      roleName: null,
      routeSequence: 2,
      rowVersion: null,
      salesManager: "Ali Mohammad",
      scheduledShipDate: "2020-11-06T00:00:00",
      shipFromLocationContactId: null,
      shipToCustomerContactAddressId: null,
      shipToCustomerId: null,
      shipToLocationContactId: null,
      shipmentFlowId: null,
      shipmentId: null,
      shipmentNumber: "CUST456052",
      shipmentQuantity: 1130,
      showOnBOL: true,
      sortColumn: null,
      sortOrder: null,
      source: null,
      sourceSystemID: null,
      spanishLoadingComment: null,
      spanishShipmentComment: null,
      spanishTransportationComment: null,
      statusDateTime: null,
      supressEmailConfirmation: null,
      toAddressId: null,
      toBusinessPartnerContractId: null,
      toCustomerContractId: null,
      toLocation: "Ocean Mist-Oxnard",
      toLocationId: null,
      totalEquivalentPallets: null,
      totalOrderQuantity: null,
      totalOrderQuantityUomid: null,
      totalWeight: null,
      totalWeightUomid: null,
      trailerNumber: null,
      trailerSealNumber: null,
      transplaceDeliveryComment: null,
      transplaceDeliveryCommentSpanish: null,
      transplaceOrderComment: null,
      transplaceOrderCommentSpanish: null,
      transportationComment: null,
      updateDateTimeBrowser: null,
      updateDateTimeServer: null,
      updatedBy: null,
      userId: 0,
      voiceNumber: null
    },
    {
      actualDeliveryDate: null,
      additionalInstructionComment: null,
      allocatedFreightCharge: null,
      archargesSentToAccounting: null,
      billToCustomerId: null,
      billToOrgAddressId: null,
      carrier: "Transplace",
      carrierId: null,
      chargeRatePerMile: null,
      clientID: null,
      comments: null,
      cpufreight: null,
      createDateTimeBrowser: "0001-01-01T00:00:00",
      createDateTimeServer: null,
      createdBy: null,
      creditHoldFlag: null,
      customerMiles: null,
      customerPercent: null,
      equipmentTypeId: null,
      filterOn: null,
      freightModeId: null,
      fromAddressId: null,
      fromBusinessPartnerContractId: null,
      fromCustomerContractId: null,
      fromLocation: "Opal Foods School Rd",
      fromLocationId: 21973,
      hasClaim: false,
      headerHoldFlag: null,
      hovered: true,
      id: 0,
      invoiceNo: "Invoice23456",
      shipWithOrderID: 1003,
      isActive: false,
      isDeleted: false,
      isDiverted: null,
      loadingComment: null,
      locationType: null,
      materialDescription: "TL-64289",
      mustArriveByDate: "2020-11-11T18:30:00",
      needToSendNotification: null,
      orderAmount: 1130,
      orderCondition: "Shipment Planning",
      orderConditionId: null,
      orderDate: "0001-01-01T00:00:00",
      orderEntryDate: "0001-01-01T00:00:00",
      orderId: 204,
      orderNumber: "CUST204",
      orderStatus: "Open Order Needs To Be Completed",
      orderStatusId: null,
      orderType: "Customer",
      orderTypeId: null,
      orderVersionNumber: null,
      overrideCreditHold: null,
      pageNo: 0,
      pageSize: 0,
      parentSalesOrderId: null,
      purchaseOrderNumber: "04112020Test",
      referenceNo: null,
      requestedDeliveryDate: "2020-11-11T18:30:00",
      responseMessage: "Success",
      responseMessageCode: 0,
      roleName: null,
      routeSequence: 3,
      rowVersion: null,
      salesManager: "Ali Mohammad",
      scheduledShipDate: "2020-11-06T00:00:00",
      shipFromLocationContactId: null,
      shipToCustomerContactAddressId: null,
      shipToCustomerId: null,
      shipToLocationContactId: null,
      shipmentFlowId: null,
      shipmentId: null,
      shipmentNumber: "CUST456052",
      shipmentQuantity: 1130,
      showOnBOL: true,
      sortColumn: null,
      sortOrder: null,
      source: null,
      sourceSystemID: null,
      spanishLoadingComment: null,
      spanishShipmentComment: null,
      spanishTransportationComment: null,
      statusDateTime: null,
      supressEmailConfirmation: null,
      toAddressId: null,
      toBusinessPartnerContractId: null,
      toCustomerContractId: null,
      toLocation: "Ocean Mist-Oxnard",
      toLocationId: null,
      totalEquivalentPallets: null,
      totalOrderQuantity: null,
      totalOrderQuantityUomid: null,
      totalWeight: null,
      totalWeightUomid: null,
      trailerNumber: null,
      trailerSealNumber: null,
      transplaceDeliveryComment: null,
      transplaceDeliveryCommentSpanish: null,
      transplaceOrderComment: null,
      transplaceOrderCommentSpanish: null,
      transportationComment: null,
      updateDateTimeBrowser: null,
      updateDateTimeServer: null,
      updatedBy: null,
      userId: 0,
      voiceNumber: null
    },
  ];

  ELEMENT_DATASO: PeriodicElementSO[] = [];
  ELEMENT_DATALO: PeriodicElementLO[] = [];
  constructor(private router: Router, public activeModal: NgbActiveModal, private orderManagementService: OrderManagementService, private authservices: AuthService, private toastrService: ToastrService) { }

  ngOnInit() {
    var orderType = localStorage.getItem('OrderType');
    var orderStatus = localStorage.getItem('OrderStatus');

    if ((orderType.trim().toLowerCase() == "customer" || orderType.trim().toLowerCase() == "cpu order" || orderType.trim().toLowerCase() == "stock transfer" || orderType.trim().toLowerCase() == "collections")
      && (orderStatus.trim().toLowerCase() == "open order needs to be completed")) {

      this.isOnLoad = true;
      this.LinkSalesOrderDatalistNew = [];
      this.LocationId = -1;
      var SelectedOrderData = [];
      SelectedOrderData.push(JSON.parse(localStorage.getItem('Orderdata')));

      this.fromLocationId = localStorage.getItem('FromLocationId');
      this.toLocationId = localStorage.getItem('ToLocationId');
      if (localStorage.getItem('SelectedTab').toLocaleLowerCase().trim() == 'outbound') {
        if (this.fromLocationId == null || this.fromLocationId == "null" || this.fromLocationId == "") {
          this.toastrService.error("This record does not have FromLocation!");
          this.activeModal.close();
          return false;
        }
        else {
          //new to bind first grid data
          this.ParentOrderId = parseInt(localStorage.getItem('SelectedOrderId'));
          this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));
          //to bind second grid data
          //don;t need to bind dropdown on load
          this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
        }
      }
      else if (localStorage.getItem('SelectedTab').toLocaleLowerCase().trim() == 'inbound') {
        if (this.toLocationId == null || this.toLocationId == "null" || this.toLocationId == "" || this.toLocationId == "undefined") {
          this.toastrService.error("This record does not have ToLocation!");
          this.activeModal.close();
          return false;
        }
        else {

          //new to bind first grid data
          this.ParentOrderId = parseInt(localStorage.getItem('SelectedOrderId'));
          this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));
          //to bind second grid data
          //don;t need to bind dropdown on load
          this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
        }
      }
    }
    else {
      this.activeModal.close();
      return false;
    }
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      if (index != -1) {
        //this.selection = new SelectionModel<PeriodicElement>(false, []);

        if (this.isOnLoad == true) {
          this.tempArray = this.LinkSalesOrderDatalistTemp.map(o => {
            return o;
          });
        }

        this.isOnLoad = false;
        this.data.splice(index, 1)
        this.SalesOrderDatalist = [];
        this.SalesOrderDatalist = this.data.map(o => {
          return o;
        });

        var k = 0;
        for (k = 0; k < this.selection.selected.length; k++) {
          if (!this.tempArray.includes(this.selection.selected[k])) {
            this.tempArray.push(this.selection.selected[k]);
          }
        }
        this.LinkSalesOrderDatalistNew = this.tempArray.map(o => {
          return o;
        });

        // this.selection = new SelectionModel<PeriodicElement>(false, []);

        //for multiple location in ddl
        if (this.LocationId != -1 && this.LocationId != 0 && this.LocationId != undefined) {
          this.GetLocationData = [];
          var i = 0;
          for (i = 0; i < this.SalesOrderDatalist.length; i++) {
            if (this.SalesOrderDatalist[i].ToLocationId == this.LocationId)
              this.GetLocationData.push(this.SalesOrderDatalist[i]);
          }

          this.SalesOrderDatalist = [];
          this.SalesOrderDatalist = this.GetLocationData.map(o => {
            return o;
          });
        }

        //add selected sales order ids to list to link data
        this.SelectedSalesOrderIdsToLink = [];
        for (i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
          if (!this.SelectedSalesOrderIdsToLink.includes(this.LinkSalesOrderDatalistNew[i].OrderId)) {
            this.SelectedSalesOrderIdsToLink.push(this.LinkSalesOrderDatalistNew[i].OrderId);
          }
        }

      }
    });
    //to uncheck selected row in second table
    this.selection.clear();

    // this.selection = new SelectionModel<PeriodicElement>(false, []);   
    //for (var i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
    //  this.selection.deselect(this.LinkSalesOrderDatalistNew[i])
    //}
    // this.selection.deselect(item);
    //this.selection.selected.values = null;
  }



  GetAllShipToDataByOrderIDAndFromID(orderID, clientId, selectedTab) {
    this.orderManagementService.GetAllShipToDataByOrderIDAndFromID(orderID, clientId, selectedTab)
      .subscribe(
        result => {
          this.SalesOrderDatalist = [];
          this.ELEMENT_DATASO = [];
          // this.SalesOrderDatalist = result.data;         
          result.data.forEach((value, index) => {
            this.ELEMENT_DATASO.push({
              RouteSequence: value.routeSequence,
              OrderNumber: value.orderNumber,
              ToLocation: value.toLocation,
              OrderQuantity: value.totalOrderQuantity,
              RequestedDeliveryDate: value.requestedDeliveryDate,
              LinkOrders: value.linkOrders,
              OrderId: value.orderId,
              ToLocationId: value.toLocationId
            })
          })

          this.SalesOrderDatalist = this.ELEMENT_DATASO;
          this.AllSalesOrderDatalist = this.SalesOrderDatalist;
          this.data = Object.assign(this.ELEMENT_DATASO);
          if (this.SalesOrderDatalist.length > 0) {
            var flags = [], l = this.SalesOrderDatalist.length, i;
            for (i = 0; i < l; i++) {
              if (flags[this.SalesOrderDatalist[i].ToLocation]) continue;
              flags[this.SalesOrderDatalist[i].ToLocation] = true;
              this.LocationDatalist.push({ name: this.SalesOrderDatalist[i].ToLocation, id: this.SalesOrderDatalist[i].ToLocationId });
            }
          }

        }
      );
  }

  selectShipToLocation(event) {
    //var cc=event.target['options'][event.target['options'].selectedIndex].text;

    if (event != null) {
      var a = parseInt(event.target['options'][event.target['options'].selectedIndex].value);// parseInt(event);
      var dd = []
      this.LocationId = a;

      if (this.AllSalesOrderDatalist.length > 0) {
        var l = this.AllSalesOrderDatalist.length, i;
        for (i = 0; i < l; i++) {

          if (parseInt(this.AllSalesOrderDatalist[i].ToLocationId) == a)
            dd.push(this.AllSalesOrderDatalist[i]);
        }
      }
      this.SalesOrderDatalist = dd;
    }

    //if (event != 0) {
    //  var a = parseInt(event);
    //  var dd = []
    //  this.LocationId = a;

    //  if (this.AllSalesOrderDatalist.length > 0) {
    //    var l = this.AllSalesOrderDatalist.length, i;
    //    for (i = 0; i < l; i++) {

    //      if (parseInt(this.AllSalesOrderDatalist[i].ToLocationId) == a)
    //        dd.push(this.AllSalesOrderDatalist[i]);
    //    }
    //  }
    //  this.SalesOrderDatalist = dd;
    //}
  }

  //material table code
  displayedColumns = ['selectRow', 'RouteSequence', 'OrderNum', 'ShipToLocation', 'OrderQuantity', 'DeliverbyDate', 'LinkedtoOrder'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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

  LinkOrderSave() {   
    if (this.SelectedSalesOrderIdsToLink.length <= 0) {
      //this.toastrService.error("Please select order first to save link order");
      //return false;
      this.tempArray = [];
     // this.LinkSalesOrderDatalistNew = [];
      this.isOnLoad = true;
      //add selected sales order ids to list to link data
      var i = 0;
      this.SelectedSalesOrderIdsToLink = [];
      for (i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
        if (!this.SelectedSalesOrderIdsToLink.includes(this.LinkSalesOrderDatalistNew[i].OrderId)) {
          this.SelectedSalesOrderIdsToLink.push(this.LinkSalesOrderDatalistNew[i].OrderId);
        }
      }
    }    

    this.orderManagementService.SaveLinkOrder(this.SelectedSalesOrderIdsToLink, this.ParentOrderId,localStorage.getItem('SelectedTab')).subscribe(data => {
      if (data.message == "Success")
        this.toastrService.success("Orders Save successfully.");

      //to refresh first grid
      this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));

      //to refresh second grid
      this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
      // this.getSalesOrderDataList();
      this.SelectedSalesOrderIdsToLink = [];
    });
  }

  selectedvalue(row, event: Event, checked: boolean) {
    var length = 0;
    length = this.LinkSalesOrderDatalistNew.length - 1;
    var k = 0;
    for (k = 0; k <= this.LinkSalesOrderDatalistNew.length - 1; k++) {
      if (this.LinkSalesOrderDatalistNew[k].OrderId == row.OrderId) {
        this.SelectedMoveUpDownRowIndex = k;
        if (length == k) {
          //move down Disabled
          this.IsDisabledMoveDown = true;
        } else {
          //move down Enable
          this.IsDisabledMoveDown = false;
        }
        if (k == 0) {
          //move up Disabled
          this.IsDisabledMoveUp = true;
        } else {
          //move up Enable
          this.IsDisabledMoveUp = false;
        }
      }
    }

  }

  MoveUp() {
    if (this.SelectedMoveUpDownRowIndex != -1) {
      var SwapWithRowIndex = 0;
      SwapWithRowIndex = this.SelectedMoveUpDownRowIndex - 1;

      var OrderId = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].OrderId;
      var SwapWithOrderId = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].OrderId;
      var RouteSequence = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].RouteSequence;
      var SwapWithRouteSequence = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].RouteSequence;
      var ShipWithOrderID = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].ShipWithOrderID;
      var SwapWithShipWithOrderID = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].ShipWithOrderID;

      this.tempArrayMoveUpDown = this.LinkSalesOrderDatalistNew.map(o => {
        return o;
      });

      var tmp = this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex];
      this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex] = this.tempArrayMoveUpDown[SwapWithRowIndex];
      this.tempArrayMoveUpDown[SwapWithRowIndex] = tmp;

      this.LinkSalesOrderDatalistNew = this.tempArrayMoveUpDown.map(o => {
        return o;
      });

      //add selected sales order ids to list to link data
      this.SelectedSalesOrderIdsToLink = [];
      for (var i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
        if (!this.SelectedSalesOrderIdsToLink.includes(this.LinkSalesOrderDatalistNew[i].OrderId)) {
          this.SelectedSalesOrderIdsToLink.push(this.LinkSalesOrderDatalistNew[i].OrderId);
        }
      }

      this.MoveUpDownBtnEbableDisable(SwapWithRowIndex);
      this.SelectedMoveUpDownRowIndex = -1;

      this.orderManagementService.MoveUpDownOrderRouteSequence(OrderId, SwapWithOrderId, RouteSequence, SwapWithRouteSequence, ShipWithOrderID, SwapWithShipWithOrderID).subscribe(data => {
        if (data.message == "Success") {
          //to refresh second grid
          this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
        }
      });
    }
  }

  MoveDown() {
    if (this.SelectedMoveUpDownRowIndex != -1) {
      var SwapWithRowIndex = 0;
      SwapWithRowIndex = this.SelectedMoveUpDownRowIndex + 1;

      var OrderId = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].OrderId;
      var SwapWithOrderId = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].OrderId;
      var RouteSequence = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].RouteSequence;
      var SwapWithRouteSequence = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].RouteSequence;
      var ShipWithOrderID = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex].ShipWithOrderID;
      var SwapWithShipWithOrderID = this.LinkSalesOrderDatalistNew[SwapWithRowIndex].ShipWithOrderID;

      this.tempArrayMoveUpDown = this.LinkSalesOrderDatalistNew.map(o => {
        return o;
      });

      var tmp = this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex];
      this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex] = this.tempArrayMoveUpDown[SwapWithRowIndex];
      this.tempArrayMoveUpDown[SwapWithRowIndex] = tmp;

      this.LinkSalesOrderDatalistNew = this.tempArrayMoveUpDown.map(o => {
        return o;
      });

      //add selected sales order ids to list to link data
      this.SelectedSalesOrderIdsToLink = [];
      for (var i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
        if (!this.SelectedSalesOrderIdsToLink.includes(this.LinkSalesOrderDatalistNew[i].OrderId)) {
          this.SelectedSalesOrderIdsToLink.push(this.LinkSalesOrderDatalistNew[i].OrderId);
        }
      }

      this.MoveUpDownBtnEbableDisable(SwapWithRowIndex);
      this.SelectedMoveUpDownRowIndex = -1;

      this.orderManagementService.MoveUpDownOrderRouteSequence(OrderId, SwapWithOrderId, RouteSequence, SwapWithRouteSequence, ShipWithOrderID, SwapWithShipWithOrderID).subscribe(data => {
        if (data.message == "Success") {
          //to refresh second grid
          this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
        }
      });
    }
  }

  RemoveLinkOrder() {
    var removeItem = this.LinkSalesOrderDatalistNew[this.SelectedMoveUpDownRowIndex];
    // if (this.selectedOrderId != removeItem.orderId) {
    if (removeItem != null && removeItem != "") {

      var orderId = removeItem.OrderId;
      var shipWithOrderID = removeItem.ShipWithOrderID;

      this.tempArray.splice(this.SelectedMoveUpDownRowIndex, 1);

      this.LinkSalesOrderDatalistNew.splice(this.SelectedMoveUpDownRowIndex, 1);
      var tempFirstGridArray = this.LinkSalesOrderDatalistNew;
      this.LinkSalesOrderDatalistNew = [];
      this.LinkSalesOrderDatalistNew = tempFirstGridArray.map(o => {
        return o;
      });

      //add item in first grid 
      var temparray = this.SalesOrderDatalist;     
      var k = 0;
      var isRecordExist = false;
      for (k = 0; k < temparray.length; k++) {
        if (temparray[k].OrderId == removeItem.OrderId) {
          isRecordExist = true;
          break;
        }
      }
      if (isRecordExist == false)
        temparray.push(removeItem);

      this.SalesOrderDatalist = [];
      this.SalesOrderDatalist = temparray.map(o => {
        return o;
      });

      this.orderManagementService.RemoveSelectedLinkOrder(orderId, shipWithOrderID,localStorage.getItem('SelectedTab')).subscribe(data => {
        if (data.message == "Success") {
          //to refresh second grid
          //// this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
        }
      });
    }
    //this.selection = new SelectionModel<PeriodicElement>(false, []);
    // this.selection.deselect(removeItem);
  }

  GetOrderDataToLinkTabWise(tabName: any) {
    var OrderId = parseInt(localStorage.getItem('SelectedOrderId'));//this.selectedOrderId;
    var ClientId = parseInt(localStorage.clientId);
    var InboundOutbound = tabName;

    this.orderManagementService.GetOrderDataToLinkOrder(OrderId, ClientId, InboundOutbound)
      .subscribe(result => {
        this.LinkSalesOrderDatalistTemp = [];
        this.LinkSalesOrderDatalistNew = [];
       
        this.ELEMENT_DATALO = [];
        result.data.forEach((value, index) => {
          this.ELEMENT_DATALO.push({
            RouteSequence: value.routeSequence,
            OrderNumber: value.orderNumber,
            ToLocation: value.toLocation,
            OrderQuantity: value.totalOrderQuantity,
            RequestedDeliveryDate: value.requestedDeliveryDate,
            LinkOrders: value.linkOrders,
            OrderId: value.orderId,
            ShipWithOrderID: value.shipWithOrderID,
            ToLocationId: value.toLocationId
          })
        })
        if (this.ELEMENT_DATALO.length > 0) {
          if (this.ELEMENT_DATALO[0].LinkOrders != null && this.ELEMENT_DATALO[0].LinkOrders != "" && this.ELEMENT_DATALO[0].LinkOrders != "undefined") {
            // if (this.isOnLoad == true)
            this.LinkSalesOrderDatalistTemp = this.ELEMENT_DATALO;
            this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;
            //this.isOnLoad = false;
            //else

          }
          else {
            if (this.isOnLoad == true)
              this.LinkSalesOrderDatalistTemp = this.ELEMENT_DATALO;
            else
              this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;
          }
        }



        //this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;

        ////if (this.isOnLoad == true)
        ////  this.LinkSalesOrderDatalistTemp = this.ELEMENT_DATALO;
        ////else
        ////  this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;

      }
      );
  }

  MoveUpDownBtnEbableDisable(index: number) {
    var length = 0;
    length = this.LinkSalesOrderDatalistNew.length - 1;
    var k = 0;
    for (k = 0; k <= this.LinkSalesOrderDatalistNew.length - 1; k++) {
      if (this.LinkSalesOrderDatalistNew[k].OrderId == this.LinkSalesOrderDatalistNew[index].OrderId) {
        this.SelectedMoveUpDownRowIndex = k;
        if (length == k) {
          //move down Disabled
          this.IsDisabledMoveDown = true;
        } else {
          //move down Enable
          this.IsDisabledMoveDown = false;
        }
        if (k == 0) {
          //move up Disabled
          this.IsDisabledMoveUp = true;
        } else {
          //move up Enable
          this.IsDisabledMoveUp = false;
        }
      }
    }
  }
}

