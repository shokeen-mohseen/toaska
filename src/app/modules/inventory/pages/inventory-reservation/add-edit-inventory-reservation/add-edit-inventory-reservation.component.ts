import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-add-edit-inventory-reservation',
  templateUrl: './add-edit-inventory-reservation.component.html',
  styleUrls: ['./add-edit-inventory-reservation.component.css']
})
export class AddEditInventoryReservationComponent implements OnInit {

  @Input() addPage: boolean;
  @Input() editPage: boolean;

  public dateFormat: String = "MM-dd-yyyy";

  itemListA = [];
  settingsA = {};
  countA = 3;

  userData = {
    listA: '',
    daterangepicker: '',
    RemainingToReserve: '',
    key_AvailableQuntity: ''
  };

  onSubmit(validForm, userData) {
  }

  constructor() {
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

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

  }

  onAddItem(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
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
