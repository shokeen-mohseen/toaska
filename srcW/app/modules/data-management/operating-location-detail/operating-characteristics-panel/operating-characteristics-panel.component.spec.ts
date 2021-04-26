import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingCharacteristicsPanelComponent } from './operating-characteristics-panel.component';

describe('OperatingCharacteristicsPanelComponent', () => {
  let component: OperatingCharacteristicsPanelComponent;
  let fixture: ComponentFixture<OperatingCharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingCharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingCharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
