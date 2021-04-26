import { Injectable } from '@angular/core';
import { ContractFullDetails, ContractViewModel } from '../models/contract.model';
import { BehaviorSubject, of, observable } from 'rxjs';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})



export class ContractCommonDataService
{
  private _initialContractData: ContractFullDetails;
  private _finalContractData: ContractFullDetails;

  private startdate: Date;
  private enddate: Date;

  private _editContractList: ContractViewModel[] = [];


  get EditContractList(): ContractViewModel[] {

    return this._editContractList;
  }

  set EditContractList(value: ContractViewModel[] ) {
    this._editContractList = value;
  }

  get InitialContract(): ContractFullDetails {

    return this._initialContractData;
  }

  set InitialContract(value) {
    this._initialContractData = value;
  }

  get FinalContractData(): ContractFullDetails {

    return this._finalContractData;
  }

  set FinalContractData(value) {
    this._finalContractData = value;
  }


  get ContractStartDate(): Date {
    return this.startdate;
  }

  set ContractStartDate(value) {
     this.startdate = value;
  }

  get ContractEndDate(): Date {
    return this.enddate;
  }

  set ContractEndDate(value) {
    this.enddate = value;
  }


  constructor() {

  }

  convertDatetoStringDate(selectedDate: Date) {

    try {
      if (selectedDate == undefined || selectedDate == null || selectedDate.getFullYear() < 1950)
        return "";

      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();
    }
    catch (e) {

      var selectedDateConvert = new Date(selectedDate);
      var dateOther = selectedDateConvert.getDate();
      var monthOther = selectedDateConvert.getMonth() + 1;
      var yearOther = selectedDateConvert.getFullYear();

      var hoursOther = selectedDateConvert.getHours();
      var minutsOther = selectedDateConvert.getMinutes();
      var secondsOther = selectedDateConvert.getSeconds();

      return yearOther.toString() + "-" + monthOther.toString() + "-" + dateOther.toString() + " " + hoursOther.toString() + ":" + minutsOther.toString() + ":" + secondsOther.toString();
    }

  }

  convertDatetoStringDateWithoutTime(selectedDate: Date) {

    try {
      if (selectedDate == undefined || selectedDate == null || selectedDate.getFullYear() < 1950)
        return "";

      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

     

      return year.toString() + "-" + month.toString() + "-" + date.toString() + " 0:0:0";
    }
    catch (e) {

      var selectedDateConvert = new Date(selectedDate);
      var dateOther = selectedDateConvert.getDate();
      var monthOther = selectedDateConvert.getMonth() + 1;
      var yearOther = selectedDateConvert.getFullYear();

      
      return yearOther.toString() + "-" + monthOther.toString() + "-" + dateOther.toString() + " 0:0:0";
    }

  }

  
}
