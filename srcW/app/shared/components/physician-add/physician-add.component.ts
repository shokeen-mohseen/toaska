import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientInformationService } from '../../../modules/manage-partograph/services/patient-informaation.services';
import { AuthService, User } from '../../../core';
import { ResourceRole } from '../../../core/models/resource-roles';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Resource } from '../../../core/models/resource ';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
@Component({
  selector: 'app-physician-add',
  templateUrl: './physician-add.component.html',
  styleUrls: ['./physician-add.component.css']
})
export class PhysicianAddComponent implements OnInit {

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  //@Input() IdentityIds: string;
  @Input() public locationId;
  @Input() public patientId;
  settingsB = {}; count: number = 0; itemListB = []; selectedItemsB = []; roleId: number;

  resource: Resource;

  settings = {}; resourceId: number;
  resourceRoles: ResourceRole;
  resourceTypeList: any[];
  resouceList: any[];
  currentUser: User;
  p2form: FormGroup;
  constructor(private toastrService: ToastrService, private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private patientsetupService: PatientInformationService,
    public activeModal: NgbActiveModal) {

    this.resource = new Resource();
    this.resourceRoles = new ResourceRole();
    this.currentUser = this.authenticationService.currentUserValue;
    this.resourceTypeList = []; this.resouceList = [];

    this.resource.ClientID = this.currentUser.ClientId;

  }

  ngOnInit(): void {
    //alert("111")
    this.getPhysicianTypeList();

    this.settings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      addNewItemOnFilter: false
    };

    //this.settingsB = {
    //  singleSelection: true,
    //  enableSearchFilter: true,
    //  addNewItemOnFilter: false
    //};

    this.buildForm();
  }
  
  private buildForm(): void {

    // validation applied on name 

    this.p2form = this.formBuilder.group(
      {
        resourceRole: ["", [Validators.required]],
        resource: [null, Validators.required]
        
      }
    );

  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    this.p2form.get('resourceRole').setValue(null);
    
  }
  OnItemDeSelect(item: any) {
    this.p2form.get('resourceRole').setValue(null);
    //console.log(this.selectedItems);
  }

  OnItemDeSelectRole(item: any) {
    this.p2form.get('resourceRole').setValue(null);
    //console.log(this.selectedItems);
  }

  OnItemDeSelectResource(item: any) {
    this.p2form.get('resource').setValue(null);
    //console.log(this.selectedItems);
  }

  onItemSelectRole(item: any) {
    console.log(item.id);
    this.roleId = item.id;

  }

  onAddItem(data: string) {
    this.p2form.get('resource').setValue({ "id": this.count, "itemName": data });
  }

  onItemSelectResource(item: any) {
    console.log(item.id);
    this.resourceId = item.id;
   
  }

  onAddItemB(data: string) {
    this.count++;
    this.itemListB.push({ "id": this.count, "itemName": data });
    this.selectedItemsB.push({ "id": this.count, "itemName": data });
  }

  getPhysicianList(resourceTypeId) {
    this.resource.LocationID = this.locationId;
    this.resource.ResourceRoleID = resourceTypeId;
    this.resouceList = [];
    this.patientsetupService.GetResourceList(this.resource)
      .pipe()
      .subscribe(result => {
        const rowList = result.data;
        if (!!rowList) {

          let datalist: any[] = rowList;

          for (let i = 0; i < datalist.length; i++) {

            this.resouceList.push({

              id: datalist[i].id,
              itemName: datalist[i].physicianName

            })
          }


        }
      });

      

  
  }

  GetResource(event: any) {

    if (event.target.value != "") {
      let resourceTypeId = Number(event.target.value);
      this.getPhysicianList(resourceTypeId);
    }
    else {

    }

  }

  getPhysicianTypeList() {
  
    this.resourceTypeList = [];
    this.resourceRoles.ClientID = this.currentUser.ClientId;
    this.patientsetupService.GetResouceTypeList(this.resourceRoles)
      .pipe()
      .subscribe(result => {
        const rowList = result.data;
        if (!!rowList) {
          this.resourceTypeList = rowList;
          //let datalist: any[] = rowList;

          //for (let i = 0; i < datalist.length; i++) {

          //  this.resourceTypeList.push({

          //    id: datalist[i].id,
          //    itemName: datalist[i].name

          //  })
          //}

         
          // this.p2form.get('LocationData').setValue(datalist);

         // this.itemListLocation = datalist;
          //this.resourceTypeList = result
        }
      });




  }

  get f() {

    return this.p2form.controls;
  }


  SavePhysicianDetail() {

    if (this.p2form.invalid) {
      return;
    }

    this.resource.LocationID = this.locationId;
    this.resource.PatientId = this.patientId;
    this.resource.ResourceId = this.resourceId;
    this.resource.ClientID = this.currentUser.ClientId;
    this.resource.CreateDateTimeBrowser = new Date(new Date().toISOString());
    this.resource.UpdateDateTimeBrowser = new Date(new Date().toISOString());
    this.resource.CreatedBy = this.currentUser.LoginId;
    this.resource.SourceSystemId = 1;
   // this.resource.UpdatedBy = this.currentUser.LoginId;

    this.patientsetupService.CheckPhysicianMappedWithPatient(this.resource)
      .pipe()
      .subscribe(result => {
        const isvalid = result.data;
      
        if (!isvalid) {

          this.patientsetupService.SaveReourceMapping(this.resource)
            .pipe()
            .subscribe(result => {
              const rowList = result.data;
              if (!!rowList) {
                this.toastrService.success(GlobalConstants.SUCCESS_MESSAGE);
                this.passEntry.emit(1);
                this.activeModal.close(1);
              }
              else {

                this.toastrService.success(GlobalConstants.FAILED_MESSAGE);
                this.passEntry.emit(0);
                this.activeModal.close(0);
              }
            });
        }
        else {

          this.toastrService.warning(GlobalConstants.Alreadyadded);
        }

      });
  }
}


