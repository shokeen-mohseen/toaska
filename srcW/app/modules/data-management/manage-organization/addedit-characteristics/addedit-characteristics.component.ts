import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from '../../../../core/services/organization.service';
import { AuthService } from '../../../../core';
@Component({
  selector: 'app-addedit-characteristics',
  templateUrl: './addedit-characteristics.component.html',
  styleUrls: ['./addedit-characteristics.component.css']
})
export class AddeditCharacteristicsComponent implements OnInit {

  @Input() characteristicsList;
  @Input() organizationId: number;


  constructor(
    public activeModal: NgbActiveModal, private organizationService: OrganizationService,
  ) {
    
  }

 

  ngOnInit(): void {

    this.organizationService.getCharacteristicsListDescription(this.organizationId).subscribe(res => {
      if (this.characteristicsList && this.characteristicsList.length) {
        this.characteristicsList = res.data.map(item => {
          const match = this.characteristicsList.find(char => char.entityPropertyName === item.description);
          if (match) {
            item.value = match.propertyValue;
          }
          return item;
        });
      } else {
        this.characteristicsList = res.data;
      }
    })

  }

  save() {
    this.activeModal.close(this.characteristicsList);
  }
 
}
