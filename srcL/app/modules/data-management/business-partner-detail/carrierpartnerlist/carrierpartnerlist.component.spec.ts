import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierpartnerlistComponent } from './carrierpartnerlist.component';

describe('CarrierpartnerlistComponent', () => {
  let component: CarrierpartnerlistComponent;
  let fixture: ComponentFixture<CarrierpartnerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierpartnerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierpartnerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
