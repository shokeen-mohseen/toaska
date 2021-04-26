import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextContentTabComponent } from './next-content-tab.component';

describe('NextContentTabComponent', () => {
  let component: NextContentTabComponent;
  let fixture: ComponentFixture<NextContentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextContentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextContentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
