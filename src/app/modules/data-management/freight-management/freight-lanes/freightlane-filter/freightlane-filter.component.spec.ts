import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightlaneFilterComponent } from './freightlane-filter.component';

describe('FreightlaneFilterComponent', () => {
  let component: FreightlaneFilterComponent;
  let fixture: ComponentFixture<FreightlaneFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightlaneFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightlaneFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
