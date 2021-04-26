import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fpstimeline',
  templateUrl: './fpstimeline.component.html',
  styleUrls: ['./fpstimeline.component.css']
})
export class FPSTimelineComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date();

  itemListB = [];
  settingsB = {};
  selectedItemsB = [];


  count = 3;
  constructor() { }

  ngOnInit(): void {
    this.itemListB = [
      { "id": 1, "itemName": "Option 1" },
      { "id": 2, "itemName": "Option 2" },
      { "id": 3, "itemName": "Option 3" },
      { "id": 4, "itemName": "Option 4" },
      { "id": 5, "itemName": "Option 5" },
      { "id": 6, "itemName": "Option 6" }
    ];
    this.settingsB = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 3
    };
    // searchable dropdown end
  }

  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) { }
  OnItemDeSelect(item: any) { }
  onSelectAll(items: any) { }
  onDeSelectAll(items: any) { }
}
