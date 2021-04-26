import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
import { MaterialGroupDetailModel } from '../../../../core/models/material.model';

@Component({
  selector: 'app-material-group-detail',
  templateUrl: './material-group-detail.component.html',
  styleUrls: ['./material-group-detail.component.css']
})
export class MaterialGroupDetailComponent implements OnInit, AfterViewInit {
  @Input() public data;
  materialGroupDetail = new MaterialGroupDetailModel()
  displayedColumns = ['materialGroupValueDesc'];
  dataSource;
  groupName = '';
  selection = new SelectionModel<MaterialGroupDetailModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue: string = "";

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getMaterialGroupDetailData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getMaterialGroupDetailData();
    }
  }

  async getPageSize() {
    this.materialService.totalMGDCount(this.materialGroupDetail)
      .subscribe(result => {
        this.materialGroupDetail.itemsLength = result.data;
      });
    // default page size
    this.materialGroupDetail.pageSize = await this.materialService.getDefaultPageSize();
    this.materialGroupDetail.pageSizeOptions.push(this.materialGroupDetail.pageSize);
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.materialGroupDetail.pageNo = event.pageIndex + 1;
    this.materialGroupDetail.pageSize = event.pageSize;
    this.getMaterialGroupDetailData();
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      if (event.active === 'materialGroupID') {
        event.active = 'MaterialGroupID';
      }
      if (event.active === 'materialGroupValueDesc') {
        event.active = 'MaterialGroupValueDesc';
      }
      this.materialGroupDetail.sortColumn = event.active;
      this.materialGroupDetail.sortOrder = event.direction.toLocaleUpperCase();
      this.getMaterialGroupDetailData();
    }
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isLinear = false;

  constructor(private router: Router, public activeModal: NgbActiveModal, private materialService: MaterialService, private authenticationService: AuthService) { }

  async ngOnInit() {
    this.materialGroupDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialGroupDetail.materialGroupID = this.data.id;
    this.groupName = this.data.description;
    await this.getPageSize();
    this.getMaterialGroupDetailData();
    this.dataSource = new MatTableDataSource<MaterialGroupDetailModel>();
  }

  getMaterialGroupDetailData() {
    this.selection.clear();
    this.materialGroupDetail.filterOn = this.filterValue;
    this.materialService.getMaterialGroupDetailData(this.materialGroupDetail)
      .subscribe(result => {
        this.dataSource.data = result.data;        
      });
  }
}



