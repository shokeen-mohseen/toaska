import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialService } from '../../../../core/services/material.service';
import { AuthService } from '../../../../core';
import { MaterialGroupDetailModel } from '../../../../core/models/material.model';

@Component({
  selector: 'app-material-group-detail',
  templateUrl: './material-group-detail.component.html',
  styleUrls: ['./material-group-detail.component.css']
})
export class MaterialGroupDetailComponent implements OnInit {
  @Input() public data;
  materialGroupDetail = new MaterialGroupDetailModel()
  displayedColumns = ['materialGroupValueDesc'];
  dataSource;
  groupName = '';
  selection = new SelectionModel<MaterialGroupDetailModel>(true, []);

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
   
    this.materialGroupDetail.clientID = this.authenticationService.currentUserValue.ClientId;
    this.materialGroupDetail.materialGroupID = this.data.id;
    this.groupName = this.data.description;
    this.getMaterialGroupDetailData();
    this.dataSource = new MatTableDataSource<MaterialGroupDetailModel>();
  }

  getMaterialGroupDetailData() {
   
    this.selection.clear();
    this.materialService.getMaterialGroupDetailData(this.materialGroupDetail)
      .subscribe(result => {
     
        this.dataSource.data = result.data;
        this.dataSource.sort = this.sort;
      }
      );
  }

}



