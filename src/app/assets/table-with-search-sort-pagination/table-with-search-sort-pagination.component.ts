import { Component, ViewChild, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  selectRow: string;
  CustomerBillingEntity: string;
  CreditlimitfromMAS: string;
  AvailableCreditLimit: string;
  Valueofunshipped: string;
  Remainingcredit: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', CustomerBillingEntity: 'Ocean Mist', CreditlimitfromMAS: '450,000.00', AvailableCreditLimit: '226,844.34', Valueofunshipped: '181,239.72', Remainingcredit: '45,604.62' },
  { selectRow: '', CustomerBillingEntity: '303572SMP Southeast Marketing', CreditlimitfromMAS: '25,000.00', AvailableCreditLimit: '25,000.00', Valueofunshipped: '0.00', Remainingcredit: '25,000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
  { selectRow: '', CustomerBillingEntity: '2 L Produce', CreditlimitfromMAS: '30, 000.00', AvailableCreditLimit: '30, 000.00', Valueofunshipped: '0.00', Remainingcredit: '30, 000.00' },
];

@Component({
  selector: 'app-table-with-search-sort-pagination',
  templateUrl: './table-with-search-sort-pagination.component.html',
  styleUrls: ['./table-with-search-sort-pagination.component.css']
})
export class TableWithSearchSortPaginationComponent implements OnInit {

  displayedColumns = ['selectRow', 'CustomerBillingEntity', 'CreditlimitfromMAS', 'AvailableCreditLimit', 'Valueofunshipped', 'Remainingcredit'];
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

  constructor() { }

  ngOnInit(): void {
  }

}
