import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddBirthingPositionComponent } from '../../../../../shared/components/modal-content/add-birthing-position/add-birthing-position.component';
import { AddComplicationsComponent } from '../../../../../shared/components/modal-content/add-complications/add-complications.component';
import { Options } from 'select2';
import { GlobalConstants } from '../../../../../core/models/GlobalConstants ';
@Component({
  selector: 'app-obstetric-formula',
  templateUrl: './obstetric-formula.component.html',
  styleUrls: ['./obstetric-formula.component.css']
})
export class ObstetricFormulaComponent implements OnInit {

  stageCode: string;

  modalRef: NgbModalRef;
  public options: Options;
  public exampleData: any;
  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {

    this.stageCode = GlobalConstants.PATIENT_PrepartumCare_STAGE1;

    //multi select data
    this.exampleData = [
      {
        id: 'multiple1',
        text: ''
      },
      {
        id: 'multiple2',
        text: '1'
      },
      {
        id: 'multiple3',
        text: '2'
      },
      {
        id: 'multiple4',
        text: '3'
      }
    ];
    //multi select options
    this.options = {
      tags: true,
    };
  }

  //open modal to add new birthing position
  addnewPosition() {
    this.modalRef = this.modalService.open(AddBirthingPositionComponent, { size: 'md', backdrop: 'static' });
  }

  AddMoreComplication() {
    this.modalRef = this.modalService.open(AddComplicationsComponent, { size: 'lg', backdrop: 'static' });
  }

}
