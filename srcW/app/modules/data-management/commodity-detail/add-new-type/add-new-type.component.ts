import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'select2';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommodityService } from '../../../../core/services/commodity.service';
import { CommodityType, CommodityTypeViewModel, CommodityTypeEitModel } from '../../../../core/models/commodity.model';
import { User, AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { DeleteCommoditytypePopupComponent } from '../delete-commoditytype-popup/delete-commoditytype-popup.component';

@Component({
  selector: 'app-add-new-type',
  templateUrl: './add-new-type.component.html',
  styleUrls: ['./add-new-type.component.css']
})
export class AddNewTypeComponent implements OnInit {
  //commodityTypeForm: FormGroup;
  commodityType: CommodityType;
  commodityviewmodel: CommodityTypeViewModel;// = new CommodityTypeViewModel();
  commoditytypemodel: CommodityTypeEitModel;
  commodityeditviewmodel: CommodityTypeEitModel[] = [];
  buttonText: string;
  currentUser: User;
  itemCommodityType = [];
  itemCommodityTypeList = [];
  showRow: boolean;
  showButton: boolean;
  modalRef: NgbModalRef;
  EnteredCommodityTypeText = '';
  CommodityEntered = "";
  isdeleted: boolean;
  constructor(private router: Router, public modalService: NgbModal, public activeModal: NgbActiveModal, private authenticationService: AuthService, private fb: FormBuilder, private commodityService: CommodityService, private toastrService: ToastrService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.commodityType = { ClientID: this.currentUser.ClientId } as CommodityType;
  }

  btn: any
  btnaddnew: any
  btnedit: any
  btndelete: any

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getScannedList(this.commodityType);
    this.showButton = false;
  }

  async getScannedList(objserve) {

    this.showRow = false;
    await this.commodityService.getAllCommodityType(objserve).toPromise().then(data => {

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
        // .... HANDLE ERROR HERE
        console.log(error);
      }
    );
    this.showButton = false;
  }

  addNew() {

    //this.clicked = false;
    this.showButton = true;
    this.buttonText = "Save";
    this.showRow = true;
    this.btn = 'btnaddnew';
  }

  Save() {
    if (this.buttonText == "Save") {
      if (this.EnteredCommodityTypeText == "") {
        this.toastrService.info("Please enter the Commodity Type Name.");
      }
      else {
        this.saveData();
        this.showRow = false;
      }
    }
    else {
      this.editSaveData();
    }
  }

  editDataModel(AcceptName: string) {
    if (AcceptName == "") {
      this.toastrService.error("Please fill mandatory fields.");
      return false;
    }
    var code = AcceptName.replace(/\s/g, "");
    var description = AcceptName;
    const Result = this.commodityeditviewmodel[0];
    this.commoditytypemodel = {
      id: Result.id,
      code: code.trim(),
      name: AcceptName.trim(),
      description: description.trim(),
      isDeleted: false,
      clientID: this.currentUser.ClientId,
      sourceSystemID: 1,
      updatedBy: this.currentUser.LoginId,
      updateDateTimeServer: new Date(),
      updateDateTimeBrowser: new Date(),
      createdBy: this.currentUser.LoginId,
      createDateTimeBrowser: new Date(),
      createDateTimeServer: new Date()
    } as CommodityTypeEitModel;
  }

  editSaveData() {
    this.editDataModel(this.commodityeditviewmodel[0].name)
    this.commodityService.CommodityTypeExist(this.commoditytypemodel).subscribe(x => {
      let items = x.data;
      if (x.data == false) {
        this.commodityService.updateCommodityType(this.commoditytypemodel).subscribe(x => {
          this.commodityeditviewmodel = [];
          this.getScannedList(this.commodityType);
          this.showButton = false;
          this.EnteredCommodityTypeText = "";
          this.toastrService.success("Updated successfully.");
        });
      }
      else {
        this.isdeleted = items.isDeleted;
        if (this.isdeleted == true) {
          this.commodityService.updateCommodityType(items).subscribe(x => {
            this.commodityeditviewmodel = [];
            this.getScannedList(this.commodityType);
            this.showButton = false;
            this.EnteredCommodityTypeText = "";
            this.toastrService.success("Updated successfully.");
          });
        }
        else if (this.isdeleted == false) {
          this.getScannedList(this.commodityType);
          this.showButton = false;
          this.commodityviewmodel = null;
          this.EnteredCommodityTypeText = "";
          this.toastrService.success("Record already exists.");
        }
        else {
          this.getScannedList(this.commodityType);
          this.showButton = false;
          this.commodityviewmodel = null;
          this.EnteredCommodityTypeText = "";
          this.toastrService.success("Something Went Wrong");
        }
      }

    });

  }

  setDataModel(AcceptName: string) {
    if (AcceptName == "") {
      this.toastrService.error("Please fill mandatory fields.");
      return false;
    }
    var code = AcceptName.replace(/\s/g, "");
    var description = AcceptName;
    this.commodityviewmodel = {
      code: code.trim(),
      name: AcceptName.trim(),
      description: description.trim(),
      isDeleted: false,
      clientID: this.currentUser.ClientId,
      sourceSystemID: 1,
      updatedBy: this.currentUser.LoginId,
      updateDateTimeServer: new Date(),
      updateDateTimeBrowser: new Date(),
      createdBy: this.currentUser.LoginId,
      createDateTimeBrowser: new Date(),
      createDateTimeServer: new Date()
    } as CommodityTypeViewModel;
    return true;
  }

  saveData() {
    this.setDataModel(this.EnteredCommodityTypeText);
    this.commodityService.CommodityTypeExist(this.commodityviewmodel).subscribe(x => {
      let items = x.data;
      this.isdeleted = items.isDeleted;
      if (items != null && this.isdeleted == true) {
        this.commodityService.updateCommodityType(items).subscribe(x => {
          this.commodityeditviewmodel = [];
          this.getScannedList(this.commodityType);
          this.EnteredCommodityTypeText = "";
          this.toastrService.success("Saved successfully.");
        });
      }
      else if (items != null && this.isdeleted == false) {
        this.getScannedList(this.commodityType);
        this.commodityviewmodel = null;
        this.EnteredCommodityTypeText = "";
        this.toastrService.success("Record already exists.");
      }
      else {
        this.commodityService.addCommodityType(this.commodityviewmodel).subscribe(x => {
          let items = x.data;
          this.getScannedList(this.commodityType);
          this.commodityviewmodel = null;
          this.EnteredCommodityTypeText = "";
          this.toastrService.success("Saved successfully.");
        });
      }
    });
  }

  showEditableRow() {
    this.itemCommodityType = this.itemCommodityType.map((row) => {
      if (row.selected) { row.editable = true; }
      else { row.editable = false; }
      return row;
    });
  }

  Edit() {
    this.showEditableRow();
    if (this.commodityeditviewmodel.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    if (this.commodityeditviewmodel.length == 1) {
      //this.showRow = true;
      this.showButton = true;
      this.buttonText = "Update";
    }
    if (this.commodityeditviewmodel.length > 1) {
      this.toastrService.info("Please select only one record.");
      this.commodityeditviewmodel = [];
      this.getScannedList(this.commodityType);
      this.showButton = false;
      return false;
    }
    this.btn = 'btnedit';
  }

  cancel() {
    this.commodityeditviewmodel = [];
    this.getScannedList(this.commodityType);
  }

  checkSelected() {
    this.commodityeditviewmodel = [];
    this.itemCommodityType = this.itemCommodityType.map((row) => {
      if (row.selected) {
        this.commodityeditviewmodel.push(row);
      }
      else {
        this.commodityeditviewmodel.slice(row);
      }
      return row;
    });    
  }

  DeleteRecords() {
    var selectedIDs = '';
    if (this.commodityeditviewmodel.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.commodityeditviewmodel.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(DeleteCommoditytypePopupComponent, { size: 'sm', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.commodityService.RemoveCommodityType(selectedIDs).subscribe(result => {

        if (result.message == "Success" || result.Message == "Success") {
          this.commodityeditviewmodel = [];
          this.getScannedList(this.commodityType);

          this.toastrService.success("Records Deleted successfully.");
        }
        else {
          this.toastrService.warning("Something went wrong.");
        }
      }, error => {
        this.toastrService.error("Records saved successfully.");
      });

    });
    this.btn = 'btndelete';
  }

  Refresh() {

    this.commodityeditviewmodel = [];
    this.getScannedList(this.commodityType);
    this.showButton = false;
  }

}

