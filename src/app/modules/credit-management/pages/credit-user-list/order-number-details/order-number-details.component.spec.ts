import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNumberDetailsComponent } from './order-number-details.component';

describe('OrderNumberDetailsComponent', () => {
  let component: OrderNumberDetailsComponent;
  let fixture: ComponentFixture<OrderNumberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNumberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNumberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
