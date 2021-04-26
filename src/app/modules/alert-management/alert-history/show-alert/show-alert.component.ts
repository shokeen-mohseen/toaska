import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Options } from 'select2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserAlertHistory } from '../../../../core/models/UserAlertHistory.model';
import { AlertManagementService } from '../../services/alert-management.server.input.services';
@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.component.html',
  styleUrls: ['./show-alert.component.css']
})
export class ShowAlertComponent implements OnInit {
  @Input() UserAlertHistoryToView: UserAlertHistory[];
  selectedUserAlertHistoryToView: UserAlertHistory = null;
  constructor(private alertService: AlertManagementService) { }

  ngOnInit(): void {

    this.selectedUserAlertHistory(this.UserAlertHistoryToView[0]);
    this.setSelectedUserAlertHistoryMapping();
  }
  selectedUserAlertHistory(selectedUserAlertHistoryToView: UserAlertHistory) {
    this.selectedUserAlertHistoryToView = Object.assign({}, selectedUserAlertHistoryToView);
    //this.selectedUserAlertHistoryToView.dateDispatched = this.alertService.getLocalDateTime(this.convertDatetoStringDate(new Date(this.selectedUserAlertHistoryToView.dateDispatched)));
  }
  setSelectedUserAlertHistoryMapping() {

    var body;
    if (this.selectedUserAlertHistoryToView != null) {
      body = this.selectedUserAlertHistoryToView.dispatchNotificationBody;
    }

  }
  convertDatetoStringDate(selectedDate: Date) {

    var date = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();

    var hours = selectedDate.getHours();
    var minuts = selectedDate.getMinutes();
    var seconds = selectedDate.getSeconds();

    return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();



  }
}
