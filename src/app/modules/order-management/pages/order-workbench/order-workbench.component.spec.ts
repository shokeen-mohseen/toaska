import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWorkbenchComponent } from './order-workbench.component';

describe('OrderWorkbenchComponent', () => {
  let component: OrderWorkbenchComponent;
  let fixture: ComponentFixture<OrderWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
