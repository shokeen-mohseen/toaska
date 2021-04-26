import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPreferenceComponent } from './help-preference.component';

describe('HelpPreferenceComponent', () => {
  let component: HelpPreferenceComponent;
  let fixture: ComponentFixture<HelpPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
