import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Examination1Component } from './examination1.component';

describe('Examination1Component', () => {
  let component: Examination1Component;
  let fixture: ComponentFixture<Examination1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Examination1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Examination1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
