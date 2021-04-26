import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { Commodity, CommodityType, SegmentType, CommodityEitModel, CommodityNewModel } from '../../../../core/models/commodity.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { CommodityService } from '../../../../core/services/commodity.service';
import { UpdateTblPopupComponent } from '../../../../shared/components/update-tbl-popup/update-tbl-popup.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-commodity',
  templateUrl: './edit-commodity.component.html',
  styleUrls: ['./edit-commodity.component.css']
})
export class EditCommodityComponent implements OnInit {
  commodityEditForm: FormGroup;
  commodityType: CommodityType;
  segmentType: SegmentType;
  itemCommodityType = [];
  itemCommodityTypeList = [];
  itemSegmentType = [];
  itemSegmentTypeList = [];
  currentUser: User;
  @Input() dataSources: CommodityNewModel[] = [];
  dataSourcecheckDB: CommodityNewModel[] = [];
  commodityeditmodel: CommodityNewModel = null;
  modalRef: NgbModalRef;
  CommodityEntered = '';
  names: string[] = [];
  next: number = 0;
  Dataindex: number = 0;
  selectedcomid: number;
  selectedcomName: string;
  selectedsegid: number;
  selectedsegName: string;
  constructor(public modalService: NgbModal, private commodityService: CommodityService, private fb: FormBuilder,
    private toastrService: ToastrService, private authenticationService: AuthService, private changeDetectorRefs: ChangeDetectorRef) {

    this.currentUser = this.authenticationService.currentUserValue;
    this.commodityType = { ClientID: this.currentUser.ClientId } as CommodityType;
    this.segmentType = { ClientID: null } as SegmentType;
    this.createForm();
  }



  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  ngOnInit(): void {

    //const element = this.dataSource[0];
    //element.segmentDescription
    //console.log("Edit", this.dataSource);
    this.selectedCommodityEdit(this.dataSources[0], 0);
    //this.dataSourcecheckDB = this.commodityService.getdata();
    this.GetcommodityType(this.commodityType)
    this.GetSegementType(this.segmentType);
    //this.names = this.dataSource.map((obj: CommodityEitModel) => obj.name);
    //if (this.dataSource.length > 0 || this.dataSource != null) {
    //  this.selectedItemsA = [{ id: this.dataSource[0].commodityTypeID, itemName: this.dataSource[0].commodityTypeName }]
    //  this.selectedItemsB = [{ id: this.dataSource[0].departmentID, itemName: this.dataSource[0].segmentDescription }]
    //  this.CommodityEntered = this.dataSource[0].name
    //  //this.lastupdated = this.dataSource[0].updateDateTimeBrowser.toString();
    //  //this.by = this.dataSource[0].updatedBy;
    //}

    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

  }
  createForm() {
    this.commodityEditForm = this.fb.group({
      commoditytype: [[], Validators.required],
      commodityName: ['', Validators.required],
      segment: [[], Validators.required]
    });
  }

  setSelectedCommodityMapping() {

    if (this.commodityeditmodel != null) {
      if (this.itemCommodityTypeList.length > 0 && this.commodityeditmodel.commodityTypeID != null) {
        this.selectedItemsA[0] = this.itemCommodityTypeList.find(x => x.id == this.commodityeditmodel.commodityTypeID);
      }
      if (this.itemSegmentTypeList.length > 0 && this.commodityeditmodel.departmentID != null) {
        this.selectedItemsB[0] = this.itemSegmentTypeList.find(x => x.id == this.commodityeditmodel.departmentID);
      }
      if (this.commodityeditmodel.name != null) {
        // set selected Charge Computation Method
        this.CommodityEntered = this.commodityeditmodel.name;
      }
    }
  }

  removeCommodityFromEditList(commodityToRemove: CommodityEitModel) {

    this.dataSources.splice(this.dataSources.findIndex(item => item.id === commodityToRemove.id), 1)
  }

  clearSelction() {
    this.selectedItemsA = [];
    this.selectedItemsB = [];
    this.CommodityEntered = "";
  }

