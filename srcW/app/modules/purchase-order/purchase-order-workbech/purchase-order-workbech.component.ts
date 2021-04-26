import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';
import { MatTabGroup } from '@angular/material/tabs';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { AddEditPurchaseOrderComponent } from '../add-edit-purchase-order/add-edit-purchase-order.component';



export interface PeriodicElement {
  selectRow: string;
  poNumber: string;
  businessPartner: string;
  dateIssued: string;
  deliveryStartDate: string;
  deliveryLocation: string;
  quantityOrdered: string;
  quantityReceived: string;
  orderamt: string;
  paidAmount: string;
  balance: string;
  status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered:'', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed'},
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered:'', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open'},
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered:'', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Void'},
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed' },
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open' },
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Void' },
  { selectRow: '', poNumber: '56575', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Closed' },
  { selectRow: '', poNumber: '6767', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Open' },
  { selectRow: '', poNumber: '89686', businessPartner: '', dateIssued: '', deliveryStartDate: '', deliveryLocation: '', quantityOrdered: '', quantityReceived: '', orderamt: '', paidAmount: '', balance: '', status: 'Void' },
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-purchase-order-workbech',
  templateUrl: './purchase-order-workbech.component.html',
  styleUrls: ['./purchase-order-workbech.component.css']
})
export class PurchaseOrderWorkbechComponent implements OnInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  filter: boolean = false;
  IsTosca: boolean;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;
  modalRef: NgbModalRef;

  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  

  selectRow: any;
  displayedColumns = ['selectRow', 'poNumber', 'businessPartner', 'dateIssued', 'deliveryStartDate', 'deliveryLocation', 'quantityOrdered', 'quantityReceived', 'orderamt', 'paidAmount', 'balance','status'];
  displayedColumnsReplace = ['selectRow', 'key_PONumber', 'key_BusinessPartner', 'key_dateIssued', 'key_DeliveryStartDate', 'key_DeliveryLocation', 'key_quantityOrdered', 'key_quantityReceived', 'key_Orderamt', 'key_paidAmount', 'key_balance','key_Status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  constructor(public modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.actionGroupConfig = getGlobalRibbonActions();

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
  }

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
    }
  }
  actionHandler(type) {
    if (type === "add") {
      this.tab1 = true;
      this.tab2 = true;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 1;
      this.tab2Data = true;
      this.tab1Data = false;
      this.tab3Data = false;
    }
    else if (type === "edit") {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 2;
      this.tab3Data = true;
      this.tab1Data = false;
      this.tab2Data = true;
    }
  }
  closeTab(action) {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
    this.tab1Data = true;
    this.tab2Data = false;
    this.tab3Data = false;
  }
  /*actionHandler(type) {
    if (type === "add") {
      this.modalRef = this.modalService.open(AddEditPurchaseOrderComponent, { size: 'xl', backdrop: 'static' });
    }
    else if (type === "edit") {
      this.modalRef = this.modalService.open(AddEditPurchaseOrderComponent, { size: 'xl', backdrop: 'static' });
    }
  }*/

  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  ngAfterViewInit(): void {
    this.btnBar.hideTab('key_View');
    this.btnBar.showAction('showDetails');
    this.btnBar.showAction('cancel');
    this.btnBar.hideAction('active');
    this.btnBar.hideAction('inactive');
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

  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

}

