import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResizeEvent } from 'angular-resizable-element';
import { CustomerByLocation } from '../../../../core/models/CustomerByLocation.model';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { AuthService } from '../../../../core';
import { TopButtonBarService } from '../../../../shared/components/top-btn-group/top-btn.serrvice';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnChanges {

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

  displayedColumns = ['selectRow', 'groupName', 'billingEntityName', 'customerName', 'cityState', 'customerCode', 'masInventoryWarehouse', 'isActive', 'setupDone', 'setupDoneDateTime', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Group', 'key_BillingEntity', 'key_Shipto', 'key_Citystate', 'key_Customercode', 'key_MASInventoryWarehouse', 'key_Active', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<CustomerByLocation>();
  selection = new SelectionModel<CustomerByLocation>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output('selectedCustomer') selectedCustomer = new EventEmitter<CustomerByLocation[]>();
  @Input('customersInEdit') customersInEdit: CustomerByLocation[];

  filterValue: string;
  paginationModel = new CustomerByLocation();

  isLinear = false;
  selectRow: any;

  constructor(public modalService: NgbModal,
    public customerByLocationService: CustomerByLocationService,
    public topButtonBarService: TopButtonBarService,
    private authenticationService: AuthService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.getCustomerByLocationList();
    this.paginator.showFirstLastButtons = true;
    this.topButtonBarService.getAction().subscribe(action => {
      switch (action) {
        case 'refresh':
          this.getCustomerByLocationList();
          break;
      }
    });
  }
  ngOnChanges(changes: any) {
    this.setRowSelection();
  }
  /** On row selection send that row to parent component  */
  onSelectionChange(row: CustomerByLocation, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedCustomer.emit(this.selection.selected);
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getCustomerByLocationList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getCustomerByLocationList();
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });
    this.selectedCustomer.emit(this.selection.selected);
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getCustomerByLocationList();
    }
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getCustomerByLocationList();
  }

  async getPageSize() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageSize = 0;
    await this.customerByLocationService.getCustomerByLocation(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.customerByLocationService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  getCustomerByLocationList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.customerByLocationService.getCustomerByLocation(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;
      this.setRowSelection();
    });
  }
  setRowSelection() {

    if (this.customersInEdit != null && this.customersInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.customersInEdit.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.isSelected = false;
        }

      });
    }
  }
}
