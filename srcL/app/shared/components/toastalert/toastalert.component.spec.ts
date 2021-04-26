import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastalertComponent } from './toastalert.component';

describe('ToastalertComponent', () => {
  let component: ToastalertComponent;
  let fixture: ComponentFixture<ToastalertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastalertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
