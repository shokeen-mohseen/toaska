import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefineCharacteristicsPanelComponent } from './add-define-characteristics-panel.component';

describe('AddDefineCharacteristicsPanelComponent', () => {
  let component: AddDefineCharacteristicsPanelComponent;
  let fixture: ComponentFixture<AddDefineCharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDefineCharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefineCharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
