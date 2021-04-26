import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialHierarchyDetailModel } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';

@Component({
  selector: 'app-material-hierarchy-detail',
  templateUrl: './material-hierarchy-detail.component.html',
  styleUrls: ['./material-hierarchy-detail.component.css']
})
export class MaterialHierarchyDetailComponent implements OnInit {
  @Input() public data;
  materialHierarchyDetailModel = new MaterialHierarchyDetailModel();
  displayedColumns = ['materialGroupID', 'materialGroupValueDesc'];
  dataSource;// = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<MaterialHierarchyDetailModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isLinear = false;

  constructor(private router: Router, public activeModal: NgbActiveModal, private materialService: MaterialService, private authenticationService: AuthService) { }

  ngOnInit(): void {
    
    this.materialHierarchyDetailModel.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialHierarchyDetailModel.materialHierarchyID = this.data.id;
    //this.groupName = this.data.description;
    this.getMaterialHierarchyDetailData();
    this.dataSource = new MatTableDataSource<MaterialHierarchyDetailModel>();
  }

  getMaterialHierarchyDetailData() {
    
    this.selection.clear();
    this.materialService.getMaterialHierarchyDetailData(this.materialHierarchyDetailModel)
      .subscribe(result => {
        
        this.dataSource.data = result.data;
        this.dataSource.sort = this.sort;
      }
      );
  }
}


