import { Component, ViewChild, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { AuthService } from '../../../../core';
import { BPByCarrier, BPByLocation } from '../../../../core/models/BusinessPartner.model';

@Component({
  selector: 'app-carrierpartnerlist',
  templateUrl: './carrierpartnerlist.component.html',
  styleUrls: ['./carrierpartnerlist.component.css']
})
export class CarrierpartnerlistComponent implements OnInit {


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



  displayedColumns = ['selectRow', 'businessPartnerTypeName', 'groupName', 'billingEntityName', 'businessPartnerName', 'cityState', 'businessPartnerCode', 'scacValue', 'isActive', 'setupDone', 'setupDoneDateTime', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Businesspartner', 'key_Group', 'key_BillingEntity', 'key_BusinessPartnerName', 'key_Citystate', 'key_BusinessPartnerCode', 'key_MASInventoryWarehouse', 'key_Active', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<BPByCarrier>();
  selection = new SelectionModel<BPByCarrier>(true, []);
  paginationModel: BPByCarrier = new BPByCarrier();
  filterValue: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('selectedBpByCarrier') selectedBpByCarrier = new EventEmitter<BPByCarrier[]>();
  @Input('bpByCarrierInEdit') bpByCarrierInEdit: BPByCarrier[];

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
    this.getBusinessPartnerByCarrier();
    this.paginator.showFirstLastButtons = true;
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getBusinessPartnerByCarrier();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getBusinessPartnerByCarrier();
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
    this.selectedBpByCarrier.emit(this.selection.selected);
  }
  /** On row selection send that row to parent component  */
  onSelectionChange(row: BPByCarrier, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedBpByCarrier.emit(this.selection.selected);
  }


  async getPageSize() {
    this.paginationModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    await this.businessService.getBPByCarrier(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.businessService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);

    // initial load should sort by last updated by at first
    this.paginationModel.sortColumn = 'UpdateDateTimeServer';
    this.paginationModel.sortOrder = 'Desc';
    this.paginator.pageIndex = 0;
  }

  getBusinessPartnerByCarrier() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.businessService.getBPByCarrier(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;
      this.setRowSelection();
    });
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
    this.getBusinessPartnerByCarrier();
    this.paginationModel.pageSize = event.pageSize;    
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getBusinessPartnerByCarrier();
    }
  }

  setRowSelection() {

    if (this.bpByCarrierInEdit != null && this.bpByCarrierInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.bpByCarrierInEdit.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.isSelected = false;
        }

      });
      this.selectedBpByCarrier.emit(this.selection.selected);
    }
  }
}
