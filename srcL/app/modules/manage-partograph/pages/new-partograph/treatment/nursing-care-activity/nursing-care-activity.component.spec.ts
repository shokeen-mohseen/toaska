import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingCareActivityComponent } from './nursing-care-activity.component';

describe('NursingCareActivityComponent', () => {
  let component: NursingCareActivityComponent;
  let fixture: ComponentFixture<NursingCareActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursingCareActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingCareActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
