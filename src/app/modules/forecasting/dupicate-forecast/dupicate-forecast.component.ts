import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';
import { ForecastService } from '../../../core/services/forecast.service';
import { CreateComputeSalesForecastComponent } from '../create-compute-sales-forecast/create-compute-sales-forecast.component';
@Component({
  selector: 'app-dupicate-forecast',
  templateUrl: './dupicate-forecast.component.html',
  styleUrls: ['./dupicate-forecast.component.css']
})
export class DupicateForecastComponent implements OnInit {
  SelectedForecastID: any;
  Name: any;
  Description: any;
  @Input()
  forecastComponentInstance: CreateComputeSalesForecastComponent;

  constructor(public activeModal: NgbActiveModal, private authenticationService: AuthService, private forecastService: ForecastService,
    private toastrService: ToastrService) { }

  ngOnInit(): void { }

  DuplicateForecast() {
    var name = this.Name.trim();
    var description = this.Description.trim();
    if (name != "" && description != "") {
      var RequestObject = {
        forecastid: this.SelectedForecastID,
        name: name,
        description: description,
        updateby: this.authenticationService.currentUserValue.LoginId,
        clientID: this.authenticationService.currentUserValue.ClientId,
        updatedTime: this.converttoSqlStringWithT(new Date())
      };
      this.forecastService.DuplicateForecast(RequestObject)
        .subscribe(result => {
         
          if (result.message == GlobalConstants.Success || result.Message == GlobalConstants.Success) {
            if (result.data[0].status != undefined && result.data[0].status == 'FAIL') {
              this.toastrService.info(result.data[0].message);
            }
            else {
              this.toastrService.success(result.data[0].message);
              this.activeModal.dismiss('Cross click');

              //To refresh forecast grid
              if (this.forecastComponentInstance != null && this.forecastComponentInstance != undefined)
                this.forecastComponentInstance.getForecastDetail();
            }
            return;
          }
          else {
            this.toastrService.error('Error Occured while duplicating forecast details');
          }
        });
    }
    else {
      this.toastrService.error("Please Enter Name and Description");
    }
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
  blockSpecialChar(event): boolean {
    const k = (event.which) ? event.which : event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));

  }
}
