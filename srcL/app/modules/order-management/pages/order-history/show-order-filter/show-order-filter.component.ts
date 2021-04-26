import { Component, OnInit, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ShiptoContactDetailpopupComponent } from '../shipto-contact-detailpopup/shipto-contact-detailpopup.component';
import { OrderHistoryService } from '../../../../../core/services/order-history.service';
import { OrderManagementService } from '../../../../../core/services/order-management.service';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { AuthService } from '../../../../../core';

export interface PeriodicElement {
  name: string;
  displayQuantity: string;
  displayShippedQuantity: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'material',
    displayQuantity: '2,222',
    displayShippedQuantity: '0.00',
  }];
export interface PeriodicElement1 {
  name: string;
  displayQuantity: string;
  displayShippedQuantity: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    name: 'material',
    displayQuantity: '1,222',
    displayShippedQuantity: '0.00',
  }];

export interface PeriodicElement2 {
  materialName: string;
  chargeName: string;
  commodityName: string;
  showOnBOL: string;
  chargeUnit: string;
  priceMethod: string;
  rateValue: string;
  rateTypeName: string;
  amount: number;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    materialName: 'material 1',
    chargeName: 'charge',
    commodityName: 'commodity',
    showOnBOL: 'yes',
    chargeUnit: '12',
    priceMethod: 'price',
    rateValue: '111',
    rateTypeName: '111',
    amount: 222,
  }];

const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

@Component({
  selector: 'app-show-order-filter',
  templateUrl: './show-order-filter.component.html',
  styleUrls: ['./show-order-filter.component.css']
})

