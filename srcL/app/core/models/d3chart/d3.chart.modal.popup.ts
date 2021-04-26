import { ExtendedModule } from "@angular/flex-layout";

export class SVGChart {
  public margin: any = { top: 10, right: 20, bottom: 30, left: 120 };
  public chart: any;
  public width: number;
  public height: number;
  public xScale: any;
  public yScale: any;
  public colors: any;
  public xAxis: any;
  public yAxis: any;
  public yAxistickPadding = 8;
  public xAxistickPadding = 8;
  public globalwidth = 1380;


}

export class Modelpopup {
  modelStagename: string;
  modelName: string;
  stageId: number;
}


export class TemperatureDataList {

  public static dtTempList: any = [
    {
      "Id": "°F",
      "Name": "°F"
    },
    {
      "Id": "°C",
      "Name": "°C"
    }
  ]
}

// Fetal Heart chart Models begins
export class FetalHeartChartModalPopup extends Modelpopup {
  currentTime: Date;
  yAxisPosition: number;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
  
}

export enum FetalHeartChartXYAxisRange {
  MinXAxisTicks = 80,
  MaxXAxisTicks = 104,
  MinYAxisTicks = 80,
  MaxYAxisTicks = 200,
  MaxTicksDivisionRange = 24, // 24 hours
  CirclePointOnLine = 2,
  LineWidth = 2,
  Hieght = 533,
  CHARTXAXISTEXTPOSITION = 35,
}
// Fetal Heart Chart models end

// Cervix Chart Models begin

export class CervixChartModalPopup extends Modelpopup {
  currentTime: Date;
  yAxisPosition: number;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
}

export class DescentChartModalPopup extends Modelpopup  {
  currentTime: Date;
  yAxisPosition: number;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
}

export class CervixDescentChartWrapper extends Modelpopup   {
  cervixModal: CervixChartModalPopup;
  descentModal: DescentChartModalPopup;


}


export enum CervixDescentChartXYAxisRange {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 24,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 10,
  MaxTicksDivisionRange = 24, // 24 hours
  CirclePointOnLine = 2,
  LineWidth = 1,
  Height = 380,
  ChartXPosition = 28,
  CHARTXAXISTEXTPOSITION = 35,
  GreenChartAreaDivisionLineY1 = 203,
  GreenChartAreaLineInLoopY1 = 630,
  GreenChartAreaMax = 203,
  circlePointWidth = 4,
  InsideLineChartWidth = 2,
  // Cervix Chart External Line // plot vertical bottom main line cervix
  CervixVerticalX1 = 30,
  CervixVerticalX2 = 30,
  CervixVerticalY1 = -60,
  CervixVerticalY2 = 150,

  // Cervix Chart External Line // plot horizontal bottom base line cervix
  CervixHorizontalX1 = -15,
  CervixHorizontalX2 = 15,
  CervixHorizontalY1 = 151,
  CervixHorizontalY2 = 151,

  // Cervix External line // plot vertical top line cervix
  CervixVerticalTopY1 = -180,
  CervixVerticalTopY2 = -110,

  // Cervix External line // plot horizontal top base line cervix
  CervixVerticalTopBaseY1 = -181,
  CervixVerticalTopBaseY2 = -181,

  RedAreaLineInLoopX1 = 1259,
  RedAreaLineInLoopX2 = 432,
  RedChartAreaMax = 215,

  RedDivisionBlackLineX1 = 1055,
  RedDivisionBlackLineX2 = 425,

  YellowLineAreaMax = 412,

  DrawVDescentX1 = 65,
  DrawVDescentX2 = 65,
  DrawVDescentY1 = 25,
  DrawVDescentY2 = 102,

  DrawHDescentX1 = 55,
  DrawHDescentX2 = 72,
  DrawHDescentY1 = 102,
  DrawHDescentY2 = 102,

}
// cervix and descent end


export class ContractionModalData extends Modelpopup {
  currentTime: Date;
  contractionFrequency: number;
  frequencyList = ContractionFrequency.contractionData;
  inputBy: string;
  remarks: string;
  fId: number;
  timeZone: string;
  DisplayTime: string;
  ftList = FrequencyList.ftList;
  ftListId: number;
}

export class ContractionFrequency {

  public static contractionData: any = [
    {
      "FId": "0",
      "FName": "<20"
    },
    {
      "FId": "1",
      "FName": "20-40"
    }
    ,
    {
      "FId": "2",
      "FName": ">40"
    }


  ]

}


export enum ContractionChartScale {
  MinXAxisTicks = 1,
  MaxXAxisTicks = 24,
  MinYAxisTicks = 1,
  MaxYAxisTicks = 5,
  MaxTicksDivisionRange = 24, // 24 hours
  Hieght = 180

}

export class AmnioticMouldingList {

  public static amnioticData: any = [
    {
      "Amid": "I",
      "AmName": "Membranes Intact"
    },
    {
      "Amid": "C",
      "AmName": "Membranes-Ruptured, Clear Fuild"
    }
    ,
    {
      "Amid": "M",
      "AmName": "Meconium-stained Fuild"
    }
    ,
    {
      "Amid": "B",
      "AmName": "Blood-stained Fluid"
    }

  ]

