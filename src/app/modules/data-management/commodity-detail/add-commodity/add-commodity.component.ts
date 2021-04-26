import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService, User } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityService } from '../../../../core/services/commodity.service';
import { CommodityType, SegmentType, Commodity, CommodityEitModel, CommodityNewModel, CommodityCheckModel } from '../../../../core/models/commodity.model';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UpdateTblPopupComponent } from '../../../../shared/components/update-tbl-popup/update-tbl-popup.component';
import { Id } from '../../../system-settings/freight-mode/map-equipment-type/map-equipment-type.component';



@Component({
  selector: 'app-add-commodity',
  templateUrl: './add-commodity.component.html',
  styleUrls: ['./add-commodity.component.css']
})
export class AddCommodityComponent implements OnInit {
  commodityAddForm: FormGroup;
  commodityType: CommodityType;
  segmentType: SegmentType;
  commodity: Commodity;
  @Input() dataSource: Commodity[] = [];
  dataSources: CommodityNewModel[] = [];
  commodityeditmodel: CommodityNewModel = new CommodityNewModel();
  commodityCheckmodel: CommodityCheckModel = new CommodityCheckModel();
  DataSourceEdit: CommodityNewModel[] = [];
  currentUser: User;
  itemCommodityType = [];
  itemCommodityTypeList = [];
  itemSegmentType = [];
  itemSegmentTypeList = [];
  modalRef: NgbModalRef;
  //commodityform: FormGroup;
  all: CommodityNewModel[] = [];
  next: number = 0;
  Dataindex: number = 0;
  constructor(public modalService: NgbModal, private commodityService: CommodityService,
    private fb: FormBuilder, private authenticationService: AuthService, private toastr: ToastrService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.commodityType = { ClientID: this.currentUser.ClientId } as CommodityType;
    this.segmentType = { ClientID: null } as SegmentType;
    this.createForm();
  }
  isduplicate: boolean;
  isduplicateindb: boolean;

  selectedcomid: number;
  selectedcomName: string;
  selectedsegid: number;
  selectedsegName: string;
  //id: number = 0;
  CommodityEntered = '';
  names: string[] = [];
  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;
  
