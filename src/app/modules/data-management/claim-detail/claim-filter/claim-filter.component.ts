import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-claim-filter',
  templateUrl: './claim-filter.component.html',
  styleUrls: ['./claim-filter.component.css']
})
export class ClaimFilterComponent implements OnInit {
  panelOpenState = true;
  public dateFormat: String = "MM-dd-yyyy";
  FromshipdatecalendarDate: Date;
  ToshipdatecalendarDate: Date;
  @Output() Fromshipdate: EventEmitter<any> = new EventEmitter();
 
  constructor() { }

  ngOnInit(): void {
    this.FromshipdatecalendarDate = this.setDateMMddyyyy(new Date());
    this.ToshipdatecalendarDate = this.setDateMMddyyyy(new Date());
  }
  setDateMMddyyyy(date: Date) {
    return new Date(`${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`);
  }

  SearchShipDate() {
    if (!!!this.FromshipdatecalendarDate || !!!this.ToshipdatecalendarDate) {
      return;
    }
    var data = {
      FromshipdatecalendarDate: this.FromshipdatecalendarDate,
      ToshipdatecalendarDate: this.ToshipdatecalendarDate
    }
    this.Fromshipdate.emit(data);
  }
}
