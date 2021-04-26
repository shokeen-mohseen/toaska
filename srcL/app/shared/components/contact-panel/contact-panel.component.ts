import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from '../modal-content/add-contact/add-contact.component';
import { CommonCallListViewModel, LocationConstant, LocationContactViewModel } from '../../../core/models/Location';
import { CustomerByLocationService } from '../../../core/services/customer-by-location.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonActionType } from '../../../core/constants/constants';
import { AuthService, UseraccessService } from '@app/core';
import { ServerChartValues } from '../../../modules/manage-partograph/modals/input-chart';
import { Subject } from 'rxjs';
import { ConfirmDeleteTabledataPopupComponent } from '../confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { Router } from '@angular/router';
import { projectkey } from '../../../../environments/projectkey';

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css']
})
export class ContactPanelComponent implements OnInit, OnChanges {

  modalRef: NgbModalRef;
  locationContactViewModel: LocationContactViewModel = new LocationContactViewModel();
  //commonCallListViewModel: CommonCallListViewModel = new CommonCallListViewModel();
   isEditRights: boolean;
  @Input() locationContactList: LocationContactViewModel[] = [];
  isContactAllSelected: boolean = false;
  @Input() mobilePhoneCode: string;
  @Input() PageActionType: string;
  @Input("getContactById") getContactById: number;
  buttonEnableDisable: boolean = true; editbuttonEnableDisable: boolean = true;

  //@Input() commonId:number;

  contactIds: string;

  @Output() listLength: EventEmitter<any> = new EventEmitter<any>();

