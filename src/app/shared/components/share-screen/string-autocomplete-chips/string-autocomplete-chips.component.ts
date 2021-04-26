import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ValidationService } from '../validation.service';

type validationOptions = 'email' | 'e-mail';

@Component({
  selector: 'string-autocomplete-chips',
  templateUrl: './string-autocomplete-chips.component.html',
  styleUrls: ['./string-autocomplete-chips.component.css']
})
export class StringAutocompleteChipsComponent {
  @Input()
  set autoCompleteData(value: Array<any>) {
    this.allValues = value;
  }

  @Input()
  set selectedValues(value: Array<any>) {
    this.values = value;
  }

  @Input() validation: validationOptions;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  valueCtrl = new FormControl();
  filteredValues: Observable<string[]>;
  values: Array<any> = [];
  allValues: Array<any> = [];

  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public _validation: ValidationService) {
    this.filteredValues = this.valueCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => this._filter(value)));
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      let valid = false;

      switch (this.validation) {
        case 'email':
          if (this._validation.isEmail(value)) {
            valid = true;
          } else {
            console.log('invalid email');
          }
          break;

        default:
          valid = true;
          break;
      }

      if ((value || '').trim() && this.values.findIndex(v => v === value) === -1 && valid) {
        this.values.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.valueCtrl.setValue(null);
    }
  }

  remove(value: string): void {
    const index = this.values.indexOf(value);

    if (index >= 0) {
      this.values.splice(index, 1);
    }
  }

  /** runs when selecting an option from the auto complete */
  selected(event: MatAutocompleteSelectedEvent): void {
    /** only add the value if it does not exist from before */
    if (this.values.findIndex(v => v === event.option.viewValue) === -1) {
      this.values.push(event.option.viewValue);
      this.valueInput.nativeElement.value = '';
      this.valueCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : value;

    return this.allValues.filter(
      value => filterValue && value.toLowerCase().includes(filterValue) && this.values.findIndex(v => v.toLowerCase() === value.toLowerCase()) === -1);
  }

}
