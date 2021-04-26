import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-baby-notes',
  templateUrl: './baby-notes.component.html',
  styleUrls: ['./baby-notes.component.css']
})
export class BabyNotesComponent implements OnInit {
  stageCode: string;
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.stageCode = GlobalConstants.PATIENT_PostpartumCare_STAGE2;
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}
