import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addnew-charge',
  templateUrl: './addnew-charge.component.html',
  styleUrls: ['./addnew-charge.component.css']
})
export class AddnewChargeComponent implements OnInit {
  itemList = [];
  itemList2 = [];
  itemList3 = [];
  selectedItems = [];
  selectedItems2 = [];
  selectedItems3 = [];
  settings = {};
  count = 6;
  constructor() { }

  ngOnInit(): void {
    this.itemList = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];
    this.itemList2 = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];
    this.itemList3 = [
      { "id": 1, "itemName": "option 1" },
      { "id": 2, "itemName": "option 2" },
      { "id": 3, "itemName": "option 3" }
    ];

    this.settings = {
      singleSelection: true,
      text: "Select",
      //enableCheckAll: true,
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchBy: ['itemName']
      //addNewItemOnFilter: true,
      //disabled: true
    };
  }
  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.itemList2.push({ "id": this.count, "itemName": data });
    this.itemList3.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
    this.selectedItems2.push({ "id": this.count, "itemName": data });
    this.selectedItems3.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  selectNext(el) {
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }

}
