import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import { BPByCarrier } from '../../../../core/models/BusinessPartner.model';

@Component({
  selector: 'app-add-business-partner',
  templateUrl: './add-business-partner.component.html',
  styleUrls: ['./add-business-partner.component.css']
})
export class AddBusinessPartnerComponent implements OnInit {

  businessPartnerName;
  scacValue;

  isSaving = false;
  constructor(private router: Router,
    private businesParnter: BusinessPartnerService,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
  ) { }



  ngOnInit(): void {
    

  }
  async addCarrier() {
    if (this.businessPartnerName && this.scacValue) {
      this.isSaving = true;
      var businessPartnerCarrierModel = new BPByCarrier();
      businessPartnerCarrierModel.businessPartnerName = this.businessPartnerName;
      businessPartnerCarrierModel.scacValue = this.scacValue;
      businessPartnerCarrierModel.createDateTimeBrowser = new Date();
      businessPartnerCarrierModel.createdBy = this.authenticationService.currentUserValue.LoginId;
      businessPartnerCarrierModel.sourceSystemID = this.authenticationService.currentUserValue.SourceSystemID;
      await this.businesParnter.addCarrier(businessPartnerCarrierModel).toPromise()
        .then(result => {
          if (result.statusCode == 200 && result.data) {
            this.toastrService.success("Carrier added successfully.");
          } else {
            this.toastrService.error("Adding failed. Please try again later.");
          }
          this.isSaving = false;
          this.businessPartnerName = null;
          this.scacValue = null;
        })
        .catch(() => {
          this.toastrService.error("Adding failed. Please try again later.")
          this.isSaving = false;
        });
    }
    else {
      this.toastrService.warning("Please provide Carrier Name and SCAC code.");
    }
  }

}
