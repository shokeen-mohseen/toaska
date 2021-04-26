import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CervixDescentSecondPhaseComponent } from './cervix-descent-second-phase.component';

describe('CervixDescentSecondPhaseComponent', () => {
  let component: CervixDescentSecondPhaseComponent;
  let fixture: ComponentFixture<CervixDescentSecondPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CervixDescentSecondPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CervixDescentSecondPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
