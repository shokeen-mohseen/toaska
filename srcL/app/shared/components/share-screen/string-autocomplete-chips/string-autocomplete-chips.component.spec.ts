import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringAutocompleteChipsComponent } from './string-autocomplete-chips.component';

describe('StringAutocompleteChipsComponent', () => {
  let component: StringAutocompleteChipsComponent;
  let fixture: ComponentFixture<StringAutocompleteChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringAutocompleteChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringAutocompleteChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
