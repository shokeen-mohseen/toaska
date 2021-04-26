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
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {

  public dateFormat: String = "MM-dd-yyyy";

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
  constructor(private toastr: ToastrService,private router: Router ,private issuePopupService:IssuePopupService, public activeModal: NgbActiveModal, public modalService: NgbModal) { }
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
  fromDate: any;
  toDate: any;
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
  }

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
    await this.getPageSize();
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
      debugger;
      this.subModuleList = res.data;

    });
  }
  onSelectAllSub(items: any) {

    
  }
  onDeSelectAll(items: any) {

  }
  onDateChange(args) {
    this.fromDate = args.value[0];
    this.toDate = args.value[1];

  }
  openPopup(action) {
    if (action === "addComment") {
      this.modalRef = this.modalService.open(AddCommentComponent, { size: 'lg', backdrop: 'static' });
    }
  }

  getIssuePopupData() {
    if (this.selectedModuleItems.length !=0) {
      const ids = this.selectedModuleItems.map(i => i.id).join(',');
      this.paginationModel.moduleIds = ids;
    }
    if (this.selectedSubModuleItems.length != 0) {
      const ids = this.selectedSubModuleItems.map(i => i.id).join(',');
      this.paginationModel.subModuleIds = ids;
    }
    if (this.fromDate != null) {
      this.paginationModel.startDate = this.fromDate;
    }
    if (this.toDate != null) {
      this.paginationModel.endDate = this.toDate;
    }
    this.issuePopupService.getIssuePopupData(this.paginationModel).subscribe(res => {
   
      this.dataSource.data = res.data;


    });
  
  }
  btnDisplay() {
    if (this.selectedModuleItems.length != 0) {
      const ids = this.selectedModuleItems.map(i => i.id).join(',');
      this.IssuePopup.moduleIds = ids;
    }
    else
      this.toastr.warning('Please select Module');

    if (this.selectedModuleItems.length != 0) {
      if (this.selectedSubModuleItems.length != 0) {
        const ids = this.selectedSubModuleItems.map(i => i.id).join(',');
        this.IssuePopup.subModuleIds = ids;
      }
      else
        this.toastr.warning('Please select SubModule');
    }
    if ((this.selectedModuleItems.length != 0) && (this.selectedSubModuleItems.length != 0)) {
    if (this.fromDate != null) {
      this.IssuePopup.startDate = this.fromDate;
    }
    if (this.toDate != null) {
      this.IssuePopup.endDate = this.toDate;
      }
    }
    this.issuePopupService.getIssuePopupData(this.IssuePopup).subscribe(res => {

      this.dataSource.data = res.data;


    });
  }
  ExportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'IssueList.xlsx');  
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
    }
    else {
      const ids = this.ItemList.map(i => i.id).join(',');
      this.issuePopupService.deleteAllIssuePopup(ids).subscribe(x => {
        const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        this.issuePopupService.getIssuePopupData(this.paginationModel)
          .subscribe(result => {
        
            this.dataSource.data = result.data;
            this.toastr.success('Record Deleted Successfully');
            this.getIssuePopupData();
          }
          );

      });
    }
  }
  async getPageSize() {
    this.issuePopupService.getIssuePopupList()
      .subscribe(result => {

        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.issuePopupService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getIssuePopupData();
  }
}
