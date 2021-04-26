import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationFunctionViewModel } from '../../../../core/models/LocationFunction';
import { AuthService } from '../../../../core';
import { BusinessPartnerService } from '../../../../core/services/business-partner.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';


@Component({
  selector: 'app-add-edit-business-partner-type-popup',
  templateUrl: './add-edit-business-partner-type-popup.component.html',
  styleUrls: ['./add-edit-business-partner-type-popup.component.css']
})
export class AddEditBusinessPartnerTypePopupComponent implements OnInit {

  locationFunctionViewModel: LocationFunctionViewModel = new LocationFunctionViewModel();

  constructor(
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private bpService: BusinessPartnerService,
    private authenticationService: AuthService
  ) {
    this.clientId = this.authenticationService.currentUserValue.ClientId;
  }
  clientId: number;
  @Input() isEdit: boolean;
  @Input() iDs: string;
  ngOnInit(): void {
    this.getBusinessPartnerTypeList();
  }
  ngAfterViewInit(): void {
    this.bpService.getLocationFunctionById(Number(this.iDs))
      .subscribe(
        result => {
          if (result.data != null) {            
            this.locationFunctionViewModel.name = result.data.name
            this.locationFunctionViewModel.id = result.data.id
            this.isValidated = 1;
            
          }

        })
  }

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  addBpType() {
    
    this.checkDuplicate();
    if (this.isDuplicate == 1) {
      return;
    }
    
    this.locationFunctionViewModel.clientId = this.clientId;
    if (!this.isEdit) {
      this.locationFunctionViewModel.code = this.locationFunctionViewModel.name.replace(/\s/g, "");
    }
    
    
    this.locationFunctionViewModel.updateDateTimeBrowser = new Date(new Date().toString());
    this.locationFunctionViewModel.createDateTimeBrowser = new Date(new Date().toString());
    this.locationFunctionViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
    
    if (!!this.iDs && this.isEdit) {
      this.bpService.updateBusinessPartnerType(this.locationFunctionViewModel)
        .subscribe(
          data => {
            if (data.data != null) {
              
              this.passEntry.emit(1);
              this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
              this.activeModal.close();
             
            }

          });
    }
    else {
      this.bpService.saveBusinessPartnerType(this.locationFunctionViewModel)
        .subscribe(
          data => {
            if (data.data != null) {
              
              this.passEntry.emit(1);
              this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
              this.activeModal.close();
              
            }

          });
    }
   
    
    
  }
  extractName(type: string): boolean {
    if (this.isEdit) {
      var abc = this.businessPartnerTypeList.filter(item => item.name.toLowerCase() == type.toLowerCase().trim());
      if (abc.length > 0) {
        if (abc[0].id == Number(this.iDs)) {
          return false;
        }
        else
        return true;
      }
      else {
       
        return false;
      }
    }
    else {
      var abc = this.businessPartnerTypeList.filter(item => item.name.toLowerCase() == type.toLowerCase().trim());
      if (abc.length > 0) {

        return true;
      }
      else {
        
        return false;
      }
    }
    
  }
  checkDuplicate(): number {
    
    if (this.extractName(this.locationFunctionViewModel.name)) {
      this.isDuplicate = 1;
      
    } else {
      this.isDuplicate = 0;
    }

    return this.isDuplicate;
  }
  isName: number;
  isValidated: number = 0;
  isDuplicate: number;
  validation(type: string = ''): boolean {

    let isValidated: boolean = true;
    if (!!!this.locationFunctionViewModel.name) {
      this.isName = 1;
      isValidated = false;
    } else {
      this.isName = 0;
    }
       

    
    if (this.isName === 0) {


      this.isValidated = 1;

    }
    else {
      this.isValidated = 0;
    }
    return isValidated;

  }

  filterValue: string;
  businessPartnerTypeList: any;
  getBusinessPartnerTypeList() {
    this.locationFunctionViewModel.clientId = this.clientId;
    this.locationFunctionViewModel.filterOn = this.filterValue;
    this.locationFunctionViewModel.pageSize = 0;
    this.bpService.getAllBusinessPartnerType(this.locationFunctionViewModel).subscribe(result => {
      this.businessPartnerTypeList = result.data;
      
    });
  }
}
