import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-general-physical-examination',
  templateUrl: './general-physical-examination.component.html',
  styleUrls: ['./general-physical-examination.component.css']
})
export class GeneralPhysicalExaminationComponent implements OnInit {
  stageCode: string;
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    this.stageCode = GlobalConstants.PATIENT_PrepartumCare_STAGE3;
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }
}


