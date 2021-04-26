import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroIndicatorComponent } from './macro-indicator.component';

describe('MacroIndicatorComponent', () => {
  let component: MacroIndicatorComponent;
  let fixture: ComponentFixture<MacroIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacroIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
