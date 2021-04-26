import { Component, ViewChild, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HelpPreferenceComponent } from '../help-preference/help-preference.component';
import { PreferenceType } from '../../../../core/models/preferencetype.model';
import { PreferenceTypeCategory } from '../../../../core/models/preferencetypecategory.model';
import { SpecialPreferenceService } from '../../services/specialpreference.service';
import { PreferenceListDataService } from './preference-list-data.service';
import { ToastrService } from 'ngx-toastr';
export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

export class Prefrence {
  selectRow: string = '';
  GroupName: string = '';
  AppPreferenceDescription: string = '';
  AppPreferenceValueDefault: string = '';
  AppPreferenceValueModified: string = '';
  Help: string = '';
}


@Component({
  selector: 'app-preference-list',
  templateUrl: './preference-list.component.html',
  styleUrls: ['./preference-list.component.css']
})
export class PreferenceListComponent implements OnInit {

  selectRow: any;
  Help: any;
  cmd: boolean;
  columns: any[];
  displayedColumns: string[];
  displayedColumnsnew = ['selectRow', 'description', 'userPreferencePreferenceValue', 'userPreferenceModifiedValue', 'preferenceDetailDescription'];
  displayedColumnsReplace = ['selectRow', 'key_AppPreferenceDescription', 'key_AppPreferenceValueDefault', 'key_AppPreferenceValueModified', 'key_Help'];
  public dataSource = new MatTableDataSource<any | Group>([]);
  //selection = new SelectionModel<Prefrence>(true, []);
  groupByColumns: string[] = [];
  _alldata: any[];
  //dataSource;
  selection = new SelectionModel<PreferenceType>(true, []);
  ItemList: PreferenceType[];
  filterValue = "";
  paginationModel = new PreferenceType();
  PreferenceType: PreferenceType = new PreferenceType();
  PreferenceTypeCategory: PreferenceTypeCategory = new PreferenceTypeCategory();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('SelectedPreferenceType') SelectedPreferenceType = new EventEmitter<PreferenceType[]>();
  @Input('PreferenceTypeToSelect') PreferenceTypeToSelect: PreferenceType[];
  @Input('SelectedPreferenceGridList') SelectedPreferenceGridList: PreferenceType[];



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterText: string) {
    this.filterValue = filterText.trim(); // Remove whitespace
    this.getAllPreferenceTypeRecord();
    //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.isSelected = true;
        this.ItemList.push(row);
        this.SelectedPreferenceType.emit(this.selection.selected);
      });
  }
  isLinear = false;
  modalRef: NgbModalRef;

  constructor(
    private dataSourceService: PreferenceListDataService,
    private toastr: ToastrService,
    private specialPreferenceService: SpecialPreferenceService,
    private router: Router,
    public modalService: NgbModal) {
    this.columns = [{
      field: 'selectRow'
    }, {
        field: 'description'
    }, {
        field: 'userPreferencePreferenceValue'
    }, {
        field: 'userPreferenceModifiedValue'
    }, {
        field: 'Help'
      }];

    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['preferenceTypeCategoryCode'];
  }

  ngOnInit(): void {
    this.cmd = false;
    this.getAllPreferenceTypeRecord();
    
    this.ItemList = new Array<any>();
    
  }
  getAllPreferenceTypeRecord() {
    this.selection.clear();
    this.paginationModel.filterOn = this.filterValue;
    this.specialPreferenceService.getAllRecords(this.paginationModel)
      .subscribe(
        (data: any) => {
 
          data.data.forEach((item, index) => {
         
            item.id = index + 1;
            
          });
      
          this._alldata = data.data;
          this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
          this.dataSource.filter = performance.now().toString();
        },
        (err: any) => console.log(err)
      );

    this.selectRow = 'selectRow';
    this.Help = 'Help';
  }
  onSelectionChange(row: PreferenceType, checked: boolean) {
    row.isSelected = checked;
    this.selection.toggle(row);

    if (checked == true) {
      this.ItemList.push(row);

    }
    else {

      this.ItemList = this.ItemList.filter(m => m != row);
    }
    this.SelectedPreferenceType.emit(this.selection.selected);
  }
  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  
  onPaginationEvent(event) {
    this.filterValue = "";
    this.paginationModel.pageNo = event.pageIndex + 1;
    this.paginationModel.pageSize = event.pageSize;
   // this.getOriginOfGoodsList();
  }
  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }
  customSort(event) {
    if (event.active != 'selectRow') {
      this.paginationModel.sortColumn = event.active;
      this.paginationModel.sortOrder = event.direction.toLocaleUpperCase();
      this.getAllPreferenceTypeRecord();
    }
  }

  openaddPallet(row,event) {
    this.modalRef = this.modalService.open(HelpPreferenceComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.PreferenceDetailDescription = row.preferenceDetailDescription;
   
  }
  deletePreferenceTypeList(ItemList: PreferenceType[]) {
    if (!this.ItemList.length) {
      this.toastr.warning('Please select atleast one record');
    }
    else {
      const ids = this.ItemList.map(i => i.id).join(',');
      this.specialPreferenceService.deleteAllPrefernceType(ids).subscribe(x => {
        const newList = this.dataSource.data.filter(item => !this.ItemList.includes(item as any))
        this.specialPreferenceService.getAllRecords(this.paginationModel)
          .subscribe(result => {
            this.dataSource.data = result.data;
            this.toastr.success('Record Deleted Successfully');
            this.getAllPreferenceTypeRecord();
          }
          );

      });
    }
  }
}

