import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroIndicatorComponent } from './micro-indicator.component';

describe('MicroIndicatorComponent', () => {
  let component: MicroIndicatorComponent;
  let fixture: ComponentFixture<MicroIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
