import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicWebcontrolParameterComponent } from './dynamic-webcontrol-parameter.component';

describe('DynamicWebcontrolParameterComponent', () => {
  let component: DynamicWebcontrolParameterComponent;
  let fixture: ComponentFixture<DynamicWebcontrolParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicWebcontrolParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicWebcontrolParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
