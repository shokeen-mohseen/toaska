import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  modalRef: NgbModalRef;
  stageCode: string;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.stageCode = GlobalConstants.PATIENT_PostpartumCare_STAGE3;
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}
