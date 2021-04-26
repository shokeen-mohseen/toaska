import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { InvoiceReportComponent } from '../invoice-report/invoice-report.component';

@Component({
  selector: 'app-invoice-body',
  templateUrl: './invoice-body.component.html',
  styleUrls: ['./invoice-body.component.css']
})
export class InvoiceBodyComponent implements OnInit {

  @Input() selectedOrder = [];
  selectedRecord : number;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;
  tab4Data: boolean = false;
  tab5Data: boolean = false;
  tab6Data: boolean = false;

  @ViewChild(InvoiceReportComponent) tabDisplay: InvoiceReportComponent;
  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
      this.tabDisplay.bindTab('')
    }
    else if ($event.index === 1) {
      this.tab2Data = true;
      this.tabDisplay.bindTab("1to9")
    }
    else if ($event.index === 2) {
      this.tab3Data = true;
      this.tabDisplay.bindTab("10to30")
    }
    else if ($event.index === 3) {
      this.tab4Data = true;
      this.tabDisplay.bindTab("31to60")
    }
    else if ($event.index === 4) {
      this.tab5Data = true;
      this.tabDisplay.bindTab("61to90")
    }
    else if ($event.index === 5) {
      this.tab6Data = true;
      this.tabDisplay.bindTab("90Above")
    }
  }

  constructor() { }

  ngOnInit(): void {
    
    this.selectedRecord = this.selectedOrder[0].id;
   // var orgID = this.selectedOrder[0].id;

  }

}
