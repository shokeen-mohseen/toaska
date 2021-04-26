import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Options } from 'select2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserAlertHistory } from '../../../../core/models/UserAlertHistory.model';
@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.component.html',
  styleUrls: ['./show-alert.component.css']
})
export class ShowAlertComponent implements OnInit {
  @Input() UserAlertHistoryToView: UserAlertHistory[];
  selectedUserAlertHistoryToView: UserAlertHistory = null;
  constructor() { }

  ngOnInit(): void {

    this.selectedUserAlertHistory(this.UserAlertHistoryToView[0]);
    this.setSelectedUserAlertHistoryMapping();
  }
  selectedUserAlertHistory(selectedUserAlertHistoryToView: UserAlertHistory) {
    this.selectedUserAlertHistoryToView = Object.assign({}, selectedUserAlertHistoryToView);
  }
  setSelectedUserAlertHistoryMapping() {

    var body;
    if (this.selectedUserAlertHistoryToView != null) {
      body = this.selectedUserAlertHistoryToView.dispatchNotificationBody;
    }

  }
}
