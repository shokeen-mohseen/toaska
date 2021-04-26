import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { OrganizationService } from '../../../../core/services/organization.service';
import { AuthService, User, PreferenceTypeService } from '../../../../core';
import { Organization } from '../../../../core/models/organization';
import { ManageOrganizationStateService } from '../manage-organization-state.service';
import { ToastrService } from 'ngx-toastr';
import { TopButtonBarService } from '../../../../shared/components/top-btn-group/top-btn.serrvice';


export interface PeriodicElement {
  selectRow: string;
  organizationFunction: string;
  enterPriseName: string;
  groupName: string;
  billingName: string;
  isActive: boolean;
  setupComplete: boolean;
  setupCompleteDateTime: Date;
  updatedBy: string;
}

@Component({
  selector: 'app-manageorganization-list',
  templateUrl: './manageorganization-list.component.html',
  styleUrls: ['./manageorganization-list.component.css']
})
export class ManageorganizationListComponent implements OnInit {
  paginationModel = new Organization();
  currentUser: User;
  tempList: Organization[] = [];
  organizationData: Organization;
  @Input('organizationToSelect') organizationToSelect: Organization[];

  @Output('selectedOrgnizations') selectedOrgnizations = new EventEmitter();

/*  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }*/


  displayedColumns = ['selectRow', 'organizationFunction', 'enterPriseName', 'groupName', 'billingName', 'isActive', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Orgfunction', 'key_Enterprise', 'key_Group', 'key_BillingEntity', 'key_Status', 'key_Lastupdated'];
  dataSource;
  selection = new SelectionModel<Organization>(true, []);
  filterValue: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;  
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.LoadOrganizationChartData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.LoadOrganizationChartData();
    }
  }


  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.LoadOrganizationChartData();
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.selection.select(...this.dataSource.data);
      // this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.selectedOrgnizations.emit(this.selection.selected);
  }

  constructor(private organizationService: OrganizationService,
    private toastr: ToastrService,
    public ptService: PreferenceTypeService,
    public topButtonBarService: TopButtonBarService,
    private authenticationService: AuthService, private manageOrgState: ManageOrganizationStateService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.organizationData = { ClientID: this.currentUser.ClientId } as Organization;
    this.LoadOrganizationChartData();
  }
  selectRow: any;
  Active: any;
  ngOnInit(): void {
    this.paginationModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.tempList = [];
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    this.dataSource = new MatTableDataSource<Organization>([]);
    this.getTotalRecords();
    this.LoadOrganizationChartData();
    this.topButtonBarService.getAction().subscribe(action => {
      switch (action) {
        case 'refresh':
          this.LoadOrganizationChartData();
          this.manageOrgState.seletedOrganizations = [];
          break;
        case 'active':
          this.changeActiveStatus();
          break;
        case 'inactive':
          this.changeInactiveStatus();
          break;
      }
    });
  }


 


  rowSelectionChange(row): void {
    this.selection.toggle(row);
    this.selectedOrgnizations.emit(this.selection.selected);
  }

  


  LoadOrganizationChartData() {
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.organizationService.getOrganizationList(this.paginationModel).subscribe(data => {
    if (data.data != false) {
      this.tempList = data.data;
      this.tempList.reverse();
      this.dataSource.data = this.tempList;
      

      let seletionsState = this.manageOrgState.seletedOrganizations;
      if (seletionsState && seletionsState.length) {
        const seletedOrganizationsId = seletionsState.map(org => org.id);
        this.selection.select(...this.dataSource.data.filter(org => seletedOrganizationsId.includes(org.id)));
      }
      //this.paginator.showFirstLastButtons = true;
    }
    else {
      this.tempList = [];
    }

  },
    error => {
      // .... HANDLE ERROR HERE 
      console.log(error);
      this.tempList = [];
    }

  );
  }

  getTotalRecords() {
    this.organizationService.getTotalCount(this.authenticationService.currentUserValue.ClientId)
      .subscribe(result => {
        this.paginationModel.itemsLength = Number(result.data);
        this.getDefaultPageSize();
      });
  }

  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.LoadOrganizationChartData();
      });
  }

  onPaginationEvent(event) {
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.LoadOrganizationChartData();
  }

  changeActiveStatus() {
    if (this.selection.selected.length < 0) {
      this.toastr.warning('Please select an organization.');
      return;
    }
    const ids = this.selection.selected.map(item => item.organizationId).join(',');
    this.organizationService.changesActiveOrganizationStatus(ids).subscribe(x => {
      console.log("Status Changed", x);
      this.LoadOrganizationChartData();
      this.selection.clear();
      this.manageOrgState.seletedOrganizations = [];
      this.toastr.success('Status Changed Successfully.');
    });
  }

  changeInactiveStatus() {
    if (this.selection.selected.length < 0) {
      this.toastr.warning('Please select an organization.');
      return;
    }
    const ids = this.selection.selected.map(item => item.organizationId).join(',');
    this.organizationService.changesInactiveOrganizationStatus(ids).subscribe(x => {
      console.log("Status Changed", x);
      this.LoadOrganizationChartData();
      this.selection.clear();
      this.manageOrgState.seletedOrganizations = [];
      this.toastr.success('Status Changed Successfully');
    });
  }


  setRowSelection() {
    
    if (this.organizationToSelect && this.organizationToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.organizationToSelect.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.isSelected = false;
        }

      });
    }
  }

}

