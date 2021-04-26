import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractLineItemsComponent } from './contract-line-items.component';

describe('ContractLineItemsComponent', () => {
  let component: ContractLineItemsComponent;
  let fixture: ComponentFixture<ContractLineItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractLineItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
