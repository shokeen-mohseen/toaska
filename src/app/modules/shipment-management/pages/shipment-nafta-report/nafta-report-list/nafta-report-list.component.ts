import { Component, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ResizeEvent } from 'angular-resizable-element';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { shipmentManagementService } from '../../../../../core/services/shipment-management.service';
import { TopButtonBarService } from '../../../../../shared/components/top-btn-group/top-btn.serrvice';
import { ToastrService } from 'ngx-toastr';
import { ShipmentNaftaReportData } from '../../../../../core/models/ShipmentNaftaReportData.model';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
@Component({
  selector: 'app-nafta-report-list',
  templateUrl: './nafta-report-list.component.html',
  styleUrls: ['./nafta-report-list.component.css']
})
export class NaftaReportListComponent implements OnInit {
  displayedColumns = ['selectRow', 'organization', 'importerName', 'fromCalendarYear', 'toCalendarYear', 'producer', 'name', 'title', 'telephoneNumberVoice', 'telephoneNumberFacsimile'];
  displayedColumnsReplace = ['selectRow', 'key_Organization', 'key_Producername', 'key_Fromcal', 'key_Tocal', 'key_Producer', 'key_Name', 'key_Title', 'key_Telenumber','key_Telephonenumberfacsimile'];

  dataSource;
  selection = new SelectionModel<ShipmentNaftaReportData>(true, []);
  paginationModel = new ShipmentNaftaReportData();
  ItemList: ShipmentNaftaReportData[];
  filterValue = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('SelectedNaftaReport') SelectedNaftaReport = new EventEmitter<ShipmentNaftaReportData[]>();
  @Input('ShipmentNaftaReportDataToSelect') ShipmentNaftaReportDataToSelect: ShipmentNaftaReportData[];
  constructor(private ptService: PreferenceTypeService,
    private shipmentManagementService: shipmentManagementService,
    private toastr: ToastrService,
    private topButtonBarService: TopButtonBarService) { }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getShipmentNaftaReportDataList();
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
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);
        this.SelectedNaftaReport.emit(this.selection.selected);
      });
  }
  selectRow: any;


  async ngOnInit(){
    this.selectRow = 'selectRow';
    this.paginationModel.sortOrder = "DESC";    
    this.dataSource = new MatTableDataSource<ShipmentNaftaReportData>();
    this.ItemList = new Array<any>();
    await this.getPageSize();
    this.getShipmentNaftaReportDataList();
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.shipmentManagementService.getAllShipmentNaftaReportDataList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.shipmentManagementService.getDefaultPageSize();
  }
  getDefaultPagesize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
      });
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
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getShipmentNaftaReportDataList();
    }
  }
  getShipmentNaftaReportDataList() {
  this.selection.clear();
  this.paginationModel.filterOn = this.filterValue;
    this.shipmentManagementService.getAllShipmentNaftaReportDataList(this.paginationModel)
      .subscribe(result => {
      this.dataSource.data = result.data;
      this.setRowSelection();
    }
    );

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
    this.getShipmentNaftaReportDataList();
    this.paginationModel.pageSize = event.pageSize;
  }
  onSelectionChange(row: ShipmentNaftaReportData, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);

    if (checked == true) {
      this.ItemList.push(row);
   
    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.SelectedNaftaReport.emit(this.selection.selected);
  }


  setRowSelection() {

    if (this.ShipmentNaftaReportDataToSelect != null && this.ShipmentNaftaReportDataToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.ShipmentNaftaReportDataToSelect.findIndex(item => item.id === row.id) >= 0) {
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

deleteNaftaReportList(ItemList: ShipmentNaftaReportData[]) {
  if (!this.ItemList.length) {
    this.toastr.warning('Please select atleast one record');
  }
  else {
    const ids = this.ItemList.map(i => i.id).join(',');
    this.shipmentManagementService.deleteAllNaftaReport(ids).subscribe(x => {
      const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
      this.shipmentManagementService.getAllShipmentNaftaReportDataList(this.paginationModel)
        .subscribe(result => {
          this.dataSource.data = result.data;
          this.toastr.success('Record(s) Deleted Successfully');
          this.getShipmentNaftaReportDataList();
          this.getPageSize();
        }
        );

    });
  }
}
}


