import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FPSScheduleTimelineComponent } from './fps-schedule-timeline.component';

describe('FPSScheduleTimelineComponent', () => {
  let component: FPSScheduleTimelineComponent;
  let fixture: ComponentFixture<FPSScheduleTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FPSScheduleTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FPSScheduleTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