  public static mouldingData: any = [
    //{
    //  "Mid": "-1",
    //  "MName": "-1"
    //},
    {
      "Mid": "0",
      "MName": "0"
    }
    ,
    {
      "Mid": "+1",
      "MName": "+1"
    }
    ,
    {
      "Mid": "+2",
      "MName": "+2"
    }
    ,
    {
      "Mid": "+3",
      "MName": "+3"
    }

  ]

}

export class AmnioticModalData extends Modelpopup {
  currentTime: Date;
  amninioticList = AmnioticMouldingList.amnioticData;
  inputBy: string;
  remarks: string;
  amId: string;
  timeZone: string;
  DisplayTime: string;

}

export class MouldingModalData extends Modelpopup {
  currentTime: Date;
  mouldingList = AmnioticMouldingList.mouldingData;
  inputBy: string;
  remarks: string;
  mId: string;
  timeZone: string;
  DisplayTime: string;

}

export enum AmnioticMouldingChartScale {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 12,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 1,
  MaxTicksDivisionRange = 12, // 24 hours
  Hieght = 80
}

export class OxytocinModalData extends Modelpopup {
  currentTime: Date;
  value: number;
  inputBy: string;
  remarks: string;
  chartkeyName: string;
  labelKeyName: string;
  timeZone: string;
  DisplayTime: string;
}

export enum OxitocinChartScale {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 24,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 1,
  MaxTicksDivisionRange = 24, // 24 hours
  Hieght = 110
}


export enum DrugChartScale {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 12,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 1,
  MaxTicksDivisionRange = 12, // 24 hours
  Hieght = 200
}

export class DrugModalData extends Modelpopup {
  currentTime: Date;
  value: string;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
  ListArray: any;
  IsDisable: boolean;
}

export class PulseModalData extends Modelpopup {
  currentTime: Date;
  value: number;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
}

export class BPModalData extends Modelpopup {
  currentTime: Date;
  lowerbp: string;
  upperbp: string;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
}

export class WrapperBPPulseModalData extends Modelpopup{
  bpData: BPModalData;
  pulseData: PulseModalData;
}

export enum PulseBPChartScale {
  MinXAxisTicks = 60,
  MaxXAxisTicks = 84,
  MinYAxisTicks = 60,
  MaxYAxisTicks = 180,
  MaxTicksDivisionRange = 24, // 24 hours
  Hieght = 450
}


export class TempratureModalData extends Modelpopup {
  currentTime: Date;
  value: String;
  inputBy: string;
  remarks: string;
  timeZone: string;
  DisplayTime: string;
  dtTempList = TemperatureDataList.dtTempList;
  tempName: string;
}

export class UrineAcetonVolumeModalData extends Modelpopup {
  currentTime: Date;
  value: String;
  inputBy: string;
  remarks: string;
  modalpopupKey: string;
  timeZone: string;
  DisplayTime: string;
}

export enum UrineAcetonVolumeChartScale {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 12,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 1,
  MaxTicksDivisionRange = 12, // 24 hours
  Height = 80
}

export enum TempratureChartScale {
  MinXAxisTicks = 0,
  MaxXAxisTicks = 12,
  MinYAxisTicks = 0,
  MaxYAxisTicks = 1,
  MaxTicksDivisionRange = 12, // 24 hours
  Height = 80
}

// TFSID 16646 Rizwan Khan 17 July 2020 ,Aplied class on dynamic data

export class ProteinModalData extends Modelpopup {
  currentTime: Date;
  selectList = ProteinList.ptList;
  inputBy: string;
  remarks: string;
  Id: string;
  modalpopupKey: string;
  timeZone: string;
  DisplayTime: string;

}
export class ProteinList {
  public static ptList: any = [
    {
      Id: 'Traces',
      Name: 'Traces'
    },
    {
      Id: '+1',
      Name: '+1'
    },
    {
      Id: '+2',
      Name: '+2'
    },
    {
      Id: '+3',
      Name: '+3'
    },
  ]
}

export class AcetonModalData extends Modelpopup {
  currentTime: Date;
  selectList = AcetonList.atList;
  inputBy: string;
  remarks: string;
  Id: string;
  modalpopupKey: string;
  timeZone: string;
  DisplayTime: string;

}
export class AcetonList {
  public static atList: any = [
    {
      Id: 'Present',
      Name: 'Present'
    },
    {
      Id: 'Absent',
      Name: 'Absent'
    }
  ]
}

export class FrequencyList {

  public static ftList: any = [
    {
      Id: 1,
      Name: 1
    },
    {
      Id: 2,
      Name:2
    }
    ,
    {
      Id: 3,
      Name: 3
    }
    ,
    {
      Id: 4,
      Name: 4

    }
 ,    {
      Id: 5,
      Name: 5

    }
  ]

}



export class VolumeModalData extends Modelpopup {
  currentTime: Date;
  selectList = VolumeList.vlList;
  inputBy: string;
  remarks: string;
  Id: string;
  modalpopupKey: string;
  timeZone: string;
  DisplayTime: string;

}
export class VolumeList {
  public static vlList: any = [
    {
      Id: 'Adequate',
      Name: 'Adequate'
    },
    {
      Id: 'Inadequate',
      Name: 'Inadequate'
    }
  ]
}
