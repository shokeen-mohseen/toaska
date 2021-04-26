import { Component, ViewChild, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CreditManagementService } from '../../../../../core/services/CreditManagement.service';
 
import { ResizeEvent } from 'angular-resizable-element';
import { CreditSummaryCM } from '../../../../../core/models/creditManagementOrder.model';

@Component({
  selector: 'app-all-user-list',
  templateUrl: './all-user-list.component.html',
  styleUrls: ['./all-user-list.component.css']
})
export class AllUserListComponent implements OnInit {

  ItemList = [];
  selectRow: any;
  //isAllSelected: boolean = false;
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();
  @Input('modulesToSelect') modulesToSelect: CreditSummaryCM[];

  displayedColumns = ['selectRow', 'billingEntity', 'creditlimitFromMAS', 'availableCreditFromMAS', 'valueOfUnshippedPlannedOrdersInLamps', 'remainingCredit'];
  displayedColumnsReplace = ['selectRow', 'key_CustomerBillingEntity', 'key_CreditlimitfromMAS', 'key_AvailableCreditLimit', 'key_Valueofunshipped', 'key_Remainingcredit'];
  dataSource = new MatTableDataSource <CreditSummaryCM>();
  selection = new SelectionModel<CreditSummaryCM>(true, []);
 // @Output('selectedCredit') selectedCredit = new EventEmitter<CreditSummaryCM[]>();
 // @Input('creditToSelect') creditToSelect: CreditSummaryCM;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue = "";
  paginationModel = new CreditSummaryCM();

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getCreditSummaryList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getCreditSummaryList();
    }

  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
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

  constructor(private CreditManagementService: CreditManagementService) {
  }

  //CreditSummaryCM: any = {
    // OrgnizationID: this.authService.currentUserValue.Organizetion,
   // OrgnizationID: 68,
    // This needs to be uncommented. It has been commented to get data for all MAS data
    //IsMass: 1
  // };
  //CreditSummaryCM = new CreditSummaryCM();

  selectedCheckbox(e: any, selectedData) {
   

    //if (selectedData.index != 0 ) {

    //  this.updatetest(value, selectedData);
    if (e.checked == true) {
      this.ItemList.push(selectedData);
    }
    else {
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    this.dataemit();


  }


  dataemit() {
    this.checkBoxClick.emit(this.ItemList);

  }


  selectAll(check: any) {
    this.selection.clear();
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
  //  this.row.IsSelected = this.isAllSelected;
      this.selection.toggle(row);
      if (check.checked) { this.ItemList.push(row); this.checkBoxClick.emit(this.ItemList); }
    });
    if (!check.checked) { this.ItemList.length = 0; this.checkBoxClick.emit(this.ItemList); }
  }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    //this.InvoiceNumber = 'InvoiceNumber';
    this.getCreditSummaryList();
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.CreditManagementService.getCreditSummary(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
        
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.CreditManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  onPaginationEvent(event) {
   
    //this.filterValue = "";
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //this.paginationModel.pageSize = event.pageSize;
    //this.getCreditSummaryList();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getCreditSummaryList();
    this.paginationModel.pageSize = event.pageSize;
  }

  customSort(event) {    
    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getCreditSummaryList();
  }

  getCreditSummaryList() {
    this.CreditManagementService.getCreditSummary(this.paginationModel).
      subscribe(result => {
        this.dataSource.data = result.data;
      });
    
  }

}




