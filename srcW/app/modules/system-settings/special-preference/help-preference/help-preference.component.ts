import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-help-preference',
  templateUrl: './help-preference.component.html',
  styleUrls: ['./help-preference.component.css']
})
export class HelpPreferenceComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
