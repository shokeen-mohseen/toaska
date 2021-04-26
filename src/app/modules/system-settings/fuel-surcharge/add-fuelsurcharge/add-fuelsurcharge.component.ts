import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTabGroup } from '@angular/material/tabs';
import { FuelChargeIndex } from '../../../../core/models/FuelChargeIndex.model';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
@Component({
  selector: 'app-add-fuelsurcharge',
  templateUrl: './add-fuelsurcharge.component.html',
  styleUrls: ['./add-fuelsurcharge.component.css']
})
export class AddFuelsurchargeComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  required1 = true;
  fuelCharge: FuelChargeIndex = new FuelChargeIndex();
  dataSource: FuelChargeIndex[] = [];
  modalRef: NgbModalRef;
  sidellist: FuelChargeIndex[] = [];
  sidellistlastfive: FuelChargeIndex[] = [];
  e1: () => FuelChargeIndex;
  next: number = 0;
  currentIndex: number = 0;
  ngForm: NgForm;
  constructor(private router: Router, private authenticationService: AuthService, public modalService: NgbModal, private fuelPriceService: FuelPriceService, private toastrService: ToastrService)
  {
    this.fuelCharge = new FuelChargeIndex();

  }


  fuelPriceTypeList = [];
  fuelPriceUOMList = [];
  chargeRateUOMList = [];
  fuelPriceTypeItem = [];
  fuelPriceUOMItem = [];
  chargeRateUOMItem = [];
  //selectedItemsA = [];
  settingsA = {};
  countA = 3;

  userData = {
    listA: ''
  };



  ngOnInit(): void {
    
    this.fuelPriceService.getFuelPriceTypeList(this.authenticationService.currentUserValue.ClientId).subscribe(res => {
      
      this.fuelPriceTypeList = res.data;
      console.log(res.Data);

      this.fuelPriceTypeItem = [this.fuelPriceTypeList.find(unit => unit.id === 1)];

      

    });
    this.fuelPriceService.getChargeRateUOMList(this.authenticationService.currentUserValue.ClientId).subscribe(res => {
      
      this.fuelPriceUOMList = res.data;
      this.chargeRateUOMList = res.data;
      console.log(res.Data);

      this.fuelPriceUOMItem = [this.fuelPriceUOMList.find(unit => unit.code === 'USD')];
      this.chargeRateUOMItem = this.fuelPriceUOMItem;
    });
    

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }

  selectedFuelSurCharge(index: number) {
    this.currentIndex = index;
    const fuelChargeToEdit: FuelChargeIndex = this.dataSource[index];
    this.fuelCharge = { ...fuelChargeToEdit };
    if (typeof this.fuelCharge.effectiveStartDate === 'string') {
      this.fuelCharge.effectiveStartDate = new Date(this.converttoSqlStringWithT(this.fuelCharge.effectiveStartDate));
      this.fuelCharge.effectiveEndDate = new Date(this.converttoSqlStringWithT(this.fuelCharge.effectiveEndDate));
    }

    if (this.fuelPriceTypeList.length) {
      this.fuelPriceTypeItem = [this.fuelPriceTypeList.find(item => this.fuelCharge.fuelPriceTypeId === item.id)];
    }
    if (this.fuelPriceUOMList.length) {
      this.fuelPriceUOMItem = [this.fuelPriceUOMList.find(item => this.fuelCharge.fuelPriceUomid === item.id)];
      this.chargeRateUOMItem = [this.fuelPriceUOMList.find(item => this.fuelCharge.chargeRateUomid === item.id)];
    }
  }

  setFuelSurChargeDetails(index: number) {
    const nextResult = this.dataSource[this.next];
    this.fuelCharge = Object.assign(new FuelChargeIndex(), nextResult);
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }
  

  onAddItem(data: string) {
    this.countA++;
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.userData);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.userData);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  GetAllFuelSurchargeData() {
   
  
    if (this.fuelPriceTypeItem != null) {
      this.fuelCharge.fuelPriceTypeId = this.fuelPriceTypeItem[0].id;
      this.fuelCharge.fuelPriceType = this.fuelPriceTypeItem[0].name;
    }
    else
      return null
    if (this.fuelPriceUOMItem != null) {
      this.fuelCharge.fuelPriceUomid = this.fuelPriceUOMItem[0].id;
    }
    else
      return null
    if (this.chargeRateUOMItem != null) {
      this.fuelCharge.chargeRateUomid = this.chargeRateUOMItem[0].id;
    }
    else
      return null
    if (this.fuelCharge.fromFuelPrice) {
      this.fuelCharge.fromFuelPrice = +this.fuelCharge.fromFuelPrice;
    }
    else
      return null

    if (this.fuelCharge.toFuelPrice) {
      this.fuelCharge.toFuelPrice = +this.fuelCharge.toFuelPrice;
    }
    else
      return null
    if (this.fuelCharge.chargeRatePerMile) {
      this.fuelCharge.chargeRatePerMile = +this.fuelCharge.chargeRatePerMile;
    }
    else
      return null

    if (this.isFormValid()) {
      return this.fuelCharge;
    }
    else
      return null

  }
  isFormValid() {
    if (this.fuelCharge.fuelPriceTypeId == 0
      || this.fuelCharge.fuelPriceUomid == 0



    ) {
      return false;
    }
    return true;
  }

  getFuelSurChargelist() {
    this.fuelPriceService.getAllFuelSurchargeIndexList(this.fuelCharge).subscribe((e1: any) => {
      e1.data.forEach(element => {
        this.sidellist.push(element);
      });
      this.sidellist = this.sidellist.sort((a, b) => Number(a.id) - Number(b.id));
    }
    );
  }

  AddNext(form: NgForm) {
    //if (this.selectedContractType.length == 0) {
    //  this.toastrService.error("Please fill all mandatory fields to save the record");
    //  return false;
    //}
    //else if (this.formData.EffectiveStart.value == null) {
    //  this.toastrService.error("Please fill all mandatory fields to save the record");
    //  return false;
    //}
   // this.isLoadingNext = true;
    this.Save(form);

  }
  
  


  Save(form: NgForm, moveNext = false){

    var FuelSurchargeToBeSaved = this.GetAllFuelSurchargeData();
    if (FuelSurchargeToBeSaved == null) {
      this.toastrService.error("Please fill all mandatory fields to save the record.");
      return false;
    }
    if (FuelSurchargeToBeSaved.fromFuelPrice > FuelSurchargeToBeSaved.toFuelPrice) {
      this.toastrService.error("From price should be less than To price.");
      return;
    }

    if (FuelSurchargeToBeSaved.fromFuelPrice < 0) {
      this.toastrService.error("From Fuel Price should not be negative.");
      return;
    }

    if (FuelSurchargeToBeSaved.toFuelPrice > 100) {
      this.toastrService.error("To Fuel Price should not be greater than $101.");
      return;
    }

    FuelSurchargeToBeSaved.createdBy = this.authenticationService.currentUserValue.LoginId;
    FuelSurchargeToBeSaved.clientID = this.authenticationService.currentUserValue.ClientId;
    FuelSurchargeToBeSaved.updateDateTimeBrowserStr = this.fuelPriceService.convertDatetoStringDate(new Date());
    FuelSurchargeToBeSaved.createDateTimeBrowserStr = this.fuelPriceService.convertDatetoStringDate(new Date()),
    FuelSurchargeToBeSaved.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    FuelSurchargeToBeSaved.effectiveStartDate = new Date(this.converttoSqlStringWithT(FuelSurchargeToBeSaved.effectiveStartDate));
    FuelSurchargeToBeSaved.effectiveEndDate = new Date(this.converttoSqlStringWithT(FuelSurchargeToBeSaved.effectiveEndDate));
    this.fuelPriceService.saveAllFuelSurChargeIndex(new Array(FuelSurchargeToBeSaved)).subscribe(result => {
      this.dataSource[this.currentIndex] = result.data[0];
      
      if (result.recordCount == 1) {
        this.toastrService.success("The record is saved successfully.");
      } else {
        this.toastrService.error("The price range already exists.");
      }

      
      if (moveNext && this.currentIndex < this.dataSource.length - 1) {
        this.currentIndex++;
        this.selectedFuelSurCharge(this.currentIndex);
      } else {
        this.currentIndex = this.dataSource.length;
        this.fuelCharge = new FuelChargeIndex();
        form.resetForm();
        this.fuelPriceUOMItem = [this.fuelPriceUOMList.find(unit => unit.code === 'USD')];
        this.chargeRateUOMItem = this.fuelPriceUOMItem;
        this.fuelPriceTypeItem = [this.fuelPriceTypeList.find(unit => unit.id === 1)];
      }
        //this.isPONo = false;
    }
    );
    return true;
  }
  formReload() {
    //this.FuelChargeIndex.materialId = 0;
    //this.OriginOfGoods.countryId = 0;
    //this.OriginOfGoods.locationID = 0;
    //this.OriginOfGoods.materialPercentage = 0;
    //this.OriginOfGoods.comment = "";
    //this.itemListA = [];
    //this.itemListB = [];
    //this.itemListC = [];
    //this.MatPercentage = [];
    //this.Comment = [];
    this.fuelCharge = new FuelChargeIndex();
    this.fuelPriceService.getFuelPriceTypeList(this.authenticationService.currentUserValue.ClientId).subscribe(res => {
      this.fuelPriceTypeList = res.data;

    });
    this.fuelPriceService.getChargeRateUOMList(this.authenticationService.currentUserValue.ClientId).subscribe(res => {
      this.fuelPriceUOMList =  res.data;
    });
    this.fuelPriceService.getChargeRateUOMList(this.authenticationService.currentUserValue.ClientId).subscribe(res => {
      this.chargeRateUOMList = res.data;

    });
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
      //  2021 - 01 - 02T16: 10: 00.000
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
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + (date + 1).toString().padStart(2, "0") + "T" + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }
  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }
}
