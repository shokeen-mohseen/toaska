import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResizeEvent } from 'angular-resizable-element';
import { AuthService } from '../../../../core';
import { BPByLocation } from '../../../../core/models/BusinessPartner.model';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
@Component({
  selector: 'app-businesspartner-list',
  templateUrl: './businesspartner-list.component.html',
  styleUrls: ['./businesspartner-list.component.css']
})
export class BusinesspartnerListComponent implements OnInit, OnChanges {


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


  displayedColumns = ['selectRow', 'locationFunctionName', 'groupName', 'billingEntityName', 'businessPartnerName', 'cityState', 'businessPartnerCode', 'masInventoryWarehouse', 'isActive', 'setupDone', 'setupDoneDateTime', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Businesspartner', 'key_Group', 'key_BillingEntity', 'key_BusinessPartnerName', 'key_Citystate', 'key_BusinessPartnerCode', 'key_MASInventoryWarehouse', 'key_Active', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<BPByLocation>();
  selection = new SelectionModel<BPByLocation>(true, []);
  paginationModel: BPByLocation = new BPByLocation();
  filterValue: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output('selectedBpByLocation') selectedBpByLocation = new EventEmitter<BPByLocation[]>();
  @Input('bpByLocationInEdit') bpByLocationInEdit: BPByLocation[];

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getBusinessPartnerByLocation();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getBusinessPartnerByLocation();
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true;  });
    this.selectedBpByLocation.emit(this.selection.selected);
  }
  /** On row selection send that row to parent component  */
  onSelectionChange(row: BPByLocation, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedBpByLocation.emit(this.selection.selected);
  }

  isLinear = false;
  modalRef: NgbModalRef;
  selectRow: any;
  Active: any;
  Setupdone: any;
  constructor(public modalService: NgbModal,
    public businessService: BusinessPartnerService,
    private authenticationService: AuthService) { }


  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.getBusinessPartnerByLocation();
    this.paginator.showFirstLastButtons = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bpByLocationInEdit && changes.bpByLocationInEdit.currentValue) {
      this.setRowSelection();
    }
  }
  async getPageSize() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageSize = 0;
    await this.businessService.getBPByLocation(this.paginationModel).toPromise()
      .then(result => {
      this.paginationModel.itemsLength = result.recordCount;
    });
    // default page size
    this.paginationModel.pageSize = await this.businessService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    // initial load should sort by last updated by at first
    this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    this.paginationModel.sortOrder = 'Desc';
  }

  getBusinessPartnerByLocation() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.businessService.getBPByLocation(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;
      this.setRowSelection();
    });
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getBusinessPartnerByLocation();
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getBusinessPartnerByLocation();
    }
  }

  setRowSelection() {

    if (this.bpByLocationInEdit != null && this.bpByLocationInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.bpByLocationInEdit.findIndex(item => item.id === row.id) >= 0) {
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
