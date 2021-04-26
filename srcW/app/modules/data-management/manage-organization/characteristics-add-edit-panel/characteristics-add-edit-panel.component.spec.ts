import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicsAddEditPanelComponent } from './characteristics-add-edit-panel.component';

describe('CharacteristicsAddEditPanelComponent', () => {
  let component: CharacteristicsAddEditPanelComponent;
  let fixture: ComponentFixture<CharacteristicsAddEditPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicsAddEditPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicsAddEditPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
