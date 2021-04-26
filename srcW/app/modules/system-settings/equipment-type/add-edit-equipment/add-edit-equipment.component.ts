import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentTypeAEModel, EquipmentTypeCheckModel, FreightModeEquipmentTypeMapModel, EquipmentTypeSaveModel, EquipmentViewModel, EquipmentTypeFreightModeMapModel, FreightModeEquipmentTypeModel } from '../../../../core/models/Equipment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { FreightMode } from '../../modals/freightmode';
import { EquipmentService } from '../../../../core/services/equipment.service';

@Component({
  selector: 'app-add-edit-equipment',
  templateUrl: './add-edit-equipment.component.html',
  styleUrls: ['./add-edit-equipment.component.css']
})
export class AddEditEquipmentComponent implements OnInit {
  equipmentCode = '';
  dataSourceAE: EquipmentTypeAEModel[] = [];
  equipmentAEModel: EquipmentTypeAEModel = new EquipmentTypeAEModel();
  equipmentTypeCheckmodel: EquipmentTypeCheckModel = new EquipmentTypeCheckModel();
  equipmentTypeSaveModel:EquipmentTypeSaveModel = new EquipmentTypeSaveModel();
  freightModeEquipmentTypeMapS: FreightModeEquipmentTypeModel = new FreightModeEquipmentTypeModel();
  freightModeEquipmentTypeMapDS: FreightModeEquipmentTypeModel[] = [];
  /////// from here////////////
  freightModel: FreightMode = new FreightMode();
  selectedEquipmentTypeToEdit: EquipmentViewModel = new EquipmentViewModel();
  equipmentTypesEdit: EquipmentViewModel[] = [];
  @Input() equipmentTypesToEdit: EquipmentViewModel[] = [];
  freightsByID: EquipmentTypeFreightModeMapModel = new EquipmentTypeFreightModeMapModel();
  equipmentTypeFreightModeMapModel: EquipmentTypeFreightModeMapModel = new EquipmentTypeFreightModeMapModel();
  equipmentTypeFreightModeMapModelDS: EquipmentTypeFreightModeMapModel[] = [];
  modalRef: NgbModalRef;
  currentUser: User;
  freightList = [];
  freightListItem = [];
  next: number = 0;
  Dataindex: number = 0;
  equipmentMaterial: boolean = false;
  @Input() addPage: boolean;
  @Input() editPage: boolean;
  @Input() selectedIdsfromList: string;
  constructor(public equipmentService: EquipmentService,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private authenticationService: AuthService) { }

  settingsA = {};
  countA = 3;

  onSubmit() {
  }

  ngOnInit(): void {    
    if (this.editPage) {
      debugger
      this.freightsByID.clientID = this.authenticationService.currentUserValue.ClientId;     
      this.selectedEquipmentType(this.equipmentTypesToEdit[0], 0);     
      var check = this.selectedIdsfromList;
    }   
   
    this.currentUser = this.authenticationService.currentUserValue;
    this.freightModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.freightModel.pageSize = 0;
    this.getfreightlist();
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      noDataLabel: "No Data Available"
    };

  }

  onAddItem(data: string) {
    this.countA++;
    //this.itemListA.push({ "id": this.countA, "itemName": data });
    //this.selectedItemsA.push({ "id": this.countA, "itemName": data });
  }
  onItemSelect(item: any) {
    debugger
    this.freightListItem;
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    //console.log(this.userData);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  openAccordion(action) {
    if (action === "equipmentMaterial") {

      this.equipmentMaterial = !this.equipmentMaterial;

    }
  }

  getSelectedFreightsByEquipmentID() {
    this.equipmentService.getFreightsByEquipmentTypeID(this.freightsByID).subscribe(result => {
      if (result.data != null || result.data != undefined) {      
        let datalist: any[] = result.data;
        for (let i = 0; i < datalist.length; i++) {
          this.freightListItem.push({
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

  public onSetupSaveStatusChanged(value: boolean) {
    this.selectedEquipmentTypeToEdit.setupComplete = value;
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

    if (AcceptName.trim() == "") {
      this.toastr.error("Please fill mandatory fields.");
      return false;
    }
    this.freightListItem.forEach(item => {
      this.setFreightDataModel(item);
    });

    this.selectedEquipmentTypeToEdit.description = AcceptName;
    this.selectedEquipmentTypeToEdit.equipmentMappingwithFreightModes = null;
    this.selectedEquipmentTypeToEdit.freightmodeEquipmentTypeMappingViewModel = this.freightModeEquipmentTypeMapDS;
    this.selectedEquipmentTypeToEdit.isDeleted = false;
    this.selectedEquipmentTypeToEdit.clientId = this.currentUser.ClientId;
    this.selectedEquipmentTypeToEdit.sourceSystemId = this.currentUser.SourceSystemID;
    this.selectedEquipmentTypeToEdit.updatedBy = this.currentUser.LoginId;
    this.selectedEquipmentTypeToEdit.createdBy = this.currentUser.LoginId;
    return true;   
    //  //SetupCompleteDateTime: (new Date()).toString(),   
  }

  saveServiceCall() {
    debugger
    this.equipmentService.saveEquipmentType(new Array(this.selectedEquipmentTypeToEdit)).subscribe(x => {
      if (x.data.length != 0) {
        //this.equipmentTypesEdit.push(x.data[0]);
        this.equipmentTypesToEdit.push(x.data[0]);
        this.selectedEquipmentTypeToEdit = x.data[0];
        this.toastr.success('Saved successfully');
      }
      else {
        this.toastr.info('Equipment already exists.');
      }
    });
  }

  updateServiceCall() {
    debugger
    this.equipmentService.updateEquipmentType(this.selectedEquipmentTypeToEdit).subscribe(x => {
      this.equipmentTypesToEdit.splice(this.Dataindex, 1, x.data);
      this.toastr.success('Updated successfully');
    });
  }

  saveEquipmentType() {
    debugger
    this.setEquipmentDataModel(this.selectedEquipmentTypeToEdit.name);
    if (this.editPage) {      
      this.updateServiceCall();
    }
    else {
      debugger
      this.saveServiceCall();
    }
    //
    //this.IsExistCheckAndSave();
  }

  selectedEquipmentType(selectedEtToEdit: EquipmentViewModel, i: number) {
    this.Dataindex = i;    
    this.selectedEquipmentTypeToEdit = Object.assign({}, selectedEtToEdit);
    this.freightsByID.equipmentTypeID = this.selectedEquipmentTypeToEdit.id;
    this.setEquipMentTypeDetails(i);
  }

  setEquipMentTypeDetails(index: number) {
    var nextResult = this.equipmentTypesToEdit[index];
    this.equipmentCode = nextResult.code;
    this.freightListItem = [];   
    this.getSelectedFreightsByEquipmentID();
    this.selectedEquipmentTypeToEdit = nextResult;
  }

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
