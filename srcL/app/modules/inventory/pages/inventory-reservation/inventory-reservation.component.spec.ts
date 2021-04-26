import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReservationComponent } from './inventory-reservation.component';

describe('InventoryReservationComponent', () => {
  let component: InventoryReservationComponent;
  let fixture: ComponentFixture<InventoryReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
