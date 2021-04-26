import { Component, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';
import { UserAlertHistory } from '../../../../core/models/UserAlertHistory.model';
import { UserAlertHistoryService } from '../../../../core/services/user-alert-history.service';
@Component({
  selector: 'app-alert-histort-list',
  templateUrl: './alert-histort-list.component.html',
  styleUrls: ['./alert-histort-list.component.css']
})
export class AlertHistortListComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  panelOpenState = false;
  btnEdit = function () { this.router.navigateByUrl(''); };

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
    this.paginator.length = this.paginationModel.pageSize;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
  constructor(private userAlertHistoryService: UserAlertHistoryService
    , private toastr: ToastrService) { }
  alertTypeList = [];

  alertTypeItems = [];
  settingsA = {};

  count = 3;
  async ngOnInit() {
  
    this.selectRow = 'selectRow';
 
    this.userAlertHistoryService.getUserAlertList()
      .subscribe(result => {
      
        this.alertTypeList = result.data;

      });
    await this.getPageSize();
    this.getUserAlertHistoryList();
    this.dataSource = new MatTableDataSource<UserAlertHistory>();
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
      
        this.dataSource.data = result.data;
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
  
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getUserAlertHistoryList();
  }
  onAddItemA(data: string) {
    this.count++;
    //this.itemListA.push({ "id": this.count, "itemName": data });
    //this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    //console.log(this.selectedItemsA);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    //console.log(this.selectedItemsA);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  async getPageSize() {
  
    this.userAlertHistoryService.getUserAlertHistoryList()
      .subscribe(result => {
      
        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.userAlertHistoryService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
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
  AlertApplyFilter() {
  
    //alertTypeList
  }
  AlertResetFilter() {
  
  }
}
