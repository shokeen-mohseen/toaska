import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialCommodityMap, MaterialHierarchyModel } from '../../../../core/models/material.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { MaterialService } from '../../../../core/services/material.service';
import { CommodityService } from '../../../../core/services/commodity.service';
import { CommodityNewModel } from '../../../../core/models/commodity.model';
import { UpdateTblPopupComponent } from '../../../../shared/components/update-tbl-popup/update-tbl-popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.css']
})
export class EditMaterialComponent implements OnInit {
  materialEditForm: FormGroup;
  public definechar: boolean = false;
  public defineequip: boolean = false;
  public mapforecast: boolean = false;
  modalRef: NgbModalRef;
  @Input() materialsToEdit: MaterialCommodityMap[];
  @Output('selectedMaterials') selectedMaterials = new EventEmitter<MaterialCommodityMap[]>();
  selectedMaterialToEdit: MaterialCommodityMap = new MaterialCommodityMap();
  //materialHierarchyList = [];
  defaultCommodityList = [];
  selectedCommodityItem = [];
  //selectedMatHierarchy = [];
  materialCode = '';
  ParentData: string = '';
  ParentDataID: number = 0;
  materialDescription = '';
  Dataindex: number = 0;
  settingsA = {};
  settingsB = {};
  currentUser: User;
  selectedcomid: number;
  selectedcomName: string;
  selectedmathararchyid: number;
  selectedmathararchyName: string;


  constructor(private router: Router,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private materialService: MaterialService,
    private commodityService: CommodityService) { this.createForm(); }

  async ngOnInit() {
    
    await this.setMaterialsToEdit();
    //this.selectedMaterials.emit(this.materialsToEdit);
    this.currentUser = this.authenticationService.currentUserValue;
    this.selectedMaterialToEdit.clientID = this.authenticationService.currentUserValue.ClientId;
    this.selectedMaterialToEdit.pageSize = 0;
    this.getDefaultCommodity(this.selectedMaterialToEdit);
    //this.getMaterialHierarchyData(this.selectedMaterialToEdit)
    this.selectedMaterialEdit(this.materialsToEdit[0], 0);

    //this.settingsA = {
    //  singleSelection: true,
    //  text: "Select",
    //  enableSearchFilter: true,
    //  addNewItemOnFilter: true,
    //  disabled: true
    //};

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
  }

  async setMaterialsToEdit() {
    var defaultCount = await this.materialService.getMaxEditedRecordsCount();
    this.materialsToEdit = this.materialsToEdit.slice(0, defaultCount);
    this.selectedMaterials.emit(this.materialsToEdit);
  }

  createForm() {
    this.materialEditForm = this.fb.group({
      matCode: ['', Validators.required],
      matDesc: ['', Validators.required],
      matHierarchyList: [[], Validators.required],
      matCommodityList: [[], Validators.required],
    });
  }

  openAccordion(action = "") {
    if (action === "definechar") {
      this.definechar = !this.definechar;
    }
    else if (action === "defineequip") {
      this.defineequip = !this.defineequip;
    }
    else if (action === "mapinvestor") {
      this.mapforecast = !this.mapforecast;
    }
  }
  //selectNext(el) {
  //  el.selectedIndex += 1;
  //}
  //selectPrev(el) {
  //  el.selectedIndex -= 1;
  //}
  closeTab() {
    this.router.navigateByUrl('/data-management/material');
  }

  public onReserveSaveStatusChanged(value: boolean) {
    this.selectedMaterialToEdit.isReserve = value;
  }

  public onSetupSaveStatusChanged(value: boolean) {
    this.selectedMaterialToEdit.setupComplete = value;
  }


  selectedMaterialEdit(selectedMaterialtoedit: MaterialCommodityMap, i: number) {
    
    this.Dataindex = i;
    this.selectedMaterialToEdit = Object.assign({}, selectedMaterialtoedit);
    this.setMaterialDetails(i);
  }

  setMaterialDetails(index: number) {
    var nextResult = this.materialsToEdit[index];
    this.materialCode = nextResult.code;
    this.materialDescription = nextResult.description
    //this.selectedMatHierarchy = [];
    this.selectedCommodityItem = [];
    this.selectedCommodityItem = [{ id: nextResult.defaultCommodityID, itemName: nextResult.defaultCommodity }];
    //this.selectedMatHierarchy = [{ id: nextResult.materialHierarchyID, itemName: nextResult.materialHierarchyName }];
    this.selectedMaterialToEdit = nextResult;
  }

  getDefaultCommodity(objserve) {
    if (this.defaultCommodityList.length == 0) {
      this.commodityService.getCommodityList(objserve)
        .subscribe(data => {
          if (data.data != null || data.data != undefined) {
            let datalist: any[] = data.data;
            for (let i = 0; i < datalist.length; i++) {
              this.defaultCommodityList.push({
                id: datalist[i].id,
                itemName: datalist[i].name
              })
            }
          }
        },
          error => {
            //this.error = error;
            //this.toastrService.error(this.error);
          });
    }
  }

