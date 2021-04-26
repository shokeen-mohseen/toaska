import { Component, ViewChild, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommodityService } from '../../../../core/services/commodity.service';
import { ToastrService } from 'ngx-toastr';
import { CommodityPaginatorListViewModel, PeriodicElement, Commodity, CommodityEitModel, CommodityNewModel } from '../../../../core/models/commodity.model';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../../core';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { PreferenceTypeService } from '../../../../core/services/preferencetype.service';

@Component({
  selector: 'app-commodity-list',
  templateUrl: './commodity-list.component.html',
  styleUrls: ['./commodity-list.component.css']
})
export class CommodityListComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns = ['ID', 'commodityTypeName', 'name', 'segmentDescription'];
  dataSource;
  commodity: CommodityNewModel = new CommodityNewModel();
  error: string;
  modalRef: NgbModalRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<CommodityNewModel>(true, []);  
  filterValue = '';
  @Output('SelectedCommodities') SelectedCommodities = new EventEmitter<CommodityNewModel[]>();
  @Input('commoditiesToSelect') commoditiesToSelect: CommodityNewModel[];

  constructor(private authenticationService: AuthService, public modalService: NgbModal,
    private commodityService: CommodityService,
    private toastrService: ToastrService) {

  }

  async ngOnInit() {
    this.commodity.clientID = this.authenticationService.currentUserValue.ClientId;
    this.dataSource = new MatTableDataSource<CommodityNewModel>();
    await this.getPageSize();    
    this.getCommodity();
    
  }

  async getPageSize() {
    this.commodity.clientID = this.authenticationService.currentUserValue.ClientId;
    this.commodity.pageNo = 0;
    this.commodity.pageSize = 0;
    await this.commodityService.getCommodityList(this.commodity).toPromise()
      .then(result => {
        this.commodity.itemsLength = result.recordCount;
      });
    // default page size
    this.commodity.pageSize = await this.commodityService.getDefaultPageSize();
    this.commodity.pageSizeOptions.push(this.commodity.pageSize);
    this.paginator.pageIndex = 0;
  }

  ngAfterViewInit() {
    //await this.getPageSize();
    //this.paginator.length = this.commodity.pageSize;
    this.paginator.showFirstLastButtons = true;
  }

  isAllSelecteds() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onSelectionChange(row: CommodityNewModel, checked: boolean) {
    row.IsSeleted = checked;
    this.selection.toggle(row);
    this.SelectedCommodities.emit(this.selection.selected);
  }
  masterToggle() {
    this.isAllSelecteds() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; this.SelectedCommodities.emit(this.selection.selected); });
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.commodity.filterOn = this.filterValue;
    await this.getPageSize();
    this.getCommodity();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getCommodity();
    }

  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.commodity.sortColumn = event.active;
      this.commodity.sortOrder = event.direction.toLocaleUpperCase();
      this.getCommodity();
    }
  }

  onPaginationEvent(event) {
    this.commodity.filterOn = this.filterValue;
    this.commodity.pageNo = event.pageIndex + 1;
    if (this.commodity.pageNo > this.commodity.itemsLength / event.pageSize) {
      this.commodity.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.commodity.pageSize = event.pageSize;
    }
    this.getCommodity();
    this.commodity.pageSize = event.pageSize;
  }

  getCommodity() {
    this.selection.clear();
    this.commodity.filterOn = this.filterValue;
    this.commodityService.getCommodityList(this.commodity)
      .subscribe(result => {
        this.dataSource.data = result.data;
        this.dataSource.sort = this.sort;
      },
        error => {
          this.error = error;
          this.toastrService.error(this.error);
        }
      );
  }
  ngOnChanges(changes: any) {
    this.setRowSelection();
  }
  setRowSelection() {
    if (this.commoditiesToSelect != null && this.commoditiesToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.commoditiesToSelect.findIndex(item => item.id === row.id) >= 0) {
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

  RemoveSelectedCommodity() {    
    var selectedIDs = '';
    if (this.selection.selected.length == 0) {
      this.toastrService.info("Please select at least one record.");
      return false;
    }
    this.selection.selected.forEach((value, index) => {
      selectedIDs = selectedIDs + value.id.toString() + ',';
    });
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.commodityService.RemoveCommodity(selectedIDs).subscribe(result => {
        if (result.message == "Success" || result.Message == "Success") {
          this.getCommodity();
          this.toastrService.success("Records are deleted successfully.");
        }
        else {
          this.toastrService.warning("An error occurred during this operation. Please contact Tech Support.");
        }
      }, error => {
        this.toastrService.error("Records saved successfully.");
      });
    }, (reason) => {
    });    
  }
}

