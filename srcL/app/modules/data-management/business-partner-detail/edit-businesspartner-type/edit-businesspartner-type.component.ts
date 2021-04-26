import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { AuthService } from '../../../../core';
import { LocationFunctionViewModel } from '../../../../core/models/LocationFunction';
import { AddEditBusinessPartnerTypePopupComponent } from '../add-edit-business-partner-type-popup/add-edit-business-partner-type-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-businesspartner-type',
  templateUrl: './edit-businesspartner-type.component.html',
  styleUrls: ['./edit-businesspartner-type.component.css']
})
export class EditBusinesspartnerTypeComponent implements OnInit {
 
  btnEdit = function () { this.router.navigateByUrl(''); };
 
  modalRef: NgbModalRef;
  constructor(private router: Router,
    private toastrService: ToastrService,
    public activeModal: NgbActiveModal,    
    private bpService: BusinessPartnerService,
    private authenticationService: AuthService,
    public modalService: NgbModal) {
    this.ClientId = this.authenticationService.currentUserValue.ClientId;
  }
  displayedColumns = ['selectRow', 'name'];
  displayedColumnsReplace = ['selectRow', 'key_BusinessPartnerTypeDescription'];
  dataSource = new MatTableDataSource<LocationFunctionViewModel>();
  selection = new SelectionModel<LocationFunctionViewModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginationModel = new LocationFunctionViewModel();
  ClientId: number;
  isEdit: boolean = false;
  filterValue: string = '';
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
  }

  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //  this.dataSource.filter = filterValue;
  //}
  //applyFilter(filterText: string) {
  //  this.filterValue = filterText.trim(); // Remove whitespace
  //  this.getBusinessPartnerTypeList();
  //}
  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;
    await this.getPageSize();
    this.getBusinessPartnerTypeList();
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
    this.selectedType = this.selection.selected;
    this.setSelectionIds();
    this.selectedbpTypes.emit(this.selection.selected);
  }
  selectRow: any;
  async ngOnInit() {
    this.selectRow = 'selectRow';
    await this.getPageSize();
    this.getBusinessPartnerTypeList();    
    this.getAllLocationList();
  }

  openPopup(action) {
    if (action === "add") {
      this.modalRef = this.modalService.open(AddEditBusinessPartnerTypePopupComponent, { size: 'md', backdrop: 'static' });
      this.modalRef.componentInstance.isEdit = false;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getBusinessPartnerTypeList();
        //this.buttonEnableDisable = true;
        //this.editbuttonEnableDisable = true;
      });
    }
    else if (action === "edit") {
      if (!!!this.iDs) {
        this.toastrService.warning('Please select at least one record.');
        return;
      } else if (!!this.iDs) {
        const splitContactIds = this.iDs.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please select only one record for editing.');
          return;
        }
      }
      this.modalRef = this.modalService.open(AddEditBusinessPartnerTypePopupComponent, { size: 'md', backdrop: 'static' });
      this.modalRef.componentInstance.isEdit = true;
      this.modalRef.componentInstance.iDs = this.iDs;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getBusinessPartnerTypeList();
        //this.buttonEnableDisable = true;
        //this.editbuttonEnableDisable = true;
      });
    }
    else if (action === "delete") {
      if (!!!this.iDs) {
        this.toastrService.warning('Please select at least one record');
        return;
      } else if (!!this.iDs) {
        const splitContactIds = this.iDs.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please Select only one record to delete.');
          return;
        }
      }
      if (this.checkIsInUse(Number(this.iDs))) {
        this.toastrService.warning('This record cannot be deleted, it is already in use.');
        return;
      }
      else {
       
        this.bpService.deleteBusinessPartnerType(Number(this.iDs), this.authenticationService.currentUserValue.LoginId).subscribe(result => {
          this.toastrService.success('Record deleted successfully.');
          this.getBusinessPartnerTypeList();
        });
      }
    }
  }
  
  getBusinessPartnerTypeList() {
    
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.bpService.getAllBusinessPartnerType(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;
      this.setRowSelection();
    });
  }
  locationList: any;
  getAllLocationList() {
    this.bpService.getAllLocationList(this.ClientId).subscribe(result => {
      this.locationList = result.data;
      
    });
  }
  checkIsInUse(id: number): boolean {
    var abc = this.locationList.filter(item => item.locationFunctionId == id);
    if (abc.length > 0) {

      return true;
    }
    else {
      
      return false;
    }
    
  }
  @Input('bpTypeInEdit') bpTypeInEdit: LocationFunctionViewModel[];
  selectedType: LocationFunctionViewModel[] = [];
  setRowSelection() {
    if (this.bpTypeInEdit != null && this.bpTypeInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.bpTypeInEdit.findIndex(item => item.id === row.id) >= 0) {
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
  @Output('selectedbpTypes') selectedbpTypes = new EventEmitter<LocationFunctionViewModel[]>();
  onSelectionChange(row: LocationFunctionViewModel, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedType = this.selection.selected;
    this.setSelectionIds();
    this.selectedbpTypes.emit(this.selection.selected);
  }

  async getPageSize() {
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;  
    await this.bpService.getAllBusinessPartnerType(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.bpService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.paginator.pageIndex = 0;
    // initial load should sort by last updated by at first
    this.paginationModel.sortColumn = 'UpdateDateTimeServer';
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
    this.getBusinessPartnerTypeList();
    this.paginationModel.pageSize = event.pageSize;   
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getBusinessPartnerTypeList();
    }
  }
  iDs: string;
  @Output() selectedIds: EventEmitter<string> = new EventEmitter();
  
  setSelectionIds() {
    this.iDs = '';
    this.selectedType.forEach(item => {
      if (this.iDs != '') {
        this.iDs += `,${item.id}`;
      }
      else {
        this.iDs += `${item.id}`;
      }
    });
    
    this.selectedIds.emit(this.iDs);
  }

}



