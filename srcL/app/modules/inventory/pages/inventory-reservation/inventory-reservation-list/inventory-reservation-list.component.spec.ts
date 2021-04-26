import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReservationListComponent } from './inventory-reservation-list.component';

describe('InventoryReservationListComponent', () => {
  let component: InventoryReservationListComponent;
  let fixture: ComponentFixture<InventoryReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
