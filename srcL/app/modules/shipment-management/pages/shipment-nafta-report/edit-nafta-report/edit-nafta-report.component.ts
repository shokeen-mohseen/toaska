import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Options } from 'select2';
import { DelSignComponent } from '../del-sign/del-sign.component';
import { ShipmentNaftaReportData } from '../../../../../core/models/ShipmentNaftaReportData.model';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import moment from 'moment';
import bsCustomFileInput from 'bs-custom-file-input';
@Component({
  selector: 'app-edit-nafta-report',
  templateUrl: './edit-nafta-report.component.html',
  styleUrls: ['./edit-nafta-report.component.css']
})
export class EditNaftaReportComponent implements OnInit {
  Inactive: boolean = false;
  public dateFormat: String = "MM-dd-yyyy";

  @Input() NaftaReportToEdit: ShipmentNaftaReportData[];
  public options: Options;
  public exampleData: any;
  public value: Object = new Date();
  modalRef: NgbModalRef;

  constructor(private shipmentManagementService: shipmentManagementService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public router: Router,
    public modalService: NgbModal) {
  }
  @Input() ShipmentNaftaReportDataToEdit: ShipmentNaftaReportData[];
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
  dateRange : Date;
  count = 3;
  selectedNaftaReportToEdit: ShipmentNaftaReportData = null;

  labelName: string = "Choose File";

  ngOnInit(): void {
    this.Inactive = this.shipmentManagementService.Permission == false ? true : false;
    // set the first record to edit by default
    this.selectedNaftaReportData(this.ShipmentNaftaReportDataToEdit[0]);
    this.getDropdownList();
    //this.getOrganizationList();
    //this.getCountryList();
    //this.getNetCost();
    bsCustomFileInput.init();
  }
  getDropdownList() {
    if (this.organizationItems.length == 0) {
      this.shipmentManagementService.GetOrganizationList().subscribe(res => {
        this.organizationList = res.data;
        this.setSelectedNaftaReportMapping();
      });
    }
    if (this.originCountryItems.length == 0) {
      this.shipmentManagementService.GetCountryList().subscribe(res => {
        this.originCountryList = res.Data;
        this.setSelectedNaftaReportMapping();
      });
    }
    if (this.netCostItems.length == 0) {
      this.shipmentManagementService.GetNetCost("Shipment_NAFTA_Report_data", "NetCost").subscribe(res => {
        this.netCostList = res.data;
        if (this.organizationList.length > 0 || this.originCountryList.length > 0|| this.netCostList.length > 0)
          this.setSelectedNaftaReportMapping();
      });
    }
    if (this.organizationList.length>0 || this.originCountryList.length > 0 || this.netCostList.length>0)
    this.setSelectedNaftaReportMapping();
  }


  getNetCost() {
   

  }
  setSelectedNaftaReportMapping() {
    if (this.selectedNaftaReportToEdit != null) {
      if (this.organizationList.length > 0 && this.selectedNaftaReportToEdit.organizationId != null) {
        var orgitem = this.organizationList.find(x => x.id == this.selectedNaftaReportToEdit.organizationId);
        if (orgitem!=null) {
          this.organizationItems[0] = orgitem;
        }
      }
      if (this.originCountryList.length > 0 && this.selectedNaftaReportToEdit.countryofOrigin != null) {
        var country = this.originCountryList.find(x => x.CountryName == this.selectedNaftaReportToEdit.countryofOrigin);
        if (country != null) {
          this.originCountryItems[0] = country;
          this.originCountryItems[0].id = country.Id;
        }
      }
      if (this.netCostList.length > 0 && this.selectedNaftaReportToEdit.netCost != null) {
        var netcost = this.netCostList.find(x => x.id.toString() == this.selectedNaftaReportToEdit.netCost);
        if (netcost != null) {
          this.netCostItems[0] = netcost;
        }
      }
      this.expNo = this.selectedNaftaReportToEdit.expNo;
      this.value= [new Date(this.selectedNaftaReportToEdit.fromCalendarYear.toString().split('T')[0]), new Date(this.selectedNaftaReportToEdit.toCalendarYear.toString().split('T')[0])];
      this.producerName = this.selectedNaftaReportToEdit.importerName;
      this.producerTIN = this.selectedNaftaReportToEdit.importerTaxIdentificationNumber;
      this.producerAdd1 = this.selectedNaftaReportToEdit.importerAddress1;
      this.producerAdd2 = this.selectedNaftaReportToEdit.importerAddress2;
      this.producer = this.selectedNaftaReportToEdit.producer;
      this.goodsDescription = this.selectedNaftaReportToEdit.descriptionofGood;
      this.hsTariffClassNo = this.selectedNaftaReportToEdit.hsTariffClassificationNumber;
      this.preferenceCriteria = this.selectedNaftaReportToEdit.preferenceCriterion;
      this.name = this.selectedNaftaReportToEdit.name;
      this.title = this.selectedNaftaReportToEdit.title;
      this.telenumber = this.selectedNaftaReportToEdit.telephoneNumberVoice;
      this.telePhoneFacsimile = this.selectedNaftaReportToEdit.telephoneNumberFacsimile;
      if (this.selectedNaftaReportToEdit.authorizedSignature != null && this.selectedNaftaReportToEdit.authorizedSignature != "")
        this.authSignature = "data:image/png;base64," + this.selectedNaftaReportToEdit.authorizedSignature;
     
    }
  } 

