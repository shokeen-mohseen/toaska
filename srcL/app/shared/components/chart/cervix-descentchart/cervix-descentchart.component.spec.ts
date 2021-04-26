import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervixDescentchartComponent } from './cervix-descentchart.component';

describe('CervixDescentchartComponent', () => {
  let component: CervixDescentchartComponent;
  let fixture: ComponentFixture<CervixDescentchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CervixDescentchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervixDescentchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
