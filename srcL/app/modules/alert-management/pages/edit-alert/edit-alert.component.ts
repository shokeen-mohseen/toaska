import { Component, OnInit, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AlertManagementService } from '../../services/alert-management.server.input.services';
import { SystemAlerts } from '../../models/SystemAlerts';
import { UserAlertRecipients } from '../../models/UserAlertRecipients';
import { UserAlerts, UserAlertSmall } from '../../models/UserAlerts';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { timeInterval } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-edit-alert',
  templateUrl: './edit-alert.component.html',
  styleUrls: ['./edit-alert.component.css']
})
export class EditAlertComponent implements OnInit {
  selectedItems = [];
  itemList = [];
  settings = {};
  selectedItemsCheck = [];
  itemListCheck = [];
  settingsCheck = {};
  count = 3;
  Inactive: boolean = false;
  selectedItemsMulti: any[] = [];
  panelOpenState = false;
  hide: boolean = true;
  HTMLContent: string;
  LastUpdate: string;
  updatedBy: string;
  toppings = new FormControl();
  toppingList: any[] = [];//[{ id: 1, name: 'Invoice' }, { id: 2, name: 'Shipment' }, { id: 3, name: 'Delivery' }, { id: 4, name: 'cancel' }, { id: 5, name: 'Approval' }];
  selectedDocumentIDs = '';

  internalUser = new FormControl();
  internalUserMulti: any[] = [];
  internalUserList: any[] = []; //[{ id: 1, name: 'Delivery executive' }, { id: 2, name: 'Admin' }, { id: 3, name: 'SuperAdmin' }, { id: 4, name: 'Manager' }, { id: 1, name: 'Decorator' }];
  selectedRoles = '';
  selectedRolesID = '';

  externalUser = new FormControl();
  externalUserMulti: any[] = [];
  externalUserList = [{ id: 1, name: 'Account Manager (Notification)' }, { id: 2, name: 'Accounts Payable Contact' }, { id: 3, name: 'Accounts Receivable' }, { id: 4, name: 'Administrative Contact' }];
  selectedExternalContact = '';
  selectedExternalContactID = '';

  oppoSuits: any = ['Alert For Load File Issue', 'Booking Notification', 'Business Partner Added By Interface',
    'Business Partner Type Change', 'Charge Added By Interface'];

  systemEvents = [];
  alertTemplateParameters = [];

  documents: any = ['Document Type 1', 'Document Type 2', 'Document Type 3', 'Document Type 4'];

  documentMulti: any[] = [];
  selectedDocuments = [];
  // Text editor code
  htmlContent = '';

  userAlertRecipients = new UserAlertRecipients();
  userAlert = new UserAlerts();

  alertForm: FormGroup;

