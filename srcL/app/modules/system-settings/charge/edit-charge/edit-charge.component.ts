import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { Charge } from '../../../../core/models/charge.model';
import { ChargeService } from '../../../../core/services/charge.service';
import { ChargeComponent } from '../../charge/charge.component';
import { ChargeCategoryComponent } from '../charge-category/charge-category.component';
import { ChargeTypeComponent } from '../charge-type/charge-type.component';
import { MapComputationMethodComponent } from '../map-computation-method/map-computation-method.component';
@Component({
  selector: 'app-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.css']
})
export class EditChargeComponent implements OnInit, AfterViewInit {
  @Input() chargesToEdit: Charge[];
  @Output('selectedCharges') selectedCharges = new EventEmitter<Charge[]>();
  @ViewChild(ChargeComponent, { static: false }) chargeComponent: ChargeComponent;
  status: string;
  chargeCategoryList = [];
  chargeTypeList = [];
  chargeDefaultComputationMethodList = [];
  chargeCategorySelected = [];
  chargeTypeSelected = [];
  chargeDefaultComputationMethodSelected = [];
  settings = {};
  modalRef: NgbModalRef;
  @Output('selectedChargeToEdit') selectedChargeInEdit = new EventEmitter<Charge>();
  selectedChargeToEdit: Charge = null;
  editNext: boolean;
  editscreen: boolean;
  constructor(public modalService: NgbModal,
    public chargeService: ChargeService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private router: Router) { }

  async ngOnInit() {
    //this.editscreen = true;
    //this.chargeComponent.buttonPermission(this.editscreen);

    if (this.chargesToEdit.length > 1) {
      this.editNext = true;
    }
    else {
      this.editNext = false;
    }
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
      searchBy: ['description'],
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
          if (this.selectedChargeToEdit && this.chargeCategoryList.length > 0 && this.selectedChargeToEdit.chargeCategoryId != null) {
            // set selected Charge Category
            this.chargeCategorySelected[0] = this.chargeCategoryList.find(x => x.id == this.selectedChargeToEdit.chargeCategoryId);
          }
        }
        );
    }
  }
  getChargeTypeList() {
    if (this.chargeTypeList.length == 0) {
      this.chargeService.getChargeTypeList()
        .subscribe(result => {
          this.chargeTypeList = result.data;

          if (this.selectedChargeToEdit && this.chargeTypeList.length > 0 && this.selectedChargeToEdit.chargeTypeId != null) {
            // set selected Charge Type
            this.chargeTypeSelected[0] = this.chargeTypeList.find(x => x.id == this.selectedChargeToEdit.chargeTypeId);
          }
        }
        );
    }
  }
  getChargeDefaultComputationMethodList() {
    this.chargeService.getChargeComputationMappingByChargeId(this.selectedChargeToEdit.id)
      .subscribe(result => {
        this.chargeDefaultComputationMethodList = result.data.map(c => ({
          id: c.chargeComputationMethodID,
          description: c.chargeComputationMethodDescription
        }));
        if (this.chargeDefaultComputationMethodList.length > 0 && this.selectedChargeToEdit.chargeComputationMethodId != null) {
          // set selected Charge Computation Method
          var matchedVal = this.chargeDefaultComputationMethodList.find(x => x.id == this.selectedChargeToEdit.chargeComputationMethodId);
          if (matchedVal) {
            this.chargeDefaultComputationMethodSelected[0] = matchedVal;
          }
        } else {
          this.chargeDefaultComputationMethodSelected = [];
        }
      }
      );
  }

  setSelectedChargeMapping() {
    if (this.selectedChargeToEdit) {
      
      if (this.chargeTypeList.length > 0 && this.selectedChargeToEdit.chargeTypeId != null) {
        // set selected Charge Type
        this.chargeTypeSelected[0] = this.chargeTypeList.find(x => x.id == this.selectedChargeToEdit.chargeTypeId);
      }
      if (this.chargeCategoryList.length > 0 && this.selectedChargeToEdit.chargeCategoryId != null) {
        // set selected Charge Category
        this.chargeCategorySelected[0] = this.chargeCategoryList.find(x => x.id == this.selectedChargeToEdit.chargeCategoryId);
      }
      this.getChargeDefaultComputationMethodList();

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

  selectedCharge(charge: Charge) {
    this.selectedChargeToEdit = Object.assign({}, charge);
    this.selectedChargeInEdit.emit(charge);
    this.setSelectedChargeMapping();
    this.status = this.selectedChargeToEdit.status;
  }

  refreshComponent(status) {
    let nextIndex = this.chargesToEdit.map(function (x) { return x.id; }).indexOf(this.selectedChargeToEdit.id);
    //if (nextIndex == this.chargesToEdit.length - 1) {
    //  nextIndex = 0;
    //} else {
    //  nextIndex += 1;
    //}
    var editcharge = this.chargesToEdit[nextIndex];
    editcharge.status = status;
    this.selectedCharge(editcharge);
    this.setSelectedChargeMapping();    
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

  async save() {
    var chargeToBeSaved = this.getUpdatedCharge();
    if (chargeToBeSaved == null) {
      this.toastrService.warning("Please fill all mandatory fields to save the record.");
      return false;
    }
    chargeToBeSaved.updatedBy = this.authenticationService.currentUserValue.LoginId;
    await this.chargeService.updateCharge(new Array(chargeToBeSaved)).toPromise()
      .then(result => {
        if (result.statusCode == 200) {

          var index = this.chargesToEdit.findIndex(x => x.id === chargeToBeSaved.id);
          this.chargesToEdit[index] = chargeToBeSaved;
          this.toastrService.success("The record is saved successfully.");
        }
      })
      .catch(() => this.toastrService.error("The record could not be saved. Please contact Tech Support."));
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

  async saveAndEditNext() {
    this.toastrService.info("Selecting next Charge to edit after saving changes, if any")
    if (await this.save()) {
      this.selectNext();
    }
  }

  removeChargeFromEditList(chargeToRemove: Charge) {
    this.chargesToEdit.splice(this.chargesToEdit.findIndex(item => item.id === chargeToRemove.id), 1)
    this.selectedCharges.emit(this.chargesToEdit);
  }
}
