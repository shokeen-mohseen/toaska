import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { FreightLaneExcelUpload } from '../../../../../core/models/FreightLaneExcelUpload.model';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import * as XLSX from 'xlsx'; 
import { AuthService } from '../../../../../core';

@Component({
  selector: 'app-view-import-status',
  templateUrl: './view-import-status.component.html',
  styleUrls: ['./view-import-status.component.css']
})
export class ViewImportStatusComponent implements OnInit {
  dataSource;
  selection = new SelectionModel<FreightLaneExcelUpload>(true, []);
  paginationModel = new FreightLaneExcelUpload();
  freightLaneExcelUpload: FreightLaneExcelUpload; 
  selectRow: any;
  modalRef: NgbModalRef;
  totalCount = 0;
  failedCount = 0;
  successCount = 0;
  filterValue = "";
  lastImportUserDetails: any;
  constructor(private ptService: PreferenceTypeService, private freightLaneService: FreightLaneService,
    public activeModal: NgbActiveModal, private authenticationService: AuthService,
  ) { }

  async ngOnInit() {
    //debugger;
    this.selectRow = 'selectRow';
    //this.paginationModel.sortOrder = "DESC";
    await this.getPageSize();
    this.dataSource = new MatTableDataSource<FreightLaneExcelUpload>();
    await this.getPageSize();
    this.getDefaultPagesize();
    
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.freightLaneService.GetFreightLaneExcelDetails(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.freightLaneService.getDefaultPageSize();
  }

  getDefaultPagesize() {

    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        //this.paginationModel.sortOrder = "DESC";
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        this.getFreightLaneList();
      });
  }
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
  getFreightLaneList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;

    this.freightLaneService.GetFreightLaneExcelDetails(this.paginationModel)
      .subscribe(result => {
        //debugger;
        this.dataSource.data = result.data;
       // this.FreightLaneExcelUpload = result.data;
        this.selectedFreightLane(result.data[0])
        //this.setRowSelection();
        this.totalCount = result.data.length;
        this.failedCount = result.data.filter(item => item.importStatus === 'FAILED').length;
        this.successCount = this.totalCount - this.failedCount;
        this.getExcelUploadDatails();
      }
      );

  }
  selectedFreightLane(selectedFreightLaneToEdit: FreightLaneExcelUpload) {
    this.freightLaneExcelUpload = Object.assign({}, selectedFreightLaneToEdit);
  }

  getExcelUploadDatails() {
    this.freightLaneService.getExcelUploadDetails(this.authenticationService.currentUserValue.LoginId)
      .subscribe(result => {
        this.lastImportUserDetails = result.data[0];
      });
  }
  
  displayedColumns = [
    'selectRow',
    'importStatus',
    'error',
    'carrier',
    'originCity',
    'originState',
    'originZip',
    'destinationCity',
    'destinationState',
    'destinationZip',
    'rateUOM',
    'rate',
    'equipmentType',
    //'funds',
    'modeType',
    'distances',
    'distanceUOM'

  ];
  displayedColumnsHeader = [
    'selectRow',
    'key_ImportStatus',
    'key_Error',
    'key_Carrier',
    'key_OriginCity',
    'key_OriginState',
    'key_OriginZip',
    'key_DestinationCity',
    'key_DestinationState',
    'key_DestinationZip',
    'key_RateUOM',
    'key_Rate',
    'Key_EquipmentType',
    //'key_Funds',
    'key_ModeType',
    'key_Distances',
    'key_DistanceUOM',
  ];


  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
   // this.paginator.length = this.paginationModel.pageSize;
  }

  

  async applyFilter(filterText: string) {
    // this.filterValue = filterText.trim(); // Remove whitespace
    // this.getFreightLaneList();
    //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //this.dataSource.filter = filterValue;
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getFreightLaneList();

  }
  //getOriginOfGoodsList() {
  //  this.selection.clear();
  //  this.paginationModel.filterOn = this.filterValue;

  //  this.shipmentManagementService.getOriginOfGoodsDetailsList(this.paginationModel)
  //    .subscribe(result => {
  //      this.dataSource.data = result.data;
  //      this.setRowSelection();
  //    }
  //    );

  //}
  //setRowSelection() {
  //  if (this.OriginOfGoodsToSelect != null && this.OriginOfGoodsToSelect.length > 0) {
  //    this.dataSource.data.forEach(row => {
  //      if (this.OriginOfGoodsToSelect.findIndex(item => item.id === row.id) >= 0) {
  //        this.selection.select(row);
  //        row.isSelected = true;
  //      }
  //      else {
  //        this.selection.deselect(row);
  //        row.isSelected = false;
  //      }

  //    });
  //  }
  //}
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getFreightLaneList();
    }
  }
  

  onPaginationEvent(event) {
    //this.filterValue = "";
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //this.paginationModel.pageSize = event.pageSize;
    //this.getFreightLaneList();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getFreightLaneList();
    this.paginationModel.pageSize = event.pageSize;
  }


  ExportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'FreightLaneExcelImportErrorReport.xlsx');
  }
}

