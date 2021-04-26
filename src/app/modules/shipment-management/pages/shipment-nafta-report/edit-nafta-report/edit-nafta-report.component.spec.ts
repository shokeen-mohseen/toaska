import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNaftaReportComponent } from './edit-nafta-report.component';

describe('EditNaftaReportComponent', () => {
  let component: EditNaftaReportComponent;
  let fixture: ComponentFixture<EditNaftaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNaftaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNaftaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
