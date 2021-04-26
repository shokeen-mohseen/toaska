import { Component, OnInit, Input, ViewChild,AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OriginOfGoods } from '../../../../../core/models/OriginOfGoods.model';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core';
import { OriginOfGoodsListComponent } from '../origin-of-goods-list/origin-of-goods-list.component';
@Component({
  selector: 'app-edit-origin-of-goods',
  templateUrl: './edit-origin-of-goods.component.html',
  styleUrls: ['./edit-origin-of-goods.component.css']
})
export class EditOriginOfGoodsComponent implements OnInit, AfterViewInit {
  Inactive: boolean = false;
  @ViewChild(OriginOfGoodsListComponent, { static: false }) originOfGoodsListComponent: OriginOfGoodsListComponent;
  @Input() OriginOfGoodsToEdit: OriginOfGoods[];
  isPONo: boolean = false;
  itemListA = [];
  itemListB = [];
  itemListC = [];
  selectedItemsA = [];
  settings = {};
  settingsA = {};
  count = 3;
  selectedItemsB = [];
  selectedItemsC = [];
  MaterialPercentage: any;
  Comments: any;
  MatPercentage: [];

  isDisabled = false;
  selectedOriginOfGoodsToEdit: OriginOfGoods = null;
 
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal,private shipmentManagementService: shipmentManagementService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.Inactive = this.shipmentManagementService.Permission == false ? true : false;
    // set the first record to edit by default
    this.selectedOriginOfGoods(this.OriginOfGoodsToEdit[0]);
    this.getMaterialList();
    this.getCountryList();
    this.getManufacturerList();
    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: "description",
      noDataLabel: "No Data Available"
    };



    this.settings = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      disabled: true
    };

  }
  GetAllOriginOfGoodsData() {

    if (this.selectedItemsA != null) {
      this.selectedOriginOfGoodsToEdit.materialId = this.selectedItemsA[0]?.id;
    }
    else
      return null
    if (this.selectedItemsB != null) {
      this.selectedOriginOfGoodsToEdit.countryId = this.selectedItemsB[0]?.Id;
    }
    else
      return null
    if (this.selectedItemsC != null) {
      this.selectedOriginOfGoodsToEdit.locationID = this.selectedItemsC[0]?.id;
    }
    else
      return null
    if (this.selectedOriginOfGoodsToEdit.materialPercentage != null) {
      this.selectedOriginOfGoodsToEdit.materialPercentage = Number(this.selectedOriginOfGoodsToEdit.materialPercentage);
    }
    else
      return null
    if (this.Comments != null) {
      this.selectedOriginOfGoodsToEdit.comment = this.Comments.toString().trim();
    }
    else
      return null
    if (this.isFormValid()) {
      return this.selectedOriginOfGoodsToEdit;
    }
    else
      return null

  }
  isFormValid() {
    if (this.selectedOriginOfGoodsToEdit.materialId == 0
      || this.selectedOriginOfGoodsToEdit.countryId == 0
      || this.selectedOriginOfGoodsToEdit.locationID == 0
      || this.selectedOriginOfGoodsToEdit.materialPercentage == 0
     
    ) {
      return false;
    }
    return true;
  }
  validation(MatPercentage: string) {

    this.isPONo = false;
    if (!!MatPercentage) {
      const regex = /(^([1-9]){1}([0-9]{1})?(\.[0-9]{1,2})?$)|(^100$)/;
      let chrLength = MatPercentage.trim();
      this.isPONo = !(regex.test(String(MatPercentage.trim()).toLowerCase()));
    }
    return this.isPONo;
  }

  save() {
   
    if (this.isPONo == true) {
      this.toastrService.error("Please enter a valid data.");

    }
    else {
      var OriginOfGoodsToBeSaved = this.GetAllOriginOfGoodsData();
      if (OriginOfGoodsToBeSaved == null) {
        this.toastrService.warning("Please fill all mandatory fields to save the record");
        return false;
      }
      OriginOfGoodsToBeSaved.updatedBy = this.authenticationService.currentUserValue.LoginId;
      OriginOfGoodsToBeSaved.updateDateTimeBrowser = new Date();
      OriginOfGoodsToBeSaved.updateDateTimeBrowsers = new Date().toISOString();
      this.shipmentManagementService.updateOriginOfGoods(new Array(OriginOfGoodsToBeSaved)).subscribe(result => {
        if (result.statusCode == 200) {
         
          this.toastrService.success("The record is saved successfully");
    
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");

        }
      }
      );
      return true;
    }
  }
  refresh() {
    this.OriginOfGoodsToEdit = null;
    this.originOfGoodsListComponent.getOriginOfGoodsList();
  }
  selectedOriginOfGoods(selectedOriginOfGoodsToEdit: OriginOfGoods) {
    this.selectedOriginOfGoodsToEdit = Object.assign({}, selectedOriginOfGoodsToEdit);
  }

  ngAfterViewInit(): void {
  }
  getMaterialList() {

    if (this.itemListA.length == 0) {
      this.shipmentManagementService.GetOrderMaterialList(0)
        .subscribe(result => {
          this.itemListA = result.data;
          this.setSelectedOriginOfGoodsMapping();
        }
        );
    }
  }
  getCountryList() {
    if (this.itemListB.length == 0) {
      this.shipmentManagementService.GetCountryList().subscribe(res => {
        this.itemListB = res.Data;
        this.setSelectedOriginOfGoodsMapping();
      });
    }
 
  }
  getManufacturerList() {
    if (this.itemListC.length == 0) {
      this.shipmentManagementService.GetManufacturerList(0).subscribe(res => {
          this.itemListC = res.data;
        this.setSelectedOriginOfGoodsMapping();
      });
    }
  }
  setSelectedOriginOfGoodsMapping() {
    if (this.selectedOriginOfGoodsToEdit != null) {
      if (this.itemListA.length > 0 && this.selectedOriginOfGoodsToEdit.materialId != null) {
        var lista = this.itemListA.find(x => x.id == this.selectedOriginOfGoodsToEdit.materialId);
        if (lista != null) {
          this.selectedItemsA[0] = lista;
        }
      }
      if (this.itemListB.length > 0 && this.selectedOriginOfGoodsToEdit.countryId != null) {
        var listb = this.itemListB.find(x => x.Id == this.selectedOriginOfGoodsToEdit.countryId);
        if (listb!=null) {
          this.selectedItemsB[0] = listb;
          this.selectedItemsB[0].id = listb;
        }
      }
      if (this.itemListC.length > 0 && this.selectedOriginOfGoodsToEdit.locationID != null) {
        var listc = this.itemListC.find(x => x.id == this.selectedOriginOfGoodsToEdit.locationID);
        if (listc != null) {
        
          this.selectedItemsC[0] = listc;
        }
      }
      if (this.selectedOriginOfGoodsToEdit.comment != null) {
        this.Comments = this.selectedOriginOfGoodsToEdit.comment;
      }
    }
  }
  onAddItem(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
    this.itemListC.push({ "id": this.count, "itemName": data });
    this.selectedItemsC.push({ "id": this.count, "itemName": data });
  }
  onItemSelectA(item: any) {
    this.selectedItemsA[0].id = item.Id;
  }
  onItemSelectB(item: any) {
    this.selectedItemsB[0].id = item.Id;
  }
  onItemSelectC(item: any) {
    this.selectedItemsC[0].id = item.Id;
  }
  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {

  }
  onDeSelectAll(items: any) {

  }


  removeOriginOfGoodsFromEditList(OriginOfGoodsToRemove: OriginOfGoods) {
    this.OriginOfGoodsToEdit.splice(this.OriginOfGoodsToEdit.findIndex(item => item.Id === OriginOfGoodsToRemove.Id), 1)
  }

}
