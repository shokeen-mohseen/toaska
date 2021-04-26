import { Component, OnInit, AfterViewInit} from '@angular/core';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { Event } from 'ngx-bootstrap/utils/facade/browser';
import { OriginOfGoods } from '../../../../../core/models/OriginOfGoods.model';
import { Id } from '../../../../system-settings/freight-mode/map-equipment-type/map-equipment-type.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-origin-of-goods',
  templateUrl: './add-origin-of-goods.component.html',
  styleUrls: ['./add-origin-of-goods.component.css']
})
export class AddOriginOfGoodsComponent implements OnInit, AfterViewInit {

  OriginOfGoods: OriginOfGoods = new OriginOfGoods();

  ngForm: FormGroup;
  isPONo: boolean = false;
  values: any;
  itemListA = [];
  itemListB = [];
  itemListC = [];
  MaterialPercentage : any;
  Comments = [];
  selectedItemsA = [];
  settings = {};
  count = 3;
  selectedItemsB = [];
  selectedItemsC = [];
  MatPercentage: [];
  Comment = [];
   
  constructor(private shipmentManagementService: shipmentManagementService,
    private toastrService: ToastrService, private authenticationService: AuthService, private fb: FormBuilder, private router: Router) {
    
    this.OriginOfGoods = new OriginOfGoods();
  }

  ngOnInit(): void {
    debugger;
    this.shipmentManagementService.GetOrderMaterialList(0).subscribe(res => {
      this.itemListA = res.data;
      console.log(res.data);
    });
    this.shipmentManagementService.GetCountryList().subscribe(res => {
      this.itemListB = res.Data;
      console.log(res.Data);
    });
    this.shipmentManagementService.GetManufacturerList(0).subscribe(res => {
      debugger;
      this.itemListC = res.data;
      console.log(res.data);
    });
    this.settings = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }
  ngAfterViewInit(): void {
  }


  selectedCharge(GetOriginOfGoodsData: OriginOfGoods) {
    this.OriginOfGoods = Object.assign({}, GetOriginOfGoodsData);
  }
  onAddItem(data: string) {
    debugger;
    this.count++;
    this.itemListA.push({ "id": this.count, "name": data });
    this.selectedItemsA.push({ "id": this.count, "name": data });
    this.itemListB.push({ "id": this.count, "CountryName": data });
    this.selectedItemsB.push({ "id": this.count, "CountryName": data });
    this.itemListC.push({ "ID": this.count, "name": data });
    this.selectedItemsC.push({ "id": this.count, "name": data });
  }
  onItemSelect(item: any) {

  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {

  }
  onDeSelectAll(items: any) {

  }

  isFormValid() {
    if (this.OriginOfGoods.materialId == 0
      || this.OriginOfGoods.countryId == 0
      || this.OriginOfGoods.locationID == 0
      || this.OriginOfGoods.materialPercentage == 0
   
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

  GetAllOriginOfGoodsData() {

 
    if (this.selectedItemsA != null) {
      this.OriginOfGoods.materialId = this.selectedItemsA[0]?.id;
    }
    else
      return null
    if (this.selectedItemsB != null) {
      this.OriginOfGoods.countryId = this.selectedItemsB[0]?.Id;
    }
    else
      return null
    if (this.selectedItemsC != null) {
      this.OriginOfGoods.locationID = this.selectedItemsC[0]?.id;
    }
    else
      return null
    if (this.OriginOfGoods.materialPercentage != null) {
      this.OriginOfGoods.materialPercentage = Number(this.OriginOfGoods.materialPercentage);
    }
    else
      return null
    if (this.Comments != null ) {
      this.OriginOfGoods.comment = this.Comments.toString();
    }
    else
      return null
    if (this.isFormValid()) {
      return this.OriginOfGoods;
    }
    else
      return null

  }
  OnClickSubmit(form: NgForm) {

    debugger;

    if (this.isPONo == true) {
      this.toastrService.error("Please Enter a Valid Data.");

    }
    else {
      var OriginOfGoodsToBeSaved = this.GetAllOriginOfGoodsData();
      if (OriginOfGoodsToBeSaved == null) {
        this.toastrService.error("Please fill all mandatory fields to save.");
        return false;
      }
      OriginOfGoodsToBeSaved.createdBy = this.authenticationService.currentUserValue.LoginId;
      OriginOfGoodsToBeSaved.createDateTimeBrowser = new Date();
      this.shipmentManagementService.SaveOriginOfGoods(new Array(OriginOfGoodsToBeSaved)).subscribe(result => {
        if (result.statusCode == 200) {
          debugger;
          this.toastrService.success("Saved successful.")
          form.resetForm();
          this.formReload();
          this.isPONo = false;
        } else {
          this.toastrService.error("Saving failed. Please try again later.");
         
        }
      }
      );
      return true;
    }
  }
  formReload() {
    this.OriginOfGoods.materialId = 0;
    this.OriginOfGoods.countryId = 0;
    this.OriginOfGoods.locationID = 0;
    this.OriginOfGoods.materialPercentage = 0;
    this.OriginOfGoods.comment = "";
    this. itemListA = [];
    this. itemListB = [];
    this.itemListC = [];
    this.MatPercentage= [];
    this.Comment = [];
    this.OriginOfGoods = new OriginOfGoods();
    this.shipmentManagementService.GetOrderMaterialList(0).subscribe(res => {
    this.itemListA = res.data; 
    });
    this.shipmentManagementService.GetCountryList().subscribe(res => {
    this.itemListB = res.Data;
    });
    this.shipmentManagementService.GetManufacturerList(0).subscribe(res => {
    this.itemListC = res.data;
    });
  }
}
