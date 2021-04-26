import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { Subscription } from 'rxjs';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  stepperName: string; IsEnableTab$: any;
  subscription: Subscription;
  //buttonState: ButtonPreviousNextStatus
  partographStepperlist: any = []; pageurlList: any;
  statusn: boolean = false;
  statusc: boolean = false;
  statusm: boolean = true;
  statuscovidp: boolean = false;
  statuscovidn: boolean = true;
  statuscovidu: boolean = false;
  statuscovidt: boolean = false;
  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.IsEnableTab$ = this.data.getMessage();
   // alert(this.IsEnableTab$)
    this.partographStepperlist = DataService.partograph;
    this.pageurlList = DataService.pageurl;

    //console.log(this.data.currentStatusSource.subscribe(buttonState => this.buttonState = buttonState))
    this.subscription = this.data.currentpartograph.subscribe(stepperName => this.stepperName = stepperName);
    
    // unsubscribe here
    this.subscription.unsubscribe();
    
  }

  //Toggle Status
  covidStatus(status) {
    if (status == 1) {
      this.statuscovidp = true;
      this.statuscovidn = false;
      this.statuscovidu = false;
      this.statuscovidt = false;
    }
    else if (status == 2) {
      this.statuscovidp = false;
      this.statuscovidn = false;
      this.statuscovidu = true;
      this.statuscovidt = false;
    }
    else if (status == 3) {
      this.statuscovidp = false;
      this.statuscovidn = false;
      this.statuscovidu = false;
      this.statuscovidt = true;
    }
    else if (status == 4) {
      this.statuscovidp = false;
      this.statuscovidn = true;
      this.statuscovidu = false;
      this.statuscovidt = false;
    }
  }
  selectStatus(status) {
    if (status == 1) {
      this.statusn = false;
      this.statusm = true;
      this.statusc = false;
    }
    else if (status == 2) {
      this.statusm = false;
      this.statusn = false;
      this.statusc = true;
    }
    else if (status == 3) {
      this.statusn = true;
      this.statusm = false;
      this.statusc = false;
    }
  }

}

