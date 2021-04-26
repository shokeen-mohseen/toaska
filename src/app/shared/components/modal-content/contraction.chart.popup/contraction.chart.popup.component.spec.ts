import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractionModalPopUpComponent } from './contraction.chart.popup.component';

describe('Contraction.Model.ChartComponent', () => {
  let component: ContractionModalPopUpComponent;
  let fixture: ComponentFixture<ContractionModalPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractionModalPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractionModalPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
