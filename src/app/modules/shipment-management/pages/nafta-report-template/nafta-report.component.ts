import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocationAddressCallListViewModel } from '../../../../core/models/Location';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { LocationService } from '../../../../core/services/location.service';
import { PdfService } from '../../../../core/services/pdf.service';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';
import { ShipmentNaftaReportShipment, ShipmentNaftaReportOrders, ShipmentNaftaLocationInfo } from '../../../../core/models/shipment-nafta-report.model';
import { OrganizationService } from '../../../../core/services/organization.service';

@Component({
  selector: 'app-nafta-report',
  templateUrl: './nafta-report.component.html',
  styleUrls: ['./nafta-report.component.css']
})
export class NaftaReportComponent implements OnInit{
  @Input() shipmentForReport;

  naftaReport = new ShipmentNaftaReportShipment();
  naftaReportOrders: ShipmentNaftaReportOrders[] = [];
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
      console.log("shipment id from service == " + this.shipmentManagementService.EditingShipment);
      console.log("id from input decorator" + this.shipmentForReport.id);
      this.GetShippingOrders(this.shipmentForReport.id);
    }
  }
  downloadPdf() {
    console.log(this.shipmentForReport);
    var data = document.getElementById('viewNaftaReport');
    this.pdfService.openPDFFromHTMLElement(data, "naftaReport");
     
  }

  closeWindow() {
    this.activeModal.close('success');
  }




  async GetShippingOrders(shipmentId: number) {
    await this.shipmentManagementService.GetShippingOrders(shipmentId).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          var orders = result.data;
          if (orders) {
            orders.forEach(order => {
              var naftaReport = new ShipmentNaftaReportOrders();
              naftaReport.orderID = order.orderid;
              naftaReport.orderNumber = order.orderNumber;
              naftaReport.toLocation = this.getToLocation(order);
              naftaReport.fromLocation = this.getFromLocation(order);
              this.naftaReportOrders.push(naftaReport);

            });
            this.shipmentManagementService.GetShippingNaftaReport(shipmentId).toPromise()
              .then(result => {
                if (result.statusCode == 200 && result.data) {
                  var orderNaftDetails = result.data;
                  if (orderNaftDetails) {
                    this.naftaReportOrders.forEach(order => {
                      var orderNaftaDetail = orderNaftDetails.find(x => x.orderID == order.orderID);
                      if (orderNaftaDetail) {
                        order.orderID = orderNaftaDetail.orderID;
                        order.materialID = orderNaftaDetail.materialID;
                        order.authorizedSignature = "data:image/png;base64," + orderNaftaDetail.authorizedSignature;
                        order.countryofOrigin = orderNaftaDetail.countryofOrigin;
                        order.fromCalendarYear = orderNaftaDetail.fromCalendarYear;
                        order.toCalendarYear = orderNaftaDetail.toCalendarYear;
                        order.countryId = orderNaftaDetail.countryId;
                        order.orgAddress = orderNaftaDetail.orgAddress;
                        order.cityState = orderNaftaDetail.cityState;
                        order.tin = orderNaftaDetail.tin;
                        order.telephoneNumberVoice = orderNaftaDetail.telephoneNumberVoice;
                        order.telephoneNumberFacsimile = orderNaftaDetail.telephoneNumberFacsimile;
                        order.companyName = orderNaftaDetail.companyName;
                        order.descriptionofGood = orderNaftaDetail.descriptionofGood;
                        order.hsTariffClassificationNumber = orderNaftaDetail.hsTariffClassificationNumber;
                        order.preferenceCriterion = orderNaftaDetail.preferenceCriterion;
                        order.producer = orderNaftaDetail.producer;
                        order.netCost = orderNaftaDetail.netCost;
                        order.name = orderNaftaDetail.name;
                        order.title = orderNaftaDetail.title;
                        order.date = orderNaftaDetail.date;
                        order.expNo = orderNaftaDetail.expNo;
                      }
                    })
                  }
                } else {
                  this.toastrService.error("Error while loading data. Please contact Tech Support");
                }
              })
              .catch((err) => {
                this.toastrService.error("Error while loading data. Please contact Tech Support")
                console.log(err);
              });
          }
        } else {
          this.toastrService.error("Error while loading data. Please contact Tech Support");
        }
      })
      .catch((err) => {
        this.toastrService.error("Error while loading data. Please contact Tech Support")
        console.log(err);
      });
   
  }

  getToLocation(order: any) {
    var location = new ShipmentNaftaLocationInfo();
    location.locationId = order.toLocationID;
    location.name = order.toLocationName;
    location.organizationId = order.toOrganizationId;
    this.getTin(location.organizationId, location);
    this.getLocationAddressList(location.locationId, "Location", location, "Shipping Address");
    return location;
  }
  getFromLocation(order: any) {
    var location = new ShipmentNaftaLocationInfo();
    location.locationId = order.fromLocationID;
    location.name = order.fromLocationNameGrid;
    location.organizationId = order.fromOrganizationId;
    this.getLocationAddressList(location.locationId, "Location", location, "Shipping Address");
    this.getTin(location.organizationId, location);
    return location;
  }


  getLocationAddressList(addressId: number, type: string, locationInfo: ShipmentNaftaLocationInfo, addressType: string) {

    let commonCallListViewModel = new LocationAddressCallListViewModel()
    commonCallListViewModel.AddressActionType = type;
    commonCallListViewModel.AddressbyId = addressId;
    this.customerbylocationService.getUserAddressList(commonCallListViewModel)
      .subscribe(result => {
        const rowList = result.data;
        if (!!rowList) {
          rowList.filter(item => {
            if (item.addressTypeName == addressType) {
              locationInfo.cityState = item.cityName + "/" + item.stateName + "/" + item.zipCode;
              locationInfo.address = item.streetName1 + " , " + item.streetName2 + " , " + item.streetName3;
            }

          });
        }
      },
        error => { console.log(error) }
      );
  }
  getTin(orgId: number, locationInfo: ShipmentNaftaLocationInfo) {

    this.organizationService.getCharacteristicsList(orgId)
      .subscribe(result => {
        const rowList = result.data;
        if (!!rowList) {
          rowList.filter(item => {
            if (item.entityPropertyName == "EIN# or TAX IDENTIFICATION NUMBER") {
              locationInfo.tin = item.propertyValue;
            }
          });
        }
      },
        error => { console.log(error) }
      );
  }
 
}
