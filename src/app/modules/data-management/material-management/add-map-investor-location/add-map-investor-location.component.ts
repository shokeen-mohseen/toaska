import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-map-investor-location',
  templateUrl: './add-map-investor-location.component.html',
  styleUrls: ['./add-map-investor-location.component.css']
})
export class AddMapInvestorLocationComponent implements OnInit {

  displayedColumns = ['selectRow', 'function', 'Description'];
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
  function: string;
  Description: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', function: 'Customer Location', Description: 'Satur Farms-Calverton' },
  { selectRow: '', function: 'Wash Facility', Description: 'Tosca Denver' },
  { selectRow: '', function: 'Customer Location', Description: 'Satur Farms-Calverton' },
  { selectRow: '', function: 'Wash Facility', Description: 'Tosca Denver' },
  { selectRow: '', function: 'Customer Location', Description: 'Satur Farms-Calverton' },
  { selectRow: '', function: 'Wash Facility', Description: 'Tosca Denver' },

];

