import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /** check if given string is a valid email */
  isEmail(value: string) {
    let input = document.createElement('input');

    input.type = 'email';
    input.required = true;
    input.value = value;

    return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);

  }

  /** check if given string is a valid GUID */
  isGuid(value: string) {

  }

  /** check if argument value is a string */
  isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  /** check if argument value is a number */
  isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  /** check if argument value is an array */
  isArray(value) {
    return Array.isArray(value);
  }

  /** check if argument value is an object */
  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  /** check if a value is null */
  isNull(value) {
    return value === null;
  }

  /** check if a value is undefined */
  isUndefined(value) {
    return typeof value === 'undefined';
  }

  /** check if value is a boolean */
  isBoolean(value) {
    return typeof value === 'boolean';
  }
}
