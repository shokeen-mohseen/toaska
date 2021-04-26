import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-mat-tab-with-next-prev',
  templateUrl: './mat-tab-with-next-prev.component.html',
  styleUrls: ['./mat-tab-with-next-prev.component.css']
})
export class MatTabWithNextPrevComponent implements OnInit {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  tab1: boolean = true;
  tab2: boolean = true;
  tab3: boolean = true;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  selectNext(el) {
    el.selectedIndex += 1;
  }
  selectPrev(el) {
    el.selectedIndex -= 1;
  }

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
      // this.tab2Data = false;
      // this.tab3Data = false;
    }
    else if ($event.index === 1) {
      // this.tab1Data = false;
      this.tab2Data = true;
      // this.tab3Data = false;
    }
    else if ($event.index === 2) {
      // this.tab1Data = false;
      // this.tab2Data = false;
      this.tab3Data = true;
    }
  }

  open(action) {
    if (action === 'add') {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tabGroup.selectedIndex = 0;
      this.tab1Data = true;
      this.tab3Data = false;
      this.tab2Data = false;
    } else if (action === 'edit') {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = true;
      this.tabGroup.selectedIndex = 2;
      this.tab3Data = true;
      this.tab2Data = false;
      this.tab1Data = false;
    }
  }


}
