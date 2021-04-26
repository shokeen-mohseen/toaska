import { Component, OnInit, ViewChild, Input, EventEmitter, Output, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import bsCustomFileInput from 'bs-custom-file-input';
import { Forecast, DeleteForecastChildernMapping } from '../../../core/models/Forecast.model';
import * as XLSX from 'xlsx';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { ForecastService } from '../../../core/services/forecast.service';
import { MessageService } from '../../../core/services/message.service';
import { SpinnerObject } from '../../../core/models/SpinnerObject.model';
import { LoaderService } from '../../../shared/components/spinner/loader.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-manage-market-forecast-import',
  templateUrl: './manage-market-forecast-import.component.html',
  styleUrls: ['./manage-market-forecast-import.component.css']
})
export class ManageMarketForecastImportComponent implements OnInit {
  @Input('forecastSelected') forecastSelected: Forecast;
  childForecastList = [];
  selectedChildForecast = [];
  settingsChildForecast = {};
  displayedColumns = ['selectRow', 'forecastImportActionTypeName', 'childForecastName', 'childForecastDescription', 'importedBy', 'importedDateTime'];
  displayedColumnsReplace = ['selectRow', 'key_ActionTaken', 'key_ChildForecastName', 'key_ChildForecastDescription', 'key_ImportedBy', 'key_ImportedDateTime'];
  dataSource = new MatTableDataSource<Forecast>();
  selection = new SelectionModel<Forecast>(true, []);
  actionTaken: string = "";
  actionTakenOnExisting: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private so: SpinnerObject = new SpinnerObject();

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;
  storeData: any;

