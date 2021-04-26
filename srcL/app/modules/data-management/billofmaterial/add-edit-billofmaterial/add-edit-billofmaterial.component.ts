import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-add-edit-billofmaterial',
  templateUrl: './add-edit-billofmaterial.component.html',
  styleUrls: ['./add-edit-billofmaterial.component.css']
})
export class AddEditBillofmaterialComponent implements OnInit {

  public dateFormat1: String = "MM-dd-yyyy HH:mm a";  
  public date: Date = new Date("12/11/2017 1:00 AM");
  @Input() addPage: boolean;
  @Input() editPage: boolean;
  public exampleData: any;
  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal) { }

  itemListA = [];

  selectedItemsA = [];
  settingsA = {};
  count = 3;

  ngOnInit(): void {
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];



    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };



  }
  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }


  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;





  //openRole() {
  //  this.modalRef = this.modalService.open(AddEditRoleComponent, { size: 'lg', backdrop: 'static' });
  //}

}
