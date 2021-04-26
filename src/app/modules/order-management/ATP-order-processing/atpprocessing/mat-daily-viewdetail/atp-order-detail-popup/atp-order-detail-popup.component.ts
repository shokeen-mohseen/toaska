import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-atp-order-detail-popup',
  templateUrl: './atp-order-detail-popup.component.html',
  styleUrls: ['./atp-order-detail-popup.component.css']
})
export class AtpOrderDetailPopupComponent implements OnInit {
  displayedColumns = ['selectRow', 'Orderdate', 'Orderno', 'Orderstatus', 'Materialdec', 'OrderQuantity', 'Assigned','Scheduleship'];
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
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
export interface PeriodicElement {
  selectRow: string;
  Orderdate: string;
  Orderno: string;
  Orderstatus: string;
  Materialdec: string;
  OrderQuantity: string;
  Assigned: string;
  Scheduleship: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  
  { selectRow: '', Orderdate: '04/23/2020', Orderno: '501752.0', Orderstatus: 'Assigned To Shipment', Materialdec: 'WW-PALLET', OrderQuantity: '60', Assigned: '60', Scheduleship:'05/29/2020' },
];
