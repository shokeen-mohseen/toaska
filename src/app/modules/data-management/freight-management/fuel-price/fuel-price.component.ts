import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { projectkey } from 'environments/projectkey';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { ResizeEvent } from 'angular-resizable-element';
import { getGlobalRibbonActions } from '@app/shared/components/top-btn-group/page-actions-map';
import { TopBtnGroupComponent } from '@app/shared/components/top-btn-group/top-btn-group.component';
import { AddFuelComponent } from './add-fuel/add-fuel.component';
import { FuelPriceViewModel } from '../../../../core/models/fuel';
import { FuelPriceService } from '../../../../core/services/fuel-price.service';
import { AuthService, PreferenceTypeService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { ConfirmDeleteTabledataPopupComponent } from '../../../../shared/components/confirm-delete-tabledata-popup/confirm-delete-tabledata-popup.component';

@Component({
  selector: 'app-fuel-price',
  templateUrl: './fuel-price.component.html',
  styleUrls: ['./fuel-price.component.css']
})
export class FuelPriceComponent implements OnInit, AfterViewInit {
  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }
  displayedColumns = ['selectRow', 'countryCode', 'priceType', 'fuelPriceDateTime', 'rate', 'chargeRatePerMile', 'uom'];
  displayedColumnsReplace = ['selectRow', 'key_Llocation', 'key_Type', 'key_Date', 'key_Price', 'key_Permilecharge', 'key_UOM'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<FuelPriceViewModel>(true, []);
  dataSource = new MatTableDataSource<FuelPriceViewModel>();
  currentWeekList: FuelPriceViewModel[];
  paginationModel = new FuelPriceViewModel();
  filterValue: string;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  weekStartDate: string;
  weekEndDate: string;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @Input('fuelsInEdit') fuelsInEdit: FuelPriceViewModel[];
  fuelPriceViewModel: FuelPriceViewModel = new FuelPriceViewModel();
  //@Output('selectedFuel') selectedFuel = new EventEmitter<FuelPriceViewModel[]>();
  selectedFuel: FuelPriceViewModel[] = [];
  actionGroupConfig;
  FuelPriceList: string = "FuelPriceExport";
  constructor(private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
    private ptService: PreferenceTypeService,
    public fuelService: FuelPriceService,
    private authenticationService: AuthService
  ) { }
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab1Data: boolean = true;
  tab2Data: boolean = false;
  tab3Data: boolean = false;

  tabChange($event) {
    if ($event.index === 0) {
      this.tab1Data = true;
    }
    else if ($event.index === 1) {
      this.tab2Data = false;
    }
    else if ($event.index === 2) {
      this.tab3Data = false;
    }
  }

  actionHandler(type) {

    if (type === "add") {

      this.modalRef = this.modalService.open(AddFuelComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getPageSize();
        this.getFuelPriceList();
      });

    }
    else if (type === "edit") {
      if (this.selectedFuel == null || this.selectedFuel.length < 1) {
        this.toastrService.warning("Please select at least one record");
        return;
      }
      else if (this.selectedFuel.length > 1) {
        this.toastrService.warning('Please select only one record for editing');
        return;
      }
      else {

        this.modalRef = this.modalService.open(AddFuelComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.componentInstance.isEdit = true;
        this.modalRef.componentInstance.selectedId = this.selectedFuel[0].id;
        this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
          this.getPageSize();
          this.getFuelPriceList();
        });
      }


    }

    else if (type === "delete") {
      this.iDs = '';
      this.selectedFuel.forEach(item => {
        this.iDs += `${item.id},`;
      });

      if (this.selectedFuel == null || this.selectedFuel.length < 1) {
        this.toastrService.warning("Please select at least one record");
        return;
      }
      this.modalRef = this.modalService.open(ConfirmDeleteTabledataPopupComponent, { size: 'lg', backdrop: 'static' });
      //if (confirm("Are you sure you want to delete the selected records??")) {
      this.modalRef.result.then((result) => {
        //this.fuelPriceViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.fuelPriceViewModel.selectedIds = this.iDs;
        this.fuelService.deleteFuelPriceById(this.fuelPriceViewModel).subscribe(x => {
          if (x.data) {
            this.toastrService.success('Records deleted successfully');
            this.getPageSize();
            this.getFuelPriceList();
          }
          else {
            this.toastrService.warning('Record does not exists');
          }

          //this.buttonEnableDisable = true;
        });
      }, (reason) => {
      });
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  async applyFilter(filterValue: string) {
    // this.filterValue = filterValue.trim(); // Remove whitespace
    //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //this.dataSource.filter = filterValue;
    // this.getFuelPriceList();
    this.filterValue = filterValue.trim();
    this.paginationModel.filterOn = this.filterValue;// Remove whitespace
    await this.getPageSize();
    this.getFuelPriceList();
  }
  clearFilter(filterText: string) {
    //alert(1);
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getFuelPriceList();
    }

  }
  isFirstDisabled: boolean = false;
  index: any;
  getFuelPriceList() {
    this.index = [];
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.fuelService.getFuelPriceList(this.paginationModel).subscribe(result => {

      result.data.sort((x, y) => +new Date(y.fuelPriceDateTimePicker) - +new Date(x.fuelPriceDateTimePicker));
      if ((new Date(result.data[0].fuelPriceDateTimePicker) >= new Date(this.weekStartDate)
        && new Date(result.data[0].fuelPriceDateTimePicker) <= new Date(this.weekEndDate))) {
        result.data[0].isFirstEnabled = true;
      }
      this.dataSource.data = result.data;
      this.paginator.showFirstLastButtons = true;
      this.setRowSelection();
    });
  }

  setRowSelection() {
    if (this.fuelsInEdit != null && this.fuelsInEdit.length > 0) {
      this.dataSource.data.forEach(row => {
        if (this.fuelsInEdit.findIndex(item => item.id === row.id) >= 0) {
          this.selection.select(row);
          row.isSelected = true;
        }
        else {
          this.selection.deselect(row);
          row.isSelected = false;
        }

      });
    }
  }
  getDefaultPageSize() {
    this.ptService.getPreferenceTypeByCode("PageSize")
      .subscribe(result => {
        this.paginationModel.pageSize = Number(result.data.preferenceValue);
        this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
        this.paginationModel.sortColumn = 'UpdateDateTimeServer';
        this.paginationModel.sortOrder = 'Desc';
        this.getFuelPriceList();
      });
  }
  async getPageSize() {

    this.paginationModel.pageNo = 0;
    this.paginationModel.pageSize = 0;

    await this.fuelService.getFuelPriceList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
        // this.getDefaultPageSize();
        //this.getFuelPriceList();
      });

    this.fuelService.getDefaultPageSize();

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getFuelPriceList();
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => { this.selection.select(row); row.isSelected = true; });
    this.selectedFuel = this.selection.selected;
  }
  modalRef: NgbModalRef;
  isTosca: boolean;

  selectRow: any;
  async ngOnInit() {
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.weekStartDate = moment().day(1).format('MM/DD/YYYY');
    this.weekEndDate = moment().day(7).format('MM/DD/YYYY');
    this.buttonPermission();
    this.selectRow = 'selectRow';

    if (projectkey.projectname == "tosca") {
      this.isTosca = true;
    }
    else {
      this.isTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();

    await this.getPageSize();


  }

  async ngAfterViewInit() {
    this.paginator.showFirstLastButtons = true;
    this.btnBar.showAction('cancel');
    this.btnBar.hideTab('key_Action');
    this.btnBar.hideTab('key_View');
    this.getFuelPriceList();
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    var UserId = this.authenticationService.currentUserValue.UserId;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey, UserId)
      .subscribe(res => {
        if (res.Message == "Success") {
          var data = res.Data;
          // assumption here is if we do not have anything set for this screen
          // or we have Read and Modify access then enable all, else diable all
          if (!data || data[0].PermissionType == "Read and Modify") {
            this.btnBar.enableAction('edit');
            this.btnBar.enableAction('active');
            this.btnBar.enableAction('inactive');
          }
          else {
            this.btnBar.disableAction('add');
            this.btnBar.disableAction('delete');
            this.btnBar.disableAction('edit');
            this.btnBar.disableAction('active');
            this.btnBar.disableAction('inactive');
          }
        }
      });

  }
  ngOnChanges(changes: any) {
    this.setRowSelection();
  }
  iDs: string = '';
  onSelectionChange(row: FuelPriceViewModel, checked: boolean) {

    if (row.isFirstEnabled) {
      row.isSelected = checked;
      this.selection.toggle(row);
      this.selectedFuel = this.selection.selected;
    }





  }
  onPaginationEvent(event) {
    //this.filterValue = "";
    //this.paginationModel.pageNo = event.pageIndex + 1;
    //this.paginationModel.pageSize = event.pageSize;
    //this.getFuelPriceList();
    this.paginationModel.filterOn = this.filterValue;
    this.paginationModel.pageNo = event.pageIndex + 1;
    if (this.paginationModel.pageNo > this.paginationModel.itemsLength / event.pageSize) {
      this.paginationModel.pageSize = event.length - (event.pageIndex * event.pageSize);
    }
    else {
      this.paginationModel.pageSize = event.pageSize;
    }
    this.getFuelPriceList();
    this.paginationModel.pageSize = event.pageSize;
  }
}
export interface PeriodicElement {
  Id: string;
  Location: string;
  Type: string;
  Date: string;
  Price: string;
  Permilecharge: string;
  UOM: string;
}

//const ELEMENT_DATA: PeriodicElement[] = [

//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },
//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },
//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },
//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },
//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },
//  { selectRow: '', Location: 'USA', Type: 'DOE Fuel Price per gallon', Date: '05-09-2020', Price: '2,232', Permilecharge: '0.210', UOM: 'US Doller Currency' },

//];
