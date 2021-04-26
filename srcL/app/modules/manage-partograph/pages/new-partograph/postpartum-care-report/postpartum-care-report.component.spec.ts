import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpartumCareReportComponent } from './postpartum-care-report.component';

describe('PostpartumCareReportComponent', () => {
  let component: PostpartumCareReportComponent;
  let fixture: ComponentFixture<PostpartumCareReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostpartumCareReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostpartumCareReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
