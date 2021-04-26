

export class OrganizationHierarchy {

  public ClientId: number;
  public OrganizationTypeID: number;
  public OrganizationId: number;
  public Code: string;
  PageNo: number;
  PageSize: number;
  public ID: number; // LocationUnitID
  constructor() {

    this.PageNo = 1;
    this.PageSize = 100;
  }

}
