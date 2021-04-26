import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { projectkey } from 'environments/projectkey';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, AfterViewInit {

  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  actionGroupConfig;
  IsTosca: boolean;

  public dateFormat: String = "MM-dd-yyyy";
  public dateFormat1: String = "MM-dd-yyyy HH:mm a";
  public date: Date = new Date("12/11/2017 1:00 AM");
  public interval: number = 0.60;

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

  ngAfterViewInit(): void {

  }
  actionHandler(type) { }

}
