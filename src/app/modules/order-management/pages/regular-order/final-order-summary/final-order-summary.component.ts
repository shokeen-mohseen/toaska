import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  Material: string;
  Charge: string;
  Commodity: string;
  ShowOnBOL: boolean
  OrderQuantity: number
  ShippedQuantity: number
  PriceMethod: string
  RateValue: string
  RateType: string
  Amount: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Material: 'WW-PALLET',
    Charge: '10528',
    Commodity: '1',
    ShowOnBOL: true,
    OrderQuantity: 5400,
    ShippedQuantity: 200,
    PriceMethod: 'Billable',
    RateValue: '$128',
    RateType: 'Per EA',
    Amount: '$4500'
  },
  {
    Material: 'WW-PALLET',
    Charge: '10528',
    Commodity: '1',
    ShowOnBOL: true,
    OrderQuantity: 101,
    ShippedQuantity: 1500,
    PriceMethod: 'Non Billable',
    RateValue: '$128',
    RateType: 'Per EA',
    Amount: '$450.0'
  },
  {
    Material: 'WW-PALLET',
    Charge: '10528',
    Commodity: '1',
    ShowOnBOL: false,
    OrderQuantity: 150,
    ShippedQuantity: 120,
    PriceMethod: 'Billable',
    RateValue: '$128',
    RateType: 'Per Pallet',
    Amount: '$128'
  },

];

@Component({
  selector: 'app-final-order-summary',
  templateUrl: './final-order-summary.component.html',
  styleUrls: ['./final-order-summary.component.css']
})
export class FinalOrderSummaryComponent implements OnInit {



  //material table code
  Action: ''
  displayedColumns = [/*'selectRow', */'Material', 'Charge', 'Commodity', 'ShowOnBOL',
    'OrderQuantity', 'ShippedQuantity', 'PriceMethod', 'RateValue', 'RateType',
    'Amount'];
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
