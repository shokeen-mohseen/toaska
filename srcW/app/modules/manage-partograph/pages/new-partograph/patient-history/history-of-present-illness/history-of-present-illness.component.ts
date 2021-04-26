import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-history-of-present-illness',
  templateUrl: './history-of-present-illness.component.html',
  styleUrls: ['./history-of-present-illness.component.css']
})
export class HistoryOfPresentIllnessComponent implements OnInit {
  stageCode: string;
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.stageCode = GlobalConstants.PATIENT_PrepartumCare_STAGE2;
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}
