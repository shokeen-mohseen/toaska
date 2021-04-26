import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmnioticMouldingchartComponent } from './amniotic-mouldingchart.component';

describe('AmnioticMouldingchartComponent', () => {
  let component: AmnioticMouldingchartComponent;
  let fixture: ComponentFixture<AmnioticMouldingchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmnioticMouldingchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmnioticMouldingchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
