import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InvoicePopupComponent } from '../invoice-popup/invoice-popup.component';

import { ResizeEvent } from 'angular-resizable-element';
import { CreditManagementService } from '../../../../../core/services/CreditManagement.service';
import { CreditSummaryCM, InvoiceDetailsCM } from '../../../../../core/models/creditManagementOrder.model';
import { InvoiceBodyComponent } from '../invoice-body/invoice-body.component';


@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css']
})
export class InvoiceReportComponent implements OnInit {

  selectRow: any;
  InvoiceNumber: any;
  
  @Input() selectedRecord : number;

  displayedColumns = ['invoiceNumber', 'invoiceDate', 'dueDate', 'billOfLading', 'orderNo', 'purchaseOrderNumber', 'Aging', 'invoiceAmount', 'openAmount', 'currentAmount', 'pastDueAmount'];
  displayedColumnsReplace = ['key_InvoiceNumber', 'key_InvoiceDate', 'key_DueDate', 'key_BillOfLading', 'key_OrderNo', 'key_PONo', 'key_Aging', 'key_InvoiceAmount', 'key_OpenAmount', 'key_CurrentAmount', 'key_PastDueAmount'];
  dataSource = new MatTableDataSource<InvoiceDetailsCM>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 // @ViewChild(InvoiceBodyComponent) invoiceBody: InvoiceBodyComponent;

  filterValue = "";
  paginationModel = new InvoiceDetailsCM();


  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getInvoiceDetails();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getInvoiceDetails();
    }

  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  bindTab(typeCode : string) {
    var orgID = this.selectedRecord;
    this.paginationModel.OrganizationID = orgID;
    this.paginationModel.SystemTypeCode = typeCode;
    this.getInvoiceDetails();
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

  

  modalRef: NgbModalRef;

  constructor(
    public modalService: NgbModal,
    private CreditManagementService: CreditManagementService,

  ) { }

  async ngOnInit() {
    var orgID = this.selectedRecord;
    this.paginationModel.OrganizationID = orgID;
    this.paginationModel.SystemTypeCode = '';
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.InvoiceNumber = 'InvoiceNumber';
       
    this.getInvoiceDetails();
  }

  async getPageSize() {
    //debugger;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.CreditManagementService.getInvoiceDetails(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.CreditManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  customSort(event) {
    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getInvoiceDetails();
  }

  getInvoiceDetails() {
    this.CreditManagementService.getInvoiceDetails(this.paginationModel).
      subscribe(result => {
         this.dataSource.data = result.data;
        //  console.log(this.OrderDetailsCM.OrgnizationID);
        console.log(result.data);
      });
  }

  onPaginationEvent(event) {
    //console.log('Pagination Event');
    //this.filterValue = "";
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //this.paginationModel.pageSize = event.pageSize;
    //this.getInvoiceDetails();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getInvoiceDetails();
    this.paginationModel.pageSize = event.pageSize;
  }

  openPopup(action) {
    if (action === "invoiceNumber") {
      this.modalRef = this.modalService.open(InvoicePopupComponent, { size: 'sm', backdrop: 'static' });
    }
  }

}
