import { Component, ViewChild, OnInit, Input, EventEmitter, Output, Testability } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FreightModeService } from '../../services/freightmode.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { FreightMode } from '../../modals/freightmode';
import { UserResponse, User, PreferenceTypeService } from '../../../../core';
import { identifierModuleUrl } from '@angular/compiler';
import { ResizeEvent } from 'angular-resizable-element';
import { TopButtonBarService } from '../../../../shared/components/top-btn-group/top-btn.serrvice';
import { PaginationModel } from "@app/core/models/Pagination.Model";
import { ManageFreightModeStateService } from '../freightMode-state.service';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

export class PeriodicElement {
  id: any;
  code: string;
  name: string;
  description: string;
  fuelSurFreightModePercentageRate: number;
  milesPerGallon: number;
  milesPerHour: number;
  driverHoursPerDay: number;
}




@Component({
  selector: 'app-freight-list',
  templateUrl: './freight-list.component.html',
  styleUrls: ['./freight-list.component.css']
})
export class FreightListComponent implements OnInit {

  selectRow: any;



  //dataItem: any = {}
  viewModelObject: PeriodicElement[];
  //public freightmode = [];
  //freightmode$;


  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();

  freightServiceSubcriber: Subscription;
  commonViewModel: FreightMode = new FreightMode();
  allfreight: FreightMode[] = [];
  displayedColumns = ['selectRow', 'code', 'name', 'description', 'fuelSurFreightModePercentageRate', 'milesPerGallon', 'milesPerHour', 'driverHoursPerDay'];
  displayedColumnsReplace = ['', 'key_Code', 'key_Name', 'key_Description', 'key_FuelSurchargePercentageRate', 'key_MilesPerGallon', 'key_MilesPerHour', 'key_DriverHoursPerDay'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.viewModelObject);
  //isAllSelected: boolean;

  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() size: number = 1;
  currentUser: User;
  allEmployees: Observable<PeriodicElement[]>;
  data: any;
  error: any;
  list: any;
  temp: FreightMode[] = [];
  ItemList: FreightMode[];
  test: any;
  filterValue = "";
  modalRef: NgbModalRef;
  subs = new Subscription();

