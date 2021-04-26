import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpsSummaryComponent } from './fps-summary.component';

describe('FpsSummaryComponent', () => {
  let component: FpsSummaryComponent;
  let fixture: ComponentFixture<FpsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
