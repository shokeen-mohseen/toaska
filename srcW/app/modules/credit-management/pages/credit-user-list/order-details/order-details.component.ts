import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { OrderNumberDetailsComponent } from '../order-number-details/order-number-details.component';
import { ResizeEvent } from 'angular-resizable-element';
//import { OrderDetailsCM } from '../../../../../core/models/creditManagementOrder.model';

import { CreditManagementService  } from '../../../../../core/services/CreditManagement.service';
import { AuthService } from '../../../../../core';
import { CreditSummaryCM, OrderDetailsCM } from '../../../../../core/models/creditManagementOrder.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderItem = [];
  selectRow: any;
  overrideCreditLimit: any;
  comment: any;
  orderNumber: any;
  @Input() selectedOrder = [];
  EntityID: number;
  UserAlertID: number;
  filterValue = "";
  paginationModel = new OrderDetailsCM();
  creditOR = [];
  creditORArray: OrderDetailsCM[] = [];
  comStatus: boolean;
  
  modalRef: NgbModalRef;

  constructor(
    public modalService: NgbModal,
    private CreditManagementService: CreditManagementService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  applyFilter(filterText: string) {
    debugger;
    this.filterValue = filterText.trim(); // Remove whitespace
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    this.getOrderList();
  }

  customSort(event) {
    this.paginationModel.sortColumn = event.active;
    this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
    this.getOrderList();
  }

  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getOrderList();
    }

  }

  //OrderDetailsCM: any = {
  //  //IsMass: 1 TO fix this value
  //  OrgnizationID: null
  //};

  displayedColumns = ['orderDate', 'orderNumber', 'shipToAddress', 'deliveryDate', 'orderStatus',
    'availableCreditLimit', 'orderAmount', 'remainingcredit', 'overrideCreditLimit', 'comment'];
  displayedColumnsReplace = ['key_OrderDate', 'key_OrderNumber', 'key_ShipToLocationSpace', 'key_DeliveryDate',
    'key_OrderStatus', 'key_AvailableCreditLimit', 'key_OrderAmount', 'key_Remainingcredit', 'key_OverrideCreditLimit', 'key_Comment'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
 


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notify() {
    for (var i = 0; i < this.orderItem.length; i++) {
      if (this.orderItem[i].overrideCreditLimit == true) {
        this.creditOR.push(this.orderItem[i]);
        
      }

    }
    debugger;
   // this.creditORArray = OrderDetailsCM[this.creditOR.length];
    for (var i = 0; i < this.creditOR.length; i++) {
      this.creditORArray.push(this.creditOR[i]);
      //console.log(this.creditOR[i].orderId);
    }
    
   // console.log(this.creditORArray);
    console.log("inside user notification");
    console.log(this.creditORArray);
    var UserId = this.authService.currentUserValue.UserId;
    var ClientId = this.authService.currentUserValue.ClientId;
   // this.Alert(UserId, ClientId);
    
  }

  setOverRideCreditLimit() {
    this.CreditManagementService.setOverRideCreditLimit(this.paginationModel.Id).
      subscribe(res => {
        if (res.message == "Success") {
          this.getOrderList();
            this.toastrService.success("Credit override limit has been updated");
            //  
          }
          else {
            this.toastrService.success("Error");
          }
        
      });
    
  }

  Alert(UserId, Client) {

    let ClientId = null;
    let Name = "CreditManagement";

    // let entityId: number;
    this.CreditManagementService.getEntityDetails(ClientId, Name).subscribe(res => {
      if (res.message == "Success") {
        this.EntityID = res.data.id;
        // alert(res.data.id);
        Name = "Credit Override Approval";
        this.CreditManagementService.getUserAlertDetails(ClientId, Name).subscribe(result => {
          if (result.message == "Success") {
            this.UserAlertID = result.data.id;
            let EntityKeyId = UserId;

            this.CreditManagementService.SaveAlertSystem(this.UserAlertID, this.EntityID, EntityKeyId, Client).subscribe(res => {
              if (res.message == "Success") {
                
                this.toastrService.success("User has been notified about credit override limit");
              //  
              }
              else {
                this.toastrService.success("Error");
              }
            });
          }
          else {
            this.UserAlertID = 0;
          }
        });
      }
      else {
        this.EntityID = 0;
      }
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
  ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;

  }
  //ngAfterViewInit() {
  //  this.dataSource.paginator = this.paginator;
  //  this.dataSource.sort = this.sort;
  //}

  //applyFilter(filterValue: string) {
  //  filterValue = filterValue.trim(); // Remove whitespace
  //  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //  this.dataSource.filter = filterValue;
  //}

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

  


  async ngOnInit() {
   
    var orgID = this.selectedOrder[0].id;
    // this.OrderDetailsCM.OrgnizationID = orgID;
    this.paginationModel.OrganizationID = orgID;
    this.paginationModel.IsMass = 0;

    this.selectRow = 'selectRow';
   // this.dataSource = new MatTableDataSource<OrderDetailsCM>();
    await this.getPageSize();
    this.orderNumber = 'orderNumber';
    this.overrideCreditLimit = 'overrideCreditLimit';
    this.comment = 'comment';
    this.getOrderList();
  }

  async getPageSize() {
    this.CreditManagementService.getOrderList(this.paginationModel)
      .subscribe(result => {
        this.paginationModel.itemsLength = result.recordCount;
      }
      );
    // default page size
    this.paginationModel.pageSize = await this.CreditManagementService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
  }

  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getOrderList();
  }


  //ngOnInit(): void {
    
  //  var orgID = this.selectedOrder[0].id;
  //  this.OrderDetailsCM = { OrgnizationID: orgID };
  //  this.selectRow = 'selectRow';
  //  this.orderNumber = 'orderNumber';
  //  this.overrideCreditLimit = 'overrideCreditLimit';
  //  this.comment = 'comment';
    
  //  this.getOrderList();
    
  //}

  switchUI(event, row) {
    console.log("Inside switch event");
  //  console.log(rc);
    for (var i = 0; i < this.orderItem.length; i++) {
      if (this.orderItem[i].Id == row.Id) {
        this.orderItem[i].overrideCreditLimit = event;
        this.orderItem[i].OverrideCreditHold = event;

        this.paginationModel = row;
        this.setOverRideCreditLimit();
      }
    }

  }
  getOrderList() {
    this.CreditManagementService.getOrderDetails(this.paginationModel).
      subscribe(result => {
        this.dataSource.data = result;
        this.orderItem = result;
        console.log("result data");
        console.log(this.orderItem);
      });
    console.log("datasource data");
    console.log(this.dataSource.data);
 }
  

  openPopup(action = '', row) {
    debugger;
    if (action === "orderNumberDetails") {
      alert(this.modalRef.componentInstance.commentStatus);
      this.modalRef = this.modalService.open(OrderNumberDetailsComponent, { size: 'xl', backdrop: 'static' });
    } else if (action === "addComment") {
      this.modalRef = this.modalService.open(AddCommentComponent, { size: 'md', backdrop: 'static' });
      this.modalRef.componentInstance.orderId = row.Id;
      this.modalRef.componentInstance.commentStatus.subscribe((receivedEntry) => {
      this.comStatus = receivedEntry;
      });
      //this.modalRef.result.then((result) => {
      //  if (result) {
      //    console.log("inside popup");
      //    console.log(result);
      //  }
      //});
    }
  }

}

export interface PeriodicElement {
  orderDate: string;
  orderNumber: string;
  shipToAddress: string;
  deliveryDate: string;
  orderStatus: string;
  availableCreditLimit: string;
  orderAmount: string;
  remainingcredit: string;
  overrideCreditLimit: string;
  comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  ];
