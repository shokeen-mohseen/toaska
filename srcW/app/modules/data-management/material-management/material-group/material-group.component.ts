import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MaterialGroupDetailComponent } from '../material-group-detail/material-group-detail.component';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
import { MaterialGroupModel } from '../../../../core/models/material.model';
@Component({
  selector: 'app-material-group',
  templateUrl: './material-group.component.html',
  styleUrls: ['./material-group.component.css']
})
export class MaterialGroupComponent implements OnInit, AfterViewInit {
  materialGroupModel = new MaterialGroupModel();
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef; 
  displayedColumns = ['name', 'description', 'parentCode', 'detail'];
  displayedColumnsReplace = ['key_Name', 'key_Description', 'key_ParentCode', 'key_Detail'];
  displayColumnsNew = ['name', 'description', 'parentCode', 'detail'];
  dataSource;
  selection = new SelectionModel<MaterialGroupModel>(true, []);

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
    this.materialGroupModel.clientID = this.authenticationService.currentUserValue.ClientId;
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.detail = 'detail';
    this.actionGroupConfig = getGlobalRibbonActions();
    this.getMaterialGroupData();
    this.dataSource = new MatTableDataSource<MaterialGroupModel>();
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
  edit() {
    this.router.navigateByUrl('/data-management/edit-material');
  }
  opendetail(x) {
   
    this.modalRef = this.modalService.open(MaterialGroupDetailComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.data = x;
  }

  getMaterialGroupData() {
   
    this.selection.clear();    
    this.materialService.getMaterialGroupData(this.materialGroupModel)
      .subscribe(result => {
       
        this.dataSource.data = result.data;
        this.dataSource.sort = this.sort; 
      }
      );
  }

}

//export interface PeriodicElement {
//  name: string;
//  Description: string;
//  parentcode: string;
//  detail: string;
//}
//const ELEMENT_DATA: PeriodicElement[] = [
//  { name: 'Company', Description: 'Company', parentcode: 'NONE', detail: '' },
//  { name: 'Business', Description: 'Business', parentcode: 'Company', detail: '' },
//  { name: 'Category', Description: 'Category', parentcode: 'Business', detail: '' },
//];



