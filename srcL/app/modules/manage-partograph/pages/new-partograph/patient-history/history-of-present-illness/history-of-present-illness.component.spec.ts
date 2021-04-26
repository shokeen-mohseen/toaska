import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOfPresentIllnessComponent } from './history-of-present-illness.component';

describe('HistoryOfPresentIllnessComponent', () => {
  let component: HistoryOfPresentIllnessComponent;
  let fixture: ComponentFixture<HistoryOfPresentIllnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryOfPresentIllnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOfPresentIllnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
