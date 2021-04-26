import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChargeService } from '../../../../core/services/charge.service';
import { ChargeMapComputationMethodMapping, ChargeMapComputationMethod } from '../../../../core/models/charge.model';
import { AuthService } from '../../../../core/services/auth.service';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-computation-method',
  templateUrl: './map-computation-method.component.html',
  styleUrls: ['./map-computation-method.component.css']
})
export class MapComputationMethodComponent implements OnInit {
  displayedColumns = ['selectRow','ChargeCategoryDescription', 'ChargetypeDescription', 'ChargeDescription', 'MappedComputationMethods'];
  dataSource = new MatTableDataSource<ChargeMapComputationMethodMapping>();
  selection = new SelectionModel<ChargeMapComputationMethodMapping>(true, []);
  paginationModel = new ChargeMapComputationMethodMapping();
  filterValue = "";
  isEditMode = false;
  chargeDefaultComputationMethodList: [];
  chargeDefaultComputationMethodListSelectedItems: [];
  selectedChargeMapComputationMethodMapping: ChargeMapComputationMethodMapping;
  settings = {};
  isLoading = true;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private chargeService: ChargeService,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private authenticationService: AuthService) { }

  async ngOnInit() {
    this.getChargeComputationMethodMappingData();
    await this.paginationSetup();
    this.getChargeDefaultComputationMethodList();
    this.settings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2,
      labelKey: "description",
      noDataLabel: "No Data Available"
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
    this.dataSource.data.forEach(row => { row.isSelected = false; });
    row.isSelected = checked;
    this.selection.toggle(row);
  }


  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getChargeComputationMethodMappingData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getChargeComputationMethodMappingData();
    }

  }
  buttonAction(button: String) {

    if (button === 'edit') {
      this.setEditMode(true);
    } else if (button === 'save') {
      this.save();
      this.setEditMode(false);
    } else if (button === 'cancel') {
      this.setEditMode(false);
      this.getChargeComputationMethodMappingData();
    } else if (button === 'refresh') {
      this.setEditMode(false);
      this.getChargeComputationMethodMappingData();
    }
  }
  
  setEditMode(edit: boolean) {
    if (edit) {
      this.isEditMode = true;
      if (this.selection.selected.length == 1) {
        this.selectedChargeMapComputationMethodMapping = this.selection.selected[0];
        this.selectedChargeMapComputationMethodMapping.isEdited = true;
        this.chargeDefaultComputationMethodListSelectedItems = this.selection.selected[0].computationMappings;
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
      this.chargeService.updateChargeComputationMapping(this.selectedChargeMapComputationMethodMapping)
        .subscribe(
          result => {
            if (result.statusCode == 200) {
              this.toastrService.success("Charge to Computation Method mapping updated.");
            } else {
              this.toastrService.error("Charge to Computation Method mapping failed to update. Please try again later.");
            }
            this.isLoading = false;
            this.getChargeComputationMethodMappingData();
          },
          err => {
            this.isLoading = false;
          },
        );
    }
    else if (this.selection.selected.length != 1) {
      this.toastrService.error("Charge to Computation Method mapping failed to update. Please try again later.");
    }
    
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

  async paginationSetup() {
    var tempPagination = Object.assign({}, this.paginationModel);
    tempPagination.pageSize = 0; 
    this.chargeService.getChargeComputationMethodMappingList(tempPagination)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
    );
    // default page size
    this.paginationModel.pageSize = await this.chargeService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.paginator.showFirstLastButtons = true;
  }


  customSort(event) {
    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getChargeComputationMethodMappingData();
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getChargeComputationMethodMappingData();
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


