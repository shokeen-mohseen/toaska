import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-atp-order-filter',
  templateUrl: './atp-order-filter.component.html',
  styleUrls: ['./atp-order-filter.component.css']
})
export class AtpOrderFilterComponent implements OnInit {
    date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  panelOpenState = false;
  constructor() { }

  itemListA = [];

  selectedItemsA = [];
  settingsA = {};

  count = 3;
  selectRow: any;
  ngOnInit(): void {
    this.selectRow = 'selectRow';
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
}
