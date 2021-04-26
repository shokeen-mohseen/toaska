import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { User, AuthService } from '../../../../../core';
import { CommonModel, InventoryModel } from '../../../../../core/models/inventory.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {
  
  selectedInventory = new InventoryModel();
  @Input() public data;
  commonModel = new CommonModel();
  currentUser: User;
  constructor(
    private inventoryService: InventoryService,
    private toastrService: ToastrService,
    private authenticationService: AuthService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    this.commonModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.setEditInventory();    
  }
  onAddItem(data: string) {
  }
  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  setEditInventory() {
    this.selectedInventory = Object.assign({}, this.data);
  }

  updateInventory() {    
    this.inventoryService.updateInventory(this.selectedInventory).subscribe(result => {
      if (result.data == false) {
        this.toastrService.warning('An error occurred. Please contact Tech Support.');
      }
      else {
        this.toastrService.success('Record updated successfully.');
        this.close();
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
