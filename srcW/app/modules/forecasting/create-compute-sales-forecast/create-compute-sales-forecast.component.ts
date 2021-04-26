import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Options } from 'select2';
import { ResizeEvent } from 'angular-resizable-element';
export interface PeriodicElement {
  selectRow: string;
  Status: string;
  SalesManager: string;
  Group: string;
  bcm: string;
  BillingEntity: string;
  cc: string;
  stl: string;
  MaterialDescription: string;
  Commodity: string;
  DataSegment: string;
  total: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 },
  { selectRow: '', Status: 'Active_New', SalesManager: 'Alexis Hartman', Group: 'Dole Fresh Vegetables', bcm: '4394', BillingEntity: 'Dole Fresh Vegetables', cc: '4394-1', stl: 'Dole Soledad', MaterialDescription: 'WW-PALLET', Commodity: 'Produce General', DataSegment: 'Final Forecast', total: 0 }
];

export interface Element {
  highlighted?: boolean;
}
@Component({
  selector: 'app-create-compute-sales-forecast',
  templateUrl: './create-compute-sales-forecast.component.html',
  styleUrls: ['./create-compute-sales-forecast.component.css']
})
export class CreateComputeSalesForecastComponent implements OnInit {
  public options: Options;
  public exampleData: any;
  panelOpenState = false;
  selectRow: any;

  displayedColumns = ['selectRow', 'Status', 'SalesManager', 'Group', 'bcm', 'BillingEntity',
    'cc', 'stl', 'MaterialDescription', 'Commodity', 'DataSegment', 'total'];
  displayedColumnsReplace = ['selectRow', 'key_Status', 'key_SalesManager', 'key_Group', 'key_bilmascust', 'key_BillingEntity',
    'key_Customercode', 'key_ShipToLocation', 'key_MaterialDescription', 'key_Commodity', 'key_DataSegment', 'key_Total'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  getTotalCost() {
    return ELEMENT_DATA
      .map(t => t.total)
      .reduce((acc, value) => acc + value, 0);
  }
  
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


  constructor() { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    //multi select data
    this.exampleData = [
      {
        id: 'multiple2',
        text: 'Option One'
      },
      {
        id: 'multiple3',
        text: 'Option Two'
      },
      {
        id: 'multiple4',
        text: 'Option Three'
      }
    ];
    //multi select options
    this.options = {
      multiple: true,
      tags: true,
      closeOnSelect: false,
    };
  }
 
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
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






