import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-print-level',
  templateUrl: './print-level.component.html',
  styleUrls: ['./print-level.component.css']
})
export class PrintLevelComponent implements OnInit {

  constructor(public activeModal1: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
