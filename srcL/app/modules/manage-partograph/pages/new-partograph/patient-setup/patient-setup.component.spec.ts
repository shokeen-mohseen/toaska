import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSetupComponent } from './patient-setup.component';

describe('PatientSetupComponent', () => {
  let component: PatientSetupComponent;
  let fixture: ComponentFixture<PatientSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