  UserAlertID: number;
  UserRecipientID: number;
  EncryptedUserAlertID: string;
  SystemEventId: number;
  selectedEntityId: number;
  @Input() EditIndex: number;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    // defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],

  }

  systemAlertModel: SystemAlerts;

  constructor(private actRoute: ActivatedRoute,
    private toster: ToastrService,
    private formBuilder: FormBuilder, private router: Router,
    private services: AlertManagementService) { }

  ngOnInit(): void {
    
    this.Inactive = this.services.Permission == false ? true : false;
    // for searchable dropdown
    this.itemList = [
      { "id": 1, "itemName": "option1" },
      { "id": 2, "itemName": "option2" },
      { "id": 3, "itemName": "option3" },
      { "id": 4, "itemName": "option4" },
      { "id": 5, "itemName": "option5" },
      { "id": 6, "itemName": "option6" }
    ];
    this.selectedItems = [];

    this.settings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1
    };
    // for checkbox with multiselect
    this.itemListCheck = [
      { "id": 1, "itemName": "option11" },
      { "id": 2, "itemName": "option22" },
      { "id": 3, "itemName": "option33" },
      { "id": 4, "itemName": "option44" },
      { "id": 5, "itemName": "option55" },
      { "id": 6, "itemName": "option66" }
    ];
    this.selectedItemsCheck = [];
    this.settingsCheck = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      searchBy: ['itemName'],
      lazyLoading: true,     
      badgeShowLimit: 2
    };

    // searchable dropdown end



    this.buildForm();
    //this.EncryptedUserAlertID = this.actRoute.snapshot.params.id;

    //this.UserAlertID = Number(this.DecryptUserAlertID(this.EncryptedUserAlertID));

    if (this.EditIndex > -1) {
      this.UserAlertID = Number(this.actRoute.snapshot.queryParams.id);
      this.UserAlertID = Number(this.EditIndex);
      this.getUserAlertData(this.UserAlertID);
    }
    

  }//oninit()-end

  onAddItem(data: string) {
    this.count++;
    this.itemList.push({ "id": this.count, "itemName": data });
    this.selectedItems.push({ "id": this.count, "itemName": data });
  }
  onAddItemCheck(data: string) {
    this.count++;
    this.itemListCheck.push({ "id": this.count, "itemName": data });
    this.selectedItemsCheck.push({ "id": this.count, "itemName": data });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }


  btnAdd = function () {
    this.router.navigateByUrl('/alert-management/add-new-alert');
  };
  btnEdit = function () {
    this.router.navigateByUrl('/alert-management/edit-alert');
  };
  // add alert for email

  GetAllSystemEvents() {

    this.services.GetSystemEvents().subscribe((systeevents) => {

      if (systeevents.message == "Success") {
        this.systemEvents = systeevents.data;
      }
    });

  }


  GetAllAlertTemplateParameters(EventId: number) {
    
    this.services.GetAlertTemplateList(EventId).subscribe((AlertTemplateParameters) => {


      this.alertTemplateParameters = [];
      var arrayControls = (<FormArray>this.f.UserAlertTemplate);



      if (AlertTemplateParameters.message == "Success") {

        arrayControls.clear();

        this.alertTemplateParameters = AlertTemplateParameters.data;

        this.alertTemplateParameters.forEach((value, index) => {
          this.selectedEntityId = value.entityId;

          arrayControls.push(new FormGroup({
            'Code': new FormControl(value.code),
            'Description': new FormControl(value.description),
            'DefaultValue': new FormControl(value.defaultValue),
            'EntityId': new FormControl(value.entityId)
          }));
        });


      }
    });

  }

  private buildForm(): void {
    this.alertForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      SystemEventsID: ['', Validators.required],
      RespectLocationMapping: [false],
      EmailSubject: ['', [Validators.required, Validators.minLength(5)]],
      EmailBody: ['', [Validators.required, Validators.minLength(50)]],
      UserAlertTemplate: this.formBuilder.array([])
    });
  }

  get f() {
    return this.alertForm.controls;
  }

  changeSystemEvents(data: any) {
    this.systemEvents.forEach((value, index) => {
      if (value.id == data) {
        this.GetAllAlertTemplateParameters(value.entityId);
      }
    });
  }

  checkInternalUser() {
    if (!this.Inactive) {
      this.selectedRoles = '';
      this.selectedRolesID = '';

      // this.internalUser.value.forEach((value, index) => {
      this.internalUserMulti.forEach((value, index) => {
        if (!this.selectedRoles.includes(value.Name)) {
          this.selectedRoles = this.selectedRoles + value.Name + ','
        }        
        this.selectedRolesID = this.selectedRolesID + value.Id + ','
      });
    }
   


  }


  checkExternalUserContact() {

    if (!this.Inactive && !this.isExternal) {
      this.selectedExternalContact = '';

      this.selectedExternalContactID = '';

      this.externalUserMulti.forEach((value, index) => {
        if (!this.selectedExternalContact.includes(value.name)) {
          this.selectedExternalContact = this.selectedExternalContact + value.name + ','
        }
        
        this.selectedExternalContactID = this.selectedExternalContactID + value.id + ','
      });
    }
    

  }

  checkDocuments() {

   // this.selectedDocuments = this.toppings.value;

    this.selectedDocuments = this.documentMulti;
  }

  removeDocument(id: number) {
    var itemIndex = -1;
    this.documentMulti.forEach((value, index) => {
      if (value.id == id) {
        itemIndex = index;
      }
    });

    this.documentMulti.splice(itemIndex, 1);

    this.selectedDocuments = [];
    if (this.documentMulti.length > 0) {
      this.selectedDocuments = this.documentMulti;
    }

  }

  async getAllInternalUsersRoles() {

    await this.services.GetAllRoles().toPromise().then((roles) => {
      this.internalUserList = [];
      if (roles.Message == "Success") {

        this.internalUserList = roles.Data;
      }
    });


  }

  getAllExternalContact() {

    this.services.GetAllContactType().subscribe((contacttype) => {

      this.externalUserList = [];
      if (contacttype.message == "Success") {

        this.externalUserList = contacttype.data;
      }
    });


  }

  getAllDocumentType() {

    this.services.GetAllDocumentType().subscribe((documentType) => {

      this.toppingList = [];
      if (documentType.message == "Success") {

        this.toppingList = documentType.data;
      }
    });


  }

  ShowAlertList() {
    this.router.navigateByUrl('/alert-management/alert-list');
  }

  showEditor(isShow: boolean) {
    var re = /&lt;/gi;
    var re1 = /&gt;/gi;
    this.HTMLContent = this.f.EmailBody.value;    
    this.HTMLContent = this.HTMLContent.replace(re, '<').replace(re1, '>');
    this.f.UserAlertTemplate.value.forEach((value, index) => {
      var x = this.HTMLContent.split(value.Code).length - 1
      for (let i = 0; i < x; i++) {
        this.HTMLContent = this.HTMLContent.replace(value.Code, value.DefaultValue);
      }
    });
    this.hide = isShow;
  }

  savealertparametervalue() {

    var isValid: Boolean = true;

    this.f.UserAlertTemplate.value.forEach((value, index) => {
      if (value.DefaultValue.length == 0 || value.DefaultValue.trim().length == 0) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.toster.error("Invalid parameter.");
      return;
    }

    this.services.SaveUserAlertTemplate(this.f.UserAlertTemplate.value).subscribe(finalResult => {

      if (finalResult.Message == "Success" || finalResult.message == "Success") {
        this.toster.success("User alert template parameters saved successfully.");
      }
      else {
        this.toster.warning("Data not saved.");
      }

    }, error => {
      console.log(error);
      this.toster.error("Error.");
    });


  }

  SaveUserAlertData() {    
    if (this.alertForm.invalid) {
      this.toster.warning("Invalid form data provided. Please enter correct data.");
      return;
    }

    this.userAlertRecipients.InternalUserFilter = this.selectedRolesID;
    this.userAlertRecipients.ExternalContactFilter = this.selectedExternalContactID;
    this.userAlertRecipients.Name = this.f.Name.value;
    this.userAlertRecipients.Description = this.f.Description.value;
    this.services.UpdateUserRecipient(this.userAlertRecipients).subscribe(data => {

      if (data.message == "Success") {
        this.userAlert.RecipientsID = data.data.id;
        this.userAlert.CreateDateTimeBrowser = new Date();
        this.userAlert.Name = this.f.Name.value;
        this.userAlert.Description = this.f.Description.value;
        this.userAlert.SystemEventsId = Number(this.f.SystemEventsID.value[0].id);

        this.userAlert.MessageBody = this.f.EmailBody.value;
        this.userAlert.MessageSubject = this.f.EmailSubject.value;
        this.userAlert.RespectLocationMapping = Boolean(this.f.RespectLocationMapping.value);

        this.selectedDocumentIDs = '';

        this.selectedDocuments.forEach((value, index) => {
          this.selectedDocumentIDs = this.selectedDocumentIDs + value.id + ','
        });

        this.userAlert.FileAttachments = this.selectedDocumentIDs;
        this.userAlert.UpdateDateTimeBrowserToSave = this.convertDatetoStringDate(new Date());
        this.services.UpdateUserAlertData(this.userAlert).subscribe(finalResult => {
          if (finalResult.message == "Success" || finalResult.Message == "Success") {

            this.toster.success("User alert saved successfully!");
            this.GetAllAlertTemplateParameters(this.SystemEventId);
            this.getUserAlertData(this.selectedId);
          }
          else {
            this.toster.warning("User alert is not saved!");
          }
        }, error => {
          // .... HANDLE ERROR HERE 
          console.log(error);

          this.toster.error("Error!");
        });
      }
    });
  }

  DecryptUserAlertID(id: any) {
    var saltKey = "eyEic";
    try {
      const bytes = CryptoJS.AES.decrypt(id, saltKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return id;
    } catch (e) {
      console.log(e);
    }
  }
  selectedId: number;
  isExternal: boolean;
   getUserAlertData(id: number) {
    
    this.selectedId = id;
    this.services.GetUserAlertInformation(id).subscribe(async result => {
     
      if (result.Message == "Success" || result.message == "Success") {

        if (result.data.name == "Order Created" || result.data.name == "Planned Order Report" || result.data.name == "Booking Notification") {
          this.isExternal = false;
        }
        else {
          this.isExternal = true;
        }
        this.SystemEventId = result.data.systemEventsId;

        let m1 = moment(result.data.updateDateTimeServer).format('MMMM DD, YYYY hh:mm A');
        let timeZone = moment.tz.guess();
        var timeZoneOffset = new Date(result.data.updateDateTimeServer).getTimezoneOffset();
        timeZone = moment.tz.zone(timeZone).abbr(timeZoneOffset);


        this.LastUpdate = m1 + " " + timeZone;
        this.updatedBy =  result.data.updatedBy;
        this.GetAllSystemEvents();
        this.getAllExternalContact();
        await this.getAllInternalUsersRoles();
        this.getAllDocumentType();

        this.GetAllAlertTemplateParameters(this.SystemEventId);
        this.userAlert = (<UserAlerts>result.data);
        this.UserRecipientID = result.data.recipientsId;

        this.setValueInAllControls(result.data);

      }
    });


  }
  convertDatetoStringDate(selectedDate: Date) {

    var date = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();

    var hours = selectedDate.getHours();
    var minuts = selectedDate.getMinutes();
    var seconds = selectedDate.getSeconds();

    return year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hours.toString() + ":" + minuts.toString() + ":" + seconds.toString();



  }
  setValueInAllControls(userAlertData: UserAlertSmall) {
    
    this.alertForm.patchValue({
      "Name": userAlertData.name,
      "Description": userAlertData.description,
      
      "RespectLocationMapping": userAlertData.respectLocationMapping,
      "EmailSubject": userAlertData.messageSubject,
      "EmailBody": userAlertData.messageBody
    });

    if (userAlertData.fileAttachments != undefined && userAlertData.fileAttachments != null && userAlertData.fileAttachments.length > 0) {
      this.BindAllDocumentType(userAlertData.fileAttachments);
    }




    this.services.GetRecipientDetails(userAlertData.recipientsId).subscribe(recipientData => {
      if (recipientData.Message == "Success" || recipientData.message == "Success") {
        this.userAlertRecipients.Id = userAlertData.recipientsId;
        this.userAlertRecipients.EmailCC = recipientData.data.emailCc;
        this.userAlertRecipients.EmailBCC = recipientData.data.emailBcc;
        this.userAlertRecipients.EmailTo = recipientData.data.emailTo;
        this.userAlertRecipients.MobileEmailTo = recipientData.data.mobileEmailTo;

        if (recipientData.data.internalUserFilter != undefined && recipientData.data.internalUserFilter != null && recipientData.data.internalUserFilter.length > 0) {
          this.BindInternalUsersList(recipientData.data.internalUserFilter);
        }

        if (recipientData.data.externalContactFilter != undefined && recipientData.data.externalContactFilter != null && recipientData.data.externalContactFilter.length > 0) {
          this.BindExternalContactList(recipientData.data.externalContactFilter);
        }

        var equipmentSelected = setInterval(() => {

          if (userAlertData.systemEventsId != undefined && this.systemEvents != undefined && this.systemEvents.length > 0) {
            this.systemEvents.forEach((value, index) => {

              clearInterval(equipmentSelected);

              if (value.id == userAlertData.systemEventsId) {

                this.selectedItemsMulti.push(value);
                this.alertForm.patchValue({ "SystemEventsID": this.selectedItemsMulti});
              }
            });
          }

        }, 500);

        
        
        
      }
    });
  }

  BindInternalUsersList(internalUsers: string) {
    var that = this;
    this.selectedRolesID = internalUsers;

    var rolesData = internalUsers.split(',');

    var selectedRoelsList = [];
    this.selectedRoles = '';
    rolesData.forEach((value, index) => {
      that.internalUserList.forEach((innerValue, innerIndex) => {
        if (Number(value) == Number(innerValue.Id)) {          
            this.selectedRoles = this.selectedRoles + innerValue.Name + ','          
          selectedRoelsList.push(innerValue);
          this.internalUserMulti.push(innerValue);
        }
      });
    });

    if (selectedRoelsList.length > 0)
      this.internalUser.setValue(selectedRoelsList);

  }

  BindExternalContactList(externalContacts: string) {

    this.selectedExternalContactID = externalContacts;

    var externalContactData = externalContacts.split(',');

    var externalContactList = [];
    this.selectedExternalContact = '';
    externalContactData.forEach((value, index) => {
      this.externalUserList.forEach((innerValue, innerIndex) => {
        if (Number(value) == Number(innerValue.id)) {          
            this.selectedExternalContact = this.selectedExternalContact + innerValue.name + ','                    
          externalContactList.push(innerValue);
          this.externalUserMulti.push(innerValue);
        }
      });
    });

    if (externalContactList.length > 0)
      this.externalUser.setValue(externalContactList);

  }

  BindAllDocumentType(documnetsID: string) {
    var documentsID = documnetsID.split(',');
    this.selectedDocuments = [];
    documentsID.forEach((value, index) => {
      this.toppingList.forEach((innerValue, indexinner) => {
        if (Number(value) == Number(innerValue.id)) {
          this.selectedDocuments.push(innerValue);
        }
      });
    });

    if (this.selectedDocuments.length > 0)
      this.toppings.setValue(this.selectedDocuments);

  }

}
