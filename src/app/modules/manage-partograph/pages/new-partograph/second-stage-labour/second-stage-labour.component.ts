import { Component, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'app-second-stage-labour',
  templateUrl: './second-stage-labour.component.html',
  styleUrls: ['./second-stage-labour.component.css']
})
export class SecondStageLabourComponent implements OnInit {

  public btnStatus: ButtonPreviousNextStatus;
  constructor(private data: DataService) {
    this.btnStatus = new ButtonPreviousNextStatus();
  }

  ngOnInit() {

    //this.btnStatus.btnPrevious = true;
    //this.btnStatus.btnNext = true;
    //this.btnStatus.previousPage = '/manage-partograph/new-partograph/active-phase-labour';
    //this.btnStatus.nextPage = '/manage-partograph/new-partograph/third-stage-delivery';

    // send button status withe respect to page
    //this.data.buttonStatus(this.btnStatus);

    // send stepper name on progress bar
    //this.data.SendPartographSource('key_SecondStageLabour');
  }

}
