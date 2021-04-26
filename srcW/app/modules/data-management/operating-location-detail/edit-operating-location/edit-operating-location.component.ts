import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperatingLocationSessionService } from '../services/hospital-sendnotification.service';
import { OperatingLocation } from '../model/operating-location';
import moment from 'moment';
import { HospitalInformationService } from '../../../manage-partograph/services/hostipat-information.service';
import { OperatingLocationService } from '../services/operating-location.service';
import { HospitalType } from '../../../manage-partograph/modals/hospital-information';
import { GlobalConstants } from '../../../../core/models/GlobalConstants ';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-edit-operating-location',
  templateUrl: './edit-operating-location.component.html',
  styleUrls: ['./edit-operating-location.component.css']
})
export class EditOperatingLocationComponent implements OnInit {
  masInventoryWarehouse: any; isShippingAdress: number;
  preferredEquipmentListCount: number = 0; InputLocationId: number;
  statOfCharacteristics: string = "0/0";
  listcontatLen: number; listaddresstLen: number; hospitalType: HospitalType; pageActionType = "Location";
  //hospitalinfo = new PatientInfo(); contactaddressObject: ContactAddressPhysicianInfo;
  lastUpdate: string; lastUpdatedBy: string; IsLastUpdated: boolean = false;
  isAdded: boolean = true; organizationId: number = 0; isSubmitted: boolean = false;
  isEditEnable: boolean = true; next: number = 0; id: number; IssetupCompleted: boolean = false;
  dataSource: any = []; SetupCompleteDate: string;
  operationingLocat = new OperatingLocation();
  OrgLevel: number = 3; viewMode: boolean = false; disabled: boolean = true;
  ControlType = "ddl"; PageActionType = "";
  currentUser: User; p2form: FormGroup;
  modalRef: NgbModalRef; itemLocationFunctionList = [];
  itemLocationFunction = [];
  constructor(private hospitalInformationService: HospitalInformationService,
              private operatingLocationSessionService: OperatingLocationSessionService,
              private formBuilder: FormBuilder,
              private authenticationService: AuthService,
              private toast: ToastrService,
              public router: Router,
              private operattingLocationService: OperatingLocationService,
              public modalService: NgbModal) {

    this.currentUser = this.authenticationService.currentUserValue;
    this.hospitalType = { clientID: this.currentUser.ClientId, PageActionType: "OP" } as HospitalType;
    this.listcontatLen = 0;
    this.listaddresstLen = 0;
  }


  itemListA = [];
  itemListB = [];
  settings = {};
  //selectedItemsA = [];
  settingsA = {};
  countA = 3;

  selectedItemsB = [];
  settingsB = {};

  count = 3;

  userData = {
    listA: ''
  };

  EditButtonRights: boolean = false;
  ngOnInit(): void {
    let idsn: any = this.operatingLocationSessionService.GetOperatingLocationSetupIds();
    if (idsn != null) {
      this.id = Number(idsn.split(',')[0]);
    }
    this.LoadOperationLocationFunction(this.hospitalType);

    this.EditButtonRights = this.operatingLocationSessionService.GetEditableRights();

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };

