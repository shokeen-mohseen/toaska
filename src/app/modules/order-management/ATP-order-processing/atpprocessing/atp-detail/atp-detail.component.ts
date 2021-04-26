import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-atp-detail',
  templateUrl: './atp-detail.component.html',
  styleUrls: ['./atp-detail.component.css']
})
export class AtpDetailComponent implements OnInit {

  itemListA = [];
  selectedItemsA = [];
  settingsA = {};
  count = 3;

  ngOnInit(): void {
   
    this.itemListA = [
      { "id": 1, "itemName": "Locked" },
      { "id": 2, "itemName": "Unlocked" },     
    ];

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
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
