import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapabilitiesListComponent } from './capabilities-list.component';

describe('CapabilitiesListComponent', () => {
  let component: CapabilitiesListComponent;
  let fixture: ComponentFixture<CapabilitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapabilitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapabilitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
