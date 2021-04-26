import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, CommonPaginatorListViewModel, PeriodicElement, UseraccessService, UserConstant } from '@app/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() actions: Observable<string>;
  returnUrl: string;
  error: string;
  isLoading: boolean;
  userContactServiceSubcriber: Subscription;
  modalRef: NgbModalRef;
  commonCallListViewModel: CommonPaginatorListViewModel = new CommonPaginatorListViewModel();
  displayedColumns = ['selectRow','Id', 'LoginId', 'UserName', 'CodeMobilePhone', 'OrganizationName', 'RoleName', 'LocationName'];
  @Input() dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() size: number = 1;
  isAllSelected: boolean = false;
  @Output() checkBoxClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() isEditClick: EventEmitter<any> = new EventEmitter<any>();
  selection = new SelectionModel<PeriodicUserElement>(true, []);

  displayExisit = ['selectRow',
    'LoginId', 'UserName', 'CodeMobilePhone', 'OrganizationName', 'RoleName', 'LocationName'];

  displayExisitReplace = ['selectRow', 'key_LoginID', 'key_Name', 'key_Phone',
    'key_Organization', 'key_Roles', 'key_Location'];
  filterValue = "";

  constructor(public modalService: NgbModal,
    private useraccessService: UseraccessService,
    private toastrService: ToastrService,
    private authenticationService: AuthService) {
  }

  async initializationView() {
    //this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    //this.commonCallListViewModel.Action = UserConstant.NewUser;
    await this.getPageSize();
    this.getUser();
    this.isAllSelected = false;
  }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.dataSource = new MatTableDataSource<PeriodicUserElement>();
    await this.getPageSize();
    this.getUser();
  }

  ngOnDestroy(): void {
    if (!!this.userContactServiceSubcriber)
      this.userContactServiceSubcriber.unsubscribe();
  }


  //ngAfterViewInit() {
  //  this.paginator.length = this.size;
  //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //  this.paginator.page.pipe(
  //    tap(() => this.initializationView())
  //  )
  //    .subscribe();
    
  //}

  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //  this.dataSource.filter = filterValue;
  //}
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

  }
  async getPageSize() {
    // var pagination = new Charge();
    var commonCallListViewModel = new CommonPaginatorListViewModel();
    commonCallListViewModel.pageNo = 0;
    commonCallListViewModel.pageSize = 0;
    commonCallListViewModel.filterOn = this.filterValue;
    commonCallListViewModel.Action = UserConstant.NewUser;
    commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    await this.useraccessService.getUsersStatusList(commonCallListViewModel).toPromise()
      .then(result => {
        this.commonCallListViewModel.itemsLength = result.RecordCount;
      });
    // default page size
    this.commonCallListViewModel.pageSize = await this.useraccessService.getDefaultPageSize();
    this.commonCallListViewModel.pageSizeOptions.push(this.commonCallListViewModel.pageSize);
  }

  onPaginationEvent(event) {
    this.commonCallListViewModel.pageNo = event.pageIndex + 1;
    this.commonCallListViewModel.pageSize = event.pageSize;
    this.getUser();
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
  @Output() selectedUseratEdit: EventEmitter<any> = new EventEmitter<any>();
  selectCheckbox(value: any) {
    this.selection.toggle(value);
    this.dataSource.data.forEach(row => {
      if (row.Id == value.Id)
        row.IsSeleted = !value.IsSeleted;
    });

    this.isAllSelected = (this.dataSource.data.length === (this.dataSource.data.filter(x => x.IsSeleted == true).length));
    this.isEditClick.emit(1);
    this.setUserCheckBoxData();
  }

  setUserCheckBoxData() {
    let iDs: string = '';
    this.dataSource.data.filter(x => {
      if (x.IsSeleted == true) iDs += `newUser~${x.UserCount}#${x.Id},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
    }
    this.checkBoxClick.emit(iDs);
    
    this.useraccessService.setGridUserDetails(iDs);
   
  }

  getUser() {
    this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.commonCallListViewModel.Action = UserConstant.NewUser;
    //this.commonCallListViewModel.PageNo = this.paginator.pageIndex;
   // this.commonCallListViewModel.pageSize = this.paginator.pageSize;
    this.commonCallListViewModel.filterOn = this.filterValue;
    this.userContactServiceSubcriber = this.useraccessService.getUsersStatusList(this.commonCallListViewModel)
      .subscribe(result => {
        this.dataSource.data = result.Data;
        //this.size = result.RecordCount == undefined ? 0 : result.RecordCount;
        this.dataSource.data.forEach(row => { row.isSeleted = false; });
        //this.paginator.length = this.size;
        //this.isAllSelected = false;
        //return;
      },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        }
      );
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.commonCallListViewModel.sortColumn = event.active;
      this.commonCallListViewModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getUser();
    }
  }

  async applyFilter(filterText: string) {

    this.filterValue = filterText.trim(); // Remove whitespace
    await this.getPageSize();
    this.getUser();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getUser();
    }

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllUserSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllUserSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); row.IsSeleted = true; });

    //this.selectedCharges.emit(this.selection.selected);
  }
  isLinear = false;
  selectRow: any;


  onSelectionChange(row: PeriodicUserElement, checked: boolean) {
    row.isSeleted = checked;
    this.selection.toggle(row);

    // this.selectedCharges.emit(this.selection.selected);
  }
}
export class PeriodicUserElement {
  Id: number;
  LoginId: string;
  UserName: string;
  CodeMobilePhone: string;
  OrganizationName: string;
  RoleName: string;
  LocationName: string;
  Status: string;
  isSeleted: boolean = false;
  UserCount: number = 0;
  constructor() {
    this.isSeleted = false;
    this.UserCount = 0;
  }
}
