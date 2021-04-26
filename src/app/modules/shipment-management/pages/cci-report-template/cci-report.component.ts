import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocationAddressCallListViewModel } from '../../../../core/models/Location';
import { ShipmentCciLocationInfo,  ShipmentCciReportShipment, ShipmentCciOrderDetail } from '../../../../core/models/shipment-cci-report.model';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { PdfService } from '../../../../core/services/pdf.service';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';

@Component({
  selector: 'app-cci-report',
  templateUrl: './cci-report.component.html',
  styleUrls: ['./cci-report.component.css']
})
export class CCIReportComponent implements OnInit{
  @Input() shipmentForReport;

  cciReport: ShipmentCciReportShipment[] = [];
  todaysDate = new Date();
  constructor(private router: Router,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private shipmentManagementService: shipmentManagementService,
    private customerbylocationService: CustomerByLocationService,
    private organizationService: OrganizationService,
    private pdfService: PdfService) {
  }
  async ngOnInit() {
    if (this.shipmentForReport) {
      console.log("id from input decorator :: " + this.shipmentForReport.id);
      this.GetShippingCCIData(this.shipmentForReport.id);
    }
  }
  downloadPdf() {
    console.log(this.shipmentForReport);
    var data = document.getElementById('viewCCIReport');
    this.pdfService.openPDFFromHTMLElement(data, "cciReport");
     
  }

  closeWindow() {
    this.activeModal.close('success');
  }




  async GetShippingCCIData(shipmentId: number) {
    this.shipmentManagementService.GetShippingCCIData(shipmentId).subscribe(
      (result) => {
        console.log(result);
        if (result != null && result.data != null && result.data.length == 1) {
          this.cciReport.push(result.data[0]);
          console.log(this.cciReport);
        }
      },
      error => {

      }

    );
   
  }

  
 
}
