import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerPartnerComponent } from './edit-customer-partner.component';

describe('EditCustomerPartnerComponent', () => {
  let component: EditCustomerPartnerComponent;
  let fixture: ComponentFixture<EditCustomerPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
