import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentModel } from '../../../../../core/models/inventory.model';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  @Input() public data;
  comment = new CommentModel()
  constructor(
    public activeModal: NgbActiveModal,
    private inventoryService: InventoryService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.bindComment();
  }

  bindComment() {
    this.comment.id = this.data.id;
    this.comment.comment = this.data.comment;
  }

  saveComment() {
    this.inventoryService.saveComment(this.comment).subscribe(result => {
      if (result.data == false) {
        this.toastrService.warning('Somthing Went Wrong.');
        this.close();
      }
      else {
        this.toastrService.success('Updated successfully');
        this.close();
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
