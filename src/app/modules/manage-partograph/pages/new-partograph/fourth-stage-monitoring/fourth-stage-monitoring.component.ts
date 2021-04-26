import { Component, OnInit } from '@angular/core';
import { ButtonPreviousNextStatus } from '@app/shared/buttonNextPrevious';
import { DataService } from '@app/shared/services/data.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '@app/shared/components/modal-content/add-complications/add-complications.component';
import moment from 'moment';
import 'moment-timezone';
import { User, AuthService } from '@app/core';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';



@Component({
  selector: 'app-fourth-stage-monitoring',
  templateUrl: './fourth-stage-monitoring.component.html',
  styleUrls: ['./fourth-stage-monitoring.component.css']
})
export class FourthStageMonitoringComponent implements OnInit {
  EventFrom: string; currentUser: User; UserName: string;
  modalRef: NgbModalRef;
 
  stageCode: string;
  public btnStatus: ButtonPreviousNextStatus;
  constructor(private authenticationService: AuthService, public modalService: NgbModal, private data: DataService) {
    //this.btnStatus = new ButtonPreviousNextStatus();
    //this.EventFrom = "FourthStage";
    this.currentUser = this.authenticationService.currentUserValue;
    this.UserName = this.currentUser.username;
  }

  ngOnInit() {
    this.stageCode = GlobalConstants.PARTOGRAPH_MONITORING_STAGE4;
  }
  
}
