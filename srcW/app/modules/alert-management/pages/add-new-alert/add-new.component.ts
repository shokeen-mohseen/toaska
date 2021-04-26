//Developer : Rajesh , date : 24-8-2020, description : create add alert page design
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AlertManagementService } from '../../services/alert-management.server.input.services';
import { SystemAlerts } from '../../models/SystemAlerts';
import { UserAlertRecipients } from '../../models/UserAlertRecipients';
import { UserAlerts } from '../../models/UserAlerts';
import { ToastrService } from 'ngx-toastr';

import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {

  selectedItems = [];
  itemList = [];
  settings = {};
  selectedItemsCheck = [];
  itemListCheck = [];
  settingsCheck = {};
  count = 3;


  panelOpenState = false;
  hide: boolean = true;
  HTMLContent: string;
  toppings = new FormControl();
  documentMulti: any;
  toppingList: any[] = [];//[{ id: 1, name: 'Invoice' }, { id: 2, name: 'Shipment' }, { id: 3, name: 'Delivery' }, { id: 4, name: 'cancel' }, { id: 5, name: 'Approval' }];
  selectedDocumentIDs = '';
  

  internalUser = new FormControl();
  internalUserMulti: any;
  internalUserList: any[] = []; //[{ id: 1, name: 'Delivery executive' }, { id: 2, name: 'Admin' }, { id: 3, name: 'SuperAdmin' }, { id: 4, name: 'Manager' }, { id: 1, name: 'Decorator' }];
  selectedRoles = '';
  selectedRolesID = '';

  externalUser = new FormControl();
  externalUserMulti: any;

  externalUserList = [{ id: 1, name: 'Account Manager (Notification)' }, { id: 2, name: 'Accounts Payable Contact' }, { id: 3, name: 'Accounts Receivable' }, { id: 4, name: 'Administrative Contact' }];
  selectedExternalContact = '';
  selectedExternalContactID = '';

  oppoSuits: any = ['Alert For Load File Issue', 'Booking Notification', 'Business Partner Added By Interface',
    'Business Partner Type Change', 'Charge Added By Interface'];

  systemEvents = [];
  alertTemplateParameters = [];

  documents: any = ['Document Type 1', 'Document Type 2', 'Document Type 3', 'Document Type 4'];
  selectedDocuments = [];
  // Text editor code
  htmlContent = '';

  userAlertRecipients = new UserAlertRecipients();
  userAlert = new UserAlerts();

  alertForm: FormGroup;

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

  constructor(private toster: ToastrService,private formBuilder: FormBuilder,private router: Router, private services: AlertManagementService) { }

  ngOnInit(): void {

         // for searchable dropdown
   /* this.itemList = [
      { "id": 1, "itemName": "option1" },
      { "id": 2, "itemName": "option2" },
      { "id": 3, "itemName": "option3" },
      { "id": 4, "itemName": "option4" },
      { "id": 5, "itemName": "option5" },
      { "id": 6, "itemName": "option6" }
    ];*/
    this.selectedItems = [];
 
    this.settings = {
     /* singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 1*/
    };
// for checkbox with multiselect
   /* this.itemListCheck = [
      { "id": 1, "itemName": "option11" },
      { "id": 2, "itemName": "option22" },
      { "id": 3, "itemName": "option33" },
      { "id": 4, "itemName": "option44" },
      { "id": 5, "itemName": "option55" },
      { "id": 6, "itemName": "option66" }
    ];*/
   /* this.selectedItemsCheck = [];
    this.settingsCheck = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      badgeShowLimit: 2
    };*/

    // searchable dropdown end




    this.buildForm();

    this.GetAllSystemEvents();
    this.getAllExternalContact();
    this.getAllInternalUsersRoles();
    this.getAllDocumentType();
    this.GetAllAlertTemplateParameters(0);
  }// oninit() end


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
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
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


  showEditor(isShow: boolean) {
    
    this.HTMLContent = this.f.EmailBody.value;
    

    this.f.UserAlertTemplate.value.forEach((value, index) => {
     
      this.HTMLContent = this.HTMLContent.replace(value.Code.replace('<', '&lt;').replace('>', '&gt;'), value.DefaultValue);

    });

    this.hide = isShow;


  }

  GetAllAlertTemplateParameters(EntityId : number) {
    
    this.services.GetAlertTemplateList(EntityId).subscribe((AlertTemplateParameters) => {

      
      this.alertTemplateParameters = [];
      var arrayControls = (<FormArray>this.f.UserAlertTemplate);

      

      if (AlertTemplateParameters.message == "Success") {

        arrayControls.clear();

        this.alertTemplateParameters = AlertTemplateParameters.data;

        this.alertTemplateParameters.forEach((value, index) => {
          arrayControls.push(new FormGroup({
            'Code': new FormControl(value.code),
            'Description': new FormControl(value.description),
            'DefaultValue': new FormControl(value.defaultValue, Validators.required)
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

    

    this.selectedRoles = '';
    this.selectedRolesID = '';

    this.internalUserMulti.forEach((value, index) => {
      this.selectedRoles = this.selectedRoles + value.Name + ','
      this.selectedRolesID = this.selectedRolesID + value.Id + ','
    });
   
    
  }

  checkExternalUserContact() {

    this.selectedExternalContact = '';

    this.selectedExternalContactID = '';

    this.externalUserMulti.forEach((value, index) => {
      this.selectedExternalContact = this.selectedExternalContact + value.name + ','
      this.selectedExternalContactID = this.selectedExternalContactID + value.id + ','
    });

  }

  checkDocuments() {

    //this.selectedDocuments = this.toppings.value;

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

  getAllInternalUsersRoles() {

    this.services.GetAllRoles().subscribe((roles) => {
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

 

  savealertparametervalue() {
    
    var isValid :Boolean   = true;

    this.f.UserAlertTemplate.value.forEach((value, index) => {
      if (value.DefaultValue.length == 0 || value.DefaultValue.trim().length == 0) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.toster.error("Invalid Parameter");
      return;
    }

    this.services.SaveUserAlertTemplate(this.f.UserAlertTemplate.value).subscribe(finalResult => {

      if (finalResult.Message == "Success" || finalResult.message == "Success") {
        this.toster.success("User Alert Teplate Parameters saved successfully .");
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
      this.toster.error("Invalid form data provide.please correct that.");
      return;
    }

    this.userAlertRecipients.InternalUserFilter = this.selectedRolesID;
    this.userAlertRecipients.ExternalContactFilter = this.selectedExternalContactID;
    this.userAlertRecipients.Name = this.f.Name.value;
    this.userAlertRecipients.Description = this.f.Description.value;
    this.services.SaveUserRecipient(this.userAlertRecipients).subscribe(data => {
      
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

        this.services.SaveUserAlertData(this.userAlert).subscribe(finalResult => {
          if (finalResult.message == "Success" || finalResult.Message == "Success") {

            this.toster.success("user alert saved successfully !");
            this.alertForm.reset();
            this.GetAllAlertTemplateParameters(0);
          }
          else {
            this.toster.warning("user alert not saved !");
          }
        }, error => {
          // .... HANDLE ERROR HERE 
          console.log(error);
          
            this.toster.error("Error!");
        });
      }
    });
  }

}
