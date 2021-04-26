import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatTableDataSource } from '@angular/material/table';

import { ResizeEvent } from 'angular-resizable-element';

export interface PeriodicElement {
  Material: string;
  Charge: string;
  OrderQuantity: number;
  ShippedQuantity: number;
  PriceMethod: string;
  RateType: string;
  Amount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Material: 'TL-6428', Charge: 'Reusable Plastic Container', OrderQuantity: -7040.00, ShippedQuantity: -6720.00, PriceMethod: 'Billable', RateType: 'Per EA', Amount: 0.00 },
  { Material: 'TL-6428', Charge: 'Bagging Charge', OrderQuantity: -64.00, ShippedQuantity: -62.00, PriceMethod: 'Billable', RateType: 'Per Pallet', Amount: -124.00 },
  { Material: '', Charge: 'Fuel Charge Domestic', OrderQuantity: -1.00, ShippedQuantity: -1.00, PriceMethod: 'Billable', RateType: 'DOE', Amount: -662.19 },
];

@Component({
  selector: 'app-order-number-details',
  templateUrl: './order-number-details.component.html',
  styleUrls: ['./order-number-details.component.css']
})
export class OrderNumberDetailsComponent implements OnInit {

  displayedColumns = ['Material', 'Charge', 'OrderQuantity', 'ShippedQuantity', 'PriceMethod', 'RateType', 'Amount'];
  displayedColumnsReplace = ['key_Material', 'key_Charge', 'key_OrderQuantity', 'key_ShippedQuantity', 'key_PriceMethod', 'key_RateType', 'key_Amount']
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  getTotalCost(total) {
    return ELEMENT_DATA
      .map(t => t.OrderQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalCost1() {
    return ELEMENT_DATA
      .map(t => t.ShippedQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalCost2() {
    return ELEMENT_DATA
      .map(t => t.Amount)
      .reduce((acc, value) => acc + value, 0);
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

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
