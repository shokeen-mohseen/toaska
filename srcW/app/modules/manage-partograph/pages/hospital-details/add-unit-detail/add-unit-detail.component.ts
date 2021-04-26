import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-unit-detail',
  templateUrl: './add-unit-detail.component.html',
  styleUrls: ['./add-unit-detail.component.css']
})
export class AddUnitDetailComponent implements OnInit {
  modalRef: NgbModalRef;
  constructor(private router: Router, public activeModal: NgbActiveModal) { }

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

}
