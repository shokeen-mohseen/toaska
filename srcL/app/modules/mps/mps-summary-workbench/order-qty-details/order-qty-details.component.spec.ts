import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQtyDetailsComponent } from './order-qty-details.component';

describe('OrderQtyDetailsComponent', () => {
  let component: OrderQtyDetailsComponent;
  let fixture: ComponentFixture<OrderQtyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderQtyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderQtyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
