import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAlertComponent } from './show-alert.component';

describe('ShowAlertComponent', () => {
  let component: ShowAlertComponent;
  let fixture: ComponentFixture<ShowAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
