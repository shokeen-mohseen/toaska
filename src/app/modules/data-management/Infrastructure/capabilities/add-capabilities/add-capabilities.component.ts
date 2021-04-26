import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-add-capabilities',
  templateUrl: './add-capabilities.component.html',
  styleUrls: ['./add-capabilities.component.css']
})
export class AddCapabilitiesComponent implements OnInit {
  displayedColumns = ['selectRow',  'Resourcecode', 'Capabilitycode', 'Capabilitydec', 'Capdefault','Edit'];
  displayedColumnsReplace = ['selectRow', 'key_Resourcecode', 'key_Capabilitycode', 'key_Capabilitydescription', 'key_Capdefault','Key_Edits'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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
  constructor(public activeModal: NgbActiveModal, private router: Router, public modalService: NgbModal) { }
  panelOpenState = false;
  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];
    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

}
export interface PeriodicElement {
  selectRow: string;
 
  Resourcecode: string;
  Capabilitycode: string;
  Capabilitydec: string;
  Capdefault: string;
  Edit: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Resourcecode: '', Capabilitycode: '', Capabilitydec: '', Capdefault: '', Edit: '' },

];
