import { Component, ViewChild, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { FreightLane } from '../../../../../core/models/FreightLane.model';
import { FreightLaneService } from '@app/core/services/freightlane.service';
import { PreferenceTypeService } from '@app/core/services/preferencetype.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-freight-lanes-list',
  templateUrl: './freight-lanes-list.component.html',
  styleUrls: ['./freight-lanes-list.component.css']
})
export class FreightLanesListComponent implements OnInit {
  /*
    onResizeEnd(event: ResizeEvent, columnName): void {
      if (event.edges.right) {
        const cssValue = event.rectangle.width + 'px';
        const columnElts = document.getElementsByClassName('mat-column-' + columnName);
        for (let i = 0; i < columnElts.length; i++) {
          const currentEl = columnElts[i] as HTMLDivElement;
          currentEl.style.width = cssValue;
        }
      }
    }*/


  btnEdit = function () { this.router.navigateByUrl(''); };

  displayedColumns = ['selectRow', 'fromCountry', 'fromState', 'fromCity', 'fromZipcode', 'toCountry', 'toState', 'toCity', 'toZipcode', 'freightMode', 'carrier', 'carrierSCAC', 'ratePerLoad', 'distance', 'travelTimeInDays', 'equipmentType'];
  displayedColumnsReplace = ['selectRow', 'key_Fromcountry', 'key_Fromstate', 'key_Fromcity', 'key_Fromzip', 'key_Tocountry', 'key_Tostate', 'key_Tocity', 'key_Tozip', 'key_FreightMode', 'key_Carrier', 'key_CarrierSCAC', 'key_Rateper', 'key_DistanceMiles', 'key_Traveltime', 'Key_EquipmentType'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //selection = new SelectionModel<PeriodicElement>(true, []);
  dataSource;
  selection = new SelectionModel<FreightLane>(true, []);
  paginationModel = new FreightLane();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('SelectedFreightLane') SelectedFreightLane = new EventEmitter<FreightLane[]>();
  @Input('FreightLaneToSelect') FreightLaneToSelect: FreightLane[];
  ItemList: FreightLane[];
  FreightList: FreightLane[];
  FreightListchk: FreightLane[];
  filterValue = "";
  SelectedItemList = [];
  modalRef: NgbModalRef;
  constructor(private ptService: PreferenceTypeService, private freightLaneService: FreightLaneService, private toastr: ToastrService, public modalService: NgbModal) { }
  selectRow: any;
  async ngOnInit() {
    this.selectRow = 'selectRow';
    // this.getFreightLaneList();
    this.paginationModel.sortOrder = "DESC";
    this.dataSource = new MatTableDataSource<FreightLane>();
    this.ItemList = new Array<any>();
    this.FreightList = new Array<any>();
    this.FreightListchk = new Array<any>();
    await this.getPageSize();
    this.getDefaultPagesize();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.length = this.paginationModel.pageSize;
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
        this.SelectedFreightLane.emit(this.selection.selected);
      });
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getFreightLaneList();
    }
  }


  getFreightLaneList() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.freightLaneService.GetAllFreightLaneDetails(this.paginationModel)
      .subscribe(result => {

        this.dataSource.data = result.data;
        this.FreightList = result.data;
        this.setRowSelection();
      }
      );

  }
  FreightLaneData: FreightLane[];
  FreightLaneFilter(data: any) {
    this.dataSource.data = data;
    this.setRowSelection();
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
  setRowSelection() {
    if (this.FreightLaneToSelect != null && this.FreightLaneToSelect.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.FreightLaneToSelect.findIndex(item => item.id === row.id) >= 0) {
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
  onSelectionChange(row: FreightLane, checked: boolean) {

    row.isSelected = checked;
    this.selection.toggle(row);

    if (this.FreightList != undefined && this.FreightList != null && this.FreightList.length > 0) {
      const freightLanesData = this.selection.selected.map(o => {
        return o;
      });
      this.ItemList = new Array<any>();
      const freightLanesDataList = freightLanesData.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)));
      if (freightLanesDataList.length > 0) {
        var k = 0;
        for (k = 0; k < freightLanesDataList.length; k++) {
          this.ItemList.push(freightLanesDataList[k]);
        }
      }
    }
    this.SelectedFreightLane.emit(this.ItemList);

    ////OLD
    //row.isSelected = checked;
    //this.selection.toggle(row);
    //if (checked == true || this.selection.selected.length > 0) {
    //  for (var i = 0; i < this.FreightList.length; i++) {
    //    if (row.id == this.FreightList[i].id) {
    //      this.ItemList.push(this.FreightList[i]);
    //    }
    //  }
    //}
    //else {
    //  this.ItemList = this.ItemList.filter(m => m != row);
    //}
    //this.SelectedFreightLane.emit(this.ItemList);
  }

  async getPageSize() {
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    this.freightLaneService.GetAllFreightLaneDetails(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.freightLaneService.getDefaultPageSize();
  }

  getDefaultPagesize() {

    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.paginationModel.sortOrder = "DESC";
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        this.getFreightLaneList();
      });
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

  deleteFreightLaneList(ItemList: FreightLane[]) {
    if (!this.ItemList.length) {
      this.toastr.warning('Please select atleast one record');
    }
    else {
      const ids = this.ItemList.map(i => i.id).join(',');
      this.freightLaneService.deleteAllFreightLane(ids).subscribe(x => {
        // const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        this.freightLaneService.GetAllFreightLaneDetails(this.paginationModel)
          .subscribe(result => {
            this.dataSource.data = result.data;
            this.toastr.success('Record deleted successfully');
            this.getFreightLaneList();
            this.getPageSize();
            this.ItemList = Array<any>();
          }
          );
      });
    }
  }
  FreightLaneResetFilter(event: any) {
    this.getFreightLaneList();
  }
}

