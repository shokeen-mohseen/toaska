import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import { SpinnerObject } from '../../../core/models/SpinnerObject.model';
import { LoaderService } from '../../../shared/components/spinner/loader.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services';
import { MessageService } from '../../../core/services/message.service';
import { ForecastService } from '../../../core/services/forecast.service';
import { DOCUMENT } from '@angular/common';
import * as XLSX from 'xlsx';
import { CreateComputeSalesForecastComponent } from '../create-compute-sales-forecast/create-compute-sales-forecast.component';

@Component({
  selector: 'app-upload-forecast',
  templateUrl: './upload-forecast.component.html',
  styleUrls: ['./upload-forecast.component.css']
})
export class UploadForecastComponent implements OnInit {

  selectedItemsA = [];
  settingsA = {};
  itemListA = [];
  storeData: any;
  fileToUpload: File = null;
  forecastName: string;
  forecastDesc: string;
  actionTaken: string = "";
  private so: SpinnerObject = new SpinnerObject();
  userMessages: any = [];
  labelName: string = "Choose File";
  count = 3;
  @Input()
  forecastComponentInstance: CreateComputeSalesForecastComponent;


  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public activeModal: NgbActiveModal,
    private loaderService: LoaderService,
    private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public messageService: MessageService,
    public forecastService: ForecastService
  ) { }

  onFileSelect(event) {
    this.fileToUpload = event.target.files[0];
    this.labelName = this.fileToUpload.name;
    this.itemListA = [];
    this.selectedItemsA = [];
    this.loadDropdown();
  }
  ngOnInit(): void {
    bsCustomFileInput.init();

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: ['name'],
      searchBy: ['name']
    };
    this.getMessages();
  }


  isValidExcelForm() {
    return this.fileToUpload && this.forecastDesc && this.forecastName && this.selectedItemsA.length > 0;
  }
  importForecast() {
    if (this.isValidExcelForm()) {
      const saveForm: FormData = new FormData();
      saveForm.append('fileFieldNameOnYourApi', this.fileToUpload, this.fileToUpload.name);
      saveForm.append('forecastName', this.forecastName);
      saveForm.append('forecastDesc', this.forecastDesc);
      saveForm.append('CreatedBy', this.authenticationService.currentUserValue.LoginId);
      saveForm.append('SheetName', this.selectedItemsA[0].name);
      saveForm.append('UpdateDateTimeBrowser', this.forecastService.convertDatetoStringDate(new Date()));
      this.forecastService.CheckDuplicateForecast(this.forecastName).subscribe(
        (result) => {
          if (result.data) {
            this.toastrService.error(this.getMessage("ForecastAlreadyExists"));
            return false;
          }
          else {
            this.so.status = true;
            this.so.source = "forecast"
            this.loaderService.mainSource = this.so.source;
            this.loaderService.isLoading.next(this.so);

            this.forecastService.uploadNewForecast(saveForm).subscribe(
              (result) => {
            
                this.so.status = false;
                this.so.source = "forecast"
                this.loaderService.isLoading.next(this.so);
                if (result.statusCode == 200) {
                  this.toastrService.success(this.getMessage("SuccessfullyImported"));
                  //To refresh forecast grid
                  if (this.forecastComponentInstance != null && this.forecastComponentInstance != undefined)
                    this.activeModal.dismiss('Cross click'); 
                    this.forecastComponentInstance.getPageSetupSize();
                    this.forecastComponentInstance.getForecastDetail();

                //  this.close();
                } else {
                  this.toastrService.error(this.getMessage("ImportFailed"));
                }

              }, error => {
                this.toastrService.error(this.getMessage("ImportFailed"));
              });
          }
        });

    } else {
      this.toastrService.warning(this.getMessage("FillMandatoryFields"))
    }
  }
  getMessages() {
    this.messageService.getMessagesByModuleCode("CSFOR", parseInt(localStorage.clientId)).subscribe(
      result => {
        if (result.data) {
          this.userMessages = result.data;
        }
      }
    );
  }
  getMessage(messageCode: string) {
    if (this.userMessages) {
      return this.userMessages.find(x => x.code == messageCode)?.message1;
    }
    return '';
  }
  close() {
    this.activeModal.dismiss('Cross click');    
    this._document.defaultView.location.reload();
    
  }
  blockSpecialChar(event): boolean {
    const k = (event.which) ? event.which : event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));

  }
  loadDropdown() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data1 = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data1.length; ++i) arr[i] = String.fromCharCode(data1[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      // this.itemListA = workbook.SheetNames;
      for (var i = 0; i < workbook.SheetNames.length; i++) {

        this.itemListA[i] =
        {
          id: i.toString(),
          name: workbook.SheetNames[i].toString()
        }

      }
      if (this.itemListA.length == 1) {
        var lista = this.itemListA.find(x => x.name == this.itemListA[0].name);
        // if (lista != null) {
        this.selectedItemsA[0] = lista;
        // }
        // this.selectedItemsA[0].name = first_sheet_name;
      }
      //this.worksheet = workbook.Sheets[first_sheet_name];


    }
    readFile.readAsArrayBuffer(this.fileToUpload);
  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    //this.selectedItemsA = item;

  }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }
}
