import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingLocationComponent } from './operating-location.component';

describe('OperatingLocationComponent', () => {
  let component: OperatingLocationComponent;
  let fixture: ComponentFixture<OperatingLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
