import { Component, ViewChild, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  BarCode: string;
  Material: string;
  ReceivedDate: string;
  ReceivedFrom: string;
  ReceivedTo: string;
  InventoryType: string;
  StorageLocation: string;
  ReceivedQuantity: string;
  IssueType: string;
  IssueToLocation: string;
  IssueDate: string;
  IssueQuantity: string;
  IssueBy: string;
  ReceivedBy: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    BarCode: '',
    Material: '',
    ReceivedDate: '',
    ReceivedFrom: '',
    ReceivedTo: '',
    InventoryType: '',
    StorageLocation: '',
    ReceivedQuantity: '',
    IssueType: '',
    IssueToLocation: '',
    IssueDate: '',
    IssueQuantity: '',
    IssueBy: '',
    ReceivedBy: ''
  },
];

@Component({
  selector: 'app-material-chain-of-custody-list',
  templateUrl: './material-chain-of-custody-list.component.html',
  styleUrls: ['./material-chain-of-custody-list.component.css']
})
export class MaterialChainOfCustodyListComponent implements OnInit {

  displayedColumns = ['BarCode', 'Material', 'ReceivedDate', 'ReceivedFrom', 'ReceivedTo', 'InventoryType', 'StorageLocation', 'ReceivedQuantity', 'IssueType', 'IssueToLocation', 'IssueDate', 'IssueQuantity', 'IssueBy', 'ReceivedBy'];
  displayedColumnsReplace = ['key_BarCode', 'key_Material', 'key_ReceivedDate', 'key_ReceivedFrom', 'key_ReceivedTo', 'key_InventoryType', 'key_StorageLocation', 'key_ReceivedQuantity', 'key_IssueType', 'key_IssueToLocation', 'key_IssueDate', 'key_IssueQuantity', 'key_IssueBy', 'key_ReceivedBy'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor() { }

  ngOnInit(): void {

  }

}