export class ShowOrderFilterComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(private auth: AuthService, 
    public router: Router, public modalService: NgbModal, private orderHistoryService: OrderHistoryService, private orderManagementService: OrderManagementService) { }

  SalesOrderData: any = {};
  IsChecked: boolean;
  AvailableCredit: string;
  decimalPreferences: number;
  SalesManager: string;
  fuelChargesMiles: string;
  fuelChargesRatePerMile: string;
  fuelChargesPercentage: number;
  MaterialDataForAdjustCharges: any[] = [];
  MaterialDataForAdjustShipping: any[] = [];
  MaterialData: any[] = [];
  MaterialDataBackup: any = [];
  MaterialDetails: any[] = [];
  OrderID: number;
  NPMIPallet: number = 0;

  @Output() CommentData: EventEmitter<any> = new EventEmitter();
  @Input() public values: string;
  async ngOnInit() {
    this.decimalPreferences = await this.orderManagementService.defaultDecimalPlacesForMoney();
    this.IsChecked = false;
   

  }
  openShiptocontact() {
    this.modalRef = this.modalService.open(ShiptoContactDetailpopupComponent, { size: 'md', backdrop: 'static' });
  }

  ngOnChanges(changes:any) {
    
    var dd = changes.values.currentValue;
    
    this.GetData(Number(dd))
  }

  GetData(OrderID: number) {
    this.GetClaimFilterData(this.auth.currentUserValue.ClientId, OrderID);
  }
  GetClaimFilterData(ClientID: number, OrderID: number) {
    

    this.OrderID = Number(OrderID);
    var vv = this.orderManagementService.SalesOrderforEdit.find(x => x.OrderId == Number(OrderID))?.OrderType;

    this.orderHistoryService.GetSalesOrderData(Number(ClientID),Number(OrderID),vv)
      .subscribe(res => {
        if (res.data.length > 0) {          
          this.SalesOrderData = res.data;
          this.BindAvailableCredit(this.SalesOrderData[0].ToLocationID);
          this.BindSalesManagerListData();
          //
          if (!(this.SalesOrderData[0].OrderTypeCode == GlobalConstants.StockTransfer || this.SalesOrderData[0].OrderTypeCode == GlobalConstants.CustomerReturn || this.SalesOrderData[0].OrderTypeCode == GlobalConstants.Collections)) { //|| this.ARChargesSentToAccounting
            this.BindFuelCharges(Number(this.SalesOrderData[0].ToLocationID == undefined ? 0 : this.SalesOrderData[0].ToLocationID));           

          }
          this.CommentData.emit(this.SalesOrderData);
          if (Number(this.SalesOrderData[0].EmailConfirmation) == 1) {
            this.IsChecked = true;
          }
          else {
            this.IsChecked = false;
          }
        }
        else {
          this.SalesOrderData = {};
        }
      });
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

  BindAvailableCredit(locationID: number) {
   
    var orderDate = this.ConverttoDateOnlyforDB(this.SalesOrderData[0].RequestedDeliveryDate);
    let dtt = new Date(orderDate);
    if (!(this.SalesOrderData[0].OrderStatusCode == GlobalConstants.StockTransfer || this.SalesOrderData[0].OrderStatusCode == GlobalConstants.Collections)) {
      this.orderManagementService.GetAvailableCreditOfLocation(Number(locationID), dtt)
        .subscribe(
          result => {

            if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
              var data = result.data == undefined ? result.Data : result.data;
              this.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number(data));

              //if (Number(this.orderManagementAdjustCharges.TotalAmount) != 0 && this.CreditCalculateLimit() >= this.orderManagement.RequestedDeliveryDate) {
              //  this.orderManagement.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number((Number(data) - Number(this.orderManagementAdjustCharges.TotalAmount)).toString()));
              //}
              //this.orderManagement.AvailableCredit = formatterDecimal.format(Number(this.orderManagement.AvailableCredit));


              //this.CheckAvailableCredit();
              //this.GetStatuswithcondition(lo, String(this.orderManagement.AvailableCredit));
            }

          }
        );
    }
    else {
      this.AvailableCredit = this.ConvertMoneyToDecimalPreferences(Number("0"));
      //this.CheckAvailableCredit();
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


  BindSalesManagerListData() {
    var locationID = 0;
    if (this.SalesOrderData[0].OrderTypeCode == GlobalConstants.CustomerReturn) {
      locationID = this.SalesOrderData[0].FromLocationID;
    }
    else {
      locationID = this.SalesOrderData[0].ToLocationID;
    }


    if (this.SalesOrderData[0].OrderTypeCode == GlobalConstants.StockTransfer || this.SalesOrderData[0].OrderTypeCode == GlobalConstants.Collections) {
      this.SalesManager = '';
      return false;
    }

    this.orderManagementService.GetAllSalesManagerList(Number(locationID))
      .subscribe(
        result => {
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var SalesManagersList = result.data == undefined ? result.Data : result.data;
            if (SalesManagersList != undefined && SalesManagersList != null && SalesManagersList.length > 0) {
              this.SalesManager = SalesManagersList[0].name;
            }
            else {
              this.SalesManager = '';
            }
          }
        }
      );


  }

  BindFuelCharges(locationID: number) {

    if (this.SalesOrderData[0].OrderTypeCode == GlobalConstants.StockTransfer || this.SalesOrderData[0].OrderTypeCode == GlobalConstants.Collections) {
      this.fuelChargesMiles = null;// 0;
      this.fuelChargesRatePerMile = null;// 0;
      this.fuelChargesPercentage = 0;
     
      return false;
    }
    var orderDate = this.ConverttoDateOnlyforDB(this.SalesOrderData[0].RequestedDeliveryDate);
    let dtt = new Date(orderDate);
   

    this.orderManagementService.GetFuleCharges(Number(locationID), dtt)
      .subscribe(
        result => {

          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            var data = result.data == undefined ? result.Data : result.data;
            this.fuelChargesMiles = this.ConvertMoneyToDecimalPreferences(Number(data.customerMiles)).toString();
            this.fuelChargesRatePerMile = this.ConvertMoneyToDecimalPreferences(Number(data.chargeRatePerMile)).toString();
            this.fuelChargesPercentage = Number(data.customerPercent);

            

          }
        }
      );


  }

// Bind Material Grid

 

  // code use for order details

 }
