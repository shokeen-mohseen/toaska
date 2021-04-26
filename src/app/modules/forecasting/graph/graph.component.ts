import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';

				
export interface PeriodicElement {
  Status: string;
  DataSegment: string;
  Total: string;
  202103: string;
  202104: string;
}
				
const ELEMENT_DATA: PeriodicElement[] = [
  {
    Status: 'Active_New',
    DataSegment: 'Final Forecast',
    Total: '0.00',
    202103: '0.00',
    202104: '0.00',
  },
  {
    Status: 'Active',
    DataSegment: 'Final Forecast',
    Total: '0.00',
    202103: '0.00',
    202104: '0.00',
  }, {
    Status: 'Inactive',
    DataSegment: 'Final Forecast',
    Total: '0.00',
    202103: '0.00',
    202104: '0.00',
  }
];

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  panelOpenState = false;
  itemList = [];
  selectedItems = [];
  settings = {};

  constructor() { }
  imageSrc = 'assets/images/ChartImage.png';
   
  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option" },
      { "id": 2, "itemName": "option" },
      { "id": 3, "itemName": "option" },
      { "id": 4, "itemName": "option" },
      { "id": 5, "itemName": "option" }
    ];

   
    this.settings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],
      badgeShowLimit: 2
    };
    
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }

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

  //material table code


  displayedColumns = ['Status', 'DataSegment', 'Total', '202103', '202104'];
  displayedColumnsHeader = ['key_Status', 'key_DataSegment', 'key_Total', '202103', '202104'];
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

}
