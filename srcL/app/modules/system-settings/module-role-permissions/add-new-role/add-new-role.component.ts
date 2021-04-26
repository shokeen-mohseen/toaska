import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditNewRoleComponent } from '../edit-new-role/edit-new-role.component';

export interface PeriodicElement {
  selectRow: string;
  roleCode: string;
  roleName: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', roleCode: 'ABCED', roleName: 'Administrator', description: 'Administrator' },
  { selectRow: '', roleCode: 'ABCED', roleName: 'Accounting Manager', description: 'Accounting Manager' },
  { selectRow: '', roleCode: 'ABCED', roleName: 'Accounting', description: 'Accounting' },
];


@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.css']
})
export class AddNewRoleComponent implements OnInit {
  modalRef: NgbModalRef;
  selectRow: any;
  displayedColumns = ['selectRow', 'roleCode', 'roleName', 'description'];
  displayedColumnsReplace = ['selectRow', 'key_RoleCode', 'key_RoleName', 'key_Description'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) { }
   

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  customSort(event) {
    //if (event.active != 'selectRow') {
    //  this.paginationModel.sortColumn = event.active;
    //  this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    //  this.getBusinessPartnerTypeList();
    //}
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

  ngOnInit(): void {
    this.selectRow = 'selectRow';
  }

  openPopup(action) {
    if (action === "add") {
      this.modalRef = this.modalService.open(EditNewRoleComponent, { size: 'md', backdrop: 'static' });
    }
    else if (action === "edit") {
      this.modalRef = this.modalService.open(EditNewRoleComponent, { size: 'md', backdrop: 'static' });
    }
    else if (action === "delete") {
      
    }
  }

}
