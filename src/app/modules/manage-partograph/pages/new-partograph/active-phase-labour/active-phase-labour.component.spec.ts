import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePhaseLabourComponent } from './active-phase-labour.component';

describe('ActivePhaseLabourComponent', () => {
  let component: ActivePhaseLabourComponent;
  let fixture: ComponentFixture<ActivePhaseLabourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePhaseLabourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePhaseLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
