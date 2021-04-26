import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuelChargeIndex } from '../../../../core/models/FuelChargeIndex.model';
import { ManageFuelChargeStateService } from '../fuelcharge-state.service';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
@Component({
  selector: 'app-edit-fuelsurcharge',
  templateUrl: './edit-fuelsurcharge.component.html',
  styleUrls: ['./edit-fuelsurcharge.component.css']
})
export class EditFuelsurchargeComponent implements OnInit {

  myDate: Date = new Date();
  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  required1 = true;
  lastUpdate: string; lastUpdatedBy: string; IsLastUpdated: boolean = false;
  modalRef: NgbModalRef;
  @Output('selectedFuelCharges') selectedFuelCharges = new EventEmitter<FuelChargeIndex[]>();
  selectedFuelChargeToEdit: FuelChargeIndex = null;
  fuelChargesToEdit: FuelChargeIndex[];

  

  constructor(private router: Router,
    private fuelPriceService: FuelPriceService,
    public modalService: NgbModal,
    private fuelSurchargeState: ManageFuelChargeStateService,
    private authService: AuthService,
    private toastrService: ToastrService) { }
  

  fuelPriceTypeList = [];
  fuelPriceUOMList = [];
  clientId: number = 0;
  sourceSystemId: number = 0;
  updatedBy: string;
  inActive: boolean;
  updateDateTimeBrowser: Date;
  //selectedItemsA = [];
  settingsA = {
    singleSelection: true,
    text: 'Select',
    enableSearchFilter: true,
    badgeShowLimit: 1,
    labelKey: 'name',
    searchBy: ['name']
  };
  countA = 3;

  fuelPriceType = [];
  fuelPriceUOM = [];
  chargeRateUom = [];

  lastUpdatedOn = null;



