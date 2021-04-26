import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-geo-location-list',
  templateUrl: './geo-location-list.component.html',
  styleUrls: ['./geo-location-list.component.css']
})
export class GeoLocationListComponent implements OnInit {
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
  displayedColumns = ['selectRow', 'Country', 'State', 'City', 'Zipcode'];
  displayedColumnsReplace = ['selectRow', 'key_Country', 'key_State', 'key_City', 'key_Zipcode'];
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
  modalRef: NgbModalRef;

  constructor( public modalService: NgbModal) { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

}
export interface PeriodicElement {
  selectRow: string;
  Country: string;
  State: string;
  City: string;
  Zipcode: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },
  { selectRow: '', Country: 'USA', State: 'Arizona', City: 'Anguila (AZ)', Zipcode: '85320' },

];
