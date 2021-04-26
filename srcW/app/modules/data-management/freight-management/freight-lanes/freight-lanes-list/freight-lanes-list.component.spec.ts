import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightLanesListComponent } from './freight-lanes-list.component';

describe('FreightLanesListComponent', () => {
  let component: FreightLanesListComponent;
  let fixture: ComponentFixture<FreightLanesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightLanesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightLanesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
