import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {

  itemList = [];
  itemList2 = [];
  itemList3 = [];

  selectedItems = [];
  settings = {};
  count = 6;

  selectedItems2 = [];

  selectedItems3 = [];

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "Asset Recovery" },
      { "id": 2, "itemName": "Collection" },
      { "id": 3, "itemName": "Manufacturer" },
      { "id": 4, "itemName": "Processor" },
      { "id": 5, "itemName": "Rail Depot" },
      { "id": 6, "itemName": "Retail DC" }
    ];

    this.itemList2 = [
      { "id": 1, "itemName": "Asset Recovery" },
      { "id": 2, "itemName": "Collection" },
      { "id": 3, "itemName": "Manufacturer" },
      { "id": 4, "itemName": "Processor" },
      { "id": 5, "itemName": "Rail Depot" },
      { "id": 6, "itemName": "Retail DC" }
    ];

    this.itemList3 = [
      { "id": 1, "itemName": "Asset Recovery" },
      { "id": 2, "itemName": "Collection" },
      { "id": 3, "itemName": "Manufacturer" },
      { "id": 4, "itemName": "Processor" },
      { "id": 5, "itemName": "Rail Depot" },
      { "id": 6, "itemName": "Retail DC" }
    ];

    this.settings = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      disabled: true
    };

  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.itemList2.push({ "id": this.count, "itemName": data });
    this.selectedItems2.push({ "id": this.count, "itemName": data });
    this.itemList3.push({ "id": this.count, "itemName": data });
    this.selectedItems3.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    console.log(this.selectedItems2);
    console.log(this.selectedItems3);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    console.log(this.selectedItems2);
    console.log(this.selectedItems3);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
