//TFSID 16635 add Validation key for translation (Created by Rizwan Khan)
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static outValue: any;
  public static getValidationErrorMessage(validatorName: string, validatorValue?: any, labelName?: string): any {
    this.outValue = '';
    const config = {
      required: `ValiationMessages.key_Required`,
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      maxlength: `ValiationMessages.key_Maxlength`,
      minlength: `ValiationMessages.key_Minlength`,
      min: `ValiationMessages.key_MinValue`,
      max: `ValiationMessages.key_MaxValue`,
      invalidNumber: `ValiationMessages.key_invalidNumber`,
      //pattern: `ValiationMessages.key_pattern`,
      charactersOnly: `ValiationMessages.key_charactersOnly`,
      age: `ValiationMessages.key_age`,
      DateBefore: `ValiationMessages.key_DateBefore`,
      alphanumricwithUnderscoreHypen: `ValiationMessages.key_alphanumricwithUnderscoreHypen`,
    };
    //console.log(validatorValue)
    this.outValue =
        validatorName == 'min' ? validatorValue.min :
        validatorName == 'max' ? validatorValue.max :
        validatorName == 'maxlength' ? validatorValue.requiredLength :
        validatorName == 'minlength' ? validatorValue.requiredLength :
            validatorName == 'pattern' ? (validatorValue.requiredPattern =="^[0-9]*$" ?  'invalidNumber' : '') :
                '';
    console.log(validatorValue.requiredPattern);
    //console.log(validatorName);
    if (validatorName == 'pattern') {
      if (validatorValue.requiredPattern == "^[0-9]*$") {
        validatorName = 'invalidNumber';
        this.outValue = validatorName;
      }

      else if (validatorValue.requiredPattern == "^[A-Z]{1,20}$") { //^[A-Z]{1,20}$
        
        validatorName = 'charactersOnly';
        this.outValue = validatorName;
      }

      else if (validatorValue.requiredPattern == "^[A-Za-z]+$") { //^[A-Z]{1,20}$

        validatorName = 'charactersOnly';
        this.outValue = validatorName;
      }
    }

    console.log(validatorName);
    //console.log(this.outValue + " validation111")
    //console.log(validatorValue.requiredPattern)
    //console.log(validatorName)
    return config[validatorName];
  }

  public static passwordValidator(control: AbstractControl): any {
    if (!control.value) { return; }

    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?!.*\s)          - Spaces are not allowed
    return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/)) ? '' : { invalidPassword: true };
  }

  public static Numeric(control: AbstractControl) {
    let val = control.value;
    if (val === null || val === '') return null;

    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
      
      return { 'invalidNumber': true };
    }

    return null;
  }

  public static AgeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    console.log(control.value )
    if (control.value < 18) {
      return { 'age': true };
    }
    return null;
  }

  public static DOBAgeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value != "") {
      if (moment().diff(control.value, 'years') < 18) {
        
        return { 'age': true };
      }
    }
    return null;
  }


  public static DateBeforeToday(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value != "") {

      if (moment().diff(control.value) >= 0)
        return null;
      else
        return { 'DateBefore': true };

      return null;
      //  console.log(moment(control.value).isBefore(moment(), "day"))
      //  if (!moment(control.value).isBefore(moment(), "day")) {

      //    return { 'DateBefore': true };
      //  }
      //}
      //return null;
    }
  }


  public static AlphanumericWithHypenUnderscore(control: AbstractControl) {
    let val = control.value;
    if (val === null || val === '') return null;

    if (!val.toString().match(/^[\w-]+$/)) {

      return { 'alphanumricwithUnderscoreHypen': true };
    }

    return null;
  }

  public static AlphabetsOnly(control: AbstractControl) {
    let val = control.value;
    if (val === null || val === '') return null;

    if (!val.toString().match(/^[a-zA-Z]*$/)) {

      return { 'charactersOnly': true };
    }

    return null;
  }

  public static Alphanumeric(control: AbstractControl) {
    let val = control.value;
    if (val === null || val === '') return null;

    if (!val.toString().match(/^[0-9a-zA-Z]+$/)) {

      return { 'invalidNumber': true };
    }

    return null;
  }
}
