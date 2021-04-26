import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  displayedColumns = ['selectRow', 'Material', 'Charge', 'Commodity', 'Shipbol', 'OrderQuantity', 'Shipquantity', 'PriceMethod', 'RateValue', 'RateType', 'Amountorder'];
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
export interface PeriodicElement {
  selectRow: string;
  Material: string;
  Charge: string;
  Commodity: string;
  Shipbol: string;
  OrderQuantity: string;
  Shipquantity: string;
  PriceMethod: string;
  RateValue: string;
  RateType: string;
  Amountorder: string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
 
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
  { selectRow: '', Material: 'WW-PALLET', Charge: 'Pallet', Commodity: 'Produce General', Shipbol: 'False', OrderQuantity: '51', Shipquantity: '0', PriceMethod: 'Non Billable', RateValue: '$0.000', RateType: 'Per EA', Amountorder: '$0.00', },
];
