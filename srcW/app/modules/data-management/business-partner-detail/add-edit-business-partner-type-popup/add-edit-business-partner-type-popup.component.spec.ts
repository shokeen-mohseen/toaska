import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBusinessPartnerTypePopupComponent } from './add-edit-business-partner-type-popup.component';

describe('AddEditBusinessPartnerTypePopupComponent', () => {
  let component: AddEditBusinessPartnerTypePopupComponent;
  let fixture: ComponentFixture<AddEditBusinessPartnerTypePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditBusinessPartnerTypePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBusinessPartnerTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
