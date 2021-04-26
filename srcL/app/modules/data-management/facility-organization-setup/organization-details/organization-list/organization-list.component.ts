import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {

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
  displayedColumns = ['selectRow', 'Oraganizationfunction', 'Client', 'Company', 'Division', 'Lastupdate', 'Crateby', 'Active'];
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
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal, private router: Router) { }
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

}
export interface PeriodicElement {
  selectRow: string;
  Oraganizationfunction: string;
  Client: string;
  Company: string;
  Division: string;
  Lastupdate: string;
  Crateby: string;
  Active: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },
  { selectRow: '', Oraganizationfunction: 'Operating Location', Client: 'ADecTec', Company: 'ADecTecUSA', Division: 'ADecTecUSA', Lastupdate: 'Lampsdemo', Crateby: 'Lampsdemo', Active: 'Active' },


];
