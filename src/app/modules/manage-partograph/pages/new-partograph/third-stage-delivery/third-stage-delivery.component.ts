import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalConstants } from '@app/core/models/GlobalConstants ';

@Component({
  selector: 'app-third-stage-delivery',
  templateUrl: './third-stage-delivery.component.html',
  styleUrls: ['./third-stage-delivery.component.css']
})
export class ThirdStageDeliveryComponent implements OnInit {

  stageCode: string;

//  let m = moment(new Date());
//// TFSID 16635 Rizwan Khan , 27 july 2020, add Current time with time zone
//let m1 = moment().format('MMMM DD, YYYY hh:mm A');
//chart.DisplayCurrentTime = m1.toString();

  //public btnStatus: ButtonPreviousNextStatus;
  constructor() {

    
  }

  // TFSID 17034, Rizwan khan , 8 Aug 2020, Make complication control dynamic.
  ngOnInit() {
    this.stageCode = GlobalConstants.PARTOGRAPH_MONITORING_STAGE3;
    
  }


  
}

