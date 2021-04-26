import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipWithOrderComponent } from './ship-with-order.component';

describe('ShipWithOrderComponent', () => {
  let component: ShipWithOrderComponent;
  let fixture: ComponentFixture<ShipWithOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipWithOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipWithOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
