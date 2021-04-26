import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicsPanelComponent } from './characteristics-panel.component';

describe('CharacteristicsPanelComponent', () => {
  let component: CharacteristicsPanelComponent;
  let fixture: ComponentFixture<CharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
