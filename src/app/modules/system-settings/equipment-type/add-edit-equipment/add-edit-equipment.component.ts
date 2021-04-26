import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EquipmentTypeAEModel, EquipmentTypeCheckModel, FreightModeEquipmentTypeMapModel, EquipmentTypeSaveModel, EquipmentViewModel, EquipmentTypeFreightModeMapModel, FreightModeEquipmentTypeModel } from '../../../../core/models/Equipment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { FreightMode } from '../../modals/freightmode';
import { EquipmentService } from '../../../../core/services/equipment.service';
import { UpdateTblPopupComponent } from '../../../../shared/components/update-tbl-popup/update-tbl-popup.component';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-add-edit-equipment',
  templateUrl: './add-edit-equipment.component.html',
  styleUrls: ['./add-edit-equipment.component.css']
})
export class AddEditEquipmentComponent implements OnInit {
  //equipmentTypeForm: FormGroup;
  //equipment: NgForm;
  equipmentCode = '';
  dataSourceAE: EquipmentTypeAEModel[] = [];
  equipmentAEModel: EquipmentTypeAEModel = new EquipmentTypeAEModel();
  equipmentTypeCheckmodel: EquipmentTypeCheckModel = new EquipmentTypeCheckModel();
  equipmentTypeSaveModel: EquipmentTypeSaveModel = new EquipmentTypeSaveModel();
  freightModeEquipmentTypeMapS: FreightModeEquipmentTypeModel = new FreightModeEquipmentTypeModel();
  freightModeEquipmentTypeMapDS: FreightModeEquipmentTypeModel[] = [];
  /////// from here////////////
  isDisabledContent: boolean = true;
  freightModel: FreightMode = new FreightMode();
  selectedEquipmentTypeToEdit: EquipmentViewModel = new EquipmentViewModel();
  equipmentTypesEdit: EquipmentViewModel[] = [];
  @Input() equipmentTypesToEdit: EquipmentViewModel[] = [];
  @Output('selectedEquipmentTypes') selectedEquipmentTypes = new EventEmitter<EquipmentViewModel[]>();
  freightsByID: EquipmentTypeFreightModeMapModel = new EquipmentTypeFreightModeMapModel();
  equipmentTypeFreightModeMapModel: EquipmentTypeFreightModeMapModel = new EquipmentTypeFreightModeMapModel();
  equipmentTypeFreightModeMapModelDS: EquipmentTypeFreightModeMapModel[] = [];
  modalRef: NgbModalRef;
  currentUser: User;
  freightList = [];
  freightListItem = [];
  freightListItem1 = [];
  next: number = 0;
  Dataindex: number = 0;
  equipmentMaterial: boolean = false;
  @Input() addPage: boolean;
  @Input() editPage: boolean;
  @Input() selectedIdsfromList: string;
  Inactive: boolean;

  constructor(public equipmentService: EquipmentService,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private authenticationService: AuthService) {
    //this.createForm();
  }

  settingsA = {};
  countA = 3;

  onSubmit() {
  }

