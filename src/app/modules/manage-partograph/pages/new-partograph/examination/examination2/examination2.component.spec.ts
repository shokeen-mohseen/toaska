import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Examination2Component } from './examination2.component';

describe('Examination2Component', () => {
  let component: Examination2Component;
  let fixture: ComponentFixture<Examination2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Examination2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Examination2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
