import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import { ShipmentNaftaReportData } from '../../../../../core/models/ShipmentNaftaReportData.model';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import bsCustomFileInput from 'bs-custom-file-input';


@Component({
  selector: 'app-add-nafta-report',
  templateUrl: './add-nafta-report.component.html',
  styleUrls: ['./add-nafta-report.component.css']
})
export class AddNaftaReportComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  ShipmentNaftaReportData: ShipmentNaftaReportData = new ShipmentNaftaReportData();


  modalRef: NgbModalRef;
    base64Image: string;
    url: any;
    files: any;
  constructor(public router: Router, private authenticationService: AuthService, private toastrService: ToastrService, public modalService: NgbModal, private shipmentManagementService: shipmentManagementService)
  { this.ShipmentNaftaReportData = new ShipmentNaftaReportData();}
  organizationList = [];
  originCountryList = [];
  netCostList = [];
  organizationItems = [];
  originCountryItems = [];
  netCostItems = [];
  expNo: any;
  fromDate: any;
  toDate: any;
  producerName: any;
  producerTIN: any;
  producerAdd1: any;
  producerAdd2: any;
  goodsDescription: any;
  hsTariffClassNo: any;
  preferenceCriteria: any;
  producer: any;
  name: any;
  title: any;
  telePhoneFacsimile: any;
  telenumber: any;
  authSignature: any;
  count = 3;
  fileToUpload: File = null;
  ngOnInit(): void {

    this.shipmentManagementService.GetOrganizationList().subscribe(res => {
      debugger;
      this.organizationList = res.data;
      console.log(res.Data);
    });
    this.shipmentManagementService.GetCountryList().subscribe(res => {
        this.originCountryList = res.Data;
      console.log(res.Data);
    });
    this.shipmentManagementService.GetNetCost("Shipment_NAFTA_Report_data","NetCost").subscribe(res => {
      debugger;
      this.netCostList = res.data;
      console.log(res.data);
    });
  
    bsCustomFileInput.init();

  }
  onAddItemA(data: string) {
    this.count++;
    this.organizationList.push({ "id": this.count, "name": data });
    this.organizationItems.push({ "id": this.count, "name": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.originCountryList.push({ "id": this.count, "itemName": data });
    this.originCountryItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.organizationItems);
    console.log(this.originCountryItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.organizationItems);
    console.log(this.originCountryItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  isFormValid() {
    if (this.ShipmentNaftaReportData.organizationId == 0
      || this.ShipmentNaftaReportData.exporterName == ""
 


    ) {
      return false;
    }
    return true;
  }
  GetAllNaftaReportData() {
    debugger;
    if (this.expNo != null) {
      this.ShipmentNaftaReportData.expNo = this.expNo;
    }
    else
      return null
    if (this.organizationItems != null && this.organizationItems.length > 0) {
      this.ShipmentNaftaReportData.organizationId = this.organizationItems[0]?.id;
    }
    else
      return null
    if (this.originCountryItems != null && this.originCountryItems.length > 0) {
      this.ShipmentNaftaReportData.countryofOrigin = this.originCountryItems[0]?.CountryName;
    }
    else
      return null
    if (this.fromDate != null) {
      this.ShipmentNaftaReportData.fromCalendarYear = this.fromDate;
    }
    else
      return null
    if (this.toDate != null) {
      this.ShipmentNaftaReportData.toCalendarYear = this.toDate;
    }
    else
      return null
   
    if (this.producerName != null) {
      this.ShipmentNaftaReportData.importerName = this.producerName;
    }
    else
      return null

    if (this.producerTIN != null) {
      this.ShipmentNaftaReportData.importerTaxIdentificationNumber = this.producerTIN;
    }
    else
      return null
    if (this.producerAdd1 != null) {
      this.ShipmentNaftaReportData.importerAddress1 = this.producerAdd1;
    }
   
    if (this.producerAdd2 != null) {
      this.ShipmentNaftaReportData.importerAddress2 = this.producerAdd2;
    }
   
    if (this.goodsDescription != null) {
      this.ShipmentNaftaReportData.descriptionofGood = this.goodsDescription;
    }
  
    if (this.preferenceCriteria != null) {
      this.ShipmentNaftaReportData.preferenceCriterion = this.preferenceCriteria;
    }
    else
      return null
    if (this.hsTariffClassNo != null) {
      this.ShipmentNaftaReportData.hsTariffClassificationNumber = this.hsTariffClassNo;
    }
    else
      return null
    if (this.producer != null) {
      this.ShipmentNaftaReportData.producer = this.producer;
    }
    else
      return null
    if (this.netCostItems != null && this.netCostItems.length > 0) {
      this.ShipmentNaftaReportData.netCost = this.netCostItems[0]?.id;
    }
  
    if (this.name != null) {
      this.ShipmentNaftaReportData.name = this.name;
    }
    else
      return null
    if (this.title != null) {
      this.ShipmentNaftaReportData.title = this.title;
    }
    else
      return null
    if (this.telenumber != null) {
      this.ShipmentNaftaReportData.telephoneNumberVoice = this.telenumber;
    }
    else
      return null
    if (this.telePhoneFacsimile != null) {
      this.ShipmentNaftaReportData.telephoneNumberFacsimile = this.telePhoneFacsimile;
    }
    else
      return null
    if (this.authSignature != null) {
     // this.ShipmentNaftaReportData.authorizedSignature = this.authorizedSignature;
     // let imageUrl = '';

     
    }

    if (this.isFormValid()) {
      return this.ShipmentNaftaReportData;
    }
    else
      return null

  }
 
  //fileChange(event) {
  //  debugger;
  //  let fileList: FileList = event.target.files;
  //  if (fileList.length > 0) {
  //    let file: File = fileList[0];
  //    let formData: FormData = new FormData();
  //    formData.append('uploadFile', file, file.name);
  //    //  this.authorizedSignature = formData;
  //  }

  //}
  selectedFile: File = null;
  async onSelectFile(fileInput: any) {
    debugger;
    this.selectedFile = <File>fileInput.target.files[0];

   // var fileByteArray = this.getBase64string(this.selectedFile);
    var fileByteArray = await this.readFile(this.selectedFile);
  
    console.log('fileByteArray', fileByteArray);;
  
    this.ShipmentNaftaReportData.authSignature = fileByteArray;
    console.log(this.ShipmentNaftaReportData.authSignature);
   
   
  }
  
 

   readFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
         btoa(evt.target.result as string);

        console.log(btoa(evt.target.result as string));
        resolve(btoa(evt.target.result as string));
      }
    }
  });
}
   _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
   }



  OnClickSubmit(form: NgForm) {

    debugger;
 
    //if (this.isPONo == true) {
    //  this.toastrService.error("Please Enter a Valid Data.");

    //}
    //else {
    var NaftaReportToBeSaved = this.GetAllNaftaReportData();
    if (NaftaReportToBeSaved == null) {
        this.toastrService.error("Please fill all mandatory fields to save.");
        return false;
      }
    NaftaReportToBeSaved.createdBy = this.authenticationService.currentUserValue.LoginId;
    NaftaReportToBeSaved.createDateTimeBrowser = new Date();
    this.shipmentManagementService.SaveNaftaReport(new Array(NaftaReportToBeSaved)).subscribe(result => {
        if (result.statusCode == 200) {
          debugger;
          this.toastrService.success("Saved successful.")
          form.resetForm();
          this.formReload();
          //this.isPONo = false;
        } else {
          this.toastrService.error("Saving failed. Please try again later.");

        }
      }
      );
      return true;
    }
  formReload() {
    this.ShipmentNaftaReportData.organizationId = 0;
    this.ShipmentNaftaReportData.countryofOrigin = "";
    this.ShipmentNaftaReportData.netCost = "";
    this.organizationList = [];
    this.originCountryList = [];
    this.netCostList = [];
    this.ShipmentNaftaReportData = new ShipmentNaftaReportData();
    this.shipmentManagementService.GetOrganizationList().subscribe(res => {
      this.organizationList = res.data;
    });
    this.shipmentManagementService.GetCountryList().subscribe(res => {
      this.originCountryList = res.Data;
    });
    this.shipmentManagementService.GetNetCost("Shipment_NAFTA_Report_data", "NetCost").subscribe(res => {
      this.netCostList = res.data;
    });
  }
  
  }
