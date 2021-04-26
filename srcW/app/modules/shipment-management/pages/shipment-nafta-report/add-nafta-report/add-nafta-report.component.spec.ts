import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNaftaReportComponent } from './add-nafta-report.component';

describe('AddNaftaReportComponent', () => {
  let component: AddNaftaReportComponent;
  let fixture: ComponentFixture<AddNaftaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNaftaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNaftaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