    this.settingsB = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    this.buildForm();
    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
  }
  private buildForm(): void {

    this.p2form = this.formBuilder.group(
      {
        LocationFunction: [[], [Validators.required]], // add validators here
        OrganizationId: [null, [Validators.required]],
        LocationDescription: [],
        SetupCompleteBy: [''],
        SetupCompletedStatus: [{ value: false, disabled: true }],
        Active: ['Active']
      }
    );
  }

  getpreferredEquipmentCount(value: any) {
    this.preferredEquipmentListCount = value;
  }
  
  GetOrganization(d: any) {
    if (d == 0) {
      this.p2form.get("OrganizationId").setValue(null);
    }
    else {
      this.p2form.get("OrganizationId").setValue(d);
    }

    this.organizationId = this.p2form.get("OrganizationId").value;
  }

  LoadOperationLocationFunction(objserve) {
    
    this.hospitalInformationService.GetLocationFunction(objserve).subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemLocationFunctionList.push({

            id: datalist[i].id,
            itemName: datalist[i].name

          })
        }

        // this.p2form.get('LocationTypeData').setValue(datalist);

        this.itemLocationFunction = datalist;
        let idsn: any = this.operatingLocationSessionService.GetOperatingLocationSetupIds();
        if (idsn != null) {
          this.UpdateDataSource_LoadAddedListAPI(idsn);
        }
      }

    },
      error => {
        // .... HANDLE ERROR HERE
        console.log(error);

      }

    );
  }

  UpdateDataSource_LoadAddedListAPI(ids: any) {

    var data = ('{"IDs": "' + ids + '" }');

    this.operattingLocationService.GetAddedOperatingLocationList(data).subscribe(result => {

      let res = result.data;
      if (res != null || res != undefined) {
        console.log(res)
        this.DataSource(res)
      }

    });
  }
  onAddItem(data: string) {

    //this.p2form.get('LocationTypeData').setValue({ "id": this.count, "itemName": data });
    //this.p2form.get('InstituteNameData').setValue({ "id": this.count, "itemName": data });

  }

  GetCountCotact(event): number {
    
    this.listcontatLen = event;
     return this.listcontatLen

  }

  setStatOfCharacteristics(stat: string) {
    this.statOfCharacteristics = stat;
  }

  GetCountAddress(event): number {
    this.listaddresstLen = event;
    return this.listaddresstLen
  }
  SaveOperatingLocation() {
    let now = moment();

    let hospitalModel: any = [];
    let data: any[] = this.p2form.get("LocationFunction").value;

    console.log(this.p2form.get("LocationFunction").value);

    this.operationingLocat.UpdateDateTimeBrowser = now.format();
    this.operationingLocat.UpdatedBy = this.authenticationService.currentUserValue.LoginId;
    //this.operationingLocat.CreatedBy = this.authenticationService.currentUserValue.LoginId;
    //this.operationingLocat.CreateDateTimeBrowser = now.format();

    this.operationingLocat.ClientId = this.authenticationService.currentUserValue.ClientId;
   
    this.operationingLocat.IsActive = true;
    this.operationingLocat.IsDeleted = false;
    this.operationingLocat.LocationFunctionId = data[0].id;
    this.operationingLocat.Description = this.p2form.get("LocationDescription").value;
    this.operationingLocat.OrganizationId = this.p2form.get("OrganizationId").value;
    this.operationingLocat.SourceSystemID = 1;
   
    //hospitalModel.push(this.hospitalSetting);

    if (this.p2form.get("SetupCompletedStatus").value) {
      this.operationingLocat.SetupComplete = true;
      this.operationingLocat.SetupCompleteBy = this.authenticationService.currentUserValue.LoginId;
      this.operationingLocat.SetupCompleteDateTime = now.format();
    }
    else {
      this.operationingLocat.SetupComplete = false;
      this.operationingLocat.SetupCompleteBy = null;
      this.operationingLocat.SetupCompleteDateTime = null;
    }

    if (this.id > 0) {
      this.operationingLocat.id = this.id;
      this.operattingLocationService.UpdateOperationLocationSetup(this.operationingLocat).subscribe(data => {

        if (data.data != null || data.data != undefined) {
          let idsn: any = this.operatingLocationSessionService.GetOperatingLocationSetupIds();
          this.UpdateDataSource_LoadAddedListAPI(idsn);
          this.toast.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
          window.scroll(0, 0);
          this.isEditEnable = false;
        }
        else {
          this.toast.success(GlobalConstants.FAILED_MESSAGE);
        }


      });

    }

  }

  isUpdateChange() {
    //this.isEnableforupdate = false;
    if (this.EditButtonRights) {
      this.isSubmitted = false;

      if (this.p2form.invalid) {
        this.IssetupCompleted = false;
        this.p2form.get("SetupCompletedStatus").disable();

        return;
      }

      if (!this.p2form.invalid) {
        //this.IssetupCompleted = false;
       // this.p2form.get("SetupCompletedStatus").disable();

        return;
      }
      else {

        if (this.organizationId > 0 && this.masInventoryWarehouse != null) {
         // this.IssetupCompleted = true;
          this.p2form.get("SetupCompletedStatus").enable();
        }
        else {
          this.toast.warning("Setup not can't be completed due set organization and mas inventory warehouse");
        }
        
      }
    }
  }

  isUpdateChangeCheckBox() {
    //this.isEnableforupdate = false;
    if (this.EditButtonRights) {
      
      if (this.p2form.invalid) {
        this.IssetupCompleted = false;
        this.p2form.get("SetupCompletedStatus").disable();

        return;
      }
      else {

        if (this.organizationId > 0 && this.masInventoryWarehouse != null && this.isShippingAdress==1) {
          this.IssetupCompleted = true;
          this.p2form.get("SetupCompletedStatus").enable();
          this.isSubmitted = false;
        }
        else {
          this.p2form.get("SetupCompletedStatus").setValue(false);
          this.toast.warning("Setup not can't be completed due to set organization and mas inventory warehouse");
        }

      }
    }
  }
  selectedHospital(index: number, mode: any) {
    this.isEditEnable = true;
    this.isSubmitted = true;
    this.next = index;
    if (mode == 0) {
      this.isSubmitted = true;
    }
    if (!this.isAdded && mode == 0) {
      if (this.next + 1 == this.dataSource.length) {
        this.isEditEnable = true;
      }
      else {
        this.isEditEnable = false;
      }
    }
    else {
      this.isEditEnable = false;
    }
    this.SetFormFields(this.next);
  }
  DataSource(row: any[]) {
    
    this.dataSource = []; let index = 0;

    for (let i = 0; i < row.length; i++) {

      if (row[i].id == this.id) {
        index = i;
      }

      this.dataSource.push({
        locationFunction: row[i].locationFunction,
        id: row[i].locationId,
        locationFunctionId: row[i].locationFunctionID,
        locationDescription: row[i].locationDescription ,
        organizationId: row[i].organizationID,
        isActive: row[i].isActive,
        setupCompleteStatus: row[i].setupComplete,
        setupCompleteDateTime: row[i].setupCompletedDateTime,
        setupCompleteBy: row[i].setupCompleteBy,
        lastUpdateBy: row[i].updatedBy,
        lastUpdate: row[i].updateDateTimeBrowser,
        masInventoryWarehouse: row[i].masInventoryWarehouse,
        isShippingAdress: row[i].isShippingAdress 
      });
    }

    this.next = index;
    this.id = this.dataSource[index].id;
    this.SetFormFields(index);
  }

  removePatient(index: number) {

    this.dataSource.splice(index, 1);

    this.resetData();
    let ids = "";

    for (let i = 0; i < this.dataSource.length; i++) {
      ids = ids + "," + this.dataSource[i].id;
    }

    if (ids.length > 0) {
      ids = ids.substring(1, ids.length);
      //console.log(patientIds)
      this.operatingLocationSessionService.SetSessionIds(ids);
    }
    else {
      this.dataSource = [];

      location.reload();

      return;
    }

    if (ids.length) {

      this.UpdateDataSource_LoadAddedListAPI(ids);
    }
    else {


    }




  }

  SetFormFields(index) {

    if (index < this.dataSource.length) {
      this.id = this.dataSource[index].id;
      this.isEditEnable = false;
      let setOpsLocationSelected: any[] = this.itemLocationFunctionList.filter(u => u.id == this.dataSource[index].locationFunctionId);

      this.p2form.get("LocationFunction").setValue([{ "id": this.dataSource[index].locationFunctionId, "itemName": setOpsLocationSelected[0].itemName }]);

      //  this.p2form.get("LocationTypeData").setValue(this.dataSource[index].locationFunctionId);
      this.p2form.get("OrganizationId").setValue(this.dataSource[index].organizationId);
      this.organizationId = this.dataSource[index].organizationId;
      this.p2form.get("LocationDescription").setValue(this.dataSource[index].locationDescription);

      this.masInventoryWarehouse = this.dataSource[index].masInventoryWarehouse;
      this.isShippingAdress = this.dataSource[index].isShippingAdress;
      if (this.dataSource[index].masInventoryWarehouse != null && this.dataSource[index].organizationId > 0 && this.dataSource[index].setupCompleteStatus == true && this.isShippingAdress == 1) {
        this.p2form.get("SetupCompletedStatus").setValue(this.dataSource[index].setupCompleteStatus);
        this.IssetupCompleted = true;
        this.p2form.get("SetupCompletedStatus").enable();
        this.p2form.get('SetupCompleteBy').setValue(this.dataSource[index].setupCompleteBy);
      }
      else {
        this.p2form.get("SetupCompletedStatus").setValue(false);
        this.IssetupCompleted = false;
        this.p2form.get("SetupCompletedStatus").setValue(false);
        this.p2form.get("SetupCompletedStatus").enable();
        this.p2form.get('SetupCompleteBy').setValue('');
        this.SetupCompleteDate = '';
      }
      
      //if (this.dataSource[index].setupCompleteStatus == false || this.dataSource[index].setupCompleteStatus == null || this.dataSource[index].setupCompleteStatus == undefined) {
        
      //}
      //else {
        

      //}
      if (this.dataSource[index].isActive) {
        this.p2form.get('Active').setValue('Active');
      }
      else if (this.dataSource[index].isActive == null || this.dataSource[index].isActive == undefined) {
        this.p2form.get('Active').setValue('Active');
      }
      else {
        this.p2form.get('Active').setValue('Inactive');
      }


      if (this.IssetupCompleted) {
        if (this.dataSource[index].setupCompleteDateTime != null) {
          let m2 = moment(this.dataSource[index].setupCompleteDateTime).format('MMMM DD, YYYY hh:mm A');

          let timeZone1 = moment.tz.guess();
          var timeZoneOffset1 = new Date(this.dataSource[index].setupCompleteDateTime).getTimezoneOffset();
          timeZone1 = moment.tz.zone(timeZone1).abbr(timeZoneOffset1);

          this.SetupCompleteDate = m2 + " " + timeZone1;
        }

      }
      else {
        this.SetupCompleteDate = "";
      }

      let m1 = moment(this.dataSource[index].lastUpdate).format('MMMM DD, YYYY hh:mm A');
      let timeZone = moment.tz.guess();
      var timeZoneOffset = new Date(this.dataSource[index].lastUpdate).getTimezoneOffset();
      timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);

      this.lastUpdate = m1 + " " + timeZone;
      this.lastUpdatedBy = this.dataSource[index].lastUpdateBy;
      this.IsLastUpdated = true;
      this.isSubmitted = true;
      //this.GetLocationContactInfo();
      //this.GetLocationAdressInfo();
    }
    else {
      this.isEditEnable = false;
      this.id = 0;
      //this.AddressInfo = '';
      //this.ContactInfo = '';
      this.IsLastUpdated = false;  this.lastUpdate = '';
      this.lastUpdatedBy = ''; this.id = 0;
      this.p2form.reset(); this.organizationId = 0;
      //this.LoadLocationType(this.hospitalType);
    }

  }
  selectNext(el) {

    this.resetData();

    this.next = this.next + 1;

    this.SetFormFields(this.next);

    el.selectedIndex += 1;
  }
  resetData() {
    this.IsLastUpdated = false;
    this.lastUpdate = '';
    this.lastUpdatedBy = '';
    this.id = 0;
    this.p2form.reset();
    this.organizationId = 0;
    this.SetupCompleteDate = "";
    this.IssetupCompleted = false;
    this.p2form.get("SetupCompletedStatus").disable();
  }
  onAddItemA(data: string) {
    this.countA++;
    this.itemListA.push({ "id": this.countA, "itemName": data });
    //this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    this.isUpdateChange();
    //console.log(item);
    //console.log(this.userData);
    //console.log(this.selectedItemsB);
  }
  OnItemDeSelect(item: any) {
    this.isUpdateChange();
    //console.log(item);
    //console.log(this.userData);
    //console.log(this.selectedItemsB);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    //console.log(items);
  }


  
}
