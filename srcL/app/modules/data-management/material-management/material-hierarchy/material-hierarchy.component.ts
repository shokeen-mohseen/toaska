import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MaterialHierarchyDetailComponent } from '../material-hierarchy-detail/material-hierarchy-detail.component';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { projectkey } from 'environments/projectkey';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { MaterialHierarchyModel } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
//import { getMaterialHierarchy } from '@app/shared/components/top-btn-group/page-actions-map';

@Component({
  selector: 'app-material-hierarchy',
  templateUrl: './material-hierarchy.component.html',
  styleUrls: ['./material-hierarchy.component.css']
})
export class MaterialHierarchyComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  MaterialHierarchyList: string = "MaterialHierarchyExport";
  modalRef: NgbModalRef;
  materialHierarchyModel = new MaterialHierarchyModel()
  displayedColumns = ['name', 'detail'];
  displayedColumnsReplace = ['key_HierarchyName', 'key_Detail'];
  displayColumnsNew = ['name', 'detail'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialHierarchyModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue: string = "";

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.materialHierarchyModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getMaterialHierarchyData();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getMaterialHierarchyData();
    }
  }

  async getPageSize() {
    this.materialHierarchyModel.pageNo = 0;
    this.materialHierarchyModel.pageSize = 0;
    this.materialService.getMaterialHierarchyData(this.materialHierarchyModel).toPromise()
      .then(result => {
        this.materialHierarchyModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.materialHierarchyModel.pageSize = await this.materialService.getDefaultPageSize();
    //this.materialHierarchyModel.pageSizeOptions.push(this.materialHierarchyModel.pageSize);
  }

  onPaginationEvent(event) {  
    
    this.materialHierarchyModel.filterOn = this.filterValue;
    this.materialHierarchyModel.pageNo = event.pageIndex + 1;
    if (this.materialHierarchyModel.pageNo > this.materialHierarchyModel.itemsLength / event.pageSize) {
      this.materialHierarchyModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.materialHierarchyModel.pageSize = event.pageSize;
    }
    this.getMaterialHierarchyData();
    this.materialHierarchyModel.pageSize = event.pageSize;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      if (event.active === 'detail') {
        event.active = 'code';
      }
      this.materialHierarchyModel.sortColumn = event.active;
      this.materialHierarchyModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getMaterialHierarchyData();
    }
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
  IsTosca: boolean;
  selectRow: any;
  btn: any;
  issue: any;
  profile: any;
  detail: any;
  constructor(private router: Router, public modalService: NgbModal, private materialService: MaterialService, private authenticationService: AuthService) { }

  async ngOnInit() {
    this.selectRow = 'selectRow';
    this.materialHierarchyModel.clientID = this.authenticationService.currentUserValue.ClientId;
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.detail = 'detail';
    this.actionGroupConfig = getGlobalRibbonActions();
    await this.getPageSize();
    this.getMaterialHierarchyData();
    
  }

  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('refresh');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
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
  actionHandler(type) {
    if (type === "issue") {
      this.btn = 'issue';
    } else if (type === "profile") {
      this.btn = 'profile';
    }
  }

  opendetail(x) {
    this.modalRef = this.modalService.open(MaterialHierarchyDetailComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.data = x;
  }

  getMaterialHierarchyData() {
    this.selection.clear();
    this.materialHierarchyModel.filterOn = this.filterValue;
    this.materialService.getMaterialHierarchyData(this.materialHierarchyModel)
      .subscribe(result => {
        this.dataSource = new MatTableDataSource<MaterialHierarchyModel>();
        this.dataSource.data = result.data;
      });
  }
}
