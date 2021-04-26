import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInventoryReservationComponent } from './add-edit-inventory-reservation.component';

describe('AddEditInventoryReservationComponent', () => {
  let component: AddEditInventoryReservationComponent;
  let fixture: ComponentFixture<AddEditInventoryReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInventoryReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInventoryReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
