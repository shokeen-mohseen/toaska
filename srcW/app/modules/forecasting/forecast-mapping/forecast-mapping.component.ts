import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Options } from 'select2';
import { ResizeEvent } from 'angular-resizable-element';

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-forecast-mapping',
  templateUrl: './forecast-mapping.component.html',
  styleUrls: ['./forecast-mapping.component.css']
})
export class ForecastMappingComponent implements OnInit {

  public options: Options;
  public exampleData: any;
  panelOpenState = false;


  displayedColumns = ['Status', 'SalesManager', 'BillingEntity',
    'location', 'Material', 'Commodity', 'cp', 'ff'];
  displayedColumnsReplace = ['key_Status', 'key_SalesManager', 'key_BillingEntity',
    'key_Location', 'key_Material', 'key_Commodity', 'key_CalendarPeriod', 'key_FinalForecast'];
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
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
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

export interface PeriodicElement {
  Status: string;
  SalesManager: string;
  BillingEntity: string;
  location: string;
  Material: string;
  Commodity: string;
  cp: string;
  ff: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { Status: '', SalesManager: '', BillingEntity: '', location: '', Material: '', Commodity: '', cp: '', ff: '' }
];


