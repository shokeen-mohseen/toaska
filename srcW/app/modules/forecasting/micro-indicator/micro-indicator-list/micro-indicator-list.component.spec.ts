import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroIndicatorListComponent } from './micro-indicator-list.component';

describe('MicroIndicatorListComponent', () => {
  let component: MicroIndicatorListComponent;
  let fixture: ComponentFixture<MicroIndicatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroIndicatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroIndicatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
