// TFSID 16635 Rizwan Khan, 8 june 2020, This alert popup used in Fetal Heart Rate

import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fetal-heartalertpopup',
  templateUrl: './fetal-heart.alert.popup.component.html',
  styleUrls: ['./fetal-heart.alert.popup.component.css']
})
export class FetalHeartAlertPopupComponent implements OnInit {

  @Input() public modalAlertData;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}

// TFSID 16635 
