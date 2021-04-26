import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartographPatientSetup } from "../../modules/manage-partograph/modals/patient-information";
import { PatientPartographDetail, PatientRegistration } from "../models/partograph-registration";
import { FormGroup } from "@angular/forms";
import { User } from "../models";
import { AuthService } from "./auth.service";
import { ToastrService } from "ngx-toastr";
import { ServerChartValues, PartographSessionManagement } from "../../modules/manage-partograph/modals/input-chart";
import { GlobalConstants } from "../models/GlobalConstants ";
import { DataService } from "../../shared/services";
import { PatientInformationService } from "../../modules/manage-partograph/services/patient-informaation.services";
import moment from "moment";
import { ISaveDynamicParameter } from "../../modules/manage-partograph/modals/dynamic-webcontrol-parameter.model";
import { DynamicWebcontrolParameterService } from "../../modules/manage-partograph/services/dynamic-webcontrol-parameter.service";

@Injectable({
  providedIn: 'root'
})

export class DyanmicWebControlServiceSave {
  partographId: number;
  public AddFormDynamicParameter: {
    AddDynamicParam: ISaveDynamicParameter[];

  };
  currentUser: User;
  
  constructor(private webcontrolService: DynamicWebcontrolParameterService,
              private authenticationService: AuthService, private toastr: ToastrService) {
   
    this.currentUser = this.authenticationService.currentUserValue;
    
  }


  public SaveObservation(form: FormGroup): boolean {

    console.log(form.value.dynamicWebControl.dynamicParameterFormArray)
   
    for (let i = 0; i < form.value.dynamicWebControl.dynamicParameterFormArray.length; i++) {

     

      this.AddFormDynamicParameter.AddDynamicParam.push({
        DynamicMeasurementParameterID: form.value.dynamicWebControl.dynamicParameterFormArray[i].dynamicMeasurementParameterID,
        ClientID: this.currentUser.ClientId,
        createdBy: this.currentUser.LoginId,
        CreateDateTimeBrowser: new Date(),
        ParameterValue: form.value.dynamicWebControl.dynamicParameterFormArray[i].parameterValue,
        ParameterValueComment: form.value.dynamicWebControl.dynamicParameterFormArray[i].parameterValueComment,
        PartographID: ServerChartValues.GetPartpgraphId(),
        PatientID: ServerChartValues.GetPatientId(),
        SourceSystemID: 1,
        StageCode: form.value.dynamicWebControl.dynamicParameterFormArray[i].stageCode,
      });



    }


    this.webcontrolService.AddDynamicMeasurementParametersValues(this.AddFormDynamicParameter.AddDynamicParam).subscribe(data => {
      if (data.data != null) {
        let obsData: any[] = data.data;

        if (obsData != null) {
          return true;
         // this.toastr.success(GlobalConstants.SUCCESS_MESSAGE);

        }
        else {
          return false;
          //this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        }

      }
      else {
        //this.tempList = [];
      }

    },
      error => {
        return false;
        //this.toastr.success(GlobalConstants.FAILED_MESSAGE);
        // .... HANDLE ERROR HERE 
        console.log(error);
        //this.tempList = [];
      }

    );
    return false;
    //console.log(this.AddFormDynamicParameter.AddDynamicParam)
  }

}