  labelName: string = "Choose File";
  fileToUpload: File = null;
  forecastName: string;
  forecastDesc: string;
  importFromExcelTab: boolean = true;
  userMessages: any = [];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row =>
        this.selection.select(row)         
      );   
  }
  isLinear = false;
  selectRow: any;
  constructor(@Inject(DOCUMENT) private _document: Document,
    public activeModal: NgbActiveModal,
    private loaderService: LoaderService,
    private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public messageService: MessageService,
    public forecastService: ForecastService) { }

  onFileSelect(event) {
    this.fileToUpload = event.target.files[0];
    this.labelName = this.fileToUpload.name;
    this.itemListA = [];
    this.selectedItemsA = [];
    this.loadDropdown();
  }

  ngOnInit(): void {
    bsCustomFileInput.init();
    this.selectRow = 'selectRow';
    this.getForecastChildDetails();
    this.settingsChildForecast = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      labelKey: 'name',
      searchBy: ['name'],
    };
    this.getMessages();

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

  tabChange($event) {
    if ($event.index === 0) {
      this.importFromExcelTab = true;
    }
    else if ($event.index === 1) { this.importFromExcelTab = false; }
  }
  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }
  exportTemplate() {
     
    this.forecastService.getForecastTemplateById(this.forecastSelected).subscribe(
      result => {
        if (result.data) {
         
          var data = [];

          result.data.forEach(row => {
            data.push(row);
          });
         
          // to convert total column from string to decimal
          for (var j = 0; j < data.length; j++) {
             data[j].Total = (data[j].Total == undefined || data[j].Total == null || data[j].Total == '') ? 0 : parseFloat(data[j].Total);            
          }

          var column = [];
          if (data.length > 0) {
            // iterating through the results array
            for (var i = 0; i < data.length; i++) {           
              // get i-th object in the results array  
              var columnsIn = data[i];
              // loop through every key in the object
              for (var key in columnsIn) {
                if (key.indexOf('#') > -1) {
                  var cname = key.replace("#", "");
                  column.push(cname);
                }

              }
              break;
            }
          }

          var Heading = [
            ["Status", "SalesManager", "ForecastName", "Enterprise", "BillingEntityCode (MAS CustomerCode)", "OrganizationName", "CustomerCode (MAS LocationAddressCode)", "LocationType", "Ship-To Location", "MaterialHierarchyCode", "Commodity", "Data Segment", "Total"],
          ];
          if (column.length > 0) {
            column.forEach(function (v) {
              Heading[0].push(v)
            });
          }
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.sheet_add_aoa(ws, Heading);
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, this.forecastSelected.name + '.xlsx');
        }
      }
    );

  }

  getForecastByCalenderType(mappedForecast) {
    this.forecastService.getForecastByCalenderType(this.forecastSelected.calendarTypeId).subscribe(
      result => {
        if (result.data) {
          this.childForecastList = result.data.filter(x => !mappedForecast.some(y => y.id === x.id) && x.id != this.forecastSelected.id);
        } else {
          this.childForecastList = [];
        }
      }
    );
  }

  getForecastChildDetails() {
    this.forecastService.getForecastChildDetailsById(this.forecastSelected).subscribe(
      result => {
        if (result.data) {
          this.dataSource.data = result.data;
          // get forecast which are not mapped and of the same calender type 
          this.getForecastByCalenderType(this.dataSource.data);
        } else {
          this.dataSource.data = [];
        }
      }
    );

  }
  importForecast() {
    if (this.importFromExcelTab) {
      this.importFromExcel();
    } else {
      this.importFromExistingForecast()
    }


  }

  importFromExcel() {
    
    if (this.isValidExcelForm()) {
      const saveForm: FormData = new FormData();
      saveForm.append('fileFieldNameOnYourApi', this.fileToUpload, this.fileToUpload.name);
      saveForm.append('forecastName', this.forecastName);
      saveForm.append('forecastDesc', this.forecastDesc);
      saveForm.append('ParentForecastId', this.forecastSelected.id.toString());
      saveForm.append('IsOverride', this.actionTaken == "add" ? "false" : "true");
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

            this.forecastService.uploadForecast(saveForm).subscribe(
              (result) => {
                this.so.status = false;
                this.so.source = "forecast"
                this.loaderService.isLoading.next(this.so);
                if (result.statusCode == 200) {
                  if (result.data) {
                    this.toastrService.success(this.getMessage("SuccessfullyImported"));
                  }
                  else {
                    this.toastrService.error(this.getMessage("ImportFailed"));
                  }
                } else {
                  this.toastrService.error(this.getMessage("ImportFailed"));
                }
                this.getForecastChildDetails();
              }, error => {
                this.toastrService.error(this.getMessage("ImportFailed"));
              });
          }
        });
    } else {
      this.toastrService.warning(this.getMessage("FillMandatoryFields"));
    }
  }

  isValidExcelForm() {

    if (!this.fileToUpload) {
      return false;
    }
    if (!this.forecastName) {
      return false;
    }
    if (this.selectedItemsA.length == 0) {
      return false;
    }
    if (this.actionTaken.length == 0) {
      return false;
    }
    return true;

  }


  importFromExistingForecast() {
    if (this.isValidExistingForecastForm()) {
      var saveForm = {
        'CreatedBy': this.authenticationService.currentUserValue.LoginId,
        'IsOverride': this.actionTakenOnExisting == "add" ? false : true,
        'ParentForecastId': this.forecastSelected.id,
        'ChildForecastId': this.selectedChildForecast[0].id,
        'ClientId': this.authenticationService.currentUserValue.ClientId,
        'SourceSystemId': this.authenticationService.currentUserValue.SourceSystemID

      };
      this.forecastService.updateForecastWithExistingForecast(saveForm).subscribe(
        (result) => {
          if (result.data && result.statusCode == 200) {
            this.toastrService.success(this.getMessage("SuccessfullyImported"));
          } else {
            this.toastrService.error(this.getMessage("ImportFailed"));
          }
          this.getForecastChildDetails();
        }, error => {
          this.toastrService.error(this.getMessage("ImportFailed"));
        });
    } else {
      this.toastrService.warning(this.getMessage("FillMandatoryFields"))
    }
  }

  isValidExistingForecastForm() {
    return this.selectedChildForecast != null
      && this.selectedChildForecast.length > 0
      && this.actionTakenOnExisting.length > 0;
  }

  deleteForecast() {
    var deleteForecastChildernMapping = new DeleteForecastChildernMapping();
    deleteForecastChildernMapping.parentForecastId = this.forecastSelected.id;
    deleteForecastChildernMapping.childForecastIdToDelete = this.selection.selected.map(x => x.id);
    this.forecastService.deleteChildForecastMapping(deleteForecastChildernMapping).subscribe(
      (result) => {
        if (result.data && result.statusCode == 200) {
          this.toastrService.success(this.getMessage("RecordsAreDeletedSuccessfully"));
          this.selection.clear();

        } else {
          this.toastrService.error(this.getMessage("RecordsDeletionFailed"));
        }
        this.getForecastChildDetails();
      }, error => {
        this.toastrService.error(this.getMessage("RecordsDeletionFailed"));
      });
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
  blockSpecialChar(event): boolean {
    const k = (event.which) ? event.which : event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));

  }

  close() {

    this.forecastService.getLastUpdatedForecast().subscribe(
      result => {
        if (result.data) {
          this.forecastSelected = result.data;
          this.activeModal.dismiss('Cross click');
          this._document.defaultView.location.reload();
        }
      }
    );
   
  }
  refresh() {
    this.getForecastChildDetails();
    this.selection.clear();
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
}
