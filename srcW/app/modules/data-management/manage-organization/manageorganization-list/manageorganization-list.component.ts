import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { OrganizationService } from '../../../../core/services/organization.service';
import { AuthService, User } from '../../../../core';
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
  updatedBy: string;
}

@Component({
  selector: 'app-manageorganization-list',
  templateUrl: './manageorganization-list.component.html',
  styleUrls: ['./manageorganization-list.component.css']
})
export class ManageorganizationListComponent implements OnInit {

  currentUser: User;
  tempList: Organization[] = [];
  organizationData: Organization;
  @Input('organizationToSelect') organizationToSelect: Organization[];

  @Output('selectedOrgnizations') selectedOrgnizations = new EventEmitter();

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


  displayedColumns = ['selectRow', 'organizationFunction', 'enterPriseName', 'groupName', 'billingName', 'isActive', 'updatedBy'];
  displayedColumnsReplace = ['selectRow', 'key_Orgfunction', 'key_Enterprise', 'key_Group', 'key_BillingEntity', 'key_Active', 'key_Lastupdated'];
  dataSource = new MatTableDataSource<Organization>([]);
  selection = new SelectionModel<Organization>(true, []);

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
    public topButtonBarService: TopButtonBarService,
    private authenticationService: AuthService, private manageOrgState: ManageOrganizationStateService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.organizationData = { ClientID: this.currentUser.ClientId } as Organization;
    this.LoadOrganizationChartData(this.organizationData);
  }
  selectRow: any;
  Active: any;
  ngOnInit(): void {
    this.tempList = [];
    this.selectRow = 'selectRow';
    this.Active = 'Active';
    this.topButtonBarService.getAction().subscribe(action => {
      switch (action) {
        case 'refresh':
          this.LoadOrganizationChartData(this.organizationData);
          this.manageOrgState.seletedOrganizations = [];
          break;
      }
    });
  }

  rowSelectionChange(row): void {
    this.selection.toggle(row);
    this.selectedOrgnizations.emit(this.selection.selected);
  }

  LoadOrganizationChartData(baseView) {
  this.organizationService.getOrganizationList(baseView).subscribe(data => {
    if (data.data != false) {
      this.tempList = data.data;
      this.tempList.reverse();
      this.dataSource.data = this.tempList;
      console.log(this.tempList)

      let seletionsState = this.manageOrgState.seletedOrganizations;
      if (seletionsState && seletionsState.length) {
        const seletedOrganizationsId = seletionsState.map(org => org.id);
        this.selection.select(...this.dataSource.data.filter(org => seletedOrganizationsId.includes(org.id)));
      }
      this.paginator.showFirstLastButtons = true;
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

  onPaginationEvent(event) {
    this.organizationData.pageNo = event.pageIndex + 1;
    this.organizationData.pageSize = event.pageSize;
    this.LoadOrganizationChartData(this.organizationData);
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

