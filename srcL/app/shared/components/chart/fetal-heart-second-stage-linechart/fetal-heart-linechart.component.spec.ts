import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetalHeartSecondPhaseLinechartComponent } from './fetal-heart-second-phase-linechart.component'

describe('FetalHeartSecondPhaseLinechartComponent', () => {
  let component: FetalHeartSecondPhaseLinechartComponent;
  let fixture: ComponentFixture<FetalHeartSecondPhaseLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FetalHeartSecondPhaseLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetalHeartSecondPhaseLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
