import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'select2';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { IssuePopupService } from '../../../shared/services/issuepopup.service';
import { IssuePopup, Module, SubModule } from '../../../core/models/IssuePopup.model';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ConfirmDeleteTabledataPopupComponent } from '@app/shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';


@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
  providers: [DatePipe]
})
export class IssueComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";
  daterange: any;
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
  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  public options: Options;
  public exampleData: any;
  modalRef: NgbModalRef;
  constructor(private toastr: ToastrService, private router: Router, private issuePopupService: IssuePopupService,
    public activeModal: NgbActiveModal, public modalService: NgbModal, private datepipe: DatePipe) { }
  displayedColumns = ['selectRow', 'moduleName', 'subModuleName', 'description', 'createdBy', 'createDateTimeServer'];
  displayedColumnsReplace = ['selectRow', 'key_Module', 'key_SubModule', 'key_IssueDescription', 'key_CreatedBy', 'key_CreateDateTime'];

  dataSource;
  selection = new SelectionModel<IssuePopup>(true, []);
  paginationModel = new IssuePopup();
  ItemList: IssuePopup[];
  filterValue = "";
  IssuePopup: IssuePopup = new IssuePopup();
  Module: Module = new Module();
  SubModule: SubModule = new SubModule();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  fromDate: string;
  toDate: string;
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    //this.paginator.length = this.paginationModel.pageSize;
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getIssuePopupData();
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
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);
      });
  }
  moduleList = [];
  selectedModuleItems = [];
  subModuleList = [];
  selectedSubModuleItems = [];
  settingsA = {};

  count = 3;

  selectRow: any;

  Comment: any;

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.Comment = 'Comment';   
    this.issuePopupService.getAllModule(this.Module).subscribe(res => {
      this.moduleList= res.data;
    });
   
    
    this.dataSource = new MatTableDataSource<IssuePopup>();
    this.ItemList = new Array<any>();
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      labelKey: 'name',
      badgeShowLimit: 3,
      searchBy: ['name']
    };
    this.fromDate= null;
    this.toDate= null;
    //await this.getPageSize();
    //this.getIssuePopupData();
  }
  onAddItemA(data: string) {
    this.count++;

  }

  onItemSelect(item: any) {
    
    if (this.selectedModuleItems.length > 1) {
      const ids = item.map(i => i.id).join(',');
      this.SubModule.ids = ids;
    }
    else {
      this.SubModule.ids = item.id;
    }
    this.issuePopupService.getAllSubModule(this.SubModule).subscribe(res => {

      this.subModuleList = res.data;
  
    });

  }
  OnItemDeSelect(item: any) {


  }
  onSelectAll(items: any) {

    const ids = items.map(i => i.id).join(',');
    this.SubModule.ids = ids;
    this.issuePopupService.getAllSubModule(this.SubModule).subscribe(res => {
      this.subModuleList = res.data;

    });
  }
  onSelectAllSub(items: any) {

    
  }
  onDeSelectAll(items: any) {

  }
  onDateChange(args) {
    var endDate = new Date();
    if (args.endDate != null) {
      endDate = new Date(args.endDate);
      endDate.setDate(endDate.getDate() + 1);
    }
    this.fromDate = args.startDate != null ? this.OnlyDateFormat(args.startDate) : args.startDate;
    this.toDate = args.endDate != null ? this.OnlyDateFormat(endDate) : args.endDate;  

  }
  openPopup(action) {
    if (action === "addComment") {
      this.modalRef = this.modalService.open(AddCommentComponent, { size: 'lg', backdrop: 'static' });
    }
  }

  getIssuePopupData() {
     this.issuePopupService.getIssuePopupData(this.paginationModel).subscribe(res => {
      this.dataSource.data = res.data;
      this.dataSource.data.forEach(s => {
        s.createDateTimeServer = this.DateFormat(s.createDateTimeServer);
      });
    });
  
  }

  async AlertResetFilter() {
    this.daterange = null;
    this.fromDate = null;
    this.toDate = null;
    this.selectedModuleItems = [];
    this.paginationModel.moduleIds = "";
    this.selectedSubModuleItems = [];
    this.paginationModel.subModuleIds = "";
    this.paginationModel.startDate = this.fromDate;
    this.paginationModel.endDate = this.toDate;
    this.filterValue = "";
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = await this.issuePopupService.getDefaultPageSize();
    this.paginationModel.itemsLength = 0;
    this.dataSource.data = [];
  }
  async btnDisplay() {
    if (this.selectedModuleItems.length != 0) {
      const ids = this.selectedModuleItems.map(i => i.id).join(',');
      this.IssuePopup.moduleIds = ids;
    }
    else {
      this.toastr.warning('Please select Module');
      return false;
    }

    if (this.selectedModuleItems.length != 0) {
      if (this.selectedSubModuleItems.length != 0) {
        const ids = this.selectedSubModuleItems.map(i => i.id).join(',');
        this.IssuePopup.subModuleIds = ids;
      }
      else {
        this.toastr.warning('Please select Sub Module');
        return false;
      }
    }
     if (this.selectedModuleItems.length !=0) {
      const ids = this.selectedModuleItems.map(i => i.id).join(',');
      this.paginationModel.moduleIds = ids;
    }
    if (this.selectedSubModuleItems.length != 0) {
      const ids = this.selectedSubModuleItems.map(i => i.id).join(',');
      this.paginationModel.subModuleIds = ids;
    }
      this.paginationModel.startDate = this.fromDate;
      this.paginationModel.endDate = this.toDate;
    //if ((this.selectedModuleItems.length != 0) && (this.selectedSubModuleItems.length != 0)) {
    //if (this.fromDate != null) {
    //  this.IssuePopup.startDate = this.fromDate;
    //}
    //if (this.toDate != null) {
    //  this.IssuePopup.endDate = this.toDate;
    //  }
    //}
    //this.issuePopupService.getIssuePopupData(this.IssuePopup).subscribe(res => {   
    //  this.dataSource.data = res.data;

    //});
    await this.getPageSize();
    this.getIssuePopupData();
  }
  ExportExcel() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.issuePopupService.getIssuePopupData(this.paginationModel).toPromise()
      .then(result => {
        var data = result.data.map(p => ({ 'ModuleName': p.moduleName, 'SubModuleName': p.subModuleName, 'Description': p.description, 'CreatedBy': p.createdBy, 'CreateDateTimeServer': p.createDateTimeServer}));
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'IssueList.xlsx');
      });
  }
  onSelectionChange(row: IssuePopup, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);

    if (checked == true) {
      this.ItemList.push(row);

    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getIssuePopupData();
    }
  }
  btnDelete() {
    if (!this.ItemList.length) {
      this.toastr.warning('Please select atleast one record');
      return false;
    }
    else {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        const ids = this.ItemList.map(i => i.id).join(',');
        this.issuePopupService.deleteAllIssuePopup(ids).subscribe(x => {
          const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
          this.issuePopupService.getIssuePopupData(this.paginationModel)
            .subscribe(result => {

              this.dataSource.data = result.data;
              this.toastr.success('Record Deleted Successfully');
              this.ItemList.length = 0;
              this.getIssuePopupData();
            }
            );

        });
      });
    }
  }
  
  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.issuePopupService.getIssuePopupData(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.issuePopupService.getDefaultPageSize();
  }


  onPaginationEvent(event) {
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getIssuePopupData();
    this.paginationModel.pageSize = event.pageSize;
  }
  DateFormat(datetime) {
    if (datetime == null)
      return null;
    var date = new Date(datetime);
    let formateddate = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm a');
    return formateddate;
  }
  OnlyDateFormat(datetime) {
    if (datetime == null)
      return null;
    var date = new Date(datetime);
    let formateddate = this.datepipe.transform(date, 'MM/dd/yyyy');
    return formateddate;
  }
}
