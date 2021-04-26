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
import { AuthService } from '../../../../core';
import { ToastrService } from 'ngx-toastr';

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
  paginationModel = new FuelPriceViewModel();
  filterValue: string;
  @ViewChild('tabGroupA') tabGroup: MatTabGroup;
  @ViewChild('btnBar') btnBar: TopBtnGroupComponent;
  @Input('fuelsInEdit') fuelsInEdit: FuelPriceViewModel[];
  fuelPriceViewModel: FuelPriceViewModel = new FuelPriceViewModel();
  //@Output('selectedFuel') selectedFuel = new EventEmitter<FuelPriceViewModel[]>();
  selectedFuel: FuelPriceViewModel[] = [];
  actionGroupConfig;
  constructor(private router: Router, public modalService: NgbModal,
    private toastrService: ToastrService,
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
        this.getFuelPriceList();
      });

    }
    else if (type === "edit") {
      if (this.selectedFuel == null || this.selectedFuel.length < 1) {
        this.toastrService.warning("Please select a record to edit.");
        return;
      }
      else if (this.selectedFuel.length > 1) {
        this.toastrService.warning('Please Select only one Record for edit');
        return;
      }
      else {
        
        this.modalRef = this.modalService.open(AddFuelComponent, { size: 'lg', backdrop: 'static' });
        this.modalRef.componentInstance.isEdit = true;
        this.modalRef.componentInstance.selectedId = this.selectedFuel[0].id;
        this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
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
        this.toastrService.warning("Please select a record to edit.");
        return;
      }
      if (confirm("Are you sure to delete?")) {
        this.fuelPriceViewModel.updatedBy = this.authenticationService.currentUserValue.LoginId;
        this.fuelPriceViewModel.selectedIds = this.iDs;
        this.fuelService.deleteFuelPriceById(this.fuelPriceViewModel).subscribe(x => {
          this.getFuelPriceList();
          this.toastrService.success('Records deleted successfully');
          //this.buttonEnableDisable = true;
        });
      }
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async ngAfterViewInit() {
    await this.getPageSize();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.btnBar.showAction('cancel')
    this.btnBar.hideTab('key_Action')
    this.btnBar.hideTab('key_View')
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //this.dataSource.filter = filterValue;
    this.getFuelPriceList();
  }
  clearFilter(filterText: string) {
    // doing this to clear filter if the filter field is empty.
    if (!filterText) {
      this.filterValue = ""; // Remove whitespace
      this.getFuelPriceList();
    }

  }
  getFuelPriceList() {
    
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.fuelService.getFuelPriceList(this.paginationModel).subscribe(result => {
      this.dataSource.data = result.data;
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

  async getPageSize() {
    this.paginationModel.clientId = this.authenticationService.currentUserValue.ClientId;
    this.paginationModel.pageSize = 0;
    await this.fuelService.getFuelPriceList(this.paginationModel).toPromise()
      .then(result => {
        this.paginationModel.itemsLength = result.recordCount;
      });
    // default page size
    this.paginationModel.pageSize = await this.fuelService.getDefaultPageSize();
    this.paginationModel.pageSizeOptions.push(this.paginationModel.pageSize);
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
  ngOnInit() {
    this.buttonPermission();
    this.selectRow = 'selectRow';
    
    if (projectkey.projectname == "tosca") {
      this.isTosca = true;
    }
    else {
      this.isTosca = false;
    }
    this.actionGroupConfig = getGlobalRibbonActions();
    this.getFuelPriceList();
    this.paginator.showFirstLastButtons = true;  
  }

  buttonPermission() {
    var ModuleNavigation = this.router.url;
    var ClientId = this.authenticationService.currentUserValue.ClientId;
    var projectKey = projectkey.projectname;
    this.authenticationService.getModuleRolePermission(ModuleNavigation, ClientId, projectKey)
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
    
    row.isSelected = checked;
    this.selection.toggle(row);
    this.selectedFuel = this.selection.selected;

   
    
    
  }
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
    this.getFuelPriceList();
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
