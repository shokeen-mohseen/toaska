import { Component, OnInit } from '@angular/core';
import { SubscriptionPromotionService } from '../../pages/services/subscription-promotion.services';
import { SendObject } from '../../pages/models/send-object';
import { AuthService, User } from '@app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hint-message',
  templateUrl: './hint-message.component.html',
  styleUrls: ['./hint-message.component.css']
})
export class HintMessageComponent implements OnInit {
  sendObject: SendObject; currentUser: User; subscriptionPackageTypeList: any;
  constructor(public activeModal: NgbActiveModal,private authenticationService: AuthService, private subscriptionPromotionService: SubscriptionPromotionService) {
    this.sendObject = new SendObject();
    this.currentUser = this.authenticationService.currentUserValue;
    this.subscriptionPackageTypeList = [];
  }

  ngOnInit(): void {
    if (localStorage.getItem("SubscriptionHint") != undefined) {
      this.subscriptionPackageTypeList = JSON.parse(localStorage.getItem("SubscriptionHint"));
    }
    else {
      this.GetSubscriptionType();
    }
  }

  GetSubscriptionType() {
    this.sendObject.PageNo = 1;
    this.sendObject.PageSize = 20;
    this.sendObject.ClientId = this.currentUser.ClientId;
    this.subscriptionPromotionService.SubscriptionPackageTypeList(this.sendObject)
      .subscribe(res => {
        if (res.Data != null && res.Data.length > 0) {
          this.subscriptionPackageTypeList = res.Data;
          localStorage.setItem("SubscriptionHint", JSON.stringify(res.Data));
          
        }
        else {
          this.subscriptionPackageTypeList = [];
        }
        

      });
  }

}
