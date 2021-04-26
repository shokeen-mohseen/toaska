import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FPSTimelineComponent } from './fpstimeline.component';

describe('FPSTimelineComponent', () => {
  let component: FPSTimelineComponent;
  let fixture: ComponentFixture<FPSTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FPSTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FPSTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
