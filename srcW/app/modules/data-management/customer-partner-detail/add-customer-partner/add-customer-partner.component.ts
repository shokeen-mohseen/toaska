import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { AddEditCharacteristicsComponent } from '../add-edit-characteristics/add-edit-characteristics.component';

@Component({
  selector: 'app-add-customer-partner',
  templateUrl: './add-customer-partner.component.html',
  styleUrls: ['./add-customer-partner.component.css']
})
export class AddCustomerPartnerComponent implements OnInit {

  modalRef: NgbModalRef;
  constructor(public router: Router, public modalService: NgbModal) { }



  itemListA = [];
  itemListB = [];
  itemListC = [];
  itemListD = [];

  //selectedItemsA = [];
  settingsA = {};

  //selectedItemsB = [];
  settingsB = {};

  selectedItemsC = [];
  settingsC = {};

  selectedItemsD = [];
  settingsD = {};

  countA = 3;
  countB = 3;
  countD = 3;
  count = 3;

  userData = {
    listA: '',
    listB: ''
  };


  onSubmit(validForm, userData) {
  }

  ngOnInit(): void {
    this.itemListA = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListC = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];

    this.itemListD = [
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
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.settingsC = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };
    this.settingsD = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

  }
  onAddItem(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
    this.countB++;
    this.itemListB.push({ "id": this.countB, "itemName": data });

    //this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemC(data: string) {
    this.count++;
    this.itemListC.push({ "id": this.count, "itemName": data });
    this.selectedItemsC.push({ "id": this.count, "itemName": data });
  }
  onAddItemD(data: string) {
    this.count++;
    this.itemListD.push({ "id": this.count, "itemName": data });
    this.selectedItemsD.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.userData);
    //console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.userData);
    //console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  openCharacteristics() {
    this.modalRef = this.modalService.open(AddEditCharacteristicsComponent, { size: 'lg', backdrop: 'static' });
  }

}
