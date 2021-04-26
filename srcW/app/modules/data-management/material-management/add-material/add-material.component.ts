import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {
  public definechar: boolean = false;
  public mapforecast: boolean = false;
  public mapinvestor: boolean = false;
  itemList = [];
  selectedItems = [];
  settings = {};
  count = 6;

  constructor() { }

  ngOnInit(): void {
    this.itemList = [
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
      //addNewItemOnFilter: true,
      //disabled: true
    };
  }
  selectNext(el) {
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }
  openAccordion(action = "") {
    if (action === "definechar") {
      this.definechar = !this.definechar;
    }
    else if (action === "mapforecast") {
      this.mapforecast = !this.mapforecast;
    }
    else if (action === "mapinvestor") {
      this.mapinvestor = !this.mapinvestor;
    }
  }

  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
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

}