  //getMaterialHierarchyData(objserve) {
  //  if (this.materialHierarchyList.length == 0) {
  //    this.materialService.getMaterialHierarchyData(objserve)
  //      .subscribe(data => {
  //        if (data.data != null || data.data != undefined) {
  //          let datalist: any[] = data.data;
  //          for (let i = 0; i < datalist.length; i++) {
  //            this.materialHierarchyList.push({
  //              id: datalist[i].id,
  //              itemName: datalist[i].name
  //            })
  //          }
  //        }
  //      });
  //  }
  //}

  setDataModel(AcceptName: string) {
    this.selectedMaterialToEdit;
    if (AcceptName == "") {
      this.toastrService.error("Please fill mandatory fields.");
      return false;
    }
    //var code = AcceptName.replace(/\s/g, "");
    var name = AcceptName;
    const nextResult = this.materialsToEdit[this.Dataindex];
    this.selectedCommodityItem.forEach(el => {
      this.selectedcomid = el.id;
      this.selectedcomName = el.itemName
    });
    //this.selectedMatHierarchy.forEach(el => {
    //  this.selectedmathararchyid = el.id;
    //  this.selectedmathararchyName = el.itemName
    //});

    this.selectedMaterialToEdit = {
      id: nextResult.id,
      code: this.selectedMaterialToEdit.code,
      name: name,
      description: AcceptName,
      materialHierarchyID: this.selectedMaterialToEdit.materialHierarchyID,
      defaultCommodityID: this.selectedcomid,
      setupComplete: this.selectedMaterialToEdit.setupComplete,
      isReserve: this.selectedMaterialToEdit.isReserve,
      isActive: this.selectedMaterialToEdit.isActive,
      setupCompleteDateTime: new Date(),
      externalSourceMaterialKey: nextResult.externalSourceMaterialKey,
      effectiveEndDate: nextResult.effectiveEndDate,
      effectiveStartDate: nextResult.effectiveStartDate,
      materialHierarchyName: this.selectedMaterialToEdit.materialHierarchyName,
      defaultCommodity: this.selectedcomName,
      isDeleted: nextResult.isDeleted,
      clientID: this.currentUser.ClientId,
      sourceSystemID: this.currentUser.SourceSystemID,
      updatedBy: this.currentUser.LoginId,
      updateDateTimeServer: new Date(),
      updateDateTimeBrowser: new Date(),
      createdBy: this.currentUser.LoginId,
      createDateTimeBrowser: new Date(),
      createDateTimeServer: new Date()
    } as MaterialCommodityMap;
    return true;
  }

  async save() {
    
    this.setDataModel(this.selectedMaterialToEdit.description);
    await this.isMaterialExistCheckAndSave();
  }

  async editSaveData() {
    await this.materialService.editSaveMaterialCommodity(new Array(this.selectedMaterialToEdit)).toPromise().then(x => {
      this.materialsToEdit.splice(this.Dataindex, 1, this.selectedMaterialToEdit);
    });
  }

  async savemat() {
    var materialToBeSaved = await this.setDataModel(this.selectedMaterialToEdit.description);
    if (materialToBeSaved == false) {
      this.toastrService.error("Please fill all mandatory fields to save.");
      return false;
    }
    await this.isMaterialExistCheckAndSave();
    return true;
  }

  async saveAndEditNext() {
    this.toastrService.info("Selecting next Material to edit after saving changes, if any.")
    if (await this.savemat()) {
      this.selectNext();
    }
  }

  selectNext() {
    let nextIndex = this.materialsToEdit.map(function (x) { return x.id; }).indexOf(this.selectedMaterialToEdit.id);
    if (nextIndex == this.materialsToEdit.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedMaterialEdit(this.materialsToEdit[nextIndex], nextIndex);
  }

  async commonPopUpCall() {
    var edit = false;
    this.modalRef = this.modalService.open(UpdateTblPopupComponent, { size: 'lg', backdrop: 'static' });
    await this.modalRef.result.then((result) => {
      edit = true;
    }, (reason) => {
    });
    if (edit) {
      await this.editSaveData();
      this.toastrService.success('Updated successfully');
    }
  }

  async isMaterialExistCheckAndSave() {
    var save = false;
    await this.materialService.isMaterialExist(this.selectedMaterialToEdit).toPromise().then(async result => {
      
      if (result != null && result.data != null) {
        var id = result.data.id
        if (id === this.selectedMaterialToEdit.id) {
          await this.commonPopUpCall();
        }
        else {
          this.toastrService.info('record already exist.');
        }
      }
      else {
        save = true;
      }
    });
    if (save) {
      await this.editSaveData();
      this.toastrService.success('Updated successfully');
    }
  }

  removeMaterialFromEditList(materialToRemove: MaterialCommodityMap) {
    this.materialsToEdit.splice(this.materialsToEdit.findIndex(item => item.id === materialToRemove.id), 1)
  }
  //isFormValid() {
  //  if (this.selectedMaterialToEdit.defaultCommodityID == 0
  //    || this.selectedMaterialToEdit.description == ""
  //  ) {
  //    return false;
  //  }
  //  return true;
  //}
}