  createForm() {
    //const nonWhitespaceRegExp: RegExp = new RegExp("\\S");
    this.commodityAddForm = this.fb.group({
      commoditytype: [[], Validators.required],
      commodityName: ['', Validators.required],
      segment: [[], Validators.required]
    });
  }
  //onKeydown(event) {
  //  if (event.keyCode === 32) {
  //    return false;
  //  }
  //}
  ngOnInit(): void {
    
    //this.dataSources = this.commodityService.getdata();
    //this.all.push(this.dataSources);
    ////console.log("add",this.dataSources);
    this.GetcommodityType(this.commodityType)
    this.GetSegementType(this.segmentType);
    
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName'],
      addNewItemOnFilter: false
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",      
      enableSearchFilter: true,
      searchBy: ['itemName'],
      addNewItemOnFilter: false
    };

  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemCommoditySelect(item: any) {  
  }
  onItemSegmentSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {   
  }
  onDeSelectAll(items: any) {
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
      }
    },
      error => {        
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
      }
    },
      error => {       
      }
    );
  }

  saveData() {
    this.names.push(this.CommodityEntered);
    this.selectedItemsA.forEach(el => {
      this.selectedcomid = el.id;
      this.selectedcomName = el.itemName;
    });
    this.selectedItemsB.forEach(el => {
      this.selectedsegid = el.id;
      this.selectedsegName = el.itemName
    });    
  }  

  selectedCommodity(index: number) {    
    this.next = index;
    this.setCommodityDetails(this.next);
  }

  clearSelction() {
    this.selectedItemsA = [];
    this.selectedItemsB = [];
    this.CommodityEntered = "";
    this.commodityeditmodel.name = "";
  }

  removeCommodityFromEditList(commodityToRemove: CommodityEitModel) {     
    this.DataSourceEdit.splice(this.DataSourceEdit.findIndex(item => item.id === commodityToRemove.id), 1)
  }

  dataEditSave() {
    const nextResult = this.DataSourceEdit[this.next];
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
      code: this.CommodityEntered,
      name: this.CommodityEntered,
      description: this.CommodityEntered,
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
  }

  async saveNextCommodity() {
    if (await this.save()) {
      this.clearSelction();
    }
  }

  async save() {     
    var commodityToBeSaved = this.setDataModel(this.commodityeditmodel.name);
    if (commodityToBeSaved == false) {
      this.toastr.error("Please fill all mandatory fields to save the record.");
      return false;
    }
    await this.IsExistCheckAndSave();
    return true;
  }

  setDataModel(AcceptName: string) {    
    if (AcceptName.trim() == "") {
      this.toastr.error("Please fill mandatory fields.");
      return false;
    }
    var code = AcceptName.trim().replace(/\s/g, "");
    var description = AcceptName;
    //const nextResult = this.dataSources[this.Dataindex];
    this.selectedItemsA.forEach(el => {
      this.selectedcomid = el.id;
      this.selectedcomName = el.itemName;
    });
    this.selectedItemsB.forEach(el => {
      this.selectedsegid = el.id;
      this.selectedsegName = el.itemName
    });
    this.commodityeditmodel = {
      //id: 0,
      commodityTypeID: this.selectedcomid,
      commodityTypeName: this.selectedcomName,
      departmentID: this.selectedsegid,
      segmentDescription: this.selectedsegName,
      code: code,
      name: AcceptName.trim(),
      description: description,
      isDeleted: false,
      clientID: this.currentUser.ClientId,
      sourceSystemID: this.currentUser.SourceSystemID,
      updatedBy: this.currentUser.LoginId,
      updateDateTimeServer: new Date(),
      updateDateTimeBrowser: new Date(),
      createdBy: this.currentUser.LoginId,
      createDateTimeBrowser: new Date(),
      createDateTimeServer: new Date()
    } as CommodityNewModel;
    return true;
  }

  saveServiceCall() {
    this.commodityService.addCommodity(this.commodityeditmodel).subscribe(x => {
      this.DataSourceEdit.push(x.data);
      this.commodityCheckmodel = x.data;
    });
  }

  saveCommodity() {     
    this.setDataModel(this.commodityeditmodel.name);
    this.IsExistCheckAndSave();
  }

  async IsExistCheckAndSave() {     
    await this.commodityService.IscommodityExist(this.commodityeditmodel).toPromise().then(result => {       
      if (result != null && result.data != null) {
        //var codeprev = this.commodityeditmodel.code;
        var idcheck = this.commodityCheckmodel.id;
        var id = result.data.id;
        if (id === idcheck || idcheck === undefined) {
          this.commonPopUpCall();
        }
        else {
          this.toastr.info('Commodity already exists.');
        }
      }
      else {
        this.saveServiceCall();
        this.toastr.success('Records saved successfully.');
      }
    })
  }

  commonPopUpCall() {
     
    this.modalRef = this.modalService.open(UpdateTblPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {       
      this.editSaveData();
      this.toastr.success('Records updated successfully.');
    }, (reason) => {
    });
  }

  async editSaveData() {     
    await this.commodityService.editSaveCommodity(this.commodityeditmodel).toPromise().then(x => {
      if (this.DataSourceEdit.length == 0) {
        this.DataSourceEdit.push(x.data);
        this.commodityCheckmodel = x.data;
      }
      else {
        let Index = this.DataSourceEdit.map(function (x) { return x.code; }).indexOf(this.commodityCheckmodel.code);
        this.DataSourceEdit.splice(Index, 1, x.data);
        this.commodityCheckmodel = x.data;
      }

    });
  }

  selectedCommodityEdit(selectedCommodityToEdit: CommodityNewModel, i: number) {     
    this.Dataindex = i;
    this.commodityeditmodel = Object.assign({}, selectedCommodityToEdit);
    this.setCommodityDetails(i);
  }

  setCommodityDetails(index: number) {
    const result = this.DataSourceEdit[index]
    //const nextResult = this.dataSource[this.next];
    this.CommodityEntered = result.name;
    this.selectedItemsA = [];
    this.selectedItemsB = [];
    this.selectedItemsA = [{ id: result.commodityTypeID, itemName: result.commodityTypeName }];
    this.selectedItemsB = [{ id: result.departmentID, itemName: result.segmentDescription }];
    this.commodityeditmodel = result;
    this.commodityCheckmodel = result;
  }
}
