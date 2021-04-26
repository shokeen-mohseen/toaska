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

@Component({
  selector: 'app-nafta-report',
  templateUrl: './nafta-report.component.html',
  styleUrls: ['./nafta-report.component.css']
})
export class NaftaReportComponent implements OnInit{
  @Input() shipmentForReport;

  naftaReport = new ShipmentNaftaReportShipment();
  naftaReportOrders: ShipmentNaftaReportOrders[] = [];
  shipmentOrdersDetail: any; 
  todaysDate = new Date();
  constructor(private router: Router,
    public activeModal: NgbActiveModal,
    private authenticationService: AuthService,
    private toastrService: ToastrService,
    private shipmentManagementService: shipmentManagementService,
    private customerbylocationService: CustomerByLocationService,
    private locationService: LocationService,
    private pdfService: PdfService) {
  }
  async ngOnInit() {
    if (this.shipmentForReport) {
      console.log("shipment id from service == " + this.shipmentManagementService.EditingShipment);
      console.log("id from input decorator" + this.shipmentForReport.id);
      await this.GetShipmentDetails(this.shipmentForReport.id);
      this.GetShippingOrdersDetails(this.shipmentForReport.id);
      this.GetShippingOrders(this.shipmentForReport.id);
      this.getShipmentOrdersDetailsForShipmentId(this.shipmentForReport.id);
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

  async GetShipmentDetails(ShipmentId: number) {
    await this.shipmentManagementService.GetShipmentDetails(ShipmentId).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          var shipmentDetail = result.data[0];
          if (shipmentDetail) {
            this.naftaReport.shipDate = shipmentDetail.shipDate;
            this.naftaReport.carrierName = shipmentDetail.carrierName;
            this.naftaReport.equipment = shipmentDetail.equipment;
            this.naftaReport.shipmentNumber = shipmentDetail.shipmentNumber;
            this.naftaReport.trailerNumber = shipmentDetail.trailerNumber;
            this.naftaReport.trailerSealNumber = shipmentDetail.trailerSealNumber;

          }
        } else {
          this.toastrService.error("Error while loading data. Please try again later.");
        }
      })
      .catch((err) => {
        this.toastrService.error("Error while loading data.")
        console.log(err);
      });

  }

  async GetShippingOrdersDetails(shipmentId: number) {
    await this.shipmentManagementService.GetShippingOrdersDetails(shipmentId).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          this.shipmentOrdersDetail = result.data;
          
        } else {
          this.toastrService.error("Error while loading data. Please try again later.");
        }
      })
      .catch((err) => {
        this.toastrService.error("Error while loading data.")
        console.log(err);
      });
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
              naftaReport.toLocation = this.getToLocation(order);;
              naftaReport.fromLocation = this.getFromLocation(order);;
              naftaReport.billToLocation = this.getBillToLocation(order);
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
                  this.toastrService.error("Error while loading data. Please try again later.");
                }
              })
              .catch((err) => {
                this.toastrService.error("Error while loading data.")
                console.log(err);
              });
          }
        } else {
          this.toastrService.error("Error while loading data. Please try again later.");
        }
      })
      .catch((err) => {
        this.toastrService.error("Error while loading data.")
        console.log(err);
      });
   
  }

  getToLocation(order: any) {
    var location = new ShipmentNaftaLocationInfo();
    location.locationId = order.toLocationID;
    location.name = order.toLocationName;
    this.getLocationAddressList(location.locationId, "Location", location, "Shipping Address");
    return location;
  }
  getFromLocation(order: any) {
    var location = new ShipmentNaftaLocationInfo();
    location.locationId = order.fromLocationID;
    location.name = order.fromLocationNameGrid;
    this.getLocationAddressList(location.locationId, "Location", location, "Shipping Address");
    return location;
  }

  getBillToLocation(order: any) {
    var location = new ShipmentNaftaLocationInfo();
    location.locationId = order.toLocationID;
    location.name = order.fromLocationNameGrid;
    this.locationService.getLocationById(location.locationId).subscribe(result => {
      const rowList = result.data;
      if (!!rowList) {
        this.getLocationAddressList(rowList.organizationId, "Organization", location, "Bill to address");
      }
    });
    
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
 async getShipmentOrdersDetailsForShipmentId(shipmentId: number) {
   await this.shipmentManagementService.GetShipmentOrderDetailsforSID(shipmentId).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data && result.data[0]) {
          this.naftaReport.fromCarrierInTime = result.data[0].fromCarrierInTime;
          this.naftaReport.fromCarrierOutTime = result.data[0].fromCarrierOutTime;
        } else {
          this.toastrService.error("Error while loading data. Please try again later.");
        }
      })
     .catch((err) => {
       this.toastrService.error("Error while loading data.")
       console.log(err);
     });
  }

  getTotalQuantity() {
    if (this.shipmentOrdersDetail && this.shipmentOrdersDetail.length > 0) {
      return this.shipmentOrdersDetail.reduce(function (tot, record) {
        return tot + record.orderQuantity;
      }, 0);
    }
    return 0;
  }
  getTotalWeight() {
    if (this.shipmentOrdersDetail && this.shipmentOrdersDetail.length > 0) {
      return this.shipmentOrdersDetail.reduce(function (tot, record) {
        return tot + (parseInt(record.weight) * parseInt(record.orderQuantity));
      }, 0);
    }
    return 0;
  }

  getMatName(name: string) {
    if (name.startsWith("PL-") || name.startsWith("TL-")) {
      return name.split("-")[1];
    }
    return name;
  }
}
