import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContactComponent } from 'app/shared/components/modal-content/add-contact/add-contact.component'
import { AddUnitDetailComponent } from '../add-unit-detail/add-unit-detail.component';
import { HospitalInformationService } from '../../../services/hostipat-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../../../../core';
import { HospitalType, InstituteName } from '../../../modals/hospital-information';
import { HospitalSetting, HospitalSettingup } from '../../../../../core/models/location-unit';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
import { HospitalNotificationService } from '../../../../../shared/services/hospital-sendnotification.service';
import moment from 'moment';
import { PatientInfo } from '../../../../../core/models/PatientInfo';
import { ContactAddressPhysicianInfo } from '../../../../../core/models/contact-address-physician-info.model';
import { ContactAdressPhysicainInfoService } from '../../../../../core/services/contact-address-physician-info.service';

@Component({

  selector: 'app-add-hospital',
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css']
})
export class AddHospitalComponent implements OnInit {
  hospitalinfo = new PatientInfo(); contactaddressObject: ContactAddressPhysicianInfo;
  lastUpdate: string; lastUpdatedBy: string; IsLastUpdated: boolean = false;
  isAdded: boolean = true; organizationId: number = 0;
  isEditEnable: boolean = true; next: number = 0; id: number;
  dataSource: any = []; SetupCompleteDate: string;

  hospitalSettingupList = new HospitalSettingup();
  hospitalSetting = new HospitalSetting();
  IssetupCompleted: boolean = false;

  OrgLevel: number = 1;
  viewMode: boolean = false;
  ControlType = "ddl";
  PageActionType = "";
  CovidAcceptList: any = [
  {
      value: "Yes",
    name:"Yes"
  },
  {
    value: "No",
      name: "No"
    }

  ];
  modalRef: NgbModalRef;
  currentUser: User;
  hospitalType: HospitalType;
  instituteName: InstituteName;
  locationTypeId: number;
  selectedItems4 = [];
  selectedItems5 = [];
  itemListLocationType = [];
  selectedItems = [];
  p2form: FormGroup;
  itemhospitalLocationTypeList = [];
  iteminstitueNameList = [];
  itemListInstituteName = [];
  itemhospitalLocationTypeSelectedCodeList = [];
  iteminstituteNameSelectedCodeList = [];
  isSubmitted: boolean = false;

  AddressInfo: string;
  ContactInfo: string;
  constructor(private contactAdressPhysicainInfoService: ContactAdressPhysicainInfoService,private hospitalSessionService: HospitalNotificationService, public modalService: NgbModal, private hospitalInformationService: HospitalInformationService,
    private formBuilder: FormBuilder, private authenticationService: AuthService, private toast: ToastrService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.hospitalType = { clientID: this.currentUser.ClientId } as HospitalType;
    this.instituteName = { clientID: this.currentUser.ClientId } as InstituteName;
    this.contactaddressObject = new ContactAddressPhysicianInfo();
    

  }

  itemListA = [];
  itemListB = [];

  selectedItemsA = [];
  settingsA = {};
  settings = {};

  selectedItemsB = [];
  settingsB = {};

  count = 3;


  ngOnInit(): void {

    this.LoadLocationType(this.hospitalType);
    //this.LoadInstituteName(this.instituteName);
    this.buildForm();
   

    this.settingsA = {
      singleSelection: true,
      text: "Select",
      
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

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
        LocationTypeData: [[], [Validators.required]], // add validators here
        OrganizationId:[null, [Validators.required]],
        //InstituteNameData: [[], [Validators.required]], // add validators here
        CovidAccept: ['Yes'],
        HospitalName: [[], [Validators.required]], // required
        HospitalCode: [],
        SetupCompleteBy: [''],
        SetupCompletedStatus: [{ value:false, disabled: true }],
        Active:['Active']
      }
    );
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

  onAddItem(data: string) {

    this.p2form.get('LocationTypeData').setValue({ "id": this.count, "itemName": data });
    this.p2form.get('InstituteNameData').setValue({ "id": this.count, "itemName": data });

  }

