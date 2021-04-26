import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalsetupComponent } from './hospitalsetup.component';

describe('HospitalsetupComponent', () => {
  let component: HospitalsetupComponent;
  let fixture: ComponentFixture<HospitalsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
