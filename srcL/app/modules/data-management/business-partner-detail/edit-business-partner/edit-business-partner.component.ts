import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core';
import { BPByLocation, BPLocationFunction, BusinessConstant, BPByCarrier } from '../../../../core/models/BusinessPartner.model';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { AddEditAddressComponent } from '../../../../shared/components/modal-content/add-edit-address/add-edit-address.component';
import moment from 'moment';

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
  @Output("selectedBpInEdit") selectedBpInEdit = new EventEmitter<any>();
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
  clientId: number = 0;
  constructor(public modalService: NgbModal,
    public businessPartnerService: BusinessPartnerService,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private router: Router) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
    this.screenAction = BusinessConstant.ScreenAction;
  }


  ngOnInit(): void {
    
    this.getBussinessPartnerLocationFunctionList();
    this.setBpToEdit();
    this.settingsBpType = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: "name",
      searchBy: ['name']
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
  async selectedBPForEdit(bpSelected: any) {
    
    this.selectedBpToEdit = bpSelected;
    this.selectedBpInEdit.emit(bpSelected);
    if (this.bpTypeList && this.bpTypeList.length > 0) {
      var assoctatedBP = this.bpTypeList.find(x => x.id == this.selectedBpToEdit.locationFunctionID);
      if (assoctatedBP)
        this.selectedBpType[0] = assoctatedBP;
    }
    this.setSetupInformation();
    await this.getBusinessPartnerByLocation();
    var selectedEntry = this.BPList.filter(x => x.id == bpSelected.id)[0];
    this.setupDoneDateTime = selectedEntry.setupDoneDateTime;
    this.setupDoneBy = selectedEntry.setupDoneBy;
    if (this.bpTypeList && this.bpTypeList.length > 0) {
      var assoctatedBP = this.bpTypeList.find(x => x.id == selectedEntry.locationFunctionID);
      if (assoctatedBP)
        this.selectedBpType[0] = assoctatedBP;
    }
  }

  setSetupInformation() {
    this.setupDone = this.selectedBpToEdit.setupDone;
    this.setupDoneDateTime = this.selectedBpToEdit.setupDoneDateTime;
    this.setupDoneBy = this.selectedBpToEdit.setupDoneBy;
  }
  paginationModel = new BPByLocation();
  BPList: BPByLocation[] = [];
  async getBusinessPartnerByLocation() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.paginationModel.clientID = this.clientId;
    await this.businessPartnerService.getBPByLocation(this.paginationModel).toPromise().
      then(result => {
      this.BPList = result.data;
      
    });
  }
  setupDoneChangeFlag: boolean = false;
  setupDoneDateTimetoDisplay;
  setupChange(value: any) {
    if (value.currentTarget.checked) {
      this.setupDoneDateTime = new Date();
      //let m2 = moment(this.setupDoneDateTime).format('MMMM DD, YYYY hh:mm A');
      //let timeZone1 = moment.tz.guess();
      //var timeZoneOffset1 = new Date(this.setupDoneDateTime).getTimezoneOffset();
      //timeZone1 = moment.tz.zone(timeZone1).abbr(timeZoneOffset1);

      ////this.lastUpdate = m1 + " " + timeZone;

      //this.setupDone = value.currentTarget.checked;
      //this.setupDoneDateTimetoDisplay = m2 + " " + timeZone1;
      this.setupDoneChangeFlag = true;


      //this.setupDoneDateTime = this.selectedBpToEdit.setupDoneDateTime ? this.selectedBpToEdit.setupDoneDateTime : new Date();
      this.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
    }
  }
  getRowsToEdit() {
    return this.selectedBPs;
  }

  onBpTypeSelect(item: any) {
   // console.log(item);
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
    this.toastrService.info("Records updated successfully.")
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
        this.toastrService.warning("Please fill all mandatory fields to save the record.");
        return false;
      }
      await this.businessPartnerService.updateBPByCarrier(updateCarrier).toPromise()
        .then(result => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("The record is saved successfully.");
            this.selectedBpToEdit.setupDone = this.setupDone;
            this.selectedBpToEdit.updateDateTimeBrowser = updateCarrier.updateDateTimeBrowser;
            this.selectedBpToEdit.updatedBy = updateCarrier.updatedBy;
          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support.");
          }
        })
        .catch(() => this.toastrService.error("The record could not be saved. Please contact Tech Support."));
      return true;
    } else if (this.selectedBpToEdit.businessPartnerTypeName === 'Business Partner') {
     
      var saveObj = this.getUpdatedBpByLocation();
      if (saveObj == null) {
        this.toastrService.warning("Please fill all mandatory fields to save the record.");
        return false;
      }
      await this.businessPartnerService.updateBPByLocation(saveObj).toPromise()
        .then(result => {
          if (result.statusCode == 200 && result.data) {
            this.selectedBpToEdit.setupDone = this.setupDone;
            this.selectedBpToEdit.updateDateTimeBrowser = saveObj.updateDateTimeBrowser;
            this.selectedBpToEdit.updatedBy = saveObj.updatedBy;
            this.toastrService.success("The record is saved successfully.");
          } else {
            this.toastrService.error("The record could not be saved. Please contact Tech Support.");
          }
        })
        .catch(() => this.toastrService.error("The record could not be saved. Please contact Tech Support."));
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
    if (this.setupDoneChangeFlag) {
      bpByCarrierToSave.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      bpByCarrierToSave.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date());
    }
    else {
      bpByCarrierToSave.setupDoneBy = this.selectedBpToEdit.setupDoneBy;
      bpByCarrierToSave.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date(this.selectedBpToEdit.setupDoneDateTime));
    }

    bpByCarrierToSave.setupDone = this.setupDone;
    bpByCarrierToSave.setupDoneDateTime = this.setupDoneDateTime;
    bpByCarrierToSave.updateDateTimeBrowserSave = this.convertDatetoStringDate(new Date());
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
    bpByLocaionToSave.updateDateTimeBrowserSave = this.convertDatetoStringDate(new Date());
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

    if (this.setupDoneChangeFlag) {
      bpByLocaionToSave.setupDoneBy = this.authenticationService.currentUserValue.LoginId;
      bpByLocaionToSave.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date());
    }
    else {
      bpByLocaionToSave.setupDoneBy = this.selectedBpToEdit.setupDoneBy;
      bpByLocaionToSave.setupDoneDateTimeSave = this.convertDatetoStringDate(new Date(this.selectedBpToEdit.setupDoneDateTime));
    }

    
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
  convertDatetoStringDate(selectedDate: Date) {

    var date = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();

    var hours = selectedDate.getHours();
    var minuts = selectedDate.getMinutes();
    var seconds = selectedDate.getSeconds();

    return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();



  }
}
