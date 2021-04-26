import { Component, ViewChild, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UseraccessService, AuthService, RolesViewModel, UserLocationListViewModel, CommonCallListViewModel } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../../core/models/GlobalConstants ';
import { tap } from 'rxjs/operators';
import { ConfirmDeleteTabledataPopupComponent } from '../confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

export interface PeriodicElement {
  selectRow: string;
  LocationType: string;
  LocationDescription: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { selectRow: '', LocationType: 'Wash Facility', LocationDescription: 'RPC Services of GA' }
];

@Component({
  selector: 'app-add-planning-location',
  templateUrl: './add-planning-location.component.html',
  styleUrls: ['./add-planning-location.component.css']
})
export class AddPlanningLocationComponent implements OnInit {

  isPlanningLocationAllSelected: boolean = false;
  public exampleData1: Array<Select2OptionData>;
  public value: string;
  public placeholder = 'Please Select';
  public locationTypeData: any[];
  public locationData: any[];
  public options: Options;
  rolesListModel: RolesViewModel = new RolesViewModel();
  userRolesListViewModel: UserLocationListViewModel = new UserLocationListViewModel();
  modalRef: NgbModalRef;
  locationTypeids: [];
  locationids: [];
  @Input() existIds: string;
  rollDeletedids: string;
  @Input() userId: number;
  @Input() data: UserLocationListViewModel[] = [];
  @Output() addEntry: EventEmitter<any> = new EventEmitter<any>();

  @Output() deleteEntry: EventEmitter<any> = new EventEmitter<any>();

  /// desg
  userPlanningLocationViewModel: UserLocationListViewModel = new UserLocationListViewModel();
  existingLocationId: string = '';
  settingsA = {};
  settingsB = {};
  displayedColumns = ['userLocationListId', 'LocationTypeName', 'LocationName'];
  @Input() userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<UserLocationListViewModel>(true, []);
  @Input() size: number = 1;
  @Input() actionType: string;
 
  constructor(private useraccessService: UseraccessService, public modalService: NgbModal,
    private toastrService: ToastrService, private authenticationService: AuthService) {
    
  }

  ngAfterViewInit() {

    this.getLocationTypeBind();    
    this.userPlanningLocationList.sort = this.sort;
    this.paginator.length = this.size;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


    this.paginator.page.pipe(
      tap(() => this.initializationView())
    )
      .subscribe();
   
  }

  initializationView() {
    this.getPlanningLocationList();
    this.isPlanningLocationAllSelected = false;
    this.GetOrganizationId();
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.userPlanningLocationList.filter = filterValue;
  }

  ngOnInit(): void {
    this.settingsB = {
      singleSelection: false,
      enableCheckAll: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 2,
      enableSearchFilter: true,
      ddNewItemOnFilter: false,
      noDataLabel: 'No Data Available',
      searchBy: ['itemName']
    };
  }

  onAddEntry() {
    let modelList = [];
    let Locationid = [];
    Locationid = this.locationids.map(({ id }) => id);
    if (!!!Locationid || Locationid.length === 0) {
      this.toastrService.warning('Please Select At least One');
      return;
    }
    Locationid.map(x => {
      let model = new UserLocationListViewModel();
      model.userId = this.userId;
      model.locationId = Number(x);
      model.clientId = this.authenticationService.currentUserValue.ClientId;
      model.updatedBy = this.authenticationService.currentUserValue.LoginId;
      model.createdBy = this.authenticationService.currentUserValue.LoginId;
      model.updateDateTimeBrowser = new Date(new Date().toISOString());
      model.createDateTimeBrowser = new Date(new Date().toISOString());
      modelList.push(model);
    });
    this.useraccessService.addUserPlanningLocationList(modelList).subscribe(x => {
      this.getLocationTypeBind();
      this.addEntry.emit(this.locationids);
      this.toastrService.success(GlobalConstants.SUCCESS_UPDATE_MESSAGE);
      this.locationids = [];
      this.locationTypeids = [];
      this.locationData = [];
    });
  }

  onRefershEntry() {
    this.data = [];
    this.locationTypeData = [];
    this.locationData = [];
    this.getLocationTypeBind();
    this.addEntry.emit(this.data);
  }