  submit(formGroup: FormGroup, moveNext = false) {
    if (formGroup.valid) {
      this.selectedFuelChargeToEdit.fuelPriceTypeId = this.fuelPriceType[0].id;
      this.selectedFuelChargeToEdit.fuelPriceUomid = this.fuelPriceUOM[0].id;
      this.selectedFuelChargeToEdit.chargeRateUomid = this.chargeRateUom[0].id;
      this.selectedFuelChargeToEdit.updateDateTimeBrowserStr = new Date().toUTCString();
      let m1 = moment(this.selectedFuelChargeToEdit.updateDateTimeBrowserStr).format('MMMM DD, YYYY hh:mm A').toString();;
      let timeZone = moment.tz.guess();
      var timeZoneOffset = new Date(this.selectedFuelChargeToEdit.updateDateTimeBrowserStr).getTimezoneOffset();
      timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);
      this.lastUpdate = m1 + " " + timeZone;
      if (this.selectedFuelChargeToEdit.fromFuelPrice > this.selectedFuelChargeToEdit.toFuelPrice) {
        this.toastrService.error("From price should be less than To price.");
        return;
      }
      if (this.selectedFuelChargeToEdit.fromFuelPrice < 0) {
        this.toastrService.error("From Fuel Price should not be negative.");
        return;
      }

      if (this.selectedFuelChargeToEdit.toFuelPrice >= 100) {
        this.toastrService.error("To Fuel Price should not be greater than $101.");
        return;
      } 
      const reqBody = {
        ID: this.selectedFuelChargeToEdit.id,
        ClientId: this.authService.currentUserValue.ClientId,
        SourceSystemID: this.authService.currentUserValue.SourceSystemID,
        UpdatedBy: this.authService.currentUserValue.LoginId,
        FuelPriceTypeId: this.selectedFuelChargeToEdit.fuelPriceTypeId,
        FromFuelPrice: +this.selectedFuelChargeToEdit.fromFuelPrice,
        ToFuelPrice: +this.selectedFuelChargeToEdit.toFuelPrice,
        FuelPriceUomid: this.selectedFuelChargeToEdit.fuelPriceUomid,
        ChargeRatePerMile: +this.selectedFuelChargeToEdit.chargeRatePerMile,
        ChargeRateUomid: this.selectedFuelChargeToEdit.chargeRateUomid,
        EffectiveStartDate: this.converttoSqlStringWithT(this.selectedFuelChargeToEdit.effectiveStartDate),
        EffectiveEndDate: this.converttoSqlStringWithT(this.selectedFuelChargeToEdit.effectiveEndDate),
        IsDeleted: this.selectedFuelChargeToEdit.isDeleted,
        UpdateDateTimeBrowserStr: new Date().toUTCString()
      }
      this.fuelPriceService.updateSurChargeIndex(reqBody).subscribe(result => {
        this.toastrService.success("The record is saved successfully.");
        this.selectedFuelChargeToEdit.updateDateTimeBrowser = new Date(new Date().toUTCString());
        if (moveNext) {
          this.selectNext();
        }
      }
      );

      
    } 
  }

  ngOnInit(): void {
    
    this.inActive = this.fuelPriceService.permission ? false : true;
    this.fuelChargesToEdit = this.fuelSurchargeState.seletedFuelCharges || [];
    
    if (this.fuelChargesToEdit && this.fuelChargesToEdit[0]) {
      if (this.fuelChargesToEdit.length > 20) {
        this.fuelChargesToEdit = this.fuelChargesToEdit.slice(0, 20);
      }
      this.selectedFuelCharge(this.fuelChargesToEdit[0]);
    }

    this.fuelPriceService.getFuelPriceTypeList(this.authService.currentUserValue.ClientId).subscribe(res => {
      this.fuelPriceTypeList = res.data;
      if (this.selectedFuelChargeToEdit) {
        this.fuelPriceType = [this.fuelPriceTypeList.find(item => this.selectedFuelChargeToEdit.fuelPriceTypeId === item.id)];
      }
    });
    this.fuelPriceService.getChargeRateUOMList(this.authService.currentUserValue.ClientId).subscribe(res => {
      this.fuelPriceUOMList = res.data;
      if (this.selectedFuelChargeToEdit) {
        this.fuelPriceUOM = [this.fuelPriceUOMList.find(item => this.selectedFuelChargeToEdit.fuelPriceUomid === item.id)];
        this.chargeRateUom = [this.fuelPriceUOMList.find(item => this.selectedFuelChargeToEdit.chargeRateUomid === item.id)];
      }
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
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + "T" + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }
  /*onSelectMethod2(event) {
    let d = new Date(Date.parse(event));
    this.myDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }*/
  selectNext() {
    let nextIndex = this.fuelChargesToEdit.findIndex(item => item.id === this.selectedFuelChargeToEdit.id);
    this.fuelChargesToEdit[nextIndex] = { ...this.selectedFuelChargeToEdit };
    if (nextIndex == this.fuelChargesToEdit.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedFuelCharge(this.fuelChargesToEdit[nextIndex]);
  }

  selectedFuelCharge(selectedFuelChargeToEdit: FuelChargeIndex) {
    this.selectedFuelChargeToEdit = { ...selectedFuelChargeToEdit };
    if (typeof this.selectedFuelChargeToEdit.effectiveStartDate === 'string') {
      this.selectedFuelChargeToEdit.effectiveStartDate = new Date(this.selectedFuelChargeToEdit.effectiveStartDate);
      this.selectedFuelChargeToEdit.effectiveEndDate = new Date(this.selectedFuelChargeToEdit.effectiveEndDate);
    }

    let m1 = moment(this.selectedFuelChargeToEdit.updateDateTimeBrowserStr).format('MMMM DD, YYYY hh:mm A');
    let timeZone = moment.tz.guess();
    var timeZoneOffset = new Date(this.selectedFuelChargeToEdit.updateDateTimeBrowserStr).getTimezoneOffset();
    timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

    this.lastUpdate = m1 + " " + timeZone;
    this.lastUpdatedBy = this.authService.currentUserValue.LoginId;
    

    if (this.fuelPriceTypeList.length) {
      this.fuelPriceType = [this.fuelPriceTypeList.find(item => this.selectedFuelChargeToEdit.fuelPriceTypeId === item.id)];
    }
    if (this.fuelPriceUOMList.length) {
      this.fuelPriceUOM = [this.fuelPriceUOMList.find(item => this.selectedFuelChargeToEdit.fuelPriceUomid === item.id)];
      this.chargeRateUom = [this.fuelPriceUOMList.find(item => this.selectedFuelChargeToEdit.chargeRateUomid === item.id)];
    }
  }

  removeFuelChargeFromEditList(fuelChargeToRemove: FuelChargeIndex) {
    this.fuelChargesToEdit.splice(this.fuelChargesToEdit.findIndex(item => item.id === fuelChargeToRemove.id), 1)
    this.selectedFuelCharges.emit(this.fuelChargesToEdit);
  }
  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }


}
