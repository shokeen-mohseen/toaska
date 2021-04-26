import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetalHeartActivePhaseLinechartComponent } from './fetal-heart-active-phase-linechart.component';

describe('FetalHeartActivePhaseLinechartComponent', () => {
  let component: FetalHeartActivePhaseLinechartComponent;
  let fixture: ComponentFixture<FetalHeartActivePhaseLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FetalHeartActivePhaseLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetalHeartActivePhaseLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
