import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroIndicatorListComponent } from './macro-indicator-list.component';

describe('MacroIndicatorListComponent', () => {
  let component: MacroIndicatorListComponent;
  let fixture: ComponentFixture<MacroIndicatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacroIndicatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroIndicatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
