import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../../core/services';
import { ContractService } from '../../../../../../core/services/contract.service';
import { Contract } from '../../../../../../core/models/contract.model';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {
  object: Contract = new Contract();
  ChargeDescription = [];
  settingsCharge = {};
  selectedCharge = [];
  constructor(private authService: AuthService, private contractService: ContractService) { }

  ngOnInit(): void {
  }
  
}
