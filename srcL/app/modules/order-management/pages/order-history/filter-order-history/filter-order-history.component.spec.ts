import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOrderHistoryComponent } from './filter-order-history.component';

describe('FilterOrderHistoryComponent', () => {
  let component: FilterOrderHistoryComponent;
  let fixture: ComponentFixture<FilterOrderHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterOrderHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
