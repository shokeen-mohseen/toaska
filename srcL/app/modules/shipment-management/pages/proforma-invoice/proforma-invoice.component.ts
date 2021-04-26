import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocationAddressCallListViewModel } from '../../../../core/models/Location';
import {  ShipmentProformaInvoice } from '../../../../core/models/shipment-proforma-invoice.model';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { PdfService } from '../../../../core/services/pdf.service';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';


@Component({
  selector: 'app-proforma-invoice',
  templateUrl: './proforma-invoice.component.html',
  styleUrls: ['./proforma-invoice.component.css']
})
export class ProformaInvoiceComponent implements OnInit {
  @Input() shipmentForReport;
  proformatitle = "Proforma Invoice";
  proformaInvoice: any = [];
  proformaInvoice_data: any = [];
  proformaaddress: any = [];
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
     // console.log("id from input decorator :: " + this.shipmentForReport);
      let proformaadd:any = {};
      proformaadd.orgBilltoname = "";
      proformaadd.orgBilltostreetname1 = "";
      proformaadd.orgBilltoCityName = "";
      proformaadd.orgBilltoStateCode = "";
      proformaadd.billtozipcode = "";
      proformaadd.orgBilltoCountryCode = "";
      this.proformaaddress.push(proformaadd);
      let objpi: any = {}
      objpi.shipmentNumber = "";
      this.proformaInvoice.push(objpi);
    this.GetProformaInvoiceData(this.shipmentForReport);
    }
  }
  downloadPdf() {
    var data = document.getElementById('proformainvoiceView');
    this.pdfService.openPDFFromHTMLElement(data, "proformaInvoice_data");

  }

  closeWindow() {
    this.activeModal.close('success');
  }

  async GetProformaInvoiceData(shipmentId: number) {
  
    this.shipmentManagementService.GetProformaInvoiceOrgAddressData(shipmentId).subscribe(
      (addresult) => {
        this.proformaaddress = addresult.data;
      });

  
    this.shipmentManagementService.GetProformaInvoiceData(shipmentId).subscribe(
      (result) => {
        if (result != null && result.data != null && result.data.length > 0) {
          this.proformaInvoice = result.data;
          if (this.proformaInvoice[0].shipmentTypeCode.toLowerCase() == "customer" || this.proformaInvoice[0].shipmentTypeCode.toLowerCase() == "stocktransfer"
            || this.proformaInvoice[0].shipmentTypeCode.toLowerCase() == "collections") {
            this.proformatitle = "Proforma Invoice";
          }
          else {
            this.proformatitle = "Credit Memo";
          }
          const uniqueorders = this.proformaInvoice.filter((thing, index, self) => index === self.findIndex((t) => (t.orderID === thing.orderID)));
          uniqueorders.forEach(ur => {
            let invoice: any = [];
            invoice = this.proformaInvoice.filter((x) => x.orderID == ur.orderID);
            let objinvoice: any = {};
            objinvoice.shipmentNumber = invoice[0].shipmentNumber;
            objinvoice.billtoname = invoice[0].billtoname;
            objinvoice.shipmentNumber = invoice[0].shipmentNumber;
            objinvoice.billtoCityName = invoice[0].billtoCityName;
            objinvoice.billtoStateCode = invoice[0].billtoStateCode;
            objinvoice.billtozipcode = invoice[0].billtozipcode;
            objinvoice.billtoCountryCode = invoice[0].billtoCountryCode;
            objinvoice.billtostreetname1 = invoice[0].billtostreetname1;
            objinvoice.shiptoname = invoice[0].shiptoname;
            objinvoice.shiptostreetname1 = invoice[0].shiptostreetname1;
            objinvoice.shiptoCityName = invoice[0].shiptoCityName;
            objinvoice.shiptoStateCode = invoice[0].shiptoStateCode;
            objinvoice.shiptozipcode = invoice[0].shiptozipcode;
            objinvoice.shiptoCountryCode = invoice[0].shiptoCountryCode;
            objinvoice.shipdate = invoice[0].shipdate;
            objinvoice.pOnumber = invoice[0].pOnumber;
            objinvoice.salesRep = invoice[0].salesRep;
            objinvoice.title = invoice[0].title;
            let stotal = 0.0;
            let salestax = 0.0;
            let balancedue = 0.0;
            let objorddet: any = [];
            invoice.forEach(inv => {
             
              let objmatdet: any = {};
              objmatdet.quantity = inv.quantity;
              objmatdet.materialName = inv.materialName;
              objmatdet.unitprice = inv.unitPrice;
              objmatdet.totprice = inv.totalPrice;
              stotal += objmatdet.totprice;
              objorddet.push(objmatdet);
            });
            objinvoice.orderdetails = objorddet;
            salestax = invoice[0].salesTax;
            balancedue = stotal + salestax;
            objinvoice.subtotal = stotal.toFixed(2);
            objinvoice.salestax = salestax.toFixed(2);
            objinvoice.balancedue = balancedue.toFixed(2);
            this.proformaInvoice_data.push(objinvoice);

          })
        }
      },
      error => {    }
    );
    console.log(this.proformaInvoice_data);
  }

}
