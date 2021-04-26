import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuelChargeIndex } from '../../../../core/models/FuelChargeIndex.model';
import { ManageFuelChargeStateService } from '../fuelcharge-state.service';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-fuelsurcharge',
  templateUrl: './edit-fuelsurcharge.component.html',
  styleUrls: ['./edit-fuelsurcharge.component.css']
})
export class EditFuelsurchargeComponent implements OnInit {

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
  //selectedItemsA = [];
  settingsA = {
    singleSelection: true,
    text: 'Select',
    enableSearchFilter: true,
    badgeShowLimit: 1,
    labelKey: 'name'
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
      this.selectedFuelChargeToEdit.updateDateTimeBrowser = new Date();
      const reqBody = {
        ID: this.selectedFuelChargeToEdit.id,
        FuelPriceTypeId: this.selectedFuelChargeToEdit.fuelPriceTypeId,
        FromFuelPrice: +this.selectedFuelChargeToEdit.fromFuelPrice,
        ToFuelPrice: +this.selectedFuelChargeToEdit.toFuelPrice,
        FuelPriceUomid: this.selectedFuelChargeToEdit.fuelPriceUomid,
        ChargeRatePerMile: +this.selectedFuelChargeToEdit.chargeRatePerMile,
        ChargeRateUomid: this.selectedFuelChargeToEdit.chargeRateUomid,
        EffectiveStartDate: this.selectedFuelChargeToEdit.effectiveStartDate,
        EffectiveEndDate: this.selectedFuelChargeToEdit.effectiveEndDate,
        IsDeleted: this.selectedFuelChargeToEdit.isDeleted,
        UpdateDateTimeBrowser: this.selectedFuelChargeToEdit.updateDateTimeBrowser
      }
      this.fuelPriceService.updateSurChargeIndex(reqBody).subscribe(result => {
        
        this.toastrService.success("Saved successful.");
        if (moveNext) {
          this.selectNext();
        }
      }
      );
    } 
  }

  ngOnInit(): void {
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
    
    this.lastUpdatedOn = new Date(this.selectedFuelChargeToEdit.updateDateTimeBrowser || this.selectedFuelChargeToEdit.createDateTimeBrowser);

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
}