  LoadLocationType(objserve) {
    this.hospitalInformationService.GetLocationFunction(objserve).subscribe(data => {

      if (data.data != null || data.data != undefined) {

        let datalist: any[] = data.data;

        for (let i = 0; i < datalist.length; i++) {

          this.itemhospitalLocationTypeList.push({

            id: datalist[i].id,
            itemName: datalist[i].name

          })
        }

        // this.p2form.get('LocationTypeData').setValue(datalist);

        this.itemListLocationType = datalist;
        let idsn: any = this.hospitalSessionService.GetHospitalSetupIds();
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
      this.hospitalSessionService.SetSessionIds(ids);
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

      //localStorage.removeItem("PatientId");
      //localStorage.removeItem("PartographPatient");
      //localStorage.removeItem("AddedPatientList");
      //this.router.navigate(['manage-partograph/patientsetup']);
      //this.objList.SearchKey = "";
      //this.p2form.reset();
      //this.defalutsetformvalues();
      //let sendnotification = { "id": 0, "actionType": this.pageActionTypePatient }
      //this.changingValue.next(sendnotification);

    }




  }

  LoadInstituteName(objserve) {
    this.hospitalInformationService.GetInstituteName(objserve).subscribe(data => {

      if (data.Data != null || data.Data != undefined) {

        let datalist: any[] = data.Data;

        for (let i = 0; i < datalist.length; i++) {

          this.iteminstitueNameList.push({

            id: datalist[i].ID,
            itemName: datalist[i].Name

          })
        }

        // this.p2form.get('LocationTypeData').setValue(datalist);

        this.itemListInstituteName = datalist;
      }

    },
      error => {
        // .... HANDLE ERROR HERE
        console.log(error);

      }

    );
  }

  SaveHospital() {
    console.log(this.p2form.get("CovidAccept").value)
    if (this.p2form.invalid) {

      return;
    }

    let now = moment();

    let hospitalModel: any = [];
    let data: any[] = this.p2form.get("LocationTypeData").value;

    console.log(this.p2form.get("LocationTypeData").value);

    this.hospitalSetting.UpdateDateTimeBrowser = now.format();
    this.hospitalSetting.UpdatedBy = this.authenticationService.currentUserValue.LoginId;
    this.hospitalSetting.CreatedBy = this.authenticationService.currentUserValue.LoginId;
    this.hospitalSetting.CreateDateTimeBrowser = now.format();

    this.hospitalSetting.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.hospitalSetting.CovidAccepting = this.p2form.get("CovidAccept").value;
    this.hospitalSetting.IsActive = true;
    this.hospitalSetting.IsDeleted = false;
    this.hospitalSetting.IsPrimary = true;
    this.hospitalSetting.LocationFunctionId = data[0].id;
    this.hospitalSetting.Name = this.p2form.get("HospitalName").value;
    this.hospitalSetting.OrganizationId = this.p2form.get("OrganizationId").value;
    this.hospitalSetting.SourceSystemID = 1;
    this.hospitalSetting.Code = moment().format("YYYYMMDDHHmmss").toString();
    //hospitalModel.push(this.hospitalSetting);

    if (this.p2form.get("SetupCompletedStatus").value) {
      this.hospitalSetting.SetupComplete = true;
      this.hospitalSetting.SetupCompleteBy = this.authenticationService.currentUserValue.LoginId;
      this.hospitalSetting.SetupCompleteDateTime = now.format();
    }
    else {
      this.hospitalSetting.SetupComplete = false;
      this.hospitalSetting.SetupCompleteBy = null;
      this.hospitalSetting.SetupCompleteDateTime = null;
    }

      if (this.id > 0) {
        this.hospitalSetting.id = this.id;
        this.hospitalInformationService.UpdateHospitalSetup(this.hospitalSetting).subscribe(data => {

          if (data.data != null || data.data != undefined) {
            let idsn: any = this.hospitalSessionService.GetHospitalSetupIds();
            this.UpdateDataSource_LoadAddedListAPI(idsn);
            this.toast.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
            window.scroll(0, 0);
            this.isEditEnable = false;
          }


        });

    }
    else {

      hospitalModel.push(this.hospitalSetting);

      this.hospitalInformationService.SaveHospital(hospitalModel).subscribe(data => {

        if (data.data != null || data.data != undefined) {

          let result = data.data;
          if (result) {
            this.toast.success(GlobalConstants.SUCCESS_MESSAGE);
            window.scroll(0, 0);
            this.SetDataInDataSource(result[0]);
            this.isEditEnable = false;
          }
          else {
            this.toast.success(GlobalConstants.FAILED_MESSAGE);
          }
        }
        else {
          this.toast.success(GlobalConstants.FAILED_MESSAGE);
        }

      })
    }
  }

  DataSource(row: any[]) {
    debugger;
    this.dataSource = []; let index = 0;

    for (let i = 0; i < row.length; i++) {

      if (row[i].id == this.id) {
        index = i;
      }


      this.dataSource.push({
        id: row[i].id,
        locationFunctionId: row[i].locationFunctionId,
        name: row[i].name,
        code: row[i].code,
        covidAccepting: row[i].covidAccepting == null ? "Yes" : row[i].covidAccepting,
        organizationId: row[i].organizationId,
        isActive: row[i].isActive,
        setupCompleteStatus: row[i].setupComplete,
        setupCompleteDateTime: row[i].setupCompleteDateTime,
        setupCompleteBy: row[i].setupCompleteBy,
        lastUpdateBy: row[i].updatedBy,
        lastUpdate:row[i].updateDateTimeBrowser
      });
    }

    this.next = index;
    this.id = this.dataSource[index].id;
    this.SetFormFields(index);


  }

  SetFormFields(index) {
    
    if (index < this.dataSource.length) {
      this.id = this.dataSource[index].id;
      this.isEditEnable = false;
      let setHospitalSelected: any[] = this.itemhospitalLocationTypeList.filter(u => u.id == this.dataSource[index].locationFunctionId);
      
      this.p2form.get("LocationTypeData").setValue([{ "id": this.dataSource[index].locationFunctionId, "itemName": setHospitalSelected[0].itemName }]);

    //  this.p2form.get("LocationTypeData").setValue(this.dataSource[index].locationFunctionId);
      this.p2form.get("OrganizationId").setValue(this.dataSource[index].organizationId);
      this.organizationId = this.dataSource[index].organizationId;
      this.p2form.get("CovidAccept").setValue(this.dataSource[index].covidAccepting);
      this.p2form.get("HospitalName").setValue(this.dataSource[index].name);
      this.p2form.get("HospitalCode").setValue(this.dataSource[index].code);

      this.p2form.get("SetupCompletedStatus").setValue(this.dataSource[index].setupCompleteStatus);

      if (this.dataSource[index].setupCompleteStatus == false || this.dataSource[index].setupCompleteStatus == null || this.dataSource[index].setupCompleteStatus == undefined) {
        this.IssetupCompleted = false;
        this.p2form.get("SetupCompletedStatus").setValue(false);
        this.p2form.get("SetupCompletedStatus").enable();
        this.p2form.get('SetupCompleteBy').setValue('');
        this.SetupCompleteDate = '';
      }
      else {
        this.IssetupCompleted = true;
        this.p2form.get("SetupCompletedStatus").enable();
        this.p2form.get('SetupCompleteBy').setValue(this.dataSource[index].setupCompleteBy);

      }
      if (this.dataSource[index].isActive) {
        this.p2form.get('Active').setValue('Active');
      }
      else if (this.dataSource[index].isActive == null || this.dataSource[index].isActive == undefined) {
        this.p2form.get('Active').setValue('Active');
      }
      else {
        this.p2form.get('Active').setValue('InActive');
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
      this.GetLocationContactInfo();
      this.GetLocationAdressInfo();
    }
    else {
      this.isEditEnable = true;
      this.AddressInfo = '';
      this.ContactInfo = '';
      this.IsLastUpdated = false;
      this.lastUpdate = '';
      this.lastUpdatedBy = '';
      this.id = 0;
      this.p2form.reset();
      this.organizationId = 0;
      //this.LoadLocationType(this.hospitalType);
    }
    
  }

  GetLocationAdressInfo() {
    //this.ContactInfo = "";
    this.AddressInfo = "";
    this.contactaddressObject.Id = this.id;
    this.contactaddressObject.Mode = "Address";
    this.contactaddressObject.DataMode = "Patient";
    //this.contactAdressPhysicainInfoService.GetcontactaddressphysicainInfo(this.contactaddressObject).subscribe(x => {

    //  if (x.data != null || x.data != undefined) {
    //    let rowData = x.data;
    //    if (rowData.length > 0) {
    //      this.AddressInfo = rowData[0].Name + "\n" + rowData[0].CityName + "\n" +
    //        rowData[0].StateName + "\n" + rowData[0].CountryName + "\n" + rowData[0].ZipCode

    //    }
    //  }
    //});

  }

  GetLocationContactInfo() {
    this.ContactInfo = "";
    this.contactaddressObject.Id = this.id;
    this.contactaddressObject.Mode = "Contact";
    this.contactaddressObject.DataMode = "Patient";
    //this.patientInfo.PatientId = this.PatientId;
    //this.patientInfo.SearchMode = "Contact";
    //this.contactAdressPhysicainInfoService.GetcontactaddressphysicainInfo(this.contactaddressObject).subscribe(x => {

    //  if (x.data != null || x.data != undefined) {
    //    let rowData = x.data;
    //    if (rowData.length > 0) {

    //      this.ContactInfo = rowData[0].Prefix + " " + rowData[0].FirstName + " " + rowData[0].MiddleName +
    //        rowData[0].LastName + "\n" + rowData[0].Email +
    //        "\n" +
    //        rowData[0].WorkPhoneCountryCode
    //        +
    //        "\n" +
    //        rowData[0].MobilePhoneCountryCode

    //      //  + ", WorkPhone- (" + rowData[0].WorkPhoneCountryCode + ")" + rowData[0].WorkPhone
    //      //+ ", MobilePhone- (" + rowData[0].MobilePhoneCountryCode + ")" + rowData[0].MobilePhone
    //    }


    //  }
    //});
  }

  
  //GetLocationContactInfo() {
  //  this.ContactInfo = '';
  //  this.hospitalinfo.PatientId = this.id;
  //  this.hospitalinfo.SearchMode = "Contact";
  //  this.hospitalInformationService.GetHospitalContactAddressInfo(this.hospitalinfo).subscribe(x => {

  //    if (x.data != null || x.data != undefined) {
  //      let rowData = x.data;
  //      if (rowData.length > 0) {

  //        this.ContactInfo = rowData[0].Prefix + " " + rowData[0].FirstName + " " + rowData[0].MiddleName +
  //          rowData[0].LastName + "\n" + rowData[0].Email +
  //          "\n" +
  //          rowData[0].WorkPhoneCountryCode
  //          +
  //          "\n" +
  //          rowData[0].MobilePhoneCountryCode

  //        //  + ", WorkPhone- (" + rowData[0].WorkPhoneCountryCode + ")" + rowData[0].WorkPhone
  //        //+ ", MobilePhone- (" + rowData[0].MobilePhoneCountryCode + ")" + rowData[0].MobilePhone
  //      }


  //    }

  //  });
  //}
  //GetLocationAdressInfo() {
  //  this.AddressInfo = '';
  //  this.hospitalinfo.PatientId = this.id;
  //  this.hospitalinfo.SearchMode = "Address";
  //  this.hospitalInformationService.GetHospitalContactAddressInfo(this.hospitalinfo).subscribe(x => {

  //    if (x.data != null || x.data != undefined) {
  //      let rowData = x.data;
  //      if (rowData.length > 0) {
  //        this.AddressInfo = rowData[0].Name + "\n" + rowData[0].CityName + "\n" +
  //          rowData[0].StateName + "\n" + rowData[0].CountryName + "\n" + rowData[0].ZipCode

  //      }
  //    }

  //  });
  //}

  UpdateDataSource_LoadAddedListAPI(ids: any) {

    var data = ('{"IDs": "' + ids + '" }');
   
    this.hospitalInformationService.GetAddedHospitalList(data).subscribe(result => {

      let res = result.data;
      if (res != null || res != undefined) {
        console.log(res)
        this.DataSource(res)
      }

    });
  }

  SetDataInDataSource(row) {

   let ids=  this.hospitalSessionService.GetHospitalSetupIds();

    this.id = row.id;

    if (ids != undefined || ids != null) {

      ids = ids + "," + row.id;

      this.hospitalSessionService.SetSessionIds(ids);

    }
    else {
      this.hospitalSessionService.SetSessionIds(row.id);
    }
    let idsn:any = this.hospitalSessionService.GetHospitalSetupIds();

    this.UpdateDataSource_LoadAddedListAPI(idsn);
    
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

  isUpdateChange() {
    //this.isEnableforupdate = false;
    this.isSubmitted = false;
    if (this.p2form.invalid) {
      this.IssetupCompleted = false;
      this.p2form.get("SetupCompletedStatus").disable();
      // this.p2form.get("SetupCompletedStatus").

      //this.p2form.get("SetupCompleted").setValue(false);
      //this.isSteupCompleted = false;
      //this.DisplayCurrentTime = "";
      //this.timeZone = "";
      //this.p2form.controls['SetupCompleted'].disable();
      //this.ActiveInactiveStatus = 'Active';
      //this.partographNo = 'N/A';
      //this.partographAdmissionDate = 'N/A';
      //this.IsPartographCreated = false;
      return;
    }
    else {
      this.IssetupCompleted = true;
      this.p2form.get("SetupCompletedStatus").enable();
    }
  }

  onAddItemA(data: string) {
    this.count++;
    this.itemListA.push({ "id": this.count, "itemName": data });
    this.selectedItemsA.push({ "id": this.count, "itemName": data });
  }
  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }
  onItemSelect(item: any) {
    console.log(item);
    this.isUpdateChange();
    /*this.locationTypeId = item.id;
    this.itemhospitalLocationTypeSelectedCodeList = [];
    this.selectedItems4 = [];
    let data: any[] = this.itemListLocationType.filter(u => u.id == item.id);

    this.itemhospitalLocationTypeSelectedCodeList.push({ "id": item.id, "itemName": data[0].code });

    this.p2form.get('LocationSelectedCode').setValue([{ "id": item.id, "itemName": data[0].code }]);

    console.log(this.itemhospitalLocationTypeSelectedCodeList);*/
  }
  OnItemDeSelect(item: any) {
    
   
    this.p2form.get('LocationTypeData').setValue(null);
    this.isUpdateChange();
  }

  OnItemDeSelect1(item: any) {
    console.log(item);
    this.p2form.get('InstituteNameData').setValue(null);
    console.log(this.selectedItems);
    this.isUpdateChange();
  }
  onSelectAll(items: any) {
    console.log(items);
    this.isUpdateChange();
  }
  onDeSelectAll(items: any) {
    this.p2form.get('LocationTypeData').setValue(null);
    this.iteminstituteNameSelectedCodeList = [];
    this.selectedItems4 = [];
    this.isUpdateChange();
  }

  onDeSelectAll1(items: any) {
    this.p2form.get('InstituteNameData').setValue(null);
    this.itemhospitalLocationTypeSelectedCodeList = [];
    this.selectedItems5 = [];
    this.isUpdateChange();
  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  selectNext(el) {

    this.resetData();

    this.next = this.next + 1;

    this.SetFormFields(this.next);
    
    el.selectedIndex += 1;
  }

  

  selectPrev(el) {
    el.selectedIndex -= 1;
  }


  openContact() {
    this.modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdrop: 'static' });
  }
  openUnit() {
    this.modalRef = this.modalService.open(AddUnitDetailComponent, { size: 'lg', backdrop: 'static' });
  }
}
