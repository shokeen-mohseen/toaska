import { Component, ViewChild, OnInit } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { AddCommentComponent } from 'app/modules/inventory/pages/current-on-hand-inventory/add-comment/add-comment.component';
import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  selectRow: string;
  LocationType: string;
  Location: string;
  MaterialDescription: string;
  Quantity: number;
  UOM: string;
  LastRefreshDate: string;
  Comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: -5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: 5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: -5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: 5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: -5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
  { selectRow: '', LocationType: 'Asset Recovery', Location: 'GLORIANN FARMS', MaterialDescription: 'PECO-Pallet', Quantity: -5, UOM: 'EA', LastRefreshDate: '04-Mar-2020 07:30 AM', Comment: '' },
];

@Component({
  selector: 'app-current-inventory-list',
  templateUrl: './current-inventory-list.component.html',
  styleUrls: ['./current-inventory-list.component.css']
})
export class CurrentInventoryListComponent implements OnInit {


  displayedColumns = ['selectRow', 'LocationType', 'Location', 'MaterialDescription', 'Quantity', 'UOM', 'LastRefreshDate', 'Comment'];
  displayedColumnsReplace = ['selectRow', 'key_LocationType', 'key_Location', 'key_MaterialDescription', 'key_Quantity', 'key_UOM', 'key_LastRefreshDate', 'key_Comment'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);


  getTotalCost() {
   return ELEMENT_DATA
     .map(t => t.Quantity)
  .reduce((acc, value) => acc + value, 0);
  }
  
  /*getTotalUOM() {
    return ELEMENT_DATA
      .map(t => t.UOM)
      .reduce((acc, value) => acc + value, 0);
  }*/

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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

  modalRef: NgbModalRef;
  selectRow: any;
  Comment: any;
 
  constructor(public modalService: NgbModal) { }

  openPopup(action) {
    if (action === "addComment") {
      this.modalRef = this.modalService.open(AddCommentComponent, { size: 'md', backdrop: 'static' });
    }
  }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Comment = 'Comment';
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
