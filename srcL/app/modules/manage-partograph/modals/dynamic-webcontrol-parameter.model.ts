import { BaseChartViewModel } from "@app/core/models/basegraph.model";

export class DynamicWebControl extends BaseChartViewModel {

  StageCode: string;
  Mode: string;
  WebControlTypeID: number;
  DynamicMesurementId: number;
  Name: string;
  UOM: string;
  
 
  
}


export interface ISaveDynamicParameter {

  DynamicMeasurementParameterID: number;
  ParameterValue: string;
  ParameterValueComment: string;
  PatientID: number;
  PartographID: number
  ClientID: number;
  SourceSystemID: number;
  createdBy: string;
  CreateDateTimeBrowser: Date;
  StageCode: string;
}
