import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalOrderSummaryComponent } from './final-order-summary.component';

describe('FinalOrderSummaryComponent', () => {
  let component: FinalOrderSummaryComponent;
  let fixture: ComponentFixture<FinalOrderSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalOrderSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
