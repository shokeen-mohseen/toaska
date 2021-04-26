
export class PaginationModel {
  pageNo: number = 1;
  pageSize: number = 10;
  itemsLength: number;
  filterOn: string;
  sortColumn: string;
  sortOrder: string = "ASC";
  pageSizeOptions: number[] = [10,20,30,40,50];
}


