import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import bsCustomFileInput from 'bs-custom-file-input';

@Component({
  selector: 'app-manage-market-forecast-import',
  templateUrl: './manage-market-forecast-import.component.html',
  styleUrls: ['./manage-market-forecast-import.component.css']
})
export class ManageMarketForecastImportComponent implements OnInit {
  
  itemList = [];
  selectedItems = [];
  settings = {};
  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  count = 6;
  displayedColumns = ['selectRow', 'at', 'ctn', 'cfd', 'ib', 'idt'];
  displayedColumnsReplace = ['selectRow', 'key_ActionTaken', 'key_ChildForecastName', 'key_ChildForecastDescription', 'key_ImportedBy', 'key_ImportedDateTime'];
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
  isLinear = false;
  selectRow: any;
  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit(): void {
    bsCustomFileInput.init();
    this.selectRow = 'selectRow';
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
    this.itemListB = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settingsB = {
      singleSelection: false,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
    };
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
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


}
export interface PeriodicElement {
  selectRow: string;
  at: string;
  ctn: string;
  cfd: string;
  ib: string;
  idt: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', at: 'Add the amount', ctn: 'PolymerImportantt', cfd: 'PolymerImportant', ib: 'John', idt: '09/28/2020 2:02:08 AM' },
  { selectRow: '', at: 'Add the amount', ctn: 'PolymerImportantt', cfd: 'PolymerImportant', ib: 'John', idt: '09/28/2020 2:02:08 AM' },
  { selectRow: '', at: 'Add the amount', ctn: 'PolymerImportantt', cfd: 'PolymerImportant', ib: 'John', idt: '09/28/2020 2:02:08 AM' },
];
