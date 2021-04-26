import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAvailabilityForecastComponent } from './inventory-availability-forecast.component';

describe('InventoryAvailabilityForecastComponent', () => {
  let component: InventoryAvailabilityForecastComponent;
  let fixture: ComponentFixture<InventoryAvailabilityForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAvailabilityForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAvailabilityForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
