import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupfilterDdownloadReportsComponent } from './setupfilter-ddownload-reports.component';

describe('SetupfilterDdownloadReportsComponent', () => {
  let component: SetupfilterDdownloadReportsComponent;
  let fixture: ComponentFixture<SetupfilterDdownloadReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupfilterDdownloadReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupfilterDdownloadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
