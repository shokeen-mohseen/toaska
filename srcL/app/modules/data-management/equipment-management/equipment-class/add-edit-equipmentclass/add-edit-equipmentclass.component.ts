import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-edit-equipmentclass',
  templateUrl: './add-edit-equipmentclass.component.html',
  styleUrls: ['./add-edit-equipmentclass.component.css']
})
export class AddEditEquipmentclassComponent implements OnInit {
  @Input() addPage: boolean;
  @Input() editPage: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
