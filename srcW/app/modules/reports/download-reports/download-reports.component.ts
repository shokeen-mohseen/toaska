import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { projectkey } from 'environments/projectkey';
import { ResizeEvent } from 'angular-resizable-element';
import { SetupfilterDdownloadReportsComponent } from '../setupfilter-ddownload-reports/setupfilter-ddownload-reports.component';
export interface Element {
  highlighted?: boolean;
}
@Component({
  selector: 'app-download-reports',
  templateUrl: './download-reports.component.html',
  styleUrls: ['./download-reports.component.css']
})
export class DownloadReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  modalRef: NgbModalRef;
  filter: boolean = false;
  setupFilter: any;
  IsTosca: boolean;
  delete: any;
  displayedColumns = ['no', 'report', 'setupFilter'];
  displayedColumnsReplace = ['key_No', 'key_Report', 'key_setupFilter'];
  displayedColumnsnew = ['datetime', 'reportName', 'user', 'status','delete'];
  displayedColumnsReplacenew = ['key_dateTime', 'key_ReportName', 'key_User', 'key_Status', 'key_Delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourcenew = new MatTableDataSource<PeriodicElementnew>(ELEMENT_DATAnew);
  selection = new SelectionModel<PeriodicElement>(true, []);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLinear = false;
  btn: any;
  issue: any;
  profile: any;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.delete = 'delete';
    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.setupFilter = 'setupFilter';
    this.actionGroupConfig = getGlobalRibbonActions();
  }
  actionHandler(type) {
     if (type === "issue") {
      this.btn = 'issue';
    } else if (type === "profile") {
      this.btn = 'profile';
    }

  }
 
  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('add');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
    this.btnBar.hideTab('key_Data');
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
  openfilter() {
    this.modalRef = this.modalService.open(SetupfilterDdownloadReportsComponent, { size: 'xl', backdrop: 'static' });
  }

}
export interface PeriodicElement {
  no: string;
  report: string;
  setupFilter: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { no: '1', report: 'AR Charge Detail', setupFilter: '' },  
  { no: '2', report: 'AP Charge Detail', setupFilter: '' },  
  { no: '3', report: 'Freight Cost Report', setupFilter: '' },
  { no: '4', report: 'Order Plan', setupFilter: '' },
  { no: '5', report: 'Shipment History', setupFilter: '' }
];
export interface PeriodicElementnew {
  datetime: string;
  reportName: string;
  user: string;
  status: string;
  delete: string;
}
const ELEMENT_DATAnew: PeriodicElementnew[] = [
  { datetime: '1', reportName: 'charges Detail', user: 'John@Toscaltd.com', status: 'Download', delete: ''},
  { datetime: '2', reportName: 'charges Detail Report', user: 'John@Toscaltd.com', status: 'Submitted', delete: '' },
  { datetime: '3', reportName: 'Forecast Review', user: 'John@Toscaltd.com', status: 'InProcess', delete: '' },
  { datetime: '4', reportName: 'Order Plan', user: 'John@Toscaltd.com', status: 'Downloaded', delete: '' }
];
