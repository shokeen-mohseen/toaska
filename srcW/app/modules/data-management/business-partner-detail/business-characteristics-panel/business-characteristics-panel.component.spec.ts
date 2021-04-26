import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCharacteristicsPanelComponent } from './business-characteristics-panel.component';

describe('BusinessCharacteristicsPanelComponent', () => {
  let component: BusinessCharacteristicsPanelComponent;
  let fixture: ComponentFixture<BusinessCharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
