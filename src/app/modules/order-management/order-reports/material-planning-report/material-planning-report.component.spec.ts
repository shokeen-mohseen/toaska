import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPlanningReportComponent } from './material-planning-report.component';

describe('MaterialPlanningReportComponent', () => {
  let component: MaterialPlanningReportComponent;
  let fixture: ComponentFixture<MaterialPlanningReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPlanningReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPlanningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
