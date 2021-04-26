import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPartnerByLocationComponent } from './customer-partner-by-location.component';

describe('CustomerPartnerByLocationComponent', () => {
  let component: CustomerPartnerByLocationComponent;
  let fixture: ComponentFixture<CustomerPartnerByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPartnerByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPartnerByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
