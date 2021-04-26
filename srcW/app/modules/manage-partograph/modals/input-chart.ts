
import { BaseChartViewModel } from "@app/core/models/basegraph.model";
import { BehaviorSubject } from "rxjs";

export class SendChartModel {
  ClientId: number;
  PatientId: number;
  PartographId: number;
  StagesId: number;
  ChartValue: string;
  XAxisPosition: number;
  YAxisPosition: number;
  CreateDateTimeBrowser: Date;

}


export class PartographSessionManagement  {

  PatientId: number;
  PartographId: number;
  LocationId: number;

}

export class ServerChartCommonComment {
  CommentModule: string;
  ParentID: number;
  ClientId: number;
  IsUrgent: boolean = false;
  SourceSystemID: number;
  CreateDateTimeBrowser: Date;
  UpdateDateTimeBrowser: Date;
  UpdatedBy: string;
  CreatedBy: string;
  Description: string;
}




export class ServerChartValues extends BaseChartViewModel {
  StagesID?: number;
  ChartValue: string;
  UpperBPValue: number;
  X_axis_Position: string;
  Y_axis_Position: string;
  XAxisPosition: number;
  YAxisPosition: number;
  SourceSystemId?:number;
  UpdateDateTimeBrowser:Date;
  CreateDateTimeBrowser:Date;
  UpdatedBy:string;
  CreatedBy: string;
  IntialPosition?: number;
  PatternValue: string;
  PreviousPosition?: number;
  BrowserTimeZone: string;
  //PaientId: number;
  StageId: number;
  StagesId: number;
  PatientId: number;


 
  

  public static GetPartpgraphId(): number {

    if (localStorage.getItem("PartographPatient") != undefined) {
      //new BehaviorSubject < PartographSessionManagement >
      let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));
      

      if (obj.PartographId != undefined) {
        return obj.PartographId;
      }

    }

    return null;
  }

  public static GetLocationId(): number {

    if (localStorage.getItem("PartographPatient") != undefined) {

      let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));

      if (obj.LocationId != undefined) {
        return (obj.LocationId)
      }

    }
    return null;
  }

  public static GetPatientId(): number {

    if (localStorage.getItem("PartographPatient") != undefined) {

      let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));
      
      if (obj.PatientId != undefined) {
        return (obj.PatientId)
      }

    }
    
    return null;
  }

  public static MatTabButtonEnable(): boolean {
  
    if (localStorage.getItem("PartographPatient") != undefined) {
      if (localStorage.getItem("PartographPatient") != null) {
        let obj: PartographSessionManagement = (JSON.parse(localStorage.getItem('PartographPatient')));

        if (obj != null) {

          if (obj.PatientId != undefined) {

            return false;
            // this.data.sendEnableDisable_WhenPatientIdnotfound(false);
          }
          else {
            return true;
            // this.data.sendEnableDisable_WhenPatientIdnotfound(true);
          }
        }
        else {
          return true;
          // this.data.sendEnableDisable_WhenPatientIdnotfound(true);
        }
      }
      else {
        return true;
        // this.data.sendEnableDisable_WhenPatientIdnotfound(true);
      }
    }
    else {
      return true;
      // this.data.sendEnableDisable_WhenPatientIdnotfound(true);
    }
  }

}


export class PartographSession {

  PatientId: number;
  PartographId: number;
  LocationId: number;

}
