import { Component, ViewChild, OnInit,Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { OrderHistoryService } from '../../../../../core/services/order-history.service';
import { OrderManagementService } from '../../../../../core/services/order-management.service';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderManagementAdjustChargesService } from '../../../../../core/services/order-management-AdjustCharges.service';
import { AdjustChargesModel } from '../../../../../core/models/regularOrder.model';
import { OrdermanagementCommonOperation } from '../../../../../core/services/order-management-common-operations.service';
import { AuthService } from '../../../../../core';


export interface PeriodicElement {
  name: string;
  quantity: number;
  shippedQuantity: number;
  materialId: number;
}

//const ELEMENT_DATA: PeriodicElement[] = [
//  {
//    name: 'material',
//    displayQuantity: '2,222',
//    displayShippedQuantity: '0.00',
//  }];

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
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  amount: number;
  constructor(private auth: AuthService,private orderCommonService: OrdermanagementCommonOperation,private orderManagementAdjustCharges: OrderManagementAdjustChargesService,public router: Router, public modalService: NgbModal, private orderHistoryService: OrderHistoryService, private orderManagementService: OrderManagementService) { }
  MaterialDataForAdjustCharges: any[] = [];
  MaterialDataForAdjustShipping: any[] = [];
  MaterialData: any[] = [];
  MaterialDataBackup: any = [];
  MaterialDetails: any[] = [];
  OrderID: number;
  NPMIPallet: number = 0;
  Action: any;
  SalesOrderData: any = {};
  ShippingMaterialDetails: any[] = [];
  EquivalentPallates: number = 0;
  TotalPalates: number = 0;
  TempPalates: number = 0; 
  ShippingMaterialDetailForUI: any[] = [];
  SelectAddjustMaterial: number = 0;
  ChargeData: any[] = [];
  RawChargeData: any[] = [];
  ShippingCharegsTotalAmount: number = 0;
  decimalPreferences: number;
  SalesOrderDetailsData: any = {};
  @Input() public value: string;

  ngOnInit(): void {
    //this.GetFilterData(100, 231);
    //this.BindChargeList();
  }

  ngOnChanges(changes) {
    
    var dd = changes.value.currentValue;
    this.GetData(Number(dd))
  }
  public GetData(OrderID: number) {
    
    this.GetSalesOrderDetailsData(this.auth.currentUserValue.ClientId, OrderID);   
  }


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
  
  displayedColumns = ['Material', 'OrderQuantity', 'ShippedQuantity'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  displayedColumnsAddMaterial = ['Material', 'OrderQuantity', 'ShippedQuantity'];
  dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

 



  displayedColumnsAdjust = ['materialName', 'chargeName', 'commodityName', 'showOnBOL',
    'chargeUnit', 'priceMethod', 'rateValue', 'rateTypeName',
    'amount'];
  dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>();
  allAdjustChargesData: AdjustChargesModel[];
  defaultContractChargesData: AdjustChargesModel[];

  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase();
    //this.dataSource.filter = filterValue;
  }

 isAllSelected() {
    const numSelected = this.selection.selected.length;
   // const numRows = this.dataSource.data.length;
    return numSelected === 0;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
     this.dataSource.data.forEach(row => this.selection.select(row));
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



  GetSalesOrderDetailsData(ClientID: number, OrderID) {
    
    this.OrderID = Number(OrderID);
    var vv = this.orderManagementService.SalesOrderforEdit.find(x => x.OrderId === Number(OrderID))?.OrderType;
    this.orderHistoryService.GetSalesOrderDetailsData(Number(ClientID), Number(OrderID), vv)
      .subscribe(res => {
        if (res.data.length > 0) {
          
          this.SalesOrderDetailsData = res.data;
          this.BindMaterial();
          this.BindShippingMaterial();
          this.BindCharges();
        }
        else {
          this.SalesOrderDetailsData = {};
        }
      });
  }

  BindMaterial() {
    
    if (this.SalesOrderDetailsData.length > 0) {
      this.MaterialDetails = [];
      var Mdata = this.SalesOrderDetailsData.filter(x => (x.ChargeID == null || x.ChargeID == undefined) && x.IsPackagingMaterial == 0)

      Mdata.forEach((value, index) => {
        this.MaterialDetails.push({
          materialID: value.MaterialID,
          name: value.MaterialName,
          quantity: value.Quantity,
          displayQuantity: value.Quantity,
          shippedQuantity: value.QuantityFilled,
          displayShippedQuantity: value.QuantityFilled
          //formatter.format(value.Quantity)
        })
      });
      this.dataSourceAddMaterial = new MatTableDataSource<PeriodicElement>(this.MaterialDetails);
      this.selection = new SelectionModel<PeriodicElement>(true, []);
    }
  }

  BindShippingMaterial() {
    
    if (this.SalesOrderDetailsData.length > 0) {
      this.ShippingMaterialDetails = [];
      var SMdata = this.SalesOrderDetailsData.filter(x => (x.ChargeID == null || x.ChargeID == undefined) && x.IsPackagingMaterial==1)
      SMdata.forEach((value, index) => {
        this.ShippingMaterialDetails.push({
          materialID: value.MaterialID,
          name: value.MaterialName,
          quantity: value.Quantity,
          shippedQuantity: value.ShippedQuantity,
          displayQuantity: value.Quantity,
          displayShippedQuantity: value.QuantityFilled,
        })
      });
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ShippingMaterialDetails);
      this.selection = new SelectionModel<PeriodicElement>(true, []);
    }
  }

  BindCharges() {
    if (this.SalesOrderDetailsData.length > 0) {
      this.MaterialDataForAdjustCharges = [];
      var Mdata = this.SalesOrderDetailsData.filter(x => x.ChargeID != null || x.ChargeID != undefined)

      Mdata.forEach((value, index) => {
        this.MaterialDataForAdjustCharges.push({
          materialID: value.MaterialID,
          materialName: value.MaterialName,
          chargeName: value.ChargeName,
          showOnBOL: (value.ShowOnBOL == 0 ? false : true),
          priceMethod: value.PriceMethodName,
          rateValue: Number(value.RateValue),
          rateTypeName: value.RateType,
          amount: value.Amount,
          fullAmount: value.Amount,
          commodityName: value.CommodityName,
          chargeUnit: value.Quantity,
          overrideShowOnBOL: (value.OverrideShowOnBOL == 0 ? false : true),
          overrideRateValue: 0,
          overrideCommodityName: value.OCommodityName,
          overrideRateTypeName: value.ORateType,
          overridePriceMethodName: value.OPriceMethodName,
          overrideAmount:0


        })
      });
      

      let amount = 0;
      
      this.MaterialDataForAdjustCharges.map(p => {       
        amount += !!!p.fullAmount ? 0 : Number(p.fullAmount);
      });

      this.ShippingCharegsTotalAmount = amount;

      this.dataSourceAdjust = new MatTableDataSource<AdjustChargesModel>(this.MaterialDataForAdjustCharges);
    }
  }
}
