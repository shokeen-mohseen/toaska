// TFS ID 16635 this is also use to validate filed (Created by Rizwan Khan )
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss']
})
export class ControlMessagesComponent {
  @Input()
  public control: FormControl;
  @Input()
  public labelName?: string;

  
  constructor() {}
  // this get property is use to return min, max, minlength, maxlength value of field 

  get validateValue() {

    return { value: ValidationService.outValue};
  }

  get errorMessage(): boolean {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
    
        return ValidationService.getValidationErrorMessage(
          propertyName,
          this.control.errors[propertyName],
          this.labelName,
        );
      }
    }

    return undefined;
  }
}
