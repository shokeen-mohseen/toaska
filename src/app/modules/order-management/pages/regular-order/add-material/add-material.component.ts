import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { regularOrderModel } from '@app/core/models/regularOrder.model';
import { OrderManagementService } from '../../../../../core/services/order-management.service';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


export interface Element {
  highlighted?: boolean;
}
export interface PeriodicElement {
  Material: string;
  OrderQuantity: string;
  ShippedQuantity: string;
  Id: number; 
}



@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {


  //material table code

  displayedColumns = ['selectRow', 'Material', 'OrderQuantity', 'ShippedQuantity', 'Action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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

  MaterialData: any;
  UOMData: any;
  MaterialDetails: any = [];
  SelectMaterial: number;
  SelectUOM: number;
  OQuantity: string;
  ShipQuantity: number = 0;
  Action: string = "Edit/Delete";
  constructor(private router: Router, private orderManagementService: OrderManagementService, private toastrService: ToastrService) { }
  ngOnInit() {    

         this.orderManagementService.GetMaterialList()
        .subscribe(
          data => {           
            this.MaterialData = data.data;
          });

    this.orderManagementService.GetUOMData()
      .subscribe(
        data => {         
          this.UOMData = data.data;
          this.SelectUOM = this.UOMData.find(f => f.code == "EA")?.id;
        });
    }
  highlight(element: Element) {
    element.highlighted = !element.highlighted;
  }
  AddMaterial() {   
    
    var getmaterial = this.MaterialData.filter(f => f.id == this.SelectMaterial);
    //var getUom = this.UOMData.filter(f => f.id == this.SelectUOM);
    var Condition1 = this.MaterialDetails.find(temp => temp.Id == getmaterial[0].id)

    if (Condition1) {
      this.toastrService.success('This material has already been added to the order');

    }
    else {
      this.MaterialDetails.push({
        Material: getmaterial[0].name,
        OrderQuantity: this.OQuantity,
        ShippedQuantity: this.ShipQuantity,
        Id: getmaterial[0].id,
      });

    }  
    
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
    this.selection = new SelectionModel<PeriodicElement>(true, []);

  }

  DeleteMaterial(id: number) {
  
    for (var i = 0; i < this.MaterialDetails.length; i++) {
      if (this.MaterialDetails[i].Id == id)
      {
        this.MaterialDetails.splice(i, 1);
      }
    }   
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.MaterialDetails)
    this.selection = new SelectionModel<PeriodicElement>(true, [])    

  }
  selectmaterial(event) {       
    this.orderManagementService.MaterialQuantity(10, Number(event.target.value), 100,"Number of Units in an Equipment")
      .subscribe(
        data => {          
          if (data.data != null) {
            this.OQuantity = data.data.propertyValue;
          }
          else {
            this.OQuantity = null;
          }
         
        });

  }

}
