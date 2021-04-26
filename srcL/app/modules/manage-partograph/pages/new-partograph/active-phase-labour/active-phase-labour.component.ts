import { Component, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { UserActivityLog, ActionOnPage } from '@app/core/models/useractivity';

@Component({
  selector: 'app-active-phase-labour',
  templateUrl: './active-phase-labour.component.html',
  styleUrls: ['./active-phase-labour.component.css']
})
export class ActivePhaseLabourComponent implements OnInit {
  userActivityObj: UserActivityLog;
  public btnStatus: ButtonPreviousNextStatus;
  constructor(private dataService: DataService) {
    this.btnStatus = new ButtonPreviousNextStatus();
    const userActivitylog = this.dataService.currentUserActivity;
    this.userActivityObj = new UserActivityLog();
    this.userActivityObj.moduleName = userActivitylog.moduleName;
    this.userActivityObj.componentName = this.constructor.name;
    this.userActivityObj.actiononPage = ActionOnPage.View;
    this.dataService.SendActivity(this.userActivityObj);
  }

  ngOnInit() {

    //this.btnStatus.btnPrevious = true;
    //this.btnStatus.btnNext = true;
    //this.btnStatus.previousPage = '/manage-partograph/new-partograph/latent-phase-labour';
    //this.btnStatus.nextPage = '/manage-partograph/new-partograph/second-phase-labour';

    // send button status withe respect to page
    //this.dataService.buttonStatus(this.btnStatus);

    // send stepper name on progress bar
    //this.dataService.SendPartographSource('key_PostpartumCare');
    const userActivitylog = this.dataService.currentUserActivity;
    console.log(userActivitylog);
  }

}
