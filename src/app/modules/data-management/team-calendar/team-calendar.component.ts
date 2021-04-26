import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { ScheduleComponent, EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService, PopupOpenEventArgs, GroupModel } from '@syncfusion/ej2-angular-schedule';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';

import { eventData } from './data';

@Component({
  selector: 'app-team-calendar',
  templateUrl: './team-calendar.component.html',
  styleUrls: ['./team-calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ResizeService, DragAndDropService]
})
export class TeamCalendarComponent implements OnInit {

  IsTosca: boolean;

  @ViewChild('tabGroupA') tabGroup: MatTabGroup;

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;

  tab1: boolean = true;
  tab1Data: boolean = true;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
  }

  actionHandler(type) {
    if (type === "add") {
      this.editor();
    }
  }

  constructor() { }

  ngOnInit(): void {

    if (projectkey.projectname == "tosca") {
      this.IsTosca = true;
    }
    else {
      this.IsTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
  }

  ngAfterViewInit() {
    this.btnBar.hideAction('edit');
    this.btnBar.hideAction('delete');
    this.btnBar.hideAction('export');
    this.btnBar.showAction('filter');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
  }

  minValidation: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    return args['value'].length >= 5;
  };
  public selectedDate: Date = new Date(2018, 1, 15);
  public views: Array<string> = ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'];
  public showQuickInfo: Boolean = false;
  public eventSettings: EventSettingsModel = {
    dataSource: eventData,
    fields: {
      id: 'Id',
      subject: { name: 'Subject', validation: { required: true } },
      description: {
        name: 'Description', validation: {
          required: true, minLength: [this.minValidation, 'Need atleast 5 letters to be entered']
        }
      },
      startTime: { name: 'StartTime', validation: { required: true } },
      endTime: { name: 'EndTime', validation: { required: true } }
    }
  };

  public eventTypeDataSource: Object[] = [
    { text: "Personal", id: 1, color: "#ea7a57" },
    { text: "Team", id: 2, color: "#865fcf" }
  ];
  public group: GroupModel = { resources: ['EventType'] };

  @ViewChild('scheduleObj') scheduleObj: ScheduleComponent;
  @ViewChild('eventTypeOneObj') eventTypeOneObj: CheckBoxComponent;
  @ViewChild('eventTypeTwoObj') eventTypeTwoObj: CheckBoxComponent;


  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      }
      let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      if (!endElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      }

      let processElement: HTMLInputElement = args.element.querySelector('#EventTypeId');
      if (!processElement.classList.contains('e-multiselect')) {
        let multiSelectObject: MultiSelect = new MultiSelect({
          placeholder: 'Choose Event Type',
          fields: { text: 'text', value: 'id' },
          dataSource: <any>this.eventTypeDataSource,
          //value: <string[]>((args.data.EventTypeId instanceof Array) ? args.data.EventTypeId : [args.data.EventTypeId])
        });
        multiSelectObject.appendTo(processElement);
      }
    }
  }

  onChange(): void {
    let predicate: Predicate;
    let checkBoxes: CheckBoxComponent[] = [this.eventTypeOneObj, this.eventTypeTwoObj];
    checkBoxes.forEach((checkBoxObj: CheckBoxComponent) => {
      if (checkBoxObj.checked) {
        if (predicate) {
          predicate = predicate.or('EventTypeId', 'equal', parseInt(checkBoxObj.value, 10));
        } else {
          predicate = new Predicate('EventTypeId', 'equal', parseInt(checkBoxObj.value, 10));
        }
      }
    });
    this.scheduleObj.eventSettings.query = new Query().where(predicate);
  }

  editor(): void {
    let cellData: Object = {
      startTime: new Date(2018, 1, 15, 10, 0),
      endTime: new Date(2018, 1, 15, 11, 0),
    };
    this.scheduleObj.openEditor(cellData, 'Add');
  }


}
