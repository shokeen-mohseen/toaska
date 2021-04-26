import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedOrderreportPdfComponent } from './planned-orderreport-pdf.component';

describe('PlannedOrderreportPdfComponent', () => {
  let component: PlannedOrderreportPdfComponent;
  let fixture: ComponentFixture<PlannedOrderreportPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedOrderreportPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedOrderreportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
