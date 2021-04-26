import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
 
@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements OnInit {
  //clearvalue: boolean;
  @Output("filterOn") filterOn = new EventEmitter<string>();
  @Output("fvalue") fvalue = new EventEmitter<string>();
  @Input('fvalue') clearvalue: boolean;
  pills: string[] = [];
  value: string;

  isFocussed: boolean;

  list: string[] = [];
  filteredList: string[];

  @HostListener('keyup', ['$event']) keyUp = (e) => {
    if (e.key === 'Backspace' && !this.value) {
      this.pills.pop();
      this.emitFitlerString();
    }
    if (e.key === 'Enter' && this.value) {
      this.addPill(e.target.value);
      this.value = '';
    }
  }

  removePill(value: string) {
    this.pills = this.pills.filter(x => x !== value);
    this.emitFitlerString();
  }

  addPill(value: string) {
    if (!this.pills.find(x => x === value)) {
      this.pills.push(value);
      this.value = '';
      this.emitFitlerString();
    }
  }

  changeValue(val: string) {
    this.doSearch(val);
    this.value = val;
  }

  doSearch(term: string) {
    this.filteredList = term && term.length > 1 ? this.list.filter(x => x.includes(term)) : [];
  }

  changeFocussed(state: boolean) {
    setTimeout(() => this.isFocussed = state, 200);
  }

  emitFitlerString() {
    if (this.pills)
      this.filterOn.emit(this.pills.join(' '))
  }
  constructor() { }

  ngOnInit(): void {
   
    //if (this.clearvalue == true) {
    //  this.pills = null;
    //}
  }
}
