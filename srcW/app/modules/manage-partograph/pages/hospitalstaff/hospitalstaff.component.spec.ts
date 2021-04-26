import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalstaffComponent } from './hospitalstaff.component';

describe('HospitalstaffComponent', () => {
  let component: HospitalstaffComponent;
  let fixture: ComponentFixture<HospitalstaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalstaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
