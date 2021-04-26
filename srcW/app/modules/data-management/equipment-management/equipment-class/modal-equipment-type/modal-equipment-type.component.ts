import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-modal-equipment-type',
  templateUrl: './modal-equipment-type.component.html',
  styleUrls: ['./modal-equipment-type.component.css']
})
export class ModalEquipmentTypeComponent implements OnInit {
  displayedColumns = ['selectRow', 'Equipmenttypecode', 'Resourcetypeequipt'];
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
  Equipmenttypecode: string;
  Resourcetypeequipt: string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  
  { selectRow: '', Equipmenttypecode: 'FinishGoodsLine', Resourcetypeequipt: 'Finish Goods Line'},
];
