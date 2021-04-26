import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDailyViewListComponent } from './inventory-daily-view-list.component';

describe('InventoryDailyViewListComponent', () => {
  let component: InventoryDailyViewListComponent;
  let fixture: ComponentFixture<InventoryDailyViewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDailyViewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDailyViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
