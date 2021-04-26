import { Component, ViewChild, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatDailyViewdetailComponent } from '../mat-daily-viewdetail/mat-daily-viewdetail.component';
@Component({
  selector: 'app-atp-tbl-list',
  templateUrl: './atp-tbl-list.component.html',
  styleUrls: ['./atp-tbl-list.component.css']
})
export class AtpTblListComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal) { }

  ngOnInit(): void {
  }
  displayedColumns = ['selectRow', 'Matdailyview', 'Materialcode', 'Materialdec', 'Availblequnt', 'Orderqunty','Assignquntity','Filldate','Scheduleshipdate','Status'];
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

  openMatView() {
    this.modalRef = this.modalService.open(MatDailyViewdetailComponent, { size: 'xl', backdrop: 'static' });
  }

}
export interface PeriodicElement {
  selectRow: string;
  Matdailyview: string;
  Materialcode: string;
  Materialdec: string;
  Availblequnt: string;
  Orderqunty: string;
  Assignquntity: string;
  Filldate: string;
  Scheduleshipdate: string;
  Status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', Matdailyview: '', Materialcode: 'WW-PALLET', Materialdec: 'WW-PALLET', Availblequnt: '-5,318', Orderqunty: '60', Assignquntity: '', Filldate: '', Scheduleshipdate:'', Status:'' },

];
