import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import bsCustomFileInput from 'bs-custom-file-input';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  public exampleData1: Array<Select2OptionData>;
  public value: string;
  public placeholder = 'Please Select';
  public exampleData: any[];
  public options: Options;

  ngOnInit(): void {

    bsCustomFileInput.init();

    this.exampleData1 = [
      {
        id: '1',
        text: 'Pallets'
      },
      {
        id: '2',
        text: 'Positions'
      },
      {
        id: '3',
        text: 'Month'
      },
      {
        id: '4',
        text: 'Stack'
      }
    ];

    this.exampleData = [
      {
        id: '1',
        custom: { en: '52700-08-01' }
      },
      {
        id: '2',
        custom: { en: 'AK-BULK' }
      },
      {
        id: '3',
        custom: { en: 'AK-BULK-FIN' }
      }
    ];
    this.options = {
      multiple: true,
      theme: 'classic',
      closeOnSelect: false,
      width: '300',
      templateSelection: (object: any) => {
        return object && object.custom && object.custom.en;
      },
      templateResult: (object: any) => {
        return object && object.custom && object.custom.en;
      }
    };

  }

}
