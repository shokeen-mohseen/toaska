import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicWebcontrolParameterService } from '@app/modules/manage-partograph/services/dynamic-webcontrol-parameter.service';
import { DynamicWebControl } from '@app/modules/manage-partograph/modals/dynamic-webcontrol-parameter.model';
import { ServerChartValues } from '@app/modules/manage-partograph/modals/input-chart';

@Component({
  selector: 'app-add-complications',
  templateUrl: './add-complications.component.html',
  styleUrls: ['./add-complications.component.css']
})
export class AddComplicationsComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  UserForm: FormGroup; webcontroltypeList: any[];
  dynamicWebControlObj: DynamicWebControl;
  constructor(private webcontrolService: DynamicWebcontrolParameterService,
    private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {

    this.dynamicWebControlObj = new DynamicWebControl();
    //this.dynamicWebControlObj.PatientId = ServerChartValues.GetPatientId();
   // this.dynamicWebControlObj.PartographId = ServerChartValues.GetPartpgraphId();
   // this.dynamicWebControlObj.StageCode = "PS-3";
  }

  ngOnInit(): void {
    this.buildForm();
    this.LoadObservationParams(this.dynamicWebControlObj);
  }

  get f() {

    return this.UserForm.controls;
  }

  passBack() {
    if (this.UserForm.dirty && this.UserForm.valid) {
      this.passEntry.emit(this.UserForm.value);
      this.activeModal.close(this.UserForm.value);

    }

  }

  GetComplicationValues() {
    return this.webcontroltypeList;
    //ComplicationListValues.ComplicationDrp;
  }

  private buildForm(): void {

    this.UserForm = this.formBuilder.group(
      {
        SelectType: [3, Validators.required],
        HeadValue: ['', Validators.required]
      }
    );
  }

  LoadObservationParams(baseView) {
    this.webcontrolService.GetDynamicWebcontrolType(baseView).subscribe(data => {

      if (data.data != null) {
        this.UserForm.patchValue({ SelectType: data.data[0].id });
        this.webcontroltypeList = data.data;
      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );
  }

}
export class ComplicationListValues {

 public static ComplicationDrp: any = [
  
    {
     "CId": "radio",
     "CName": "Yes/No"
    },
    {
     "CId": "Hour",
      "CName": "Hour"
   },
   {
     "CId": "CTemp",
     "CName": "°C"
   },
   {
     "CId": "FTemp",
     "CName": "°F"
   }

  ]

}
