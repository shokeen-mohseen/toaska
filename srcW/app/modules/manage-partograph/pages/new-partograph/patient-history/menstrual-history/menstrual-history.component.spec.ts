import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenstrualHistoryComponent } from './menstrual-history.component';

describe('MenstrualHistoryComponent', () => {
  let component: MenstrualHistoryComponent;
  let fixture: ComponentFixture<MenstrualHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenstrualHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenstrualHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
