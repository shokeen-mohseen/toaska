import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCapabilitiesComponent } from './filter-capabilities.component';

describe('FilterCapabilitiesComponent', () => {
  let component: FilterCapabilitiesComponent;
  let fixture: ComponentFixture<FilterCapabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