  async ngOnInit() {
    //if (this.addPage) { this.isDisabledContent = true; }
    
    this.equipmentMaterial = false;
    this.currentUser = this.authenticationService.currentUserValue;
    this.freightModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.Inactive = this.equipmentService.permission == false ? true : false; 
    this.freightModel.pageSize = 0;
    this.getfreightlist();
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['itemName'],
      badgeShowLimit: 3,
      enableCheckAll: false,
      noDataLabel: "No Data Available"
    };
    if (this.editPage) {
      await this.setEquipmentsToEdit();
      this.freightsByID.clientID = this.authenticationService.currentUserValue.ClientId;
      this.selectedEquipmentType(this.equipmentTypesToEdit[0], 0);
      var check = this.selectedIdsfromList;
      this.isDisabledContent = false;
    }

  }

  //onAddItem(data: string) {
  //  this.countA++;
  //  //this.itemListA.push({ "id": this.countA, "itemName": data });
  //  //this.selectedItemsA.push({ "id": this.countA, "itemName": data });
  //}
  //onItemSelect(item: any) {

  //  this.freightListItem;
  //}
  //OnItemDeSelect(item: any) {
  //  console.log(item);
  //  //console.log(this.userData);
  //}
  //onSelectAll(items: any) {
  //  console.log(items);
  //}
  //onDeSelectAll(items: any) {
  //  console.log(items);
  //}

  openAccordion(action) {
    if (action === "equipmentMaterial") {

      this.equipmentMaterial = !this.equipmentMaterial;

    }
  }

  //createForm() {    
  //  this.equipmentTypeForm = this.fb.group({
  //    eqCode: ['', Validators.required],
  //    tmsCode: ['', Validators.required],
  //    eqName: ['', Validators.required],
  //    eqMaxPQty: ['', Validators.required],      
  //    eqfrghtmap: [[], Validators.required],
  //    eqLeFillPQty: ['', Validators.required]
  //  });
  //}

  async getSelectedFreightsByEquipmentID() {
    await this.equipmentService.getFreightsByEquipmentTypeID(this.freightsByID).toPromise().then
      (result => {
        if (result.data != null || result.data != undefined) {
          let datalist: any[] = result.data;
          for (let i = 0; i < datalist.length; i++) {
            this.freightListItem1.push({
              id: datalist[i].freightModeID,
              itemName: datalist[i].freightModeDescription
            });
          }

        }
        
      });

  }

  getfreightlist() {
    this.equipmentService.getAll(this.freightModel).subscribe(result => {
      if (result.data != null || result.data != undefined) {
        let datalist: any[] = result.data;
        for (let i = 0; i < datalist.length; i++) {
          this.freightList.push({
            id: datalist[i].id,
            itemName: datalist[i].description
          });
        }
      }
    });
  }

  async setEquipmentsToEdit() {
    var defaultCount = await this.equipmentService.getMaxEditedRecordsCount();
    this.equipmentTypesToEdit = this.equipmentTypesToEdit.slice(0, defaultCount);
    this.selectedEquipmentTypes.emit(this.equipmentTypesToEdit);
  }

  public onSetupSaveStatusChanged(value: boolean) {
    this.selectedEquipmentTypeToEdit.setupComplete = value;
    if (value) {
      this.selectedEquipmentTypeToEdit.setupCompleteDateTime = new Date();
    }
    else {
      this.selectedEquipmentTypeToEdit.setupCompleteDateTime = null;
    }
  }

  setFreightDataModel(item: any) {
    this.freightModeEquipmentTypeMapS = {
      freightModeId: item.id,
      clientId: this.currentUser.ClientId,
      isDeleted: false,
      sourceSystemId: this.currentUser.SourceSystemID,
    } as FreightModeEquipmentTypeModel;
    this.freightModeEquipmentTypeMapDS.push(this.freightModeEquipmentTypeMapS);
  }

  setEquipmentDataModel(AcceptName: string) {
    this.freightModeEquipmentTypeMapDS = [];
    if (AcceptName.trim() == "") {
      this.toastr.error("Please fill mandatory fields.");
      return false;
    }
    this.freightListItem.forEach(item => {
      this.setFreightDataModel(item);
    });
    this.selectedEquipmentTypeToEdit.name = AcceptName;
    this.selectedEquipmentTypeToEdit.description = this.selectedEquipmentTypeToEdit.name;
    this.selectedEquipmentTypeToEdit.equipmentMappingwithFreightModes = null;
    this.selectedEquipmentTypeToEdit.freightmodeEquipmentTypeMappingViewModel = this.freightModeEquipmentTypeMapDS;
    this.selectedEquipmentTypeToEdit.isDeleted = false;
    this.selectedEquipmentTypeToEdit.clientId = this.currentUser.ClientId;
    this.selectedEquipmentTypeToEdit.sourceSystemId = this.currentUser.SourceSystemID;
    this.selectedEquipmentTypeToEdit.updateDateTimeBrowser = new Date(new Date().toUTCString());
    this.selectedEquipmentTypeToEdit.updateDateTimeBrowserStr = new Date().toUTCString();
    this.selectedEquipmentTypeToEdit.updateDateTimeServer = new Date();
    this.selectedEquipmentTypeToEdit.createDateTimeBrowser = new Date();
    this.selectedEquipmentTypeToEdit.createDateTimeServer = new Date();
    this.selectedEquipmentTypeToEdit.updatedBy = this.currentUser.LoginId;
    this.selectedEquipmentTypeToEdit.createdBy = this.currentUser.LoginId;
    return true;
  }

  async saveServiceCall() {
    await this.equipmentService.saveEquipmentType(new Array(this.selectedEquipmentTypeToEdit)).subscribe(async x => {
      if (x.data.length != 0) {
        //this.equipmentTypeCheckmodel = null;
        //this.Dataindex = null;
        //let Index = this.equipmentTypesToEdit.map(function (x) { return x.code; }).indexOf(this.equipmentTypeCheckmodel.code);
        //this.equipmentTypesToEdit.splice(Index, 1, x.data);
        //this.equipmentTypeCheckmodel = x.data;
        this.equipmentTypesToEdit.push(x.data[0]);
        this.equipmentTypeCheckmodel = x.data[0];
        this.freightListItem = [];
        this.freightListItem1 = [];
        this.freightModeEquipmentTypeMapDS = [];

        if (this.nextAddFlag==0) {
          this.freightsByID.clientID = this.currentUser.ClientId;
          this.freightsByID.equipmentTypeID = this.equipmentTypeCheckmodel.id;
          await this.getSelectedFreightsByEquipmentID();
          this.freightListItem = this.freightListItem1;
        }
        
        this.toastr.success('Saved successfully');
        this.nextAddFlag = 0;
      }
      else {
        this.freightListItem = [];
        this.freightListItem1 = [];
        this.freightModeEquipmentTypeMapDS = [];
        this.toastr.info('Equipment already exists.');
      }
    });
  }

  async saveEquipmentType() {
    this.isDisabledContent = false;
    this.setEquipmentDataModel(this.selectedEquipmentTypeToEdit.name);
    if (this.editPage) {
      await this.IsExistCheckAndSave();
    }
    else {
      this.nextAddFlag = 0;
      await this.saveServiceCall();
    }
  }

  nextAddFlag: number=0;
  async saveNextEquipment() {
    this.nextAddFlag = 1;
    this.isDisabledContent = true;
    if (await this.nextSave()) {
      this.clearSelction();
    }
  }

  async nextSave() {
    var equipmentToBeSaved = this.setEquipmentDataModel(this.selectedEquipmentTypeToEdit.name);
    if (equipmentToBeSaved == false) {
      this.toastr.error("Please fill all mandatory fields to save the record");
      return false;
    }
    await this.saveServiceCall();
    //await this.IsExistCheckAndSaveAddversion();
    return true;
  }

  clearSelction() {
    this.freightListItem = [];
    this.freightListItem1 = [];
    this.freightModeEquipmentTypeMapDS = [];
    this.selectedEquipmentTypeToEdit.code = "";
    this.selectedEquipmentTypeToEdit.name = "";
    this.selectedEquipmentTypeToEdit.maxPalletQty = null;
    this.selectedEquipmentTypeToEdit.leastFillPalletQty = null;
    this.selectedEquipmentTypeToEdit.tmsCode = "";
    this.selectedEquipmentTypeToEdit.setupComplete = false;
    this.selectedEquipmentTypeToEdit.setupCompleteDateTime = null;
    this.selectedEquipmentTypeToEdit.updatedBy = null;
  }
  //async IsExistCheckAndSave() {
  //  await this.equipmentService.isEquipmentTypeExist(this.selectedEquipmentTypeToEdit).toPromise().then(result => {
  //    if (result != null && result.data != null) {
  //      var idcheck = this.equipmentTypeCheckmodel.id;
  //      var id = result.data.id;
  //      if (id === idcheck || idcheck === undefined) {
  //        this.commonPopUpCall();
  //      }
  //      else {
  //        this.toastr.info('Equipment already exists.');
  //      }
  //    }
  //    else {
  //      this.saveServiceCall();
  //      this.toastr.success('Saved successfully');
  //    }
  //  })
  //}


  //async IsExistCheckAndSaveAddversion() {
  //  await this.equipmentService.isEquipmentTypeExist(this.selectedEquipmentTypeToEdit).toPromise().then(async result => {
  //    if (result != null && result.data != null) {        
  //      var idcheck = this.equipmentTypeCheckmodel.id;
  //      var id = result.data.id;
  //      if (id === idcheck || idcheck === undefined) {
  //        this.commonPopUpCallAddversion();
  //      }
  //      else {
  //        this.toastr.info('Equipment already exists.');
  //      }
  //    }
  //    else {
  //      this.saveServiceCall();
  //      this.toastr.success('Saved successfully');
  //    }
  //  })
  //}

  async IsExistCheckAndSave() {
    var save = false;
    await this.equipmentService.isEquipmentTypeExist(this.selectedEquipmentTypeToEdit).toPromise().then(async result => {
      if (result != null && result.data != null) {
        var id = result.data.id
        if (id === this.selectedEquipmentTypeToEdit.id) {
          await this.commonPopUpCall();
        }
        else {
          this.toastr.info('Equipment already exists.');
        }
      }
      else {
        save = true;
      }
    });
    if (save) {
      await this.editSaveData();
      this.toastr.success('Updated successfully');
    }
  }

  //commonPopUpCallAddversion() {
  //  this.modalRef = this.modalService.open(UpdateTblPopupComponent, { size: 'lg', backdrop: 'static' });
  //  this.modalRef.result.then((result) => {
  //    this.editSaveDataAddversion();
  //    this.toastr.success('Updated successfully');
  //  }, (reason) => {
  //  });
  //}

  //async editSaveDataAddversion() {
  //  await this.equipmentService.updateEquipmentType(this.selectedEquipmentTypeToEdit).toPromise().then(x => {
  //    if (this.equipmentTypesToEdit.length == 0) {
  //      this.equipmentTypesToEdit.push(x.data);
  //      this.equipmentTypeCheckmodel = x.data;
  //    }
  //    else {
  //      let Index = this.equipmentTypesToEdit.map(function (x) { return x.code; }).indexOf(this.equipmentTypeCheckmodel.code);
  //      this.equipmentTypesToEdit.splice(Index, 1, x.data);
  //      this.equipmentTypeCheckmodel = x.data;
  //    }

  //  });
  //}

  async commonPopUpCall() {
    var edit = false;
    this.modalRef = this.modalService.open(UpdateTblPopupComponent, { size: 'lg', backdrop: 'static' });
    await this.modalRef.result.then((result) => {
      edit = true;
    }, (reason) => {
    });
    if (edit) {
      await this.editSaveData();
      this.toastr.success('Updated successfully');
    }
  }

  async editSaveData() {
    await this.equipmentService.updateEquipmentType(this.selectedEquipmentTypeToEdit).toPromise().then(x => {
      this.equipmentTypesToEdit.splice(this.Dataindex, 1, x.data);
    });
  }

  async saveAndEditNext() {
    this.toastr.info("Selecting next equipment to edit after saving changes, if any.")
    if (await this.save()) {
      this.selectNext();
    }
  }

  selectNext() {
    let nextIndex = this.equipmentTypesToEdit.map(function (x) { return x.id; }).indexOf(this.selectedEquipmentTypeToEdit.id);
    if (nextIndex == this.equipmentTypesToEdit.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedEquipmentType(this.equipmentTypesToEdit[nextIndex], nextIndex);
  }

  async save() {
    var equipmentToBeSaved = this.setEquipmentDataModel(this.selectedEquipmentTypeToEdit.name);
    if (equipmentToBeSaved == false) {
      this.toastr.error("Please fill all mandatory fields to save the record");
      return false;
    }
    await this.IsExistCheckAndSave();
    return true;
  }
  //commonPopUpCall() {
  //  this.modalRef = this.modalService.open(UpdateTblPopupComponent, { size: 'lg', backdrop: 'static' });
  //  this.modalRef.result.then((result) => {

  //    this.editSaveData();
  //    this.toastr.success('Updated successfully');

  //  }, (reason) => {
  //  });
  //}


  //async editSaveData() {
  //  await this.equipmentService.updateEquipmentType(this.selectedEquipmentTypeToEdit).subscribe(x => {
  //    if (this.equipmentTypesToEdit.length == 0) {
  //      this.equipmentTypesToEdit.push(x.data);
  //      this.equipmentTypeCheckmodel = x.data;
  //    }
  //    else {
  //      let Index = this.equipmentTypesToEdit.map(function (x) { return x.code; }).indexOf(this.equipmentTypeCheckmodel.code);
  //      this.equipmentTypesToEdit.splice(Index, 1, x.data);
  //      this.equipmentTypeCheckmodel = x.data;
  //    }
  //    //this.equipmentTypesToEdit.splice(this.Dataindex, 1, x.data);
  //    //this.toastr.success('Updated successfully');
  //  });
  //}


  async selectedEquipmentType(selectedEtToEdit: EquipmentViewModel, i: number) {
    this.isDisabledContent = false;
    this.Dataindex = i;
    this.selectedEquipmentTypeToEdit = Object.assign({}, selectedEtToEdit);
    this.freightsByID.clientID = this.currentUser.ClientId;
    this.freightsByID.equipmentTypeID = this.selectedEquipmentTypeToEdit.id;
    this.freightListItem = [];
    this.freightListItem1 = [];    
    await this.getSelectedFreightsByEquipmentID();
    this.freightListItem = this.freightListItem1;
    this.equipmentTypeCheckmodel = this.selectedEquipmentTypeToEdit;
    
   //await this.setEquipMentTypeDetails(i);
    //this.selectedEquipmentTypeToEdit = null;
  }

  //async setEquipMentTypeDetails(index: number) {
  //  var nextResult = this.equipmentTypesToEdit[index];
  //  this.equipmentCode = nextResult.code;
  //  this.freightListItem = [];
  //  this.freightListItem1 = [];    
  //  await this.getSelectedFreightsByEquipmentID();
  //  this.freightListItem = this.freightListItem1;
  //  this.selectedEquipmentTypeToEdit = nextResult;
  //  this.freightsByID.equipmentTypeID = this.selectedEquipmentTypeToEdit.id;
  //  this.equipmentTypeCheckmodel = nextResult;
  //  this.Dataindex = null;
   
  //}

  //async saveAndEditNext() {
  //  this.toastr.info("Selecting next equipment to edit after saving changes, if any.")

  //  await this.selectNext();

  //}

  //selectNext() {
  //  let nextIndex = this.equipmentTypesToEdit.map(function (x) { return x.id; }).indexOf(this.selectedEquipmentTypeToEdit.id);
  //  if (nextIndex == this.equipmentTypesToEdit.length - 1) {
  //    nextIndex = 0;
  //  } else {
  //    nextIndex += 1;
  //  }
  //  this.selectedEquipmentType(this.equipmentTypesToEdit[nextIndex], nextIndex);
  //}

  removeEquipmentTypeFromEditList(equipmentToRemove: EquipmentViewModel) {
    this.equipmentTypesToEdit.splice(this.equipmentTypesToEdit.findIndex(item => item.id === equipmentToRemove.id), 1)
  }
}
