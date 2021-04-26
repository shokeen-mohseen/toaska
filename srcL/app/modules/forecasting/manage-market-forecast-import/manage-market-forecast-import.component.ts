import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isLinear = false;
  selectRow: any;
  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public messageService: MessageService, 
    public forecastService: ForecastService) { }

  onFileSelect(event) {
    this.fileToUpload = event.target.files[0];
    this.labelName = this.fileToUpload.name;
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
  }
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
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result.data);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
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
          this.getForecastByCalenderType(this.dataSource.data );
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
      saveForm.append('forecastId', this.forecastSelected.id.toString());
      saveForm.append('Override', this.actionTaken == "add" ? "false" : "true");
      saveForm.append('CreatedBy', this.authenticationService.currentUserValue.LoginId);

      this.forecastService.uploadForecast(saveForm).subscribe(
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

  isValidExcelForm() {
    return this.fileToUpload && this.forecastDesc && this.forecastName && this.actionTaken.length > 0;
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
}
