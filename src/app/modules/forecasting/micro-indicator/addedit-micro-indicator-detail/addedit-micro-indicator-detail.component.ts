import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


export interface PeriodicElement {
  selectRow: string;
  SalesManager: string;
  country: string;
  region: string;
  state: string;
  Group: string;
  BillingEntity: string;
  stl: string;
  Commodity: string;
  MaterialDescription: string;
  value: string;
  uom: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', SalesManager: '', country: '', region: '', state: '', Group: '', BillingEntity: '', stl: '', Commodity: '', MaterialDescription: '', value: '', uom: '' },
  { selectRow: '', SalesManager: '', country: '', region: '', state: '', Group: '', BillingEntity: '', stl: '', Commodity: '', MaterialDescription: '', value: '', uom: '' },
  { selectRow: '', SalesManager: '', country: '', region: '', state: '', Group: '', BillingEntity: '', stl: '', Commodity: '', MaterialDescription: '', value: '', uom: '' },
  { selectRow: '', SalesManager: '', country: '', region: '', state: '', Group: '', BillingEntity: '', stl: '', Commodity: '', MaterialDescription: '', value: '', uom: '' },
  { selectRow: '', SalesManager: '', country: '', region: '', state: '', Group: '', BillingEntity: '', stl: '', Commodity: '', MaterialDescription: '', value: '', uom: '' },
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-addedit-micro-indicator-detail',
  templateUrl: './addedit-micro-indicator-detail.component.html',
  styleUrls: ['./addedit-micro-indicator-detail.component.css']
})
export class AddeditMicroIndicatorDetailComponent implements OnInit {
  filter: boolean = false;
  IsTosca: boolean;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;

  selectRow: any;
  value: any;
  Active: any;
  modalRef: NgbModalRef;
  displayedColumns = ['selectRow', 'SalesManager', 'country', 'region', 'state', 'Group', 'BillingEntity',
    'stl', 'Commodity', 'MaterialDescription', 'value', 'uom'];
  displayedColumnsReplace = ['selectRow', 'key_Salesmanager', 'key_Country', 'key_Region', 'key_State', 'key_Group', 'key_BillingEntity',
    'key_ShipToLocation', 'key_Commodity', 'key_MaterialDescription', 'key_Value', 'key_UOM'];
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

  constructor(public modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.value = 'value';
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
    };

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

}

