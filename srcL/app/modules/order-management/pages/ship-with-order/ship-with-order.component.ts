import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { projectkey } from '../../../../../environments/projectkey';


export interface PeriodicElement {
  RouteSequence: string;
  OrderNum: number;
  ShipToLocation: string;
  OrderQuantity: number;
  DeliverbyDate: string;
  LinkedtoOrder: string;
  OrderId: number;
}
export interface PeriodicElementSO {
  RouteSequence: string;
  OrderNumber: number;
  ToLocation: string;
  OrderQuantity: string;
  RequestedDeliveryDate: string;
  LinkOrders: string;
  OrderId: number;
  ToLocationId: number;
  OrderVersionNumber: number;
}
export interface PeriodicElementLO {
  RouteSequence: string;
  OrderNumber: number;
  ToLocation: string;
  OrderQuantity: string;
  RequestedDeliveryDate: string;
  LinkOrders: string;
  OrderId: number;
  ShipWithOrderID: string;
  ToLocationId: number;
  OrderVersionNumber: number;
}
export interface Element {
  highlighted?: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [
];
const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})
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
  OrderNumber: string;
  SalectedOrderId: number;
  MainItem = [];
  shipWithHasReadOnlyAccess: boolean = false;
  OrderType: string;
  IsStockNotAllowToLink: boolean = false;
  IsCollectionsNotAllowToLink: boolean = false;
  IsCustomerNotAllowToLink: boolean = false;


  tempLinkOrderData = [
  ];

  ELEMENT_DATASO: PeriodicElementSO[] = [];
  ELEMENT_DATALO: PeriodicElementLO[] = [];
  constructor(private router: Router, public activeModal: NgbActiveModal, private orderManagementService: OrderManagementService, private authservices: AuthService, private toastrService: ToastrService) { }

  ngOnInit() {
    var orderType = localStorage.getItem('OrderType');
    this.OrderType = orderType;
    var orderStatus = localStorage.getItem('OrderStatus');
    this.OrderNumber = localStorage.getItem('OrderNumber');
    this.SalectedOrderId = Number(localStorage.getItem('SelectedOrderId'));

    this.buttonPermission();
    // debugger;
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
          this.toastrService.error("This order does not have From Location");
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
          this.toastrService.error("This order does not have To-Location");
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
      this.toastrService.error("This order can not be linked.");
      return false;
    }
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      if (index != -1) {

        if (this.isOnLoad == true) {
          this.tempArray = this.LinkSalesOrderDatalistTemp.map(o => {
            return o;
          });
          this.MainItem = this.LinkSalesOrderDatalistTemp.find(x => x.OrderId === this.SalectedOrderId);
        }

        //add link data but not duplicat      
        var removeItem = this.tempArray.find(x => x.OrderId === item.OrderId);
        if (removeItem == null || removeItem == "") {
          this.tempArray.push(this.data[index]);
        }

        if (this.tempArray.length == 1) {
          var FindMainItem = this.tempArray.find(x => x.OrderId === this.SalectedOrderId);
          if (FindMainItem == null || FindMainItem == "")
            this.tempArray.unshift(this.MainItem);
        }

        this.isOnLoad = false;
        this.data.splice(index, 1)
        this.SalesOrderDatalist = [];
        this.SalesOrderDatalist = this.data.map(o => {
          return o;
        });

        //to make route sequence
        var j = 0;
        for (j = 0; j < this.tempArray.length; j++) {
          this.tempArray[j].RouteSequence = j + 1;
        }

        this.LinkSalesOrderDatalistNew = this.tempArray.map(o => {
          return o;
        });

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
  }



  GetAllShipToDataByOrderIDAndFromID(orderID, clientId, selectedTab) {
    this.orderManagementService.GetAllShipToDataByOrderIDAndFromID(orderID, clientId, selectedTab)
      .subscribe(
        result => {
          this.IsStockNotAllowToLink = false;
          this.IsCollectionsNotAllowToLink = false;
          this.IsCustomerNotAllowToLink = false;
          this.SalesOrderDatalist = [];
          this.ELEMENT_DATASO = [];
          result.data.forEach((value, index) => {
            this.ELEMENT_DATASO.push({
              RouteSequence: value.routeSequence,
              OrderNumber: value.orderNumber,
              ToLocation: value.toLocation,
              OrderQuantity: formatter.format(value.totalOrderQuantity),
              RequestedDeliveryDate: value.requestedDeliveryDate != null ? this.setDateMMddyyyy(value.requestedDeliveryDate) : null, //value.requestedDeliveryDate,
              LinkOrders: value.linkOrders,
              OrderId: value.orderId,
              ToLocationId: value.toLocationId,
              OrderVersionNumber: value.orderVersionNumber
            })
          })
          this.LocationDatalist = [];
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
          if (result.data.length == 0) {
            if (this.OrderType.trim() == "Stock Transfer") {
              this.IsStockNotAllowToLink = true;
            } else if (this.OrderType.trim() == "Collections") {
              this.IsCollectionsNotAllowToLink = true;
            } else if (this.OrderType.trim() == "Customer" || this.OrderType.trim() == "CPU Order") {
              this.IsCustomerNotAllowToLink = true;
            }

          }
        }
      );
  }

  selectShipToLocation(event) {

    if (event != null) {
      var a = parseInt(event.target['options'][event.target['options'].selectedIndex].value);
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
  }

  //material table code
  displayedColumns = ['selectRow', 'RouteSequence', 'OrderNum', 'ShipToLocation', 'OrderQuantity', 'DeliverbyDate', 'LinkedtoOrder'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selection1 = new SelectionModel<PeriodicElement>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  orderworkbenchInstance: OrderWorkbenchComponent;

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
    const numRows = this.SalesOrderDatalist.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.SalesOrderDatalist.forEach(row => this.selection.select(row));
  }
  isAllSelected1() {
    const numSelected = this.selection.selected.length;
    const numRows = this.LinkSalesOrderDatalistNew.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection.clear() :
      this.LinkSalesOrderDatalistNew.forEach(row => this.selection.select(row));
  }
  setDateMMddyyyy(date: Date) {
    date = new Date(date);
    return `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
  }

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  LinkOrderSave() {
    if (this.SelectedSalesOrderIdsToLink.length <= 0) {
      this.tempArray = [];
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

    this.orderManagementService.SaveLinkOrder(this.SelectedSalesOrderIdsToLink, this.ParentOrderId, localStorage.getItem('SelectedTab')).subscribe(data => {
      if (data.message == "Success")
        this.toastrService.success("Orders saved successfully.");
      //to refresh first grid
      this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));

      //to refresh second grid
      this.GetOrderDataToLinkTabWise(localStorage.getItem('SelectedTab'));
      this.SelectedSalesOrderIdsToLink = [];

      //To refresh order workbench grid
      if (this.orderworkbenchInstance != null && this.orderworkbenchInstance != undefined)
        this.orderworkbenchInstance.getSalesOrderDataList(localStorage.getItem('SelectedTab'));
    });
  }

  selectedvalue(row, event: Event, checked: boolean) {
    if (this.LinkSalesOrderDatalistNew != undefined && this.LinkSalesOrderDatalistNew != null) {
      this.LinkSalesOrderDatalistNew.forEach(irow => {
        if (irow.OrderId == row.OrderId) {
          this.selection1.toggle(irow);
        }
      });
    }

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
      this.tempArrayMoveUpDown = this.LinkSalesOrderDatalistNew.map(o => {
        return o;
      });

      var tmp = this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex];
      this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex] = this.tempArrayMoveUpDown[SwapWithRowIndex];
      this.tempArrayMoveUpDown[SwapWithRowIndex] = tmp;

      //to make route sequence
      var j = 0;
      for (j = 0; j < this.tempArrayMoveUpDown.length; j++) {
        this.tempArrayMoveUpDown[j].RouteSequence = j + 1;
      }

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

      this.selection1.clear();
      if (this.LinkSalesOrderDatalistNew.length == 1) {
        //Disabled all
        this.IsDisabledMoveDown = true;
        this.IsDisabledMoveUp = true;
      } else if (this.LinkSalesOrderDatalistNew.length == 2) {
        //Enable all
        this.IsDisabledMoveDown = false;
        this.IsDisabledMoveUp = false;
      }
    }
  }

  MoveDown() {
    if (this.SelectedMoveUpDownRowIndex != -1) {
      var SwapWithRowIndex = 0;
      SwapWithRowIndex = this.SelectedMoveUpDownRowIndex + 1;
      this.tempArrayMoveUpDown = this.LinkSalesOrderDatalistNew.map(o => {
        return o;
      });

      var tmp = this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex];
      this.tempArrayMoveUpDown[this.SelectedMoveUpDownRowIndex] = this.tempArrayMoveUpDown[SwapWithRowIndex];
      this.tempArrayMoveUpDown[SwapWithRowIndex] = tmp;

      //to make route sequence
      var j = 0;
      for (j = 0; j < this.tempArrayMoveUpDown.length; j++) {
        this.tempArrayMoveUpDown[j].RouteSequence = j + 1;
      }

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

      this.selection1.clear();
      if (this.LinkSalesOrderDatalistNew.length == 1) {
        //Disabled all
        this.IsDisabledMoveDown = true;
        this.IsDisabledMoveUp = true;
      } else if (this.LinkSalesOrderDatalistNew.length == 2) {
        //Enable all
        this.IsDisabledMoveDown = false;
        this.IsDisabledMoveUp = false;
      }
    }
  }

  RemoveLinkOrder() {
    this.selection1.selected.forEach(irow => {
      var removeItem = this.LinkSalesOrderDatalistNew.find(x => x.OrderId === irow.OrderId);//[irow.OrderId];    

      if (removeItem != null && removeItem != "") {
        var orderId = removeItem.OrderId;
        var shipWithOrderID = removeItem.ShipWithOrderID;

        const index: number = this.tempArray.indexOf(removeItem);
        if (index !== -1) {
          this.tempArray.splice(index, 1);
        }

        const index1: number = this.LinkSalesOrderDatalistNew.indexOf(removeItem);
        if (index1 !== -1) {
          this.LinkSalesOrderDatalistNew.splice(index1, 1);
        }

        var tempFirstGridArray = this.LinkSalesOrderDatalistNew;

        //to make route sequence
        var j = 0;
        for (j = 0; j < tempFirstGridArray.length; j++) {
          tempFirstGridArray[j].RouteSequence = j + 1;
        }

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
            temparray[k].LinkOrders = null;
            break;
          }
        }
        if (isRecordExist == false && removeItem.OrderId != this.SalectedOrderId)
          temparray.push(removeItem);

        this.SalesOrderDatalist = [];
        this.SalesOrderDatalist = temparray.map(o => {
          return o;
        });

        // add back the removed item on functional array(in which we run the loop)
        this.data = [];
        this.data = temparray.map(o => {
          return o;
        });

        this.orderManagementService.RemoveSelectedLinkOrder(orderId, shipWithOrderID, localStorage.getItem('SelectedTab')).subscribe(data => {
          if (data.message == "Success") {
            //to refresh first grid
            //this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));

          }
        });
      }
    });
    this.selection1.clear();
    //add selected sales order ids to list to link data
    this.SelectedSalesOrderIdsToLink = [];
    for (var i = 0; i < this.LinkSalesOrderDatalistNew.length; i++) {
      if (!this.SelectedSalesOrderIdsToLink.includes(this.LinkSalesOrderDatalistNew[i].OrderId)) {
        this.SelectedSalesOrderIdsToLink.push(this.LinkSalesOrderDatalistNew[i].OrderId);
      }
    }
    if (this.LinkSalesOrderDatalistNew.length == 1) {
      //Disabled all
      this.IsDisabledMoveDown = true;
      this.IsDisabledMoveUp = true;
    } else if (this.LinkSalesOrderDatalistNew.length == 2) {
      //Enable all
      this.IsDisabledMoveDown = false;
      this.IsDisabledMoveUp = false;
    }

    //if we have only one record in linked grid then remove it also
    if (this.LinkSalesOrderDatalistNew.length == 1) {
      this.RemoveSingleRecord(this.LinkSalesOrderDatalistNew[0].OrderId);
    }
  }

  RemoveSingleRecord(orderId: number) {
    var removeItem = this.LinkSalesOrderDatalistNew.find(x => x.OrderId === orderId);
    if (removeItem != null && removeItem != "") {
      var shipWithOrderID = removeItem.ShipWithOrderID;
      const index: number = this.tempArray.indexOf(removeItem);
      if (index !== -1) {
        this.tempArray.splice(index, 1);
      }
      const index1: number = this.LinkSalesOrderDatalistNew.indexOf(removeItem);
      if (index1 !== -1) {
        this.LinkSalesOrderDatalistNew.splice(index1, 1);
      }

      var tempFirstGridArray = this.LinkSalesOrderDatalistNew;

      //to make route sequence
      var j = 0;
      for (j = 0; j < tempFirstGridArray.length; j++) {
        tempFirstGridArray[j].RouteSequence = j + 1;
      }

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
          temparray[k].LinkOrders = null;
          break;
        }
      }
      if (isRecordExist == false && removeItem.OrderId != this.SalectedOrderId)
        temparray.push(removeItem);

      this.SalesOrderDatalist = [];
      this.SalesOrderDatalist = temparray.map(o => {
        return o;
      });

      // add back the removed item on functional array(in which we run the loop)
      this.data = [];
      this.data = temparray.map(o => {
        return o;
      });
      this.orderManagementService.RemoveSelectedLinkOrder(orderId, shipWithOrderID, localStorage.getItem('SelectedTab')).subscribe(data => {
        if (data.message == "Success") {
          //to refresh first grid
          //this.GetAllShipToDataByOrderIDAndFromID(parseInt(localStorage.getItem('SelectedOrderId')), this.authservices.currentUserValue.ClientId, localStorage.getItem('SelectedTab'));

        }
      });
    }
  }

  GetOrderDataToLinkTabWise(tabName: any) {
    var OrderId = parseInt(localStorage.getItem('SelectedOrderId'));
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
            OrderQuantity: formatter.format(value.totalOrderQuantity),
            RequestedDeliveryDate: value.requestedDeliveryDate != null ? this.setDateMMddyyyy(value.requestedDeliveryDate) : null, // value.requestedDeliveryDate,
            LinkOrders: value.linkOrders,
            OrderId: value.orderId,
            ShipWithOrderID: value.shipWithOrderID,
            ToLocationId: value.toLocationId,
            OrderVersionNumber: value.orderVersionNumber
          })
        })
        if (this.ELEMENT_DATALO.length > 0) {
          if (this.ELEMENT_DATALO[0].LinkOrders != null && this.ELEMENT_DATALO[0].LinkOrders != "" && this.ELEMENT_DATALO[0].LinkOrders != "undefined") {

            this.LinkSalesOrderDatalistTemp = this.ELEMENT_DATALO;
            this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;
            this.tempArray = this.LinkSalesOrderDatalistNew.map(o => {
              return o;
            });
          }
          else {
            if (this.isOnLoad == true)
              this.LinkSalesOrderDatalistTemp = this.ELEMENT_DATALO;
            else
              this.LinkSalesOrderDatalistNew = this.ELEMENT_DATALO;
          }
        }
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
              this.shipWithHasReadOnlyAccess = false;
              //this.IsModulePermission = true;
              //this.btnBar.enableAction('edit');
              //this.btnBar.enableAction('active');
              //this.btnBar.enableAction('inactive');
              //this.btnBar.enableAction('edittype');         
              //if (this.isCarrierTab)
              //  this.btnBar.enableAction('add');
            }
            else {
              //this.IsModulePermission = false;;
              //this.btnBar.disableAction('active');
              //this.btnBar.disableAction('inactive');
              //this.btnBar.disableAction('add');
              //this.btnBar.disableAction('edittype');         
              //this.businessPartnerService.businessPartnerHasReadOnlyAccess = true;
              this.shipWithHasReadOnlyAccess = true;
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }

          // OLD
          ////if (data != null || data != undefined) {
          ////  if (!data || (data[0] && data[0].PermissionType == "Read and Modify")) {
          ////    //this.IsModulePermission = true;
          ////    //this.btnBar.enableAction('edit');
          ////    //this.btnBar.enableAction('active');
          ////    //this.btnBar.enableAction('inactive');
          ////    //this.btnBar.enableAction('edittype');         
          ////    //if (this.isCarrierTab)
          ////    //  this.btnBar.enableAction('add');
          ////  }
          ////  else {
          ////    //this.IsModulePermission = false;;
          ////    //this.btnBar.disableAction('active');
          ////    //this.btnBar.disableAction('inactive');
          ////    //this.btnBar.disableAction('add');
          ////    //this.btnBar.disableAction('edittype');         
          ////    //this.businessPartnerService.businessPartnerHasReadOnlyAccess = true;
          ////    this.shipWithHasReadOnlyAccess = true;
          ////  }
          ////}
          ////else {
          ////  this.router.navigate(['/unauthorized']);
          ////}
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }

}

