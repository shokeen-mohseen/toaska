import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPreviousButtonComponent } from './next-previous-button.component';

describe('NextPreviousButtonComponent', () => {
  let component: NextPreviousButtonComponent;
  let fixture: ComponentFixture<NextPreviousButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextPreviousButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPreviousButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
