import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyNotesComponent } from './baby-notes.component';

describe('BabyNotesComponent', () => {
  let component: BabyNotesComponent;
  let fixture: ComponentFixture<BabyNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BabyNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
