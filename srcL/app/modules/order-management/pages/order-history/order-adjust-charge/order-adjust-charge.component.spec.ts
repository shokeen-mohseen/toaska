import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdjustChargeComponent } from './order-adjust-charge.component';

describe('OrderAdjustChargeComponent', () => {
  let component: OrderAdjustChargeComponent;
  let fixture: ComponentFixture<OrderAdjustChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAdjustChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAdjustChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
