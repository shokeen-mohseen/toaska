import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  RequestedDeliveryDate: string;
  OrderNumber: number;
}
export interface Element {
  highlighted?: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    RequestedDeliveryDate: 'Mon 12/5/2020',
    OrderNumber: 101,
  },
  {
    RequestedDeliveryDate: 'Tue 12/5/2020',
    OrderNumber: 101,
  },
  {
    RequestedDeliveryDate: 'Mon 12/5/2020',
    OrderNumber: 101,
  },
  {
    RequestedDeliveryDate: 'Tue 12/5/2020',
    OrderNumber: 101,
  }
];

@Component({
  selector: 'app-recurrence',
  templateUrl: './recurrence.component.html',
  styleUrls: ['./recurrence.component.css']
})
export class RecurrenceComponent implements OnInit {
  modalRef: NgbModalRef;
  favoriteSeason: string;
  panelOpenState = false;
  seasons: string[] = ['RequestedDeliveryDate', 'OrderNumber'];

  constructor(private router: Router, public activeModal: NgbActiveModal) { }
  ngOnInit(): void { }

  //material table code
  displayedColumns = ['selectRow', 'RequestedDeliveryDate', 'OrderNumber'];
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
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }


}

