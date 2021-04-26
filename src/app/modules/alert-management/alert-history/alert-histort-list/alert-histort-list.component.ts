import { Component, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
//import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';
import { UserAlertHistory } from '../../../../core/models/UserAlertHistory.model';
import { UserAlertHistoryService } from '../../../../core/services/user-alert-history.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alert-histort-list',
  templateUrl: './alert-histort-list.component.html',
  styleUrls: ['./alert-histort-list.component.css'],
  providers: [DatePipe]
})
export class AlertHistortListComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };
  daterange: any;
  modalRef: NgbModalRef;

  displayedColumns = ['selectRow', 'alertType', 'name', 'sentToEmailAddress', 'dateDispatched'];

  displayedColumnsReplace = ['selectRow', 'key_Alertype', 'key_Name', 'key_Sendemail', 'key_Datedis'];
  dataSource;
  selection = new SelectionModel<UserAlertHistory>(true, []);
  paginationModel = new UserAlertHistory();
  ItemList: UserAlertHistory[];
  filterValue = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('SelectedUserAlertHistory') SelectedUserAlertHistory = new EventEmitter<UserAlertHistory[]>();
  @Input('UserAlertHistoryToSelect') UserAlertHistoryToSelect: UserAlertHistory[];
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
   // this.paginator.length = this.paginationModel.pageSize;
  }

  async applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.paginationModel.filterOn = this.filterValue; // Datasource defaults to lowercase matches
    await this.getPageSize();
    this.getUserAlertHistoryList();
  }

  onSelectionChange(row: UserAlertHistory, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);

    if (checked == true) {
      this.ItemList.push(row);
      console.log('checked', row)
    }
    else {
      console.log('unchecked', row)
      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.SelectedUserAlertHistory.emit(this.selection.selected);
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
        this.SelectedUserAlertHistory.emit(this.selection.selected);
      });
  }


  selectRow: any;
  constructor(private userAlertHistoryService: UserAlertHistoryService, private toastr: ToastrService, private datepipe: DatePipe) { }
  alertTypeList = [];

  alertTypeItems = [];
  settingsA = {};
  ScheduledShipDate: any;
  count = 3;
  async ngOnInit() {
    this.selectRow = 'selectRow';
 
    this.userAlertHistoryService.getUserAlertList(this.paginationModel)
      .subscribe(result => {
        this.alertTypeList = result.data;

      });
    await this.getPageSize();
    this.getUserAlertHistoryList();
   
     this.ItemList = new Array<any>();
   
    //this.itemListA = [
    //  { "id": 1, "itemName": "Option 1" },
    //  { "id": 2, "itemName": "Option 2" },
    //  { "id": 3, "itemName": "Option 3" },
    //  { "id": 4, "itemName": "Option 4" },
    //  { "id": 5, "itemName": "Option 5" },
    //  { "id": 6, "itemName": "Option 6" }
    //];


    //this.settingsA = {
    //  singleSelection: true,
    //  text: "Select",
    //  selectAllText: 'Select All',
    //  unSelectAllText: 'UnSelect All',
    //  enableSearchFilter: true,
    //  addNewItemOnFilter: true
    //};

  }
  getUserAlertHistoryList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.userAlertHistoryService.getAllUserAlertHistoryList(this.paginationModel)
      .subscribe(result => {
        this.dataSource = new MatTableDataSource<UserAlertHistory>();
        this.dataSource.data = result.data;
        this.dataSource.data.forEach(s => {
          s.dateDispatched = this.DateFormat(this.userAlertHistoryService.getLocalDateTime(s.dateDispatched));          
        });
         this.setRowSelection();
      }
      );

  }
  setRowSelection() {

    if (this.UserAlertHistoryToSelect != null && this.UserAlertHistoryToSelect.length > 0) {
      this.dataSource.data.foreach(row => {
        if (this.UserAlertHistoryToSelect.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isselected = true;
        }
        else {
          this.selection.deselect(row);
          row.isselected = false;
        }

      });
    }
  }
  customSort(event) {

    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getUserAlertHistoryList();
    }
  }
  onPaginationEvent(event) {

    //this.filterValue = "";
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //this.paginationModel.pageSize = event.pageSize;
    //this.getUserAlertHistoryList();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getUserAlertHistoryList();
    this.paginationModel.pageSize = event.pageSize;
  }
  onAddItemA(data: string) {
    this.count++;

  }

  onItemSelect(item: any) {
    console.log(item);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
  
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.userAlertHistoryService.getAllUserAlertHistoryList(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.userAlertHistoryService.getDefaultPageSize();
   // this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }
/*  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/
  deleteAlertHistoryList(AlertItemList: UserAlertHistory[]) {
    if (!AlertItemList.length) {
    this.toastr.warning('Please select atleast one record');
  }
  else {
      const ids = AlertItemList.map(i => i.id).join(',');
    this.userAlertHistoryService.deleteAllUserAlertHistory(ids).subscribe(x => {
      console.log("delete", x);

      const newList = this.dataSource.data.filter(item => !AlertItemList.includes(item as any))
      this.userAlertHistoryService.getAllUserAlertHistoryList(this.paginationModel)
        .subscribe(result => {
            this.dataSource.data = result.data;
          this.toastr.success('Record(s) Deleted Successfully');
          this.getUserAlertHistoryList();
        }
        );

    });
  }
  }
  dateValue: any;
  StartDate: any;
  EndDate: any;
  async AlertApplyFilter() {  
    if (this.alertTypeItems.length > 0) {
      this.paginationModel.alertId = this.alertTypeItems.map(({ id }) => id).join(",");

    }
    else {
      this.paginationModel.alertId = "";
    }
    this.paginationModel.startDate = this.StartDate;
    this.paginationModel.endDate = this.EndDate;
   // this.userAlertHistoryService.getAlertFilterData(this.paginationModel ).subscribe(result => {
   // this.dataSource.data = result.data;
   // }
   // );
    this.filterValue = "";
    await this.getPageSize();
    this.getUserAlertHistoryList();
  }
  async AlertResetFilter() {
    this.daterange = null;
    this.StartDate = null;
    this.EndDate = null;
    this.alertTypeItems.length = 0;   
    this.paginationModel.alertId = "";    
    this.paginationModel.startDate = this.StartDate;
    this.paginationModel.endDate = this.EndDate;    
    this.filterValue = "";
    await this.getPageSize();
    this.getUserAlertHistoryList();
  }
  onChange(args) {
    this.StartDate = args.startDate != null ? this.OnlyDateFormat(args.startDate) : args.startDate;
    this.EndDate = args.endDate != null ? this.OnlyDateFormat(args.endDate) : args.endDate;  
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
