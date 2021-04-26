import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerPartnerComponent } from './add-customer-partner.component';

describe('AddCustomerPartnerComponent', () => {
  let component: AddCustomerPartnerComponent;
  let fixture: ComponentFixture<AddCustomerPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
