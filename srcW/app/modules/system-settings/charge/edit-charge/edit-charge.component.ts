import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChargeTypeComponent } from '../charge-type/charge-type.component';
import { ChargeCategoryComponent } from '../charge-category/charge-category.component';
import { MapComputationMethodComponent } from '../map-computation-method/map-computation-method.component';
import { Router } from '@angular/router';
import { Charge, ChargeType, ChargeCategory, ChargeMapComputationMethod } from '../../../../core/models/charge.model';
import { ChargeService } from '../../../../core/services/charge.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';

@Component({
  selector: 'app-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.css']
})
export class EditChargeComponent implements OnInit, AfterViewInit {
  @Input() chargesToEdit: Charge[];
  @Output('selectedCharges') selectedCharges = new EventEmitter<Charge[]>();

  chargeCategoryList = [];
  chargeTypeList = [];
  chargeDefaultComputationMethodList = [];
  chargeCategorySelected = [];
  chargeTypeSelected = [];
  chargeDefaultComputationMethodSelected = [];
  settings = {};
  modalRef: NgbModalRef;
  selectedChargeToEdit: Charge = null;


  constructor(public modalService: NgbModal,
    private chargeService: ChargeService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private router: Router) { }

  async ngOnInit(){
    await this.setChargesToEdit();
    // set the first charge to edit by default
    this.selectedCharge(this.chargesToEdit[0]);
    this.getChargeCategoryList();
    this.getChargeTypeList();
    this.getChargeDefaultComputationMethodList();
    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: "description",
      noDataLabel: "No Data Available"
    };
  }

  ngAfterViewInit(): void {
  }

  async setChargesToEdit() {
    var defaultCount = await this.chargeService.getMaxEditedRecordsCount();
    this.chargesToEdit = this.chargesToEdit.slice(0, defaultCount);
    this.selectedCharges.emit(this.chargesToEdit);
  }
  getChargeCategoryList() {
    if (this.chargeCategoryList.length == 0) {
      this.chargeService.getChargeCategoryList()
        .subscribe(result => {
          this.chargeCategoryList = result.data;
          this.setSelectedChargeMapping();
        }
      );
    }
  }
  getChargeTypeList() {
    if (this.chargeTypeList.length == 0) {
      this.chargeService.getChargeTypeList()
        .subscribe(result => {
          this.chargeTypeList = result.data;
          this.setSelectedChargeMapping();
        }
      );
    }
  }
  getChargeDefaultComputationMethodList() {
    if (this.chargeDefaultComputationMethodList.length == 0) {
      this.chargeService.getChargeComputationMethodList()
        .subscribe(result => {
          this.chargeDefaultComputationMethodList = result.data;
          this.setSelectedChargeMapping();
        }
      );
    }
  }

  setSelectedChargeMapping() {
    if (this.selectedChargeToEdit) {
      if (this.chargeCategoryList.length > 0 && this.selectedChargeToEdit.chargeCategoryId != null) {
        // set selected Charge Category
        this.chargeCategorySelected[0] = this.chargeCategoryList.find(x => x.id == this.selectedChargeToEdit.chargeCategoryId);
      }
      if (this.chargeTypeList.length > 0 && this.selectedChargeToEdit.chargeTypeId != null) {
        // set selected Charge Type
        this.chargeTypeSelected[0] = this.chargeTypeList.find(x => x.id == this.selectedChargeToEdit.chargeTypeId);
      }
      if (this.chargeDefaultComputationMethodList.length > 0 && this.selectedChargeToEdit.chargeComputationMethodId != null)  {
        // set selected Charge Computation Method
        this.chargeDefaultComputationMethodSelected[0] = this.chargeDefaultComputationMethodList.find(x => x.id == this.selectedChargeToEdit.chargeComputationMethodId);
      }


    }
  }

  onDropdownSelect(item: any) {
   
  }

  selectNext() {
    let nextIndex = this.chargesToEdit.map(function (x) { return x.id; }).indexOf(this.selectedChargeToEdit.id);
    if (nextIndex == this.chargesToEdit.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedCharge(this.chargesToEdit[nextIndex]);
    this.setSelectedChargeMapping();
  }

  selectedCharge(selectedChargeToEdit: Charge) {
    this.selectedChargeToEdit = Object.assign({}, selectedChargeToEdit);
  }

  chargetype() {
    this.modalRef = this.modalService.open(ChargeTypeComponent, { size: 'lg', backdrop: 'static' });
  }

  chargecategry() {
    this.modalRef = this.modalService.open(ChargeCategoryComponent, { size: 'lg', backdrop: 'static' });
  }

  mapcomputation() {
    this.modalRef = this.modalService.open(MapComputationMethodComponent, { size: 'xl', backdrop: 'static' });
  }

  closeTab() {
    this.router.navigateByUrl('/system-settings/charge');
  }

  domesticSelected() {
    this.selectedChargeToEdit.domesticOnly = true;
    this.selectedChargeToEdit.exportOnly = false;
    this.selectedChargeToEdit.domesticExportBoth = false;
  }
  exportSelected() {
    this.selectedChargeToEdit.domesticOnly = false;
    this.selectedChargeToEdit.exportOnly = true;
    this.selectedChargeToEdit.domesticExportBoth = false;
  }
  bothSelected() {
    this.selectedChargeToEdit.domesticOnly = false;
    this.selectedChargeToEdit.exportOnly = false;
    this.selectedChargeToEdit.domesticExportBoth = true;
  }

  save() {
    var chargeToBeSaved = this.getUpdatedCharge();
    if (chargeToBeSaved == null) {
      this.toastrService.error("Please fill all mandatory fields to save.");
      return false;
    }
    chargeToBeSaved.updatedBy = this.authenticationService.currentUserValue.LoginId;
    this.chargeService.updateCharge(new Array(chargeToBeSaved)).subscribe(result => {
      if (result.statusCode == 200) {
        this.toastrService.success("Saved successful.")
      } else {
        this.toastrService.error("Saving failed. Please try again later.");
      }
    }
    );
    return true;
  }

  getUpdatedCharge() {
    this.selectedChargeToEdit.chargeCategoryId = this.chargeCategorySelected[0]?.id;
    this.selectedChargeToEdit.chargeTypeId = this.chargeTypeSelected[0]?.id;
    this.selectedChargeToEdit.chargeComputationMethodId = this.chargeDefaultComputationMethodSelected[0]?.id;
    this.selectedChargeToEdit.updateDateTimeBrowser = new Date();
    if (this.isFormValid()) {
      return this.selectedChargeToEdit;
    } else {
      return null;
    }
    
  }

  isFormValid() {
    if (this.selectedChargeToEdit.chargeCategoryId == 0
      || this.selectedChargeToEdit.chargeTypeId == 0
      || this.selectedChargeToEdit.chargeComputationMethodId == 0
      || this.chargeCategorySelected.length == 0
      || this.chargeTypeSelected.length == 0
      || this.chargeDefaultComputationMethodSelected.length == 0) {
      return false;
    }
    return true;
  }

  saveAndEditNext() {
    this.toastrService.info("Selecting next Charge to edit after saving changes, if any.")
    if (this.save()) {
      this.selectNext();
    }
  }

  removeChargeFromEditList(chargeToRemove: Charge) {
    this.chargesToEdit.splice(this.chargesToEdit.findIndex(item => item.id === chargeToRemove.id), 1)
    this.selectedCharges.emit(this.chargesToEdit);
  }
}
