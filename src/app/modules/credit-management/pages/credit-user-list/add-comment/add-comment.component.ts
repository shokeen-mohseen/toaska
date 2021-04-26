import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderNumberDetailsComponent } from '../order-number-details/order-number-details.component';
import { CreditManagementService } from '../../../../../core/services/CreditManagement.service';
import { CreditSummaryCM, OrderDetailsCM } from '../../../../../core/models/creditManagementOrder.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})

export class AddCommentComponent implements OnInit {
  @Input("orderId") orderId: number;
  @Output("commentStatus") commentStatus = new EventEmitter<string>();
  orderComments: any;
  paginationModel = new OrderDetailsCM();
  @Input() Inactive: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private CreditManagementService: CreditManagementService,
    private toastrService: ToastrService
  ) {}

  getComment() {
    this.paginationModel.Id = this.orderId;
  //  this.paginationModel.Id = this.orderId;
    this.paginationModel.CreditAlertComment = this.orderComments;
    this.saveComment();
    this.activeModal.dismiss('Cross click');
  }

  ngOnInit(): void {
  }
  

  saveComment() {
    this.CreditManagementService.saveComment(this.paginationModel).
      subscribe(res => {
        if (res.message == "Success") {
          this.commentStatus.emit(this.orderComments);
          this.toastrService.success("Comment has been saved");
          //  
        }       

      });

  }

}
