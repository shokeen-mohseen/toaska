import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ForecastService } from '../../../core/services/forecast.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { MessageService } from '../../../core/services/message.service';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
@Component({
  selector: 'app-forecast-update',
  templateUrl: './forecast-update.component.html',
  styleUrls: ['./forecast-update.component.css']
})
export class ForecastUpdateComponent implements OnInit {
  SelectedForecastID: any;
  userMessages: any = [];
  @Output() passEntry: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public activeModal: NgbActiveModal, public forecastService: ForecastService,
    private authenticationService: AuthService, public messageService: MessageService,
    private toastrService: ToastrService ) { }

  ngOnInit(): void {
    this.getMessages();
  }


  getMessages() {
    this.messageService.getMessagesByModuleCode("CSFOR", parseInt(localStorage.clientId)).subscribe(
      result => {
        if (result.data) {
          this.userMessages = result.data;
        }
      }
    );
  }


  getMessage(messageCode: string) {
    if (this.userMessages) {
      return this.userMessages.find(x => x.code == messageCode)?.message1;

    }
    return '';
  }


  converttoSqlStringWithT(vdatetime) {
    if (vdatetime != null) {
      let dt = new Date(vdatetime);
      var date = dt.getDate();
      var month = dt.getMonth();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var minutes = dt.getMinutes();
      var hour1 = hour.toString().padStart(2, "0");
      var minutes1 = dt.getMinutes().toString().padStart(2, "0");
      var datestring = (year + "-" + (month + 1).toString().padStart(2, "0") + "-" + date.toString().padStart(2, "0") + "T" + hour1 + ":" + minutes1 + ":00.000")
      return datestring;
    }
    return null;
  }

  UpdateForecast() {
    var RequestObject = {
       forecastid: this.SelectedForecastID,
     // forecastid: 73,
      updateby: this.authenticationService.currentUserValue.LoginId,
      clientID: this.authenticationService.currentUserValue.ClientId,
      updatedTime: this.converttoSqlStringWithT(new Date())
    };
    this.forecastService.UpdateForecast(RequestObject).subscribe(
      result => {
        if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
          this.toastrService.info(result.data.message);
          this.activeModal.dismiss('Cross click');
          this.passEntry.emit();
        }
        else {
          this.toastrService.error(this.getMessage("ForecastUpdationFailed"));
        }
      }
    );
  }

  //GetForecastLockstatus() {
  
  //  // var RequestObject = {forecastid: this.SelectedForecastID};
  //  var RequestObject = { forecastid: 73 };
  //  console.log(this.forecastService);
  //  this.forecastService.ForecastLockstatus(RequestObject).subscribe(
  //    result => {
  //      if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
  //        console.log(result.data[0].message)
  //        if (result.data[0].message.toLowerCase() == "locked") {
  //          setTimeout(this.GetForecastLockstatus, 3000);
  //        }
  //      }
  //      else {
  //        this.toastrService.error(this.getMessage("ForecastUpdationFailed"));
  //      }
  //    }
  //  );
  //}

}
