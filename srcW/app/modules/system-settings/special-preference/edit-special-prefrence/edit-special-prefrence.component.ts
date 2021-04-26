import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-special-prefrence',
  templateUrl: './edit-special-prefrence.component.html',
  styleUrls: ['./edit-special-prefrence.component.css']
})
export class EditSpecialPrefrenceComponent implements OnInit {

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  countA = 6;

  itemListB = [];
  selectedItemsB = [];
  settingsB = {};
  countB = 6;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.itemListA = [
      { "id": 1, "itemName": "Yes" },
      { "id": 2, "itemName": "No" }
    ];

    this.itemListB = [
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
      addNewItemOnFilter: true,
      //disabled: true
    };

    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      //disabled: true
    };

  }
  onAddItem(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
    this.selectedItemsA.push({ "id": this.countA, "itemName": data });
    this.itemListB.push({ "id": this.countB, "itemName": data });
    this.selectedItemsB.push({ "id": this.countB, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsA);
    console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}

