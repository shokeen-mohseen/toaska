import { Component, ViewChild, OnInit, OnDestroy, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { PeriodicElement, UseraccessService, CommonCallListViewModel, AuthService } from '@app/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-grids',
  templateUrl: './grids.component.html',
  styleUrls: ['./grids.component.css']
})
export class GridsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  returnUrl: string;
  error: string;
  isLoading: boolean;
  userContactServiceSubcriber: Subscription;
  modalRef: NgbModalRef;
  commonCallListViewModel: CommonCallListViewModel = new CommonCallListViewModel();
  displayedColumns = ['Id', 'LoginId', 'UserName', 'CodeMobilePhone', 'OrganizationName', 'RoleName', 'LocationName', 'Status'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  @Input() data: any;

  @Input() columns: Array<columnDef> = [{
    caption: '',
    dataField: 'Id'
  },
    {
      caption: 'key_LoginID',
      dataField: 'LoginId'
    },
    {
      caption: 'key_Name',
      dataField: 'UserName'
    },
    {
      caption: 'key_Phone',
      dataField: 'CodeMobilePhone'
    },
    {
      caption: 'key_Organization',
      dataField: 'OrganizationName'
    },
    {
      caption: 'key_Roles',
      dataField: 'RoleName'
    },
    {
      caption: 'key_Location',
      dataField: 'LocationName'
    },
    {
      caption: 'key_Status',
      dataField: 'Status'
    },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = 60;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = 'Page: ' + 60;
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

  constructor(public modalService: NgbModal,
    private useraccessService: UseraccessService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
    this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.Action = 'Active ';
    this.displayedColumns = this.columns.map(x => x.dataField);

    this.dataSource = new MatTableDataSource<PeriodicElement>(this.data);
  }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource<PeriodicElement>(this.data);
  }

  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber)
      this.userContactServiceSubcriber.unsubscribe();
  }
}

const ELEMENT_DATA: PeriodicElement[] = [];

export class columnDef {
  caption: string;
  dataField: string;
} 
