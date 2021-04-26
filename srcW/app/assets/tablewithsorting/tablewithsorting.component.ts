import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tablewithsorting',
  templateUrl: './tablewithsorting.component.html',
  styleUrls: ['./tablewithsorting.component.css']
})
export class TablewithsortingComponent implements OnInit {

  displayedColumns = ['selectRow', 'Description', 'DefaultCommodity', 'Active'];
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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}


export interface PeriodicElement {
  selectRow: string;
  Description: string;
  DefaultCommodity: string;
  Active: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Description: 'Weight of unit', DefaultCommodity: '48', Active: 'Pound' },
  { selectRow: '', Description: 'Is Material Clean', DefaultCommodity: 'Yes', Active: '' },

];

