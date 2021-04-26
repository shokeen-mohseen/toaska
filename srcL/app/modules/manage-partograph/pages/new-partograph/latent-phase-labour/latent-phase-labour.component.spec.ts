import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatentPhaseLabourComponent } from './latent-phase-labour.component';

describe('LatentPhaseLabourComponent', () => {
  let component: LatentPhaseLabourComponent;
  let fixture: ComponentFixture<LatentPhaseLabourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatentPhaseLabourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatentPhaseLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
