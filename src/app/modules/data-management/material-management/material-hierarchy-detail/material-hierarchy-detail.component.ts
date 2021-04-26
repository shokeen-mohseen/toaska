import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialHierarchyDetailModel } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';

@Component({
  selector: 'app-material-hierarchy-detail',
  templateUrl: './material-hierarchy-detail.component.html',
  styleUrls: ['./material-hierarchy-detail.component.css']
})
export class MaterialHierarchyDetailComponent implements OnInit, AfterViewInit {
  @Input() public data;
  materialHierarchyDetailModel = new MaterialHierarchyDetailModel();
  displayedColumns = ['materialGroupID', 'materialGroupValueDesc'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialHierarchyDetailModel>(true, []);
  hierarachyCode: string = '';
  hierarachyName: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue: string = "";

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getMaterialHierarchyDetailData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getMaterialHierarchyDetailData();
    }
  }

  async getPageSize() {
    this.materialService.totalMHDCount(this.materialHierarchyDetailModel)
      .subscribe(result => {
        this.materialHierarchyDetailModel.itemsLength = result.data;
      }
      );
    // default page size
    this.materialHierarchyDetailModel.pageSize = await this.materialService.getDefaultPageSize();
    //this.materialHierarchyDetailModel.pageSizeOptions.push(this.materialHierarchyDetailModel.pageSize);
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.materialHierarchyDetailModel.pageNo = event.pageIndex + 1;
    this.materialHierarchyDetailModel.pageSize = event.pageSize;
    this.getMaterialHierarchyDetailData();
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      if (event.active === 'materialGroupID') {
        event.active = 'MaterialGroupID';
      }
      if (event.active === 'materialGroupValueDesc') {
        event.active = 'MaterialGroupValueDesc';
      }
      this.materialHierarchyDetailModel.sortColumn = event.active;
      this.materialHierarchyDetailModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getMaterialHierarchyDetailData();
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
  selectRow: any;
  constructor(private router: Router, public activeModal: NgbActiveModal, private materialService: MaterialService, private authenticationService: AuthService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.materialHierarchyDetailModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialHierarchyDetailModel.materialHierarchyID = this.data.id;
    this.hierarachyCode = this.data.code;
    this.hierarachyName = this.data.name;
    await this.getPageSize();
    this.getMaterialHierarchyDetailData();
    this.dataSource = new MatTableDataSource<MaterialHierarchyDetailModel>();
  }

  getMaterialHierarchyDetailData() {
    this.selection.clear();
    this.materialHierarchyDetailModel.filterOn = this.filterValue;
    this.materialService.getMaterialHierarchyDetailData(this.materialHierarchyDetailModel)
      .subscribe(result => {
        this.dataSource.data = result.data;        
      });
  }
}


