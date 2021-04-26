import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsChartSecondStageComponent } from './drugs.chart-second-stage.component';

describe('DrugsChartSecondStageComponent', () => {
  let component: DrugsChartSecondStageComponent;
  let fixture: ComponentFixture<DrugsChartSecondStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugsChartSecondStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsChartSecondStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
