import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-marco-indicator',
  templateUrl: './edit-marco-indicator.component.html',
  styleUrls: ['./edit-marco-indicator.component.css']
})
export class EditMarcoIndicatorComponent implements OnInit {

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
  enableSearchFilter: true,
  addNewItemOnFilter: true,
};
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
