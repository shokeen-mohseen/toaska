import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpsSummaryWorkbenchComponent } from './mps-summary-workbench.component';

describe('MpsSummaryWorkbenchComponent', () => {
  let component: MpsSummaryWorkbenchComponent;
  let fixture: ComponentFixture<MpsSummaryWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpsSummaryWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpsSummaryWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
