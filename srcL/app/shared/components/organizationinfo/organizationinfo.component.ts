import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { OrganizationHierarchyService } from '../../../core/services/organization-hierarchy.service';
import { OrganizationHierarchy } from '../../../core/models/organization-hierarchy.model';
import { AuthService } from '../../../core';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { global } from '@angular/compiler/src/util';
import { OrganizationService } from '../../../core/services/organization.service';
import { Organization } from '../../../core/models/organization';


@Component({
  selector: 'app-organizationinfo',
  templateUrl: './organizationinfo.component.html',
  styleUrls: ['./organizationinfo.component.css']
})



export class OrganizationinfoComponent implements OnInit, OnChanges {
  settingsB = {};
  @Input() itemOrgList:any;
  @Input() disabled: boolean;
  rowlist: number;
  @Input() viewMode = false;
  @Input() PageActionType: string;
  @Input() organizationlist: [] = [];
  @Input() organizationId: number = 0;
  @Input() OrgLevel: number = 0;
  @Output() changeSelected: EventEmitter<number> = new EventEmitter<number>();
  organizationHierarchy: OrganizationHierarchy;
  public form: {
    orgLevel: OrganizationLevel[];
  };
  organization: ParentOrganization[];

  userData = {
    listB: []
  };


  constructor(private authenticationService: AuthService,
    private organizationHierarchyService: OrganizationHierarchyService,
    private organiztaionService: OrganizationService) {


    this.organizationHierarchy = new OrganizationHierarchy();

    this.organizationHierarchy.ClientId = this.authenticationService.currentUserValue.ClientId;


    this.form = {
      orgLevel: []
    };
  }
  ngOnInit(): void {
    if (this.disabled == undefined || this.disabled == null) {
      this.disabled = false;
    }

    this.settingsB = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      disabled: this.disabled,
      addNewItemOnFilter: false,
      searchBy: ['itemName'],

    };
    if (!this.viewMode)
      this.orgLevel();
    //console.log("this.organizationId " + this.organizationId)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.organizationId
      && changes.organizationId.currentValue) {
      
      if (this.viewMode) {
        this.GetOrganizationViewOnlyInformation(changes.organizationId.currentValue);
      } else {
        this.setViewModeData();
      }
      
    } else {
      this.form.orgLevel.forEach(x => x.orgLevelData = '');
    }
  }

  public orgLevel(): void {
      this.GetOrganization();
  }

  setViewModeData() {
    if (this.organization) {
      var mappedOrg = this.organization.find(x => x.id === this.organizationId);
     // this.itemOrgList = mappedOrg;
      if (mappedOrg) {
      this.itemOrgList = [this.organization.find(item => item.id === this.organizationId)]
      if (this.viewMode && this.organizationId > 0 && mappedOrg)
      {
        this.onOrganizationSelected(this.organizationId, 0);
        this.form.orgLevel[this.form.orgLevel.length - 1].orgLevelData = mappedOrg.name;
        this.form.orgLevel[this.form.orgLevel.length - 1].levelDataId = mappedOrg.id;
      }
      else if (!this.viewMode && this.organizationId > 0 && mappedOrg) {
        this.onOrganizationSelected(this.organizationId, 0);
        this.form.orgLevel[this.form.orgLevel.length - 1].orgLevelData = mappedOrg.name;
        this.form.orgLevel[this.form.orgLevel.length - 1].levelDataId = mappedOrg.id;
      }
      }
    }
    
  }

  GetOrganizationLevel() {
    this.organizationHierarchy.ClientId = this.authenticationService.currentUserValue.ClientId;
    this.organizationHierarchyService.GetOrganizationLevel(this.organizationHierarchy)
      .subscribe(result => {

        let arrayList: any = [];

        arrayList = result.data;
        if (arrayList != null) {

          this.rowlist = arrayList.length

          for (let i = 0; i < arrayList.length; i++) {
            if (arrayList.length == i + 1) {
              
              var objToPush = {
                id: arrayList[i].id,
                name: arrayList[i].name,
                levelDataId: 0,
                organizationList: this.organization,
                orgLevelData: ''
              }
              var mappedOrg = this.organization.find(x => x.id === this.organizationId);
              if (mappedOrg) {
                objToPush.levelDataId = mappedOrg?.id;
                objToPush.orgLevelData = mappedOrg?.name;
              }
              this.form.orgLevel.push(objToPush);
              this.setViewModeData();
            }
            else {
              this.form.orgLevel.push({
                id: arrayList[i].id,
                name: arrayList[i].name,
                levelDataId: 0,
                organizationList: [],
                orgLevelData: ''
              });
            }

          }
        }

      },
        error => {

        },
        () => {





        }
      );
  }


  GetOrganizationGroupLevel() {

    this.organizationHierarchyService.GetGroupLevelList(this.organizationHierarchy)
      .subscribe(result => {

        //console.log(this.organization )
        let arrayList: any = [];

        arrayList = result.data;
        if (arrayList != null) {

          for (let i = 0; i < arrayList.length; i++) {
            this.form.orgLevel[1].organizationList.push({
              id: arrayList[i].OrganizationLevelDetailID,
              name: arrayList[i].Name,
              itemName: arrayList[i].Name,
            })
          }


          if (arrayList.length > 0) {
            this.form.orgLevel[1].orgLevelData = arrayList[0].Name;
            this.form.orgLevel[1].levelDataId = arrayList[0].OrganizationLevelDetailID;
          }


        }

      },
        error => {

        },
        () => {





        }
      );
  }

  GetOrganizationEnterpriseLevel() {

    this.organizationHierarchyService.GetEnterPriseLevelList(this.organizationHierarchy)
      .subscribe(result => {

        //console.log(this.organization )
        let arrayList: any = [];

        arrayList = result.data;
        if (arrayList != null) {
          for (let i = 0; i < arrayList.length; i++) {
            this.form.orgLevel[0].organizationList.push({
              id: arrayList[i].OrganizationLevelDetailID,
              name: arrayList[i].Name,
              itemName: arrayList[i].Name,
            })
          }


          if (arrayList.length > 0) {
            this.form.orgLevel[0].orgLevelData = arrayList[0].Name;
            this.form.orgLevel[0].levelDataId = arrayList[0].OrganizationLevelDetailID;
          }



        }
      },
        error => {

        },
        () => {





        }
      );
  }
  
  GetOrganizationViewOnlyInformation(organizationId: number) {
    
    this.form.orgLevel = [];
    this.organizationHierarchy.ClientId = this.authenticationService.currentUserValue.ClientId;
    this.organizationHierarchyService.GetOrganizationLevel(this.organizationHierarchy)
      .subscribe(result => {
        if (result && result.data) {
          var requestBody = new Organization();
          requestBody.organizationId = this.organizationId;
          requestBody.ClientID = this.authenticationService.currentUserValue.ClientId;
          this.organiztaionService.getOrganizationList(requestBody)
            .subscribe(orgInfo => {
              if (orgInfo != null && orgInfo.data && orgInfo.data.length == 1) {

                this.form.orgLevel = [];
                var orgItem = orgInfo.data[0];
                result.data.forEach(item => {
                  this.form.orgLevel.push({
                    id: item.id,
                    name: item.name,
                    levelDataId: 0,
                    organizationList: [],
                    orgLevelData: this.getAssociatedInfo(orgItem, item.name)
                  });
                });

              }
            },
              error => {
                console.log(error);
                // return this.organization;
              },
              () => {

              }
            );
          
        }
        
      });

  

   
   
  }
  getAssociatedInfo(orgItem: any, name: string): string {
    var propName = '';
    if (name.startsWith("Billing")) {
      propName = "billingName";
    } else if (name.startsWith("Group")) {
      propName = "groupName";
    } else if (name.startsWith("Enterprise")) {
      propName = "enterPriseName";
    }
    return orgItem[propName];
  }
  GetOrganization() {
    
    if (GlobalConstants.PageActionTypeCustomer == this.PageActionType) {

      this.organizationHierarchy.Code = GlobalConstants.OrganizationTypeCodeCust;
      this.organizationHierarchy.OrganizationTypeID = GlobalConstants.OrganizationTypeIdCust;
    }
    else if (GlobalConstants.PageActionTypeUser == this.PageActionType)
    {
      this.organizationHierarchy.Code = "";
    }
    else {
      this.organizationHierarchy.Code = GlobalConstants.OrganizationTypeCode;
      this.organizationHierarchy.OrganizationTypeID = GlobalConstants.OrganizationTypeId;
    }
    this.organization = [];
    //this.organizationHierarchy.ClientId = 1000; GetOrganizationwithoutCarrier GetOrganization
    this.organizationHierarchyService.GetOrganizationwithoutCarrier(this.organizationHierarchy)
      .subscribe(result => {
        let arrayList: any = [];
        arrayList = result.data;
        if (arrayList != null) {
          for (let i = 0; i < arrayList.length; i++) {
            this.organization.push({
              id: arrayList[i].id,
              itemName: arrayList[i].name,
              name: arrayList[i].name,
            });
          }
        }
        this.GetOrganizationLevel();
      },
        error => {

          // return this.organization;
        },
        () => {
          
        }
      );
    return this.organization;

  }

  
  OnItemDeSelect(item: any) {

  }
  onDeSelectAll(items: any) {

  }

  onOrganizationSelected1(item: any, index: number) {

    //this.orgLevel.orgLevelData
    if (item.id == 0) {

      this.changeSelected.emit(0);

      if (this.form.orgLevel[0].orgLevelData != undefined) {
        this.form.orgLevel[0].orgLevelData = ''
      }

      if (this.form.orgLevel[1].orgLevelData != undefined) {
        this.form.orgLevel[1].orgLevelData = '';
      }


    }
    else {
      this.form.orgLevel[0].orgLevelData = ''
      this.form.orgLevel[1].orgLevelData = '';
      this.organizationHierarchy.OrganizationId = item.id;

      if (this.OrgLevel != 1) {
        this.GetOrganizationGroupLevel();

        this.GetOrganizationEnterpriseLevel();
      }
      this.changeSelected.emit(item.id);
    }
  }
  onOrganizationSelected(id: number, index: number) {
    
    //this.orgLevel.orgLevelData
    if (id == 0) {

      this.changeSelected.emit(0);

      if (this.form.orgLevel[0].orgLevelData != undefined) {
        this.form.orgLevel[0].orgLevelData = ''
      }

      if (this.form.orgLevel[1].orgLevelData != undefined) {
        this.form.orgLevel[1].orgLevelData = '';
      }

      
    }
    else {
      this.form.orgLevel[0].orgLevelData = ''
      this.form.orgLevel[1].orgLevelData = '';
      this.organizationHierarchy.OrganizationId = id;

      if (this.OrgLevel != 1) {
        this.GetOrganizationGroupLevel();

        this.GetOrganizationEnterpriseLevel();
      }
      this.changeSelected.emit(id);
    }
  }

  refreshOrg() {
    this.form.orgLevel[0].orgLevelData = ''
    this.form.orgLevel[1].orgLevelData = '';
    this.organizationHierarchy.OrganizationId = 0;
    this.itemOrgList = [];
  }

}
interface OrganizationLevel {
  id: number;
  name: string;
  orgLevelData: string;
  levelDataId: number;
  organizationList: ParentOrganization[]
}

interface ParentOrganization {
  id: number;
  name: string;
  itemName: string;

}