  @Input() changing: Subject<any>;
  constructor(private router: Router,public modalService: NgbModal, private toastrService: ToastrService,
    private useraccessService: UseraccessService,
    private customerbylocationService: CustomerByLocationService,
    private authenticationService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.getContactById && changes.getContactById.previousValue) {
      this.getLocationContact();
      this.ModulePermission();
    }
  }

  ngOnInit(): void {
    this.ModulePermission();
    
  }
  ngAfterViewInit(): void {
    this.getLocationContact();
    this.ModulePermission();
  }
  btn: any
  btn1: any
  btn2: any
  btn3: any
  btn4: any
  openContact(action) {
    if (action === ButtonActionType.AddContact) {
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = this.PageActionType;
      this.modalRef.componentInstance.ContactById = this.getContactById;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      //this.modalRef.componentInstance.getContactById = this.getContactById;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getLocationContact();
        this.buttonEnableDisable = true;
        this.editbuttonEnableDisable = true;
      });
      this.btn = 'btn1'
    }
    else if (action === ButtonActionType.EditContact) {

      if (!!!this.contactIds) {
        this.toastrService.warning('Please select at least one Contact');
        return;
      } else if (!!this.contactIds) {
        const splitContactIds = this.contactIds.split(',');
        if (splitContactIds.length > 1) {
          this.toastrService.warning('Please select only one Contact for editing');
          return;
        }
      }

     
      this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.contactActionType = this.PageActionType;
      this.modalRef.componentInstance.ContactById = this.getContactById;
      this.modalRef.componentInstance.OrganizationId = this.getContactById;
      this.modalRef.componentInstance.isEditRights = this.isEditRights;
      //this.modalRef.componentInstance.patientId = this.getContactById;
      this.modalRef.componentInstance.contactIds = this.contactIds;
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getLocationContact();
        this.buttonEnableDisable = true;
        this.editbuttonEnableDisable = true;
      });
      //this.btn = 'btn11'
      this.btn = 'btn2'
    }
    else if (action === "deleteContactButton") {
      //this.btn = 'btn12'
      this.btn = 'btn4'

      if (!this.isEditRights) {
         this.buttonEnableDisable = true;
         this.toastrService.success(GlobalConstants.Authentication_message);
      }
      if (!!!this.contactIds) {
        this.toastrService.warning(GlobalConstants.select_checkbox_messageon_grid);
        return;
      }

      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.result.then((result) => {
        this.customerbylocationService.deleteContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId, this.PageActionType).subscribe(x => {
          if (x.message == "Success" || x.Message == "Success") {
            this.getLocationContact();
            this.toastrService.success(GlobalConstants.Contact_delete_Record_message);
            this.buttonEnableDisable = true;
            this.editbuttonEnableDisable = true;
          }
          else {
            this.toastrService.warning(GlobalConstants.error_message);
          }
        }, error => {
            this.toastrService.error(GlobalConstants.error_message);
        });
      }, (reason) => {
      });

      //if (confirm("Are you sure you want to delete the selected records??")) {

      //  this.customerbylocationService.deleteContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId, this.PageActionType).subscribe(x => {
      //    this.getLocationContact();
      //    this.toastrService.success('User Contact deleted successfully');
      //    this.buttonEnableDisable = true;
      //    this.editbuttonEnableDisable = true;
      //    //if (this.PageActionType == "Patient") {
      //    //  this.getLocationContact();
      //    //}
      //  });

        //this.customerbylocationService.deleteUserContactListByIds(this.idsContactDeleted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
        //  this.getLocationContact();
        //  this.toastrService.success('User Contact deleted successfully');
        //});
      //}
    }
    else if (action === "refresh") {
      this.btn = 'btn3'
    }
  }

  ModulePermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;

          if (data != null) {
            if (data != undefined) {
              if (data.length > 0) {

                if (data[0].PermissionType == "Read and Modify") {
                  this.isEditRights = true;
                  this.customerbylocationService.Permission = true;
                }
                else {
                  this.isEditRights = false;
                  this.customerbylocationService.Permission = false;
                }

              }
              else {
                this.isEditRights = false;
              }
            }
            else {
              this.isEditRights = false;
              
            }
          }
          else {
            this.isEditRights = false;

          }
        }
      });

  }

  //openPopup(action) {
  //  if (action === "addContactButton") {
  //    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  //    //let commonCallListViewModel = new CommonCallListViewModel();

  //    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
  //      this.getLocationContact();
  //    });
  //    this.btn = 'btn10';
  //  }

  //}


  getLocationContact() {
   
    let commonCallListViewModel = new CommonCallListViewModel()
    commonCallListViewModel.ContactActionType = this.PageActionType;

    commonCallListViewModel.ContactById = this.getContactById

    //commonCallListViewModel.LocationId = this.getContactById;
    //commonCallListViewModel.ContactById = this.getContactById;
    //if (this.PageActionType == "Patient") {
    //  commonCallListViewModel.PatientID = this.getContactById;
      
    //}
    this.locationContactList = [];
    this.customerbylocationService.getLocationContactList(commonCallListViewModel)
      .pipe()
      .subscribe(
        result => {
          this.isContactAllSelected = false;
          const rowList = result.data;
          if (rowList) {
            if (rowList.length > 0) {
              this.mobilePhoneCode = !!rowList[0].mobilePhone ? rowList[0].mobilePhoneCountryCode + " " + rowList[0].mobilePhone :
                !!rowList[0].workPhone ? rowList[0].workphonecountrycode + " " + rowList[0].workPhone : '';


              rowList.filter(item => {

                let locationContactExist = new LocationContactViewModel();
                locationContactExist = item;
                locationContactExist.isSelected = false;

                if (locationContactExist.workPhone == "" || locationContactExist.workPhone == null) {
                  locationContactExist.workPhoneCountryCode = ''
                }
                else {
                  locationContactExist.workPhoneCountryCode = '(' + locationContactExist.workPhoneCountryCode + ') '
                    + locationContactExist.workPhone
                }


                if (locationContactExist.mobilePhone == "" || locationContactExist.mobilePhone == null) {
                  locationContactExist.mobilePhoneCountryCode = ''
                }
                else {
                  locationContactExist.mobilePhoneCountryCode = '(' + locationContactExist.mobilePhoneCountryCode + ') '
                    + locationContactExist.mobilePhone
                }
                this.locationContactList.push(locationContactExist);
                //this.locationContactList.forEach(x => x.contactType = this.extractName(x.contactTypeId));  

              });
            }
            this.listLength.emit(this.locationContactList.length);
          }
          else {
            this.listLength.emit(0);
          }
        
        
        },
        error => {
          console.log("error in getting contacts")
          this.listLength.emit(0);
        }
      );

  }
  //extractName(type: number = 0): string {
    
  //  var abc = this.contactTypelist.filter(item => item.id == Number(type));
  //  if (abc.length > 0) {
  //    return abc[0].name;
  //  }
  //  else {
  //    return "";
  //  }
  //}
  //contactTypelist = [];
  //error: string;
  //getContactType() {
  //  this.commonCallListViewModel.ContactActionType = this.PageActionType;
  //  this.commonCallListViewModel.ClientID = this.authenticationService.currentUserValue.ClientId;
  //  this.useraccessService.getContactType(this.commonCallListViewModel)
  //    .subscribe(result => {
  //      if (result) {
  //        // Handle result
  //        this.contactTypelist = result.data;
          
  //      }
  //    },
  //      error => {
  //        this.error = error;
  //        this.toastrService.error(this.error);
  //      }
  //    );
  //}

  selectContactAll(check: any) {
    
    this.isContactAllSelected = check.target.checked;
    this.locationContactList.forEach(row => {
      row.isSelected = this.isContactAllSelected;

    });
    this.isContactAllSelected = (this.locationContactList.length === (this.locationContactList.filter(x => x.isSelected == true).length));

    this.setUserContactCheckBoxData();
  }
  interface: boolean = false;
  selectContactCheckbox(value: any) {
    this.buttonEnableDisable = true;
    this.locationContactList.forEach(row => {
      if (row.userContactId == value.userContactId)
        row.isSelected = !value.isSelected;

    });

    this.isContactAllSelected = (this.locationContactList.length === (this.locationContactList.filter(x => x.isSelected == true).length));

    this.setUserContactCheckBoxData();
  }

  idsContactDeleted: string = '';
  setUserContactCheckBoxData() {
    this.interface = false;
    let iDs: string = '';
    this.contactIds = '';
    this.idsContactDeleted = '';
    let i = 0;

    this.locationContactList.filter(x => {
      if (x.isSelected == true) {
        i++;
        if (x.ContactActionType == null || x.ContactActionType =="" ) {
          x.ContactActionType = this.PageActionType;
        }

        iDs += `${x.userContactId},`;
        this.idsContactDeleted += `${x.userContactId},`;

       
        if (x.updatedBy != null) {
          if (x.updatedBy == "Interface" || x.updatedBy == "interface") {
            this.interface = true;
          }
        }
      }
    });

    if (iDs.length > 0) {

      iDs = iDs.substring(0, iDs.length - 1);
      this.idsContactDeleted = this.idsContactDeleted.substring(0, this.idsContactDeleted.length - 1);
      this.buttonEnableDisable = false;
      this.editbuttonEnableDisable = false;;
      this.contactIds = iDs;
      if (i>1) {
        this.editbuttonEnableDisable = true;
      }


      if (!this.isEditRights) {
        this.buttonEnableDisable = true;
       // this.toastrService.success(GlobalConstants.Authentication_message);
      }
    }
    else {
      this.buttonEnableDisable = true;
      this.editbuttonEnableDisable = true;
    }

    if (this.interface) {
      this.buttonEnableDisable = true;
    }
  }
}
