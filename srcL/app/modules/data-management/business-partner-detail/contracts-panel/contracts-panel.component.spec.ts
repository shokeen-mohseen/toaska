import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsPanelComponent } from './contracts-panel.component';

describe('ContractsPanelComponent', () => {
  let component: ContractsPanelComponent;
  let fixture: ComponentFixture<ContractsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
