import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPreferenceComponent } from './special-preference.component';

describe('SpecialPreferenceComponent', () => {
  let component: SpecialPreferenceComponent;
  let fixture: ComponentFixture<SpecialPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
