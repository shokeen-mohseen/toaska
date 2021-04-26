import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgCharacteristicsPanelComponent } from './org-characteristics-panel.component';

describe('OrgCharacteristicsPanelComponent', () => {
  let component: OrgCharacteristicsPanelComponent;
  let fixture: ComponentFixture<OrgCharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgCharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
