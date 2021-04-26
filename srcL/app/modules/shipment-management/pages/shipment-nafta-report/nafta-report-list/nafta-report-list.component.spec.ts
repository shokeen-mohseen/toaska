import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaftaReportListComponent } from './nafta-report-list.component';

describe('NaftaReportListComponent', () => {
  let component: NaftaReportListComponent;
  let fixture: ComponentFixture<NaftaReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaftaReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaftaReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
