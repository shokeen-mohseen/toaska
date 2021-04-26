import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessPartnerComponent } from './add-business-partner.component';

describe('AddBusinessPartnerComponent', () => {
  let component: AddBusinessPartnerComponent;
  let fixture: ComponentFixture<AddBusinessPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
