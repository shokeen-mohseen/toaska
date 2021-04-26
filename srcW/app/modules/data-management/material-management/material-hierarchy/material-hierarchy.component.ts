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
import { ResizeEvent } from 'angular-resizable-element';
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

  modalRef: NgbModalRef;
  materialHierarchyModel = new MaterialHierarchyModel()
  displayedColumns = ['name', 'detail'];
  displayedColumnsReplace = ['key_HierarchyName', 'key_Detail'];
  displayColumnsNew = ['name', 'detail'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialHierarchyModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
  btn: any;
  issue: any;
  profile: any;
  detail: any;
  constructor(private router: Router, public modalService: NgbModal, private materialService: MaterialService, private authenticationService: AuthService) { }

  ngOnInit(): void {
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.detail = 'detail';
    this.actionGroupConfig = getGlobalRibbonActions();
    this.getMaterialHierarchyData();
    this.dataSource = new MatTableDataSource<MaterialHierarchyModel>();
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('add');
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('refresh');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
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
    this.materialService.getMaterialHierarchyData(this.materialHierarchyModel)
      .subscribe(result => {
        
        this.dataSource.data = result.data;
        this.dataSource.sort = this.sort;
      }
      );
  }

}
