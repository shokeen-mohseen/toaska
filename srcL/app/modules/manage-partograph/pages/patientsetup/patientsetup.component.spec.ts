import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsetupComponent } from './patientsetup.component';

describe('PatientsetupComponent', () => {
  let component: PatientsetupComponent;
  let fixture: ComponentFixture<PatientsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
