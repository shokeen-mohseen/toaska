import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core';
import { Forecast } from '../../../core/models/Forecast.model';
import { CalendarTypeService } from '../../../core/services/calendarType.service';
import { ForecastService } from '../../../core/services/forecast.service';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-addnew-forecast',
  templateUrl: './addnew-forecast.component.html',
  styleUrls: ['./addnew-forecast.component.css']
})
export class AddnewForecastComponent implements OnInit {
  public dateFormat: String = "MM-dd-yyyy";
  date6: Date;
  calendarTypeList = [];
  selectedCalendarType = [];
  settingsCalendarType = {};

  salesManagerList = [];
  selectedSalesManager = [];
  settingsSalesManager = {};
  description: string;
  name: string ;
  startPeriod: Date ;
  endPeriod: Date;
  userMessages: any = [];


  constructor(public activeModal: NgbActiveModal,
    private userService: UserService,
    private calendarTypeService: CalendarTypeService,
    private authenticationService: AuthService,
    public messageService: MessageService, 
    private toastrService: ToastrService,
    private forecastService: ForecastService) { }
 

  ngOnInit(): void {
    this.getSalesManager();
    this.getCalenderType();
    this.setDropdownsSettings();
    this.getMessages();
  }

  setDropdownsSettings() {
    this.settingsCalendarType = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
    };

    this.settingsSalesManager = {
      singleSelection: false,
      text: "Select",
      enableCheckAll: true,
      enableSearchFilter: true,
      badgeShowLimit: 2,
      labelKey: 'username',
      searchBy: ['name']
    }
  }
  getSalesManager() {
    this.userService.getUserbyRole('salesManager')
      .subscribe(
        result => {
          this.salesManagerList = [];
          if (result.Data) {
            result.Data
              .forEach(item => this.salesManagerList
                .push({ id: item.Id, username: item.FirstName + " " + item.LastName }));

            this.selectedSalesManager = this.salesManagerList;
          }

        }
      );
  }

  getCalenderType() {
    this.calendarTypeService.getAllCalenderType()
      .subscribe(
        result => {
          this.calendarTypeList = [];
          if (result.data) {
            result.data
              .forEach(item => this.calendarTypeList
                .push({ id: item.id, itemName: item.name}));
          }

        }

      );
  }
 
  createForecast() {
    if (this.isValid()) {
      var forecastToSave = this.getForecastToSave();
      this.forecastService.addForecast(forecastToSave)
        .subscribe(
          result => {
            if (result.data && result.statusCode == 200) {
              this.toastrService.success(this.getMessage("ForecastCreated"));
              this.activeModal.close('success');
            } else {
              this.toastrService.error(this.getMessage("ForecastCreationFailed"));
            }

          },
          error => {
            this.toastrService.error(this.getMessage("ForecastCreationFailed"));
          }
        );
    } else {
      this.toastrService.warning(this.getMessage("FillMandatoryFields"))
    }
    
    
  }

  isValid() {
    if (!this.name
      || !this.description
      || !this.startPeriod
      || !this.endPeriod
      || !this.selectedSalesManager || this.selectedSalesManager.length < 1
      || !this.selectedCalendarType || this.selectedCalendarType.length < 1) {
      return false;
    }
    return true;
  }

  getForecastToSave(): Forecast {
    var forecastToSave = new Forecast();
    forecastToSave.name = this.name;
    forecastToSave.description = this.description;
    forecastToSave.startDate = this.startPeriod;
    forecastToSave.endDate = this.endPeriod;
    forecastToSave.salesManagerIds = this.selectedSalesManager.map(x => x.id);
    forecastToSave.calendarTypeId = this.selectedCalendarType[0].id;
    forecastToSave.clientId = this.authenticationService.currentUserValue.ClientId;
    forecastToSave.sourceSystemId = this.authenticationService.currentUserValue.SourceSystemID;
    forecastToSave.createDateTimeBrowser = new Date();
    forecastToSave.updateDateTimeBrowser = new Date();
    forecastToSave.updateDateTimeServer = new Date();
    forecastToSave.createDateTimeServer = new Date();
    forecastToSave.createdBy = this.authenticationService.currentUserValue.LoginId;
    forecastToSave.updatedBy = this.authenticationService.currentUserValue.LoginId;
    return forecastToSave;

  }

  selectedCalenderTypeChange(selectedCalenderType: any ) {
    console.log(selectedCalenderType);
    if (selectedCalenderType && selectedCalenderType[0] != null) {
      if (selectedCalenderType[0].itemName.includes("Monthly")) {
        this.dateFormat = "y-m";
      } else {
        this.dateFormat = "y-W"
      }
    }
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
}
