import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChargeType } from '../../../../core/models/charge.model';
import { ChargeService } from '../../../../core/services/charge.service';

@Component({
  selector: 'app-charge-type',
  templateUrl: './charge-type.component.html',
  styleUrls: ['./charge-type.component.css']
})
export class ChargeTypeComponent implements OnInit, AfterViewInit{

  displayedColumns = ['ChargeTypeCode', 'ChargeTypeDescription'];
  dataSource ;
  selection = new SelectionModel<ChargeType>(true, []);

  constructor(private router: Router,
    private chargeService: ChargeService,
    public activeModal: NgbActiveModal) { }

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


  ngOnInit(): void {
    this.getChargeTypeList();
  }
  ngAfterViewInit(): void {
    
    
  }
  getChargeTypeList() {
    this.chargeService.getChargeTypeList()
      .subscribe(result => {
        this.dataSource = new MatTableDataSource<ChargeType>(result.data);
        
        }
      );
  }

}
