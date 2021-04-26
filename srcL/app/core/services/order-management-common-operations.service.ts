import { Injectable } from '@angular/core';
import { CalculationAmountVM, AdjustChargesModel } from '../models/regularOrder.model';
import { BehaviorSubject, of, observable } from 'rxjs';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { OrderManagementService } from './order-management.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})



export class OrdermanagementCommonOperation {

  private _orderType: any[] = [];
  private _shipToType: any[] = [];
  private currentOrderType: string;
  private _contractChargesData: AdjustChargesModel[] = [];
  private _commodityList: any[] = [];
  private _rateTypeList: any[] = [];
  private _pricemethodList: any[] = [];

  get OrderTypeList(): any[] {
    return this._orderType;
  }
  set OrderTypeList(value: any[]) {
    this._orderType = value;
  }

  get ShipToType(): any[] {
    return this._shipToType;
  }
  set ShipToType(value: any[]) {
    this._shipToType = value;
  }

  get ContractChargesData(): AdjustChargesModel[] {
    return this._contractChargesData;
  }
  set ContractChargesData(value: AdjustChargesModel[]) {
    this._contractChargesData = value;
  }

  get CommodityList(): any[] {
    return this._commodityList;
  }
  set CommodityList(value: any[]) {
    this._commodityList = value;
  }

  get RateTypeList(): any[] {
    return this._rateTypeList;
  }
  set RateTypeList(value: any[]) {
    this._rateTypeList = value;
  }

  get PricemethodTypeList(): any[] {
    return this._pricemethodList;
  }
  set PricemethodTypeList(value: any[]) {
    this._pricemethodList = value;
  }




  constructor() {
  }




  calculateAmount(data: CalculationAmountVM): number {
    var totalAmount: number = 0;

    switch (data.RateTypeName) {
      case GlobalConstants.PerEA:

        totalAmount = data.ChargeUnit * data.RateValue * data.Quantity;
        break;

      case GlobalConstants.PercentageAmount:
        if (data.RateValue > 0) { totalAmount = (data.TotalAmount * (data.RateValue / 100)); }
        break;
      case GlobalConstants.DOE:
        if (data.ChargeRatePerMile > 0 && data.PassthrowPercentage > 0 && data.PerMileCharge > 0 && data.TotalPallets > 0 && data.MaxPallets > 0) {
          totalAmount = ((data.ChargeRatePerMile * (data.PassthrowPercentage / 100) * data.PerMileCharge)) * (data.TotalPallets / data.MaxPallets);
        }
        else {
          totalAmount = 0;
        }
        break;
      case GlobalConstants.PerShipment:
      case GlobalConstants.ChargeAmount:
      case GlobalConstants.PerUnit:
        totalAmount = data.RateValue * data.ChargeUnit;
        break;
      case GlobalConstants.UnusedPerPallet:
        var remaining = data.MaxPallets - data.TotalPallets;

        if (remaining > 0) {
          totalAmount = remaining * data.RateValue;
        }
        break;

      case GlobalConstants.UnusedPerPallet:
        var remaining = data.MaxPallets - data.TotalPallets;

        if (remaining > 0) {
          totalAmount = remaining * data.RateValue;
        }
        break;
      case GlobalConstants.PerUnitXPerEA:
        totalAmount = data.TotalQuantity * data.RateValue;

        break;
      case GlobalConstants.PerPallet:
        totalAmount = data.TotalPallets * data.RateValue;
        break;
    }

    return totalAmount;
  }

  setCurrentOrderType(OrderTypeID: number) {
    this.OrderTypeList.forEach((value, index) => {
      if (value.id == OrderTypeID) {
        this.currentOrderType = value.code;
      }
    });
  }

  setDefultToLocationType(OrderTypeID: number) {
    var ToLocationTypeID = 0;
    this.setCurrentOrderType(OrderTypeID);

    this.ShipToType.forEach((value, index) => {
      if ((this.currentOrderType == "Customer" || this.currentOrderType == "CPUOrder" || this.currentOrderType == "CustomerToCustomer") && value.code == "CustomerLocation") {
        ToLocationTypeID = value.id;
      }
    });
    return ToLocationTypeID;
  }


  getDefaultSelectedContractDetails(materialID: number, chagreID: number) {
    var result = this.ContractChargesData.find(x => x.materialID == materialID && x.chargeID == chagreID);
    if (result != undefined && result != null)
      return result;
    return null;
  }

  getDefaultCommodity(commodityID: number) {
    var defaultCommodityData = null;
    if (this.CommodityList != undefined && this.CommodityList.length > 0) {
      this.CommodityList.forEach((value, index) => {
        if (value.id == commodityID) {
          defaultCommodityData = value;
        }
      });
    }

    return defaultCommodityData;
  }

  getMatrialDefaultPriceMethod(isMaterial: boolean) {

    var defaultPriceMethodName = isMaterial ? GlobalConstants.Billable : GlobalConstants.NonBillable;

    var selectedPricemethod = null;
    if (this.PricemethodTypeList != undefined && this.PricemethodTypeList != null && this.PricemethodTypeList) {

      this.PricemethodTypeList.forEach((value, index) => {
        if (value.code == defaultPriceMethodName) {
          selectedPricemethod = value;
        }
      });
    }

    return selectedPricemethod;

  }

  getShowOnBOLDefault(): boolean {
    return true;
  }

  getDefaultRateType(isMaterial: boolean) {
    var defaultRateTypeCode = GlobalConstants.PerEA;
    var RateTypeData = null;
    if (!isMaterial)
      defaultRateTypeCode = GlobalConstants.PerPallet;


    this.RateTypeList.forEach((value, index) => {
      if (value.code === defaultRateTypeCode) { RateTypeData = value; }
    });

    return RateTypeData;
  }

  convertDatetoStringDate(selectedDate: Date) {

    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();

      var hourshh = dateNew.getHours();
      var minutsmm = dateNew.getMinutes();
      var secondsss = dateNew.getSeconds();

      return yearyy.toString() + "-" + monthmm.toString() + "-" + datedd.toString() + " " + hourshh.toString() + ":" + minutsmm.toString() + ":" + secondsss.toString();


    }


  }






}
