import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShipfromLocComponent } from './add-edit-shipfrom-loc.component';

describe('AddEditShipfromLocComponent', () => {
  let component: AddEditShipfromLocComponent;
  let fixture: ComponentFixture<AddEditShipfromLocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditShipfromLocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShipfromLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