  onDeleteEntry() {
    if (!!!this.idsPlanningLocationDeteted) {
      this.toastrService.warning('Please Select At least One ');
      return;
    }
    this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
    this.useraccessService.deleteUserPlanningLocationListByIds(this.idsPlanningLocationDeteted, this.authenticationService.currentUserValue.LoginId).subscribe(x => {
      this.getLocationTypeBind();
      this.getPlanningLocationList();      
      this.toastrService.success('Planning Location deleted successfully');
      this.deleteEntry.emit(this.idsPlanningLocationDeteted);
      this.idsPlanningLocationDeteted = "";
    });
    }, (reason) => {
    }); 
  }

  setLocationTypeDropDown(data: any) {
    this.locationTypeData = [];
    data.map(item => {
      return {
        itemName: item.text,
        id: item.id
      };
    }).forEach(item => this.locationTypeData.push(item));

    this.options = {
      width: '300',
      multiple: true,
      tags: true
    };
    this.settingsA = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      enableSearchFilter: true,
      addNewItemOnFilter: false,
      badgeShowLimit: 2,
      searchBy: ['itemName']
    };
  }

  getLocationTypeBind() {
    this.data = [];
    let commoncall = new CommonCallListViewModel();
    commoncall.ClientID = this.authenticationService.currentUserValue.ClientId;
    this.useraccessService.locationFunctionList(commoncall).subscribe(x => {
      const row = x.data;
      if (!!row) {
        let rowData = [];
        row.map(item => {
          return {
            text: item.name,
            id: item.id
          };
        }).forEach(item => rowData.push(item));
        this.setLocationTypeDropDown(rowData);
        let index = this.locationTypeData.findIndex(x => x.itemName == "Carrier")
        if (index > -1) {
          this.locationTypeData.splice(index, 1);
        }
        
        this.initializationView();
      }
    });
  }

  selectAll(check: any) {
    this.isPlanningLocationAllSelected = check.checked;
    this.data.forEach(row => { row.isPLocationSelected = this.isPlanningLocationAllSelected; });
    this.setUserCheckBoxData();
  }

  selectCheckbox(check: any, value: any) {
    this.data.forEach(row => {
      if (row.userLocationListId == value.userLocationListId)
        row.isPLocationSelected = check.checked;
    });
    this.isPlanningLocationAllSelected = (this.data.length === (this.data.filter(x => x.isPLocationSelected == true).length));
    this.setUserCheckBoxData();
  }

  deletedIds: string = '';
  setUserCheckBoxData() {
    let iDs: string = '';
    this.deletedIds = '';
    this.data.filter(x => {
      if (x.isPLocationSelected == true) iDs += `${x.userLocationListId},`;
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.deletedIds = iDs;
    }
  }

  getLocationeBind(searchLocationTypeList: UserLocationListViewModel[]) {
    this.data = [];
   
    this.useraccessService.locationList(searchLocationTypeList).subscribe(x => {
      var row = x.data;      
      if (this.OrganizationId != 1) {
        row = row.filter(r => ( this.OrganizationId == r.organizationId ));
      }
      if (!!row) {
        let rowData = [];
        row.map(item => {
          return {
            text: item.name,
            id: item.id
          };
        }).forEach(item => rowData.push(item));

        if (!!this.existingLocationId) {
          let rowList = this.existingLocationId.split(',');
          rowList.filter(item => {
            let index = rowData.findIndex(x => x.id == item)
            if (index > -1) {
              rowData.splice(index, 1);
            }
          });
          rowData = rowData.filter((value, index, array) =>
            !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);
        }
        this.setLocationDropDown(rowData);
      }
    });
  }

  OnItemSelect(item: any) {
    let locationid = this.locationTypeids.map(({ id }) => id);
    this.onSearchPlanningLocationSelected(locationid);   
  }
  OnItemDeSelect(item: any) {
    let locationid = this.locationTypeids.map(({ id }) => id);
    this.onSearchPlanningLocationSelected(locationid);   
  }
  onSelectAll(items: any) {
    let locationid = this.locationTypeids.map(({ id }) => id);
    this.onSearchPlanningLocationSelected(locationid);   
  }
  onDeSelectAll(items: any) {   
    this.locationData = [];   
    this.setLocationDropDown(this.locationData);
  }

  onSearchPlanningLocationSelected(id: any) {
    let modelList = [];
    if (!!id && id.length > 0) {     
      id.map(x => {
        let model = new UserLocationListViewModel();
        model.userId = this.userId;
        model.locationTypeId = Number(x);
        model.clientId = this.authenticationService.currentUserValue.ClientId;
        modelList.push(model);
      });
      this.getLocationeBind(modelList);
    }
  }

  setLocationDropDown(data: any) {
    this.locationData = [];
    data.map(item => {
      return {
        itemName: item.text,
        id: item.id
      };
    }).forEach(item => this.locationData.push(item));
       
   
  }

  getPlanningLocationList() {
    this.userPlanningLocationViewModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.userPlanningLocationViewModel.userId = this.userId;
    this.userPlanningLocationViewModel.pageNo = this.paginator.pageIndex;
    this.userPlanningLocationViewModel.pageSize = this.paginator.pageSize;

    this.useraccessService.getPlanningLocationList(this.userPlanningLocationViewModel).subscribe(y => {
      let userPlanningLocationList: UserLocationListViewModel[] = [];
      this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>([]);
      this.isPlanningLocationAllSelected = false;
      const rowList = y.Data;
      if (!!rowList) {
        rowList.filter(item => {
          let userPlanningLocationExist = new UserLocationListViewModel();
          userPlanningLocationExist.userId = item.UserId;
          userPlanningLocationExist.userLocationListId = item.Id;
          userPlanningLocationExist.locationId = item.LocationId;
          userPlanningLocationExist.LocationName = item.LocationName;
          userPlanningLocationExist.clientId = item.ClientId
          userPlanningLocationExist.isPLocationSelected = false;
          userPlanningLocationExist.LocationTypeName = item.LocationTypeName;
          userPlanningLocationExist.planinglocationIds = item.PlaninglocationIds;
          userPlanningLocationExist.planinglocationCount = item.PlaninglocationCount;
          this.size = item.PlaninglocationCount;
          this.existingLocationId = item.PlaninglocationIds;
          userPlanningLocationList.push(userPlanningLocationExist);
        });
        this.userPlanningLocationList = new MatTableDataSource<UserLocationListViewModel>(userPlanningLocationList);
        this.paginator.length = this.size;
        this.isPlanningLocationAllSelected = false;
      }
    });
  }


  selectPlanningLocationAll(check: any) {
    this.selection.clear();
    this.isPlanningLocationAllSelected = check.checked;
    this.userPlanningLocationList.data.forEach(row => {
      row.isPLocationSelected = this.isPlanningLocationAllSelected;
    });
    this.setPlanningLocationCheckBoxData();
  }

  selectPlanningLocationCheckbox(value: any) {
    this.userPlanningLocationList.data.forEach(row => {
      if (row.userLocationListId == value.userLocationListId)
        row.isPLocationSelected = !value.isPLocationSelected;
    });

    this.isPlanningLocationAllSelected = (this.userPlanningLocationList.data.length === (this.userPlanningLocationList.data.filter(x => x.isPLocationSelected == true).length));

    this.setPlanningLocationCheckBoxData();
  }

  idsPlanningLocationDeteted: string = '';
  setPlanningLocationCheckBoxData() {
    let iDs: string = '';
    this.idsPlanningLocationDeteted = '';
    this.userPlanningLocationList.data.filter(x => {
      if (x.isPLocationSelected == true) {
        iDs += `${x.userLocationListId},`;
        this.idsPlanningLocationDeteted += `${x.userLocationListId},`;
      }
    });
    if (iDs.length > 0) {
      iDs = iDs.substring(0, iDs.length - 1);
      this.idsPlanningLocationDeteted = this.idsPlanningLocationDeteted.substring(0, this.idsPlanningLocationDeteted.length - 1);
    }
  }
  OrganizationId: number;
  GetOrganizationId() {
    this.useraccessService.getUserDetailByIdsList(String(this.userId))
      .subscribe(res => {
        this.OrganizationId = res.Data[0].OrgnizationId;
      });
  }
}

  
