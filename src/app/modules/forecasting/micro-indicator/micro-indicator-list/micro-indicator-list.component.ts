import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';


export interface PeriodicElement {
  selectRow: string;
  MarcoIndicator: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Active: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
  { selectRow: '', MarcoIndicator: 'aqasdt', Description: '', StartDate: '09/11/2020', EndDate: '10/11/2020',  Active: '' },
];

export interface Element {
  highlighted?: boolean;
}

@Component({
  selector: 'app-micro-indicator-list',
  templateUrl: './micro-indicator-list.component.html',
  styleUrls: ['./micro-indicator-list.component.css']
})
export class MicroIndicatorListComponent implements OnInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  filter: boolean = false;
  IsTosca: boolean;

  selectRow: any;
  Active: any;
  displayedColumns = ['selectRow', 'MarcoIndicator', 'Description', 'StartDate', 'EndDate', 'Active'];
  displayedColumnsReplace = ['selectRow', 'key_MicroIndicatorcode', 'key_Description', 'key_StartDate', 'key_EndDate', 'key_Active'];
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

  constructor() { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
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

