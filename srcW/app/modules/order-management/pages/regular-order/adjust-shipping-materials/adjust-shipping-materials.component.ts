import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export interface PeriodicElement {
  Material: string;
  OrderQuantity: string;
  ShippedQuantity: string;
  Action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Material: 'WW-PALLET',
    OrderQuantity: '10528',
    ShippedQuantity: '1',
    Action: 'Edit/Delete'
  },
  {
    Material: 'PL-6413AL-FIN',
    OrderQuantity: '10528',
    ShippedQuantity: '1',
    Action: 'Edit/Delete'
  },
  {
    Material: '',
    OrderQuantity: '10528',
    ShippedQuantity: '1',
    Action: 'Edit/Delete'
  },

];

@Component({
  selector: 'app-adjust-shipping-materials',
  templateUrl: './adjust-shipping-materials.component.html',
  styleUrls: ['./adjust-shipping-materials.component.css']
})
export class AdjustShippingMaterialsComponent implements OnInit {


  //material table code

  displayedColumns = ['selectRow', 'Material', 'OrderQuantity', 'ShippedQuantity', 'Action'];
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

  constructor(private router: Router) { }
  ngOnInit(): void { }

}
