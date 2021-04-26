import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCharacteristicsPanelComponent } from './customer-characteristics-panel.component';

describe('CustomerCharacteristicsPanelComponent', () => {
  let component: CustomerCharacteristicsPanelComponent;
  let fixture: ComponentFixture<CustomerCharacteristicsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCharacteristicsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCharacteristicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