  onAddItemA(data: string) {
    this.count++;
    this.organizationList.push({ "id": this.count, "itemName": data });
    this.organizationItems.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.originCountryList.push({ "id": this.count, "itemName": data });
    this.originCountryItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    this.originCountryItems[0].id = item.Id;
  }
  OnItemDeSelect(item: any) {

  }
  onSelectAll(items: any) {
 
  }
  onDeSelectAll(items: any) {
  
  }

  selectedNaftaReportData(selectedNaftaReportToEdit: ShipmentNaftaReportData) {
    this.selectedNaftaReportToEdit = Object.assign({}, selectedNaftaReportToEdit);
  }
  selectedFile: File = null;
  async onSelectFile(fileInput: any) {
    this.selectedFile = <File>fileInput.target.files[0];
    var fileByteArray = await this.readFile(this.selectedFile);
    this.selectedNaftaReportToEdit.authSignature = fileByteArray;
    this.labelName = this.selectedFile.name;
  }
  readFile(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          btoa(evt.target.result as string);
          resolve(btoa(evt.target.result as string));
        }
      }
    });
  }
  save() {

      var NaftaReportToBeSaved = this.GetAllNaftaReportData();
    if (NaftaReportToBeSaved == null) {
        this.toastrService.error("Please fill all mandatory fields to save the record");
        return false;
      }
    NaftaReportToBeSaved.updatedBy = this.authenticationService.currentUserValue.LoginId;
    NaftaReportToBeSaved.updateDateTimeBrowser = new Date();
    NaftaReportToBeSaved.updateDateTimeBrowsers = new Date().toISOString();
    this.shipmentManagementService.updateNaftaReport(new Array(NaftaReportToBeSaved)).subscribe(result => {
        if (result.statusCode == 200) {

          this.toastrService.success("The record is saved successfully");
     
        } else {
          this.toastrService.error("The record could not be saved. Please contact Tech Support");

        }
      }
      );
      return true;
  }
  GetAllNaftaReportData() {
    if (this.organizationItems != null && this.organizationItems.length > 0) {
      this.selectedNaftaReportToEdit.organizationId = this.organizationItems[0]?.id;
    }
    else
      return null
    if (this.originCountryItems != null && this.originCountryItems.length > 0) {
      this.selectedNaftaReportToEdit.countryofOrigin = this.originCountryItems[0]?.CountryName;
    }
    else
      return null
    if (this.netCostItems != null && this.netCostItems.length > 0) {
      this.selectedNaftaReportToEdit.netCost = this.netCostItems[0]?.id;
    }
    else
      return null
    if (this.expNo != null && this.expNo !="") {
      this.selectedNaftaReportToEdit.expNo = this.expNo.trim();
    }
    else
      return null
    if (this.fromDate != null && this.fromDate != "" ) {
      this.selectedNaftaReportToEdit.fromCalendarYear = this.fromDate
    }
    else
      return null
    if (this.toDate != null && this.toDate != "") {
      this.selectedNaftaReportToEdit.toCalendarYear = this.toDate
    }
    else
      return null
    if (this.producerName != null && this.producerName != "") {
      this.selectedNaftaReportToEdit.importerName = this.producerName.trim();
    }
    else
      return null
    if (this.producerTIN != null && this.producerTIN != "") {
      this.selectedNaftaReportToEdit.importerTaxIdentificationNumber = this.producerTIN.trim();
    }
    else
      return null
    
    this.selectedNaftaReportToEdit.importerAddress1 = this.producerAdd1.trim();
    this.selectedNaftaReportToEdit.importerAddress2 = this.producerAdd2.trim();
    this.selectedNaftaReportToEdit.descriptionofGood = this.goodsDescription.trim();


    if (this.preferenceCriteria != null && this.preferenceCriteria != "") {
      this.selectedNaftaReportToEdit.preferenceCriterion = this.preferenceCriteria.trim();
    }
    else
      return null
    if (this.hsTariffClassNo != null && this.hsTariffClassNo != "") {
      this.selectedNaftaReportToEdit.hsTariffClassificationNumber = this.hsTariffClassNo.trim();
    }
    else
      return null
    if (this.name != null && this.name != "") {
      this.selectedNaftaReportToEdit.name = this.name.trim();
    }
    else
      return null
    if (this.title != null && this.title != "") {
      this.selectedNaftaReportToEdit.title = this.title.trim();
    }
    else
      return null
    if (this.telenumber != null && this.telenumber != "") {
      this.selectedNaftaReportToEdit.telephoneNumberVoice = this.telenumber.trim();
    }
    else
      return null
    if (this.telePhoneFacsimile != null && this.telePhoneFacsimile != "") {
      this.selectedNaftaReportToEdit.telephoneNumberFacsimile = this.telePhoneFacsimile.trim();
      }
      else
        return null
      
    if (this.isFormValid()) {
      return this.selectedNaftaReportToEdit;
    }
    else
      return null

  }
  isFormValid() {
    if (this.selectedNaftaReportToEdit.organizationId == 0) {
      return false;
    }
    return true;
  }
  onDateChange(args) {
    this.fromDate = args.value[0];
    this.toDate = args.value[1];

  }
  deleteSignature() {
    this.selectedNaftaReportToEdit.authSignature = "";
    this.selectedNaftaReportToEdit.authorizedSignature = "";
    this.authSignature = "";

  }

}
