import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocationAddressCallListViewModel } from '../../../../core/models/Location';
import { BolReportOrders, BolReportShipment, ReportLocationInfo } from '../../../../core/models/shipment-bol-report.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';
import { LocationService } from '../../../../core/services/location.service';
import { PdfService } from '../../../../core/services/pdf.service';
import { shipmentManagementService } from '../../../../core/services/shipment-management.service';

@Component({
  selector: 'viewbol',
  templateUrl: './viewbol.component.html',
  styleUrls: ['./viewbol.component.css']
})
export class ViewBolComponent implements OnInit{
  @Input() shipmentForReport;

  bolReport = new BolReportShipment();
  bolReportOrders: BolReportOrders[] = [];
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
      await this.GetShipmentDetails(this.shipmentForReport.id);
      this.GetShippingOrdersDetails(this.shipmentForReport.id);
      this.GetShippingOrders(this.shipmentForReport.id);
      this.getShipmentOrdersDetailsForShipmentId(this.shipmentForReport.id);
    }
  }
  downloadPdf() {
    var data = document.getElementById('viewBolReport');
    this.pdfService.openPDFFromHTMLElement(data, "bolreport");
     
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
            this.bolReport.shipDate = shipmentDetail.shipDate;
            this.bolReport.carrierName = shipmentDetail.carrierName;
            this.bolReport.equipment = shipmentDetail.equipment;
            this.bolReport.shipmentNumber = shipmentDetail.shipmentNumber + '.' + shipmentDetail.shipmentVersion;
            this.bolReport.trailerNumber = shipmentDetail.trailerNumber;
            this.bolReport.trailerSealNumber = shipmentDetail.trailerSealNumber;
            this.bolReport.shipmentVersion = shipmentDetail.shipmentVersion;

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

  async GetShippingOrdersDetails(shipmentId: number) {
    await this.shipmentManagementService.GetShipmentOrdersDetailsForBOL(shipmentId).toPromise()
      .then(result => {
        if (result.statusCode == 200 && result.data) {
          this.shipmentOrdersDetail = result.data;
          
        } else {
          this.toastrService.error("Error while loading data. Please contact Tech Support");
        }
      })
      .catch((err) => {
        this.toastrService.error("Error while loading data. Please contact Tech Support")
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
              var bolReportOrder = new BolReportOrders();
              bolReportOrder.orderId = order.orderid;
              bolReportOrder.orderNumber = order.orderNumber;
              bolReportOrder.toLocation = this.getToLocation(order);;
              bolReportOrder.fromLocation = this.getFromLocation(order);;
              bolReportOrder.billToLocation = this.getBillToLocation(order);;
              bolReportOrder.mustArriveByDate = order.mustArriveByDate;
              bolReportOrder.transportationComment = order.transportationComment;
              bolReportOrder.spanishTransportationComment = order.spanishTransportationComment;
              bolReportOrder.loadingComment = order.loadingComment;
              bolReportOrder.spanishLoadingComment = order.spanishLoadingComment;
              bolReportOrder.purchaseOrderNumber = order.purchaseOrderNumber;
              this.bolReportOrders.push(bolReportOrder)
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

  getToLocation(order: any) {
    var location = new ReportLocationInfo();
    location.locationId = order.toLocationID;
    this.locationService.getLocationById(location.locationId).subscribe(result => {
      const rowList = result.data;
      if (!!rowList) {
        location.name = rowList.name;
      }
    });
    this.getLocationAddressList(location.locationId, "Location", location, "ShippingAddress");
    return location;
  }
  getFromLocation(order: any) {
    var location = new ReportLocationInfo();
    location.locationId = order.fromLocationID;
    this.locationService.getLocationById(location.locationId).subscribe(result => {
      const rowList = result.data;
      if (!!rowList) {
        location.name = rowList.name;
      }
    });
   
    this.getLocationAddressList(location.locationId, "Location", location, "ShippingAddress");
    return location;
  }

  getBillToLocation(order: any) {
    var location = new ReportLocationInfo();
    location.locationId = order.toLocationID;
    this.locationService.getLocationById(location.locationId).subscribe(result => {
      const rowList = result.data;
      if (!!rowList) {
        location.name = rowList.name;
        this.getLocationAddressList(rowList.organizationId, "Organization", location, "BillTo");
      }
    });
    return location;
  }
  getLocationAddressList(addressId: number, type: string, locationInfo: ReportLocationInfo, addressType: string) {

    let commonCallListViewModel = new LocationAddressCallListViewModel()
    commonCallListViewModel.AddressActionType = type;
    commonCallListViewModel.AddressbyId = addressId;
    this.customerbylocationService.getUserAddressList(commonCallListViewModel)
      .subscribe(result => {
        const rowList = result.data;
        if (!!rowList) {
          rowList.filter(item => {
            if (item.addressTypeCode == addressType) {
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
          this.bolReport.fromCarrierInTime = result.data[0].fromCarrierInTime;
          this.bolReport.fromCarrierOutTime = result.data[0].fromCarrierOutTime;
        } else {
          this.toastrService.error("Error while loading data. Please contact Tech Support");
        }
      })
     .catch((err) => {
       this.toastrService.error("Error while loading data. Please contact Tech Support")
       console.log(err);
     });
  }

  getTotalQuantity() {
    if (this.shipmentOrdersDetail && this.shipmentOrdersDetail.length > 0) {
      return this.shipmentOrdersDetail.reduce(function (tot, record) {
        if (isNaN(parseInt(record.orderQuantity))
          || (parseInt(record.orderQuantity) == 1
              && (isNaN(parseInt(record.weight)) || parseInt(record.weight) == 0))) {
          return tot;
        }
        return tot + record.orderQuantity;
      }, 0);
    }
    return 0;
  }
  getTotalWeight() {
    if (this.shipmentOrdersDetail && this.shipmentOrdersDetail.length > 0) {
      return this.shipmentOrdersDetail.reduce(function (tot, record) {
        if (isNaN(parseInt(record.weight)) || isNaN(parseInt(record.orderQuantity))) {
          return tot;
        }
        return tot + (parseInt(record.weight) * parseInt(record.orderQuantity));
      }, 0);
    }
    return 0;
  }

  getMatName(name: string) {
    // currently done in SP function : FN_GetMaterialName
    //if (name && (name.startsWith("PL-") || name.startsWith("TL-"))) {
    //  return name.split("-")[1];
    //}
    return name;
  }

  getShipmentOrdersDetailById(id) {
    return this.shipmentOrdersDetail.filter(x => x.orderID == id);
  }
}
