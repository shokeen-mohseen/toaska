import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrls: ['./order-history-list.component.css']
})
export class OrderHistoryListComponent implements OnInit {

  selectRow: any;
  Shipmentno: any;

  displayedColumns = ['selectRow', 'Orderno', 'Ordtype', 'Status', 'Ordcon', 'Materdes', 'Quantity', 'Shipfromloc', 'Shipto', 'Schduleship', 'Requestdeliverydate', 'Mustarrive', 'Actualdeli', 'Carrier', 'Pono', 'Invoicenumber', 'Shipmentno', 'Orderamt', 'Source'];
  displayedColumnsReplace = ['selectRow', 'key_OrderNo', 'key_Ordertype', 'key_Status', 'key_OrderCondition', 'key_MaterialDescription', 'key_Quantity', 'key_ShipFromLocation', 'key_Shipto', 'key_ScheduledShipDate', 'key_RequestedDeliveryDate', 'key_MustArriveByDate', 'key_ActualDeliveryDate', 'key_Carrier', 'key_PONo', 'key_Invoicenumber', 'key_ShipmentNo', 'key_Orderamt', 'key_Source' ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
    this.selectRow = 'selectRow';
    this.Shipmentno = 'Shipmentno';
  }
  openShipHistory() {
    let url = '/shipment-management/shipment-history'
    this.route.navigate([url]);
    //window.open(url, '_blank')
  }
}
export interface PeriodicElement {
  selectRow: string;
  Orderno: string;
  Ordtype: string;
  Status: string;
  Ordcon: string;
  Materdes: string;
  Quantity: string;
  Shipfromloc: string;
  Shipto: string;
  Schduleship: string;
  Requestdeliverydate: string;
  Mustarrive: string;
  Actualdeli: string;
  Carrier: string;
  Pono: string;
  Invoicenumber: string;
  Shipmentno: string;  
  Orderamt: string;  
  Source: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
 
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
  { selectRow: '', Orderno: '5276.0', Ordtype: 'Customer', Status: 'Cancelled', Ordcon: 'Cancelled', Materdes: 'I-mtsort', Quantity: '57', Shipfromloc: 'POLYMER IRVING', Shipto: 'Stur Forms', Schduleship: '18-30-2020', Requestdeliverydate: '09-01-2020', Mustarrive: '', Actualdeli: '', Carrier: '', Pono: '45terdfgb23526', Invoicenumber: '', Shipmentno: '415702.0', Orderamt: '167.0', Source: 'Regular Order' },
];
