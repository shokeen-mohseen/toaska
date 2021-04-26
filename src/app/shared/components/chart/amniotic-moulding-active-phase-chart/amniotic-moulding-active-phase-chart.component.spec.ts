import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmnioticMouldingActivePhasechartComponent } from './amniotic-moulding-active-phase-chart.component';

describe('AmnioticMouldingActivePhasechartComponent', () => {
  let component: AmnioticMouldingActivePhasechartComponent;
  let fixture: ComponentFixture<AmnioticMouldingActivePhasechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmnioticMouldingActivePhasechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmnioticMouldingActivePhasechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
