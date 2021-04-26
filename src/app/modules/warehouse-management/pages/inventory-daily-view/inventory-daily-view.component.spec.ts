import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDailyViewComponent } from './inventory-daily-view.component';

describe('InventoryDailyViewComponent', () => {
  let component: InventoryDailyViewComponent;
  let fixture: ComponentFixture<InventoryDailyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDailyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDailyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
