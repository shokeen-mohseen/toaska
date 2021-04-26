import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit {
  private stepper: Stepper;
  
  constructor() {

  }

  next() {
    this.stepper.next();
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper13'), {
      linear: false,
      animation: true
    });
  }


}
