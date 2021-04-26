import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDefiningCharacteristicsComponent } from './contract-defining-characteristics.component';

describe('ContractDefiningCharacteristicsComponent', () => {
  let component: ContractDefiningCharacteristicsComponent;
  let fixture: ComponentFixture<ContractDefiningCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractDefiningCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDefiningCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
