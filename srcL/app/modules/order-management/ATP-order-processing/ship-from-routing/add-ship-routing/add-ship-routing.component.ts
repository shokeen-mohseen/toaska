import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-add-ship-routing',
  templateUrl: './add-ship-routing.component.html',
  styleUrls: ['./add-ship-routing.component.css']
})
export class AddShipRoutingComponent implements OnInit {



  modalRef: NgbModalRef;
  constructor(private router: Router, public modalService: NgbModal) { }


  itemListA = [];
  //selectedItemsA = [];
  settingsA = {};
  countA = 3;

  itemListB = [];
  //selectedItemsA = [];
  settingsB = {};
  countB = 3;

  userData = {
    listA: '',
    listB: ''
  };

  onSubmit(validForm, userData) {
  }

  ngOnInit(): void {

    this.itemListA = [
      { "id": 1, "itemName": "Carrier" },
      { "id": 2, "itemName": "Collection" },
      { "id": 3, "itemName": "Other" }
    ];
    this.itemListB = [
      { "id": 1, "itemName": "Carrier" },
      { "id": 2, "itemName": "Collection" },
      { "id": 3, "itemName": "Other" }
    ];

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }
  onAddItem(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
    //this.selectedItemsA.push({ "id": this.countA, "itemName": data });
  }
  onAddItemB(data: string) {
    this.countB++;
    this.itemListB.push({ "id": this.countB, "itemName": data });
    //this.selectedItemsA.push({ "id": this.countA, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.userData);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.userData);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }


}