  setDataModel(AcceptName: string) {

    if (AcceptName == "") {
      this.toastrService.error("Please fill mandatory fields.");
      return false;
    }
    var code = AcceptName.replace(/\s/g, "");
    var description = AcceptName;
    const nextResult = this.dataSources[this.Dataindex];
    this.selectedItemsA.forEach(el => {
      this.selectedcomid = el.id;
      this.selectedcomName = el.itemName;
    });
    this.selectedItemsB.forEach(el => {
      this.selectedsegid = el.id;
      this.selectedsegName = el.itemName
    });
    this.commodityeditmodel = {
      id: nextResult.id,
      commodityTypeID: this.selectedcomid,
      commodityTypeName: this.selectedcomName,
      departmentID: this.selectedsegid,
      segmentDescription: this.selectedsegName,
      code: code,
      name: AcceptName,
      description: description,
      isDeleted: nextResult.isDeleted,
      clientID: this.currentUser.ClientId,
      sourceSystemID: nextResult.sourceSystemID,
      updatedBy: this.currentUser.LoginId,
      updateDateTimeServer: new Date(),
      updateDateTimeBrowser: new Date(),
      createdBy: this.currentUser.LoginId,
      createDateTimeBrowser: new Date(),
      createDateTimeServer: new Date()
    } as CommodityNewModel;
    return true;
  }

  async editSaveData() {     
    await this.commodityService.editSaveCommodity(this.commodityeditmodel).toPromise().then(x => {       
      this.dataSources.splice(this.Dataindex, 1, x.data);      
    });
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

  async editSave() {
    this.setDataModel(this.commodityeditmodel.name);
    await this.IsExistCheckAndSave();
  }

  async saveAndEditNext() {     
    this.toastrService.info("Selecting next Commodity to edit after saving changes, if any.")
    if (await this.save()) {
      //waitsFor()
      this.selectNext();
    }
  }

  async save() {     
    var commodityToBeSaved = this.setDataModel(this.commodityeditmodel.name);
    if (commodityToBeSaved == false) {
      this.toastrService.error("Please fill all mandatory fields to save.");
      return false;
    }
    await this.IsExistCheckAndSave();
    return true;
  }

  async IsExistCheckAndSave() {     
    var save = false;
    await this.commodityService.IscommodityExist(this.commodityeditmodel).toPromise().then(async result => {       
      if (result != null && result.data != null) {
        var id = result.data.id
        if (id === this.commodityeditmodel.id) {
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

  selectNext() {     
    let nextIndex = this.dataSources.map(function (x) { return x.id; }).indexOf(this.commodityeditmodel.id);
    if (nextIndex == this.dataSources.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    this.selectedCommodityEdit(this.dataSources[nextIndex], nextIndex);
  }

  selectedCommodityEdit(selectedCommodityToEdit: CommodityNewModel, i: number) {
    this.Dataindex = i;
    this.commodityeditmodel = Object.assign({}, selectedCommodityToEdit);
    this.setCommodityDetails(i);
  }

  setCommodityDetails(index: number) {
    var nextResult = this.dataSources[index];
    this.CommodityEntered = nextResult.name;
    this.selectedItemsA = [];
    this.selectedItemsB = [];
    this.selectedItemsA = [{ id: nextResult.commodityTypeID, itemName: nextResult.commodityTypeName }];
    this.selectedItemsB = [{ id: nextResult.departmentID, itemName: nextResult.segmentDescription }];
    this.commodityeditmodel = nextResult;
  }

  GetSegementType(objserve) {
    this.commodityService.getAllSegmentType(objserve).subscribe(data => {
      if (data.data != null || data.data != undefined) {
        let datalist: any[] = data.data;
        for (let i = 0; i < datalist.length; i++) {
          this.itemSegmentTypeList.push({
            id: datalist[i].id,
            itemName: datalist[i].name
          })
        }
        this.itemSegmentType = datalist;
        this.setSelectedCommodityMapping();
      }
    },
      error => {
        // .... HANDLE ERROR HERE
        console.log(error);
      }
    );
  }

  GetcommodityType(objserve) {
    this.commodityService.getAllCommodityType(objserve).subscribe(data => {
      if (data.data != null || data.data != undefined) {
        let datalist: any[] = data.data;
        for (let i = 0; i < datalist.length; i++) {
          this.itemCommodityTypeList.push({
            id: datalist[i].id,
            itemName: datalist[i].name
          })
        }
        this.itemCommodityType = datalist;
        this.setSelectedCommodityMapping();
      }
    },
      error => {
        // .... HANDLE ERROR HERE
        console.log(error);
      }
    );
  }
}
