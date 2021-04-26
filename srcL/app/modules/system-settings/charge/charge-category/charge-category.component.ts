import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChargeService } from '../../../../core/services/charge.service'
import { ChargeCategory } from '../../../../core/models/charge.model';

@Component({
  selector: 'app-charge-category',
  templateUrl: './charge-category.component.html',
  styleUrls: ['./charge-category.component.css']
})
export class ChargeCategoryComponent implements OnInit, AfterViewInit {

  displayedColumns = ['ChargeCategoryCode', 'ChargeCategoryDescription'];
  dataSource = new MatTableDataSource<ChargeCategory>();
  selection = new SelectionModel<ChargeCategory>(true, []);

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

  constructor(private router: Router, private ChargeService: ChargeService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getChargeCategoryList();
  }
  ngAfterViewInit(): void {
   
  }
  getChargeCategoryList() {
    this.ChargeService.getChargeCategoryList()
      .subscribe(result => {
        this.dataSource = new MatTableDataSource<ChargeCategory>(result.data);

      }
      );
  }
}

