import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UseraccessService } from '../../../core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() options = [5, 10, 15];
  @Input() size: number = 10;

  selectedOptions: number = 10;
  pageNumber: number;
  pageIndex: number = 1;

  @Output() onSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output() onPrevious: EventEmitter<number> = new EventEmitter<number>();
  @Output() onNext: EventEmitter<number> = new EventEmitter<number>();

  constructor(private useraccessService: UseraccessService) {
    this.useraccessService.pageSizeObj.subscribe(x => {
      this.size = x;
      if (this.size === 0)
        this.pageNumber = 1;
      this.pageNumbers();
    });
  }

  ngOnInit() {
  }

  onSelect(selectNumber: number) {
    this.pageIndex = 1;
    this.pageNumbers();
    this.onSelected.emit(selectNumber);
  }

  pageNumbers() {
    this.pageNumber = Math.round(this.size / this.selectedOptions) == 0 ? 1 : Math.ceil(this.size / this.selectedOptions);
  }

  previous() {
    if (this.pageIndex > 1) {
      this.pageIndex -= 1;
    }
    else {
      return;
    }
    this.onPrevious.emit(this.pageIndex);
  }

  next() {
    if (this.pageIndex < this.pageNumber) {
      this.pageIndex += 1;
    }
    else {
      return;
    }
    this.onNext.emit(this.pageIndex);
  }

}
