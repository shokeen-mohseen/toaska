import { Component, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'app-latent-phase-labour',
  templateUrl: './latent-phase-labour.component.html',
  styleUrls: ['./latent-phase-labour.component.css']
})
export class LatentPhaseLabourComponent implements OnInit {

  public btnStatus: ButtonPreviousNextStatus;
  constructor(private data: DataService) {
    this.btnStatus = new ButtonPreviousNextStatus();
  }

  ngOnInit() {

    //this.btnStatus.btnPrevious = true;
    //this.btnStatus.btnNext = true;
    //this.btnStatus.previousPage = '/manage-partograph/new-partograph/examination';
    //this.btnStatus.nextPage = '/manage-partograph/new-partograph/postpartum-care';

    // send button status withe respect to page
    //this.data.buttonStatus(this.btnStatus);

    // send stepper name on progress bar
    //this.data.SendPartographSource('key_PartographMonitoring');
  }

}
