import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerPropertyDetails } from '../../../../core/models/Location';
import { CustomerByLocationService } from '../../../../core/services/customer-by-location.service';

@Component({
  selector: 'app-contracts-panel',
  templateUrl: './contracts-panel.component.html',
  styleUrls: ['./contracts-panel.component.css']
})
export class ContractsPanelComponent implements OnInit {
  @Input() ScreenAction: string;
  @Input() InputlocationId: number;
  @Output() contractListLength: EventEmitter<any> = new EventEmitter<any>();
  contractList: any = [];
  propertyDetailsViewModel: CustomerPropertyDetails = new CustomerPropertyDetails();
  constructor(private customerbylocationService: CustomerByLocationService,) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //alert(this.ScreenAction);
    this.BindCustomerContract();
  }

  BindCustomerContract() {
    this.customerbylocationService.GetContractList(this.ScreenAction, this.InputlocationId)
      .subscribe(
        result => {
          this.contractList = result.data
          this.contractListLength.emit(this.contractList.length);
        }
      );
  }
}
