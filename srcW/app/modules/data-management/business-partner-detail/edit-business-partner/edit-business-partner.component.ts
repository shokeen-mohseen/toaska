import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { BPByLocation, BPLocationFunction, BusinessConstant, BPByCarrier } from '../../../../core/models/BusinessPartner.model';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { AddEditAddressComponent } from '../../../../shared/components/modal-content/add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-edit-business-partner',
  templateUrl: './edit-business-partner.component.html',
  styleUrls: ['./edit-business-partner.component.css']
})
export class EditBusinessPartnerComponent implements OnInit {

  modalRef: NgbModalRef;

  @Input("isCarrierTab") isCarrierTab: boolean;
  @Input("selectedBP") selectedBPs: any[] = [];
  @Output("bpInEdit") bpInEdit = new EventEmitter<any[]>();
  preferredMaterialListCount: number = 0;
  preferredEquipmentListCount: number = 0;
  addressCount: number = 0;
  contractCount: number = 0;
  defaultPalletCount: number = 0;
  selectedBpToEdit: any;
  pageActionType: string;
  screenAction: string;
  setupDone = false;
  setupDoneDateTime;
  setupDoneBy = "" ;
  bpTypeList: BPLocationFunction[] = [];
  bpTypeListExclusionList = ["Carrier", "CustomerLocation", "RTNFIN"];
  selectedBpType: BPLocationFunction[] = [];
  settingsBpType = {};
  contactCount = 0;
  statOfCharacteristics: string = "(0/0)";

  constructor(public modalService: NgbModal,
    private businessPartnerService: BusinessPartnerService,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private router: Router) {
    
    this.screenAction = BusinessConstant.ScreenAction;
  }


  ngOnInit(): void {
    this.setBpToEdit();
    this.getBussinessPartnerLocationFunctionList();

    this.settingsBpType = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: "name"
    };

