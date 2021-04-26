import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderHistoryService } from '../../../../../core/services/order-history.service';
import { OrderManagementService } from '../../../../../core/services/order-management.service';



@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent implements OnInit {

  constructor(private orderHistoryService: OrderHistoryService, private orderManagementService: OrderManagementService) { }
  @ViewChild(OrderDetailComponent) public OrderDetailComponent: OrderDetailComponent;
  OrderCommentData: any = {};
  currentItem: any;
  currentItems: any;
  OrderforEdit: any[] = [];
  SelectedOrderId: number = 0;
  SelectedOrderIdTemp: number = 0;
  IsLeftList: boolean = true;
  CurrentEditListItemIndex: number = 0;
  ngOnInit(): void {   

    
    if (this.orderManagementService.SalesOrderforEdit != undefined && this.orderManagementService.SalesOrderforEdit.length > 0) {
      //
      this.OrderforEdit = this.orderManagementService.SalesOrderforEdit;
      if (this.OrderforEdit.length > 0) {
       // debugger
        this.SelectedOrderId = this.OrderforEdit[0].OrderId;
        this.SelectedOrderIdTemp = this.OrderforEdit[0].OrderId;

        this.BindOrderDetails(this.SelectedOrderId);


        //this.Allsettngsetupdisabled();


      }
    }

  }
  
  BindOrderDetails(OrderID) {    
    this.SelectedOrderId = OrderID   
    this.SelectedOrderIdTemp = OrderID;
    this.currentItem = Number(OrderID);
    this.currentItems = Number(OrderID);

  }
  RemoveSalesOrder(OrderId) {
    this.OrderforEdit.splice(this.OrderforEdit.findIndex(x => x.OrderId === Number(OrderId)), 1);

  }
  GetCommentData(Data: any) {
    
    this.OrderCommentData = Data;
    //this.OrderDetailComponent.GetData();
  }

  SelectNextClaimForEdit() {    
    this.CurrentEditListItemIndex = this.OrderforEdit.findIndex(x => x.OrderId == this.SelectedOrderId);
    if (this.CurrentEditListItemIndex >= 0) {
      if (this.OrderforEdit.length - 1 > this.CurrentEditListItemIndex) {
        this.CurrentEditListItemIndex = this.CurrentEditListItemIndex + 1;
        this.SelectedOrderId = this.OrderforEdit[this.CurrentEditListItemIndex].OrderId;
        this.SelectedOrderIdTemp = this.OrderforEdit[this.CurrentEditListItemIndex].OrderId;

        

        this.BindOrderDetails(this.SelectedOrderId);
      }

    }
  }
}
