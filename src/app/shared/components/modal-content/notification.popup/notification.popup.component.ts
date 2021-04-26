import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notificationpopup',
  templateUrl: './notification.popup.component.html',
  styleUrls: ['./notification.popup.component.css']
})
export class NotificationPopupComponent implements OnInit {
  // Add modal data
  @Input() modalAlertData: any = [];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    //console.log(this.modalAlertData)
  }

}
