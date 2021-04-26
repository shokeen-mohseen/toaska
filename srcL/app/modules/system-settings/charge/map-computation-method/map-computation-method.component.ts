import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChargeMapComputationMethodMapping } from '../../../../core/models/charge.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ChargeService } from '../../../../core/services/charge.service';
import { TableFilterComponent } from '../../../../shared/components/table-filter/table-filter.component';
@Component({
  selector: 'app-map-computation-method',
  templateUrl: './map-computation-method.component.html',
  styleUrls: ['./map-computation-method.component.css']
})
export class MapComputationMethodComponent implements OnInit, AfterViewInit {
  displayedColumns = ['selectRow', 'ChargeCategoryDescription', 'ChargetypeDescription', 'ChargeDescription', 'MappedComputationMethods'];
  dataSource = new MatTableDataSource<ChargeMapComputationMethodMapping>();
  selection = new SelectionModel<ChargeMapComputationMethodMapping>(true, []);
  paginationModel = new ChargeMapComputationMethodMapping();
  filterValue = "";
  isEditMode = false;
  chargeDefaultComputationMethodList: [];
  chargeDefaultComputationMethodListSelectedItems = [];
  selectedChargeMapComputationMethodMapping: ChargeMapComputationMethodMapping;
  settings = {};
  isLoading = true;
  selectRow: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(TableFilterComponent) eqList: TableFilterComponent;
  constructor(private ptService: PreferenceTypeService, private router: Router,
    public chargeService: ChargeService,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.paginationModel.sortOrder = "ASC";
    this.getChargeComputationMethodMappingData();
    this.getChargeDefaultComputationMethodList();
    this.settings = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      labelKey: "description",
      noDataLabel: "No Data Available",
      searchBy: ['description'],
      //lazyLoading: true
    };
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
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });
  }
  /** On row selection send unselect all other rows */
  onSelectionChange(row: ChargeMapComputationMethodMapping, checked: boolean) {

    if (row.isEdited != true) {
      this.dataSource.data.forEach(row => { row.isSelected = false; });
      row.isSelected = checked;
      this.selection.toggle(row);
    }
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getChargeComputationMethodMappingData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getChargeComputationMethodMappingData();
    }

  }
  async buttonAction(button: String) {
    if (button === 'edit') {
      this.setEditMode(true);
    } else if (button === 'save') {
      this.save();
      this.setEditMode(false);
    } else if (button === 'cancel') {
      this.setEditMode(false);
      this.getChargeComputationMethodMappingData();
    } else if (button === 'refresh') {
      this.paginationModel.filterOn = '';
      this.filterValue = '';
      this.eqList.pills = [];
      await this.getPageSize();
      this.getChargeComputationMethodMappingData();      
      this.setEditMode(false);
    }
  }
  buttonrefresh() {
    this.getChargeComputationMethodMappingData();
  }
  setEditMode(edit: boolean) {
    if (edit) {
      this.isEditMode = true;
      if (this.selection.selected.length == 1) {
        this.selectedChargeMapComputationMethodMapping = this.selection.selected[0];
        this.selectedChargeMapComputationMethodMapping.isEdited = true;
        this.chargeDefaultComputationMethodListSelectedItems = this.selection.selected[0].computationMappings
          ? this.selection.selected[0].computationMappings
          : [];
      }
    } else {
      this.isEditMode = false;
      this.selectedChargeMapComputationMethodMapping.isEdited = false;
      this.selectedChargeMapComputationMethodMapping = null;
      this.chargeDefaultComputationMethodListSelectedItems = null;
    }

  }

  save() {

    if (this.selection.selected.length == 1) {
      this.isLoading = true;
      this.selectedChargeMapComputationMethodMapping.clientId = this.authenticationService.currentUserValue.ClientId;
      this.selectedChargeMapComputationMethodMapping.updateDateTimeBrowser = new Date();
      this.selectedChargeMapComputationMethodMapping.createDateTimeBrowser = new Date();
      this.selectedChargeMapComputationMethodMapping.updatedBy = this.authenticationService.currentUserValue.LoginId;
      this.selectedChargeMapComputationMethodMapping.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
      this.chargeService.updateChargeComputationMapping(this.selectedChargeMapComputationMethodMapping)
        .subscribe(
          result => {
            if (result.statusCode == 200) {
              this.toastrService.success("Rate type mapping updated.");
            } else {
              this.toastrService.error("Rate type mapping failed to update. Please contact Tech Support.");
            }
            this.isLoading = false;
            this.paginationModel.sortOrder = "DESC";
            this.getChargeComputationMethodMappingData();
          },
          err => {
            this.isLoading = false;
          },
        );
    }
    else if (this.selection.selected.length != 1) {
      this.toastrService.error("Rate type mapping failed to update. Please contact Tech Support.");
    }

  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }
  getChargeComputationMethodMappingData() {
    this.selection.clear();
    this.isLoading = true;
    this.paginationModel.filterOn = this.filterValue;
    this.chargeService.getChargeComputationMethodMappingList(this.paginationModel)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.isLoading = false;
      }
      );
  }

  //async paginationSetup() {
  //  var tempPagination = Object.assign({}, this.paginationModel);
  //  tempPagination.pageSize = 0; 
  //  this.chargeService.getChargeComputationMethodMappingList(tempPagination)
  //    .subscribe(result => {
  //      this.paginationModel.itemsLength = result.recordCount;
  //    }
  //  );
  //  // default page size
  //  this.getDefaultPagesize();
  //}
  //getDefaultPagesize() {
  //  this.ptService.getPreferenceTypeByCode("PageSize")
  //    .subscribe(result => {
  //      this.paginationModel.pageSize = Number(result.data.preferenceValue);
  //      this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  //      this.paginator.showFirstLastButtons = true;
  //      this.paginationModel.sortOrder = "DESC";
  //      this.getChargeComputationMethodMappingData();
  //    });
  //}

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getChargeComputationMethodMappingData();
    }
  }

  async getPageSize() {
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    await this.chargeService.getChargeComputationMethodMappingList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.chargeService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.paginator.pageIndex = 0;
    this.paginationModel.sortOrder = 'Desc';
  }

  onPaginationEvent(event) {
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getChargeComputationMethodMappingData();
    this.paginationModel.pageSize = event.pageSize;
  }

  isMultipleSelected() {
    return this.selection.selected.length != 1;
  }

  getChargeDefaultComputationMethodList() {
    this.chargeService.getChargeComputationMethodList()
      .subscribe(result => {
        this.chargeDefaultComputationMethodList = result.data;
      }
      );
  }


}


