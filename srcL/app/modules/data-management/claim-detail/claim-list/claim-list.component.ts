import { Component, ViewChild, OnInit, Input, AfterViewInit, EventEmitter, Output, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
/*import { ResizeEvent } from 'angular-resizable-element';*/
import { Router } from '@angular/router';
import { ClaimService } from '../../../../core/services/claim.service';
import { Claim } from '../../../../core/models/claim.model';
import { AuthService } from '../../../../core';
import { projectkey } from '../../../../../environments/projectkey';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


export interface Element {
  highlighted?: boolean;
}
export interface PeriodicElement {
  ClaimId: number;
  ClaimStatus: string;
  ClaimFor: string;
  BillingEntity: string;
  Customer: string;
  BusinessPartner: string;
  ClaimAmount: string;
  ApprovedAmount: string;
  InvoicedAmount: string;
  Claimdate: string;
  ApprovedBy: string;
  InvoiceNumber: string;
  Title: string;
}

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})

export class ClaimListComponent implements OnInit {

  displayedColumns = ['selectRow', 'ClaimStatus', 'ClaimFor', 'BillingEntity', 'Customer', 'BusinessPartner', 'InvoicedAmount', 'ClaimAmount', 'ApprovedAmount', 'InvoiceNumber', 'Claimdate', 'ApprovedBy'];

  displayedColumnsReplace = ['selectRow', 'key_Claimstatus', 'key_ClaimFor', 'key_BillingEntity', 'key_customerr', 'key_BusinessPartner', 'key_Invamount', 'key_Claimamount', 'key_Approvedmount', 'key_Invnumber', 'key_Claimdate', 'key_Approvedby',];
  // dataSource;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  paginationModel = new Claim();
  filterValue = "";
  ELEMENT_DATA: PeriodicElement[] = [];
  ClaimDetailsList: any = {};
  SelectedClaimCount: number;
  selectedClaimIds = [];
  selectRow: any;
  ControlPermissions: any = [];
  isClaimShow: boolean = true;
  @Output()
  EdittedOrderNumberLink: EventEmitter<any> = new EventEmitter<any>();
  SelectedRecords = [];
  modalRef: NgbModalRef;
  MaxEditedRecordsCountPreferences: number;
  isOnLoad: boolean = true;
  ItemList = [];
  @Output('checkBoxClick') checkBoxClick = new EventEmitter<any>();
  isPaggingClick: boolean = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() buttonBar: any;

  constructor(private router: Router, private claimService: ClaimService, private auth: AuthService, public modalService: NgbModal) { }

