import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithSearchSortPaginationComponent } from './table-with-search-sort-pagination.component';

describe('TableWithSearchSortPaginationComponent', () => {
  let component: TableWithSearchSortPaginationComponent;
  let fixture: ComponentFixture<TableWithSearchSortPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableWithSearchSortPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableWithSearchSortPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
