import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';

@Component({
  selector: 'app-postpartum-care-report',
  templateUrl: './postpartum-care-report.component.html',
  styleUrls: ['./postpartum-care-report.component.css']
})
export class PostpartumCareReportComponent implements OnInit {

  stageCode: string;
  modalRef: NgbModalRef;
  constructor(public modalService: NgbModal) { }


  ngOnInit(): void {
    this.stageCode = GlobalConstants.PATIENT_PostpartumCare_STAGE4;
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
