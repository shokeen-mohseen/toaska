import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, CommonCallListViewModel, PeriodicElement, UseraccessService, UserConstant, CommonPaginatorListViewModel } from '@app/core';
import { PaginatorComponent } from '@app/shared';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-locked-users',
  templateUrl: './locked-users.component.html',
  styleUrls: ['./locked-users.component.css']
})
export class LockedUsersComponent implements OnInit, OnDestroy, AfterViewInit {

  returnUrl: string;
  error: string;
  isLoading: boolean;
  userContactServiceSubcriber: Subscription;
  modalRef: NgbModalRef;
  commonCallListViewModel: CommonPaginatorListViewModel = new CommonPaginatorListViewModel();
  displayedColumns = ['Id', 'LoginId', 'UserName', 'CodeMobilePhone'];
  @Input() dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() size: number = 1;
  isAllSelected: boolean = false;
  @Output() checkBoxClick: EventEmitter<any> = new EventEmitter<any>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(public modalService: NgbModal,
    private useraccessService: UseraccessService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
  }

  initializationView() {
    this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.Action = UserConstant.Locked;
    //this.commonCallListViewModel.PageNo = this.paginator.pageIndex;
    //this.commonCallListViewModel.PageSize = this.paginator.pageSize;
    this.getUser();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber)
      this.userContactServiceSubcriber.unsubscribe();
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    //this.paginator.size = this.size;
    this.paginator.length = this.size;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.page.pipe(
      tap(() => this.initializationView())
    )
      .subscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /*  Mark all selected  */
  selectAll(check: any) {
    this.selection.clear();
    this.isAllSelected = check.checked;
    this.dataSource.data.forEach(row => {
      row.IsSeleted = this.isAllSelected;
      this.selection.toggle(row);
    });
    this.setUserCheckBoxData();
  }

  selectCheckbox(value: any) {
    this.selection.toggle(value);
    this.dataSource.data.forEach(row => {
      if (row.Id == value.Id)
        row.IsSeleted = !value.IsSeleted;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.IsSeleted == true).length));

    this.setUserCheckBoxData();
  }

  setUserCheckBoxData() {
    let iDs: string = '';
    this.dataSource.data.filter(x => {
      if (x.IsSeleted == true) iDs += `locked~status#${x.Id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.checkBoxClick.emit(iDs);
    this.useraccessService.setGridUserDetails(iDs);
  }

  getUser() {
    this.userContactServiceSubcriber = this.useraccessService.getUsersStatusList(this.commonCallListViewModel)
      .subscribe(result => {
        this.dataSource = new MatTableDataSource<PeriodicElement>(result.Data);
        this.size = result.RecordCount == undefined ? 0 : result.RecordCount;
        this.dataSource.data.forEach(row => { row.IsSeleted = false; });
        this.paginator.length = this.size;
        this.isAllSelected = false;
        return;
      },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        }
      );
  }

}

