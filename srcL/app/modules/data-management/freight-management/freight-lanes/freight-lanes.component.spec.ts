import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightLanesComponent } from './freight-lanes.component';

describe('FreightLanesComponent', () => {
  let component: FreightLanesComponent;
  let fixture: ComponentFixture<FreightLanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightLanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightLanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
