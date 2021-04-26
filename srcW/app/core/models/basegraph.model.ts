

export class BaseChartViewModel {

  public UpdatedBy: string;
  public ID?: number;
  public CreatedBy?: string;
  public ClientId: number;
  public PatientId?: number;
  public StagesId?: number;
  public PartographId?: number;
  public SourceSystemID: number;
  
  public UpdateDateTimeBrowser?: Date;
  public PageNo: number;
  public PageSize: number;
  public xAxisPosition: string;
  public yAxisPosition: string;
  public OrganizationId: number;
  public BrowserTimeZone: string
  public mode: string;

  IsVisible: boolean;
  public IsAll: boolean;

  constructor() {
    this.PageNo = 1;
    this.PageSize = 100;
    this.IsAll = false;

  }

}