    if (this.selectedBpToEdit.businessPartnerTypeName === 'Carrier') {
      this.pageActionType = BusinessConstant.PageActionCarrier;
    }
    else {
      this.pageActionType = BusinessConstant.PageActionBP;
    }

  }
  getBussinessPartnerLocationFunctionList() {
    var requestObj = {
      clientId: this.authenticationService.currentUserValue.ClientId
    }
    this.businessPartnerService.getLocationFunctionList(requestObj)
      .subscribe(result => {
        if (!!result.data && this.selectedBpToEdit) {
          // ignore Carrier in this list if we are editing a BP by Location
          this.bpTypeList = this.isCarrierTab ? result.data
                            : result.data.filter(x => !this.bpTypeListExclusionList.includes(x.code));
          var assoctatedBP = this.bpTypeList.find(x => x.id == this.selectedBpToEdit.locationFunctionID);
          if (assoctatedBP)
            this.selectedBpType[0] = assoctatedBP;
        }
      }
    );
  }
  selectedBPForEdit(bpSelected: any) {
    this.selectedBpToEdit = bpSelected;
    if (this.bpTypeList && this.bpTypeList.length > 0) {
      var assoctatedBP = this.bpTypeList.find(x => x.id == this.selectedBpToEdit.locationFunctionID);
      if (assoctatedBP)
        this.selectedBpType[0] = assoctatedBP;
    }
    this.setSetupInformation();
  }

  setSetupInformation() {
    this.setupDone = this.selectedBpToEdit.setupDone;
    this.setupDoneDateTime = this.selectedBpToEdit.setupDoneDateTime;
    this.setupDoneBy = this.selectedBpToEdit.setupDoneBy;
  }

  setupChange(value: any) {
    if (value.currentTarget.checked) {
      this.setupDoneDateTime = this.selectedBpToEdit.setupDoneDateTime ? this.selectedBpToEdit.setupDoneDateTime : new Date();
      this.setupDoneBy = this.selectedBpToEdit.setupDoneBy ? this.selectedBpToEdit.setupDoneBy : this.authenticationService.currentUserValue.LoginId;
    }
  }
  getRowsToEdit() {
    return this.selectedBPs;
  }

  onBpTypeSelect(item: any) {
    console.log(item);
  }

  async setBpToEdit() {
    if (this.selectedBPs && this.selectedBPs.length > 0) {
      this.selectedBPForEdit(this.selectedBPs[0]);
      var defaultCount = await this.businessPartnerService.getMaxEditedRecordsCount();
      this.selectedBPs = this.selectedBPs.slice(0, defaultCount);
      this.bpInEdit.emit(this.selectedBPs);
    }
  }

  removeBpFromEditList(itemToRemove: any) {
    this.selectedBPs.splice(this.selectedBPs.findIndex(item => item.id === itemToRemove.id), 1);
    this.bpInEdit.emit(this.selectedBPs);
  }
  async saveAndNextBusinessPartner() {
    this.toastrService.info("Selecting next Business Partner to edit after saving changes, if any.")
    if (await this.saveBusinessPartner()) {
      this.selectNext();
    }
  }

  selectNext() {
    let nextIndex = this.selectedBPs.map(function (x) { return x.id; }).indexOf(this.selectedBpToEdit.id);
    if (nextIndex == this.selectedBPs.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedBPForEdit(this.selectedBPs[nextIndex]);
  }

  async saveBusinessPartner() {
    if (this.selectedBpToEdit.businessPartnerTypeName === 'Carrier') {
      var updateCarrier = this.getUpdatedBpByCarrier();
      if (updateCarrier == null) {
        this.toastrService.error("Please fill all mandatory fields to save.");
        return false;
      }
      await this.businessPartnerService.updateBPByCarrier(updateCarrier).toPromise()
        .then(result => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("Saved successful.");
            this.selectedBpToEdit.setupDone = this.setupDone;
          } else {
            this.toastrService.error("Saving failed. Please try again later.");
          }
        })
        .catch(() => this.toastrService.error("Saving failed. Please try again later."));
      return true;
    } else if (this.selectedBpToEdit.businessPartnerTypeName === 'Business Partner') {
     
      var saveObj = this.getUpdatedBpByLocation();
      if (saveObj == null) {
        this.toastrService.error("Please fill all mandatory fields to save.");
        return false;
      }
      await this.businessPartnerService.updateBPByLocation(saveObj).toPromise()
        .then(result => {
          if (result.statusCode == 200 && result.data) {
            this.selectedBpToEdit.setupDone = this.setupDone;
            this.selectedBpToEdit.updateDateTimeBrowser = saveObj.updateDateTimeBrowser;
            this.selectedBpToEdit.updatedBy = saveObj.updatedBy;
            this.toastrService.success("Saved successful.");
          } else {
            this.toastrService.error("Saving failed. Please try again later.");
          }
        })
        .catch(() => this.toastrService.error("Saving failed. Please try again later."));
      return true;
    }
  }

  getUpdatedBpByCarrier() {
    var bpByCarrierToSave = new BPByCarrier()
    bpByCarrierToSave.businessPartnerID = this.selectedBpToEdit.businessPartnerId;
    bpByCarrierToSave.updateDateTimeBrowser = new Date();
    bpByCarrierToSave.updatedBy = this.authenticationService.currentUserValue.LoginId;

    if (!this.selectedBpToEdit.setupDone && this.setupDone) {
      this.selectedBpToEdit.setupDoneDateTime = new Date();
      this.setupDoneDateTime = new Date();
      bpByCarrierToSave.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      this.selectedBpToEdit.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
    }

    if (this.selectedBpToEdit.setupDone && !this.setupDone) {
      this.selectedBpToEdit.setupDoneDateTime = null;
      this.setupDoneDateTime = null;
      bpByCarrierToSave.setupDoneBy = null;
      this.selectedBpToEdit.setupDoneBy = null;
    }
    bpByCarrierToSave.setupDone = this.setupDone;
    bpByCarrierToSave.setupDoneDateTime = this.setupDoneDateTime;
    return bpByCarrierToSave;
  }
  getUpdatedBpByLocation() {
    var bpByLocaionToSave = new BPByLocation()
    bpByLocaionToSave.businessPartnerID = this.selectedBpToEdit.businessPartnerId;
    bpByLocaionToSave.locationFunctionID = this.selectedBpType[0]?.id;
    bpByLocaionToSave.loadingComment = this.selectedBpToEdit.loadingComment
                                        ? this.selectedBpToEdit.loadingComment.trim() : '';
    bpByLocaionToSave.transportationComment = this.selectedBpToEdit.transportationComment
                                              ? this.selectedBpToEdit.transportationComment.trim() : '';
    bpByLocaionToSave.updateDateTimeBrowser = new Date();
    bpByLocaionToSave.updatedBy = this.authenticationService.currentUserValue.LoginId;
    
    if (!this.selectedBpToEdit.setupDone && this.setupDone) {
      this.selectedBpToEdit.setupDoneDateTime = new Date();
      this.setupDoneDateTime = new Date();
      bpByLocaionToSave.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      this.selectedBpToEdit.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
    }

    if (this.selectedBpToEdit.setupDone && !this.setupDone) {
      this.selectedBpToEdit.setupDoneDateTime = null;
      this.setupDoneDateTime = null;
      bpByLocaionToSave.setupDoneBy = null;
      this.selectedBpToEdit.setupDoneBy = null; 
    }
    bpByLocaionToSave.setupDone = this.setupDone;
    bpByLocaionToSave.setupDoneDateTime = this.setupDoneDateTime;
    
    if (this.isBpByLocationFormValid(bpByLocaionToSave)) {
      return bpByLocaionToSave;
    } else {
      return null;
    }

  }

  isBpByLocationFormValid(bpByEditModel: BPByLocation) {
    if (bpByEditModel.locationFunctionID) {
      return true;
    }
    return false;
  }
  getPreferredMaterialCount(value: any) {
    this.preferredMaterialListCount = value;
  }

  setContactCount(value: number) {
    this.contactCount = value;
  }
  getDefaultPalletCount(value: any) {
    this.defaultPalletCount = value;
  }
  getpreferredEquipmentCount(value: any) {
    this.preferredEquipmentListCount = value;
  }
  getAddressCount(value: any) {
    this.addressCount = value;
  }

  getContractCount(value: any) {
    this.contractCount = value;
  }

  setStatOfCharacteristics(value: string) {
    this.statOfCharacteristics = value;
  }
}