  async ngOnInit() {

    this.selectRow = 'selectRow';
    this.paginationModel.pageSize = await this.claimService.getDefaultPageSize();
    //this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
    this.MaxEditedRecordsCountPreferences = await this.claimService.getMaxEditedRecordsCount();
    // this.dataSource = new MatTableDataSource<Claim>();
    this.dataSource = new MatTableDataSource<any>();
    //await this.getPageSize();
    this.getClaimDataList();
    this.getPageControlsPermissions();
    this.buttonPermission();
  }
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  async applyFilter(filterText: string) {
    this.filterValue = filterText.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    //await this.getPageSize();
    this.getClaimDataList();

  }
  async getPageSize() { 
    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;
    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    this.claimService.GetClaimList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;

      });

    this.paginationModel.pageSize = await this.claimService.getDefaultPageSize();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  ////masterToggle() {
  ////  this.isAllSelected() ?
  ////    this.selection.clear() :
  ////    this.dataSource.data.forEach(row => this.selection.select(row));
  ////}

  selectedvalue(row, checked: boolean) {
    row.IsSelected = checked;
    localStorage.setItem('SelectedClaimId', row.ClaimId);

    if (this.ClaimDetailsList != undefined && this.ClaimDetailsList != null) {
      this.ClaimDetailsList.forEach(irow => {
        if (irow.ClaimId == row.ClaimId) {
          this.selection.toggle(irow);
        }
      });
      const selectedClaims = this.selection.selected.map(({ ClaimId, ClaimFor, ClaimStatus, Title }) => {
        return { ClaimId, ClaimFor, ClaimStatus, Title }
      });

      const selectedClaim = selectedClaims.filter((thing, index, self) => index === self.findIndex((t) => (t.ClaimId === thing.ClaimId)));

      this.SelectedClaimCount = 0;
      this.SelectedClaimCount = selectedClaim.length;

      this.claimService.ClaimforEdit = [];
      this.claimService.ClaimforEdit = selectedClaim;
      //to manage check/Uncheck for cancel order array
      this.selectedClaimIds = [];
      if (selectedClaim.length > 0) {
        var k = 0;
        for (k = 0; k < selectedClaim.length; k++) {
          this.selectedClaimIds.push(selectedClaim[k].ClaimId);
        }

      } else {
      }

    }
  }

  /* onResizeEnd(event: ResizeEvent, columnName): void {
     if (event.edges.right) {
       const cssValue = event.rectangle.width + 'px';
       const columnElts = document.getElementsByClassName('mat-column-' + columnName);
       for (let i = 0; i < columnElts.length; i++) {
         const currentEl = columnElts[i] as HTMLDivElement;
         currentEl.style.width = cssValue;
       }
     }
   }*/

  setDateMMddyyyy(date: Date) {
    date = new Date(date);
    return `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getClaimDataList();
    }
  }

  getClaimDataList() {    
    this.selection.clear();
    this.claimService.ClaimforEdit = [];

    if (!this.isPaggingClick)
      this.paginationModel.filterOn = this.filterValue;

    var ClientId = parseInt(localStorage.clientId);
    this.paginationModel.ClientId = ClientId;
    if (this.isOnLoad)
      this.paginationModel.sortOrder = 'desc';

    this.paginationModel.itemsLength = 0;

    this.claimService.GetClaimList(this.paginationModel)
      .subscribe(result => {
        // this.dataSource.data = [];
        this.isOnLoad = false;
        this.paginationModel.itemsLength = result.recordCount;
        this.ELEMENT_DATA = [];
        result.data.forEach((value, index) => {
          this.ELEMENT_DATA.push({
            ClaimId: value.claimId,
            ClaimStatus: value.claimStatus,
            ClaimFor: value.claimFor,
            BillingEntity: value.billingEntity,
            Customer: (value.claimFor == 'Customer' || value.claimFor == 'Order-AR' || value.claimFor == 'Shipment-AP') ? value.customer : null,
            BusinessPartner: value.claimFor == 'Business Partner' ? value.businessPartner : null,
            InvoicedAmount: value.invoicedAmount,
            ClaimAmount: value.claimAmount,
            ApprovedAmount: value.approvedAmount,
            InvoiceNumber: value.invoiceNumber,
            Claimdate: value.createDateTimeServer != null ? this.setDateMMddyyyy(value.createDateTimeServer) : null,
            ApprovedBy: value.approvedBy,
            Title: value.title
          })
        })
        // this.dataSource.data = this.ELEMENT_DATA;
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        this.ClaimDetailsList = this.ELEMENT_DATA;
      }
      );
  }
  onPaginationEvent(event) {   
    this.isPaggingClick = true;
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getClaimDataList();

    //this.paginationModel.filterOn = this.filterValue;
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
    //  this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    //}
    //else {
    //  this.paginationModel.pageSize = event.pageSize;
    //}
    //this.getClaimDataList();
    //this.paginationModel.pageSize = event.pageSize;
  }

  getPageControlsPermissions() {
    var ModuleRoleCode = "Claim.ViewClaimList";
    var ClientId = this.auth.currentUserValue.ClientId;
    var LoginId = this.auth.currentUserValue.LoginId;
    this.claimService.getPageControlsPermissions(ModuleRoleCode, ClientId, LoginId)
      .subscribe(res => {
        if (res.Message == "Success") {
          this.ControlPermissions = res.Data;


          var isClaimPermission = this.ControlPermissions.filter((x) => x.ModuleRoleCode.includes("Claim.ViewClaimList"));
          if (isClaimPermission != null && isClaimPermission != undefined) {
            if (isClaimPermission.length > 0) {
              if ((isClaimPermission[0].PermissionType.toLowerCase() == "read and modify") || (isClaimPermission[0].PermissionType.toLowerCase() == "read only")) {
                //Show Claim Grid
                this.isClaimShow = true;
              } else {
                //Hide Claim Grid 
                this.isClaimShow = false;
              }
            }
          }
          if (isClaimPermission.length == 0) {
            this.isClaimShow = false;
          }
        }
      });
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.auth.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.auth.currentUserValue.UserId;
    this.auth.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all

          if (data != null || data != undefined) {
            var isReadAndModify = false;
            data.forEach(irow => {
              if (irow.PermissionType == "Read and Modify") {
                isReadAndModify = true;
              }
            });

            if (isReadAndModify) {
              // this.orderWorkbenchHasReadOnlyAccess = false;
              this.buttonBar.enableAction('delete');
              this.buttonBar.enableAction('issue');
            }
            else {
              //this.orderWorkbenchHasReadOnlyAccess = true;
              this.buttonBar.disableAction('delete');
              this.buttonBar.disableAction('issue');
            }
          }
          else {
            this.router.navigate(['/unauthorized']);
          }
        }
        else {
          this.router.navigate(['/unauthorized']);
        }
      });
  }

  DeleteClaims() {

    if (this.selection.selected.length > 0) {
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.selection.selected.forEach(item => {
          let index: number = this.dataSource.data.findIndex(d => d === item);
          if (index != -1) {
            this.SelectedRecords.push(this.dataSource.data[index].ClaimId);
          }
        });
        var RequestObject = {
          UserId: this.auth.currentUserValue.UserId,
          ClientID: this.auth.currentUserValue.ClientId,
          SelectedRecords: this.SelectedRecords
        };
        this.claimService.DeleteClaimRecords(this.auth.currentUserValue.UserId, this.auth.currentUserValue.ClientId, this.SelectedRecords)
          .subscribe(result => {
            if (result.data == true && result.message == "Success") {
              this.getClaimDataList();
              this.selection.clear();
            }
          }
          );
      }, (reason) => {
      });
    }



  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.IsSelected = true;
        // this.ItemList.push(row);
        const selectedClaims = this.selection.selected.map(({ ClaimId, ClaimFor, ClaimStatus, Title }) => {
          return { ClaimId, ClaimFor, ClaimStatus, Title }
        });

        const selectedClaim = selectedClaims.filter((thing, index, self) => index === self.findIndex((t) => (t.ClaimId === thing.ClaimId)));

        this.SelectedClaimCount = 0;
        this.SelectedClaimCount = selectedClaim.length;

        this.claimService.ClaimforEdit = [];
        this.claimService.ClaimforEdit = selectedClaim;
        //to manage check/Uncheck
        this.selectedClaimIds = [];
        if (selectedClaim.length > 0) {
          var k = 0;
          for (k = 0; k < selectedClaim.length; k++) {
            this.selectedClaimIds.push(selectedClaim[k].ClaimId);
          }

        } else {
        }

        this.checkBoxClick.emit(this.selection.selected);
      });
  }
}








