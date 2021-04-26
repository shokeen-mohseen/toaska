import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-organization-label-list',
  templateUrl: './organization-label-list.component.html',
  styleUrls: ['./organization-label-list.component.css']
})
export class OrganizationLabelListComponent implements OnInit {

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

  displayedColumns = ['selectRow', 'lbltype', 'OrganizationFunction', 'OrganizationDescription', 'Active', 'setupdone', 'setupdatetime', 'lastupdate'];
  displayedColumnsReplace = ['selectRow', 'key_Leveltype', 'key_Orgfunction', 'key_Organizationdescription', 'key_Active', 'key_SetupDone', 'key_Setupdate', 'key_Lastupdated'];
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


  selectRow: any;
  Active: any;
  constructor() { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Active = 'Active';
  }

}
export interface PeriodicElement {
  selectRow: string;
  lbltype: string;
  OrganizationFunction: string;
  OrganizationDescription: string;
  Active: string;
  setupdone: string;
  setupdatetime: string;
  lastupdate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },
  { selectRow: '', lbltype: 'Company', OrganizationFunction: 'Business Partner', OrganizationDescription: 'ABC Company', Active: '', setupdone: 'True', setupdatetime: 'Aug 29 2020', lastupdate: 'lampsdemo' },

];
