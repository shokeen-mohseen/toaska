import { Component, OnInit, AfterViewInit} from '@angular/core';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { OriginOfGoods } from '../../../../../core/models/OriginOfGoods.model';
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
    this.shipmentManagementService.GetOrderMaterialList(0).subscribe(res => {
      this.itemListA = res.data.map(p => ({ id: p.id, itemName: p.name }));
    });
    this.shipmentManagementService.GetCountryList().subscribe(res => {
      this.itemListB = res.Data.map(p => ({ id: p.Id, itemName: p.CountryName }));
    });
    this.shipmentManagementService.GetManufacturerList(0).subscribe(res => {
      this.itemListC = res.data.map(p => ({ id: p.id, itemName: p.name }));

    });
    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      labelKey: 'itemName',
      searchBy: ['itemName']
    };   

  }
  ngAfterViewInit(): void {
  }


  onAddItem(data: string) {

  }
  onItemSelectA(item: any) {
    this.selectedItemsA[0].id = item.id;
  }
  onItemSelectB(item: any) {
    this.selectedItemsB[0].id = item.id;
  }
  onItemSelectC(item: any) {
    this.selectedItemsC[0].id = item.id;
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
 

  async GetAllOriginOfGoodsData() {
    
    if (this.selectedItemsA.length != 0) {
      this.OriginOfGoods.materialId = this.selectedItemsA[0]?.id;
    }
    else
      return null
    if (this.selectedItemsB.length != 0) {
      this.OriginOfGoods.countryId = this.selectedItemsB[0]?.id;
    }
    else
      return null
    if (this.selectedItemsC.length != 0) {
      this.OriginOfGoods.locationID = this.selectedItemsC[0]?.id;
    }
    else
      return null
    if (this.OriginOfGoods.materialPercentage != null) {
      this.OriginOfGoods.materialPercentage = Number(this.OriginOfGoods.materialPercentage);
    }
    else
      return null
    if (this.Comments != null) {

      this.OriginOfGoods.comment = this.Comments.toString().trim();

    }
    else
      return null
    if (this.isFormValid()) {
      return this.OriginOfGoods;
    }
    else
      return null

  }

  async OnClickSubmit(form: NgForm) {
    if (this.isPONo == true) {
      this.toastrService.error("Please Enter a Valid Data.");
      return false;
    }
    else {
      var OriginOfGoodsToBeSaved = await this.GetAllOriginOfGoodsData();      
      if (OriginOfGoodsToBeSaved == null) {
        this.toastrService.warning("Please fill all mandatory fields to save the record");
        return false;
      }
    
      this.shipmentManagementService.duplicateOriginOfGoods(this.OriginOfGoods)
        .subscribe(async res => {
          var data = res.data;
          if (data) {
            this.toastrService.error("Information: Record already exists.");
            return false;
          }
          else {
            this.shipmentManagementService.OriginOfGoodsPercentage(this.OriginOfGoods)
              .subscribe(async res => {
                var data = parseFloat(res.data);
                if (data > 100) {
                  this.toastrService.warning("Total material percentage for all location can not be more than 100.");
                  return false;
                }
                else {
                  this.OriginOfGoods.createdBy = this.authenticationService.currentUserValue.LoginId;
                  this.OriginOfGoods.createDateTimeBrowsers = new Date().toISOString();
                  this.OriginOfGoods.updatedBy = this.authenticationService.currentUserValue.LoginId;
                  this.OriginOfGoods.updateDateTimeBrowsers = new Date().toISOString();
                  this.shipmentManagementService.SaveOriginOfGoods(new Array(this.OriginOfGoods)).subscribe(result => {
                    if (result.statusCode == 200) {
                      this.toastrService.success("The record is saved successfully");
                      form.resetForm();
                      this.formReload();
                      this.isPONo = false;
                    } else {
                      this.toastrService.error("The record could not be saved. Please contact Tech Support");
                    }
                  }
                  );
                }
              });
          }
        });      
     
      return true;
    }
  }
  formReload() {
    this.OriginOfGoods.materialId = 0;
    this.OriginOfGoods.countryId = 0;
    this.OriginOfGoods.locationID = 0;
    this.OriginOfGoods.materialPercentage = 0;
    this.OriginOfGoods.comment = "";
    this.MatPercentage= [];
    this.Comment = [];
    this.OriginOfGoods = new OriginOfGoods();
    this.selectedItemsA = [];
    this.selectedItemsB = [];
    this.selectedItemsC = [];
  }
}