  constructor(private freightmodeService: FreightModeService,
    public topButtonBarService: TopButtonBarService, public ptService: PreferenceTypeService,
    public modalService: NgbModal, private manageFreightModeState: ManageFreightModeStateService, private toastr: ToastrService, private authenticationService: AuthService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

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

  async ngOnInit() {
    this.commonViewModel.clientID = this.authenticationService.currentUserValue.ClientId;
    //this.getTotalRecords();
    // this.getfreightlist();
    await this.getPageSize();
    this.ItemList = new Array<any>();
    this.freightmodeService.entrylist = [];
    this.freightmodeService.freightmodeequiplist = [];
    this.freightmodeService.selectionlist = [];
    this.freightmodeService.setDatasourceFromEditmap([]);
    this.getfreightlist();
    this.selectRow = 'selectRow';
    this.subs.add(this.topButtonBarService.getAction().subscribe(action => {
      switch (action) {
        case 'delete':
          this.deleteFreightMode();
          break;
      }

    }));

    // this.checkBoxClick.emit([]);

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getfreightlist() {
    //this.paginator.lastPage
    this.commonViewModel.filterOn = this.filterValue;
    //this.commonViewModel.sortOrder = 'DESC';
    this.freightmodeService.getAll(this.commonViewModel).subscribe((e1: any) => {
      this.viewModelObject = [];
      this.allfreight = e1.data;
      this.allfreight.forEach(e1 => {
        const newobj = {
          id: e1.id,
          code: e1.code,
          name: e1.name,
          description: e1.description,
          fuelSurFreightModePercentageRate: e1.fuelSurFreightModePercentageRate,
          milesPerGallon: e1.milesPerGallon,
          milesPerHour: e1.milesPerHour,
          driverHoursPerDay: e1.driverHoursPerDay,
          isDeleted: e1.isDeleted,
          clientID: this.authenticationService.currentUserValue.ClientId,
          sourceSystemID: e1.sourceSystemID,
          createdBy: e1.createdBy,
          setupComplete: e1.setupComplete,
          setupCompleteDateTime: e1.setupCompleteDateTime,
          setupCompleteBy: e1.setupCompleteBy,
          createDateTimeBrowser: e1.createDateTimeBrowser,
          createDateTimeServer: e1.createDateTimeServer,
          updatedBy: e1.updatedBy,
          updateDateTimeServer: e1.updateDateTimeServer,
          updateDateTimeBrowser: e1.updateDateTimeBrowser,
          externalSourceFreightModeKey: e1.externalSourceFreightModeKey
        };
        this.viewModelObject.push(newobj);


      })
      this.dataSource = new MatTableDataSource<PeriodicElement>();
      this.dataSource.data = this.viewModelObject;

      let seletionsState = this.manageFreightModeState.selectedFreightModes;
      if (seletionsState && seletionsState.length) {
        const seletedFreightModeId = seletionsState.map(freight => freight.id);
        this.selection.select(...this.dataSource.data.filter(freight => seletedFreightModeId.includes(freight.id)));
      }

    }
    );
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    //this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.commonViewModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getfreightlist();
  }
  //applyFilter(filterText: string) {
  //  this.filterValue = filterText.trim(); // Remove whitespace
  //  this.getfreightlist();
  //}

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getfreightlist();
    }

  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.commonViewModel.sortColumn = event.active;
      this.commonViewModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getfreightlist();
    }
  }


  deleteFreightMode() {
    if (!this.selection.selected.length) {
      this.toastr.warning('Please select at least one record.');
      return;
    }
    const ids = this.selection.selected.map(item => item.id).join(',');
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.freightmodeService.deleteAllFreight(ids, this.authenticationService.currentUserValue.LoginId).subscribe(async x => {
        if (x.data == 'Records deleted successfully.') {

          //const newList = this.dataSource.data.filter(item => !this.selection.selected.includes(item as any))
          //this.freightmodeService.setDatasourceFromEditmap(newList);
          this.selection.clear();
          //this.dataSource.data = newList;
          await this.getPageSize();
          this.getfreightlist();
          this.toastr.success('Record(s) deleted successfully.');

        }
        else {
          //this.toastr.warning(x.data);
          this.toastr.warning('The record cannot be deleted as it is already in use.');
          return;
        }
      }, (reason) => {
      });

    });

  }

  isAllSelecteds() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onSelectionChange(row: FreightMode) {
    // row.IsSeleted = checked;
    this.selection.toggle(row);
    this.checkBoxClick.emit(this.selection.selected);
  }
  masterToggle() {
    this.isAllSelecteds() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); (row as any).isSelected = true; this.checkBoxClick.emit(this.selection.selected); });
  }



  //getTotalRecords() {
  //  this.freightmodeService.getTotalCount(this.commonViewModel)
  //    .subscribe(result => {
  //      this.commonViewModel.itemsLength = Number(result.data);
  //      this.getDefaultPageSize();
  //    });
  //}
  //getDefaultPageSize() {
  //  this.ptService.getPreferenceTypeByCode("PageSize")
  //    .subscribe(result => {
  //      this.commonViewModel.pageSize = Number(result.data.preferenceValue);
  //      this.getfreightlist();
  //    });
  //}
  async getPageSize() {
    this.commonViewModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.commonViewModel.pageNo = 0;
    this.commonViewModel.pageSize = 0;
    await this.freightmodeService.getAll(this.commonViewModel).toPromise()
      .then((result: any) => {
        this.commonViewModel.itemsLength = result.recordCount;
      });
    // default page size
    this.commonViewModel.pageSize = await this.freightmodeService.getDefaultPageSize();
    this.commonViewModel.pageSizeOptions.push(this.commonViewModel.pageSize);
    this.paginator.pageIndex = 0;
  }
  onPaginationEvent(event) {
    this.commonViewModel.filterOn = this.filterValue;
    this.commonViewModel.pageNo = event.pageIndex + 1;
    if (this.commonViewModel.pageNo > this.commonViewModel.itemsLength / event.pageSize) {
      this.commonViewModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.commonViewModel.pageSize = event.pageSize;
    }
    this.getfreightlist();
    this.commonViewModel.pageSize = event.pageSize;
  }

  selectedCheckbox(e: any, selectedData) {

    if (e.checked == true) {
      this.ItemList.push(selectedData);
    }
    else {
      this.ItemList = this.ItemList.filter(m => m != selectedData);
    }
    this.dataemit();
  }
  dataemit() {
    this.checkBoxClick.emit(this.ItemList);

  }
}


