import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerByLocationComponent } from './business-partner-by-location.component';

describe('BusinessPartnerByLocationComponent', () => {
  let component: BusinessPartnerByLocationComponent;
  let fixture: ComponentFixture<BusinessPartnerByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPartnerByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPartnerByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
